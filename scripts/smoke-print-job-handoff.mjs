#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
	buildPrintJobEmailSubject,
	buildPrintJobEmailTemplate,
	buildPrintJobHandoffReport
} from '../src/lib/printJobHandoff.ts';

const input = {
	productName: 'Custom Hoodie',
	productSlug: 'hoodie',
	quantity: 24,
	unitPrice: 45,
	orderTotal: 1080,
	sizeLabel: 'XL',
	colorLabel: 'Custom preview #1F2A44',
	printLocationLabel: 'Front Only',
	artworkReference: 'bbb-smoke-art.png (image/png, 312 KB)',
	artworkUploaded: true,
	artworkScale: 1.3,
	artworkPosition: { x: 54, y: 47 },
	artworkSizePrice: 3,
	previewGarmentColorHex: '#1F2A44',
	colorPreviewMode: 'custom',
	selectedOptions: {
		size: 'XL',
		color: 'Custom preview #1F2A44',
		'print-location': 'Front Only'
	},
	qualityWarnings: ['Resolution is low for a large chest print.']
};

function expectIncludes(haystack, needle, label) {
	assert.ok(haystack.includes(needle), `${label} missing ${needle}`);
}

console.log('BBB print-job handoff smoke');

const report = buildPrintJobHandoffReport(input);
for (const marker of [
	'TRIPLE B PRINTS — PRINT JOB HANDOFF',
	'QUOTE / PRODUCTION REVIEW',
	'PRODUCT',
	'SELECTED OPTIONS',
	'ARTWORK',
	'ARTWORK QUALITY NOTES',
	'PRICE PREVIEW',
	'SHOP REVIEW CHECKLIST'
]) {
	expectIncludes(report, marker, 'report');
}

expectIncludes(report, 'Product: Custom Hoodie', 'report');
expectIncludes(report, 'Quantity: 24', 'report');
expectIncludes(report, 'Preview color hex: #1F2A44', 'report');
expectIncludes(report, 'Artwork scale: 130%', 'report');
expectIncludes(report, 'Artwork position: 54% horizontal / 47% vertical', 'report');
expectIncludes(report, 'Artwork size adjustment: $3.00', 'report');
expectIncludes(report, 'Order total preview: $1080.00', 'report');
expectIncludes(report, '[ ] Confirm artwork file is production-ready', 'report');
console.log('✓ report contains production handoff sections and values');

const subject = buildPrintJobEmailSubject(input);
assert.equal(subject, 'Print job review — Custom Hoodie — qty 24');
console.log('✓ subject is stable');

const template = buildPrintJobEmailTemplate(input, 'triplebp330@gmail.com');
expectIncludes(template, 'To: triplebp330@gmail.com', 'template');
expectIncludes(template, 'Subject: Print job review — Custom Hoodie — qty 24', 'template');
expectIncludes(template, 'TRIPLE B PRINTS — PRINT JOB HANDOFF', 'template');
console.log('✓ email template includes destination, subject, and report');

console.log('PASS: BBB print-job handoff smoke complete');
