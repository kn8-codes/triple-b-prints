import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sharp from 'sharp';

// ─── V1 Default Validation Rules (pending client confirmation) ───
// These are best-guess defaults based on typical print shop requirements.
// The client has real specs from his DTG printer, laser engraver, and PNC tools
// that should override these once confirmed.
//
// V1 POLICY: WARN, DON'T BLOCK. Show clear messaging, let customer proceed.
// We track when warnings are ignored so we can promote rules to hard blocks in V2.
//
// To override: edit the values below or load from an external config.

interface ValidationRule {
	minWidth: number;
	minHeight: number;
	formats: string[];        // e.g. ['png', 'jpg', 'svg']
	maxFileSizeMB: number;
	aspectRatioHint: string;  // plain-language guidance for customers
}

// ⚠️ V1 DEFAULTS — REPLACE WITH CLIENT'S REAL PRINT SPECS ⚠️
const productRules: Record<string, ValidationRule> = {
	't-shirt':    { minWidth: 3000, minHeight: 3000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 25, aspectRatioHint: 'For chest prints, a square-ish image around 3000×3000 pixels works best.' },
	'mug':        { minWidth: 1500, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'For wrap-around prints, a wide image around 1500×1000 pixels works best.' },
	'keychain':   { minWidth: 1000, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 5,  aspectRatioHint: 'For keychains, a square image around 1000×1000 pixels works best.' },
	'coaster':    { minWidth: 1500, minHeight: 1500, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'For coasters, a square image around 1500×1500 pixels works best.' },
	'hoodie':     { minWidth: 3000, minHeight: 3000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 25, aspectRatioHint: 'For chest prints, a square-ish image around 3000×3000 pixels works best.' },
	'hat':        { minWidth: 1500, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'For front panel prints, a wide image around 1500×1000 pixels works best.' },
	'phone-case': { minWidth: 1500, minHeight: 2500, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'For phone cases, a tall image around 1500×2500 pixels works best.' },
	'shorts':     { minWidth: 2000, minHeight: 2000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 15, aspectRatioHint: 'For leg prints, a square-ish image around 2000×2000 pixels works best.' },
	'joggers':    { minWidth: 2000, minHeight: 2000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 15, aspectRatioHint: 'For leg prints, a square-ish image around 2000×2000 pixels works best.' },
};

// ─── Helper: format bytes to human-readable ───
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ─── V1: Conversational warning messages (not corporate error speak) ───
// V1 policy: WARN, don't block. Let customer proceed but make the risk clear.
// We track ignored warnings for V2 hard-block promotion.

function formatWarning(check: string, got: string, recommendation: string, tip: string): string {
	return `${check}: we got ${got}. ${recommendation} ${tip}`;
}

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const productType = formData.get('productType') as string | null;

	if (!file || !productType) {
		return json({ valid: true, warnings: ['Missing file or product type — we couldn\'t check quality.'] }, { status: 400 });
	}

	const rules = productRules[productType];
	if (!rules) {
		return json({ valid: true, warnings: [`Unknown product type: ${productType} — we couldn\'t check quality.`] }, { status: 400 });
	}

	const warnings: string[] = [];
	let ignoredWarningCount = 0; // Track for V2 promotion analytics

	// ─── Check 1: File format ───
	const ext = file.name.split('.').pop()?.toLowerCase() || '';
	if (!rules.formats.includes(ext)) {
		warnings.push(formatWarning(
			'File format',
			`.${ext.toUpperCase()}`,
			`We recommend ${rules.formats.map(f => `.${f.toUpperCase()}`).join(', ')} for best print quality.`,
			`Want to convert your image and re-upload? PNG and JPG work great.`
		));
	}

	// ─── Check 2: File size ───
	const fileSizeMB = file.size / (1024 * 1024);
	if (fileSizeMB > rules.maxFileSizeMB) {
		warnings.push(formatWarning(
			'File size',
			formatBytes(file.size),
			`We recommend keeping it under ${rules.maxFileSizeMB} MB.`,
			`Compressing your image a bit won\'t hurt quality and makes upload faster.`
		));
	}

	// ─── Check 3: Image dimensions (via Sharp) ───
	// SVG files skip dimension checks — they're vector and scale infinitely.
	if (ext !== 'svg') {
		try {
			const buffer = Buffer.from(await file.arrayBuffer());
			const metadata = await sharp(buffer).metadata();

			const width = metadata.width || 0;
			const height = metadata.height || 0;
			const dpi = metadata.density || 72; // Sharp reads DPI from metadata if present

			// Dimension check
			if (width < rules.minWidth || height < rules.minHeight) {
				warnings.push(formatWarning(
					'Image resolution',
					`${width} × ${height} pixels`,
					`For a clean ${productType} print we recommend at least ${rules.minWidth} × ${rules.minHeight} pixels.`,
					`Higher resolution = sharper prints. Want to upload a higher resolution version?`
				));
			}

			// DPI warning
			if (dpi < 150) {
				warnings.push(`Your image DPI is ${dpi}. For best print quality, 300 DPI is ideal. Your image might look softer when printed — want to find a higher quality version?`);
			}

			// Aspect ratio hint
			const ratio = width / height;
			const idealRatio = rules.minWidth / rules.minHeight;
			const ratioDiff = Math.abs(ratio - idealRatio) / idealRatio;
			if (ratioDiff > 0.3) {
				warnings.push(`${rules.aspectRatioHint} Want to crop or adjust your image for a better fit?`);
			}

			// Compression check
			const pixels = width * height;
			const bytesPerPixel = file.size / pixels;
			if (bytesPerPixel < 0.5 && pixels > 1000000) {
				warnings.push(`This image looks heavily compressed. That can reduce print quality. Got a less compressed version?`);
			}

		} catch (err) {
			warnings.push(`We couldn\'t read your image file to check quality. Make sure it\'s a valid image and try again?`);
		}
	}

	// ─── Result ───
	// V1: Always valid=true. Warnings are advisory only.
	// Track ignored warnings for V2 analytics.
	const hasWarnings = warnings.length > 0;

	return json({
		valid: true, // V1: never block
		warnings,
		hasWarnings,
		ignoredWarningCount: hasWarnings ? warnings.length : 0, // Client can track this
		productType,
		fileName: file.name,
		fileSize: formatBytes(file.size),
		message: hasWarnings
			? `We checked your image and found ${warnings.length} thing${warnings.length > 1 ? 's' : ''} you might want to look at. You can still proceed, but the print might not be as sharp.`
			: `Your image looks great! No quality concerns — ready to print.`
	});
};
