<script lang="ts">
	import { onMount } from 'svelte';

	// Product data
	const product = {
		name: 'Custom T-Shirt',
		basePrice: 18,
		description: 'Premium cotton tee with your custom artwork. Soft, durable, and made to stand out.',
		image: 'https://placehold.co/600x600/1e293b/ffffff?text=T-Shirt+Base'
	};

	// Size options with price modifiers
	const sizes = [
		{ label: 'S', priceMod: 0 },
		{ label: 'M', priceMod: 0 },
		{ label: 'L', priceMod: 0 },
		{ label: 'XL', priceMod: 2 },
		{ label: '2XL', priceMod: 4 }
	];

	// Color options
	const colors = [
		{ name: 'Black', hex: '#1a1a1a' },
		{ name: 'White', hex: '#f5f5f5' },
		{ name: 'Navy', hex: '#1e3a5f' },
		{ name: 'Red', hex: '#cc0000' }
	];

	// State
	let selectedSize = sizes[2]; // Default L
	let selectedColor = colors[0]; // Default Black
	let uploadedImage: string | null = null;
	let imagePosition = { x: 50, y: 50 }; // Percentage
	let imageScale = 1;
	let isDragging = false;
	let dragStart = { x: 0, y: 0 };

	// Computed price
	let totalPrice = $derived(product.basePrice + selectedSize.priceMod);

	// Handle file upload
	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				uploadedImage = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	// Handle drag start
	function startDrag(event: MouseEvent | TouchEvent) {
		isDragging = true;
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		dragStart = { x: clientX, y: clientY };
	}

	// Handle drag move
	function onDrag(event: MouseEvent | TouchEvent) {
		if (!isDragging) return;
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		
		// Simple percentage-based movement
		const deltaX = ((clientX - dragStart.x) / 300) * 100; // 300px preview width approx
		const deltaY = ((clientY - dragStart.y) / 300) * 100;
		
		imagePosition.x = Math.max(0, Math.min(100, imagePosition.x + deltaX * 0.5));
		imagePosition.y = Math.max(0, Math.min(100, imagePosition.y + deltaY * 0.5));
		
		dragStart = { x: clientX, y: clientY };
	}

	// Handle drag end
	function endDrag() {
		isDragging = false;
	}

	// Handle scale change
	function handleScaleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		imageScale = parseFloat(input.value);
	}

	onMount(() => {
		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);
		window.addEventListener('touchmove', onDrag);
		window.addEventListener('touchend', endDrag);
		
		return () => {
			window.removeEventListener('mousemove', onDrag);
			window.removeEventListener('mouseup', endDrag);
			window.removeEventListener('touchmove', onDrag);
			window.removeEventListener('touchend', endDrag);
		};
	});
</script>

<svelte:head>
	<title>Custom T-Shirt | Triple B Prints</title>
	<meta name="description" content="Design your own custom t-shirt with Triple B Prints. Upload artwork, pick size and color." />
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
				<div class="relative bg-slate-100 rounded-2xl overflow-hidden shadow-lg" style="aspect-ratio: 1;">
					<!-- Base product image -->
					<img 
						src={product.image} 
						alt="T-shirt base" 
						class="w-full h-full object-cover"
					/>
					
					<!-- Overlay uploaded image -->
					{#if uploadedImage}
						<div 
							class="absolute cursor-move"
							style="left: {imagePosition.x}%; top: {imagePosition.y}%; transform: translate(-50%, -50%) scale({imageScale});"
							on:mousedown={startDrag}
							on:touchstart={startDrag}
						>
							<img 
								src={uploadedImage} 
								alt="Your artwork" 
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
						<label class="block text-sm font-bold text-slate-700 mb-2">
							Artwork Size: {Math.round(imageScale * 100)}%
						</label>
						<input 
							type="range" 
							min="0.5" 
							max="2" 
							step="0.1" 
							value={imageScale}
							on:input={handleScaleChange}
							class="w-full"
						/>
						<p class="text-xs text-slate-500 mt-1">Drag artwork to position. Use slider to resize.</p>
					</div>
				{/if}
			</div>
			
			<!-- Right: Controls -->
			<div class="space-y-8">
				<!-- Price -->
				<div class="bg-yellow-50 rounded-2xl p-6">
					<p class="text-sm text-slate-600 font-medium mb-1">Total Price</p>
					<p class="text-4xl font-black text-slate-900">${totalPrice}</p>
					<p class="text-sm text-slate-500 mt-1">Base: ${product.basePrice} + Size: +${selectedSize.priceMod}</p>
				</div>
				
				<!-- Size Selector -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3">Size</h3>
					<div class="flex flex-wrap gap-2">
						{#each sizes as size}
							<button
								class="px-4 py-2 rounded-lg font-bold transition-all {selectedSize.label === size.label ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
								on:click={() => selectedSize = size}
							>
								{size.label}
								{#if size.priceMod > 0}
									<span class="text-xs ml-1 opacity-70">+${size.priceMod}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
				
				<!-- Color Selector -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3">Color</h3>
					<div class="flex flex-wrap gap-3">
						{#each colors as color}
							<button
								class="w-12 h-12 rounded-full border-4 transition-all {selectedColor.name === color.name ? 'border-yellow-400 scale-110' : 'border-transparent hover:scale-105'}"
								style="background-color: {color.hex};"
								on:click={() => selectedColor = color}
								aria-label={color.name}
							>
								{#if selectedColor.name === color.name}
									<div class="w-full h-full flex items-center justify-center">
										<svg class="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
										</svg>
									</div>
								{/if}
							</button>
						{/each}
					</div>
					<p class="text-sm text-slate-600 mt-2 font-medium">{selectedColor.name}</p>
				</div>
				
				<!-- Artwork Upload -->
				<div>
					<h3 class="text-lg font-bold text-slate-900 mb-3">Your Artwork</h3>
					<label class="block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-yellow-400 hover:bg-yellow-50 transition-all cursor-pointer">
						<input 
							type="file" 
							accept="image/png,image/jpeg,image/svg+xml" 
							class="hidden"
							on:change={handleFileUpload}
						/>
						<svg class="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
						<p class="font-bold text-slate-700">Click to upload or drag and drop</p>
						<p class="text-sm text-slate-500 mt-1">PNG, JPG, SVG up to 25MB</p>
					</label>
					{#if uploadedImage}
						<p class="text-sm text-green-600 font-medium mt-2">✓ Artwork uploaded</p>
					{/if}
				</div>
				
				<!-- Add to Cart -->
				<button 
					class="w-full bg-yellow-400 text-slate-900 font-black uppercase tracking-wide py-4 rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all text-lg"
					disabled={!uploadedImage}
					class:opacity-50={!uploadedImage}
					class:cursor-not-allowed={!uploadedImage}
				>
					{uploadedImage ? 'Add to Cart — $' + totalPrice : 'Upload Artwork to Continue'}
				</button>
				
				{#if !uploadedImage}
					<p class="text-sm text-slate-500 text-center">Upload your artwork to enable checkout</p>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-12 mt-12">
	<div class="max-w-6xl mx-auto px-6 text-center">
		<p class="text-slate-400">© {new Date().getFullYear()} Triple B Prints. Demo configurator.</p>
	</div>
</footer>
