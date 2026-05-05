import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import {
	artworkQualityRules,
	buildArtworkValidationResult,
	formatBytes,
	formatQualityWarning
} from '$lib/configurator';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file');
	const productType = formData.get('productType');

	if (!(file instanceof File) || typeof productType !== 'string') {
		return json(
			buildArtworkValidationResult({
				valid: true,
				errors: [],
				warnings: ['Missing file or product type — we could not check image quality.'],
				productType: typeof productType === 'string' ? productType : 'unknown',
				fileName: file instanceof File ? file.name : 'unknown',
				fileSize: file instanceof File ? formatBytes(file.size) : 'unknown',
				message: 'We could not run the image quality gate, so this upload is allowed with a warning.'
			}),
			{ status: 400 }
		);
	}

	const rules = artworkQualityRules[productType];
	if (!rules) {
		return json(
			buildArtworkValidationResult({
				valid: true,
				errors: [],
				warnings: [`Unknown product type: ${productType} — we could not check image quality.`],
				productType,
				fileName: file.name,
				fileSize: formatBytes(file.size),
				message: 'We could not match this product to known artwork rules, so the upload is allowed with a warning.'
			}),
			{ status: 400 }
		);
	}

	const warnings: string[] = [];
	const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

	if (!rules.formats.includes(ext)) {
		warnings.push(
			formatQualityWarning(
				'File format',
				`.${ext.toUpperCase() || 'UNKNOWN'}`,
				`We recommend ${rules.formats.map((format) => `.${format.toUpperCase()}`).join(', ')} for best print quality.`,
				'Want to convert your image and re-upload? PNG and JPG work great.'
			)
		);
	}

	const fileSizeMB = file.size / (1024 * 1024);
	if (fileSizeMB > rules.maxFileSizeMB) {
		warnings.push(
			formatQualityWarning(
				'File size',
				formatBytes(file.size),
				`We recommend keeping it under ${rules.maxFileSizeMB} MB.`,
				'Compressing your image a bit will usually keep things moving without killing print quality.'
			)
		);
	}

	if (ext !== 'svg') {
		try {
			const buffer = Buffer.from(await file.arrayBuffer());
			const metadata = await sharp(buffer).metadata();
			const width = metadata.width ?? 0;
			const height = metadata.height ?? 0;
			const dpi = metadata.density ?? 72;

			if (width < rules.minWidth || height < rules.minHeight) {
				warnings.push(
					formatQualityWarning(
						'Image resolution',
						`${width} × ${height} pixels`,
						`For a clean ${productType} print we recommend at least ${rules.minWidth} × ${rules.minHeight} pixels.`,
						'Higher resolution gives the printer a better shot at staying sharp.'
					)
				);
			}

			if (dpi < 150) {
				warnings.push(`Your image DPI is ${dpi}. For best print quality, 300 DPI is ideal. This one may print a little soft.`);
			}

			const ratio = width / Math.max(height, 1);
			const idealRatio = rules.minWidth / rules.minHeight;
			const ratioDiff = Math.abs(ratio - idealRatio) / idealRatio;
			if (ratioDiff > 0.3) {
				warnings.push(`${rules.aspectRatioHint} Want to crop or adjust your image for a better fit?`);
			}

			const pixels = width * height;
			const bytesPerPixel = pixels > 0 ? file.size / pixels : 0;
			if (bytesPerPixel < 0.5 && pixels > 1_000_000) {
				warnings.push('This image looks heavily compressed. That can reduce print quality. If you have a cleaner version, use that one.');
			}
		} catch {
			warnings.push('We could not read this image file to check quality. Make sure it is a valid image and try again?');
		}
	}

	const hasWarnings = warnings.length > 0;

	return json(
		buildArtworkValidationResult({
			valid: true,
			errors: [],
			warnings,
			productType,
			fileName: file.name,
			fileSize: formatBytes(file.size),
			message: hasWarnings
				? `We checked your image and found ${warnings.length} thing${warnings.length > 1 ? 's' : ''} you might want to look at. You can still proceed, but the print might not be as sharp.`
				: 'Your image looks great. No quality concerns — ready to print.'
		})
	);
};
