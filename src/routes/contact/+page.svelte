<!--
  Contact Page — Triple B Prints
  ===============================
  PURPOSE: Let customers reach the business. Every field is a placeholder
  until backend (Supabase / serverless function) is wired.
  WHAT'S HERE: Contact form, business info, map placeholder, social links.
  REVERSAL POINT: Once Supabase is connected, swap the onsubmit handler
  from "show coming-soon message" to "POST to /api/contact".
  a11y: Labels linked to inputs, error announcements, focus management.
-->

<script>
  // PLACEHOLDER STATE: Replace with real form handling once backend ready.
  // If adding Supabase, import createClient here and POST on submit.
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let subject = $state('');
  let message = $state('');
  let status = $state(''); // 'idle' | 'sending' | 'sent' | 'error'

  function handleSubmit(e) {
    e.preventDefault();
    // PLACEHOLDER: No backend yet. Show coming-soon message.
    status = 'sent';
    // Clear form so user knows something happened
    name = email = phone = subject = message = '';
    // Auto-clear status after 5s for screen-reader politeness
    setTimeout(() => { status = 'idle'; }, 5000);
  }
</script>

<svelte:head>
  <title>Contact — Triple B Prints</title>
  <meta name="description" content="Contact Triple B Prints for custom orders, quotes, and questions." />
</svelte:head>

<main class="min-h-screen bg-neutral-900 text-neutral-100">
  <!-- HERO -->
  <section class="relative overflow-hidden bg-gradient-to-b from-yellow-500/10 to-neutral-900 py-20 px-6">
    <div class="mx-auto max-w-4xl text-center">
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Contact Us
      </h1>
      <p class="mt-4 text-lg text-neutral-300">
        <!-- PLACEHOLDER: Replace with actual response-time promise once known. -->
        Questions? Quotes? Custom jobs? We reply within one business day.
      </p>
    </div>
  </section>

  <!-- CONTACT GRID -->
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="grid gap-12 lg:grid-cols-2">

      <!-- FORM -->
      <div>
        <h2 class="text-xl font-bold text-yellow-400">Send a Message</h2>

        <!--
          PLACEHOLDER FORM: Currently shows a "coming soon" message on submit.
          When Supabase or a serverless function is ready:
          1. Remove the setTimeout / status = 'sent' placeholder.
          2. Add async fetch() to your endpoint.
          3. Set status = 'sending' while waiting, then 'sent' or 'error'.
        -->
        <form onsubmit={handleSubmit} class="mt-6 space-y-4" aria-label="Contact form">

          <!-- Name -->
          <div>
            <label for="contact-name" class="block text-sm font-medium text-neutral-300">
              Name <span class="text-red-400" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              bind:value={name}
              required
              class="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="Your name"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="contact-email" class="block text-sm font-medium text-neutral-300">
              Email <span class="text-red-400" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              bind:value={email}
              required
              class="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="you@example.com"
            />
          </div>

          <!-- Phone (optional) -->
          <div>
            <label for="contact-phone" class="block text-sm font-medium text-neutral-300">
              Phone <span class="text-neutral-500">(optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              bind:value={phone}
              class="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="(330) 555-0199"
            />
          </div>

          <!-- Subject -->
          <div>
            <label for="contact-subject" class="block text-sm font-medium text-neutral-300">
              Subject <span class="text-red-400" aria-hidden="true">*</span>
            </label>
            <select
              id="contact-subject"
              bind:value={subject}
              required
              class="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            >
              <!-- PLACEHOLDER: Add/remove options as client defines service categories. -->
              <option value="" disabled selected>Select a topic</option>
              <option value="custom-order">Custom Order</option>
              <option value="quote">Quote Request</option>
              <option value="bulk">Bulk / Event Order</option>
              <option value="turnkey">Turnkey Business Package</option>
              <option value="support">Order Support</option>
              <option value="other">Something Else</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label for="contact-message" class="block text-sm font-medium text-neutral-300">
              Message <span class="text-red-400" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              bind:value={message}
              required
              rows="5"
              class="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="Tell us what you need..."
            ></textarea>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            Send Message
          </button>

          <!-- Status announcement for screen readers -->
          <div aria-live="polite" class="sr-only">
            {#if status === 'sent'}
              Message sent. We'll be in touch soon.
            {/if}
          </div>

          <!-- Visual status banner -->
          {#if status === 'sent'}
            <div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-yellow-400">
              <!-- PLACEHOLDER: Swap this for a real success message once backend is live. -->
              Thanks! This form is a demo right now — backend coming soon.
              For urgent orders, call or text directly.
            </div>
          {/if}
        </form>
      </div>

      <!-- BUSINESS INFO -->
      <div class="space-y-8">
        <h2 class="text-xl font-bold text-yellow-400">Reach Us Directly</h2>

        <!-- PLACEHOLDER BLOCK: Replace with real info once client provides it. -->
        <div class="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
          <h3 class="font-semibold text-neutral-100">Phone / Text</h3>
          <p class="mt-1 text-neutral-300">
            <!-- PLACEHOLDER: Insert real number. -->
            (330) 555-0199
          </p>
        </div>

        <div class="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
          <h3 class="font-semibold text-neutral-100">Email</h3>
          <p class="mt-1 text-neutral-300">
            <!-- PLACEHOLDER: Insert real email. -->
            hello@bbbprints.com
          </p>
        </div>

        <div class="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
          <h3 class="font-semibold text-neutral-100">Location</h3>
          <p class="mt-1 text-neutral-300">
            <!-- PLACEHOLDER: Insert real address or "Akron, OH — local pickup available." -->
            Akron, Ohio<br />
            Local pickup available. Shipping nationwide.
          </p>
        </div>

        <div class="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
          <h3 class="font-semibold text-neutral-100">Hours</h3>
          <p class="mt-1 text-neutral-300">
            <!-- PLACEHOLDER: Replace with actual hours once known. -->
            Mon–Fri: 9am – 6pm<br />
            Sat: 10am – 4pm<br />
            Sun: Closed
          </p>
        </div>

        <!-- SOCIAL LINKS -->
        <div class="flex gap-4">
          <!-- PLACEHOLDER: Add real social URLs once accounts exist. -->
          <a
            href="#"
            aria-label="Facebook"
            class="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            FB
          </a>
          <a
            href="#"
            aria-label="Instagram"
            class="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            IG
          </a>
          <a
            href="#"
            aria-label="TikTok"
            class="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            TT
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- MAP PLACEHOLDER -->
  <section class="mx-auto max-w-6xl px-6 pb-16">
    <!--
      PLACEHOLDER: Replace with real embedded map once address confirmed.
      Options: Google Maps iframe, Leaflet.js, or static image with link.
    -->
    <div class="rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-800/50 p-12 text-center">
      <p class="text-neutral-400">Map coming soon — address to be confirmed.</p>
    </div>
  </section>
</main>
