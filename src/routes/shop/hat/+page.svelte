<script lang="ts">
	import { onMount } from 'svelte';

	// ─── Product Data ───
	const product = {
		name: 'Custom Hat',
		basePrice: 22,
		description: 'Snapback, dad hat, or trucker. Your artwork embroidered or printed. Adjustable fit.',
		image: 'https://placehold.co/600x700/1e293b/ffffff?text=Hat+Base'
	};

	// ─── Style Options ───
	const styles = [
		{ label: 'Snapback', priceMod: 0 },
		{ label: 'Dad Hat', priceMod: 0 },
		{ label: 'Trucker', priceMod: 2 },
		{ label: 'Beanie', priceMod: -2 }
	];

	// ─── Color Options ───
	const colors = [
		{ name: 'Black', hex: '#1a1a1a' },
		{ name: 'Navy', hex: '#1e3a5f' },
		{ name: 'Red', hex: '#cc0000' },
		{ name: 'White', hex: '#f5f5f5' },
		{ name: 'Camo', hex: '#4a5d23' }
	];

	// ─── Print Method ───
	const methods = [
		{ label: 'Embroidery', priceMod: 0 },
		{ label: 'Screen Print', priceMod: 3 }
	];

	// ─── State (Svelte 5 Runes) ───
	let selectedStyle = $state(styles[0]);
	let selectedColor = $state(colors[0]);
	let selectedMethod = $state(methods[0]);
	let uploadedImage = $state<string | null>(null);
	let imagePosition = $state({ x: 50, y: 50 });
	let imageScale = $state(1);
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	let previewRef = $state<HTMLDivElement | null>(null);
	let isDragOver = $state(false);
	let addedToCart = $state(false);

	// ─── Derived Price ───
	let totalPrice = $derived(product.basePrice + selectedStyle.priceMod + selectedMethod.priceMod);

	// ─── File Upload ───
	function handleFileUpload(file: File) {
		if (!file.type.startsWith('image/')) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			uploadedImage = e.target?.result as string;
			addedToCart = false;
		};
		reader.readAsDataURL(file);
	}

	function onFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFileUpload(file);
	}

	// ─── Drag & Drop ───
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

	// ─── Artwork Drag Positioning ───
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
		isDragging = false;
	}

	// ─── Keyboard Navigation ───
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
		}
	}

	// ─── Scale ───
	function handleScaleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		imageScale = parseFloat(input.value);
	}

	// ─── Add to Cart ───
	function addToCart() {
		if (!uploadedImage) return;
		addedToCart = true;
		setTimeout(() => (addedToCart = false), 2000);
	}

	// ─── Global Event Listeners ───
	onMount(() => {
		const move = (e: MouseEvent | TouchEvent) => onDragMove(e);
		const up = () => endDrag();
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', up);
		window.addEventListener('touchmove', move, { passive: false });
		window.addEventListener('touchend', up);
		return () => {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', up);
			window.removeEventListener('touchmove', move);
			window.removeEventListener('touchend', up);
		};
	});
</script>

<svelte:head>
	<title>Custom Hat | Triple B Prints</title>
	<meta name="description" content="Design your own custom hat with Triple B Prints. Snapback, dad hat, trucker. Embroidery or screen print." />
</svelte:head>

<!-- Breadcrumb -->
<div class="bg-slate-900 text-slate-400 py-4">
	<div class="max-w-6xl mx-auto px-6">
		<a href="/" class="hover:text-yellow-400 transition-colors">← Back to Home</a>
	</div>
</div>

<!-- Product Section -->
<section class="py-12 bg-white">
	<div class="max-w-6xl mx-auto px-6">
		<div class="grid md:grid-cols-2 gap-12">
			<!-- Left: Preview -->
			<div class="space-y-6">
				<h1 class="text-3xl font-black text-slate-900">{product.name}</h1>
				<p class="text-slate-600">{product.description}</p>

				<!-- Configurator Preview -->
				<div
					bind:this={previewRef}
					class="relative bg-slate-100 rounded-2xl overflow-hidden shadow-lg select-none"
					style="aspect-ratio: 1;"
					role="img"
					aria-label="Hat preview showing your uploaded artwork"
					tabindex="0"
					onkeydown={handleArtworkKey}
				>
					<!-- Base product image -->
					<img
						src={product.image}
						alt="Hat base garment"
						class="w-full h-full object-cover"
					/>

					<!-- Color overlay tint -->
					<div
						class="absolute inset-0 mix-blend-multiply pointer-events-none opacity-30"
						style="background-color: {selectedColor.hex};"
					></div>

					<!-- Overlay uploaded image -->
					{#if uploadedImage}
						<div
							class="absolute cursor-move touch-none"
							style="left: {imagePosition.x}%; top: {imagePosition.y}%; transform: translate(-50%, -50%) scale({imageScale});"
							onmousedown={startDrag}
							ontouchstart={startDrag}
							role="button"
							aria-label="Your uploaded artwork, draggable. Use arrow keys to fine-tune position."
							tabindex="0"
							onkeydown={handleArtworkKey}
						>
							<img
								src={uploadedImage}
								alt="Your custom artwork"
								class="w-32 h-32 object-contain pointer-events-none"
								style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));"
							/>
						</div>
					{:else}
						<div class="absolute inset-0 flex items-center justify-center">
							<p class="text-slate-400 font-medium">Upload artwork to see preview</p>
						</div>
					{/if}
				</div>

				<!-- Scale control -->
				{#if uploadedImage}
					<div class="bg-slate-50 rounded-xl p-4">
						<label class="block text-sm font-bold text-slate-700 mb-2" for="scale-slider">
							Artwork Size: {Math.round(imageScale * 100)}%
						</label>
						<input
							id="scale-slider"
							type="range"
							min="0.5"
							max="2"
							step="0.1"
							value={imageScale}
							oninput={handleScaleChange}
							class="w-full accent-rose-600"
							aria-label="Adjust artwork size"
						/>
						<p class="text-xs text-slate-500 mt-1">
							Drag artwork to position. Use slider to resize. Arrow keys for fine-tuning.
						</p>
					</div>
				{/if}
			</div>

			<!-- Right: Controls -->
			<div class="space-y-8">
				<!-- Price -->
				<div class="bg-yellow-50 rounded-2xl p-6">
					<p class="text-sm text-slate-600 font-medium mb-1">Total Price</p>
					<p class="text-4xl font-black text-slate-900">${totalPrice}</p>
					<p class="text-sm text-slate-500 mt-1">
						Base: ${product.basePrice} + Style: +${selectedStyle.priceMod} + Method: +${selectedMethod.priceMod}
					</p>
				</div>

				<!-- Style Selector -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3" id="style-label">Style</h3>
					<div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="style-label">
						{#each styles as style}
							<button
								class="px-4 py-2 rounded-lg font-bold transition-all {selectedStyle.label === style.label
									? 'bg-slate-900 text-white'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
								onclick={() => (selectedStyle = style)}
								role="radio"
								aria-checked={selectedStyle.label === style.label}
								tabindex={selectedStyle.label === style.label ? 0 : -1}
							>
								{style.label}
								{#if style.priceMod > 0}
									<span class="text-xs ml-1 opacity-70">+${style.priceMod}</span>
								{:else if style.priceMod < 0}
									<span class="text-xs ml-1 opacity-70">${style.priceMod}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>

				<!-- Color Selector -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3" id="color-label">Color</h3>
					<div class="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="color-label">
						{#each colors as color}
							<button
								class="w-12 h-12 rounded-full border-4 transition-all {selectedColor.name === color.name
									? 'border-yellow-400 scale-110'
									: 'border-transparent hover:scale-105'}"
								style="background-color: {color.hex};"
								onclick={() => (selectedColor = color)}
								aria-label={color.name}
								role="radio"
								aria-checked={selectedColor.name === color.name}
								tabindex={selectedColor.name === color.name ? 0 : -1}
							>
								{#if selectedColor.name === color.name}
									<div class="w-full h-full flex items-center justify-center">
										<svg
											class="w-6 h-6 text-white drop-shadow-md"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="3"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									{/if}
								</button>
							{/each}
						</div>
						<p class="text-sm text-slate-600 mt-2 font-medium">{selectedColor.name}</p>
					</div>

					<!-- Print Method -->
					<div>
						<h3 class="text-lg font-bold text-slate-900 mb-3" id="method-label">Print Method</h3>
						<div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="method-label">
							{#each methods as method}
								<button
									class="px-4 py-2 rounded-lg font-bold transition-all {selectedMethod.label === method.label
										? 'bg-slate-900 text-white'
										: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
									onclick={() => (selectedMethod = method)}
									role="radio"
									aria-checked={selectedMethod.label === method.label}
									tabindex={selectedMethod.label === method.label ? 0 : -1}
								>
									{method.label}
									{#if method.priceMod > 0}
										<span class="text-xs ml-1 opacity-70">+${method.priceMod}</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>

					<!-- Artwork Upload -->
					<div>
						<h3 class="text-lg font-bold text-slate-900 mb-3" id="upload-label">Your Artwork</h3>
						<label
							class="block w-full border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer {isDragOver
								? 'border-rose-600 bg-rose-50'
								: 'border-slate-300 hover:border-yellow-400 hover:bg-yellow-50'}"
							ondragover={onDragOver}
							ondragleave={onDragLeave}
							ondrop={onDrop}
							aria-labelledby="upload-label"
						>
							<input
								type="file"
								accept="image/png,image/jpeg,image/svg+xml"
								class="hidden"
								onchange={onFileInput}
								aria-label="Upload your artwork image"
							/>
							<svg
								class="w-10 h-10 text-slate-400 mx-auto mb-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<p class="font-bold text-slate-700">Click to upload or drag and drop</p>
							<p class="text-sm text-slate-500 mt-1">PNG, JPG, SVG up to 25MB</p>
						</label>
						{#if uploadedImage}
							<p class="text-sm text-green-600 font-medium mt-2" role="status" aria-live="polite">
								✓ Artwork uploaded
							</p>
						{/if}
					</div>

					<!-- Add to Cart -->
					<button
						class="w-full font-black uppercase tracking-wide py-4 rounded-xl shadow-lg transition-all text-lg {uploadedImage
							? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 hover:scale-105'
							: 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'}"
						disabled={!uploadedImage}
						onclick={addToCart}
						aria-label={uploadedImage ? `Add custom hat to cart for $${totalPrice}` : 'Upload artwork to enable checkout'}
						aria-live="polite"
					>
						{#if addedToCart}
							<span class="flex items-center justify-center gap-2" role="status">
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
								</svg>
								Added to Cart!
							</span>
						{:else}
							{uploadedImage ? 'Add to Cart — $' + totalPrice : 'Upload Artwork to Continue'}
						{/if}
					</button>

					{#if !uploadedImage}
						<p class="text-sm text-slate-500 text-center">
							Upload your artwork to enable checkout
						</p>
					{/if}
				</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-12 mt-12">
	<div class="max-w-6xl mx-auto px-6 text-center">
		<p class="text-slate-400">
			© {new Date().getFullYear()} Triple B Prints. Demo configurator.
		</p>
	</div>
</footer>
