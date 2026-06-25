# Triple B Prints Agent Context

This repo is now wired for GitHub Spec Kit with Codex skills.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan.
<!-- SPECKIT END -->

## Project overview

Triple B Prints / BBB Prints is a SvelteKit client-facing site and quote/configurator demo. Current high-value lane: premium Press Room configurator polish and client-safe quote flow.

## Stack

- SvelteKit / Svelte 5
- Vite
- TypeScript
- Tailwind CSS
- Sharp
- Stripe dependency is present, but live commerce/payment behavior is approval-gated.

## Commands

```bash
npm run check
npm run build
npm run smoke:checkout-boundary
npm run dev
npm run preview
```

## Spec Kit workflow

Use Spec Kit for new slices:

```text
$speckit-constitution
$speckit-specify
$speckit-clarify
$speckit-plan
$speckit-tasks
$speckit-implement
```

Project constitution:

```text
.specify/memory/constitution.md
```

## Evidence requirements

For meaningful changes, verify with:

- `npm run check`
- `npm run build`
- `npm run smoke:checkout-boundary` when commerce/quote boundary could be affected
- screenshot or route smoke for visual/mobile changes
- receipt under the matching MESH_BOARD project receipt folder

Agent narration is not evidence.

## Approval gates

Do not commit, push, deploy, publish client-facing changes, change Stripe/payment behavior, send client messages, delete files, or discard work without Nate approval.

## Product guardrail

If checkout is not live, avoid copy that implies live purchase. Prefer quote/mock quote language.
