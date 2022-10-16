<script lang="ts">
	import '../app.scss';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

	import 'carbon-components-svelte/css/all.css';
	import { Theme, Content, ToastNotification } from 'carbon-components-svelte';

	import Navbar from './Navbar.svelte';

	let darkMode: boolean = true; // 0 Light Mode, 1 Dark Mode

	let theme: CarbonTheme;
	$: theme = darkMode ? 'g90' : 'g10';
</script>

<svelte:head>
	<!-- Roboto -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
	/>
	<!-- Roboto Mono -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
</svelte:head>

<Theme bind:theme persist persistKey="__carbon-theme" />

<div class="svelte">
	<Navbar bind:darkMode />
	<section class="main-content">
		<slot />
	</section>
</div>

<style lang="scss">
	.svelte {
		width: 100vw;
		height: 100vh;

		position: relative;
	}

	.main-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 48px;
		padding: 1rem;
		padding-bottom: 2rem;

		overflow: auto;
	}
</style>
