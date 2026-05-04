import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sharp from 'sharp';

// ─── Product Validation Rules (best-guess, adjust with real print specs) ───
// Each product defines minimum dimensions, accepted formats, and max file size.
// These catch 80% of bad uploads before they reach the print queue.

interface ValidationRule {
	minWidth: number;
	minHeight: number;
	formats: string[];        // e.g. ['png', 'jpg', 'svg']
	maxFileSizeMB: number;
	aspectRatioHint: string;  // plain-language guidance for customers
}

const productRules: Record<string, ValidationRule> = {
	't-shirt':    { minWidth: 3000, minHeight: 3000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 25, aspectRatioHint: 'Square-ish works best for chest prints.' },
	'mug':        { minWidth: 1500, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'Wide image works best for wrap-around prints.' },
	'keychain':   { minWidth: 1000, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 5,  aspectRatioHint: 'Square image works best.' },
	'coaster':    { minWidth: 1500, minHeight: 1500, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'Square image works best.' },
	'hoodie':     { minWidth: 3000, minHeight: 3000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 25, aspectRatioHint: 'Square-ish works best for chest prints.' },
	'hat':        { minWidth: 1500, minHeight: 1000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'Wide image works best for front panel prints.' },
	'phone-case': { minWidth: 1500, minHeight: 2500, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 10, aspectRatioHint: 'Tall image works best for phone case prints.' },
	'shorts':     { minWidth: 2000, minHeight: 2000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 15, aspectRatioHint: 'Square-ish works best for leg prints.' },
	'joggers':    { minWidth: 2000, minHeight: 2000, formats: ['png', 'jpg', 'jpeg', 'svg'], maxFileSizeMB: 15, aspectRatioHint: 'Square-ish works best for leg prints.' },
};

// ─── Helper: format bytes to human-readable ───
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ─── Helper: plain-language rejection messages ───
function rejectionMessage(check: string, got: string, need: string, fix: string): string {
	return `${check}: got ${got}, need ${need}. ${fix}`;
}

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const productType = formData.get('productType') as string | null;

	if (!file || !productType) {
		return json({ valid: false, errors: ['Missing file or product type.'] }, { status: 400 });
	}

	const rules = productRules[productType];
	if (!rules) {
		return json({ valid: false, errors: [`Unknown product type: ${productType}`] }, { status: 400 });
	}

	const errors: string[] = [];
	const warnings: string[] = [];

	// ─── Check 1: File format ───
	const ext = file.name.split('.').pop()?.toLowerCase() || '';
	if (!rules.formats.includes(ext)) {
		errors.push(rejectionMessage(
			'File format',
			`.${ext.toUpperCase()}`,
			rules.formats.map(f => `.${f.toUpperCase()}`).join(', '),
			`Convert your image to ${rules.formats.map(f => `.${f.toUpperCase()}`).join(' or ')} and re-upload.`
		));
	}

	// ─── Check 2: File size ───
	const fileSizeMB = file.size / (1024 * 1024);
	if (fileSizeMB > rules.maxFileSizeMB) {
		errors.push(rejectionMessage(
			'File size',
			formatBytes(file.size),
			`≤ ${rules.maxFileSizeMB} MB`,
			`Compress or resize your image to under ${rules.maxFileSizeMB} MB.`
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
				errors.push(rejectionMessage(
					'Image resolution',
					`${width} × ${height} px`,
					`≥ ${rules.minWidth} × ${rules.minHeight} px`,
					`Resize your image to at least ${rules.minWidth} × ${rules.minHeight} pixels. Higher resolution = sharper prints.`
				));
			}

			// DPI warning (not hard fail — many images don't embed DPI)
			if (dpi < 150) {
				warnings.push(`DPI is ${dpi}. For best print quality, use 300 DPI or higher. Your image may look soft when printed.`);
			}

			// Aspect ratio hint (warning, not error — customer can still proceed)
			const ratio = width / height;
			const idealRatio = rules.minWidth / rules.minHeight;
			const ratioDiff = Math.abs(ratio - idealRatio) / idealRatio;
			if (ratioDiff > 0.3) {
				warnings.push(`Aspect ratio looks off. ${rules.aspectRatioHint}`);
			}

			// File size vs. dimension sanity check
			// Very small file for large dimensions suggests heavy compression / low quality
			const pixels = width * height;
			const bytesPerPixel = file.size / pixels;
			if (bytesPerPixel < 0.5 && pixels > 1000000) {
				warnings.push(`Image looks heavily compressed. This may reduce print quality. Try uploading a less compressed version.`);
			}

		} catch (err) {
			errors.push(`Could not read image file. Make sure it's a valid image and try again.`);
		}
	}

	// ─── Result ───
	const valid = errors.length === 0;

	return json({
		valid,
		errors,
		warnings,
		productType,
		fileName: file.name,
		fileSize: formatBytes(file.size),
		// If valid, return a pass message with any warnings
		message: valid
			? (warnings.length > 0
				? `Image looks good! ${warnings.length} warning${warnings.length > 1 ? 's' : ''} below.`
				: 'Image passes all quality checks. Ready to print!')
			: `Image failed ${errors.length} check${errors.length > 1 ? 's' : ''}. Fix below and re-upload.`
	});
};
