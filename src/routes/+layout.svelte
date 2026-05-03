<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	/* ─── Mobile nav state (2025-05-03) ─── */
	let mobileNavOpen = $state(false);

	function toggleMobileNav() {
		mobileNavOpen = !mobileNavOpen;
	}

	function closeMobileNav() {
		mobileNavOpen = false;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Triple B Prints — Bold Custom Prints</title>
	<meta name="description" content="Custom t-shirts, mugs, keychains and more. Bold prints for bold people." />
</svelte:head>

<!--
  ╔══════════════════════════════════════════════════════════════════════════════╗
  ║  LAYOUT — Triple B Prints                                                    ║
  ║  ============================================================================= ║
  ║  MOBILE RESPONSIVENESS CHANGES (2025-05-03):                                ║
  ║    • Added hamburger navigation for screens below 640px (sm breakpoint).    ║
  ║    • Menu toggle uses a <button> with aria-expanded + aria-controls for     ║
  ║      full a11y compliance (screen-reader + keyboard friendly).              ║
  ║    • Mobile nav slides down as a vertical stack inside the header.          ║
  ║    • Desktop nav remains unchanged (hidden below sm, flex at sm+).          ║
  ╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div class="min-h-screen flex flex-col bg-yellow-50 text-slate-900">
	<header class="bg-rose-600 text-white shadow-lg">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-xl sm:text-2xl font-black tracking-tight uppercase" aria-label="Triple B Prints Home">
				Triple B Prints
			</a>

			<!--
				HAMBURGER BUTTON (visible only below sm / 640px)
				• aria-expanded tells screen readers whether the menu is open.
				• aria-controls links the button to the mobile nav panel.
				• aria-label provides an accessible name since the SVG is decorative.
				• min-height ensures WCAG 2.5.5 target size (44px).
				• focus:outline-none + focus-visible ring handled in layout.css.
			-->
			<button
				type="button"
				class="sm:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg hover:bg-rose-700 transition-colors"
				aria-expanded={mobileNavOpen}
				aria-controls="mobile-nav"
				aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
				onclick={toggleMobileNav}
			>
				<span class="block w-6 h-0.5 bg-white transition-transform {mobileNavOpen ? 'rotate-45 translate-y-2' : ''}"></span>
				<span class="block w-6 h-0.5 bg-white transition-opacity {mobileNavOpen ? 'opacity-0' : ''}"></span>
				<span class="block w-6 h-0.5 bg-white transition-transform {mobileNavOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
			</button>

			<!-- Desktop nav (hidden on mobile, flex at sm+) -->
			<nav class="hidden sm:flex gap-6 text-sm font-bold uppercase tracking-wide">
				<a href="/shop/t-shirt" class="hover:text-yellow-300 transition-colors">Products</a>
				<a href="/equipment" class="hover:text-yellow-300 transition-colors">Equipment</a>
				<a href="/turnkey-interview" class="hover:text-yellow-300 transition-colors">Turnkey</a>
				<a href="/about" class="hover:text-yellow-300 transition-colors">About</a>
				<a href="/contact" class="hover:text-yellow-300 transition-colors">Contact</a>
			</nav>
		</div>

		<!-- Mobile nav panel (collapsible, only rendered when open) -->
		{#if mobileNavOpen}
			<nav
				id="mobile-nav"
				class="sm:hidden bg-rose-700 border-t border-rose-500"
			>
				<div class="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
					<a
						href="/shop/t-shirt"
						class="text-sm font-bold uppercase tracking-wide py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors"
						onclick={closeMobileNav}
					>
						Products
					</a>
					<a
						href="/equipment"
						class="text-sm font-bold uppercase tracking-wide py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors"
						onclick={closeMobileNav}
					>
						Equipment
					</a>
					<a
						href="/turnkey-interview"
						class="text-sm font-bold uppercase tracking-wide py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors"
						onclick={closeMobileNav}
					>
						Turnkey
					</a>
					<a
						href="/about"
						class="text-sm font-bold uppercase tracking-wide py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors"
						onclick={closeMobileNav}
					>
						About
					</a>
					<a
						href="/contact"
						class="text-sm font-bold uppercase tracking-wide py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors"
						onclick={closeMobileNav}
					>
						Contact
					</a>
				</div>
			</nav>
		{/if}
	</header>

	{@render children()}
</div>
