# Triple B Configurator Productization Implementation Plan

> **For Hermes:** Use `subagent-driven-development` if executing this plan task-by-task. Do not implement from memory. Read the named files first.

**Goal:** Extract the duplicated Triple B Prints product configurator into a reusable, tested, productizable SvelteKit module and package it as a coherent product surface.

**Architecture:** Move product definitions and option logic into typed data modules. Move shared UI into `src/lib/components/configurator/`. Migrate one product route first, verify, then migrate the rest. Keep the static-site architecture; do not introduce backend complexity until Nate approves it.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS 4, static adapter.

---

## Current duplicated source files

Shop pages currently embedding product-specific configurator logic:

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

Do not delete these routes. Refactor them to consume shared modules.

---

## Phase 0 — Branch, baseline, and evidence

### Task 0.1: Confirm branch and baseline

**Objective:** Ensure implementation is not happening on `main` and current code passes before edits.

**Files:**
- Read: `package.json`
- Create/modify: `docs/productization/EVIDENCE.md`

**Step 1: Confirm branch**

Run:

```bash
git branch --show-current
```

Expected:

```text
plan/configurator-productization-2026-06-05
```

If not on a feature/plan branch, stop and create one:

```bash
git switch -c feature/configurator-productization
```

**Step 2: Run baseline check**

Run:

```bash
npm run check
```

Expected:

```text
svelte-check found 0 errors and 0 warnings
```

**Step 3: Create evidence file**

Create `docs/productization/EVIDENCE.md` with:

```markdown
# Triple B Configurator Productization Evidence

## Baseline

- Branch: `<branch>`
- Command: `npm run check`
- Result: `<paste exact output summary>`

## Migration checks

TBD.

## Manual smoke test

TBD.
```

**Step 4: Commit planning/evidence setup**

Run:

```bash
git add docs/productization/PROJECT_START.md docs/productization/IMPLEMENTATION_PLAN.md docs/productization/EVIDENCE.md
git commit -m "docs: plan configurator productization"
```

---

## Phase 1 — Model the product catalog

### Task 1.1: Create shared configurator types

**Objective:** Define the shape of products, option groups, uploaded artwork state, and quote/cart selections.

**Files:**
- Create: `src/lib/products/types.ts`

**Step 1: Create the file**

Create `src/lib/products/types.ts`:

```ts
export type ProductOption = {
	label: string;
	priceMod: number;
	hex?: string;
	description?: string;
};

export type ProductOptionGroup = {
	id: string;
	label: string;
	type: 'buttons' | 'swatches';
	defaultIndex: number;
	options: ProductOption[];
};

export type ProductDefinition = {
	slug: string;
	name: string;
	basePrice: number;
	description: string;
	image: string;
	metaTitle: string;
	metaDescription: string;
	previewAlt: string;
	artworkAreaLabel: string;
	optionGroups: ProductOptionGroup[];
};

export type SelectedOptions = Record<string, ProductOption>;

export type ArtworkPlacement = {
	x: number;
	y: number;
	scale: number;
};

export type ConfiguratorSelection = {
	productSlug: string;
	selectedOptions: SelectedOptions;
	artworkUploaded: boolean;
	artworkPlacement: ArtworkPlacement;
	totalPrice: number;
};
```

**Step 2: Run check**

Run:

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/products/types.ts
git commit -m "feat: add configurator product types"
```

---

### Task 1.2: Create shared pricing helper

**Objective:** Move price math out of route components.

**Files:**
- Create: `src/lib/products/pricing.ts`

**Step 1: Create helper**

Create `src/lib/products/pricing.ts`:

```ts
import type { ProductDefinition, SelectedOptions } from './types';

export function calculateProductPrice(product: ProductDefinition, selectedOptions: SelectedOptions): number {
	return Object.values(selectedOptions).reduce((total, option) => total + option.priceMod, product.basePrice);
}

export function describePriceBreakdown(product: ProductDefinition, selectedOptions: SelectedOptions): string {
	const modifiers = Object.entries(selectedOptions)
		.filter(([, option]) => option.priceMod > 0)
		.map(([groupId, option]) => `${groupId}: +$${option.priceMod}`);

	return [`Base: $${product.basePrice}`, ...modifiers].join(' + ');
}
```

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/products/pricing.ts
git commit -m "feat: add configurator pricing helpers"
```

---

### Task 1.3: Centralize product catalog

**Objective:** Extract product/option data into one source of truth.

**Files:**
- Create: `src/lib/products/catalog.ts`
- Read from: all `src/routes/shop/*/+page.svelte`

**Step 1: Create initial catalog with one product**

Start with only `t-shirt` so the first migration is small.

Create `src/lib/products/catalog.ts`:

```ts
import type { ProductDefinition, ProductOption, SelectedOptions } from './types';

export const products: ProductDefinition[] = [
	{
		slug: 't-shirt',
		name: 'Custom T-Shirt',
		basePrice: 18,
		description: 'Premium cotton tee with your custom artwork. Soft, durable, and made to stand out.',
		image: 'https://placehold.co/600x700/1e293b/ffffff?text=T-Shirt+Base',
		metaTitle: 'Custom T-Shirt | Triple B Prints',
		metaDescription: 'Design your own custom t-shirt with Triple B Prints. Upload artwork, pick size and color.',
		previewAlt: 'T-shirt preview showing your uploaded artwork',
		artworkAreaLabel: 'Your uploaded artwork, draggable. Use arrow keys to fine-tune position.',
		optionGroups: [
			{
				id: 'size',
				label: 'Size',
				type: 'buttons',
				defaultIndex: 2,
				options: [
					{ label: 'S', priceMod: 0 },
					{ label: 'M', priceMod: 0 },
					{ label: 'L', priceMod: 0 },
					{ label: 'XL', priceMod: 2 },
					{ label: '2XL', priceMod: 4 }
				]
			},
			{
				id: 'color',
				label: 'Color',
				type: 'swatches',
				defaultIndex: 0,
				options: [
					{ label: 'Black', priceMod: 0, hex: '#1a1a1a' },
					{ label: 'White', priceMod: 0, hex: '#f5f5f5' },
					{ label: 'Navy', priceMod: 0, hex: '#1e3a5f' },
					{ label: 'Red', priceMod: 0, hex: '#cc0000' }
				]
			}
		]
	}
];

export function getProductBySlug(slug: string): ProductDefinition | undefined {
	return products.find((product) => product.slug === slug);
}

export function getDefaultSelectedOptions(product: ProductDefinition): SelectedOptions {
	return Object.fromEntries(
		product.optionGroups.map((group) => [group.id, group.options[group.defaultIndex] as ProductOption])
	);
}
```

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/products/catalog.ts
git commit -m "feat: add centralized product catalog"
```

---

## Phase 2 — Extract reusable configurator UI

### Task 2.1: Create option selector component

**Objective:** Replace bespoke size/color selectors with a reusable component.

**Files:**
- Create: `src/lib/components/configurator/OptionGroup.svelte`

**Step 1: Create component**

Create `src/lib/components/configurator/OptionGroup.svelte`:

```svelte
<script lang="ts">
	import type { ProductOption, ProductOptionGroup } from '$lib/products/types';

	let {
		group,
		selected,
		onSelect
	}: {
		group: ProductOptionGroup;
		selected: ProductOption;
		onSelect: (option: ProductOption) => void;
	} = $props();
</script>

<div>
	<h3 class="text-lg font-bold text-slate-900 mb-3" id={`${group.id}-label`}>{group.label}</h3>

	<div class="flex flex-wrap gap-3" role="radiogroup" aria-labelledby={`${group.id}-label`}>
		{#each group.options as option}
			{#if group.type === 'swatches'}
				<button
					class="w-12 h-12 rounded-full border-4 transition-all {selected.label === option.label
						? 'border-yellow-400 scale-110'
						: 'border-transparent hover:scale-105'}"
					style={`background-color: ${option.hex ?? '#f5f5f5'};`}
					onclick={() => onSelect(option)}
					aria-label={option.label}
					role="radio"
					aria-checked={selected.label === option.label}
					tabindex={selected.label === option.label ? 0 : -1}
				>
					{#if selected.label === option.label}
						<div class="w-full h-full flex items-center justify-center">
							<span class="text-white drop-shadow-md font-black" aria-hidden="true">✓</span>
						</div>
					{/if}
				</button>
			{:else}
				<button
					class="min-h-11 px-4 py-2.5 rounded-lg font-bold transition-all {selected.label === option.label
						? 'bg-slate-900 text-white'
						: 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
					onclick={() => onSelect(option)}
					role="radio"
					aria-checked={selected.label === option.label}
					tabindex={selected.label === option.label ? 0 : -1}
				>
					{option.label}
					{#if option.priceMod > 0}
						<span class="text-xs ml-1 opacity-70">+${option.priceMod}</span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>

	{#if group.type === 'swatches'}
		<p class="text-sm text-slate-600 mt-2 font-medium">{selected.label}</p>
	{/if}
</div>
```

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/components/configurator/OptionGroup.svelte
git commit -m "feat: add reusable configurator option group"
```

---

### Task 2.2: Create artwork upload component

**Objective:** Isolate upload/dropzone UI and file validation.

**Files:**
- Create: `src/lib/components/configurator/ArtworkUploader.svelte`

**Step 1: Create component**

Create `src/lib/components/configurator/ArtworkUploader.svelte`:

```svelte
<script lang="ts">
	let {
		uploadedImage,
		onUpload
	}: {
		uploadedImage: string | null;
		onUpload: (imageDataUrl: string) => void;
	} = $props();

	let isDragOver = $state(false);

	function handleFileUpload(file: File) {
		if (!file.type.startsWith('image/')) return;
		const reader = new FileReader();
		reader.onload = (event) => onUpload(event.target?.result as string);
		reader.readAsDataURL(file);
	}

	function onFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFileUpload(file);
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function onDragLeave() {
		isDragOver = false;
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		const file = event.dataTransfer?.files[0];
		if (file) handleFileUpload(file);
	}
</script>

<div>
	<h3 class="text-lg font-bold text-slate-900 mb-3" id="upload-label">Your Artwork</h3>
	<label
		class="block w-full border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer {isDragOver
			? 'border-rose-600 bg-rose-50'
			: 'border-slate-300 hover:border-yellow-400 hover:bg-yellow-50'}"
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		ondrop={onDrop}
		aria-labelledby="upload-label"
	>
		<input
			type="file"
			accept="image/png,image/jpeg,image/svg+xml"
			class="hidden"
			onchange={onFileInput}
			aria-label="Upload your artwork image"
		/>
		<div class="w-10 h-10 text-slate-400 mx-auto mb-2 text-3xl" aria-hidden="true">⇧</div>
		<p class="font-bold text-slate-700">Click to upload or drag and drop</p>
		<p class="text-sm text-slate-500 mt-1">PNG, JPG, SVG up to 25MB</p>
	</label>
	{#if uploadedImage}
		<p class="text-sm text-green-600 font-medium mt-2" role="status" aria-live="polite">✓ Artwork uploaded</p>
	{/if}
</div>
```

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/components/configurator/ArtworkUploader.svelte
git commit -m "feat: add reusable artwork uploader"
```

---

### Task 2.3: Create product preview component

**Objective:** Isolate preview image, color overlay, artwork placement, drag movement, keyboard movement, and scale control.

**Files:**
- Create: `src/lib/components/configurator/ProductPreview.svelte`

**Step 1: Create component**

Move the preview logic from `src/routes/shop/t-shirt/+page.svelte` into a reusable component. Keep the same behavior first; do not redesign in this task.

Component props:

```ts
{
	product: ProductDefinition;
	uploadedImage: string | null;
	colorHex?: string;
	placement: ArtworkPlacement;
	onPlacementChange: (placement: ArtworkPlacement) => void;
}
```

Important implementation details:
- Keep `onMount` global mouse/touch cleanup.
- Keep `touchmove` with `{ passive: false }`.
- Keep keyboard arrow controls.
- Clamp `x` and `y` to 5–95.
- Clamp `scale` to 0.5–2.

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/components/configurator/ProductPreview.svelte
git commit -m "feat: add reusable product preview"
```

---

### Task 2.4: Create full ProductConfigurator component

**Objective:** Compose product preview, option groups, uploader, pricing, and mock quote/cart action.

**Files:**
- Create: `src/lib/components/configurator/ProductConfigurator.svelte`

**Component behavior:**
- Accept `product: ProductDefinition`.
- Initialize selected options from `getDefaultSelectedOptions(product)`.
- Compute `totalPrice` with `calculateProductPrice`.
- Show price and breakdown.
- Render every product `optionGroup` using `OptionGroup`.
- Use swatch group with id `color` as the preview tint source when present.
- Upload artwork via `ArtworkUploader`.
- Use `ProductPreview` for display.
- Button text should be product-agnostic:
  - disabled: `Upload Artwork to Continue`
  - enabled: `Save Mock Quote — $${totalPrice}`
  - success: `Mock Quote Saved!`

**Step 1: Create component**

Create `src/lib/components/configurator/ProductConfigurator.svelte` and wire imported components/helpers.

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/components/configurator/ProductConfigurator.svelte
git commit -m "feat: compose reusable product configurator"
```

---

## Phase 3 — Migrate first route

### Task 3.1: Migrate `/shop/t-shirt`

**Objective:** Prove the reusable configurator can replace one embedded page.

**Files:**
- Modify: `src/routes/shop/t-shirt/+page.svelte`

**Step 1: Replace embedded logic**

The page should become mostly:

```svelte
<script lang="ts">
	import ProductConfigurator from '$lib/components/configurator/ProductConfigurator.svelte';
	import { getProductBySlug } from '$lib/products/catalog';

	const product = getProductBySlug('t-shirt');
</script>

<svelte:head>
	<title>{product?.metaTitle ?? 'Custom Product | Triple B Prints'}</title>
	<meta name="description" content={product?.metaDescription ?? 'Customize a product with Triple B Prints.'} />
</svelte:head>

<div class="bg-slate-900 text-slate-400 py-4">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<a href="/" class="hover:text-yellow-400 transition-colors">← Back to Home</a>
	</div>
</div>

{#if product}
	<ProductConfigurator {product} />
{:else}
	<section class="py-20 bg-white">
		<div class="max-w-6xl mx-auto px-4 sm:px-6">
			<h1 class="text-3xl font-black text-slate-900">Product not found</h1>
		</div>
	</section>
{/if}
```

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Run build**

```bash
npm run build
```

Expected: successful static build.

**Step 4: Manual smoke test**

Run local dev server:

```bash
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/shop/t-shirt
```

Verify:
- page loads;
- size buttons change selected state;
- color swatches change selected state and preview tint;
- upload accepts PNG/JPG/SVG;
- artwork appears;
- artwork drags;
- scale slider works;
- mock quote button becomes enabled;
- mock quote success state appears.

Record results in `docs/productization/EVIDENCE.md`.

**Step 5: Commit**

```bash
git add src/routes/shop/t-shirt/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate t-shirt route to shared configurator"
```

---

## Phase 4 — Expand catalog and migrate remaining products

### Task 4.1: Add all remaining product definitions

**Objective:** Move product and option data for all existing products into the catalog.

**Files:**
- Modify: `src/lib/products/catalog.ts`
- Read: all remaining `src/routes/shop/*/+page.svelte`

**Products to add:**

```text
hoodie
mug
hat
keychain
phone-case
coaster
shorts
joggers
```

**Step 1: Extract each product definition**

For each page, copy:
- name;
- basePrice;
- description;
- image;
- meta title;
- meta description;
- option groups;
- default selected option indexes.

Normalize option groups to the catalog model:
- sizes/styles/models/sets/finishes/methods -> `buttons`
- colors -> `swatches`

**Step 2: Run check**

```bash
npm run check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/products/catalog.ts
git commit -m "feat: add full product catalog"
```

---

### Task 4.2: Migrate `/shop/hoodie`

**Objective:** Replace duplicate hoodie configurator with shared component.

**Files:**
- Modify: `src/routes/shop/hoodie/+page.svelte`

**Steps:**
1. Read current file.
2. Replace local state/handlers with `ProductConfigurator` + `getProductBySlug('hoodie')`.
3. Run `npm run check`.
4. Manually open `/shop/hoodie`.
5. Verify options, upload, drag, price.
6. Record in `docs/productization/EVIDENCE.md`.
7. Commit:

```bash
git add src/routes/shop/hoodie/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate hoodie route to shared configurator"
```

---

### Task 4.3: Migrate `/shop/mug`

Same pattern as Task 4.2.

Commit:

```bash
git add src/routes/shop/mug/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate mug route to shared configurator"
```

---

### Task 4.4: Migrate `/shop/hat`

Same pattern as Task 4.2.

Pay attention to multiple option groups: style + method + color.

Commit:

```bash
git add src/routes/shop/hat/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate hat route to shared configurator"
```

---

### Task 4.5: Migrate `/shop/keychain`

Same pattern as Task 4.2.

Pay attention to shape option group.

Commit:

```bash
git add src/routes/shop/keychain/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate keychain route to shared configurator"
```

---

### Task 4.6: Migrate `/shop/phone-case`

Same pattern as Task 4.2.

Pay attention to model + finish option groups.

Commit:

```bash
git add src/routes/shop/phone-case/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate phone case route to shared configurator"
```

---

### Task 4.7: Migrate `/shop/coaster`

Same pattern as Task 4.2.

Pay attention to set/quantity option group.

Commit:

```bash
git add src/routes/shop/coaster/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate coaster route to shared configurator"
```

---

### Task 4.8: Migrate `/shop/shorts`

Same pattern as Task 4.2.

Commit:

```bash
git add src/routes/shop/shorts/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate shorts route to shared configurator"
```

---

### Task 4.9: Migrate `/shop/joggers`

Same pattern as Task 4.2.

Commit:

```bash
git add src/routes/shop/joggers/+page.svelte docs/productization/EVIDENCE.md
git commit -m "refactor: migrate joggers route to shared configurator"
```

---

## Phase 5 — Package the configurator as a product

### Task 5.1: Create productized configurator landing page

**Objective:** Give Nate/Andy/Peter a page that frames the configurator as a product, not just a shop feature.

**Files:**
- Create: `src/routes/configurator/+page.svelte`
- Modify: `src/routes/+layout.svelte`

**Page sections:**
1. Hero: “Custom merch quotes without the chaos.”
2. Embedded preview of one product configurator or CTA cards to products.
3. “What it does” cards:
   - choose product;
   - upload artwork;
   - place/resize artwork;
   - generate mock quote.
4. “Not live yet” boundary:
   - no payments;
   - no real file storage;
   - no customer account.
5. CTA:
   - “Try T-Shirt Configurator” -> `/shop/t-shirt`
   - “View All Products” -> `/#products`

**Step 1: Add nav item**

In `src/routes/+layout.svelte`, add:

```ts
{ href: '/configurator', label: 'Configurator' },
```

Keep nav usable on mobile.

**Step 2: Create page**

Create `src/routes/configurator/+page.svelte` with static content and links.

**Step 3: Run checks**

```bash
npm run check
npm run build
```

Expected: both pass.

**Step 4: Commit**

```bash
git add src/routes/configurator/+page.svelte src/routes/+layout.svelte
git commit -m "feat: add configurator product landing page"
```

---

### Task 5.2: Replace “Add to Cart” language with product-safe language

**Objective:** Avoid implying live checkout where none exists.

**Files:**
- Modify: `src/lib/components/configurator/ProductConfigurator.svelte`

**Required copy changes:**
- Replace “Add to Cart” with “Save Mock Quote” or “Prepare Quote”.
- Replace “checkout” with “quote review”.
- Add small boundary copy near the button:

```text
Demo only: this does not submit payment or upload your file to a server yet.
```

**Step 1: Update copy**

Edit component copy only.

**Step 2: Run checks**

```bash
npm run check
npm run build
```

Expected: both pass.

**Step 3: Commit**

```bash
git add src/lib/components/configurator/ProductConfigurator.svelte
git commit -m "fix: clarify configurator mock quote boundary"
```

---

### Task 5.3: Improve the visual polish pass

**Objective:** Bring the configurator closer to the premium visual direction from the BBB Prints mockup while keeping this repo stable.

**Files:**
- Modify: `src/lib/components/configurator/ProductConfigurator.svelte`
- Modify: `src/lib/components/configurator/ProductPreview.svelte`
- Modify: `src/lib/components/configurator/OptionGroup.svelte`
- Optional modify: `src/routes/configurator/+page.svelte`

**Andy lane guidance:**
- Make the preview feel like a studio product card, not a form.
- Keep primary action visible above the fold on desktop.
- Make option groups scan as “steps.”
- Add status chips: `1 Choose`, `2 Upload`, `3 Place`, `4 Quote`.
- Do not add new dependencies.
- Do not redesign the whole site in this task.

**Step 1: Apply visual polish**

Keep the first pass bounded to component classes and copy.

**Step 2: Run checks**

```bash
npm run check
npm run build
```

Expected: both pass.

**Step 3: Visual smoke test**

Open:

```text
/configurator
/shop/t-shirt
/shop/hoodie
/shop/mug
```

Verify no obvious overlap, crushed text, or mobile breakage.

**Step 4: Commit**

```bash
git add src/lib/components/configurator src/routes/configurator/+page.svelte docs/productization/EVIDENCE.md
git commit -m "style: polish configurator product experience"
```

---

## Phase 6 — Final verification and packaging

### Task 6.1: Full route smoke test

**Objective:** Verify every migrated route still works.

**Files:**
- Modify: `docs/productization/EVIDENCE.md`

**Run:**

```bash
npm run check
npm run build
npm run preview -- --host 127.0.0.1
```

Open and verify:

```text
/
/configurator
/shop/t-shirt
/shop/hoodie
/shop/mug
/shop/hat
/shop/keychain
/shop/phone-case
/shop/coaster
/shop/shorts
/shop/joggers
/promo/savebucks
/equipment
/turnkey-interview
```

For each `/shop/*` route, record:
- loads without console error;
- option selection works;
- upload works;
- artwork drag works;
- scale works;
- mock quote action works;
- price changes when paid options are selected.

**Commit:**

```bash
git add docs/productization/EVIDENCE.md
git commit -m "docs: record configurator verification evidence"
```

---

### Task 6.2: Create Nate-facing product handoff

**Objective:** Give Nate a short artifact he can use with Andy/Peter without reading implementation guts.

**Files:**
- Create: `docs/productization/HANDOFF.md`

**Required sections:**

```markdown
# Triple B Configurator Product Handoff

## What exists now

## What changed

## How to run it locally

## What to look at first

## What is still mock/demo

## What decisions Nate needs to make

## Recommended next sprint
```

**Run checks:**

```bash
npm run check
npm run build
```

**Commit:**

```bash
git add docs/productization/HANDOFF.md
git commit -m "docs: add configurator product handoff"
```

---

## Phase 7 — Optional future build lanes

Do not do these until Nate approves.

### Future Lane A: Real quote submission

Possible files:

```text
src/routes/api/quote/+server.ts
src/lib/server/quotes.ts
src/lib/products/quote-schema.ts
```

Needs decision:
- email-only submission;
- Supabase table;
- local JSON export;
- Airtable/Notion intake.

### Future Lane B: Real file storage

Needs decision:
- Supabase Storage;
- S3/R2;
- manual upload handoff;
- max file size and cleanup policy.

### Future Lane C: Checkout

Needs decision:
- Stripe Checkout;
- Square;
- invoice/manual payment;
- no checkout, quote-only.

### Future Lane D: Configurator as reusable template product

Extract as:

```text
src/lib/components/configurator/
src/lib/products/
docs/template-usage.md
```

Package offer:
- “Print shop configurator starter”
- “Local merch quote builder”
- “Custom product intake page”

---

## Recommended execution order for Egon / Andy / Peter

1. **Egon:** Validate catalog model and write `types.ts`, `pricing.ts`, `catalog.ts` for t-shirt.
2. **Peter:** Extract component set and migrate `/shop/t-shirt`.
3. **Egon:** Review for behavior parity and Svelte correctness.
4. **Peter:** Migrate remaining routes one at a time.
5. **Andy:** Polish product landing page and component hierarchy.
6. **Egon:** Final checks, build, route smoke test, evidence file.
7. **Nate:** Review locally before any deploy.

## Stop conditions

Stop and ask Nate before continuing if:
- real payments enter scope;
- real uploads/storage enter scope;
- pricing claims need changing;
- old pages need deletion;
- visual direction conflicts with the premium mockup direction;
- implementation exceeds refactor/productization and becomes a new commerce platform.

Small things become platforms when nobody says no. Say no early. It’s cheaper.
