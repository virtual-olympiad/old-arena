<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Tile,
		ExpandableTile,
		Tooltip,
		TooltipDefinition,
		Link,
		ButtonSet,
		Button
	} from 'carbon-components-svelte';

	import Home from 'carbon-icons-svelte/lib/Home.svelte';
	import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import LogoInstagram from 'carbon-icons-svelte/lib/LogoInstagram.svelte';

	export let data;
	let { prerender } = data;

	prerender = true;
</script>