# Triple B Prints / Press Room Constitution

**Version**: 1.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18

## Core Principles

### I. Client-proof before cleverness

This repo serves a real client-facing Belt.works demo. Every change must improve the quote/configurator experience or preserve a working client-safe site. Do not add framework ceremony, speculative dashboards, checkout complexity, or hidden automation unless it directly supports the accepted slice.

### II. Mobile is the truth surface

Desktop polish is not enough. Final verification must include mobile-width behavior because customers and Nate will actually view this on phones. Any hero/configurator/CTA change must preserve readability, tap targets, and visible next action at narrow widths.

### III. Demo commerce must not imply fake checkout

If a flow is not real commerce, the UI must say so. Prefer quote/mock-quote language over live purchase language unless Stripe and fulfillment are intentionally wired and approved. Product-safety copy is part of the implementation, not a later wording pass.

### IV. Evidence before confidence

Work is not complete until verified with real commands and, when visual, a screenshot or browser smoke path. Default required checks:

```bash
npm run check
npm run build
npm run smoke:checkout-boundary
```

If a command is skipped, the receipt must say why.

### V. Spec first, code second

Use Spec Kit for new feature/polish slices:

1. `$speckit-constitution` for project rules when changing governance.
2. `$speckit-specify` for what/why/non-goals.
3. `$speckit-clarify` when client/Nate decisions affect implementation.
4. `$speckit-plan` for implementation path and verification.
5. `$speckit-tasks` for ordered tasks.
6. `$speckit-implement` only after the spec/tasks are coherent.

### VI. Nate approval gates remain active

Explicit Nate approval is required before:

- committing or pushing;
- deploying or publishing client-facing changes;
- changing payment/Stripe behavior;
- sending client messages;
- deleting files or discarding work;
- changing the visual direction from the approved premium Press Room feel.

## Project constraints

- Stack: SvelteKit, Svelte 5, Vite, Tailwind CSS, TypeScript.
- Main verification commands are defined in `package.json`.
- Productization docs live under `docs/productization/`.
- Receipts for board-side proof live under `/Users/kn8/MESH_BOARD/projects/triple-b-prints/receipts/` or `/Users/kn8/MESH_BOARD/projects/bbbprints/receipts/` depending lane continuity.
- The active high-value lane is the Press Room configurator / BBB Prints polish work.

## Current preferred feature-slice shape

A good next slice is small and visual:

- one visible polish or quote-flow improvement;
- one clear client-safe copy improvement;
- one mobile verification;
- check/build/smoke evidence;
- receipt with screenshots or route smoke details.

## Governance

This constitution overrides casual vibe prompts. If a request conflicts with these rules, stop and write the conflict into the spec or receipt. Amendments require a dated note explaining why the rules changed and what verification/approval is affected.
