# Triple B Prints — Working Context

## What this repo is right now
Triple B Prints is currently a SvelteKit storefront prototype with:
- a homepage
- multiple product configurator pages
- promo pages
- about/contact/equipment pages
- a Stripe Checkout handoff endpoint

It is no longer just a mock landing page, but it is also not yet a finished production storefront.

## Important product direction
The configurator should be treated as the seed of a future standalone product.

Owner guidance:
- The configurator is part of a larger project targeted roughly 6–8 months out
- It should eventually be sellable as a standalone offering
- It should be supportable and implementable for other people/businesses
- Anything touching the configurator should be built with that future in mind
- "Bulletproof" matters more than fast hacks here
- The configurator is also an input-quality gate for artwork, not just a preview/checkout UI
- Image validation logic is part of the core product value and should not be casually removed

## What that means in practice
When working on the configurator, prefer decisions that:
- separate reusable logic from Triple B-specific branding
- keep pricing/configuration rules data-driven
- make validation explicit and testable
- preserve and strengthen artwork quality gating
- keep checkout handoff clean and portable
- reduce one-off assumptions tied to a single product or client
- preserve accessibility instead of treating it as polish

Avoid decisions that:
- hardcode Triple B assumptions into core configurator logic
- duplicate nearly identical product-specific components when data can drive them
- mix storefront copy concerns with checkout/configuration mechanics
- add fragile behavior just to ship a demo faster

## Current repo state
A cleanup pass has already been completed on the fresh clone:
- pulled a clean copy of the repo
- verified local repo drift and ignored the stale working copy for evaluation
- fixed failing `npm run check`
- removed a duplicate/legacy Stripe endpoint
- pinned Vercel runtime in `svelte.config.js`
- removed unused adapter/dependency leftovers
- added shared configurator helper logic in `src/lib/configurator.ts`
- moved upload rules, artwork quality rules, and quantity clamping into shared configurator utilities
- restored a warn-don't-block artwork validation endpoint at `src/routes/api/validate-artwork/+server.ts`
- hardened checkout so the server derives canonical pricing/options from product data instead of trusting browser input

Current verification status:
- `npm run check` passes
- `npm run build` passes

## Current architectural shape
### Frontend
- SvelteKit
- Svelte 5 runes enabled
- Tailwind CSS

### Checkout
- Client configurator posts to `src/routes/api/create-checkout-session/+server.ts`
- Server route creates a Stripe Checkout session via Stripe's HTTP API
- Server validates the payload against canonical product config before creating the session
- Server derives the final option set and unit price from `shopProducts` instead of trusting client-submitted price data
- Client redirects to returned Checkout URL

### Artwork quality gate
- Client uploads are checked against `src/routes/api/validate-artwork/+server.ts`
- Quality rules live in `src/lib/configurator.ts`
- Current behavior is warn-don't-block: weak artwork is allowed, but the customer is told the risk
- This gate is product logic, not decorative UX

### Deployment assumption
- Vercel adapter
- runtime pinned to `nodejs22.x`

## Known remaining issues
### Product/positioning
The site is currently split between multiple jobs:
- merch storefront
- equipment/affiliate content
- turnkey/business pitch

That is the main product-level problem now. The code is cleaner than the positioning.

### Content
Still contains placeholder/demo elements, including some imagery and contact content.

### Contact flow
The contact page is still a demo interaction, not a real backend-integrated form.

### Configurator hardening still needed
Areas still needing product-grade thinking:
- decide exact warn-vs-block policy by check type instead of leaving all quality checks advisory forever
- tune quality thresholds against real printer/output requirements instead of best-guess defaults
- possibly add background/transparency checks depending on product workflow
- clearer separation between reusable configurator engine and Triple B presentation
- test coverage / QA scenarios
- post-checkout operational flow for handling uploaded art and order metadata
- eventual persistence/storage strategy for artwork instead of preview-only local browser handling
- verify Sharp/Vercel packaging expectations for production runtime

## Recommended next priorities
1. Define the site's primary job for Triple B
2. Decide what belongs to the reusable configurator layer vs storefront layer
3. Reconstruct/preserve the artwork quality-gate behavior, including warn-vs-block rules
4. Harden configurator input/validation/error states
5. Replace placeholder content with real business copy/assets
6. Wire contact and operational flows for actual use
7. Add a basic QA checklist for checkout/configuration behavior

## If another agent picks this up
Start here:
1. Read `TODO.md`
2. Read this file
3. Run:
   - `npm install`
   - `npm run check`
   - `npm run build`
4. Preserve the configurator-as-product direction unless the owner explicitly changes it

## Repo paths worth knowing
- `src/lib/components/ProductConfigurator.svelte` — current shared configurator UI
- `src/lib/data/shopProducts.ts` — product configuration data
- `src/lib/configurator.ts` — reusable configurator validation/helpers
- `src/routes/api/create-checkout-session/+server.ts` — Stripe checkout session creation
- `TODO.md` — active work list
- `CONTEXT.md` — current project/agent context
