#!/usr/bin/env node

const baseUrl = process.env.BBB_BASE_URL ?? 'http://127.0.0.1:5174';
const siteOrigin = new URL(baseUrl).origin;

const routes = ['/', '/shop/hoodie', '/shop/success?session_id=cs_test_smoke&product=hoodie'];

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

async function expectRoute(path) {
	const response = await fetch(`${baseUrl}${path}`);
	assert(response.ok, `${path} returned ${response.status}`);
	console.log(`✓ route ${path} -> ${response.status}`);
}

async function smokeArtworkValidation() {
	// Tiny valid PNG. It should pass MIME/file validation while producing print-quality warnings.
	const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
	const bytes = Uint8Array.from(Buffer.from(pngBase64, 'base64'));
	const form = new FormData();
	form.append('file', new Blob([bytes], { type: 'image/png' }), 'bbb-smoke-art.png');
	form.append('productType', 'hoodie');

	const response = await fetch(`${baseUrl}/api/validate-artwork`, {
		method: 'POST',
		headers: { origin: siteOrigin },
		body: form
	});
	const payload = await response.json();
	assert(response.ok, `validate-artwork returned ${response.status}`);
	assert(payload.valid === true, `validate-artwork expected valid=true, got ${payload.valid}`);
	assert(Array.isArray(payload.warnings), 'validate-artwork response missing warnings array');
	console.log(`✓ validate-artwork -> valid=${payload.valid}, warnings=${payload.warnings.length}`);
}

async function smokeCheckoutBoundary() {
	const payload = {
		productType: 'hoodie',
		productName: 'Custom Hoodie',
		size: 'S',
		color: 'Black',
		quantity: 1,
		artworkReference: 'bbb-smoke-art.png (image/png, 1 KB)',
		unitAmountCents: 4500,
		selectedOptions: {
			size: 'S',
			color: 'Black',
			'print-location': 'Front Only'
		},
		cancelPath: '/shop/hoodie?checkout=cancelled'
	};

	const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', origin: siteOrigin },
		body: JSON.stringify(payload)
	});
	const body = await response.text();
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		throw new Error(`checkout boundary returned non-JSON body: ${body}`);
	}

	if (process.env.STRIPE_SECRET_KEY) {
		assert(response.status < 500, `checkout with Stripe env returned ${response.status}: ${body}`);
		assert(parsed.url || parsed.error, 'checkout with Stripe env should return a Stripe URL or Stripe error payload');
		console.log(`✓ checkout with Stripe env -> ${response.status}`);
		return;
	}

	assert(response.status === 503, `checkout without Stripe env expected 503, got ${response.status}: ${body}`);
	assert(parsed.code === 'stripe_not_configured', `expected code=stripe_not_configured, got ${parsed.code}`);
	console.log('✓ checkout boundary without Stripe env -> 503 stripe_not_configured');
}

async function main() {
	console.log(`BBB checkout-boundary smoke against ${baseUrl}`);
	for (const route of routes) {
		await expectRoute(route);
	}
	await smokeArtworkValidation();
	await smokeCheckoutBoundary();
	console.log('PASS: BBB checkout-boundary smoke complete');
}

main().catch((error) => {
	console.error(`FAIL: ${error.message}`);
	process.exit(1);
});
