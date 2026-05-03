<script lang="ts">
	// ─── $30 Tumblers Promo Page ───
	// Stainless steel, double-wall insulated. Laser-etched or printed.

	const features = [
		'Stainless steel, double-wall insulated',
		'20oz capacity',
		'Laser-etched or UV printed artwork',
		'Keeps drinks hot 6hrs / cold 12hrs',
		'Leak-proof lid included',
		'Free mockup before production'
	];

	const faqs = [
		{ q: 'Can I order just one?', a: 'Yes. $30 each, no minimum order.' },
		{ q: 'Laser vs UV print?', a: 'Laser etching included. Full-color UV print add $5.' },
		{ q: 'What file format?', a: 'PNG, JPG, SVG. Vector preferred for laser.' },
		{ q: 'Rush order?', a: '3-day rush available for +$10 per tumbler.' }
	];
</script>

<svelte:head>
	<title>$30 Tumblers | Triple B Prints</title>
	<meta name="description" content="Custom stainless steel tumblers for $30 each. Double-wall insulated, laser-etched or printed. Great for gifts." />
</svelte:head>

<!-- Breadcrumb -->
<div class="bg-slate-900 text-slate-400 py-4">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<a href="/" class="hover:text-yellow-400 transition-colors">← Back to Home</a>
	</div>
</div>

<!-- Hero -->
<section class="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">
		<span class="inline-block bg-sky-600 text-white text-sm font-black uppercase px-4 py-2 rounded-full mb-4">Featured</span>
		<h1 class="text-4xl md:text-6xl font-black mb-4">$30 Tumblers</h1>
		<p class="text-2xl text-yellow-400 font-bold mb-4">Each</p>
		<p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
			Stainless steel, double-wall insulated. Your artwork laser-etched or UV printed. Great for gifts, corporate swag, or personal use.
		</p>
		<div class="flex flex-wrap gap-4 justify-center items-stretch">
			<a href="/promo/savebucks" class="inline-block bg-yellow-400 text-slate-900 font-black uppercase tracking-wide px-6 sm:px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all tap-target">
				All Deals
			</a>
			<a href="/shop/t-shirt" class="inline-block bg-white/10 text-white font-bold uppercase tracking-wide px-6 sm:px-8 py-4 rounded-xl hover:bg-white/20 transition-all tap-target">
				Shop Other Products
			</a>
		</div>
	</div>
</section>

<!-- Features -->
<section class="py-16 bg-white">
	<div class="max-w-4xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-black text-slate-900 mb-8 text-center">What's Included</h2>
		<ul class="grid gap-4 md:grid-cols-2" role="list">
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
	<div class="max-w-4xl mx-auto px-4 sm:px-6">
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
	<div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
		<h2 class="text-3xl font-black text-slate-900 mb-4">Ready to Order?</h2>
		<p class="text-slate-800 mb-8">Use code <span class="font-black">SAVEBUCK$</span> at checkout. Or call us and mention this deal.</p>
		<a href="/promo/savebucks" class="inline-block bg-slate-900 text-white font-black uppercase tracking-wide px-6 sm:px-8 py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all tap-target">
			View All Deals
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-12">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">
		<p class="text-slate-400">
			© {new Date().getFullYear()} Triple B Prints. Tumbler deal valid while listed on this page.
		</p>
	</div>
</footer>
