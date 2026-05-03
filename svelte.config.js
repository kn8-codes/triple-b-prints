import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// The project already leans on Svelte 5 runes, so we keep that behavior explicit.
		// That keeps every new component consistent with the existing codebase instead of mixing styles.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		// Stripe Checkout requires a real server endpoint so we can hold the secret key on the server.
		// The previous static adapter cannot serve +server routes at runtime.
		// adapter-vercel gives us serverless API routes while keeping Vercel hosting.
		adapter: adapter()
	}
};

export default config;
