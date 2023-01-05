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
		Form,
		FormGroup,
		TextArea,
		TooltipIcon,
		RadioButtonGroup,
		RadioButton,
		Toggle,
		ToastNotification,
		InlineNotification
	} from 'carbon-components-svelte';

	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import UpdateNow from 'carbon-icons-svelte/lib/UpdateNow.svelte';

	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';

	import Avatar from './Avatar.svelte';
	import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
	import { db } from '$lib/firebase';
	import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

	let loading = false,
		email = '',
		password: string,
		birthday: any = '',
		invalidSettings = '',
		saveSuccess = false;

	onMount(async () => {
		email = $user.user?.email;

		const docSnap = await getDoc(doc(db, 'users', $user.user.uid, 'private/info'));
		if (docSnap.exists()) {
			({ birthday } = docSnap.data());
			birthday = birthday.toDate();
		}

		birthday = [birthday.getUTCMonth() + 1, birthday.getUTCDate(), birthday.getUTCFullYear()].join(
			'/'
		);
	});

	const updateAccount = async () => {
		if (loading) {
			return;
		}
		try {
			invalidSettings = '';
			saveSuccess = false;
			loading = true;

			const UTCBirthday = birthday.split('/').map((x) => {
				return parseInt(x);
			});

			const parsedBirthday =
				new Date(Date.UTC(UTCBirthday[2], UTCBirthday[0] - 1, UTCBirthday[1])) ?? null;

			let accountPromise = [];

			if (email && email !== $user.user?.email) {
				accountPromise.push(updateEmail($user.user, email));
				accountPromise.push(sendEmailVerification($user.user));
			}
			if (password) {
				accountPromise.push(updatePassword($user.user, password));
			}
			if (parsedBirthday) {
				accountPromise.push(
					setDoc(
						doc(db, 'users', $user.user.uid, 'private/info'),
						{ birthday: Timestamp.fromDate(parsedBirthday) },
						{ merge: true }
					)
				);
			}

			await Promise.allSettled(accountPromise);
			saveSuccess = true;
		} catch (error) {
			({ message: invalidSettings } = error);
			if (invalidSettings == 'Firebase: Error (auth/requires-recent-login).') {
				invalidSettings =
					'Requires recent login to update credentials. Please logout and login again.';
			}
			console.error(error);
		} finally {
			loading = false;
		}
	};
</script>

<section class="settings-panel">
	<Tile light style="overflow: auto; height: 100%;">
		<Form>
			{#key saveSuccess}
				{#if saveSuccess}
					<InlineNotification
						lowContrast
						kind="success"
						title="Successfully Updated Account Credentials"
						timeout={3000}
						style="flex-shrink: 0; align-items: center; margin-top: 0;"
					/>
				{/if}
			{/key}
			<FormGroup class="no-select" legendText="Account Credentials">
				<FluidForm>
					<TextInput
						bind:value={email}
						labelText="Email"
						placeholder="Enter new email..."
						required
					/>
					<PasswordInput
						bind:value={password}
						required
						type="password"
						labelText="Password"
						placeholder="Enter new password..."
						invalidText={invalidSettings}
						invalid={!!invalidSettings}
					/>
				</FluidForm>
			</FormGroup>
			<!--
			<FormGroup legendText="Who can view your profile?">
				<RadioButtonGroup name="radio-button-group" selected="standard">
					<RadioButton id="radio-1" value="everyone" labelText="Everyone" />
					<RadioButton id="radio-2" value="friends" labelText="Friends" />
					<RadioButton id="radio-3" value="none" labelText="No one" />
				</RadioButtonGroup>
			</FormGroup>
			-->
			<FormGroup>
				<DatePicker
					dateFormat="m/d/Y"
					datePickerType="single"
					bind:value={birthday}
					style="margin-top: 1rem;"
				>
					<DatePickerInput placeholder="mm/dd/yyyy">
						<span slot="labelText" style="display: flex; align-items: center;">
							<TooltipDefinition
								tooltipText="In UTC. Adding your birthday allows you to participate in some age-restricted contests (e.g high school only)."
								direction="top"
								align="start"
							>
								Birthday
							</TooltipDefinition>
						</span>
					</DatePickerInput>
				</DatePicker>
			</FormGroup>
			<Button on:click={updateAccount} icon={UpdateNow} size="field" disabled={loading}
				>Update Account Credentials</Button
			>
		</Form>
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.settings-panel {
		display: flex;
		justify-content: center;
		flex-direction: column;

		height: 100%;
		width: min(100%, 672px);
	}
</style>
