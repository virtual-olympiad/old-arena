<script lang="ts">
	import {
		FluidForm,
		TextInput,
		PasswordInput,
		Tile,
		Button,
		Link,
		InlineNotification
	} from 'carbon-components-svelte';

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

	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		subtitleDetail = subtitleDetails[Math.floor(subtitleDetails.length * Math.random())];
		user.subscribe((user) => {
			if (user) {
				window.location.href = '/';
			}
		});
	});

	import { browser } from '$app/environment';

	let loginEmail: string = '',
		loginPassword: string = '',
		loading = false;

	let invalidCredentials = '';

	const handleLogin = async () => {
		try {
			loading = true;
			if (!loginPassword){
				throw new Error('You must enter your password.');
			}
			const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
			if (error) throw error;
		} catch ({ error_description, message }) {
			invalidCredentials = (error_description || message) as string;
			console.error(invalidCredentials);
		} finally {
			loading = false;
		}
	};
	
	let resetSent = false;
	const handleReset = async () => {
		if (loading) {
			return;
		}

		try {
			resetSent = false;
			loading = true;
			const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, { redirectTo: 'https://voly.mathetal.org/resetpassword' });
			if (error) throw error;
			resetSent = true;
		} catch ({ error_description, message }) {
			invalidCredentials = (error_description || message) as string;
			console.error(invalidCredentials);
		} finally {
			loading = false;
		}
	};
</script>

<section class="login-panel">
	{#key resetSent}
		{#if resetSent}
			<InlineNotification
				lowContrast
				kind="success"
				title="We've emailed you the password reset link"
				subtitle="Wait up to a minute and check your spam folder"
			/>
		{/if}
	{/key}
	<Tile>
		<h1 class="login-title" style="user-select: none;">Login</h1>
		<h6 class="login-subtitle" style="user-select: none;">{subtitleDetail}</h6>

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
				invalidText={invalidCredentials}
				invalid={!!invalidCredentials}
			/>
		</FluidForm>
		<div style="margin-top: 1rem; user-select: none;">
			<Link href="/signup">Create an account</Link>
			│
			<Link on:click={handleReset}>Forgot password?</Link>
		</div>
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
