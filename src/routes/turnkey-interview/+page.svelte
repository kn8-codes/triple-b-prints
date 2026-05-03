<script lang="ts">
	// ─── Turnkey Business Interview Script ───
	// Use this page as a prompt sheet when talking to your friend.
	// Record the conversation, then transcribe answers back into the
	// turnkey_intake form or directly into Supabase.

	const sections = [
		{
			title: '1. What\'s Included in the Package?',
			questions: [
				'What equipment comes with the turnkey business? (laser, printer, heat press, etc.)',
				'What materials or blanks are included to get started?',
				'Do you include training? If yes, what kind — in-person, video calls, written guides?',
				'How long does support last after purchase?',
				'Is there a warranty on the equipment?'
			]
		},
		{
			title: '2. Pricing Tiers',
			questions: [
				'Do you offer different package levels? (Starter, Pro, Premium?)',
				'What\'s the price range for each tier?',
				'What\'s the difference between the cheapest and most expensive package?',
				'Is financing available?',
				'Are there ongoing costs they should know about? (software, supplies, maintenance)'
			]
		},
		{
			title: '3. Who Is the Ideal Buyer?',
			questions: [
				'Who typically buys this from you? (hobbyist, side-hustler, someone going full-time?)',
				'How much money does someone need to get started beyond the package price?',
				'How long before they can make their first sale?',
				'What skills do they need coming in? (design, sales, technical?)',
				'Who is NOT a good fit for this business?'
			]
		},
		{
			title: '4. Proof & Success Stories',
			questions: [
				'Do you have testimonials or reviews from people who bought the turnkey?',
				'Can you share any revenue numbers from successful buyers?',
				'Do you have photos of their shops, their work, or unboxing the equipment?',
				'How many people have you sold this to so far?',
				'What\'s the biggest success story you can tell?'
			]
		},
		{
			title: '5. Operations & Logistics',
			questions: [
				'Where do you source blanks and materials? Can buyers use your suppliers?',
				'How does shipping work? Do they ship from home or use a fulfillment center?',
				'What software do they need? Is it included?',
				'What kind of workspace do they need? (garage, spare room, warehouse?)',
				'Any permits, licenses, or legal stuff they need to handle?'
			]
		},
		{
			title: '6. Marketing & Branding',
			questions: [
				'Do you help them with branding — logo, business cards, social media?',
				'Do you teach them how to find customers?',
				'Is there a website included or do they build their own?',
				'Do you provide templates or designs they can sell?',
				'Any exclusivity or territory restrictions?'
			]
		},
		{
			title: '7. The Big Pitch',
			questions: [
				'In one sentence, why should someone buy this turnkey business from you instead of doing it themselves?',
				'What\'s the hardest part of starting this business, and how does your package solve it?',
				'What do you wish you knew when you started?',
				'Where do you see this business going in 2-3 years?',
				'Anything else someone should know before they buy?'
			]
		}
	];

	let showNotes = $state(false);
	let notes = $state('');
</script>

<svelte:head>
	<title>Turnkey Interview Script | Triple B Prints</title>
	<meta name="description" content="Structured interview questions for collecting turnkey business information." />
</svelte:head>

<!-- Header -->
<div class="bg-slate-900 text-white py-12">
	<div class="max-w-4xl mx-auto px-6">
		<a href="/" class="text-slate-400 hover:text-yellow-400 transition-colors text-sm font-bold uppercase tracking-wide">← Back to Home</a>
		<h1 class="text-4xl md:text-5xl font-black mt-4 mb-2">Turnkey Business Interview</h1>
		<p class="text-slate-400 text-lg">Read these questions to your friend. Record the answers. Transcribe later.</p>
	</div>
</div>

<!-- Instructions -->
<section class="bg-yellow-50 py-8">
	<div class="max-w-4xl mx-auto px-6">
		<div class="flex items-start gap-4">
			<div class="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
				<svg class="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
				</svg>
			</div>
			<div>
				<h2 class="font-black text-slate-900 mb-1">How to Use This</h2>
				<ol class="text-slate-700 space-y-1 list-decimal list-inside">
					<li>Call your friend (or sit down with them)</li>
					<li>Read each section heading and the questions below it</li>
					<li>Record the conversation on your phone or computer</li>
					<li>After the call, transcribe answers into the notes section below</li>
					<li>Copy the completed notes into the turnkey intake form or Supabase</li>
				</ol>
			</div>
		</div>
	</div>
</section>

<!-- Questions -->
<section class="py-12 bg-white">
	<div class="max-w-4xl mx-auto px-6 space-y-12">
		{#each sections as section, i}
			<div class="border-l-4 border-rose-600 pl-6">
				<h2 class="text-2xl font-black text-slate-900 mb-4">{section.title}</h2>
				<ul class="space-y-3">
					{#each section.questions as q, j}
						<li class="flex items-start gap-3">
							<span class="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-slate-500">{j + 1}</span>
							<p class="text-slate-700 leading-relaxed">{q}</p>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Notes Section -->
<section class="py-12 bg-slate-50">
	<div class="max-w-4xl mx-auto px-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-2xl font-black text-slate-900">Interview Notes</h2>
			<button
				class="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
				onclick={() => showNotes = !showNotes}
			>
				{showNotes ? 'Hide Notes' : 'Show Notes'}
			</button>
		</div>
		
		{#if showNotes}
			<div class="space-y-4">
				<p class="text-slate-600 text-sm">Paste transcribed answers here. Copy this block into the Supabase turnkey_intake table when done.</p>
				<textarea
					bind:value={notes}
					class="w-full h-96 p-4 rounded-xl border-2 border-slate-200 focus:border-yellow-400 focus:outline-none font-mono text-sm text-slate-700 resize-y"
					placeholder="Paste notes here...&#10;&#10;Section 1: What's Included&#10;- Equipment: ...&#10;- Training: ...&#10;&#10;Section 2: Pricing&#10;- Starter: $...&#10;- Pro: $..."
				></textarea>
				<div class="flex gap-4">
					<button
						class="bg-yellow-400 text-slate-900 font-black uppercase tracking-wide px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
						onclick={() => {
							navigator.clipboard.writeText(notes);
							alert('Notes copied to clipboard');
						}}
					>
						Copy Notes
					</button>
					<button
						class="bg-slate-200 text-slate-700 font-bold uppercase tracking-wide px-6 py-3 rounded-xl hover:bg-slate-300 transition-colors"
						onclick={() => {
							if (confirm('Clear all notes?')) notes = '';
						}}
					>
						Clear
					</button>
				</div>
			</div>
		{:else}
			<p class="text-slate-400 text-sm">Click "Show Notes" to reveal the transcription area.</p>
		{/if}
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-white py-8">
	<div class="max-w-4xl mx-auto px-6 text-center">
		<p class="text-slate-400 text-sm">Triple B Prints — Turnkey Business Documentation</p>
	</div>
</footer>
