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

	let loading = false,
		email = '',
		password:string,
		birthday = '',
		invalidSettings = '',
		saveSuccess = false;

	onMount(async () => {
		user.subscribe((user) => {
			if (!user) {
				window.location.href = '/';
			}
		});

        email = $user.email;
		birthday = $user?.user_metadata.birthday;
		let tempB = birthday?.split('-');
		birthday = [tempB[1], tempB[2], tempB[0]].join('/');
	});

	const updateAccount = async () => {
		try {
			if (loading) {
				return;
			}
			saveSuccess = false;
			loading = true;

			const UTCBirthday = birthday.split('/').map((x) => {
				return parseInt(x);
			});

            const update = {
				email,
				data: {
					birthday: new Date(Date.UTC(UTCBirthday[2], UTCBirthday[0] - 1, UTCBirthday[1])) ?? null
				}
			};

            if (password){
                update['password'] = password;
            }

			const { error } = await supabase.auth.updateUser(update);

			if (error) {
				throw error;
			} else {
				invalidSettings = '';
				saveSuccess = true;
			}
		} catch ({ error_description, message }) {
			invalidSettings = (error_description || message) as string;
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
			<FormGroup legendText="Account Credentials">
				<FluidForm>
					<TextInput
						bind:value={email}
						light
						labelText="Email"
						placeholder="Enter new email..."
						required
					/>
					<PasswordInput
						bind:value={password}
						required
						light
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
					light
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
