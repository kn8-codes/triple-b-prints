import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
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
