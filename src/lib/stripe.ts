import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

/**
 * Stripe Checkout Integration for Triple B Prints
 * 
 * This module provides a centralized Stripe instance using @stripe/stripe-js.
 * We use the publishable key (test mode) to initialize Stripe.js on the client.
 * The Stripe instance is lazy-loaded and cached so multiple components can share it.
 * 
 * Why @stripe/stripe-js?
 * - PCI compliance: card details never touch our server.
 * - Stripe handles the checkout UI securely via redirectToCheckout.
 * - Works with both one-time payments and subscriptions.
 * 
 * Environment variables:
 * - PUBLIC_STRIPE_PUBLISHABLE_KEY: must start with pk_test_ for test mode.
 */

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
	if (!stripePromise) {
		stripePromise = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
	}
	return stripePromise;
}
