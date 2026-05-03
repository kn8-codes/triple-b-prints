
import { error } from '@sveltejs/kit';

/**
 * POST /api/checkout-session
 *
 * Creates a Stripe Checkout Session for a configured product.
 * This endpoint is called from each product configurator when the user clicks "Buy Now".
 *
 * Request body:
 *   - productName: string   (e.g. "Custom T-Shirt")
 *   - amount: number        (price in dollars, e.g. 22)
 *   - options: object       (size, color, etc. — stored in metadata)
 *   - imageDataUrl?: string (optional base64 artwork preview)
 *
 * Response:
 *   - { sessionId: string, url: string }
 *
 * Why Checkout Session?
 *   - Stripe hosts the checkout page → PCI compliance out of the box.
 *   - Supports cards, Apple Pay, Google Pay, Link, etc. automatically.
 *   - Test mode ensures no real money moves.
 *
 * Accessibility note:
 *   - The client redirects the user to Stripe’s accessible checkout page.
 *   - On success, Stripe redirects back to /shop/success.
 */

// We must use dynamic import so the server file doesn't break during prerender/build.
// adapter-static prerenders pages; the API route will be handled at runtime (or via
// a serverless adapter later). Dynamic import defers Stripe initialization until
// the first request, avoiding build-time env errors.
export const POST = async ({ request, url }) => {
	const { STRIPE_SECRET_KEY } = await import('$env/static/private');
	const Stripe = (await import('stripe')).default;

	const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-04-30.basil' });

	try {
		const body = await request.json();
		const { productName, amount, options } = body;

		// ─── Validation ───
		if (!productName || typeof amount !== 'number' || amount <= 0) {
			throw error(400, 'Missing or invalid productName / amount');
		}

		// Convert dollars to cents for Stripe
		const unitAmount = Math.round(amount * 100);

		// Build a human-readable description from options
		const optionEntries = Object.entries(options || {});
		const description = optionEntries.length > 0
			? optionEntries.map(([k, v]) => `${k}: ${v}`).join(' | ')
			: 'Custom configured product';

		// ─── Create Checkout Session ───
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: productName,
							description,
							// Stripe accepts up to 8 images; we skip base64 here for brevity
							images: []
						},
						unit_amount: unitAmount
					},
					quantity: 1
				}
			],
			metadata: {
				product: productName,
				...options
			},
			success_url: `${url.origin}/shop/success`,
			cancel_url: `${url.origin}/shop/cancel`
		});

		return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Stripe checkout session error:', err);
		throw error(500, err.message || 'Failed to create checkout session');
	}
};
