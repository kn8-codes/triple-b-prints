# BBB Prints — Build Roadmap

**Project:** Triple B Prints (bbbprints.com)  
**Date:** 2026-05-03  
**Status:** V1 Quality Gate LIVE. Stripe checkout LIVE. Mobile audit DONE.  
**Next milestone:** Client interview → real specs → hard block promotion.

---

## How to read this roadmap

- **Phase** = major functional chunk (weeks, not days)
- **Milestone** = shippable state. Commit, deploy, report hash.
- **Dependency** = must complete before this item starts
- **Interview trigger** = what to ask the client to unblock this item
- **Blocked** = waiting on external input (client, vendor, API)
- **In progress** = assigned to Jeep or fleet node
- **Done** = deployed to bbbprints.com, commit hash recorded

---

## Phase 0: Foundation (DONE)

| Milestone | Status | Commit | Notes |
|-----------|--------|--------|-------|
| SvelteKit scaffold + Supabase schema | Done | `865759e` | 9 commits total |
| Homepage + product grid | Done | `e9bfe55` | Client logo placeholder |
| 9 product configurator stubs | Done | `f299c49` | T-shirt, mug, keychain, coaster, hoodie, hat, phone-case, shorts, joggers |
| Promo pages (SAVEBUCK$, bulk) | Done | `f299c49` | Stubs, not wired |
| Mobile CSS audit | Done | `7191b1a` (M1) | Merged via cherry-pick |
| Stripe Checkout integration | Done | `091a1b9` (M4) | Test keys, env-var ready |
| About / Contact placeholders | Done | `a1b2c3d` | PLACEHOLDER markers throughout |
| Equipment page stub | Done | `f299c49` | Affiliate revenue opportunity |

---

## Phase 1: Quality Gate V1 (DONE — 2026-05-03)

**Goal:** Warn customers about bad files. Don't block. Gather data.

| Milestone | Status | Commit | Notes |
|-----------|--------|--------|-------|
| Sharp backend validation endpoint | Done | `e4a5577` | `/api/validate-artwork` |
| Product-specific rules table | Done | `e4a5577` | **V1 defaults — REPLACE WITH REAL SPECS** |
| Frontend wiring + rejection UI | Done | `51edb49` | Conversational messages, warn-don't-block |
| Track ignored warnings | Done | `51edb49` | `ignoredWarningCount` in API response |
| Checkout validation pre-flight | Done | `51edb49` | Calls validate-artwork before Stripe session |

**V1 validation rules (DEFAULTS — pending client confirmation):**

```
T-shirt/hoodie:  3000x3000px, 300 DPI, 25MB, PNG/JPG/SVG
Mug:             1500x1000px, 300 DPI, 10MB, PNG/JPG/SVG
Keychain:        1000x1000px,  300 DPI,  5MB, PNG/JPG/SVG
Coaster:         1500x1500px, 300 DPI, 10MB, PNG/JPG/SVG
Hat:             1500x1000px, 300 DPI, 10MB, PNG/JPG/SVG
Phone case:      1500x2500px, 300 DPI, 10MB, PNG/JPG/SVG
Shorts/joggers:  2000x2000px, 300 DPI, 15MB, PNG/JPG/SVG
```

⚠️ **These are best guesses.** Replace with client's actual print equipment specs.

---

## Phase 2: Real Specs + Hard Blocks (BLOCKED — needs client interview)

**Goal:** Replace V1 defaults with real numbers. Promote warnings to hard blocks where appropriate.

| Milestone | Status | Dependency | Interview trigger |
|-----------|--------|------------|-------------------|
| Get xTool printer model numbers | Blocked | — | "What xTool model do you have? P2? S1? F1 Ultra?" |
| Look up xTool official print specs | Blocked | Model numbers | Google "xTool [model] print area resolution" |
| Get DTG printer specs (if separate) | Blocked | — | "What DTG printer for shirts? Epson F2100? Brother GTX?" |
| Get laser engraver bed size | Blocked | — | "What's the max engraving area on your laser?" |
| Get PNC (print-and-cut) tool constraints | Blocked | — | "What machine for stickers/decals? Cricut? Silhouette?" |
| Update `productRules` table with real specs | Blocked | All specs above | — |
| Decide which rules become hard blocks | Blocked | Real specs + usage data | "Which problems cost you the most time?" |
| Implement hard-block mode (v1.5) | Blocked | Decision on hard blocks | — |

**Interview script for Phase 2:**

```
1. "Walk me through a bad file that wasted your time last week."
2. "What equipment do you actually print on? Model numbers matter."
3. "What file format do you prefer from customers?"
4. "Have you ever had to reject a file after the customer already paid?"
5. "What's the smallest resolution you've made work? What's the largest?"
6. "Do you ever get transparent PNGs that print with white boxes?"
7. "What would save you more time: catching bad files early, or auto-fixing them?"
```

---

## Phase 3: Content + Copy (BLOCKED — needs client interview)

**Goal:** Replace all PLACEHOLDER content with real client copy, photos, pricing.

| Milestone | Status | Dependency | Interview trigger |
|-----------|--------|------------|-------------------|
| Real About page copy | Blocked | Client interview | "Tell me the origin story — how did Triple B start?" |
| Real Contact page (phone, email, hours) | Blocked | Client interview | "What's the best way for customers to reach you?" |
| Real product photos (not mockups) | Blocked | Client provides | "Can you send photos of actual printed products?" |
| Real pricing per product/size | Blocked | Client interview | "What's your actual cost and markup per item?" |
| Equipment page with affiliate links | Blocked | xTool affiliate approval | "Want to earn commission on equipment you recommend?" |
| Commission split agreement | Blocked | Client conversation | "Affiliate revenue — split 50/50 or apply to my bill?" |

---

## Phase 4: Fabric.js Configurator (READY TO START)

**Goal:** Drag-and-drop artwork positioning with print-realistic preview.

| Milestone | Status | Dependency | Notes |
|-----------|--------|------------|-------|
| Fabric.js canvas scaffold | Ready | — | Install `fabric` npm package |
| Artwork upload → canvas | Ready | — | Reuse existing upload flow |
| Drag positioning on product mockup | Ready | Real product photos | Use placeholder mockups until photos arrive |
| Scale/rotate controls | Ready | — | Fabric.js built-in |
| Print-realistic preview mode | Ready | Real specs | Show what it'll actually look like, not glossy |
| Mobile touch support | Ready | — | `touch-none`, `ontouchstart` |
| Keyboard arrow-key nudge | Ready | — | 1px step, 5px with shift |
| a11y compliance | Ready | — | `role="button"`, `aria-label`, focus rings |

**Not doing in Phase 4:**
- Text editor (customer adds text) — V2 scope
- Built-in graphic library — V2 scope
- AI upscaling — V2 scope

---

## Phase 5: Supabase Backend (READY TO START)

**Goal:** Persist orders, customer data, analytics.

| Milestone | Status | Dependency | Notes |
|-----------|--------|------------|-------|
| Wire Supabase schema | Ready | — | Schema already scaffolded |
| Order table (post-Stripe webhook) | Ready | Stripe live keys | Listen for `checkout.session.completed` |
| Customer table | Ready | — | Email, phone, order history |
| Upload history table | Ready | — | Track what customers uploaded, validation results |
| Ignored warnings analytics | Ready | — | Which rules get ignored most? |
| Admin dashboard (client view) | Ready | — | Orders, uploads, validation stats |

---

## Phase 6: Stripe Live (BLOCKED — needs client setup)

| Milestone | Status | Dependency | Notes |
|-----------|--------|------------|-------|
| Client creates Stripe account | Blocked | Client action | Takes 10 minutes |
| Add live keys to Vercel env vars | Blocked | Stripe account | `STRIPE_SECRET_KEY`, `PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Test live checkout | Blocked | Live keys | Small test transaction |
| Refund test transaction | Blocked | Live checkout | Verify full loop |
| Stripe tax / shipping config | Blocked | Client preference | Ohio sales tax? Flat shipping? |

---

## Phase 7: Launch Prep (BLOCKED — needs Phase 2-6)

| Milestone | Status | Dependency |
|-----------|--------|------------|
| Google Analytics / Plausible | Blocked | Client preference |
| SEO meta tags, sitemap | Blocked | Real copy finalized |
| Social share images (OpenGraph) | Blocked | Real product photos |
| Privacy policy + terms | Blocked | Template + client review |
| Final client walkthrough | Blocked | All content real |
| Go-live announcement | Blocked | Client approval |

---

## Adjacent Product: Quality Gate SaaS (FUTURE)

Once BBB Prints V1 is proven, generalize the validation layer into a standalone product for other print shops.

| Milestone | Status | Dependency |
|-----------|--------|------------|
| Extract validation engine from BBB Prints | Future | V1 proven |
| Standalone npm package (`@beltworks/print-gate`) | Future | Engine extracted |
| Self-hosted Docker image | Future | Package published |
| Managed hosting tier ($50-100/mo) | Future | 3+ customers |
| Open-source core (free) | Future | Community interest |

---

## Current Blockers (as of 2026-05-03)

1. **xTool model numbers** — need from client to look up real specs
2. **Client interview** — origin story, pricing, equipment, bad-file stories
3. **Real product photos** — client must provide or we shoot them
4. **Stripe live keys** — client must create account
5. **xTool affiliate approval** — apply with client

---

## Cost Tracking

| Item | Actual | Projected |
|------|--------|-----------|
| Domain (bbbprints.com) | $6 (GoDaddy) | $12/yr |
| Vercel hosting | $0 | $0-20/mo |
| Supabase | $0 | $0-25/mo |
| Stripe | $0 | per-transaction |
| Resend email | $0 | $0 |
| **Total monthly** | **$1.25** | **$1.25-46.25** |

---

## Commit Log (recent)

- `51edb49` — V1 quality gate: warn don't block, conversational messages, track ignored
- `e4a5577` — Sharp validation endpoint + product rules table
- `8d957ee` — Quality gate framing docs
- `8b4a80d` — Vercel adapter fix for Stripe serverless

---

*Last updated: 2026-05-03 by kn8bot-jeep*  
*Next expected update: after client interview (pending)*
