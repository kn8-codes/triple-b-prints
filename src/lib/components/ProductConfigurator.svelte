<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { STRIPE_PUBLISHABLE_KEY } from '$lib/stripe';
	import {
		ACCEPTED_ARTWORK_MIME_TYPES,
		buildArtworkReference,
		clampQuantity,
		formatArtworkFileMeta,
		validateArtworkFile
	} from '$lib/configurator';
	import type { OptionGroup, ProductConfig, SwatchOption } from '$lib/data/shopProducts';

	let { product } = $props<{ product: ProductConfig }>();

	// We store the currently-selected option for each group in one object so the UI, price display,
	// and checkout payload all read from the exact same source of truth.
	const initialSelections = untrack(() =>
		Object.fromEntries(product.optionGroups.map((group: OptionGroup) => [group.id, group.options[0]])) as Record<string, SwatchOption>
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
	let validationMessage = $state('');
	let isValidatingArtwork = $state(false);

	// Total unit price is derived from the base price plus every selected option modifier.
	// Keeping this calculation derived avoids price drift between the UI and the checkout request.
	let unitPrice = $derived(
		product.basePrice + Object.values(selections).reduce((sum, option) => sum + option.priceMod, 0)
	);
	let orderTotal = $derived(unitPrice * quantity);
	let colorSelection = $derived(selections.color?.label ?? 'Default');
	let sizeSelection = $derived(selections.size?.label ?? 'Standard');
	let printSelection = $derived(selections['print-location']?.label ?? 'Standard print');

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
		const validation = validateArtworkFile(file);
		if (!validation.ok) {
			setError(validation.message);
			return;
		}

		isValidatingArtwork = true;
		validationWarnings = [];
		validationMessage = '';
		announce(`Checking image quality for ${product.name}.`);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('productType', product.slug);

			const response = await fetch('/api/validate-artwork', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			validationWarnings = Array.isArray(result?.warnings) ? result.warnings : [];
			validationMessage = typeof result?.message === 'string' ? result.message : '';
		} catch {
			validationWarnings = ['We could not check image quality right now. Use a high-resolution source if you have one.'];
			validationMessage = 'Artwork uploaded, but the quality gate was unavailable.';
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			uploadedImage = event.target?.result as string;
			uploadedArtworkName = file.name;
			uploadedArtworkMeta = formatArtworkFileMeta(file);
			clearError();
			announce(
				validationWarnings.length > 0
					? `Artwork uploaded with ${validationWarnings.length} quality warning${validationWarnings.length > 1 ? 's' : ''}. You can still proceed.`
					: `Artwork uploaded: ${file.name}. Quality check looks good.`
			);
			isValidatingArtwork = false;
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
		const nextQuantity = clampQuantity(Number.parseInt(input.value || '1', 10) || 1);
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
		if (validationWarnings.length > 0) {
			console.log('[Quality Gate] proceeding with warnings', {
				product: product.slug,
				warningCount: validationWarnings.length,
				warnings: validationWarnings
			});
		}
		announce('Preparing secure Stripe Checkout.');

		try {
			if (!STRIPE_PUBLISHABLE_KEY) {
				throw new Error('Stripe is not configured yet. Add PUBLIC_STRIPE_PUBLISHABLE_KEY before using checkout.');
			}

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

<div class="bg-[#07090f] text-cyan-100/80 py-4 border-b border-white/10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6">
		<a href="/" class="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-[#d8ff3e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#d8ff3e]">← Back to Studio</a>
	</div>
</div>

<section class="relative overflow-hidden bg-[#07090f] py-10 text-white sm:py-14">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(62,230,255,0.18),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(216,255,62,0.12),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.35),rgba(3,7,18,1))]"></div>
	<div class="pointer-events-none absolute left-1/2 top-24 hidden -translate-x-1/2 select-none text-[15vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.035] lg:block">
		{product.name}
	</div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6">
		<p bind:this={liveRegionRef} class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>

		<div class="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:items-start">
			<div class="space-y-6">
				<div class="max-w-2xl">
					<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Print Studio / Live Configurator</p>
					<h1 class="text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{product.name}</h1>
					<p class="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{product.description}</p>
					<div class="mt-5 flex flex-wrap gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-cyan-100/80" aria-label="Configurator workflow">
						<span class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">1 / Pick base</span>
						<span class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">2 / Upload art</span>
						<span class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">3 / Proof layout</span>
						<span class="rounded-full border border-[#d8ff3e]/25 bg-[#d8ff3e]/10 px-3 py-2 text-[#d8ff3e]">4 / Checkout</span>
					</div>
				</div>

				<div class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur">
					<div class="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">
						<span>Live mockup stage</span>
						<span class="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[#d8ff3e]">Template preview</span>
					</div>
					<div
						bind:this={previewRef}
						class="relative isolate overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_42%),linear-gradient(180deg,#111827,#030712)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] select-none"
						style="aspect-ratio: 1;"
						role="img"
						aria-label={`${product.name} preview with current artwork placement.`}
					>
						<div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:36px_36px]"></div>
						<div class="absolute inset-x-8 top-8 h-px bg-cyan-200/30"></div>
						<div class="absolute inset-y-10 left-8 w-px bg-cyan-200/20"></div>
						<div class="absolute inset-y-10 right-8 w-px bg-cyan-200/20"></div>
						<div class="absolute bottom-8 left-8 right-8 h-px bg-cyan-200/20"></div>
						<div class="absolute left-10 top-10 z-20 text-[0.65rem] font-black uppercase tracking-[0.24em] text-cyan-100/70">Registration guide</div>
						<div class="absolute right-10 top-10 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-300 backdrop-blur">{colorSelection}</div>
						<img src={product.image} alt={product.imageAlt} class="h-full w-full object-cover opacity-95 mix-blend-screen" />

						{#if selections.color?.hex}
							<div class="absolute inset-0 mix-blend-multiply pointer-events-none opacity-35" style={`background-color: ${selections.color.hex};`}></div>
						{/if}

						<div class="pointer-events-none absolute left-1/2 top-[48%] h-[34%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-dashed border-cyan-200/50 bg-cyan-300/5 shadow-[0_0_40px_rgba(34,211,238,0.12)]"></div>

						{#if uploadedImage}
							<div
								class="absolute z-20 cursor-move touch-none rounded-md focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]"
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
									class="h-28 w-28 object-contain pointer-events-none sm:h-36 sm:w-36"
									style="filter: drop-shadow(0 10px 18px rgba(0,0,0,0.45));"
								/>
							</div>
						{:else}
							<div class="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
								<div class="max-w-xs rounded-2xl border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/30 backdrop-blur">
									<p class="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Drop art here</p>
									<p class="mt-2 text-sm text-slate-300">{product.previewEmptyText}</p>
									<p class="mt-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#d8ff3e]">Template proof preview</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-3">
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">Base</p>
						<p class="mt-1 font-black text-white">{sizeSelection} / {colorSelection}</p>
					</div>
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">Placement</p>
						<p class="mt-1 font-black text-white">{printSelection}</p>
					</div>
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">Proof</p>
						<p class="mt-1 font-black text-white">{uploadedImage ? 'Artwork staged' : 'Waiting on art'}</p>
					</div>
				</div>

				{#if uploadedImage}
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
						<label class="mb-2 block text-sm font-black uppercase tracking-[0.18em] text-cyan-100" for="scale-slider">
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
							class="w-full min-h-11 accent-cyan-300"
							aria-label="Adjust artwork size"
						/>
						<p class="mt-1 text-sm text-slate-400">Drag artwork to position. Focus the artwork itself, then use arrow keys for fine control.</p>
					</div>
				{/if}
			</div>

			<aside class="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
				<div class="mb-7 rounded-2xl border border-[#d8ff3e]/20 bg-[#d8ff3e]/10 p-5" aria-live="polite" aria-atomic="true">
					<p class="text-xs font-black uppercase tracking-[0.22em] text-[#d8ff3e]">Order Summary</p>
					<p class="mt-1 text-5xl font-black tracking-[-0.08em] text-white">${orderTotal}</p>
					<p class="mt-2 text-sm text-slate-300">Unit price: ${unitPrice} × Quantity: {quantity}</p>
				</div>

				<div class="space-y-7">
					{#each product.optionGroups as group}
						<fieldset class="space-y-3">
							<legend class="text-sm font-black uppercase tracking-[0.2em] text-slate-200">{group.label}</legend>
							<p class="text-sm text-slate-400">{group.helperText}</p>

							{#if group.render === 'swatch'}
								<div class="flex flex-wrap gap-3">
									{#each group.options as option}
										<button
											type="button"
											class={`h-12 w-12 rounded-full border-4 shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${selections[group.id]?.label === option.label ? 'border-[#d8ff3e] scale-110' : 'border-white/10 hover:scale-105'}`}
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
											class={`min-h-11 rounded-xl border px-4 py-2.5 font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${selections[group.id]?.label === option.label ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-200/60 hover:bg-cyan-200/10'}`}
											onclick={() => chooseOption(group.id, option)}
											aria-pressed={selections[group.id]?.label === option.label}
											aria-label={`${group.label}: ${option.label}${option.priceMod > 0 ? `, adds $${option.priceMod}` : ''}`}
										>
											{option.label}
											{#if option.priceMod > 0}
												<span class="ml-1 text-xs opacity-70">+${option.priceMod}</span>
											{/if}
										</button>
									{/each}
								</div>
							{/if}

							<p class="text-sm font-bold text-cyan-100">Selected: {selections[group.id]?.label}</p>
						</fieldset>
					{/each}

					<div>
						<label class="mb-3 block text-sm font-black uppercase tracking-[0.2em] text-slate-200" for="quantity">Quantity</label>
						<input
							id="quantity"
							type="number"
							min="1"
							max="99"
							inputmode="numeric"
							value={quantity}
							oninput={handleQuantityChange}
							class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]"
							aria-describedby="quantity-help"
						/>
						<p id="quantity-help" class="mt-2 text-sm text-slate-400">Choose how many of this configured item you want to order.</p>
					</div>

					<div>
						<h2 class="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-200" id="upload-label">Your Artwork</h2>
						<label
							class={`block w-full cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all focus-within:ring-4 focus-within:ring-[#d8ff3e] ${isDragOver ? 'border-cyan-200 bg-cyan-200/10' : 'border-white/15 bg-black/20 hover:border-[#d8ff3e]/70 hover:bg-[#d8ff3e]/10'}`}
							ondragover={onDragOver}
							ondragleave={onDragLeave}
							ondrop={onDrop}
							aria-labelledby="upload-label"
						>
							<input
								type="file"
								accept={ACCEPTED_ARTWORK_MIME_TYPES.join(',')}
								class="sr-only"
								onchange={onFileInput}
								aria-label="Upload your artwork image"
							/>
							<svg class="mx-auto mb-2 h-10 w-10 text-cyan-100/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							<p class="text-lg font-black text-white">Click to upload or drag and drop</p>
							<p class="mt-1 text-sm text-slate-400">PNG, JPG, SVG, or WEBP. The configurator checks source quality before checkout.</p>
						</label>

						{#if uploadedImage}
							<p class="mt-2 text-sm font-medium text-emerald-300" role="status" aria-live="polite">
								✓ Artwork uploaded: {uploadedArtworkName}
							</p>
						{/if}

						{#if isValidatingArtwork}
							<p class="mt-2 text-sm font-medium text-[#d8ff3e]" role="status" aria-live="polite">
								Checking image quality…
							</p>
						{/if}

						{#if validationMessage}
							<p class="mt-2 text-sm text-slate-300" aria-live="polite">{validationMessage}</p>
						{/if}

						{#if validationWarnings.length > 0}
							<div class="mt-3 rounded-xl border border-[#d8ff3e]/30 bg-[#d8ff3e]/10 p-4 text-[#f4f5f2]">
								<p class="font-bold text-[#d8ff3e]">Image quality warnings</p>
								<ul class="mt-2 list-disc space-y-2 pl-5 text-sm">
									{#each validationWarnings as warning}
										<li>{warning}</li>
									{/each}
								</ul>
								<p class="mt-3 text-sm text-slate-300">You can still proceed, but this gate is trying to keep weak source images out of production.</p>
							</div>
						{/if}
					</div>

					{#if errorMessage}
						<div bind:this={errorRegionRef} tabindex="-1" role="alert" class="rounded-xl border border-red-300/40 bg-red-500/10 p-4 text-red-100">
							<p class="font-bold">Checkout needs one quick fix</p>
							<p>{errorMessage}</p>
						</div>
					{/if}

					<button
						bind:this={buyButtonRef}
						type="button"
						class={`w-full rounded-2xl py-4 text-lg font-black uppercase tracking-[0.16em] shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${uploadedImage && !isCheckingOut ? 'bg-[#d8ff3e] text-slate-950 hover:bg-yellow-200 hover:scale-[1.01]' : 'bg-white/10 text-slate-500 cursor-not-allowed opacity-70'}`}
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

					<p class="text-center text-sm text-slate-400" aria-live="polite">
						{uploadedImage ? 'You will be redirected to Stripe Checkout to finish payment securely.' : 'Upload artwork to enable Buy Now.'}
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

<footer class="border-t border-white/10 bg-[#07090f] py-12 text-white">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6">
		<p class="text-slate-400">© {new Date().getFullYear()} Triple B Prints. Checkout-ready configurator.</p>
	</div>
</footer>
