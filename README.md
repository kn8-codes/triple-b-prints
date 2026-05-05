# Triple B Prints

SvelteKit storefront prototype for Triple B Prints, with a shared product configurator and Stripe Checkout handoff.

## Read this first
If you are picking up work in this repo, start with:
- `CONTEXT.md` — current project direction, cleanup status, and agent handoff context
- `TODO.md` — prioritized work list

## Current status
This repo has already gone through a cleanup pass on the fresh clone:
- `npm run check` passes
- `npm run build` passes
- duplicate legacy Stripe route removed
- Vercel runtime pinned for stable builds

## Product direction
Important: the configurator should be treated as the start of a future standalone product, not just one-off Triple B page code.

That means new work should prefer:
- reusable configurator logic
- data-driven product rules
- explicit validation and error handling
- clean separation between brand content and configurator mechanics

More detail lives in `CONTEXT.md`.

## Stack
- SvelteKit
- Svelte 5 runes
- Tailwind CSS
- Stripe Checkout
- Vercel adapter

## Scripts
```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Environment variables
### Public
- `PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Private
- `STRIPE_SECRET_KEY`

## Key files
- `src/lib/components/ProductConfigurator.svelte`
- `src/lib/data/shopProducts.ts`
- `src/routes/api/create-checkout-session/+server.ts`
- `svelte.config.js`
- `CONTEXT.md`
- `TODO.md`

## Deployment note
Builds are configured for Vercel with runtime pinned in `svelte.config.js`.

## Known unfinished areas
- placeholder/demo content still exists
- contact form is not wired to a real backend yet
- storefront positioning is still split across multiple goals
- configurator still needs further hardening for product-grade reuse
