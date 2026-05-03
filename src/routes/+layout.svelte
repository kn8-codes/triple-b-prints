<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Triple B Prints — Bold Custom Prints</title>
	<meta name="description" content="Custom t-shirts, mugs, keychains and more. Bold prints for bold people." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-yellow-50 text-slate-900">
	<header class="bg-rose-600 text-white shadow-lg">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-black tracking-tight uppercase">Triple B Prints</a>
			<nav class="hidden sm:flex gap-6 text-sm font-bold uppercase tracking-wide">
				<a href="/shop/t-shirt" class="hover:text-yellow-300 transition-colors">Products</a>
				<a href="/equipment" class="hover:text-yellow-300 transition-colors">Equipment</a>
				<a href="/turnkey-interview" class="hover:text-yellow-300 transition-colors">Turnkey</a>
				<a href="/" class="hover:text-yellow-300 transition-colors">About</a>
				<a href="/" class="hover:text-yellow-300 transition-colors">Contact</a>
			</nav>
		</div>
	</header>

	{@render children()}
</div>
