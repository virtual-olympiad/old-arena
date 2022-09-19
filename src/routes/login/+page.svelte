<script lang="ts">
	import { FluidForm, TextInput, PasswordInput, Tile, Button } from 'carbon-components-svelte';

	import Login from 'carbon-icons-svelte/lib/Login.svelte';

	const subtitleDetails = [
		'Back for more practice?',
		'Back on the grind?',
		`How's your day been?`,
		`VOLY greets you.`,
		`Back for more?`,
		`Math is fun, isn't it?`,
		`Don't mistype your password challenge (impossible)`
	];

	let subtitleDetail = '';
	
	onMount(()=> {
		subtitleDetail = subtitleDetails[Math.floor(subtitleDetails.length * Math.random())];
	});

	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session.user);
	});

	user.subscribe((user) => {
		if (user) {
			window.location.href = '/';
		}
	});

	let loginEmail: string = '',
		loginPassword: string = '',
		loading = false;

	let incorrectCredentials = false;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email: loginEmail, password: loginPassword });
			if (error) throw error;
		} catch ({ error_description, message }) {
			incorrectCredentials = true;
			console.log(error_description || message);
		} finally {
			loading = false;
		}

		user.set(supabase.auth.user());
	};
</script>

<section class="login-panel">
	<Tile>
		<h1 class="login-title">Login</h1>
		<h6 class="login-subtitle">{subtitleDetail}</h6>

		<FluidForm>
			<TextInput
				bind:value={loginEmail}
				light
				labelText="Email"
				placeholder="Enter email..."
				required
			/>
			<PasswordInput
				bind:value={loginPassword}
				required
				light
				type="password"
				labelText="Password"
				placeholder="Enter password..."
				invalidText="Invalid Username or Password"
				invalid={incorrectCredentials}
			/>
		</FluidForm>
		<span style="display: flex; justify-content: flex-end; margin-top: 1rem;">
			<Button on:click={handleLogin} type="submit" size="field" icon={Login} disabled={loading}
				>Log In</Button
			>
		</span>
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.login-panel {
		display: flex;
		justify-content: center;
		flex-direction: column;

		padding: 1rem;

		height: 100%;
		width: min(100%, 672px);
	}

	.login-title {
		text-align: left;
	}

	.login-subtitle {
		text-align: left;
		font-weight: 300;
		font-style: italic;

		margin-top: 0.5rem;
		margin-bottom: 1rem;
	}
</style>
