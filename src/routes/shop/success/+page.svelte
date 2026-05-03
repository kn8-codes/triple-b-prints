<script lang="ts">
	import { onMount } from 'svelte';

	let headingRef = $state<HTMLHeadingElement | null>(null);
	let sessionId = $state('');
	let productSlug = $state('');
	let liveMessage = $state('');

	onMount(() => {
		// We move focus to the confirmation heading on load so keyboard and screen-reader users
		// land directly on the outcome of their payment flow instead of somewhere random on the page.
		headingRef?.focus();
		const params = new URLSearchParams(window.location.search);
		sessionId = params.get('session_id') ?? 'pending';
		productSlug = params.get('product') ?? 'custom-order';
		liveMessage = 'Payment complete. Your order confirmation page is ready.';
	});
</script>

<svelte:head>
	<title>Order Confirmed | Triple B Prints</title>
	<meta name="description" content="Stripe Checkout success page for Triple B Prints." />
</svelte:head>

<section class="min-h-screen bg-slate-900 text-white py-20 px-6">
	<div class="max-w-3xl mx-auto">
		<p class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>

		<div class="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 md:p-12">
			<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-6" aria-hidden="true">
				✓
			</div>

			<h1 bind:this={headingRef} tabindex="-1" class="text-4xl font-black mb-4 focus:outline-none focus:ring-4 focus:ring-yellow-400 rounded-sm">
				Order confirmed
			</h1>
			<p class="text-lg text-slate-600 mb-6">
				Thanks — Stripe says the checkout completed successfully. Triple B Prints can now use this session to track the order.
			</p>

			<div class="rounded-2xl bg-slate-100 p-6 space-y-3" aria-label="Order confirmation details">
				<p><span class="font-bold">Checkout session:</span> {sessionId}</p>
				<p><span class="font-bold">Product:</span> {productSlug}</p>
				<p><span class="font-bold">Next step:</span> Review artwork and fulfill the custom print.</p>
			</div>

			<div class="mt-8 flex flex-wrap gap-4">
				<a href={`/shop/${productSlug}`} class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-yellow-400">
					Customize another one
				</a>
				<a href="/" class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-yellow-400">
					Back to home
				</a>
			</div>
		</div>
	</div>
</section>
