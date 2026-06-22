#!/usr/bin/env node

const baseUrl = process.env.BBB_BASE_URL ?? 'http://127.0.0.1:5174';

const publicRoutes = [
	'/',
	'/shop/t-shirt',
	'/shop/hoodie',
	'/equipment',
	'/turnkey-interview',
	'/contact'
];

const forbiddenMarkers = [
	'quote or checkout',
	'checkout-ready',
	'live configurator',
	'buy now',
	'starting checkout',
	'turnkey_intake',
	'supabase',
	'buy the business',
	'turnkey business interview',
	'equipment stack reference'
];

const requiredRouteMarkers = {
	'/': ['Upload art. Place it. Review.', 'Quote review'],
	'/shop/t-shirt': ['Custom preview color', 'Use custom color', 'Preview only'],
	'/shop/hoodie': ['Custom preview color', 'Use custom color', 'Preview only', 'Sand/Tan'],
	'/equipment': ['This capability page is parked', 'Browse product previews', 'Start a quote request'],
	'/turnkey-interview': ['This interview page is no longer public-facing', 'Archived internal page', 'Start a quote request'],
	'/contact': ['Start a print request', 'Email handoff', 'Destination:', 'triplebp330@gmail.com', 'Not automatic yet', 'Artwork files']
};

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

function stripHtml(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

async function fetchRoute(route) {
	const response = await fetch(`${baseUrl}${route}`, {
		headers: { 'user-agent': 'BBB-public-copy-boundary-smoke' }
	});
	assert(response.ok, `${route} returned ${response.status}`);
	const html = await response.text();
	const text = stripHtml(html);
	console.log(`✓ route ${route} -> ${response.status}`);
	return { html, text, lowerText: text.toLowerCase() };
}

function checkForbidden(route, lowerText) {
	const hits = forbiddenMarkers.filter((marker) => lowerText.includes(marker));
	assert(hits.length === 0, `${route} contains forbidden public marker(s): ${hits.join(', ')}`);
	console.log(`✓ route ${route} forbidden markers clear`);
}

function checkRequired(route, html, text) {
	const required = requiredRouteMarkers[route] ?? [];
	const combined = `${html}\n${text}`;
	const missing = required.filter((marker) => !combined.includes(marker));
	assert(missing.length === 0, `${route} missing required marker(s): ${missing.join(', ')}`);
	if (required.length > 0) console.log(`✓ route ${route} required markers present`);
}

async function main() {
	console.log(`BBB public-copy boundary smoke against ${baseUrl}`);
	for (const route of publicRoutes) {
		const { html, text, lowerText } = await fetchRoute(route);
		checkForbidden(route, lowerText);
		checkRequired(route, html, text);
	}
	console.log('PASS: BBB public-copy boundary smoke complete');
}

main().catch((error) => {
	console.error(`FAIL: ${error.message}`);
	process.exit(1);
});
