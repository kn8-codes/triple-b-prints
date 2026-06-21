<script lang="ts">
	import { shopProducts } from '$lib/data/shopProducts';

	const productOrder = ['t-shirt', 'hoodie', 'mug', 'hat', 'keychain', 'phone-case', 'coaster', 'shorts', 'joggers'];

	const productNames: Record<string, string> = {
		't-shirt': 'Custom T-Shirts',
		hoodie: 'Custom Hoodies',
		mug: 'Printed Mugs',
		hat: 'Custom Hats',
		keychain: 'Custom Keychains',
		'phone-case': 'Custom Phone Cases',
		coaster: 'Custom Coasters',
		shorts: 'Custom Shorts',
		joggers: 'Custom Joggers'
	};

	const products = productOrder.map((slug) => {
		const product = shopProducts[slug];
		return {
			name: productNames[product.slug] ?? product.name,
			price: `From $${product.basePrice}`,
			image: product.image,
			badge: product.slug === 't-shirt' ? 'Best Seller' : product.slug === 'hoodie' || product.slug === 'mug' ? 'New' : null,
			link: `/shop/${product.slug}`
		};
	});
</script>

<section class="relative isolate overflow-hidden bg-[#07090f] text-white">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(62,230,255,0.22),transparent_32%),radial-gradient(circle_at_86%_10%,rgba(216,255,62,0.14),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.18),rgba(3,7,18,1))]"></div>
	<div class="pointer-events-none absolute left-1/2 top-10 hidden -translate-x-1/2 select-none text-[18vw] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.035] lg:block">
		BBB
	</div>

	<div class="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 md:py-24">
		<div class="grid min-w-0 gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
			<div class="order-2 min-w-0 lg:order-1">
				<div class="rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
					<div class="relative overflow-hidden rounded-[1.5rem] border border-[#d8ff3e]/15 bg-[radial-gradient(circle_at_50%_0%,rgba(216,255,62,0.14),transparent_38%),linear-gradient(180deg,#111827,#030712)] p-5 sm:p-8">
						<div class="absolute inset-x-6 top-6 h-px bg-[#d8ff3e]/18 sm:inset-x-8 sm:top-8"></div>
						<div class="absolute inset-y-6 left-6 w-px bg-[#d8ff3e]/14 sm:inset-y-8 sm:left-8"></div>
						<div class="absolute inset-y-6 right-6 w-px bg-[#d8ff3e]/14 sm:inset-y-8 sm:right-8"></div>
						<div class="absolute bottom-6 left-6 right-6 h-px bg-[#d8ff3e]/14 sm:bottom-8 sm:left-8 sm:right-8"></div>

						<div class="relative mx-auto flex aspect-square w-full max-w-md flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#d8ff3e]/28 bg-black/25 text-center shadow-[0_0_60px_rgba(216,255,62,0.08)]">
							<p class="text-sm font-black uppercase tracking-[0.28em] text-[#d8ff3e]">Live print room</p>
							<p class="mt-4 text-[6.5rem] font-black leading-none tracking-[-0.14em] text-white sm:text-[8rem]">BBB</p>
							<p class="mt-4 max-w-xs text-sm font-bold uppercase leading-6 tracking-[0.18em] text-[#d8ff3e]">
								Upload art.<br />
								Place it.<br />
								Review.
							</p>
						</div>

						<div class="mt-5 grid grid-cols-1 gap-1.5 text-center text-[0.66rem] font-black uppercase tracking-[0.12em] text-[#d8ff3e] min-[430px]:grid-cols-3 min-[430px]:text-[0.62rem] sm:mt-6 sm:grid-cols-3 sm:gap-3 sm:text-xs sm:tracking-[0.14em]">
							<div class="cursor-default rounded-xl border border-[#d8ff3e]/12 bg-white/[0.025] px-2 py-2.5 sm:rounded-2xl sm:px-3 sm:py-3">No minimums</div>
							<div class="cursor-default rounded-xl border border-[#d8ff3e]/12 bg-white/[0.025] px-2 py-2.5 sm:rounded-2xl sm:px-3 sm:py-3">Fast runs</div>
							<div class="cursor-default rounded-xl border border-[#d8ff3e]/12 bg-white/[0.025] px-2 py-2.5 sm:rounded-2xl sm:px-3 sm:py-3">Custom art</div>
						</div>
					</div>
				</div>
			</div>

			<div class="order-1 min-w-0 text-center lg:order-2 lg:text-left">
				<p class="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#d8ff3e] sm:text-sm sm:tracking-[0.32em]">Triple B / Print Studio</p>
				<h1 class="text-[3.15rem] font-black uppercase leading-[0.88] tracking-[-0.045em] text-white min-[390px]:text-6xl sm:text-7xl sm:tracking-[-0.08em] lg:text-8xl">
					<span class="sm:hidden">
						<span class="block">Custom</span>
						<span class="block">prints</span>
					</span>
					<span class="hidden sm:inline">Custom prints</span><br />
					<span class="text-[#d8ff3e]">
						<span class="sm:hidden">
							<span class="block">made</span>
							<span class="block">sharp.</span>
						</span>
						<span class="hidden sm:inline">made sharp.</span>
					</span>
				</h1>
				<p class="mx-auto mt-7 max-w-xl text-lg leading-8 text-slate-300 lg:mx-0">
					Custom merch that makes your business look like a business. Bring the rough idea, logo, screenshot, or finished file — Triple B helps turn it into a clean preview before production.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
					<a
						href="/shop/hoodie"
						class="tap-target inline-flex items-center justify-center rounded-2xl bg-[#d8ff3e] px-7 py-4 font-black uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-lime-950/30 transition-all hover:scale-[1.02] hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]"
					>
						Build a Hoodie
					</a>
					<a
						href="#products"
						class="tap-target inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-black uppercase tracking-[0.16em] text-white transition-all hover:border-cyan-200/60 hover:bg-cyan-200/10 hover:text-cyan-100"
					>
						Browse Products
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="products" class="relative overflow-hidden border-t border-white/10 bg-[#07090f] py-20 text-white">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(120,232,255,0.10),transparent_28%),radial-gradient(circle_at_88%_35%,rgba(216,255,62,0.08),transparent_28%)]"></div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6">
		<div class="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div>
				<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Product line</p>
				<h2 class="text-[2.55rem] font-black uppercase leading-none tracking-[-0.04em] text-white min-[430px]:text-4xl md:text-6xl">Featured <span class="block sm:inline">Products</span></h2>
				<p class="mt-3 max-w-2xl text-lg text-slate-400">Start with a product, upload what you have, and use the preview to make the quote conversation cleaner.</p>
			</div>
			<a href="/shop/hoodie" class="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:bg-cyan-200/10 md:inline-flex">Start with hoodie →</a>
		</div>

		<div class="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each products as product}
				<a
					href={product.link}
					class="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 transition-all hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.075] focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]"
					aria-label={`View ${product.name} configurator`}
				>
					<div class="relative overflow-hidden border-b border-white/10 bg-black/30">
						<img
							src={product.image}
							alt={product.name}
							class="h-64 w-full object-contain p-4 opacity-95 transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-[#07090f] via-transparent to-transparent"></div>
						{#if product.badge}
							<span class="absolute left-4 top-4 rounded-full border border-[#d8ff3e]/30 bg-[#d8ff3e]/15 px-3 py-1 text-xs font-black uppercase text-[#d8ff3e]">
								{product.badge}
							</span>
						{/if}
					</div>
					<div class="p-6">
						<h3 class="mb-1 text-xl font-black uppercase tracking-[-0.02em] text-white">{product.name}</h3>
						<p class="mb-4 font-medium text-cyan-100">{product.price}</p>
						<span class="block w-full rounded-2xl bg-[#d8ff3e] py-3 text-center font-black uppercase tracking-[0.14em] text-slate-950 transition-all group-hover:bg-yellow-200">
							Customize
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<section id="about" class="border-t border-white/10 bg-[#07090f] py-20 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="grid gap-8 md:grid-cols-2 md:items-center lg:gap-14">
			<div>
				<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Shop posture</p>
				<h2 class="mb-6 text-4xl font-black uppercase tracking-[-0.05em] text-white md:text-6xl">Small shop. Sharp prints.</h2>
				<p class="mb-6 text-lg leading-8 text-slate-300">
					Triple B helps businesses, teams, families, and event organizers turn rough artwork and product ideas into clean previews, clear options, and print-ready requests.
				</p>
				<p class="mb-8 text-lg leading-8 text-slate-300">
					The goal is satisfaction all the way around: clear communication, time taken with your idea, and custom merch that looks sharp enough to advertise.
				</p>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
					<div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
						<p class="text-3xl font-black text-[#d8ff3e]">Upload</p>
						<p class="mt-1 text-sm font-bold uppercase tracking-wide text-slate-400">Artwork preview</p>
					</div>
					<div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
						<p class="text-3xl font-black text-[#d8ff3e]">Place</p>
						<p class="mt-1 text-sm font-bold uppercase tracking-wide text-slate-400">Size and position</p>
					</div>
					<div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 col-span-2 sm:col-span-1">
						<p class="text-3xl font-black text-[#d8ff3e]">Send</p>
						<p class="mt-1 text-sm font-bold uppercase tracking-wide text-slate-400">Quote review</p>
					</div>
				</div>
			</div>
			<div class="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-cyan-950/30">
				<div class="rounded-[1.5rem] border border-cyan-200/15 bg-[radial-gradient(circle_at_50%_0%,rgba(120,232,255,0.18),transparent_34%),linear-gradient(180deg,#111827,#030712)] p-8 text-center">
					<p class="text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Production lane</p>
					<p class="my-8 text-7xl font-black uppercase tracking-[-0.1em] text-white sm:text-8xl">Print</p>
					<div class="grid gap-3 text-sm font-black uppercase tracking-[0.14em] text-slate-300 sm:grid-cols-3">
						<span class="rounded-2xl border border-white/10 bg-black/25 px-3 py-4">Upload</span>
						<span class="rounded-2xl border border-white/10 bg-black/25 px-3 py-4">Place</span>
						<span class="rounded-2xl border border-white/10 bg-black/25 px-3 py-4">Review</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<footer id="contact" class="border-t border-white/10 bg-[#07090f] py-16 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
			<div>
				<h3 class="mb-4 text-2xl font-black uppercase tracking-[-0.03em]">Triple B Prints</h3>
				<p class="leading-relaxed text-slate-400">
					Bold custom merch with a preview-ready quote flow built to get clean artwork, clear options, and reviewable requests into the shop.
				</p>
			</div>
			<div>
				<h4 class="mb-4 text-sm font-bold uppercase tracking-wide text-slate-300">Shop</h4>
				<ul class="space-y-2 text-slate-400">
					<li><a href="/shop/t-shirt" class="transition-colors hover:text-[#d8ff3e]">T-Shirts</a></li>
					<li><a href="/shop/mug" class="transition-colors hover:text-[#d8ff3e]">Mugs</a></li>
					<li><a href="/shop/keychain" class="transition-colors hover:text-[#d8ff3e]">Keychains</a></li>
				</ul>
			</div>
			<div>
				<h4 class="mb-4 text-sm font-bold uppercase tracking-wide text-slate-300">Company</h4>
				<ul class="space-y-2 text-slate-400">
					<li><a href="/#about" class="transition-colors hover:text-[#d8ff3e]">About</a></li>
					<li><a href="/contact" class="transition-colors hover:text-[#d8ff3e]">Contact</a></li>
				</ul>
			</div>
		</div>
		<div class="border-t border-white/10 pt-8 text-center text-sm text-slate-500">
			<p>© {new Date().getFullYear()} Triple B Prints. All rights reserved.</p>
		</div>
	</div>
</footer>
