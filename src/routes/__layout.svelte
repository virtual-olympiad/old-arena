<script>
	import '../app.scss';

	import { Graphic } from '@smui/list';
</script>

<svelte:head>
	<!-- Svelte MD -->
	<link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
	<!-- Material Icons -->
	<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/icon?family=Material+Icons"
	/>
	<!-- Roboto -->
	<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
	/>
	<!-- Roboto Mono -->
	<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css?family=Roboto+Mono"
	/>
</svelte:head>

<nav>
	<div class = "logo-wrapper">
		<img class = "logo" src = "vo_stroke.png">
		Virtual Olympiad
	</div>
	<a href = "">
		<span class="material-icons">
			login
		</span>
	</a>
</nav>
<slot />

<style lang="scss">
	nav {
		padding: .75rem 1rem;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		background-color: #5684C2;

		.logo-wrapper {
			margin-right: auto;
			display: flex;
			align-items: center;
			justify-content: center;

			color: #ffffff;

			.logo {
				height: 32px;
				margin-right: .75rem;
			}
		}

		a {
			margin: 0 .75rem;

			> span {
				margin: 0;
			}
		}
	}
</style>