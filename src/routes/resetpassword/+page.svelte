<script lang="ts">
	import {
		FluidForm,
		TextInput,
		PasswordInput,
		Tile,
		Button,
		Link
	} from 'carbon-components-svelte';

	import Login from 'carbon-icons-svelte/lib/Login.svelte';

	let subtitleDetail = '';

	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';

	let loginPassword: string = '',
		loading = false;

	let invalidCredentials = '';

	const handleReset = async () => {
		if (loading) {
			return;
		}

		try {
			loading = true;
			const { error } = await supabase.auth.resetPasswordForEmail(loginPassword, { redirectTo: 'https://voly.mathetal.org/resetpassword' });
			if (error) throw error;
		} catch ({ error_description, message }) {
			invalidCredentials = (error_description || message) as string;
			console.error(invalidCredentials);
		} finally {
			loading = false;
		}
	};
</script>

<section class="login-panel">
	<Tile>
		<h1 class="login-title" style="user-select: none;">Reset Password</h1>
		<FluidForm>
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
		<span style="display: flex; justify-content: flex-end; margin-top: 1rem;">
			<Button on:click={handleReset} type="submit" size="field" icon={Login} disabled={loading}
				>Reset Password</Button
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
</style>
