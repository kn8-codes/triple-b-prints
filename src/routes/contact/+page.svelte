<script lang="ts">
	const productOptions = ['T-Shirts', 'Hoodies', 'Mugs', 'Hats', 'Keychains', 'Coasters', 'Phone Cases', 'Other / Not sure yet'];
	const timelineOptions = ['Rush / 1–3 days', 'This week', 'This month', 'Flexible'];

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let product = $state('');
	let quantity = $state('');
	let timeline = $state('');
	let artworkStatus = $state('');
	let notes = $state('');
	let submitted = $state(false);

	let requestSummary = $derived(
		[
			`Name: ${name || '—'}`,
			`Email: ${email || '—'}`,
			`Phone: ${phone || '—'}`,
			`Product: ${product || '—'}`,
			`Quantity: ${quantity || '—'}`,
			`Timeline: ${timeline || '—'}`,
			`Artwork: ${artworkStatus || '—'}`,
			`Notes: ${notes || '—'}`
		].join('\n')
	);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		submitted = true;
	}

	async function copySummary() {
		await navigator.clipboard.writeText(requestSummary);
	}
</script>

<svelte:head>
	<title>Start a Print Request — Triple B Prints</title>
	<meta name="description" content="Start a custom print request for shirts, hoodies, mugs, hats, keychains, and small-run merch." />
</svelte:head>

<main class="min-h-screen bg-[#07090f] text-white">
	<section class="relative isolate overflow-hidden border-b border-white/10 px-4 py-16 sm:px-6 md:py-24">
		<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(120,232,255,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(216,255,62,0.12),transparent_26%)]"></div>
		<div class="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
			<div>
				<p class="mb-4 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Print request intake</p>
				<h1 class="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
					Start a print request without the phone-tag mess.
				</h1>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
					Capture the product, quantity, deadline, and artwork condition up front so Triple B can quote faster and avoid bad-file surprises.
				</p>
			</div>
			<div class="rounded-[2rem] border border-cyan-200/20 bg-white/[0.05] p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
				<p class="text-sm font-black uppercase tracking-[0.2em] text-[#d8ff3e]">Clean request path</p>
				<p class="mt-3 text-slate-300">
					This request path gathers the job details first so the shop can follow up with a cleaner quote and fewer back-and-forth messages.
				</p>
			</div>
		</div>
	</section>

	<section class="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
		<form onsubmit={handleSubmit} class="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 sm:p-8" aria-label="Print request form">
			<div class="mb-8">
				<p class="text-sm font-black uppercase tracking-[0.24em] text-cyan-100">Request details</p>
				<h2 class="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">Tell us what goes on the press.</h2>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<label class="grid gap-2 text-sm font-bold text-slate-300">
					Name *
					<input bind:value={name} required class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]" placeholder="Your name" />
				</label>
				<label class="grid gap-2 text-sm font-bold text-slate-300">
					Email *
					<input bind:value={email} required type="email" class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]" placeholder="you@example.com" />
				</label>
				<label class="grid gap-2 text-sm font-bold text-slate-300">
					Phone / text
					<input bind:value={phone} type="tel" class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]" placeholder="Best callback number" />
				</label>
				<label class="grid gap-2 text-sm font-bold text-slate-300">
					Product *
					<select bind:value={product} required class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]">
						<option value="" disabled>Select product</option>
						{#each productOptions as option}<option>{option}</option>{/each}
					</select>
				</label>
				<label class="grid gap-2 text-sm font-bold text-slate-300">
					Quantity / run size *
					<input bind:value={quantity} required class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]" placeholder="Example: 24 shirts, 12 mugs" />
				</label>
				<label class="grid gap-2 text-sm font-bold text-slate-300">
					Timeline *
					<select bind:value={timeline} required class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]">
						<option value="" disabled>Select timeline</option>
						{#each timelineOptions as option}<option>{option}</option>{/each}
					</select>
				</label>
			</div>

			<fieldset class="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
				<legend class="px-2 text-sm font-black uppercase tracking-[0.18em] text-[#d8ff3e]">Artwork status</legend>
				<div class="mt-3 grid gap-3 sm:grid-cols-3">
					{#each ['Ready to upload', 'Needs cleanup', 'Need design help'] as option}
						<label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-300 hover:border-cyan-200/40">
							<input bind:group={artworkStatus} type="radio" value={option} required />
							{option}
						</label>
					{/each}
				</div>
			</fieldset>

			<label class="mt-6 grid gap-2 text-sm font-bold text-slate-300">
				Job notes
				<textarea bind:value={notes} rows="5" class="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#d8ff3e]" placeholder="Sizes, colors, placement, event date, budget, or anything the shop should know."></textarea>
			</label>

			<button type="submit" class="mt-7 w-full rounded-2xl bg-[#d8ff3e] px-6 py-4 font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]">
				Preview request summary
			</button>
		</form>

		<aside class="grid content-start gap-5">
			<div class="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
				<p class="text-sm font-black uppercase tracking-[0.22em] text-cyan-100">Why this matters</p>
				<ul class="mt-5 space-y-4 text-slate-300">
					<li><strong class="text-white">Artwork clarity:</strong> flags whether the customer has clean art or needs rebuild help.</li>
					<li><strong class="text-white">Quote speed:</strong> quantity, product, and deadline are captured before the first call.</li>
					<li><strong class="text-white">Growth path:</strong> the same intake can later write to email, a shop queue, spreadsheet, or quote flow.</li>
				</ul>
			</div>

			<div class="rounded-[2rem] border border-[#d8ff3e]/25 bg-[#d8ff3e]/10 p-6">
				<p class="text-sm font-black uppercase tracking-[0.22em] text-[#d8ff3e]">Next step</p>
				<p class="mt-4 text-slate-200">Choose where new requests should land first: email/text, a simple shop queue, or both.</p>
			</div>

			{#if submitted}
				<div class="rounded-[2rem] border border-cyan-200/25 bg-cyan-200/10 p-6" aria-live="polite">
					<p class="text-sm font-black uppercase tracking-[0.22em] text-cyan-100">Request summary</p>
					<pre class="mt-4 whitespace-pre-wrap rounded-2xl bg-black/35 p-4 text-sm text-slate-200">{requestSummary}</pre>
					<button type="button" onclick={copySummary} class="mt-4 rounded-2xl border border-cyan-200/30 bg-cyan-200/10 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-200/20">
						Copy summary
					</button>
				</div>
			{/if}
		</aside>
	</section>
</main>
