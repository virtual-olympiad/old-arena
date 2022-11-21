<script lang="ts">
	import {
		FluidForm,
		TextInput,
		PasswordInput,
		Tile,
		Button,
		DatePicker,
		DatePickerInput,
		TooltipDefinition,
		Link
	} from 'carbon-components-svelte';

	import Login from 'carbon-icons-svelte/lib/Login.svelte';

	import { auth } from '$lib/firebase';
	import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		user.subscribe(async (user) => {
			if (user.user) {
				await goto('/');
			}
		});
	});

	let signupEmail = '',
		signupPassword = '',
		invalidCredentials = '',
		loading = false;

	const handleSignup = async () => {
		try {
			loading = true;

			const { user } = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword).catch(error => {throw error;});
			await sendEmailVerification(user).catch(error => {throw error;});
			
			invalidCredentials = '';
		} catch (error) {
			invalidCredentials = error?.message;
			console.error(error);
		} finally {
			loading = false;
		}
	};
</script>

<section class="signup-panel">
	<Tile>
		<h1 class="signup-title" style="user-select: none;">Signup</h1>
		<h6 class="signup-subtitle" style="user-select: none;">Join the fun!</h6>

		<FluidForm>
			<TextInput
				bind:value={signupEmail}
				light
				labelText="Email"
				placeholder="Enter email..."
				required
			/>
			<PasswordInput
				bind:value={signupPassword}
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
			<Link href="/login">Have an account? Log In</Link>
		</div>
		<span style="display: flex; justify-content: flex-end; margin-top: 1rem;">
			<Button on:click={handleSignup} type="submit" size="field" icon={Login} disabled={loading}
				>Sign Up</Button
			>
		</span>
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.signup-panel {
		display: flex;
		justify-content: center;
		flex-direction: column;

		padding: 1rem;

		height: 100%;
		width: min(100%, 672px);
	}

	.signup-title {
		text-align: left;
	}

	.signup-subtitle {
		text-align: left;
		font-weight: 300;
		font-style: italic;

		margin-top: 0.5rem;
		margin-bottom: 1rem;
	}
</style>
