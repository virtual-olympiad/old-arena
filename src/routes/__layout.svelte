<script>
	import '../app.scss';

	import 'carbon-components-svelte/css/all.css';
	import 'agnostic-svelte/css/common.min.css';

	import { Theme, Content } from 'carbon-components-svelte';

	import Navbar from "../../src/lib/partials/Navbar.svelte";

	let darkMode = true; // 0 Light Mode, 1 Dark Mode

	$: theme = darkMode ? "g90":"g10";
</script>

<svelte:head>
	<!-- Svelte MD -->
	<link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
	<!-- Material Icons -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
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

<!-- Footer Copyright -->
<footer>
	<span>2021-{new Date().getFullYear()} © Math et al</span>
	<span><code>v1.0.0</code></span>
</footer>

<style lang="scss">
	.svelte {
		width: 100vw;
		height: 100vh;
	}

	.main-content {
		width: 100%;
		height: 100%;
		display: flex;
        flex-direction: column;
		align-items: center;

		margin-top: 48px;
		padding: 1rem;
	}

	footer {
		position: sticky;
		display: flex;
		justify-content: space-between;

		bottom: 0;

		width: 100%;
		padding: 0.5rem;
	}
</style>
