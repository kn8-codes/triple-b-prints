import { loadStripe } from '@stripe/stripe-js';

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
 *   Set in .env for local dev, or Vercel dashboard for production.
 */

// Read from Vite's env injection. Falls back to empty string if not set.
const PUBLIC_STRIPE_PUBLISHABLE_KEY = import.meta.env?.PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Export for components that need the raw key (e.g. validation loading)
export const STRIPE_PUBLISHABLE_KEY = PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
	if (!stripePromise && PUBLIC_STRIPE_PUBLISHABLE_KEY) {
		stripePromise = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
	}
	return stripePromise;
}
