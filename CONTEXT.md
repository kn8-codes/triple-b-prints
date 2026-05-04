# BBB Prints — CONTEXT.md
Date: 2026-05-03
Purpose: Central source of truth for Triple B Prints (bbbprints.com) project scope, architecture, and real-problem framing

---

## The Real Problem

The client's biggest unspoken pain point is image quality. He doesn't have a graphic designer and doesn't know what makes a good print file. Customers send him bad graphics — low resolution, wrong format, transparency issues — and he accepts them and tries to make them work.

His current workaround is using xTool's AI features to upscale and edit images. This burns tokens and often doesn't produce clean print files. He's losing money on token spend AND time on bad prints AND reputation on bad customer outcomes.

The configurator we're building isn't just about "design your shirt." It's a quality gate. Reject bad input at the door, prevent bad files from ever reaching his print queue, and reduce his reliance on expensive third-party AI tools.

---

## V1 Configurator Quality Gate

Basic input validation that catches 80% of the problems:

- Resolution check (minimum dimensions per product type)
- DPI check (effective DPI for intended print size)
- File format check (accept PNG, hi-q JPG, SVG; reject the rest)
- File size check (flag too-small files)
- Color mode check (flag RGB/CMYK mismatches)
- Aspect ratio check (warn on bad fit)

Each rejection comes with a clear, plain-language explanation of what the customer needs to do to fix it.

Built on Fabric.js for the canvas/drag layer, with Sharp or similar Node image library on the backend for inspection and validation.

---

## V2 Roadmap (6-8 months)

- Transparency and background detection
- Auto-flatten and prep
- Color profile analysis (RGB to CMYK conversion)
- Built-in graphic library (pre-vetted designs, fonts, clip art)
- Print-realistic preview (shows what it will actually print like, not glossy mockup)
- Optional: integrated AI upscaling using cost-controlled prompts (flat-rate or owned model, not per-token third-party billing)

---

## V1 Stop-Gap for Client

Until V1 ships, get him on a working configurator now. Options:

1. Buy a managed configurator solution (Customily on Shopify, Inkybay, etc.) — fastest path, monthly cost, locks him to their platform
2. Build a lightweight Fabric.js scaffold inside the existing SvelteKit site — no monthly cost, less polished, but ours
3. Use a free open-source configurator and host it ourselves — middle path

Recommended: option 2. Lightweight Fabric.js scaffold gets him functional in 1-2 weekends, costs nothing ongoing, and gives us the foundation to grow into V1 when ready.

---

## Adjacent Product Opportunity

Once V1 is proven with BBB Prints, the quality gate is sellable as a standalone configurator product to other small print shops. Same pain point exists across the industry — print shops without in-house designers, drowning in bad customer files, wasting money on AI tools that don't fit their workflow.

Pricing model:
- $50-100/month managed deployment (we host, configure, support)
- $20-50/month self-hosted with paid support
- Free open-source core for self-hosters who want to figure it out themselves

Build for him. Generalize into a product. belt.works ethos: real software for real problems, sellable on the backend.

---

## Cost Structure (current)

Monthly recurring for BBB Prints operations:

- Vercel hosting: $0-20 (free tier likely sufficient)
- Supabase: $0-25 (free tier likely sufficient)
- Domain (bbbprints.com): ~$1.25/mo annualized
- Email (Resend free tier): $0
- Stripe: per-transaction only, not monthly

Total realistic monthly: $1.25 to $46.25

Bill structure to client TBD. Friend pricing applies — support, maintenance, security, training included for free as part of friendship. Formal services and net-new feature work billed separately.

---

## Look for the Real Problem (general principle)

The stated problem is rarely the biggest problem. Watch for what the client is doing as a workaround — that workaround is often the actual pain point.
If they're paying for tools to patch a process, the better tool replaces the patch. Build for the unspoken problem and the stated problem solves itself.

This principle applies across all belt.works projects, not just BBB Prints.

---

## Existing Architecture

- SvelteKit with adapter-vercel (serverless API routes for Stripe)
- Tailwind CSS
- Supabase schema scaffolded (not yet wired)
- Stripe Checkout integration live
- 9 product configurators with shared ProductConfigurator component
- Mobile-responsive CSS audit complete
- About/Contact pages (placeholder content)
- Promo pages: SAVEBUCK$, bulk-shirts, bulk-hats, tumblers

---

## Accessibility Standard (mandatory)

All pages, all delegated work:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support (aria-live, role attributes)
- Color contrast compliance
- Minimum 14px font on mobile
- 44px tap targets

---

*Forward to Hermes so all dispatched work going forward reflects the quality-gate framing.*
