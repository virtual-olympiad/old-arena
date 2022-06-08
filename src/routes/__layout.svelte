<script>
	import '../app.scss';

	import Button, { Label, Icon} from '@smui/button';
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
		<img class = "logo" src = "vo_stroke.png" alt = "Virtual Olympiad Logo">
	</div>

	Virtual Olympiad

	<div class = "links-wrapper">
		<Button href = "" target = "_blank">
			<Icon class="material-icons">
				login
			</Icon>
			<Label>
				Login
			</Label>
		</Button>
	</div>
</nav>
<slot />
<!-- Footer Copyright -->
<footer>Math et al</footer>

<style lang="scss">
	nav {
		padding: .75rem 1rem;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		background-color: rgba(255, 255, 255, 100);

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

		.links-wrapper {
			margin-left: auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		a {
			margin: 0 .75rem;

			> span {
				margin: 0;
			}
		}
	}

	footer {
		position: absolute;
		bottom: 0;

		padding: .5rem;
	}
</style>