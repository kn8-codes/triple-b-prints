<script lang="ts">
	const capabilityCards = [
		{
			label: 'Apparel printing',
			title: 'Shirts, hoodies, shorts, joggers',
			description: 'Product pages capture size, color, placement, quantity, and customer artwork before the job reaches the shop.',
			accent: 'from-cyan-300/25 to-[#d8ff3e]/10'
		},
		{
			label: 'Hard goods',
			title: 'Mugs, coasters, keychains, phone cases',
			description: 'Small-format products use the same proof-first workflow so every order starts with a clearer production target.',
			accent: 'from-[#d8ff3e]/20 to-yellow-200/10'
		},
		{
			label: 'Artwork intake',
			title: 'Upload, preview, then quote or checkout',
			description: 'The site is built to reduce bad-file surprises: collect artwork condition, deadline, run size, and placement up front.',
			accent: 'from-sky-400/20 to-violet-400/10'
		}
	];

	const productionFlow = [
		'Customer picks a product',
		'Uploads or describes artwork',
		'Positions a proof preview',
		'Sends a cleaner request into the shop'
	];
</script>

<svelte:head>
	<title>Production Capabilities | Triple B Prints</title>
	<meta
		name="description"
		content="Triple B Prints production capabilities: apparel, mugs, coasters, keychains, phone cases, and proof-first artwork intake."
	/>
</svelte:head>

<div class="bg-[#07090f] text-cyan-100/80 py-4 border-b border-white/10">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<a href="/" class="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 transition-colors hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-[#d8ff3e] focus:outline-none focus:ring-2 focus:ring-[#d8ff3e]">← Back to Studio</a>
	</div>
</div>

<section class="relative isolate overflow-hidden bg-[#07090f] py-16 text-white sm:py-24">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(120,232,255,0.18),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(216,255,62,0.12),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.25),rgba(3,7,18,1))]"></div>
	<div class="pointer-events-none absolute left-1/2 top-12 hidden -translate-x-1/2 select-none text-[13vw] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.035] lg:block">
		SHOP FLOOR
	</div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6">
		<div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
			<div>
				<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Production capability</p>
				<h1 class="text-4xl font-black uppercase tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
					Built around cleaner custom orders.
				</h1>
				<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
					Triple B’s site is shaped around a practical print-room workflow: show the product line, collect usable artwork details, preview placement, and move the job toward quote or checkout with fewer back-and-forth messages.
				</p>
				<div class="mt-7 flex flex-wrap gap-3">
					<a href="/#products" class="rounded-2xl bg-[#d8ff3e] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-[#d8ff3e]/10 transition-transform hover:-translate-y-0.5">Browse products</a>
					<a href="/contact" class="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:bg-cyan-200/10">Start request</a>
				</div>
			</div>

			<div class="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-[1.5rem] border border-cyan-200/15 bg-black/30 p-5 sm:col-span-2">
						<p class="text-xs font-black uppercase tracking-[0.24em] text-[#d8ff3e]">Proof-first workflow</p>
						<div class="mt-5 grid gap-3 sm:grid-cols-4">
							{#each productionFlow as step, index}
								<div class="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
									<p class="text-2xl font-black text-white">0{index + 1}</p>
									<p class="mt-2 text-sm font-bold leading-5 text-slate-300">{step}</p>
								</div>
							{/each}
						</div>
					</div>
					<div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
						<p class="text-3xl font-black text-cyan-100">9</p>
						<p class="mt-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Product lanes</p>
					</div>
					<div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
						<p class="text-3xl font-black text-[#d8ff3e]">1</p>
						<p class="mt-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Shared configurator</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="border-t border-white/10 bg-[#07090f] py-16 text-white sm:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="mb-10 max-w-3xl">
			<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">What the site supports</p>
			<h2 class="text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl">The important part is the order flow, not a brochure list.</h2>
			<p class="mt-4 text-lg leading-8 text-slate-300">Each product lane should help the shop answer the same production questions: what is being printed, where does the art go, how many are needed, and how soon does the customer need it?</p>
		</div>

		<div class="grid gap-5 md:grid-cols-3">
			{#each capabilityCards as card}
				<div class="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20">
					<div class={`h-28 bg-gradient-to-br ${card.accent}`}></div>
					<div class="p-6">
						<p class="text-xs font-black uppercase tracking-[0.22em] text-[#d8ff3e]">{card.label}</p>
						<h3 class="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">{card.title}</h3>
						<p class="mt-4 leading-7 text-slate-300">{card.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="border-t border-white/10 bg-[#07090f] py-16 text-white">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
		<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Meeting-ready next step</p>
		<h2 class="text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl">Use the configurator to start the conversation.</h2>
		<p class="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
			For the demo, start with a hoodie or T-shirt, upload art, show placement, then jump to the request form to show how the same intake can become a quote/admin queue after approval.
		</p>
		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a href="/shop/hoodie" class="rounded-2xl bg-[#d8ff3e] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-[#d8ff3e]/10 transition-transform hover:-translate-y-0.5">Demo hoodie</a>
			<a href="/contact" class="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:bg-cyan-200/10">Open request form</a>
		</div>
	</div>
</section>
