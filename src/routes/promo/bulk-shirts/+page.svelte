<script lang="ts">
	// ─── 50 Shirts / $400 Bulk Promo Page ───
	// $8 per shirt. Teams, events, reunions, brand launches.

	const features = [
		'DTG (Direct-to-Garment) full-color printing',
		'Unlimited colors, no setup fees',
		'100% cotton or cotton-blend shirts',
		'Sizes XS–3XL included',
		'2-week turnaround',
		'Free mockup before print'
	];

	const faqs = [
		{ q: 'Can I mix sizes?', a: 'Yes. Split your 50 across any sizes XS–3XL at no extra cost.' },
		{ q: 'What file format?', a: 'PNG, JPG, SVG, or AI. 300 DPI recommended for best results.' },
		{ q: 'Can I print front and back?', a: 'Front print included. Back print add $2/shirt.' },
		{ q: 'Rush order?', a: '1-week rush available for +$50. Ask when ordering.' }
	];
</script>

<svelte:head>
	<title>50 Shirts / $400 | Triple B Prints</title>
	<meta name="description" content="Bulk custom t-shirt deal: 50 shirts for $400. $8 each. Perfect for teams, events, and reunions." />
</svelte:head>

<!-- Breadcrumb -->
<div class="bg-slate-900 text-slate-400 py-4">
	<div class="max-w-6xl mx-auto px-6">
		<a href="/" class="hover:text-yellow-400 transition-colors">← Back to Home</a>
	</div>
</div>

<!-- Hero -->
<section class="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
	<div class="max-w-6xl mx-auto px-6 text-center">
		<span class="inline-block bg-rose-600 text-white text-sm font-black uppercase px-4 py-2 rounded-full mb-4">Bulk Deal</span>
		<h1 class="text-4xl md:text-6xl font-black mb-4">50 Shirts / $400</h1>
		<p class="text-2xl text-yellow-400 font-bold mb-4">$8 per shirt</p>
		<p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
			Perfect for teams, events, family reunions, or launching your brand. Full-color DTG printing, no minimum color count.
		</p>
		<div class="flex flex-wrap gap-4 justify-center">
			<a href="/shop/t-shirt" class="inline-block bg-yellow-400 text-slate-900 font-black uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all">
				Start Designing
			</a>
			<a href="/promo/savebucks" class="inline-block bg-white/10 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-white/20 transition-all">
				All Deals
			</a>
		</div>
	</div>
</section>

<!-- Features -->
<section class="py-16 bg-white">
	<div class="max-w-4xl mx-auto px-6">
		<h2 class="text-3xl font-black text-slate-900 mb-8 text-center">What's Included</h2>
		<ul class="grid md:grid-cols-2 gap-4" role="list">
			{#each features as feature}
				<li class="flex items-start gap-3 bg-slate-50 rounded-xl p-4" role="listitem">
					<svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
					</svg>
					<span class="text-slate-700 font-medium">{feature}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- FAQ -->
<section class="py-16 bg-slate-50">
	<div class="max-w-4xl mx-auto px-6">
		<h2 class="text-3xl font-black text-slate-900 mb-8 text-center">FAQ</h2>
		<div class="space-y-4">
			{#each faqs as faq, i}
				<details class="bg-white rounded-xl shadow-sm overflow-hidden" aria-label={`FAQ item ${i + 1}`}>
					<summary class="p-6 font-bold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-inset">
						{faq.q}
					</summary>
					<p class="px-6 pb-6 text-slate-600">{faq.a}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-16 bg-yellow-400">
	<div class="max-w-4xl mx-auto px-6 text-center">
		<h2 class="text-3xl font-black text-slate-900 mb-4">Ready to Order?</h2>
		<p class="text-slate-800 mb-8">Use code <span class="font-black">SAVEBUCK$</span> at checkout. Or call us and mention this deal.</p>
		<a href="/shop/t-shirt" class="inline-block bg-slate-900 text-white font-black uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all">
			Design Your Shirts
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-12">
	<div class="max-w-6xl mx-auto px-6 text-center">
		<p class="text-slate-400">
			© {new Date().getFullYear()} Triple B Prints. 50-shirt deal valid while listed on this page.
		</p>
	</div>
</footer>
