<script lang="ts">
	import { onMount } from 'svelte';

	// ─── Product Data ───
	const product = {
		name: 'Custom Phone Case',
		basePrice: 20,
		description: 'Tough polycarbonate case with your custom artwork. Glossy or matte finish.',
		image: 'https://placehold.co/600x700/1e293b/ffffff?text=Phone+Case+Base'
	};

	// ─── Phone Model Options ───
	const models = [
		{ label: 'iPhone 15', priceMod: 0 },
		{ label: 'iPhone 15 Pro', priceMod: 2 },
		{ label: 'iPhone 14', priceMod: 0 },
		{ label: 'iPhone 14 Pro', priceMod: 2 },
		{ label: 'Galaxy S24', priceMod: 0 },
		{ label: 'Galaxy S24 Ultra', priceMod: 2 },
		{ label: 'Pixel 8', priceMod: 0 },
		{ label: 'Pixel 8 Pro', priceMod: 2 }
	];

	// ─── Finish Options ───
	const finishes = [
		{ label: 'Glossy', priceMod: 0 },
		{ label: 'Matte', priceMod: 2 }
	];

	// ─── State (Svelte 5 Runes) ───
	let selectedModel = $state(models[0]);
	let selectedFinish = $state(finishes[0]);
	let uploadedImage = $state<string | null>(null);
	let imagePosition = $state({ x: 50, y: 50 });
	let imageScale = $state(1);
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	let previewRef = $state<HTMLDivElement | null>(null);
	let isDragOver = $state(false);
	let addedToCart = $state(false);

	// ─── Derived Price ───
	let totalPrice = $derived(product.basePrice + selectedModel.priceMod + selectedFinish.priceMod);

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
	<title>Custom Phone Case | Triple B Prints</title>
	<meta name="description" content="Design your own custom phone case with Triple B Prints. iPhone, Galaxy, Pixel. Glossy or matte finish." />
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
					aria-label="Phone case preview showing your uploaded artwork"
					tabindex="0"
					onkeydown={handleArtworkKey}
				>
					<!-- Base product image -->
					<img
						src={product.image}
						alt="Phone case base"
						class="w-full h-full object-cover"
					/>

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
						Base: ${product.basePrice} + Model: +${selectedModel.priceMod} + Finish: +${selectedFinish.priceMod}
					</p>
				</div>

				<!-- Model Selector -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3" id="model-label">Phone Model</h3>
					<div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="model-label">
						{#each models as model}
							<button
								class="px-4 py-2 rounded-lg font-bold transition-all {selectedModel.label === model.label
									? 'bg-slate-900 text-white'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
								onclick={() => (selectedModel = model)}
								role="radio"
								aria-checked={selectedModel.label === model.label}
								tabindex={selectedModel.label === model.label ? 0 : -1}
							>
								{model.label}
								{#if model.priceMod > 0}
									<span class="text-xs ml-1 opacity-70">+${model.priceMod}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>

				<!-- Finish Selector -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3" id="finish-label">Finish</h3>
					<div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="finish-label">
						{#each finishes as finish}
							<button
								class="px-4 py-2 rounded-lg font-bold transition-all {selectedFinish.label === finish.label
									? 'bg-slate-900 text-white'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
								onclick={() => (selectedFinish = finish)}
								role="radio"
								aria-checked={selectedFinish.label === finish.label}
								tabindex={selectedFinish.label === finish.label ? 0 : -1}
							>
								{finish.label}
								{#if finish.priceMod > 0}
									<span class="text-xs ml-1 opacity-70">+${finish.priceMod}</span>
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
					aria-label={uploadedImage ? `Add custom phone case to cart for $${totalPrice}` : 'Upload artwork to enable checkout'}
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
