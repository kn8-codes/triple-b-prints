<script lang="ts">
	import ProductConfigurator from '$lib/components/ProductConfigurator.svelte';
	import { shopProducts } from '$lib/data/shopProducts';

	// Each product route stays as its own page so existing URLs do not change, but the real
	// configurator logic lives in one shared component to keep checkout behavior identical everywhere.
	const product = shopProducts["hat"];
</script>

<ProductConfigurator {product} />
