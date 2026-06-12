<script lang="ts">
	import { onMount } from 'svelte';

	let headingRef = $state<HTMLHeadingElement | null>(null);
	let sessionId = $state('');
	let productSlug = $state('');
	let liveMessage = $state('');

	onMount(() => {
		// Move focus to the outcome so keyboard and screen-reader users land on confirmation.
		headingRef?.focus();
		const params = new URLSearchParams(window.location.search);
		sessionId = params.get('session_id') ?? 'pending';
		productSlug = params.get('product') ?? 'custom-order';
		liveMessage = 'Payment complete. Your Triple B Prints order confirmation page is ready.';
	});
</script>

<svelte:head>
	<title>Order Confirmed | Triple B Prints</title>
	<meta name="description" content="Stripe Checkout success page for Triple B Prints." />
</svelte:head>

<section class="relative min-h-screen overflow-hidden bg-[#07090f] px-4 py-20 text-white sm:px-6">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(62,230,255,0.18),transparent_34%),radial-gradient(circle_at_84%_10%,rgba(216,255,62,0.12),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.36),rgba(3,7,18,1))]"></div>
	<div class="pointer-events-none absolute left-1/2 top-16 hidden -translate-x-1/2 select-none text-[18vw] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.035] lg:block">
		PAID
	</div>

	<div class="relative mx-auto max-w-3xl">
		<p class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>

		<a href="/" class="mb-8 inline-flex min-h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 transition-colors hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-[#d8ff3e] focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]">
			← Back to Studio
		</a>

		<div class="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8 md:p-12">
			<div class="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8ff3e]/30 bg-[#d8ff3e]/15 text-3xl font-black text-[#d8ff3e] shadow-[0_0_34px_rgba(216,255,62,0.14)]" aria-hidden="true">
				✓
			</div>

			<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Stripe checkout complete</p>
			<h1 bind:this={headingRef} tabindex="-1" class="rounded-xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white focus:outline-none focus:ring-2 focus:ring-cyan-200/45 focus:ring-offset-4 focus:ring-offset-transparent sm:text-7xl">
				Order confirmed
			</h1>
			<p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
				Thanks — checkout completed successfully. Triple B Prints can now use this session to review the product, selected options, and artwork reference for fulfillment.
			</p>

			<div class="mt-8 rounded-2xl border border-white/10 bg-black/25 p-6" aria-label="Order confirmation details">
				<p class="text-xs font-black uppercase tracking-[0.22em] text-[#d8ff3e]">Order handoff</p>
				<div class="mt-4 space-y-3 text-slate-300">
					<p><span class="font-bold text-white">Checkout session:</span> {sessionId}</p>
					<p><span class="font-bold text-white">Product:</span> {productSlug}</p>
					<p><span class="font-bold text-white">Next step:</span> Review artwork and fulfill the custom print.</p>
				</div>
			</div>

			<div class="mt-8 flex flex-wrap gap-4">
				<a href={`/shop/${productSlug}`} class="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#d8ff3e] px-6 py-3 font-black uppercase tracking-[0.14em] text-slate-950 transition-all hover:scale-[1.01] hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]">
					Customize another
				</a>
				<a href="/" class="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-black uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:bg-cyan-200/10 hover:text-[#d8ff3e] focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]">
					Back to home
				</a>
			</div>
		</div>
	</div>
</section>
