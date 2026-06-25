<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { STRIPE_PUBLISHABLE_KEY } from '$lib/stripe';
	import {
		ACCEPTED_ARTWORK_MIME_TYPES,
		clampQuantity,
		formatArtworkFileMeta,
		validateArtworkFile
	} from '$lib/configurator';
	import { buildPrintJobEmailTemplate, buildPrintJobHandoffReport } from '$lib/printJobHandoff';
	import type { OptionGroup, ProductConfig, SwatchOption } from '$lib/data/shopProducts';

	let { product } = $props<{ product: ProductConfig }>();

	// We store the currently-selected option for each group in one object so the UI, price display,
	// and checkout payload all read from the exact same source of truth.
	const initialSelections = untrack(() =>
		Object.fromEntries(product.optionGroups.map((group: OptionGroup) => [group.id, group.options[0]])) as Record<string, SwatchOption>
	);

	let selections = $state<Record<string, SwatchOption>>(initialSelections);
	let uploadedImage = $state<string | null>(null);
	let uploadedArtworkName = $state('');
	let uploadedArtworkMeta = $state('');
	let uploadedArtworkUrl = $state('');
	let artworkStorageStatus = $state<'attached' | 'not_configured' | 'failed' | 'local_preview_only'>('local_preview_only');
	let artworkStorageMessage = $state('');
	let imagePosition = $state(untrack(() => ({ ...product.artworkPosition })));
	let imageScale = $state(1);
	let quantity = $state(1);
	let isDragging = $state(false);
	let isResizing = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	let resizeStart = $state({ x: 0, y: 0 });
	let resizeStartScale = $state(1);
	let previewRef = $state<HTMLDivElement | null>(null);
	let buyButtonRef = $state<HTMLButtonElement | null>(null);
	let liveRegionRef = $state<HTMLParagraphElement | null>(null);
	let errorRegionRef = $state<HTMLDivElement | null>(null);
	let isDragOver = $state(false);
	let isCheckingOut = $state(false);
	let colorMode = $state<'preset' | 'custom'>('preset');
	let customColor = $state(untrack(() => product.colorConfig?.defaultColor ?? selections.color?.hex ?? '#111111'));
	let liveMessage = $state('');
	let errorMessage = $state('');
	let validationWarnings = $state<string[]>([]);
	let validationMessage = $state('');
	let isValidatingArtwork = $state(false);
	let handoffCopyStatus = $state('');
	const requestEmail = 'triplebp330@gmail.com';

	// Total unit price is derived from the base price, selected option modifiers, and explicit artwork-size adjustment.
	// Keeping this calculation derived avoids price drift between the UI and the quote/checkout request.
	let optionPrice = $derived(Object.values(selections).reduce((sum, option) => sum + option.priceMod, 0));
	let artworkSizePrice = $derived(calculateArtworkSizePrice(imageScale));
	let unitPrice = $derived(product.basePrice + optionPrice + artworkSizePrice);
	let orderTotal = $derived(unitPrice * quantity);
	let selectedGarmentColor = $derived(
		colorMode === 'custom' ? customColor : selections.color?.hex ?? product.colorConfig?.defaultColor ?? '#111111'
	);
	let colorSelection = $derived(colorMode === 'custom' ? `Custom preview ${selectedGarmentColor.toUpperCase()}` : selections.color?.label ?? 'Default');
	let garmentColorTone = $derived(getGarmentColorTone(selectedGarmentColor));
	let contrastHint = $derived(
		garmentColorTone === 'dark'
			? 'Light or outlined artwork will read best on this garment color.'
			: garmentColorTone === 'light'
				? 'Dark or outlined artwork will read best on this garment color.'
				: 'High-contrast artwork will read best on this garment color.'
	);
	let sizeSelection = $derived(selections.size?.label ?? 'Standard');
	let printSelection = $derived(selections['print-location']?.label ?? 'Standard print');
	let handoffInput = $derived({
		productName: product.name,
		productSlug: product.slug,
		quantity,
		unitPrice,
		orderTotal,
		sizeLabel: sizeSelection,
		colorLabel: colorSelection,
		printLocationLabel: printSelection,
		artworkReference: uploadedArtworkName ? `${uploadedArtworkName} (${uploadedArtworkMeta})` : '',
		artworkUploaded: Boolean(uploadedImage),
		artworkUrl: uploadedArtworkUrl,
		artworkStorageStatus,
		artworkStorageMessage,
		artworkScale: imageScale,
		artworkPosition: imagePosition,
		artworkSizePrice,
		previewGarmentColorHex: selectedGarmentColor.toUpperCase(),
		colorPreviewMode: colorMode,
		selectedOptions: Object.fromEntries(Object.entries(selections).map(([groupId, option]) => [groupId, option.label])),
		qualityWarnings: validationWarnings
	});
	let printJobHandoffReport = $derived(buildPrintJobHandoffReport(handoffInput));
	let printJobEmailTemplate = $derived(buildPrintJobEmailTemplate(handoffInput, requestEmail));

	function calculateArtworkSizePrice(scale: number) {
		const pricing = product.artworkPricing;
		if (!pricing) return 0;
		const overIncluded = scale - pricing.includedScale;
		if (overIncluded <= 0) return 0;
		return Math.ceil(overIncluded / pricing.step) * pricing.pricePerStep;
	}

	function getGarmentColorTone(hexColor: string) {
		const normalized = hexColor.replace('#', '').trim();
		if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return 'mid';
		const red = parseInt(normalized.slice(0, 2), 16) / 255;
		const green = parseInt(normalized.slice(2, 4), 16) / 255;
		const blue = parseInt(normalized.slice(4, 6), 16) / 255;
		const linear = [red, green, blue].map((channel) =>
			channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
		);
		const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
		if (luminance < 0.22) return 'dark';
		if (luminance > 0.72) return 'light';
		return 'mid';
	}

	function clampArtworkScale(nextScale: number) {
		return Math.max(0.5, Math.min(product.artworkMaxScale ?? 2, nextScale));
	}

	function announce(message: string) {
		// Screen readers only announce live-region changes when the text actually changes.
		// Clearing first makes repeated messages reliably speak instead of getting swallowed.
		liveMessage = '';
		setTimeout(() => {
			liveMessage = message;
		}, 20);
	}

	function setError(message: string) {
		errorMessage = message;
		announce(message);
		setTimeout(() => errorRegionRef?.focus(), 0);
	}

	function clearError() {
		errorMessage = '';
	}

	function chooseOption(groupId: string, option: SwatchOption) {
		selections[groupId] = option;
		if (groupId === 'color') {
			colorMode = 'preset';
			if (option.hex) customColor = option.hex;
		}
		clearError();
		announce(`${groupId.replace('-', ' ')} set to ${option.label}.`);
	}

	function handleCustomColorChange(event: Event) {
		const input = event.target as HTMLInputElement;
		customColor = input.value;
		colorMode = 'custom';
		clearError();
		announce(`Custom garment preview color set to ${customColor.toUpperCase()}.`);
	}

	async function handleFileUpload(file: File) {
		const validation = validateArtworkFile(file);
		if (!validation.ok) {
			setError(validation.message);
			return;
		}

		isValidatingArtwork = true;
		validationWarnings = [];
		validationMessage = '';
		announce(`Checking image quality for ${product.name}.`);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('productType', product.slug);

			const response = await fetch('/api/validate-artwork', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			validationWarnings = Array.isArray(result?.warnings) ? result.warnings : [];
			validationMessage = typeof result?.message === 'string' ? result.message : '';
		} catch {
			validationWarnings = ['We could not check image quality right now. Use a high-resolution source if you have one.'];
			validationMessage = 'Artwork uploaded, but the quality gate was unavailable.';
		}

		try {
			const uploadData = new FormData();
			uploadData.append('file', file);
			uploadData.append('productType', product.slug);

			const uploadResponse = await fetch('/api/upload-artwork', {
				method: 'POST',
				body: uploadData
			});
			const uploadResult = await uploadResponse.json();

			if (uploadResponse.ok && typeof uploadResult?.artworkUrl === 'string') {
				uploadedArtworkUrl = uploadResult.artworkUrl;
				artworkStorageStatus = 'attached';
				artworkStorageMessage = typeof uploadResult?.message === 'string' ? uploadResult.message : 'Artwork file attached for shop review.';
			} else if (uploadResult?.code === 'blob_not_configured') {
				uploadedArtworkUrl = '';
				artworkStorageStatus = 'not_configured';
				artworkStorageMessage = 'Artwork storage is not connected yet. The preview works, but the shop will need the file by email until Blob is configured.';
			} else {
				uploadedArtworkUrl = '';
				artworkStorageStatus = 'failed';
				artworkStorageMessage = typeof uploadResult?.error === 'string' ? uploadResult.error : 'Artwork storage failed. The shop should collect the original file before production.';
			}
		} catch {
			uploadedArtworkUrl = '';
			artworkStorageStatus = 'failed';
			artworkStorageMessage = 'Artwork storage was unavailable. The shop should collect the original file before production.';
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			uploadedImage = event.target?.result as string;
			uploadedArtworkName = file.name;
			uploadedArtworkMeta = formatArtworkFileMeta(file);
			clearError();
			announce(
				validationWarnings.length > 0
					? `Artwork uploaded with ${validationWarnings.length} quality warning${validationWarnings.length > 1 ? 's' : ''}. You can still proceed.`
					: `Artwork uploaded: ${file.name}. Quality check looks good.`
			);
			isValidatingArtwork = false;
		};
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

	function startDrag(event: MouseEvent | TouchEvent) {
		if (!uploadedImage) return;
		isDragging = true;
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		dragStart = { x: clientX, y: clientY };
	}

	function onDragMove(event: MouseEvent | TouchEvent) {
		if ((!isDragging && !isResizing) || !previewRef) return;
		if ('touches' in event) event.preventDefault();
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		const rect = previewRef.getBoundingClientRect();

		if (isResizing) {
			const diagonalDelta = ((clientX - resizeStart.x) + (clientY - resizeStart.y)) / Math.max(rect.width, rect.height);
			imageScale = clampArtworkScale(resizeStartScale + diagonalDelta * 1.6);
			return;
		}

		const deltaX = ((clientX - dragStart.x) / rect.width) * 100;
		const deltaY = ((clientY - dragStart.y) / rect.height) * 100;

		imagePosition.x = Math.max(5, Math.min(95, imagePosition.x + deltaX));
		imagePosition.y = Math.max(5, Math.min(95, imagePosition.y + deltaY));
		dragStart = { x: clientX, y: clientY };
	}

	function startResize(event: MouseEvent | TouchEvent) {
		if (!uploadedImage) return;
		event.stopPropagation();
		if ('touches' in event) event.preventDefault();
		isDragging = false;
		isResizing = true;
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
		resizeStart = { x: clientX, y: clientY };
		resizeStartScale = imageScale;
	}

	function endDrag() {
		if (isDragging) {
			announce(`Artwork moved to ${Math.round(imagePosition.x)} percent horizontal and ${Math.round(imagePosition.y)} percent vertical.`);
		}
		if (isResizing) {
			announce(`Artwork size set to ${Math.round(imageScale * 100)} percent.`);
		}
		isDragging = false;
		isResizing = false;
	}

	function handleArtworkKey(event: KeyboardEvent) {
		if (!uploadedImage) return;
		const step = event.shiftKey ? 5 : 1;

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				imagePosition.x = Math.max(5, imagePosition.x - step);
				break;
			case 'ArrowRight':
				event.preventDefault();
				imagePosition.x = Math.min(95, imagePosition.x + step);
				break;
			case 'ArrowUp':
				event.preventDefault();
				imagePosition.y = Math.max(5, imagePosition.y - step);
				break;
			case 'ArrowDown':
				event.preventDefault();
				imagePosition.y = Math.min(95, imagePosition.y + step);
				break;
			default:
				return;
		}

		announce(`Artwork position ${Math.round(imagePosition.x)} by ${Math.round(imagePosition.y)} percent.`);
	}

	function handleScaleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		imageScale = clampArtworkScale(parseFloat(input.value));
		announce(`Artwork size set to ${Math.round(imageScale * 100)} percent.`);
	}

	function handleQuantityChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const nextQuantity = clampQuantity(Number.parseInt(input.value || '1', 10) || 1);
		quantity = nextQuantity;
		announce(`Quantity set to ${quantity}.`);
	}

	async function copyShopHandoff() {
		try {
			await navigator.clipboard.writeText(printJobHandoffReport);
			handoffCopyStatus = 'Shop handoff report copied. Paste it into email, notes, or the job folder.';
			announce('Shop handoff report copied.');
		} catch {
			handoffCopyStatus = 'Clipboard did not allow automatic copy. Select the report text above and copy it manually.';
			announce('Clipboard did not allow automatic copy. Select the report text manually.');
		}
	}

	async function copyShopEmailTemplate() {
		try {
			await navigator.clipboard.writeText(printJobEmailTemplate);
			handoffCopyStatus = 'Shop email template copied. Paste it into Gmail or the customer thread.';
			announce('Shop email template copied.');
		} catch {
			handoffCopyStatus = 'Clipboard did not allow automatic copy. Select the report text above and copy it manually.';
			announce('Clipboard did not allow automatic copy. Select the report text manually.');
		}
	}

	async function buyNow() {
		clearError();

		if (!uploadedImage) {
			setError('Upload artwork before starting checkout.');
			return;
		}

		isCheckingOut = true;
		if (validationWarnings.length > 0) {
			console.log('[Quality Gate] proceeding with warnings', {
				product: product.slug,
				warningCount: validationWarnings.length,
				warnings: validationWarnings
			});
		}
		announce('Preparing secure review checkout.');

		try {
			if (!STRIPE_PUBLISHABLE_KEY) {
				throw new Error('Stripe is not configured yet. Add PUBLIC_STRIPE_PUBLISHABLE_KEY before using checkout.');
			}

			// We load Stripe.js even though the redirect uses the server-returned session URL.
			// That gives the page an early publishable-key validation point and keeps Stripe's client script warm.
			await loadStripe(STRIPE_PUBLISHABLE_KEY);

			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					productType: product.slug,
					productName: product.name,
					size: sizeSelection,
					color: colorSelection,
					quantity,
					artworkReference: `${uploadedArtworkName} (${uploadedArtworkMeta})`,
					artworkScale: imageScale,
					artworkPosition: imagePosition,
					artworkSizePrice,
					artworkUrl: uploadedArtworkUrl,
					artworkStorageStatus,
					previewGarmentColorHex: selectedGarmentColor,
					colorPreviewMode: colorMode,
					unitAmountCents: Math.round(unitPrice * 100),
					selectedOptions: Object.fromEntries(
						Object.entries(selections).map(([groupId, option]) => [groupId, option.label])
					),
					cancelPath: `/shop/${product.slug}?checkout=cancelled`
				})
			});

			const payload = await response.json();

			if (!response.ok || !payload.url) {
				throw new Error(payload?.error ?? 'Stripe Checkout could not be started.');
			}

			announce('Opening secure review checkout.');
			window.location.assign(payload.url);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something went wrong while starting checkout.');
			isCheckingOut = false;
			setTimeout(() => buyButtonRef?.focus(), 0);
		}
	}

	onMount(() => {
		const move = (event: MouseEvent | TouchEvent) => onDragMove(event);
		const up = () => endDrag();
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', up);
		window.addEventListener('touchmove', move, { passive: false });
		window.addEventListener('touchend', up);

		// Cancel returns land back on the product page with a query flag.
		// We announce that state and restore focus to the primary checkout action so keyboard users
		// don't have to hunt around after returning from Stripe.
		const params = new URLSearchParams(window.location.search);
		if (params.get('checkout') === 'cancelled') {
			announce('Checkout was canceled. You are back on the product page.');
			setTimeout(() => buyButtonRef?.focus(), 0);
		}

		return () => {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', up);
			window.removeEventListener('touchmove', move);
			window.removeEventListener('touchend', up);
		};
	});
</script>

<svelte:head>
	<title>{product.name} | Triple B Prints</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="bg-[#07090f] text-cyan-100/80 py-4 border-b border-white/10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6">
		<a href="/" class="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-[#d8ff3e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#d8ff3e]">← Back to Studio</a>
	</div>
</div>

<section class="relative overflow-hidden bg-[#07090f] py-10 text-white sm:py-14">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(62,230,255,0.18),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(216,255,62,0.12),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.35),rgba(3,7,18,1))]"></div>
	<div class="pointer-events-none absolute left-1/2 top-24 hidden -translate-x-1/2 select-none text-[15vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.035] lg:block">
		{product.name}
	</div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6">
		<p bind:this={liveRegionRef} class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>

		<div class="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:items-start">
			<div class="space-y-6">
				<div class="max-w-2xl">
					<p class="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Print Studio / Live Product Preview</p>
					<h1 class="text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{product.name}</h1>
					<p class="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{product.description}</p>
					<div class="mt-5 flex flex-wrap gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-cyan-100/80" aria-label="Configurator workflow">
						<span class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">1 / Pick base</span>
						<span class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">2 / Upload art</span>
							<span class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">3 / Proof layout</span>
						<span class="rounded-full border border-[#d8ff3e]/25 bg-[#d8ff3e]/10 px-3 py-2 text-[#d8ff3e]">4 / Review quote</span>
					</div>
				</div>

				<div class="rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur">
					<div class="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">
						<span>Live proof stage</span>
						<span class="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[#d8ff3e]">Artwork placement preview</span>
					</div>
					<div
						bind:this={previewRef}
						class="relative isolate overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] select-none"
						style="aspect-ratio: 3 / 2;"
						role="img"
						aria-label={`${product.name} preview with current artwork placement.`}
					>
						<div class="absolute right-3 top-3 z-30 max-w-[70%] rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] text-slate-700 shadow-sm backdrop-blur sm:right-5 sm:top-5 sm:text-[0.62rem]">{colorSelection}</div>
						{#if product.colorConfig?.enabled && product.colorConfig.mode === 'garment-mask'}
							<svg
								class="pointer-events-none absolute inset-0 z-10 h-full w-full"
								viewBox="0 0 1536 1024"
								preserveAspectRatio="xMidYMid meet"
								aria-hidden="true"
							>
								<defs>
									<linearGradient id={`${product.slug}-shirt-depth`} x1="0" y1="0" x2="1" y2="1">
										<stop offset="0" stop-color="#ffffff" stop-opacity="0.24" />
										<stop offset="0.48" stop-color="#ffffff" stop-opacity="0.05" />
										<stop offset="1" stop-color="#000000" stop-opacity="0.24" />
									</linearGradient>
									<radialGradient id={`${product.slug}-shirt-highlight`} cx="42%" cy="24%" r="66%">
										<stop offset="0" stop-color="#ffffff" stop-opacity="0.28" />
										<stop offset="0.52" stop-color="#ffffff" stop-opacity="0.07" />
										<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
									</radialGradient>
									<linearGradient id={`${product.slug}-shirt-fold`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0" stop-color="#ffffff" stop-opacity="0.18" />
										<stop offset="1" stop-color="#000000" stop-opacity="0.10" />
									</linearGradient>
									<filter id={`${product.slug}-shirt-shadow`} x="-20%" y="-20%" width="140%" height="145%">
										<feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.24" />
									</filter>
								</defs>

								{#if product.colorConfig.previewShape === 'hoodie'}
									<g filter={`url(#${product.slug}-shirt-shadow)`}>
										<path
											fill={selectedGarmentColor}
											d="M586 100 C628 56 684 36 768 36 C852 36 908 56 950 100 C1018 116 1088 150 1150 204 L1340 388 L1218 520 L1080 408 L1056 918 C960 954 864 970 768 970 C672 970 576 954 480 918 L456 408 L318 520 L196 388 L386 204 C448 150 518 116 586 100 Z"
										/>
										<path
											fill={`url(#${product.slug}-shirt-depth)`}
											d="M586 100 C628 56 684 36 768 36 C852 36 908 56 950 100 C1018 116 1088 150 1150 204 L1340 388 L1218 520 L1080 408 L1056 918 C960 954 864 970 768 970 C672 970 576 954 480 918 L456 408 L318 520 L196 388 L386 204 C448 150 518 116 586 100 Z"
										/>
										<path
											fill={`url(#${product.slug}-shirt-highlight)`}
											d="M586 100 C628 56 684 36 768 36 C852 36 908 56 950 100 C1018 116 1088 150 1150 204 L1340 388 L1218 520 L1080 408 L1056 918 C960 954 864 970 768 970 C672 970 576 954 480 918 L456 408 L318 520 L196 388 L386 204 C448 150 518 116 586 100 Z"
										/>
										<path d="M604 112 C642 184 700 218 768 218 C836 218 894 184 932 112" fill="rgba(15,23,42,0.16)" />
										<path d="M626 122 C664 170 706 194 768 194 C830 194 872 170 910 122" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="18" stroke-linecap="round" />
										<path d="M690 210 C710 250 734 278 768 300 C802 278 826 250 846 210" fill="none" stroke="rgba(15,23,42,0.24)" stroke-width="8" stroke-linecap="round" />
										<path d="M768 312 L768 888" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="7" stroke-linecap="round" />
										<path d="M610 646 C670 690 866 690 926 646 L904 804 C842 836 694 836 632 804 Z" fill="rgba(15,23,42,0.14)" />
										<path d="M642 660 C704 692 832 692 894 660" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="8" stroke-linecap="round" />
										<path d="M456 408 C516 574 514 744 548 900" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="8" stroke-linecap="round" />
										<path d="M1080 408 C1020 574 1022 744 988 900" fill="none" stroke="rgba(15,23,42,0.18)" stroke-width="8" stroke-linecap="round" />
									</g>
								{:else}
									<g filter={`url(#${product.slug}-shirt-shadow)`}>
										<path
											fill={selectedGarmentColor}
											d="M588 74 C646 120 706 144 768 144 C830 144 890 120 948 74 L1160 132 L1378 332 L1230 480 L1088 374 L1066 912 C966 952 870 968 768 968 C666 968 570 952 470 912 L448 374 L306 480 L158 332 L376 132 Z"
										/>
										<path
											fill={`url(#${product.slug}-shirt-depth)`}
											d="M588 74 C646 120 706 144 768 144 C830 144 890 120 948 74 L1160 132 L1378 332 L1230 480 L1088 374 L1066 912 C966 952 870 968 768 968 C666 968 570 952 470 912 L448 374 L306 480 L158 332 L376 132 Z"
										/>
										<path
											fill={`url(#${product.slug}-shirt-highlight)`}
											d="M588 74 C646 120 706 144 768 144 C830 144 890 120 948 74 L1160 132 L1378 332 L1230 480 L1088 374 L1066 912 C966 952 870 968 768 968 C666 968 570 952 470 912 L448 374 L306 480 L158 332 L376 132 Z"
										/>
										<path d="M596 78 C638 202 898 202 940 78" fill="none" stroke="rgba(255,255,255,0.46)" stroke-width="22" stroke-linecap="round" />
										<path d="M640 96 C690 146 846 146 896 96" fill="none" stroke="rgba(15,23,42,0.30)" stroke-width="9" stroke-linecap="round" />
										<path d="M470 912 C570 952 666 968 768 968 C870 968 966 952 1066 912" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="10" stroke-linecap="round" />
										<path d="M515 390 C548 552 540 724 570 894" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="7" stroke-linecap="round" />
										<path d="M1021 390 C988 552 996 724 966 894" fill="none" stroke="rgba(15,23,42,0.18)" stroke-width="7" stroke-linecap="round" />
										<path d="M306 480 L448 374" fill="none" stroke="rgba(15,23,42,0.20)" stroke-width="9" stroke-linecap="round" />
										<path d="M1230 480 L1088 374" fill="none" stroke="rgba(15,23,42,0.20)" stroke-width="9" stroke-linecap="round" />
										<path d="M662 235 C705 254 831 254 874 235" fill="none" stroke={`url(#${product.slug}-shirt-fold)`} stroke-width="6" stroke-linecap="round" opacity="0.75" />
									</g>
								{/if}
							</svg>
						{:else}
							<img src={product.image} alt={product.imageAlt} class="h-full w-full object-contain object-center opacity-100" />
						{/if}

						<div class="pointer-events-none absolute left-1/2 top-[47%] h-[34%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-dashed border-slate-500/35 bg-white/5 shadow-[0_12px_35px_rgba(15,23,42,0.16)]"></div>

						{#if uploadedImage}
							<div
								class="absolute z-20 cursor-move touch-none rounded-md focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]"
								style={`left: ${imagePosition.x}%; top: ${imagePosition.y}%; transform: translate(-50%, -50%) scale(${imageScale});`}
								onmousedown={startDrag}
								ontouchstart={startDrag}
								role="button"
								aria-label="Uploaded artwork preview. Drag it or use arrow keys to move it. Hold Shift with arrow keys for larger moves."
								tabindex="0"
								onkeydown={handleArtworkKey}
							>
								<div class="relative">
									<img
										src={uploadedImage}
										alt={`Uploaded artwork preview: ${uploadedArtworkName}`}
										class="h-28 w-28 object-contain pointer-events-none sm:h-36 sm:w-36"
										style="filter: drop-shadow(0 10px 18px rgba(0,0,0,0.45));"
									/>
									<button
										type="button"
										class="absolute -bottom-3 -right-3 grid h-9 w-9 cursor-nwse-resize place-items-center rounded-full border-2 border-slate-950 bg-[#d8ff3e] text-sm font-black text-slate-950 shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-200"
										onmousedown={startResize}
										ontouchstart={startResize}
										aria-label="Resize artwork diagonally"
									>↘</button>
								</div>
							</div>
						{:else}
							<div class="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
								<div class="max-w-xs rounded-2xl border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/30 backdrop-blur">
									<p class="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Drop art here</p>
									<p class="mt-2 text-sm text-slate-300">{product.previewEmptyText}</p>
									<p class="mt-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#d8ff3e]">Live proof preview</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-3">
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">Base</p>
						<p class="mt-1 font-black text-white">{sizeSelection} / {colorSelection}</p>
					</div>
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">Placement</p>
						<p class="mt-1 font-black text-white">{printSelection}</p>
					</div>
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-cyan-100/70">Proof</p>
						<p class="mt-1 font-black text-white">{uploadedImage ? 'Artwork staged' : 'Waiting on art'}</p>
					</div>
				</div>

				{#if uploadedImage}
					<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
						<label class="mb-2 block text-sm font-black uppercase tracking-[0.18em] text-cyan-100" for="scale-slider">
							Artwork Size: {Math.round(imageScale * 100)}%
						</label>
						<input
							id="scale-slider"
							type="range"
							min="0.5"
							max={product.artworkMaxScale ?? 2}
							step="0.1"
							value={imageScale}
							oninput={handleScaleChange}
							class="w-full min-h-11 accent-cyan-300"
							aria-label="Adjust artwork size"
						/>
						<p class="mt-1 text-sm text-slate-400">Drag artwork to move. Pull the corner to resize. Use the slider for fine control.</p>
					</div>
				{/if}
			</div>

			<aside class="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
				<div class="mb-7 rounded-2xl border border-[#d8ff3e]/20 bg-[#d8ff3e]/10 p-5" aria-live="polite" aria-atomic="true">
					<p class="text-xs font-black uppercase tracking-[0.22em] text-[#d8ff3e]">Order Summary</p>
					<p class="mt-1 text-5xl font-black tracking-[-0.08em] text-white">${orderTotal}</p>
					<p class="mt-2 text-sm text-slate-300">Unit price: ${unitPrice} × Quantity: {quantity}</p>
					{#if artworkSizePrice > 0}
						<p class="mt-1 text-sm font-bold text-[#d8ff3e]">{product.artworkPricing?.label ?? 'Artwork size adjustment'}: +${artworkSizePrice}</p>
					{/if}
				</div>

				<div class="mb-7 rounded-2xl border border-cyan-200/25 bg-cyan-200/10 p-5">
					<p class="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Shop handoff sheet</p>
					<h2 class="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">Clean details for the print desk.</h2>
					<p class="mt-3 text-sm leading-6 text-slate-300">
						Copy a tidy job note for BBB Prints with the order basics, artwork status, price preview, and review steps. Nothing auto-starts production.
					</p>

					<div class="mt-5 grid gap-3 sm:grid-cols-2">
						<div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
							<p class="text-[0.65rem] font-black uppercase tracking-[0.18em] text-cyan-100/70">Product</p>
							<p class="mt-1 font-black text-white">{product.name}</p>
							<p class="mt-1 text-xs text-slate-400">{sizeSelection} · {colorSelection}</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
							<p class="text-[0.65rem] font-black uppercase tracking-[0.18em] text-cyan-100/70">Artwork</p>
							<p class="mt-1 font-black text-white">{uploadedImage ? 'Attached for review' : 'Waiting on upload'}</p>
							<p class="mt-1 text-xs text-slate-400">{printSelection} · {Math.round(imageScale * 100)}% scale</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
							<p class="text-[0.65rem] font-black uppercase tracking-[0.18em] text-cyan-100/70">Quantity</p>
							<p class="mt-1 font-black text-white">{quantity} piece{quantity === 1 ? '' : 's'}</p>
							<p class="mt-1 text-xs text-slate-400">Unit preview: ${unitPrice}</p>
						</div>
						<div class="rounded-2xl border border-[#d8ff3e]/30 bg-[#d8ff3e]/10 p-4">
							<p class="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#d8ff3e]">Quote preview</p>
							<p class="mt-1 text-2xl font-black text-white">${orderTotal}</p>
							<p class="mt-1 text-xs text-slate-300">Final price confirmed by the shop.</p>
						</div>
					</div>

					<div class="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
						<p class="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-300">Review before production</p>
						<ul class="mt-3 space-y-2 text-sm leading-5 text-slate-200">
							<li class="flex gap-2"><span class="text-[#d8ff3e]">✓</span><span>Confirm product, size, and color availability.</span></li>
							<li class="flex gap-2"><span class="text-[#d8ff3e]">✓</span><span>Confirm artwork file, placement, and scale.</span></li>
							<li class="flex gap-2"><span class="text-[#d8ff3e]">✓</span><span>Confirm price, cleanup needs, and production timeline.</span></li>
							<li class="flex gap-2"><span class="text-[#d8ff3e]">✓</span><span>Contact the customer with final quote or approval request.</span></li>
						</ul>
					</div>
					<div class="mt-4 flex flex-wrap gap-3">
						<button type="button" onclick={copyShopHandoff} class="rounded-2xl bg-[#d8ff3e] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]">
							Copy shop report
						</button>
						<button type="button" onclick={copyShopEmailTemplate} class="rounded-2xl border border-cyan-200/30 bg-cyan-200/10 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-200/20 focus:outline-none focus:ring-4 focus:ring-cyan-200/40">
							Copy email version
						</button>
					</div>
					{#if handoffCopyStatus}
						<p class="mt-3 text-sm font-bold text-[#d8ff3e]">{handoffCopyStatus}</p>
					{/if}
				</div>

				<div class="space-y-7">
					{#each product.optionGroups as group}
						<fieldset class="space-y-3">
							<legend class="text-sm font-black uppercase tracking-[0.2em] text-slate-200">{group.label}</legend>
							<p class="text-sm text-slate-400">{group.helperText}</p>

							{#if group.render === 'swatch'}
								<div class="flex flex-wrap gap-3">
									{#each group.options as option}
										<button
											type="button"
											class={`h-12 w-12 rounded-full border-4 shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${colorMode === 'preset' && selections[group.id]?.label === option.label ? 'border-[#d8ff3e] scale-110' : 'border-white/10 hover:scale-105'}`}
											style={`background-color: ${option.hex};`}
											onclick={() => chooseOption(group.id, option)}
											aria-pressed={selections[group.id]?.label === option.label}
											aria-label={`${group.label}: ${option.label}${option.priceMod > 0 ? `, adds $${option.priceMod}` : ''}`}
										></button>
									{/each}
								</div>
							{:else}
								<div class="flex flex-wrap gap-2">
									{#each group.options as option}
										<button
											type="button"
											class={`min-h-11 rounded-xl border px-4 py-2.5 font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${selections[group.id]?.label === option.label ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-200/60 hover:bg-cyan-200/10'}`}
											onclick={() => chooseOption(group.id, option)}
											aria-pressed={selections[group.id]?.label === option.label}
											aria-label={`${group.label}: ${option.label}${option.priceMod > 0 ? `, adds $${option.priceMod}` : ''}`}
										>
											{option.label}
											{#if option.priceMod > 0}
												<span class="ml-1 text-xs opacity-70">+${option.priceMod}</span>
											{/if}
										</button>
									{/each}
								</div>
							{/if}

							{#if group.id === 'color' && product.colorConfig?.allowCustom}
								<div class="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
									<label class="flex flex-wrap items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-100" for={`${product.slug}-custom-color`}>
										<span>Custom preview color</span>
										<input
											id={`${product.slug}-custom-color`}
											type="color"
											value={customColor}
											oninput={handleCustomColorChange}
											class="h-12 w-16 cursor-pointer rounded-lg border border-white/20 bg-transparent p-1"
											aria-label="Choose custom garment preview color"
										/>
									</label>
									<div class="mt-3 flex flex-wrap items-center gap-3">
										<button
											type="button"
											class={`min-h-11 rounded-xl border px-4 py-2.5 font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${colorMode === 'custom' ? 'border-[#d8ff3e] bg-[#d8ff3e] text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:border-[#d8ff3e]/60'}`}
											onclick={() => { colorMode = 'custom'; announce(`Custom garment preview color set to ${customColor.toUpperCase()}.`); }}
											aria-pressed={colorMode === 'custom'}
										>Use custom color</button>
										<span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.12em] text-cyan-100">{customColor.toUpperCase()}</span>
										<span class="rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-300">Preview only</span>
									</div>
									<p class="mt-3 text-sm leading-6 text-slate-400">{product.colorConfig.disclaimer}</p>
									<p class="mt-2 rounded-xl border border-cyan-200/15 bg-cyan-200/10 px-3 py-2 text-sm font-semibold leading-6 text-cyan-50">{contrastHint}</p>
								</div>
							{/if}

							<p class="text-sm font-bold text-cyan-100">Selected: {group.id === 'color' ? colorSelection : selections[group.id]?.label}</p>
						</fieldset>
					{/each}

					<div>
						<label class="mb-3 block text-sm font-black uppercase tracking-[0.2em] text-slate-200" for="quantity">Quantity</label>
						<input
							id="quantity"
							type="number"
							min="1"
							max="99"
							inputmode="numeric"
							value={quantity}
							oninput={handleQuantityChange}
							class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-[#d8ff3e]"
							aria-describedby="quantity-help"
						/>
						<p id="quantity-help" class="mt-2 text-sm text-slate-400">Choose how many of this configured item you want to order.</p>
					</div>

					<div>
						<h2 class="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-200" id="upload-label">Your Artwork</h2>
						<label
							class={`block w-full cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all focus-within:ring-4 focus-within:ring-[#d8ff3e] ${isDragOver ? 'border-cyan-200 bg-cyan-200/10' : 'border-white/15 bg-black/20 hover:border-[#d8ff3e]/70 hover:bg-[#d8ff3e]/10'}`}
							ondragover={onDragOver}
							ondragleave={onDragLeave}
							ondrop={onDrop}
							aria-labelledby="upload-label"
						>
							<input
								type="file"
								accept={ACCEPTED_ARTWORK_MIME_TYPES.join(',')}
								class="sr-only"
								onchange={onFileInput}
								aria-label="Upload your artwork image"
							/>
							<svg class="mx-auto mb-2 h-10 w-10 text-cyan-100/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							<p class="text-lg font-black text-white">Click to upload or drag and drop</p>
							<p class="mt-1 text-sm text-slate-400">PNG, JPG, SVG, or WEBP. Upload what you have — logo, screenshot, rough idea, or finished file. We'll review quality before production.</p>
						</label>

						{#if uploadedImage}
							<p class="mt-2 text-sm font-medium text-emerald-300" role="status" aria-live="polite">
								✓ Artwork preview loaded: {uploadedArtworkName}
							</p>
							{#if artworkStorageStatus === 'attached'}
								<p class="mt-2 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-100" role="status" aria-live="polite">
									✓ Artwork file attached for shop review. Triple B will receive the file link in the handoff.
								</p>
							{:else if artworkStorageStatus === 'not_configured'}
								<p class="mt-2 rounded-xl border border-[#d8ff3e]/25 bg-[#d8ff3e]/10 px-3 py-2 text-sm font-bold text-[#f4f5f2]" role="status" aria-live="polite">
									Preview is loaded. Artwork storage is being connected, so the shop may still ask for the original file before production.
								</p>
							{:else if artworkStorageStatus === 'failed'}
								<p class="mt-2 rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100" role="status" aria-live="polite">
									Preview is loaded, but the artwork file did not attach. Please keep the original file handy for the shop.
								</p>
							{/if}
						{/if}

						{#if isValidatingArtwork}
							<p class="mt-2 text-sm font-medium text-[#d8ff3e]" role="status" aria-live="polite">
								Checking image quality…
							</p>
						{/if}

						{#if validationMessage}
							<p class="mt-2 text-sm text-slate-300" aria-live="polite">{validationMessage}</p>
						{/if}

						{#if validationWarnings.length > 0}
							<div class="mt-3 rounded-xl border border-[#d8ff3e]/30 bg-[#d8ff3e]/10 p-4 text-[#f4f5f2]">
								<p class="font-bold text-[#d8ff3e]">Image quality warnings</p>
								<ul class="mt-2 list-disc space-y-2 pl-5 text-sm">
									{#each validationWarnings as warning}
										<li>{warning}</li>
									{/each}
								</ul>
								<p class="mt-3 text-sm text-slate-300">You can still proceed. If the file needs cleanup or redesign, we'll explain options before production.</p>
							</div>
						{/if}
					</div>

					{#if errorMessage}
						<div bind:this={errorRegionRef} tabindex="-1" role="alert" class="rounded-xl border border-red-300/40 bg-red-500/10 p-4 text-red-100">
							<p class="font-bold">Review needs one quick fix</p>
							<p>{errorMessage}</p>
						</div>
					{/if}

					<button
						bind:this={buyButtonRef}
						type="button"
						class={`w-full rounded-2xl py-4 text-lg font-black uppercase tracking-[0.16em] shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#d8ff3e] ${uploadedImage && !isCheckingOut ? 'bg-[#d8ff3e] text-slate-950 hover:bg-yellow-200 hover:scale-[1.01]' : 'bg-white/10 text-slate-500 cursor-not-allowed opacity-70'}`}
						disabled={!uploadedImage || isCheckingOut}
						onclick={buyNow}
						aria-label={uploadedImage ? `Start review for ${quantity} ${product.name} item${quantity > 1 ? 's' : ''} at ${orderTotal} dollars` : 'Upload artwork to start your quote preview'}
						aria-busy={isCheckingOut}
					>
						{#if isCheckingOut}
							Starting Review…
						{:else}
							Start Review — ${orderTotal}
						{/if}
					</button>

					<p class="text-center text-sm text-slate-400" aria-live="polite">
						{uploadedImage ? 'We’ll review artwork, placement, and pricing before production.' : 'Upload artwork to start your quote preview.'}
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>

<footer class="border-t border-white/10 bg-[#07090f] py-12 text-white">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6">
		<p class="text-slate-400">© {new Date().getFullYear()} Triple B Prints. Preview-ready quote flow.</p>
	</div>
</footer>
