#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
	buildMailtoHref,
	buildRequestEmailBody,
	buildRequestEmailSubject,
	buildRequestEmailTemplate
} from '../src/lib/requestHandoff.ts';

const completeInput = {
	name: 'Nate Test',
	email: 'nate@example.com',
	phone: '330-555-0100',
	product: 'Hoodies',
	quantity: '24 hoodies',
	timeline: 'This week',
	artworkStatus: 'Ready to upload',
	notes: 'Left chest logo and full back print. Artwork may need cleanup.',
	requestEmail: 'triplebp330@gmail.com'
};

const minimalInput = {
	name: '',
	email: '',
	phone: '',
	product: '',
	quantity: '',
	timeline: '',
	artworkStatus: 'Need art/design help',
	notes: '',
	requestEmail: 'triplebp330@gmail.com'
};

function expectIncludes(haystack, needle, label) {
	assert.ok(haystack.includes(needle), `${label} missing ${needle}`);
}

console.log('BBB request-handoff smoke');

const subject = buildRequestEmailSubject(completeInput);
assert.equal(subject, 'Print request — Hoodies — Nate Test');
console.log('✓ subject includes product and customer name');

const body = buildRequestEmailBody(completeInput);
for (const marker of ['CUSTOMER', 'JOB DETAILS', 'NOTES', 'ARTWORK / FILES']) {
	expectIncludes(body, marker, 'body');
}
expectIncludes(body, 'I can attach artwork to this email before sending.', 'body');
expectIncludes(body, 'Please review the artwork needs, placement, garment/product availability, and pricing before production.', 'body');
console.log('✓ body sections and artwork guidance present');

const template = buildRequestEmailTemplate(completeInput);
expectIncludes(template, 'To: triplebp330@gmail.com', 'template');
expectIncludes(template, 'Subject: Print request — Hoodies — Nate Test', 'template');
console.log('✓ template includes destination and subject');

const href = buildMailtoHref(completeInput);
assert.ok(href.startsWith('mailto:triplebp330@gmail.com?subject='), 'mailto href should start with destination and subject query');
expectIncludes(href, encodeURIComponent('Print request — Hoodies — Nate Test'), 'mailto href');
expectIncludes(href, encodeURIComponent('ARTWORK / FILES'), 'mailto href');
console.log('✓ mailto href is encoded');

const minimalBody = buildRequestEmailBody(minimalInput);
for (const marker of ['Name: —', 'Email: —', 'Phone/text: —', 'Product: —', 'Quantity/run size: —', 'Timeline: —', 'NOTES\n—']) {
	expectIncludes(minimalBody, marker, 'minimal body');
}
expectIncludes(minimalBody, 'Please let me know what artwork or cleanup details you need next.', 'minimal body');
assert.equal(buildRequestEmailSubject(minimalInput), 'Print request — custom project — new customer');
console.log('✓ minimal inputs produce clean fallback placeholders');

console.log('PASS: BBB request-handoff smoke complete');
