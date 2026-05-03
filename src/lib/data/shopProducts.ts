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

// The repo had nine nearly-identical configurators with slightly different option sets.
// We normalize them into one data shape so checkout logic stays consistent across every product page.
export const shopProducts: Record<string, ProductConfig> = {
	't-shirt': {
		slug: 't-shirt',
		name: 'Custom T-Shirt',
		basePrice: 18,
		description: 'Premium cotton tee with your custom artwork. Soft, durable, and made to stand out.',
		image: 'https://placehold.co/600x700/1e293b/ffffff?text=T-Shirt+Base',
		imageAlt: 'T-shirt base garment preview',
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
		image: 'https://placehold.co/600x700/1e293b/ffffff?text=Hoodie+Base', imageAlt: 'Hoodie base garment preview',
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
		image: 'https://placehold.co/600x700/1e293b/ffffff?text=Mug+Base', imageAlt: 'Ceramic mug base preview',
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
		image: 'https://placehold.co/600x700/f59e0b/ffffff?text=Hat+Base', imageAlt: 'Hat base garment preview',
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
		image: 'https://placehold.co/600x700/f59e0b/ffffff?text=Keychain+Base', imageAlt: 'Keychain base preview',
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
		image: 'https://placehold.co/600x700/8b5cf6/ffffff?text=Phone+Case+Base', imageAlt: 'Phone case base preview',
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
		image: 'https://placehold.co/600x700/10b981/ffffff?text=Coaster+Base', imageAlt: 'Coaster base preview',
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
		image: 'https://placehold.co/600x700/06b6d4/ffffff?text=Shorts+Base', imageAlt: 'Shorts base garment preview',
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
		image: 'https://placehold.co/600x700/64748b/ffffff?text=Joggers+Base', imageAlt: 'Joggers base garment preview',
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
