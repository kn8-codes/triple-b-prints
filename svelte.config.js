import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// The project already leans on Svelte 5 runes, so we keep that behavior explicit.
		// That keeps every new component consistent with the existing codebase instead of mixing styles.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		// Stripe Checkout requires a real server endpoint so we can hold the secret key on the server.
		// The previous static adapter cannot serve +server routes at runtime, so we switch to the
		// Node adapter to support /api/create-checkout-session without deploying from this machine.
		adapter: adapter()
	}
};

export default config;
