<script lang="ts">
	// ─── SAVEBUCK$ Promo Landing Page ───
	// Central hub for all active promotions. Code changes monthly.
	
	const promos = [
		{
			title: '50 Shirts / $400',
			price: '$8 per shirt',
			desc: 'Perfect for teams, events, family reunions, or starting your own brand.',
			link: '/promo/bulk-shirts',
			badge: 'Most Popular'
		},
		{
			title: '12 Hats / $100',
			price: '~$8.33 each',
			desc: 'Embroidered or printed snapbacks, dad hats, truckers. Mix and match styles.',
			link: '/promo/bulk-hats',
			badge: 'New'
		},
		{
			title: '$30 Tumblers',
			price: 'Each',
			desc: 'Stainless steel, double-wall insulated. Your artwork laser-etched or printed.',
			link: '/promo/tumblers',
			badge: null
		}
	];
</script>

<svelte:head>
	<title>SAVEBUCK$ Deals | Triple B Prints</title>
	<meta name="description" content="Active promotions at Triple B Prints. Bulk deals on shirts, hats, and tumblers. Use code SAVEBUCK$." />
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
		<h1 class="text-4xl md:text-6xl font-black mb-4">
			<span class="text-yellow-400">SAVEBUCK$</span>
		</h1>
		<p class="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
			Monthly promo code for bulk deals and flash sales. One code, rotating offers. Check back often.
		</p>
		<div class="inline-block bg-yellow-400 text-slate-900 font-black text-2xl px-8 py-4 rounded-xl shadow-lg">
			Code: SAVEBUCK$
		</div>
		<p class="text-sm text-slate-400 mt-4">Present this code at checkout or mention it when ordering.</p>
	</div>
</section>

<!-- Active Promos -->
<section class="py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-black text-slate-900 mb-8 text-center">Active Promotions</h2>
		<div class="grid gap-6 md:grid-cols-3 md:gap-8">
			{#each promos as promo}
				<a
					href={promo.link}
					class="group block bg-yellow-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-400"
					aria-label={`View ${promo.title} promotion details`}
				>
					<div class="p-8">
						{#if promo.badge}
							<span class="inline-block bg-rose-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full mb-4">
								{promo.badge}
							</span>
						{/if}
						<h3 class="text-2xl font-black text-slate-900 mb-2">{promo.title}</h3>
						<p class="text-rose-600 font-bold text-lg mb-3">{promo.price}</p>
						<p class="text-slate-600">{promo.desc}</p>
						<span class="inline-block mt-6 text-rose-600 font-bold group-hover:underline">
							View Details →
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="py-16 bg-slate-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-black text-slate-900 mb-8 text-center">How SAVEBUCK$ Works</h2>
		<div class="grid md:grid-cols-3 gap-8 text-center">
			<div>
				<div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-2xl font-black text-slate-900">1</span>
				</div>
				<h3 class="font-bold text-slate-900 mb-2">Pick a Deal</h3>
				<p class="text-slate-600">Browse active promotions above. New deals drop monthly.</p>
			</div>
			<div>
				<div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-2xl font-black text-slate-900">2</span>
				</div>
				<h3 class="font-bold text-slate-900 mb-2">Use the Code</h3>
				<p class="text-slate-600">Enter SAVEBUCK$ at checkout or tell us when you call.</p>
			</div>
			<div>
				<div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-2xl font-black text-slate-900">3</span>
				</div>
				<h3 class="font-bold text-slate-900 mb-2">Save Money</h3>
				<p class="text-slate-600">Discount applied automatically. Same quality, lower price.</p>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-12">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">
		<p class="text-slate-400">
			© {new Date().getFullYear()} Triple B Prints. SAVEBUCK$ code subject to change monthly.
		</p>
	</div>
</footer>
