import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { validateCheckoutPayload } from '$lib/configurator';
import type { RequestHandler } from './$types';

const STRIPE_CHECKOUT_URL = 'https://api.stripe.com/v1/checkout/sessions';
// STRIPE_SECRET_KEY must be set in environment variables.
// For local dev, create .env with STRIPE_SECRET_KEY=sk_test_...
// For Vercel, add it in dashboard → Project → Environment Variables.
// Never commit real keys.
const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

function assertStripeKey() {
	if (!STRIPE_SECRET_KEY) {
		throw new Error('STRIPE_SECRET_KEY is required. Set it in .env or Vercel environment variables.');
	}
	return STRIPE_SECRET_KEY;
}

function appendFormValue(form: URLSearchParams, key: string, value: string | number) {
	form.append(key, String(value));
}

export const POST: RequestHandler = async ({ request, url }) => {
	const body = await request.json().catch(() => null);

	if (!body) {
		return json({ error: 'Request body must be valid JSON.' }, { status: 400 });
	}

	let checkout;

	try {
		checkout = validateCheckoutPayload(body);
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Checkout payload is invalid.' },
			{ status: 400 }
		);
	}

	const {
		product,
		quantity,
		artworkReference,
		unitAmountCents,
		selectedOptions,
		cancelPath,
		sizeLabel,
		colorLabel,
		artworkScale,
		artworkPosition,
		artworkSizePriceCents,
		artworkUrl,
		artworkStorageStatus,
		previewGarmentColor,
		previewGarmentColorHex,
		colorPreviewMode
	} = checkout;

	let stripeSecretKey: string;
	try {
		stripeSecretKey = assertStripeKey();
	} catch (error) {
		return json(
			{
				error: error instanceof Error ? error.message : 'Stripe Checkout is not configured yet.',
				code: 'stripe_not_configured'
			},
			{ status: 503 }
		);
	}

	// Success gets its own page so the customer lands somewhere calm and explicit after payment.
	// Cancel intentionally returns to the same product page so they can adjust options instead of starting over.
	const successUrl = `${url.origin}/shop/success?session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(product.slug)}`;
	const cancelUrl = `${url.origin}${cancelPath}`;

	const form = new URLSearchParams();
	appendFormValue(form, 'mode', 'payment');
	appendFormValue(form, 'success_url', successUrl);
	appendFormValue(form, 'cancel_url', cancelUrl);
	appendFormValue(form, 'line_items[0][quantity]', quantity);
	appendFormValue(form, 'line_items[0][price_data][currency]', 'usd');
	appendFormValue(form, 'line_items[0][price_data][unit_amount]', unitAmountCents);
	appendFormValue(form, 'line_items[0][price_data][product_data][name]', product.name);
	appendFormValue(form, 'line_items[0][price_data][product_data][description]', `Custom order for ${product.name}`);
	appendFormValue(form, 'metadata[product_type]', product.slug);
	appendFormValue(form, 'metadata[size]', sizeLabel);
	appendFormValue(form, 'metadata[color]', colorLabel);
	appendFormValue(form, 'metadata[artwork_reference]', artworkReference);
	if (artworkScale !== undefined) appendFormValue(form, 'metadata[artwork_scale]', artworkScale.toFixed(2));
	if (artworkPosition) appendFormValue(form, 'metadata[artwork_position]', `${Math.round(artworkPosition.x)}:${Math.round(artworkPosition.y)}`);
	if (artworkSizePriceCents !== undefined) appendFormValue(form, 'metadata[artwork_size_price_cents]', artworkSizePriceCents);
	if (artworkUrl) appendFormValue(form, 'metadata[artwork_url]', artworkUrl);
	if (artworkStorageStatus) appendFormValue(form, 'metadata[artwork_storage_status]', artworkStorageStatus);
	if (previewGarmentColor) appendFormValue(form, 'metadata[preview_garment_color]', previewGarmentColor);
	if (previewGarmentColorHex) appendFormValue(form, 'metadata[preview_garment_color_hex]', previewGarmentColorHex);
	if (colorPreviewMode) appendFormValue(form, 'metadata[color_preview_mode]', colorPreviewMode);

	// Selected options are flattened into metadata so the shop can inspect exactly what the customer chose.
	if (selectedOptions && typeof selectedOptions === 'object') {
		for (const [key, value] of Object.entries(selectedOptions)) {
			appendFormValue(form, `metadata[option_${key}]`, String(value));
		}
	}

	const stripeResponse = await fetch(STRIPE_CHECKOUT_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${stripeSecretKey}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: form.toString()
	});

	const stripePayload = await stripeResponse.json();

	if (!stripeResponse.ok || !stripePayload.url) {
		return json(
			{
				error: stripePayload?.error?.message ?? 'Stripe did not return a checkout URL.',
				stripeStatus: stripeResponse.status
			},
			{ status: 500 }
		);
	}

	return json({ url: stripePayload.url, id: stripePayload.id });
};
