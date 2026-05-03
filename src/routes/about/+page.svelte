<!--
  About Page — Triple B Prints
  =============================
  PURPOSE: Tell the brand story, build trust with potential customers.
  WHAT'S HERE: Hero section, brand story, team/owner intro, values, CTA.
  REVERSAL POINT: If client wants different copy or photos, swap the
  placeholder text/images below. The layout (sections, spacing, responsive
  grid) should stay stable.
  a11y: All images have alt text, headings in order, focus rings on links.
-->

<script>
  // No reactive state needed for a static about page.
  // If we add testimonials or team carousel later, use $state here.
</script>

<svelte:head>
  <title>About — Triple B Prints</title>
  <meta name="description" content="Learn about Triple B Prints, Akron's custom DTG, laser, and print-and-cut shop." />
</svelte:head>

<main class="min-h-screen bg-neutral-900 text-neutral-100">
  <!-- HERO -->
  <section class="relative overflow-hidden bg-gradient-to-b from-yellow-500/10 to-neutral-900 py-20 px-6">
    <div class="mx-auto max-w-4xl text-center">
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
        About Triple B Prints
      </h1>
      <p class="mt-4 text-lg text-neutral-300">
        <!-- PLACEHOLDER: Replace with actual tagline once client provides it. -->
        Custom apparel and gifts, printed with precision in Akron, Ohio.
      </p>
    </div>
  </section>

  <!-- BRAND STORY -->
  <section class="mx-auto max-w-5xl px-6 py-16">
    <div class="grid gap-12 md:grid-cols-2 md:items-center">
      <!-- PLACEHOLDER IMAGE: Replace src with actual shop/owner photo. -->
      <img
        src="/images/about-shop.jpg"
        alt="Triple B Prints shop interior with DTG printer and laser engraver"
        class="rounded-2xl border border-neutral-700 shadow-lg"
        on:error={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div>
        <h2 class="text-2xl font-bold text-yellow-400">Our Story</h2>
        <p class="mt-4 text-neutral-300 leading-relaxed">
          <!-- PLACEHOLDER: Replace with real origin story once client shares it. -->
          Triple B Prints started with a simple idea: make custom printing accessible,
          fast, and high-quality. What began as a side project grew into a full-service
          shop serving Akron and beyond with DTG printing, laser engraving, and
          print-and-cut solutions.
        </p>
        <p class="mt-4 text-neutral-300 leading-relaxed">
          <!-- PLACEHOLDER: Add milestones, years in business, notable clients. -->
          Today we handle everything from single custom shirts to bulk orders for
          teams, events, and businesses. No minimums, no setup fees for standard
          jobs — just honest pricing and fast turnaround.
        </p>
      </div>
    </div>
  </section>

  <!-- VALUES / WHAT SETS US APART -->
  <section class="bg-neutral-800 py-16 px-6">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center text-2xl font-bold text-yellow-400">Why Choose Us</h2>
      <!--
        PLACEHOLDER: These 3 value props are generic.
        Replace with client's actual differentiators once known.
      -->
      <div class="mt-10 grid gap-8 sm:grid-cols-3">
        <div class="rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 text-xl font-bold">1</div>
          <h3 class="mt-4 font-semibold">No Minimums</h3>
          <p class="mt-2 text-sm text-neutral-400">
            Order one shirt or one hundred. We treat every job with the same care.
          </p>
        </div>
        <div class="rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 text-xl font-bold">2</div>
          <h3 class="mt-4 font-semibold">Fast Turnaround</h3>
          <p class="mt-2 text-sm text-neutral-400">
            Most orders ready within 3–5 business days. Rush options available.
          </p>
        </div>
        <div class="rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 text-xl font-bold">3</div>
          <h3 class="mt-4 font-semibold">Local & Personal</h3>
          <p class="mt-2 text-sm text-neutral-400">
            Akron-based, owner-operated. Talk to a human, not a ticket system.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- EQUIPMENT / CAPABILITIES -->
  <section class="mx-auto max-w-5xl px-6 py-16">
    <h2 class="text-2xl font-bold text-yellow-400">What We Can Do</h2>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2">
      <!-- PLACEHOLDER: Expand or reorder based on actual equipment list. -->
      <li class="flex items-start gap-3">
        <span class="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"></span>
        <span>Direct-to-garment (DTG) printing on cotton and cotton-blend apparel</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"></span>
        <span>Laser engraving on wood, metal, glass, leather, and acrylic</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"></span>
        <span>Print-and-cut (PNC) vinyl for stickers, decals, and heat transfers</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"></span>
        <span>Custom tumblers, mugs, keychains, coasters, and home decor</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"></span>
        <span>Bulk orders for events, teams, and corporate gifting</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="mt-1 inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"></span>
        <span>Turnkey business packages: equipment, training, and support</span>
      </li>
    </ul>
  </section>

  <!-- CTA -->
  <section class="bg-yellow-500 py-16 px-6 text-center text-neutral-900">
    <h2 class="text-2xl font-bold">Ready to print something?</h2>
    <p class="mt-2">Browse products, upload your artwork, and check out in minutes.</p>
    <a
      href="/shop/t-shirt"
      class="mt-6 inline-block rounded-lg bg-neutral-900 px-8 py-3 font-semibold text-yellow-400 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:ring-offset-yellow-500"
    >
      Start Designing
    </a>
  </section>
</main>
