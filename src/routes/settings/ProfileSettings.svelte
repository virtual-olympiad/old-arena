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
	import { db } from '$lib/firebase';
	import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

	import Avatar from './Avatar.svelte';

	let loading = false,
		username = '',
		display_name = '',
		bio = '',
		website = '',
		invalidSettings = '',
		saveSuccess = false;

	const fetchProfile = async () => {
		try {
			loading = true;
			const profileSnap = await getDoc(doc(db, 'users', $user.user.uid, 'public/profile'));
			if (profileSnap.exists()) {
				({ display_name = '', bio = '', website = '' } = profileSnap.data());
			}

			const userSnap = await getDoc(doc(db, 'users', $user.user.uid));
			if (userSnap.exists()) {
				({ username = '' } = userSnap.data());
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	onMount(fetchProfile);

	const updateProfile = async () => {
		try {
			if (loading) {
				return;
			}
			saveSuccess = false;
			loading = true;
			invalidSettings = '';

			await setDoc(doc(db, 'users', $user.user.uid), { username }, { merge: true });
			await setDoc(
				doc(db, 'users', $user.user.uid, 'public/profile'),
				{ display_name, bio, website },
				{ merge: true }
			);

			saveSuccess = true;
		} catch (error) {
			invalidSettings = error as string;
			console.error(error);
		} finally {
			loading = false;
			fetchProfile();
		}
	};
</script>

<section class="settings-panel">
	<Tile light style="overflow: auto; height: 100%;">
		{#key saveSuccess}
			{#if saveSuccess}
				<InlineNotification
					lowContrast
					kind="success"
					title="Successfully Saved Profile Changes"
					timeout={5000}
					style="flex-shrink: 0; align-items: center;"
				/>
			{/if}
		{/key}
		<Form>
			<FormGroup>
				<Avatar />
			</FormGroup>
			<FormGroup legendText="Display Name" class="no-select">
				<TextInput placeholder="Enter display name..." bind:value={display_name} />
			</FormGroup>
			<FormGroup>
				<TextInput
					placeholder="Enter user name..."
					bind:value={username}
					invalid={!!invalidSettings}
					invalidText={invalidSettings}
				>
					<span slot="labelText" style="display: flex; align-items: center;">
						<span class="no-select">Username</span>
						<TooltipIcon
							icon={Information}
							style="margin-left: 0.5rem"
							tooltipText="Your alphanumeric unique identifier"
							direction="right"
							align="end"
							on:click={(e) => e.preventDefault()}
						/>
					</span>
				</TextInput>
			</FormGroup>
			<FormGroup>
				<TextArea
					placeholder="Enter a bio..."
					bind:value={bio}
					maxCount={100}
					style="max-height: 150px;"
				>
					<span slot="labelText" style="display: flex; align-items: center;">
						<span class="no-select">About Me</span>
						<TooltipIcon
							icon={Information}
							style="margin-left: 0.5rem"
							tooltipText="Markdown is supported!"
							direction="right"
							align="end"
							on:click={(e) => e.preventDefault()}
						/>
					</span>
				</TextArea>
			</FormGroup>
			<FormGroup class="no-select" legendText="Website">
				<TextInput placeholder="Enter website link..." bind:value={website} />
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
			<Button on:click={updateProfile} icon={UpdateNow} size="field" disabled={loading}
				>Update Profile Info</Button
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
