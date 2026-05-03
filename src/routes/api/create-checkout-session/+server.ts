import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
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
	// We accept the exact fields requested by the user and allow a few extra helpers
	// (like unitAmountCents and selectedOptions) so the UI can pass precise pricing/context.
	const body = await request.json().catch(() => null);

	if (!body) {
		return json({ error: 'Request body must be valid JSON.' }, { status: 400 });
	}

	const {
		productType,
		productName,
		size,
		color,
		quantity,
		artworkReference,
		unitAmountCents,
		selectedOptions,
		cancelPath
	} = body;

	if (!productType || !productName || !quantity || !artworkReference || !unitAmountCents) {
		return json(
			{ error: 'productType, productName, quantity, artworkReference, and unitAmountCents are required.' },
			{ status: 400 }
		);
	}

	const parsedQuantity = Number(quantity);
	const parsedUnitAmount = Number(unitAmountCents);

	if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
		return json({ error: 'Quantity must be a whole number greater than zero.' }, { status: 400 });
	}

	if (!Number.isInteger(parsedUnitAmount) || parsedUnitAmount < 50) {
		return json({ error: 'unitAmountCents must be a whole number of at least 50.' }, { status: 400 });
	}

	// Success gets its own page so the customer lands somewhere calm and explicit after payment.
	// Cancel intentionally returns to the same product page so they can adjust options instead of starting over.
	const successUrl = `${url.origin}/shop/success?session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(productType)}`;
	const cancelUrl = cancelPath ? `${url.origin}${cancelPath}` : `${url.origin}/shop/${encodeURIComponent(productType)}?checkout=cancelled`;

	const form = new URLSearchParams();
	appendFormValue(form, 'mode', 'payment');
	appendFormValue(form, 'success_url', successUrl);
	appendFormValue(form, 'cancel_url', cancelUrl);
	appendFormValue(form, 'line_items[0][quantity]', parsedQuantity);
	appendFormValue(form, 'line_items[0][price_data][currency]', 'usd');
	appendFormValue(form, 'line_items[0][price_data][unit_amount]', parsedUnitAmount);
	appendFormValue(form, 'line_items[0][price_data][product_data][name]', productName);
	appendFormValue(form, 'line_items[0][price_data][product_data][description]', `Custom order for ${productName}`);
	appendFormValue(form, 'metadata[product_type]', productType);
	appendFormValue(form, 'metadata[size]', size || 'Not specified');
	appendFormValue(form, 'metadata[color]', color || 'Not specified');
	appendFormValue(form, 'metadata[artwork_reference]', artworkReference);

	// Selected options are flattened into metadata so the shop can inspect exactly what the customer chose.
	if (selectedOptions && typeof selectedOptions === 'object') {
		for (const [key, value] of Object.entries(selectedOptions)) {
			appendFormValue(form, `metadata[option_${key}]`, String(value));
		}
	}

	const stripeResponse = await fetch(STRIPE_CHECKOUT_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${assertStripeKey()}`,
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
