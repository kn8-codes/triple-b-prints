<script lang="ts">
	const products = [
		{
			name: 'Custom T-Shirts',
			price: 'From $25',
			image: 'https://placehold.co/400x400/1e293b/ffffff?text=T-Shirt',
			badge: 'Best Seller',
			link: '/shop/t-shirt'
		},
		{
			name: 'Custom Hoodies',
			price: 'From $45',
			image: 'https://placehold.co/400x400/1e293b/ffffff?text=Hoodie',
			badge: 'New',
			link: '/shop/hoodie'
		},
		{
			name: 'Printed Mugs',
			price: 'From $18',
			image: 'https://placehold.co/400x400/0ea5e9/ffffff?text=Mug',
			badge: 'New',
			link: '/shop/mug'
		},
		{
			name: 'Custom Hats',
			price: 'From $22',
			image: 'https://placehold.co/400x400/f59e0b/ffffff?text=Hat',
			badge: null,
			link: '/shop/hat'
		},
		{
			name: 'Keychains',
			price: 'From $8',
			image: 'https://placehold.co/400x400/f59e0b/ffffff?text=Keychain',
			badge: null,
			link: '/shop/keychain'
		},
		{
			name: 'Phone Cases',
			price: 'From $20',
			image: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Phone+Case',
			badge: null,
			link: '/shop/phone-case'
		},
		{
			name: 'Coasters',
			price: 'From $12',
			image: 'https://placehold.co/400x400/10b981/ffffff?text=Coaster',
			badge: null,
			link: '/shop/coaster'
		},
		{
			name: 'Shorts',
			price: 'From $28',
			image: 'https://placehold.co/400x400/06b6d4/ffffff?text=Shorts',
			badge: null,
			link: '/shop/shorts'
		},
		{
			name: 'Joggers',
			price: 'From $35',
			image: 'https://placehold.co/400x400/64748b/ffffff?text=Joggers',
			badge: null,
			link: '/shop/joggers'
		}
	];
</script>

<!-- Hero Section -->
<section class="relative bg-slate-900 text-white overflow-hidden">
	<div class="absolute inset-0 opacity-20 pointer-events-none">
		<div class="absolute -top-10 -left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl"></div>
		<div class="absolute top-1/2 right-0 w-96 h-96 bg-magenta-400 rounded-full blur-3xl" style="background: #FF00FF;"></div>
		<div class="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
	</div>
	<div class="max-w-6xl mx-auto px-6 py-16 md:py-24 relative">
		<div class="flex flex-col md:flex-row items-center gap-12">
			<div class="md:w-1/2">
				<img 
					src="/bbb-prints-logo-original.jpg" 
					alt="BBB Prints Logo" 
					class="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
				/>
			</div>
			<div class="md:w-1/2 text-center md:text-left">
				<h1 class="text-4xl md:text-6xl font-black leading-tight mb-6">
					Wear Your<br />
					<span class="text-yellow-400">Personality</span>
				</h1>
				<p class="text-lg md:text-xl text-slate-300 mb-8 max-w-lg">
					Custom t-shirts, mugs, keychains & more. We print what makes you, you.
				</p>
				<div class="flex flex-wrap gap-4 justify-center md:justify-start">
					<a
						href="/shop/t-shirt"
						class="inline-block bg-yellow-400 text-slate-900 font-black uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all"
					>
						Shop Now
					</a>
					<a
						href="#about"
						class="inline-block bg-white/10 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
					>
						Learn More
					</a>
				</div>
				<!-- Promo Banner -->
				<div class="mt-8 inline-flex items-center gap-3 bg-yellow-400/20 border border-yellow-400/40 rounded-xl px-4 py-3">
					<span class="text-yellow-400 font-black text-sm uppercase tracking-wide">SAVEBUCK$</span>
					<span class="text-slate-300 text-sm">Monthly promo code active — bulk deals & flash sales</span>
					<a href="/promo/savebucks" class="text-yellow-400 font-bold text-sm hover:underline ml-2">Shop Deals →</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Featured Products -->
<section id="products" class="py-20 bg-white">
	<div class="max-w-6xl mx-auto px-6">
		<div class="flex items-end justify-between mb-12">
			<div>
				<h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-2">Featured Products</h2>
				<p class="text-slate-500 text-lg">Our most popular custom prints</p>
			</div>
			<a href="#products" class="hidden md:inline-block text-rose-600 font-bold hover:underline">View all →</a>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each products as product}
				<a
					href={product.link}
					class="group block bg-yellow-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-400"
					aria-label={`View ${product.name} configurator`}
				>
					<div class="relative">
					<img
						src={product.image}
						alt={product.name}
						class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
					/>
						{#if product.badge}
							<span class="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
								{product.badge}
							</span>
						{/if}
					</div>
					<div class="p-6">
						<h3 class="text-xl font-black text-slate-900 mb-1">{product.name}</h3>
						<p class="text-slate-500 font-medium mb-4">{product.price}</p>
						<span
							class="block w-full bg-slate-900 text-white font-bold uppercase tracking-wide py-3 rounded-xl text-center group-hover:bg-rose-600 transition-colors"
						>
							Customize
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- About Section -->
<section id="about" class="py-20 bg-sky-50">
	<div class="max-w-6xl mx-auto px-6">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div>
				<h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6">About Triple B</h2>
				<p class="text-lg text-slate-600 mb-6 leading-relaxed">
					We’re a small print shop with big energy. Triple B started because we believe everyone deserves to wear their vibe — whether it’s a ridiculous meme on a mug or your dog’s face on a tee.
				</p>
				<p class="text-lg text-slate-600 mb-8 leading-relaxed">
					Every order is printed by hand, packed with care, and shipped with a sticker (obviously). No minimums, no boring stuff.
				</p>
				<div class="flex gap-8">
					<div>
						<p class="text-3xl font-black text-rose-600">500+</p>
						<p class="text-sm text-slate-500 font-bold uppercase tracking-wide">Happy Customers</p>
					</div>
					<div>
						<p class="text-3xl font-black text-rose-600">2 Day</p>
						<p class="text-sm text-slate-500 font-bold uppercase tracking-wide">Turnaround</p>
					</div>
					<div>
						<p class="text-3xl font-black text-rose-600">100%</p>
						<p class="text-sm text-slate-500 font-bold uppercase tracking-wide">Satisfaction</p>
					</div>
				</div>
			</div>
			<div class="relative">
				<div class="absolute -top-4 -left-4 w-full h-full bg-rose-200 rounded-2xl"></div>
				<img
					src="https://placehold.co/600x400/1e293b/ffffff?text=Print+Shop"
					alt="Triple B print shop"
					class="relative rounded-2xl shadow-lg w-full"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer id="contact" class="bg-slate-900 text-white py-16">
	<div class="max-w-6xl mx-auto px-6">
		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
			<div>
				<h3 class="text-2xl font-black uppercase mb-4">Triple B Prints</h3>
				<p class="text-slate-400 leading-relaxed">
					Bold prints for bold people. Custom merch made with love and a little chaos.
				</p>
			</div>
			<div>
				<h4 class="font-bold uppercase tracking-wide text-sm mb-4 text-slate-300">Shop</h4>
				<ul class="space-y-2 text-slate-400">
					<li><a href="/shop/t-shirt" class="hover:text-yellow-400 transition-colors">T-Shirts</a></li>
					<li><a href="/shop/mug" class="hover:text-yellow-400 transition-colors">Mugs</a></li>
					<li><a href="/shop/keychain" class="hover:text-yellow-400 transition-colors">Keychains</a></li>
					<li><a href="/shop/coaster" class="hover:text-yellow-400 transition-colors">Coasters</a></li>
				</ul>
			</div>
			<div>
				<h4 class="font-bold uppercase tracking-wide text-sm mb-4 text-slate-300">Company</h4>
				<ul class="space-y-2 text-slate-400">
					<li><a href="#about" class="hover:text-yellow-400 transition-colors">About</a></li>
					<li><a href="mailto:orders@triplebprints.example" class="hover:text-yellow-400 transition-colors">Shipping</a></li>
					<li><a href="mailto:orders@triplebprints.example" class="hover:text-yellow-400 transition-colors">Returns</a></li>
					<li><a href="mailto:hello@triplebprints.example" class="hover:text-yellow-400 transition-colors">Contact</a></li>
				</ul>
			</div>
			<div>
				<h4 class="font-bold uppercase tracking-wide text-sm mb-4 text-slate-300">Follow Us</h4>
				<div class="flex gap-4">
					<a href="https://instagram.com" aria-label="Instagram" class="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					</a>
					<a href="https://tiktok.com" aria-label="TikTok" class="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
					</a>
					<a href="https://x.com" aria-label="X / Twitter" class="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					</a>
				</div>
			</div>
		</div>
		<div class="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
			<p>© {new Date().getFullYear()} Triple B Prints. All rights reserved. Demo mockup.</p>
		</div>
	</div>
</footer>
