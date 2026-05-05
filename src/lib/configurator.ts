import { shopProducts, type ProductConfig } from '$lib/data/shopProducts';

export const ACCEPTED_ARTWORK_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'] as const;
export const MAX_ARTWORK_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

export type CheckoutSelections = Record<string, string>;

export type ValidatedCheckoutPayload = {
	product: ProductConfig;
	quantity: number;
	artworkReference: string;
	selectedOptions: CheckoutSelections;
	unitAmountCents: number;
	cancelPath: string;
	sizeLabel: string;
	colorLabel: string;
};

export type ArtworkQualityRule = {
	minWidth: number;
	minHeight: number;
	formats: string[];
	maxFileSizeMB: number;
	aspectRatioHint: string;
};

export type ArtworkValidationResult = {
	valid: boolean;
	errors: string[];
	warnings: string[];
	productType: string;
	fileName: string;
	fileSize: string;
	message: string;
};

export const artworkQualityRules: Record<string, ArtworkQualityRule> = {
	't-shirt': { minWidth: 3000, minHeight: 3000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 25, aspectRatioHint: 'For chest prints, a square-ish image around 3000×3000 pixels works best.' },
	'mug': { minWidth: 1500, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 10, aspectRatioHint: 'For wrap-around prints, a wide image around 1500×1000 pixels works best.' },
	'keychain': { minWidth: 1000, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 5, aspectRatioHint: 'For keychains, a square image around 1000×1000 pixels works best.' },
	'coaster': { minWidth: 1500, minHeight: 1500, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 10, aspectRatioHint: 'For coasters, a square image around 1500×1500 pixels works best.' },
	'hoodie': { minWidth: 3000, minHeight: 3000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 25, aspectRatioHint: 'For chest prints, a square-ish image around 3000×3000 pixels works best.' },
	'hat': { minWidth: 1500, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 10, aspectRatioHint: 'For front panel prints, a wide image around 1500×1000 pixels works best.' },
	'phone-case': { minWidth: 1500, minHeight: 2500, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 10, aspectRatioHint: 'For phone cases, a tall image around 1500×2500 pixels works best.' },
	'shorts': { minWidth: 2000, minHeight: 2000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 15, aspectRatioHint: 'For leg prints, a square-ish image around 2000×2000 pixels works best.' },
	'joggers': { minWidth: 2000, minHeight: 2000, formats: ['png', 'jpg', 'jpeg', 'svg', 'webp'], maxFileSizeMB: 15, aspectRatioHint: 'For leg prints, a square-ish image around 2000×2000 pixels works best.' }
};

export function clampQuantity(value: number) {
	return Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asNonEmptyString(value: unknown) {
	return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeCheckoutSelections(product: ProductConfig, value: unknown) {
	const incoming = isRecord(value) ? value : {};
	const normalized: CheckoutSelections = {};
	let computedUnitPrice = product.basePrice;

	for (const group of product.optionGroups) {
		const requestedLabel = asNonEmptyString(incoming[group.id]);
		const resolvedOption = group.options.find((option) => option.label === requestedLabel) ?? group.options[0];
		normalized[group.id] = resolvedOption.label;
		computedUnitPrice += resolvedOption.priceMod;
	}

	return { selectedOptions: normalized, unitAmountCents: computedUnitPrice * 100 };
}

export function validateArtworkFile(file: File) {
	if (!ACCEPTED_ARTWORK_MIME_TYPES.includes(file.type as (typeof ACCEPTED_ARTWORK_MIME_TYPES)[number])) {
		return { ok: false as const, message: 'Please upload a PNG, JPG, SVG, or WEBP image for the artwork preview.' };
	}
	if (file.size > MAX_ARTWORK_FILE_SIZE_BYTES) {
		return { ok: false as const, message: 'Artwork must be 10 MB or smaller for preview upload.' };
	}
	return { ok: true as const };
}

export function validateCheckoutPayload(body: unknown): ValidatedCheckoutPayload {
	if (!isRecord(body)) throw new Error('Request body must be a JSON object.');
	const productType = asNonEmptyString(body.productType);
	if (!productType || !(productType in shopProducts)) throw new Error('Unknown or missing productType.');
	const product = shopProducts[productType];
	const quantity = Number(body.quantity);
	if (!Number.isInteger(quantity)) throw new Error('Quantity must be a whole number.');
	const clampedQuantity = clampQuantity(quantity);
	if (clampedQuantity !== quantity) throw new Error(`Quantity must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`);
	const artworkReference = asNonEmptyString(body.artworkReference);
	if (!artworkReference) throw new Error('artworkReference is required.');
	const { selectedOptions, unitAmountCents } = normalizeCheckoutSelections(product, body.selectedOptions);
	return {
		product,
		quantity,
		artworkReference,
		selectedOptions,
		unitAmountCents,
		cancelPath: `/shop/${encodeURIComponent(product.slug)}?checkout=cancelled`,
		sizeLabel: selectedOptions.size ?? 'Not specified',
		colorLabel: selectedOptions.color ?? 'Not specified'
	};
}

export function formatArtworkFileMeta(file: File) {
	return `${file.type}, ${Math.round(file.size / 1024)} KB`;
}

export function buildArtworkReference(file: File) {
	return `${file.name} (${formatArtworkFileMeta(file)})`;
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatQualityWarning(check: string, got: string, recommendation: string, tip: string) {
	return `${check}: we got ${got}. ${recommendation} ${tip}`;
}

export function buildArtworkValidationResult(args: ArtworkValidationResult): ArtworkValidationResult {
	return args;
}
