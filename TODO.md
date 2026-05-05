# Triple B Prints TODO

## Product Direction
- [x] Treat the configurator as a future standalone product, not just Triple B page logic
- [x] Start separating reusable configurator logic from Triple B-specific branding/content
- [~] Define what "bulletproof" means: validation, asset handling, pricing rules, checkout handoff, error states, accessibility
- [~] Identify which parts should become portable modules/components/services later
- [x] Preserve and formalize the artwork quality-gate role of the configurator
- [~] Define warn-vs-block rules for bad images so future agents don't accidentally remove that behavior

## Now
- [x] Pull a clean copy of the repo and inspect current state
- [x] Confirm current failures with `npm run check` / `npm run build`
- [x] Fix TypeScript and Svelte warnings blocking confidence
- [x] Remove duplicate Stripe checkout path and keep one server flow
- [x] Pin Vercel runtime so builds don't depend on local Node version

## Next
- [~] Rebuild the image quality gate behavior: resolution/size checks, quality heuristics, and warning UX
- [ ] Decide exact warn-vs-block policy per check type and product
- [ ] Replace placeholder/demo content across about/contact/home/product imagery
- [ ] Decide the site's primary job: storefront vs lead-gen vs equipment/affiliate
- [ ] Tighten product/pricing/content around that single job
- [ ] Wire the contact form to a real backend or convert it to direct contact only
- [ ] Verify full Stripe happy path + cancel path in test mode
- [ ] Add server/client tests or QA scripts around configurator pricing, quality-gate logic, and checkout payload validation
- [ ] Verify Sharp packaging/runtime behavior on actual Vercel deploy target

## Later
- [ ] Rewrite README with actual setup, env vars, and deploy steps
- [ ] Add basic QA checklist for launch
- [ ] Add analytics / conversion tracking only after the funnel is settled
