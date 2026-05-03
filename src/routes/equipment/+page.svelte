<script lang="ts">
	// ─── xTool Equipment Data ───
	// TODO: Replace with affiliate links when available
	const tools = [
		{
			name: 'xTool D1 Pro',
			category: 'Laser Engraver',
			description: '20W diode laser engraver and cutter. Perfect for wood, leather, acrylic, and more. Great entry point for custom engraving.',
			image: 'https://placehold.co/600x400/1e293b/ffffff?text=xTool+D1+Pro',
			link: 'https://xtool.com/products/d1-pro',
			badge: 'Best Starter'
		},
		{
			name: 'xTool M1',
			category: 'Hybrid Laser + Blade',
			description: '10W laser + blade cutter in one. Cuts vinyl, paper, and thin materials. Ideal for stickers, decals, and multi-layer designs.',
			image: 'https://placehold.co/600x400/0ea5e9/ffffff?text=xTool+M1',
			link: 'https://xtool.com/products/m1',
			badge: 'Most Versatile'
		},
		{
			name: 'xTool P2',
			category: 'CO2 Laser',
			description: '55W CO2 laser for serious production. Cuts acrylic, wood, leather, fabric. Built for high-volume custom work.',
			image: 'https://placehold.co/600x400/f59e0b/ffffff?text=xTool+P2',
			link: 'https://xtool.com/products/p2',
			badge: 'Production Grade'
		},
		{
			name: 'xTool F1',
			category: 'Fiber Laser',
			description: 'Portable fiber laser for metal and plastic marking. Engrave logos, serial numbers, and custom designs on hard surfaces.',
			image: 'https://placehold.co/600x400/10b981/ffffff?text=xTool+F1',
			link: 'https://xtool.com/products/f1',
			badge: 'Metal Specialist'
		}
	];

	const supplies = [
		{ name: 'Acrylic Sheets', description: 'Various colors and thicknesses for laser cutting and engraving.' },
		{ name: 'Wood Blanks', description: 'Basswood, plywood, and hardwood blanks ready for customization.' },
		{ name: 'Leather Pieces', description: 'Genuine and faux leather for wallets, patches, and accessories.' },
		{ name: 'Vinyl Rolls', description: 'Adhesive vinyl in matte, glossy, and specialty finishes.' }
	];
</script>

<svelte:head>
	<title>Equipment & Tools | Triple B Prints</title>
	<meta name="description" content="Professional-grade laser engravers and cutting tools from xTool. Start your own custom print and engraving business." />
</svelte:head>

<!-- Breadcrumb -->
<div class="bg-slate-900 text-slate-400 py-4">
	<div class="max-w-6xl mx-auto px-6">
		<a href="/" class="hover:text-yellow-400 transition-colors">← Back to Home</a>
	</div>
</div>

<!-- Hero -->
<section class="bg-slate-900 text-white py-16 md:py-24">
	<div class="max-w-6xl mx-auto px-6">
		<div class="max-w-2xl">
			<h1 class="text-4xl md:text-5xl font-black mb-6">
				The Tools Behind <span class="text-yellow-400">Triple B</span>
			</h1>
			<p class="text-lg text-slate-300 mb-8 leading-relaxed">
				We use xTool laser engravers and cutters to produce everything you see on this site. 
				These are the same machines we recommend to anyone starting their own custom print 
				and engraving business.
			</p>
			<div class="flex flex-wrap gap-4">
				<a 
					href="#lasers" 
					class="inline-block bg-yellow-400 text-slate-900 font-black uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all"
				>
					Browse Lasers
				</a>
				<a 
					href="https://xtool.com" 
					target="_blank" 
					rel="noopener noreferrer"
					class="inline-block bg-white/10 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
				>
					Visit xTool →
				</a>
			</div>
			<p class="text-sm text-slate-500 mt-4">
				<!-- TODO: Insert affiliate disclosure here when link is active -->
				Affiliate links coming soon — check back for exclusive Triple B discounts.
			</p>
		</div>
	</div>
</section>

<!-- Laser Tools Grid -->
<section id="lasers" class="py-20 bg-white">
	<div class="max-w-6xl mx-auto px-6">
		<div class="mb-12">
			<h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-2">Laser Engravers</h2>
			<p class="text-slate-500 text-lg">Professional machines for every budget and production level</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each tools as tool}
				<div class="group bg-slate-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
					<div class="relative">
						<img
							src={tool.image}
							alt={tool.name}
							class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
						{#if tool.badge}
							<span class="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
								{tool.badge}
							</span>
						{/if}
						<span class="absolute top-4 right-4 bg-slate-900/80 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
							{tool.category}
						</span>
					</div>
					<div class="p-6">
						<h3 class="text-xl font-black text-slate-900 mb-2">{tool.name}</h3>
						<p class="text-slate-600 leading-relaxed mb-4">{tool.description}</p>
						<a
							href={tool.link}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-block w-full text-center bg-slate-900 text-white font-bold uppercase tracking-wide py-3 rounded-xl hover:bg-rose-600 transition-colors"
						>
							View on xTool →
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Materials -->
<section class="py-20 bg-sky-50">
	<div class="max-w-6xl mx-auto px-6">
		<div class="mb-12">
			<h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-2">Materials We Use</h2>
			<p class="text-slate-500 text-lg">Quality blanks and substrates for every project</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each supplies as supply}
				<div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
					<h3 class="text-lg font-black text-slate-900 mb-2">{supply.name}</h3>
					<p class="text-slate-600 text-sm">{supply.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Why xTool -->
<section class="py-20 bg-white">
	<div class="max-w-6xl mx-auto px-6">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div>
				<h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6">Why We Chose xTool</h2>
				<div class="space-y-6">
					<div class="flex gap-4">
						<div class="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<div>
							<h3 class="font-black text-slate-900 mb-1">Easy to Learn</h3>
							<p class="text-slate-600">xTool's software is intuitive. We were cutting and engraving within hours of unboxing.</p>
						</div>
					</div>
					<div class="flex gap-4">
						<div class="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<div>
							<h3 class="font-black text-slate-900 mb-1">Reliable Support</h3>
							<p class="text-slate-600">When we had questions, xTool's team responded fast. That's critical when you're running production.</p>
						</div>
					</div>
					<div class="flex gap-4">
						<div class="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h3 class="font-black text-slate-900 mb-1">Great Value</h3>
							<p class="text-slate-600">You get professional results without the industrial price tag. Perfect for growing businesses.</p>
						</div>
					</div>
				</div>
			</div>
			<div class="relative">
				<div class="absolute -top-4 -left-4 w-full h-full bg-yellow-200 rounded-2xl"></div>
				<img
					src="https://placehold.co/600x400/1e293b/ffffff?text=xTool+Workshop"
					alt="xTool laser workshop"
					class="relative rounded-2xl shadow-lg w-full"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-20 bg-slate-900 text-white">
	<div class="max-w-4xl mx-auto px-6 text-center">
		<h2 class="text-4xl md:text-5xl font-black mb-6">Start Your Own Shop</h2>
		<p class="text-lg text-slate-300 mb-8 leading-relaxed">
			Interested in launching your own custom print and engraving business? 
			We can help you choose the right equipment and get started.
		</p>
		<div class="flex flex-wrap gap-4 justify-center">
			<a 
				href="mailto:hello@triplebprints.com" 
				class="inline-block bg-yellow-400 text-slate-900 font-black uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all"
			>
				Get in Touch
			</a>
			<a 
				href="https://xtool.com" 
				target="_blank" 
				rel="noopener noreferrer"
				class="inline-block bg-white/10 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
			>
				Shop xTool →
			</a>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-12 border-t border-slate-800">
	<div class="max-w-6xl mx-auto px-6 text-center">
		<p class="text-slate-400">© {new Date().getFullYear()} Triple B Prints. Equipment recommendations are based on our own experience.</p>
	</div>
</footer>
