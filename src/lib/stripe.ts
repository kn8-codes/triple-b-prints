import { env } from '$env/dynamic/public';

// The browser only needs the publishable key, and SvelteKit's public env channel is the safe place
// to read it from. We use the dynamic public env object so builds do not require the variable to exist.
// If nothing is injected yet, we fall back to Stripe's documented test publishable key for local wiring.
export const STRIPE_PUBLISHABLE_KEY =
	env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx';
