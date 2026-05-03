import { env } from '$env/dynamic/public';

// The browser only needs the publishable key, and SvelteKit's public env channel is the safe place
// to read it from. We use the dynamic public env object so builds do not require the variable to exist.
// For local dev, create .env with PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
// For Vercel, add it in dashboard → Project → Environment Variables.
export const STRIPE_PUBLISHABLE_KEY = env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!STRIPE_PUBLISHABLE_KEY) {
	console.warn('PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe Checkout will not work until you add it to environment variables.');
}
