# Triple B Prints Configurator Productization — Project Start

**Created:** 2026-06-05  
**Branch:** `plan/configurator-productization-2026-06-05`  
**Status:** PLAN ONLY — no implementation yet

## Human intent

Separate the existing product configurator out of the individual shop pages, finish it into a coherent reusable product surface, and package it so Triple B Prints can be presented as a product rather than a pile of demo pages.

This should create something Nate can work through with Andy and Peter soon: exact steps, exact files, verification points, and clear handoffs.

## Existing-state check

Repo: `/Users/kn8/projects/triple-b-prints`

Current stack:
- SvelteKit 2
- Svelte 5 runes
- TypeScript
- Tailwind CSS 4 via Vite
- Static adapter

Baseline command run before planning:

```bash
npm run check
```

Baseline result:

```text
svelte-check found 0 errors and 0 warnings
```

Existing configurator locations:

```text
src/routes/shop/t-shirt/+page.svelte
src/routes/shop/hoodie/+page.svelte
src/routes/shop/mug/+page.svelte
src/routes/shop/hat/+page.svelte
src/routes/shop/keychain/+page.svelte
src/routes/shop/phone-case/+page.svelte
src/routes/shop/coaster/+page.svelte
src/routes/shop/shorts/+page.svelte
src/routes/shop/joggers/+page.svelte
```

The configurator is currently duplicated per route. Product data, option data, upload handling, artwork positioning, price calculation, and add-to-cart demo behavior live inside each page.

## G-brain / board preflight

Board search for `configurator|configure|configuration` did not find a prior dedicated configurator productization plan. Active code inspection found the actual root at `/Users/kn8/projects/triple-b-prints`.

## Product name for planning

Working name: **Triple B Configurator**

This can later become:
- an embedded configurator inside Triple B Prints;
- a standalone “custom merch quote builder” product;
- a reusable productized template for other local print shops.

## Smallest durable artifact

A reusable Svelte configurator component plus a product catalog data layer, demonstrated on one route, then migrated across all existing product pages.

## Non-goals for this phase

- No real payment processing.
- No live inventory.
- No customer accounts.
- No real file upload backend yet.
- No Supabase writes unless explicitly approved later.
- No deployment without Nate approval.
- No deleting old route content until migrated and verified.

## Acceptance criteria

The phase is complete when:

1. Product data is centralized in `src/lib/products/catalog.ts` or equivalent.
2. Shared option types exist in `src/lib/products/types.ts`.
3. Shared price calculation exists in `src/lib/products/pricing.ts` and has tests.
4. Reusable configurator UI exists under `src/lib/components/configurator/`.
5. `/shop/t-shirt` uses the reusable configurator first.
6. All existing `/shop/*` product pages continue to render.
7. `npm run check` passes.
8. `npm run build` passes.
9. Manual smoke test verifies:
   - select product options;
   - upload artwork;
   - move artwork;
   - resize artwork;
   - price updates;
   - mock add-to-cart or quote action works.
10. Evidence is saved in `docs/productization/EVIDENCE.md`.

## Agent split

### Egon

Owner of architecture, productization boundaries, data model, test plan, and final integration review.

### Andy

Owner of visual/product polish:
- configurator layout hierarchy;
- product preview card design;
- option selector visual states;
- “package as product” landing copy/structure;
- screenshot-worthy first impression.

### Peter

Owner of implementation execution:
- branch discipline;
- extracting component/data modules;
- migrating routes;
- running checks/build;
- producing diffs and evidence.

## Approval boundaries

Requires Nate approval before:
- deployment;
- adding checkout/payment;
- connecting real customer upload storage;
- adding analytics/tracking;
- changing business claims/pricing materially;
- deleting old product pages or routes.

## Evidence path

Use:

```text
docs/productization/EVIDENCE.md
```

Record:
- commands run;
- outputs;
- screenshots if available;
- routes manually checked;
- known issues;
- final branch/commit references.
