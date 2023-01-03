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
		Link,
		Modal
	} from 'carbon-components-svelte';

	import Login from 'carbon-icons-svelte/lib/Login.svelte';
	import EmailNew from 'carbon-icons-svelte/lib/EmailNew.svelte';
	import UserAdmin from 'carbon-icons-svelte/lib/UserAdmin.svelte';

	import { auth } from '$lib/firebase';
	import {
		createUserWithEmailAndPassword,
		sendEmailVerification,
		updateProfile
	} from 'firebase/auth';
	import { user } from '$lib/sessionStore';
	import { goto } from '$app/navigation';

	let signupEmail = '',
		signupPassword = '',
		invalidCredentials = '',
		invalidField = '',
		loading = false,
		signupSuccess = false;

	const handleSignup = async () => {
		try {
			signupSuccess = false;
			invalidCredentials = '';
			loading = true;

			const { user } = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
			await sendEmailVerification(user);

			signupSuccess = true;
		} catch ({ code, message }) {
			switch (code) {
				case 'auth/invalid-email':
					invalidField = 'email';
					invalidCredentials = 'Invalid Email';
					break;
				case 'auth/email-already-in-use':
					invalidField = 'email';
					invalidCredentials = 'This email is already registered. Please log in instead.';
					break;
				case 'auth/too-many-requests':
					invalidField = 'email';
					invalidCredentials = 'Too many attempts. Please try again later.';
					break;
				case 'auth/weak-password':
					invalidField = 'password';
					invalidCredentials = 'Password too weak. It should be at least 6 characters.';
					break;
				default:
					invalidField = 'password';
					invalidCredentials = 'Something went wrong';
			}
			console.error(`Error ${code}: ${message}`);
		} finally {
			loading = false;
		}
	};
</script>

<section class="signup-panel">
	<Modal
		preventCloseOnClickOutside
		open={signupSuccess}
		modalHeading="Account Creation Success!"
		primaryButtonText="Update your Profile"
		secondaryButtonText="Back to Home"
		on:click:button--secondary={async () => {
			await goto('/');
		}}
		on:click:button--primary={async () => {
			await goto('/settings');
		}}
		on:open
		on:close={() => {
			goto('/');
		}}
		on:submit
	>
		<h5 style="display: flex; align-items: center;">
			<UserAdmin size={24} style="margin-right: .5rem;" /> Update Your Profile
		</h5>
		<p>
			You'll now be able to access the main features of VOLY and create or join rooms.
			<br />
			You can also customize your username and other profile details in Settings.
		</p>
		<br />
		<h5 style="display: flex; align-items: center;">
			<EmailNew size={24} style="margin-right: .5rem;" /> Verify Your Email
		</h5>
		<p><strong>We've sent an email to {signupEmail} from noreply@mathetal.org</strong></p>
		<p>
			Click on the given link to verify your email. We will never ask you for your credentials.
			<br />
			<em>Make sure to check your spam/junk folder </em>
		</p>
	</Modal>
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
				invalidText={invalidCredentials}
				invalid={!!invalidCredentials && invalidField == 'email'}
			/>
			<PasswordInput
				bind:value={signupPassword}
				required
				light
				type="password"
				labelText="Password"
				placeholder="Enter password..."
				invalidText={invalidCredentials}
				invalid={!!invalidCredentials && invalidField == 'password'}
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
