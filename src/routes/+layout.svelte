<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/shop/t-shirt', label: 'Products' },
		{ href: '/equipment', label: 'Equipment' },
		{ href: '/turnkey-interview', label: 'Turnkey' },
		{ href: '/#about', label: 'About' },
		{ href: '/#contact', label: 'Contact' }
	];

	function closeMobileMenu() {
		mobileMenuOpen = false;
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
		<div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
			<a href="/" class="text-xl sm:text-2xl font-black tracking-tight uppercase nav-brand">
				Triple B Prints
			</a>

			<nav class="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wide" aria-label="Primary">
				{#each navItems as item}
					<a href={item.href} class="nav-link tap-target">{item.label}</a>
				{/each}
			</nav>

			<button
				type="button"
				class="md:hidden mobile-menu-button tap-target"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-navigation"
				aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
			>
				<span aria-hidden="true">☰</span>
			</button>
		</div>

		{#if mobileMenuOpen}
			<nav id="mobile-navigation" class="mobile-nav md:hidden" aria-label="Mobile">
				<div class="max-w-6xl mx-auto px-4 sm:px-6 pb-4 grid gap-2">
					{#each navItems as item}
						<a href={item.href} class="mobile-nav-link tap-target" onclick={closeMobileMenu}>{item.label}</a>
					{/each}
				</div>
			</nav>
		{/if}
	</header>

	{@render children()}
</div>
