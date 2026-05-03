// We explicitly disable full-site prerendering because Stripe Checkout needs a runtime server route.
// Leaving prerender=true here would fight the new /api/create-checkout-session endpoint.
export const prerender = false;
