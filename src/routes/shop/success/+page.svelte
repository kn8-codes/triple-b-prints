<script lang="ts">
	/**
	 * Checkout Success Page
	 *
	 * Shown after Stripe redirects the user back from a successful payment.
	 * This is a static page rendered by SvelteKit (adapter-static).
	 *
	 * Accessibility features:
	 * - role="status" + aria-live="polite" on the confirmation message so screen readers announce it immediately.
	 * - Focus is programmatically moved to the heading on mount so keyboard users land at the start of the content.
	 * - Semantic landmarks: <main>, <header>, and clear heading hierarchy.
	 * - High-contrast colors and large tap targets for the CTA buttons.
	 */

	import { onMount } from 'svelte';

	let headingRef: HTMLHeadingElement | null = $state(null);

	onMount(() => {
		// Move focus to the success heading for screen-reader and keyboard users.
		// This follows WCAG 2.4.3 (Focus Order) and ensures the user knows where they are.
		if (headingRef) {
			headingRef.focus();
		}
	});
</script>

<svelte:head>
	<title>Order Confirmed | Triple B Prints</title>
	<meta name="description" content="Your custom print order has been confirmed. Thank you for shopping with Triple B Prints!" />
</svelte:head>

<!-- Skip-link target for keyboard users -->
<main id="main-content" class="min-h-screen bg-slate-50 flex flex-col">
	<!-- Header / Breadcrumb -->
	<header class="bg-slate-900 text-slate-400 py-4">
		<div class="max-w-6xl mx-auto px-6">
			<a href="/" class="hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-1">
				← Back to Home
			</a>
		</div>
	</header>

	<!-- Success Content -->
	<section class="flex-1 flex items-center justify-center py-16 px-6">
		<div class="max-w-xl w-full text-center space-y-8">
			<!-- Animated check icon (SVG) -->
			<div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center" aria-hidden="true">
				<svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
			</div>

			<!-- Main heading — receives programmatic focus on mount -->
			<h1
				bind:this={headingRef}
				tabindex="-1"
				class="text-4xl font-black text-slate-900 focus:outline-none"
			>
				Thank You!
			</h1>

			<!-- Live region so screen readers announce the confirmation immediately -->
			<p class="text-lg text-slate-700" role="status" aria-live="polite">
				Your order has been placed successfully. We’ll start printing your custom design right away.
			</p>

			<p class="text-sm text-slate-500">
				A confirmation email will be sent shortly. If you have questions, reach out anytime.
			</p>

			<!-- CTAs -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
				<a
					href="/"
					class="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-slate-900 font-black uppercase tracking-wide rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300"
					aria-label="Return to Triple B Prints home page"
				>
					Continue Shopping
				</a>
				<a
					href="/contact"
					class="inline-flex items-center justify-center px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all focus:outline-none focus:ring-4 focus:ring-slate-300"
					aria-label="Contact Triple B Prints support"
				>
					Contact Support
				</a>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-slate-900 text-white py-8">
		<div class="max-w-6xl mx-auto px-6 text-center">
			<p class="text-slate-400">© {new Date().getFullYear()} Triple B Prints. All rights reserved.</p>
		</div>
	</footer>
</main>
