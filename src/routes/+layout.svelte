<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Triple B Prints — Temporarily Offline</title>
	<meta
		name="description"
		content="Triple B Prints is temporarily offline while the shop updates its request and ordering flow."
	/>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="theme-color" content="#07090f" />
	<meta name="color-scheme" content="dark light" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<main class="grid min-h-screen place-items-center overflow-hidden bg-[#07090f] px-4 py-12 text-white sm:px-6">
	<div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(120,232,255,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(216,255,62,0.12),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.10),rgba(3,7,18,1))]"></div>
	<div class="relative w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
		<div class="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-3xl border border-cyan-200/30 bg-cyan-200/10 text-xl font-black tracking-[-0.08em] text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.16)]">
			BBB
		</div>

		<p class="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#d8ff3e] sm:text-sm">
			Triple B Prints
		</p>
		<h1 class="text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl">
			Temporarily offline.
		</h1>
		<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
			The online print preview and request flow are paused while the shop updates its ordering process. Existing customers and active jobs should contact the shop directly.
		</p>

		<div class="mx-auto mt-8 max-w-xl rounded-3xl border border-white/10 bg-black/25 p-5 text-left">
			<p class="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Current status</p>
			<ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
				<li><strong class="text-white">Site:</strong> paused for maintenance.</li>
				<li><strong class="text-white">Orders:</strong> not accepted through this website right now.</li>
				<li><strong class="text-white">Contact:</strong> use your existing direct shop contact for active work.</li>
			</ul>
		</div>
	</div>
</main>
