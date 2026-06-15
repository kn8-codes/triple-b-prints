export type SwatchOption = {
	label: string;
	priceMod: number;
	hex?: string;
};

export type OptionGroup = {
	id: string;
	label: string;
	helperText: string;
	render: 'pill' | 'swatch';
	options: SwatchOption[];
};

export type ProductConfig = {
	slug: string;
	name: string;
	basePrice: number;
	description: string;
	image: string;
	imageAlt: string;
	previewEmptyText: string;
	artworkPosition: { x: number; y: number };
	artworkMaxScale?: number;
	optionGroups: OptionGroup[];
};

function productStudioImage(label: string, accent: string, kind: 'shirt' | 'hoodie' | 'product' = 'product') {
	const garment = kind === 'hoodie'
		? `<path d="M214 112c22-34 150-34 172 0 16 16 28 40 31 70l76 64-58 86-50-41v250H215V291l-50 41-58-86 76-64c3-30 15-54 31-70Z" fill="#0b1220" stroke="${accent}" stroke-opacity="0.55" stroke-width="4"/>
		<path d="M238 118c-20 42-19 78 3 108h118c22-30 23-66 3-108-30 24-94 24-124 0Z" fill="#111827" stroke="#ffffff" stroke-opacity="0.12"/>
		<path d="M248 256h104c19 0 34 15 34 34v74H214v-74c0-19 15-34 34-34Z" fill="#050816" fill-opacity="0.46" stroke="#ffffff" stroke-opacity="0.10"/>
		<path d="M246 432h108" stroke="${accent}" stroke-width="6" stroke-opacity="0.45" stroke-linecap="round"/>`
		: kind === 'shirt'
			? `<path d="M230 96c-45 18-73 56-82 111l-74 72 68 78 50-47v250h216V310l50 47 68-78-74-72c-9-55-37-93-82-111H230Z" fill="#0b1220" stroke="${accent}" stroke-opacity="0.55" stroke-width="4"/>
		<path d="M236 100c-22 32-28 75-14 130h156c14-55 8-98-14-130-31 25-97 25-128 0Z" fill="#111827" stroke="#ffffff" stroke-opacity="0.12"/>
		<rect x="214" y="272" width="172" height="150" rx="30" fill="#050816" fill-opacity="0.48" stroke="#ffffff" stroke-opacity="0.10"/>
		<path d="M246 456h108" stroke="${accent}" stroke-width="6" stroke-opacity="0.45" stroke-linecap="round"/>`
			: `<rect x="145" y="120" width="310" height="410" rx="46" fill="#0b1220" stroke="${accent}" stroke-opacity="0.55" stroke-width="4"/>
		<rect x="182" y="175" width="236" height="245" rx="28" fill="#111827" stroke="#ffffff" stroke-opacity="0.12"/>
		<path d="M198 458h204" stroke="${accent}" stroke-opacity="0.42" stroke-width="6" stroke-linecap="round"/>`;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700">
		<defs>
			<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111827"/><stop offset="1" stop-color="#030712"/></linearGradient>
			<radialGradient id="glow" cx="50%" cy="16%" r="72%"><stop stop-color="${accent}" stop-opacity="0.34"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
			<filter id="shadow"><feDropShadow dx="0" dy="28" stdDeviation="23" flood-color="#000" flood-opacity="0.52"/></filter>
		</defs>
		<rect width="600" height="700" fill="url(#bg)"/>
		<rect width="600" height="700" fill="url(#glow)"/>
		<g filter="url(#shadow)">${garment}</g>
		<text x="300" y="602" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="900" text-anchor="middle" letter-spacing="-1">${label}</text>
		<text x="300" y="638" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="4">TRIPLE B PRINTS</text>
	</svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// The repo had nine nearly-identical configurators with slightly different option sets.
// We normalize them into one data shape so checkout logic stays consistent across every product page.
export const shopProducts: Record<string, ProductConfig> = {
	't-shirt': {
		slug: 't-shirt',
		name: 'Custom T-Shirt',
		basePrice: 18,
		description: 'Premium cotton tee with your custom artwork. Soft, durable, and made to stand out.',
		image: '/products/t-shirt-black-front.jpg',
		imageAlt: 'Realistic black custom t-shirt mockup with blank printable front artwork area',
		previewEmptyText: 'Upload artwork to see your t-shirt preview.',
		artworkPosition: { x: 50, y: 40 },
		artworkMaxScale: 2,
		optionGroups: [
			{ id: 'size', label: 'Size', helperText: 'Choose the shirt size.', render: 'pill', options: [
				{ label: 'S', priceMod: 0 }, { label: 'M', priceMod: 0 }, { label: 'L', priceMod: 0 }, { label: 'XL', priceMod: 2 }, { label: '2XL', priceMod: 4 }
			]},
			{ id: 'color', label: 'Color', helperText: 'Choose the garment color.', render: 'swatch', options: [
				{ label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'White', priceMod: 0, hex: '#f5f5f5' }, { label: 'Navy', priceMod: 0, hex: '#1e3a5f' }, { label: 'Red', priceMod: 0, hex: '#cc0000' }
			]}
		]
	},
	'hoodie': {
		slug: 'hoodie', name: 'Custom Hoodie', basePrice: 45,
		description: 'Heavyweight cotton-blend hoodie with your custom artwork. Front print, back print, or both.',
		image: '/products/hoodie-black-front.jpg', imageAlt: 'Realistic black custom hoodie mockup with blank printable front artwork area',
		previewEmptyText: 'Upload artwork to see your hoodie preview.', artworkPosition: { x: 50, y: 50 }, artworkMaxScale: 2,
		optionGroups: [
			{ id: 'size', label: 'Size', helperText: 'Choose the hoodie size.', render: 'pill', options: [
				{ label: 'S', priceMod: 0 }, { label: 'M', priceMod: 0 }, { label: 'L', priceMod: 0 }, { label: 'XL', priceMod: 2 }, { label: '2XL', priceMod: 4 }, { label: '3XL', priceMod: 6 }
			]},
			{ id: 'color', label: 'Color', helperText: 'Choose the hoodie color.', render: 'swatch', options: [
				{ label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'Navy', priceMod: 0, hex: '#1e3a5f' }, { label: 'Heather Grey', priceMod: 0, hex: '#8b8b8b' }, { label: 'Forest Green', priceMod: 0, hex: '#1b4d3e' }, { label: 'Maroon', priceMod: 0, hex: '#6b1c23' }
			]},
			{ id: 'print-location', label: 'Print Location', helperText: 'Choose where the artwork should be printed.', render: 'pill', options: [
				{ label: 'Front Only', priceMod: 0 }, { label: 'Back Only', priceMod: 0 }, { label: 'Front + Back', priceMod: 8 }
			]}
		]
	},
	'mug': {
		slug: 'mug', name: 'Custom Mug', basePrice: 14,
		description: '11oz ceramic mug with your custom artwork. Dishwasher safe, vivid print quality.',
		image: '/products/mug-white-front.jpg', imageAlt: 'Realistic white ceramic mug mockup with blank printable front artwork area',
		previewEmptyText: 'Upload artwork to see your mug preview.', artworkPosition: { x: 50, y: 45 }, artworkMaxScale: 2,
		optionGroups: [
			{ id: 'size', label: 'Size', helperText: 'Choose the mug size.', render: 'pill', options: [
				{ label: '11 oz', priceMod: 0 }, { label: '15 oz', priceMod: 3 }
			]},
			{ id: 'color', label: 'Color', helperText: 'Choose the mug accent color.', render: 'swatch', options: [
				{ label: 'White', priceMod: 0, hex: '#f5f5f5' }, { label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'Navy', priceMod: 0, hex: '#1e3a5f' }, { label: 'Red', priceMod: 0, hex: '#cc0000' }
			]}
		]
	},
	'hat': {
		slug: 'hat', name: 'Custom Hat', basePrice: 22,
		description: 'Structured cap with clean embroidery-style placement for your logo or art.',
		image: productStudioImage('Hat', '#f59e0b'), imageAlt: 'Hat base garment preview',
		previewEmptyText: 'Upload artwork to see your hat preview.', artworkPosition: { x: 50, y: 48 }, artworkMaxScale: 1.6,
		optionGroups: [
			{ id: 'size', label: 'Style', helperText: 'Choose the hat style.', render: 'pill', options: [
				{ label: 'Dad Hat', priceMod: 0 }, { label: 'Snapback', priceMod: 2 }, { label: 'Trucker', priceMod: 1 }
			]},
			{ id: 'color', label: 'Color', helperText: 'Choose the hat color.', render: 'swatch', options: [
				{ label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'Khaki', priceMod: 0, hex: '#b59b6a' }, { label: 'Navy', priceMod: 0, hex: '#1e3a5f' }, { label: 'White', priceMod: 0, hex: '#f5f5f5' }
			]}
		]
	},
	'keychain': {
		slug: 'keychain', name: 'Custom Keychain', basePrice: 8,
		description: 'Small, durable, and perfect for logos, mascots, and quick gift runs.',
		image: productStudioImage('Keychain', '#f59e0b'), imageAlt: 'Keychain base preview',
		previewEmptyText: 'Upload artwork to see your keychain preview.', artworkPosition: { x: 50, y: 50 }, artworkMaxScale: 1.5,
		optionGroups: [
			{ id: 'size', label: 'Material', helperText: 'Choose the keychain material.', render: 'pill', options: [
				{ label: 'Acrylic', priceMod: 0 }, { label: 'Wood', priceMod: 2 }, { label: 'Metal', priceMod: 4 }
			]},
			{ id: 'color', label: 'Backing Color', helperText: 'Choose the backing or accent color.', render: 'swatch', options: [
				{ label: 'Clear', priceMod: 0, hex: '#dbeafe' }, { label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'White', priceMod: 0, hex: '#f5f5f5' }, { label: 'Gold', priceMod: 1, hex: '#d4af37' }
			]}
		]
	},
	'phone-case': {
		slug: 'phone-case', name: 'Custom Phone Case', basePrice: 20,
		description: 'Protective case with full-color custom artwork for everyday carry.',
		image: productStudioImage('Phone Case', '#8b5cf6'), imageAlt: 'Phone case base preview',
		previewEmptyText: 'Upload artwork to see your phone case preview.', artworkPosition: { x: 50, y: 50 }, artworkMaxScale: 1.7,
		optionGroups: [
			{ id: 'size', label: 'Phone Model', helperText: 'Choose the phone model.', render: 'pill', options: [
				{ label: 'iPhone 15', priceMod: 0 }, { label: 'iPhone 15 Pro', priceMod: 2 }, { label: 'Galaxy S24', priceMod: 1 }
			]},
			{ id: 'color', label: 'Finish', helperText: 'Choose the case finish.', render: 'swatch', options: [
				{ label: 'Clear Gloss', priceMod: 0, hex: '#dbeafe' }, { label: 'Matte Black', priceMod: 2, hex: '#111827' }, { label: 'Frosted', priceMod: 1, hex: '#cbd5e1' }
			]}
		]
	},
	'coaster': {
		slug: 'coaster', name: 'Custom Coaster', basePrice: 12,
		description: 'Sturdy custom coasters that make logos and artwork pop on every table.',
		image: productStudioImage('Coaster', '#10b981'), imageAlt: 'Coaster base preview',
		previewEmptyText: 'Upload artwork to see your coaster preview.', artworkPosition: { x: 50, y: 50 }, artworkMaxScale: 1.5,
		optionGroups: [
			{ id: 'size', label: 'Shape', helperText: 'Choose the coaster shape.', render: 'pill', options: [
				{ label: 'Square', priceMod: 0 }, { label: 'Round', priceMod: 0 }, { label: 'Hexagon', priceMod: 2 }
			]},
			{ id: 'color', label: 'Edge Color', helperText: 'Choose the coaster edge color.', render: 'swatch', options: [
				{ label: 'Natural', priceMod: 0, hex: '#d6b98c' }, { label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'White', priceMod: 0, hex: '#f5f5f5' }
			]}
		]
	},
	'shorts': {
		slug: 'shorts', name: 'Custom Shorts', basePrice: 28,
		description: 'Comfortable custom shorts with print placement that works for teams, brands, and events.',
		image: productStudioImage('Shorts', '#06b6d4'), imageAlt: 'Shorts base garment preview',
		previewEmptyText: 'Upload artwork to see your shorts preview.', artworkPosition: { x: 50, y: 45 }, artworkMaxScale: 1.6,
		optionGroups: [
			{ id: 'size', label: 'Size', helperText: 'Choose the shorts size.', render: 'pill', options: [
				{ label: 'S', priceMod: 0 }, { label: 'M', priceMod: 0 }, { label: 'L', priceMod: 0 }, { label: 'XL', priceMod: 2 }, { label: '2XL', priceMod: 4 }
			]},
			{ id: 'color', label: 'Color', helperText: 'Choose the shorts color.', render: 'swatch', options: [
				{ label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'Grey', priceMod: 0, hex: '#6b7280' }, { label: 'Navy', priceMod: 0, hex: '#1e3a5f' }
			]},
			{ id: 'print-location', label: 'Print Location', helperText: 'Choose where the print should land.', render: 'pill', options: [
				{ label: 'Left Leg', priceMod: 0 }, { label: 'Right Leg', priceMod: 0 }, { label: 'Both Legs', priceMod: 6 }
			]}
		]
	},
	'joggers': {
		slug: 'joggers', name: 'Custom Joggers', basePrice: 35,
		description: 'Midweight joggers built for clean front-leg branding and repeat-wear comfort.',
		image: productStudioImage('Joggers', '#64748b'), imageAlt: 'Joggers base garment preview',
		previewEmptyText: 'Upload artwork to see your joggers preview.', artworkPosition: { x: 50, y: 42 }, artworkMaxScale: 1.6,
		optionGroups: [
			{ id: 'size', label: 'Size', helperText: 'Choose the jogger size.', render: 'pill', options: [
				{ label: 'S', priceMod: 0 }, { label: 'M', priceMod: 0 }, { label: 'L', priceMod: 0 }, { label: 'XL', priceMod: 2 }, { label: '2XL', priceMod: 4 }
			]},
			{ id: 'color', label: 'Color', helperText: 'Choose the jogger color.', render: 'swatch', options: [
				{ label: 'Black', priceMod: 0, hex: '#1a1a1a' }, { label: 'Heather Grey', priceMod: 0, hex: '#8b8b8b' }, { label: 'Navy', priceMod: 0, hex: '#1e3a5f' }
			]},
			{ id: 'print-location', label: 'Print Location', helperText: 'Choose the print location.', render: 'pill', options: [
				{ label: 'Left Thigh', priceMod: 0 }, { label: 'Right Thigh', priceMod: 0 }, { label: 'Both Thighs', priceMod: 6 }
			]}
		]
	}
};
