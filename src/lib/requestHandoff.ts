export type RequestHandoffInput = {
	name: string;
	email: string;
	phone?: string;
	product: string;
	quantity: string;
	timeline: string;
	artworkStatus: string;
	notes?: string;
	requestEmail: string;
};

function clean(value: string | undefined) {
	return value?.trim() || '—';
}

export function buildRequestEmailSubject(input: RequestHandoffInput) {
	return `Print request — ${clean(input.product) === '—' ? 'custom project' : clean(input.product)} — ${clean(input.name) === '—' ? 'new customer' : clean(input.name)}`;
}

export function buildArtworkFilesLine(input: RequestHandoffInput) {
	return input.artworkStatus === 'Ready to upload'
		? 'I can attach artwork to this email before sending.'
		: 'Please let me know what artwork or cleanup details you need next.';
}

export function buildRequestEmailBody(input: RequestHandoffInput) {
	return [
		'Hi Triple B Prints,',
		'',
		'I’d like to start a print request. Here are the details:',
		'',
		'CUSTOMER',
		`Name: ${clean(input.name)}`,
		`Email: ${clean(input.email)}`,
		`Phone/text: ${clean(input.phone)}`,
		'',
		'JOB DETAILS',
		`Product: ${clean(input.product)}`,
		`Quantity/run size: ${clean(input.quantity)}`,
		`Timeline: ${clean(input.timeline)}`,
		`Artwork status: ${clean(input.artworkStatus)}`,
		'',
		'NOTES',
		clean(input.notes),
		'',
		'ARTWORK / FILES',
		buildArtworkFilesLine(input),
		'',
		'Please review the artwork needs, placement, garment/product availability, and pricing before production.',
		'',
		'Thank you.'
	].join('\n');
}

export function buildRequestEmailTemplate(input: RequestHandoffInput) {
	return `To: ${input.requestEmail}\nSubject: ${buildRequestEmailSubject(input)}\n\n${buildRequestEmailBody(input)}`;
}

export function buildMailtoHref(input: RequestHandoffInput) {
	return `mailto:${input.requestEmail}?subject=${encodeURIComponent(buildRequestEmailSubject(input))}&body=${encodeURIComponent(buildRequestEmailBody(input))}`;
}
