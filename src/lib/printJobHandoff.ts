export type PrintJobHandoffInput = {
	productName: string;
	productSlug: string;
	quantity: number;
	unitPrice: number;
	orderTotal: number;
	sizeLabel: string;
	colorLabel: string;
	printLocationLabel: string;
	artworkReference: string;
	artworkUploaded: boolean;
	artworkScale: number;
	artworkPosition: { x: number; y: number };
	artworkSizePrice: number;
	previewGarmentColorHex: string;
	colorPreviewMode: 'preset' | 'custom';
	selectedOptions: Record<string, string>;
	qualityWarnings: string[];
};

function money(value: number) {
	return `$${value.toFixed(2)}`;
}

function percent(value: number) {
	return `${Math.round(value)}%`;
}

function clean(value: string | undefined, fallback = '—') {
	return value?.trim() || fallback;
}

function optionLines(selectedOptions: Record<string, string>) {
	return Object.entries(selectedOptions).map(([key, value]) => `- ${key}: ${value}`);
}

export function buildPrintJobHandoffReport(input: PrintJobHandoffInput) {
	const warnings = input.qualityWarnings.length > 0
		? input.qualityWarnings.map((warning) => `- ${warning}`)
		: ['- No quality warnings recorded in the preview.'];

	return [
		'TRIPLE B PRINTS — PRINT JOB HANDOFF',
		'',
		'QUOTE / PRODUCTION REVIEW',
		'This is a preview handoff, not automatic production approval. Confirm artwork, product availability, placement, pricing, and timeline before printing.',
		'',
		'PRODUCT',
		`Product: ${clean(input.productName)}`,
		`Product slug: ${clean(input.productSlug)}`,
		`Quantity: ${input.quantity}`,
		`Size: ${clean(input.sizeLabel)}`,
		`Garment/product color: ${clean(input.colorLabel)}`,
		`Preview color hex: ${clean(input.previewGarmentColorHex)}`,
		`Color mode: ${input.colorPreviewMode}`,
		`Print location: ${clean(input.printLocationLabel)}`,
		'',
		'SELECTED OPTIONS',
		...optionLines(input.selectedOptions),
		'',
		'ARTWORK',
		`Artwork uploaded in preview: ${input.artworkUploaded ? 'yes' : 'no'}`,
		`Artwork reference: ${clean(input.artworkReference, 'No artwork file staged yet')}`,
		`Artwork scale: ${percent(input.artworkScale * 100)}`,
		`Artwork position: ${percent(input.artworkPosition.x)} horizontal / ${percent(input.artworkPosition.y)} vertical`,
		'',
		'ARTWORK QUALITY NOTES',
		...warnings,
		'',
		'PRICE PREVIEW',
		`Unit price preview: ${money(input.unitPrice)}`,
		`Artwork size adjustment: ${money(input.artworkSizePrice)}`,
		`Order total preview: ${money(input.orderTotal)}`,
		'',
		'SHOP REVIEW CHECKLIST',
		'[ ] Confirm product/garment availability',
		'[ ] Confirm size availability',
		'[ ] Confirm color availability or closest match',
		'[ ] Confirm artwork file is production-ready',
		'[ ] Confirm artwork placement and scale',
		'[ ] Confirm price and any artwork cleanup charge',
		'[ ] Confirm timeline before production',
		'[ ] Contact customer with final quote or approval request'
	].join('\n');
}

export function buildPrintJobEmailSubject(input: PrintJobHandoffInput) {
	return `Print job review — ${clean(input.productName, 'custom project')} — qty ${input.quantity}`;
}

export function buildPrintJobEmailTemplate(input: PrintJobHandoffInput, requestEmail: string) {
	return `To: ${requestEmail}\nSubject: ${buildPrintJobEmailSubject(input)}\n\n${buildPrintJobHandoffReport(input)}`;
}
