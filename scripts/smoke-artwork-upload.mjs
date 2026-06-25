#!/usr/bin/env node

const baseUrl = process.env.BBB_BASE_URL ?? 'http://127.0.0.1:5174';
const siteOrigin = new URL(baseUrl).origin;

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

async function smokeMissingBlobTokenBoundary() {
	const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
	const bytes = Uint8Array.from(Buffer.from(pngBase64, 'base64'));
	const form = new FormData();
	form.append('file', new Blob([bytes], { type: 'image/png' }), 'bbb-smoke-art.png');
	form.append('productType', 'hoodie');

	const response = await fetch(`${baseUrl}/api/upload-artwork`, {
		method: 'POST',
		headers: { origin: siteOrigin },
		body: form
	});
	const payload = await response.json();

	if (process.env.BLOB_READ_WRITE_TOKEN) {
		assert(response.status < 500, `upload-artwork with Blob token returned ${response.status}: ${JSON.stringify(payload)}`);
		assert(payload.artworkUrl || payload.error, 'upload-artwork with Blob token should return an artwork URL or explicit storage error');
		console.log(`✓ upload-artwork with Blob env -> ${response.status}`);
		return;
	}

	assert(response.status === 503, `upload-artwork without Blob env expected 503, got ${response.status}: ${JSON.stringify(payload)}`);
	assert(payload.code === 'blob_not_configured', `expected code=blob_not_configured, got ${payload.code}`);
	console.log('✓ upload-artwork boundary without Blob env -> 503 blob_not_configured');
}

async function smokeInvalidFileBoundary() {
	const form = new FormData();
	form.append('file', new Blob([Buffer.from('not an image')], { type: 'text/plain' }), 'bad.txt');
	form.append('productType', 'hoodie');

	const response = await fetch(`${baseUrl}/api/upload-artwork`, {
		method: 'POST',
		headers: { origin: siteOrigin },
		body: form
	});
	const payload = await response.json();

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		assert(response.status === 503, `without Blob env invalid-file path should fail at config boundary first, got ${response.status}`);
		console.log('✓ upload-artwork invalid-file smoke skipped behind Blob config boundary');
		return;
	}

	assert(response.status === 400, `invalid file expected 400, got ${response.status}: ${JSON.stringify(payload)}`);
	assert(String(payload.error || '').includes('PNG, JPG, SVG, or WEBP'), `unexpected invalid-file error: ${JSON.stringify(payload)}`);
	console.log('✓ upload-artwork rejects invalid file type -> 400');
}

async function main() {
	console.log(`BBB artwork-upload smoke against ${baseUrl}`);
	await smokeMissingBlobTokenBoundary();
	await smokeInvalidFileBoundary();
	console.log('PASS: BBB artwork-upload smoke complete');
}

main().catch((error) => {
	console.error(`FAIL: ${error.message}`);
	process.exit(1);
});
