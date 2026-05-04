<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { STRIPE_PUBLISHABLE_KEY } from '$lib/stripe';
	import type { ProductConfig, SwatchOption } from '$lib/data/shopProducts';

	let { product } = $props<{ product: ProductConfig }>();

	// We store the currently-selected option for each group in one object so the UI, price display,
	// and checkout payload all read from the exact same source of truth.
	const initialSelections = untrack(() =>
		Object.fromEntries(product.optionGroups.map((group) => [group.id, group.options[0]])) as Record<string, SwatchOption>
	);

	let selections = $state<Record<string, SwatchOption>>(initialSelections);
	let uploadedImage = $state<string | null>(null);
	let uploadedArtworkName = $state('');
	let uploadedArtworkMeta = $state('');
	let imagePosition = $state(untrack(() => ({ ...product.artworkPosition })));
	let imageScale = $state(1);
	let quantity = $state(1);
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	let previewRef = $state<HTMLDivElement | null>(null);
	let buyButtonRef = $state<HTMLButtonElement | null>(null);
	let liveRegionRef = $state<HTMLParagraphElement | null>(null);
	let errorRegionRef = $state<HTMLDivElement | null>(null);
	let isDragOver = $state(false);
	let isCheckingOut = $state(false);
	let liveMessage = $state('');
	let errorMessage = $state('');

	let validationWarnings = $state<string[]>([]);
	let isValidating = $state(false);

	// Total unit price is derived from the base price plus every selected option modifier.
	// Keeping this calculation derived avoids price drift between the UI and the checkout request.
	let unitPrice = $derived(
		product.basePrice + Object.values(selections).reduce((sum, option) => sum + option.priceMod, 0)
	);
	let orderTotal = $derived(unitPrice * quantity);
	let colorSelection = $derived(selections.color?.label ?? 'Default');
	let sizeSelection = $derived(selections.size?.label ?? 'Standard');

	function announce(message: string) {
		// Screen readers only announce live-region changes when the text actually changes.
		// Clearing first makes repeated messages reliably speak instead of getting swallowed.
		liveMessage = '';
		setTimeout(() => {
			liveMessage = message;
		}, 20);
	}

	function setError(message: string) {
		errorMessage = message;
		announce(message);
		setTimeout(() => errorRegionRef?.focus(), 0);
	}

	function clearError() {
		errorMessage = '';
	}

	function chooseOption(groupId: string, option: SwatchOption) {
		selections[groupId] = option;
		clearError();
		announce(`${groupId.replace('-', ' ')} set to ${option.label}.`);
	}

	async function handleFileUpload(file: File) {
		if (!file.type.startsWith('image/')) {
			setError('Please upload an image file for the artwork preview.');
			return;
		}

		// ─── Quality Gate: validate artwork and warn, don't block ───
		// V1 policy: show clear messaging, let customer proceed anyway.
		// We track ignored warnings for V2 hard-block promotion.
		isValidating = true;
		announce(`Checking image quality for ${product.name}...`);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('productType', product.slug);

			const response = await fetch('/api/validate-artwork', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();

			// V1: always accept the file, but show warnings
			validationWarnings = result.warnings || [];
			if (validationWarnings.length > 0) {
				announce(`Image uploaded with ${validationWarnings.length} quality warning${validationWarnings.length > 1 ? 's' : ''}. You can still proceed.`);
			} else {
				announce(`Image looks great! No quality concerns.`);
			}

			// Track ignored warnings for analytics (V2 promotion)
			if (result.ignoredWarningCount > 0) {
				console.log('[Quality Gate] Warnings ignored:', result.ignoredWarningCount, 'for', product.slug);
			}

		} catch (err) {
			// Network or server error — don't block upload, just warn
			console.warn('Validation endpoint unavailable:', err);
			validationWarnings = ['We couldn\'t check image quality. Make sure your image is high-resolution for best prints.'];
		}

		isValidating = false;

		const reader = new FileReader();
		reader.onload = (event) => {
			uploadedImage = event.target?.result as string;
			uploadedArtworkName = file.name;
			uploadedArtworkMeta = `${file.type}, ${Math.round(file.size / 1024)} KB`;
			clearError();
		};
		reader.readAsDataURL(file);
	}

	function onFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFileUpload(file);
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function onDragLeave() {
		isDragOver = false;
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		const file = event.dataTransfer?.files[0];
		if (file) handleFileUpload(file);
	}

	function startDrag(event: MouseEvent | TouchEvent) {
		if (!uploadedImage) return;
		isDragging = true;
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		dragStart = { x: clientX, y: clientY };
	}

	function onDragMove(event: MouseEvent | TouchEvent) {
		if (!isDragging || !previewRef) return;
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		const rect = previewRef.getBoundingClientRect();
		const deltaX = ((clientX - dragStart.x) / rect.width) * 100;
		const deltaY = ((clientY - dragStart.y) / rect.height) * 100;

		imagePosition.x = Math.max(5, Math.min(95, imagePosition.x + deltaX));
		imagePosition.y = Math.max(5, Math.min(95, imagePosition.y + deltaY));
		dragStart = { x: clientX, y: clientY };
	}

	function endDrag() {
		if (isDragging) {
			announce(`Artwork moved to ${Math.round(imagePosition.x)} percent horizontal and ${Math.round(imagePosition.y)} percent vertical.`);
		}
		isDragging = false;
	}

	function handleArtworkKey(event: KeyboardEvent) {
		if (!uploadedImage) return;
		const step = event.shiftKey ? 5 : 1;

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				imagePosition.x = Math.max(5, imagePosition.x - step);
				break;
			case 'ArrowRight':
				event.preventDefault();
				imagePosition.x = Math.min(95, imagePosition.x + step);
				break;
			case 'ArrowUp':
				event.preventDefault();
				imagePosition.y = Math.max(5, imagePosition.y - step);
				break;
			case 'ArrowDown':
				event.preventDefault();
				imagePosition.y = Math.min(95, imagePosition.y + step);
				break;
			default:
				return;
		}

		announce(`Artwork position ${Math.round(imagePosition.x)} by ${Math.round(imagePosition.y)} percent.`);
	}

	function handleScaleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		imageScale = parseFloat(input.value);
		announce(`Artwork size set to ${Math.round(imageScale * 100)} percent.`);
	}

	function handleQuantityChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const nextQuantity = Math.max(1, Math.min(99, Number.parseInt(input.value || '1', 10) || 1));
		quantity = nextQuantity;
		announce(`Quantity set to ${quantity}.`);
	}

	async function buyNow() {
		clearError();

		if (!uploadedImage) {
			setError('Upload artwork before starting checkout.');
			return;
		}

		isCheckingOut = true;
		announce('Preparing secure Stripe Checkout.');

		try {
			// We load Stripe.js even though the redirect uses the server-returned session URL.
			// That gives the page an early publishable-key validation point and keeps Stripe's client script warm.
			await loadStripe(STRIPE_PUBLISHABLE_KEY);

			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					productType: product.slug,
					productName: product.name,
					size: sizeSelection,
					color: colorSelection,
					quantity,
					artworkReference: `${uploadedArtworkName} (${uploadedArtworkMeta})`,
					unitAmountCents: unitPrice * 100,
					selectedOptions: Object.fromEntries(
						Object.entries(selections).map(([groupId, option]) => [groupId, option.label])
					),
					cancelPath: `/shop/${product.slug}?checkout=cancelled`
				})
			});

			const payload = await response.json();

			if (!response.ok || !payload.url) {
				throw new Error(payload?.error ?? 'Stripe Checkout could not be started.');
			}

			announce('Redirecting to Stripe Checkout.');
			window.location.assign(payload.url);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something went wrong while starting checkout.');
			isCheckingOut = false;
			setTimeout(() => buyButtonRef?.focus(), 0);
		}
	}

	onMount(() => {
		const move = (event: MouseEvent | TouchEvent) => onDragMove(event);
		const up = () => endDrag();
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', up);
		window.addEventListener('touchmove', move, { passive: false });
		window.addEventListener('touchend', up);

		// Cancel returns land back on the product page with a query flag.
		// We announce that state and restore focus to the primary checkout action so keyboard users
		// don't have to hunt around after returning from Stripe.
		const params = new URLSearchParams(window.location.search);
		if (params.get('checkout') === 'cancelled') {
			announce('Checkout was canceled. You are back on the product page.');
			setTimeout(() => buyButtonRef?.focus(), 0);
		}

		return () => {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', up);
			window.removeEventListener('touchmove', move);
			window.removeEventListener('touchend', up);
		};
	});
</script>

<svelte:head>
	<title>{product.name} | Triple B Prints</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="bg-slate-900 text-slate-400 py-4">
	<div class="max-w-6xl mx-auto px-6">
		<a href="/" class="hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-sm">← Back to Home</a>
	</div>
</div>

<section class="py-12 bg-white">
	<div class="max-w-6xl mx-auto px-6">
		<p bind:this={liveRegionRef} class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>

		<div class="grid md:grid-cols-2 gap-12">
			<div class="space-y-6">
				<h1 class="text-3xl font-black text-slate-900">{product.name}</h1>
				<p class="text-slate-600">{product.description}</p>

				<div
					bind:this={previewRef}
					class="relative bg-slate-100 rounded-2xl overflow-hidden shadow-lg select-none"
					style="aspect-ratio: 1;"
					role="img"
					aria-label={`${product.name} preview with current artwork placement.`}
				>
					<img src={product.image} alt={product.imageAlt} class="w-full h-full object-cover" />

					{#if selections.color?.hex}
						<div class="absolute inset-0 mix-blend-multiply pointer-events-none opacity-30" style={`background-color: ${selections.color.hex};`}></div>
					{/if}

					{#if uploadedImage}
						<div
							class="absolute cursor-move touch-none focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
							style={`left: ${imagePosition.x}%; top: ${imagePosition.y}%; transform: translate(-50%, -50%) scale(${imageScale});`}
							onmousedown={startDrag}
							ontouchstart={startDrag}
							role="button"
							aria-label="Uploaded artwork preview. Drag it or use arrow keys to move it. Hold Shift with arrow keys for larger moves."
							tabindex="0"
							onkeydown={handleArtworkKey}
						>
							<img
								src={uploadedImage}
								alt={`Uploaded artwork preview: ${uploadedArtworkName}`}
								class="w-32 h-32 object-contain pointer-events-none"
								style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));"
							/>
						</div>
					{:else}
						<div class="absolute inset-0 flex items-center justify-center px-6 text-center">
							<p class="text-slate-400 font-medium">{product.previewEmptyText}</p>
						</div>
					{/if}
				</div>

				{#if uploadedImage}
					<div class="bg-slate-50 rounded-xl p-4">
						<label class="block text-sm font-bold text-slate-700 mb-2" for="scale-slider">
							Artwork Size: {Math.round(imageScale * 100)}%
						</label>
						<input
							id="scale-slider"
							type="range"
							min="0.5"
							max={product.artworkMaxScale ?? 2}
							step="0.1"
							value={imageScale}
							oninput={handleScaleChange}
							class="w-full accent-rose-600"
							aria-label="Adjust artwork size"
						/>
						<p class="text-xs text-slate-500 mt-1">Drag the artwork to move it. Focus the artwork itself, then use arrow keys for fine control.</p>
					</div>
				{/if}
			</div>

			<div class="space-y-8">
				<div class="bg-yellow-50 rounded-2xl p-6" aria-live="polite" aria-atomic="true">
					<p class="text-sm text-slate-600 font-medium mb-1">Order Summary</p>
					<p class="text-4xl font-black text-slate-900">${orderTotal}</p>
					<p class="text-sm text-slate-500 mt-1">Unit price: ${unitPrice} × Quantity: {quantity}</p>
				</div>

				{#each product.optionGroups as group}
					<fieldset class="space-y-3">
						<legend class="text-lg font-bold text-slate-900">{group.label}</legend>
						<p class="text-sm text-slate-500">{group.helperText}</p>

						{#if group.render === 'swatch'}
							<div class="flex flex-wrap gap-3">
								{#each group.options as option}
									<button
										type="button"
										class={`w-12 h-12 rounded-full border-4 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400 ${selections[group.id]?.label === option.label ? 'border-yellow-400 scale-110' : 'border-transparent hover:scale-105'}`}
										style={`background-color: ${option.hex};`}
										onclick={() => chooseOption(group.id, option)}
										aria-pressed={selections[group.id]?.label === option.label}
										aria-label={`${group.label}: ${option.label}${option.priceMod > 0 ? `, adds $${option.priceMod}` : ''}`}
									></button>
								{/each}
							</div>
						{:else}
							<div class="flex flex-wrap gap-2">
								{#each group.options as option}
									<button
										type="button"
										class={`px-4 py-2 rounded-lg font-bold transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400 ${selections[group.id]?.label === option.label ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
										onclick={() => chooseOption(group.id, option)}
										aria-pressed={selections[group.id]?.label === option.label}
										aria-label={`${group.label}: ${option.label}${option.priceMod > 0 ? `, adds $${option.priceMod}` : ''}`}
									>
										{option.label}
										{#if option.priceMod > 0}
											<span class="text-xs ml-1 opacity-70">+${option.priceMod}</span>
										{/if}
									</button>
								{/each}
							</div>
						{/if}

						<p class="text-sm text-slate-600 font-medium">Selected: {selections[group.id]?.label}</p>
					</fieldset>
				{/each}

				<div>
					<label class="block text-lg font-bold text-slate-900 mb-3" for="quantity">Quantity</label>
					<input
						id="quantity"
						type="number"
						min="1"
						max="99"
						inputmode="numeric"
						value={quantity}
						oninput={handleQuantityChange}
						class="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-yellow-400"
						aria-describedby="quantity-help"
					/>
					<p id="quantity-help" class="text-sm text-slate-500 mt-2">Choose how many of this configured item you want to order.</p>
				</div>

				<div>
					<h2 class="text-lg font-bold text-slate-900 mb-3" id="upload-label">Your Artwork</h2>
					<label
						class={`block w-full border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer focus-within:ring-4 focus-within:ring-yellow-400 ${isDragOver ? 'border-rose-600 bg-rose-50' : 'border-slate-300 hover:border-yellow-400 hover:bg-yellow-50'}`}
						ondragover={onDragOver}
						ondragleave={onDragLeave}
						ondrop={onDrop}
						aria-labelledby="upload-label"
					>
						<input
							type="file"
							accept="image/png,image/jpeg,image/svg+xml,image/webp"
							class="sr-only"
							onchange={onFileInput}
							aria-label="Upload your artwork image"
						/>
						<svg class="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
						<p class="font-bold text-slate-700">Click to upload or drag and drop</p>
						<p class="text-sm text-slate-500 mt-1">PNG, JPG, SVG, or WEBP. The upload is used as the checkout artwork reference.</p>
					</label>

					{#if isValidating}
						<p class="text-sm text-yellow-600 font-medium mt-2" role="status" aria-live="polite">
							<span class="inline-block animate-spin mr-1">⟳</span> Checking image quality...
						</p>
					{:else if uploadedImage}
						<p class="text-sm text-green-600 font-medium mt-2" role="status" aria-live="polite">
							✓ Artwork uploaded: {uploadedArtworkName}
						</p>
					{/if}

					{#if validationWarnings.length > 0}
						<div class="mt-3 rounded-lg border border-yellow-400/30 bg-yellow-50 p-3" role="region" aria-label="Image quality warnings">
							<p class="text-sm font-semibold text-yellow-800 mb-1">⚠ Quality warnings:</p>
							<ul class="text-sm text-yellow-700 space-y-1">
								{#each validationWarnings as warning}
									<li>{warning}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>

				{#if errorMessage}
					<div bind:this={errorRegionRef} tabindex="-1" role="alert" class="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
						<p class="font-bold">Checkout needs one quick fix</p>
						<p>{errorMessage}</p>
					</div>
				{/if}

				<button
					bind:this={buyButtonRef}
					type="button"
					class={`w-full font-black uppercase tracking-wide py-4 rounded-xl shadow-lg transition-all text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 ${uploadedImage && !isCheckingOut ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 hover:scale-105' : 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70'}`}
					disabled={!uploadedImage || isCheckingOut}
					onclick={buyNow}
					aria-label={uploadedImage ? `Buy ${quantity} ${product.name} item${quantity > 1 ? 's' : ''} now for ${orderTotal} dollars with Stripe Checkout` : 'Upload artwork to enable Buy Now'}
					aria-busy={isCheckingOut}
				>
					{#if isCheckingOut}
						Starting Checkout…
					{:else}
						Buy Now — ${orderTotal}
					{/if}
				</button>

				<p class="text-sm text-slate-500 text-center" aria-live="polite">
					{uploadedImage ? 'You will be redirected to Stripe Checkout to finish payment securely.' : 'Upload artwork to enable Buy Now.'}
				</p>
			</div>
		</div>
	</div>
</section>

<footer class="bg-slate-900 text-white py-12 mt-12">
	<div class="max-w-6xl mx-auto px-6 text-center">
		<p class="text-slate-400">© {new Date().getFullYear()} Triple B Prints. Checkout-ready configurator.</p>
	</div>
</footer>
