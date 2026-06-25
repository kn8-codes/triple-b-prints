import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { put } from '@vercel/blob';
import {
	MAX_ARTWORK_FILE_SIZE_BYTES,
	validateArtworkFile,
	formatBytes
} from '$lib/configurator';
import { shopProducts } from '$lib/data/shopProducts';
import type { RequestHandler } from './$types';

function slugFileName(name: string) {
	const [base, ...rest] = name.split('.');
	const ext = rest.length > 0 ? rest.pop()?.toLowerCase() : '';
	const safeBase = (base || 'artwork')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 70) || 'artwork';
	return ext ? `${safeBase}.${ext}` : safeBase;
}

export const POST: RequestHandler = async ({ request }) => {
	if (!env.BLOB_READ_WRITE_TOKEN) {
		return json(
			{
				error: 'Artwork storage is not configured yet.',
				code: 'blob_not_configured'
			},
			{ status: 503 }
		);
	}

	const formData = await request.formData();
	const file = formData.get('file');
	const productType = formData.get('productType');

	if (!(file instanceof File) || typeof productType !== 'string') {
		return json({ error: 'Artwork upload requires a file and product type.' }, { status: 400 });
	}

	if (!(productType in shopProducts)) {
		return json({ error: 'Unknown product type.' }, { status: 400 });
	}

	const validation = validateArtworkFile(file);
	if (!validation.ok) {
		return json({ error: validation.message }, { status: 400 });
	}

	const now = new Date();
	const datePath = now.toISOString().slice(0, 10);
	const nonce = crypto.randomUUID().slice(0, 8);
	const pathname = `bbb-artwork/${datePath}/${productType}/${nonce}-${slugFileName(file.name)}`;

	try {
		const blob = await put(pathname, file, {
			access: 'public',
			contentType: file.type,
			addRandomSuffix: false
		});

		return json({
			artworkUrl: blob.url,
			pathname: blob.pathname,
			fileName: file.name,
			fileSize: formatBytes(file.size),
			fileSizeBytes: file.size,
			contentType: file.type,
			maxFileSizeBytes: MAX_ARTWORK_FILE_SIZE_BYTES,
			message: 'Artwork file attached for shop review.'
		});
	} catch (error) {
		return json(
			{
				error: error instanceof Error ? error.message : 'Artwork upload failed.',
				code: 'blob_upload_failed'
			},
			{ status: 500 }
		);
	}
};
