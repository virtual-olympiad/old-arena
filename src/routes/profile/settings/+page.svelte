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

	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';
	import { invalid } from '@sveltejs/kit';

	import Avatar from './Avatar.svelte';

	user.set(!!supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(!!session?.user);
	});

	let loading = false,
		username = '',
		display_name = '',
		about = '',
		website = '',
		avatar_url = '',
		birthday = '',
		invalidSettings = '',
		saveSuccess = false;

	onMount(() => {
		user.subscribe((user) => {
			if (!user) {
				window.location.href = '/';
			}
		});

		try {
			loading = true;
			const supabaseUser = supabase.auth.user();

			supabase
				.from('profiles')
				.select(`username, display_name, about, website, avatar_url, birthday`)
				.eq('id', supabaseUser?.id)
				.single()
				.then(({ data, error, status }) => {
					if (data) {
						({ username, display_name, about, website, avatar_url, birthday } = data);
						let tempB = birthday?.split('-');
						birthday = [tempB[1], tempB[2], tempB[0]].join('/');
					}
					if (error && status !== 406) {
						throw error;
					}
				});
		} catch ({ error_description, message }) {
			console.error(error_description || message);
		} finally {
			loading = false;
		}
	});

	const updateProfile = async () => {
		try {
			if (loading) {
				return;
			}
			saveSuccess = false;
			loading = true;
			const supabaseUser = supabase.auth.user();

			const UTCBirthday = birthday.split('/').map((x) => {
				return parseInt(x);
			});
			const updates = {
				id: supabaseUser?.id,
				username,
				display_name,
				about,
				birthday: new Date(Date.UTC(UTCBirthday[2], UTCBirthday[0] - 1, UTCBirthday[1])) ?? null,
				website,
				avatar_url,
				updated_at: new Date()
			};

			let { error, status } = await supabase.from('profiles').upsert(updates, {
				returning: 'minimal'
			});

			if (error && status !== 406) {
				throw error;
			} else {
				invalidSettings = '';
				saveSuccess = true;
			}
		} catch ({ error_description, message }) {
			invalidSettings = (error_description || message) as string;
			if (invalidSettings === `new row violates row-level security policy for table "profiles"`) {
				invalidSettings = 'Username should be at least 3 characters';
			}
			if (
				invalidSettings === `duplicate key value violates unique constraint "profiles_username_key"`
			) {
				invalidSettings = 'Username already taken. Please try another';
			}
			console.error(invalidSettings);
		} finally {
			loading = false;
		}
	};
</script>

<section class="settings-panel">
	{#key saveSuccess}
		{#if saveSuccess}
			<InlineNotification
				lowContrast
				kind="success"
				title="Successfully Saved Profile Changes"
				timeout={5000}
			/>
		{/if}
	{/key}
	<Tile light style="overflow: auto; height: 100%;">
		<Form>
			<FormGroup>
				<Avatar />
			</FormGroup>
			<FormGroup legendText="Display Name">
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
						<span>Username</span>
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
					bind:value={about}
					maxCount={100}
					style="max-height: 150px;"
				>
					<span slot="labelText" style="display: flex; align-items: center;">
						<span>About Me</span>
						<TooltipIcon
							icon={Information}
							style="margin-left: 0.5rem"
							tooltipText="Your bio will show on your profile!"
							direction="right"
							align="end"
							on:click={(e) => e.preventDefault()}
						/>
					</span>
				</TextArea>
			</FormGroup>
			<FormGroup>
				<TextInput labelText="Website" placeholder="Enter website link..." bind:value={website} />
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
					light
					dateFormat="m/d/Y"
					datePickerType="single"
					bind:value={birthday}
					style="margin-top: 1rem;"
				>
					<DatePickerInput placeholder="mm/dd/yyyy">
						<span slot="labelText" style="display: flex; align-items: center;">
							<TooltipDefinition
								tooltipText="Adding your birthday allows you to participate in some age-restricted contests (e.g high school only)."
								direction="top"
								align="start"
							>
								Birthday
							</TooltipDefinition>
						</span>
					</DatePickerInput>
				</DatePicker>
			</FormGroup>
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

		padding: 1rem;

		height: 100%;
		width: min(100%, 672px);
	}
</style>
