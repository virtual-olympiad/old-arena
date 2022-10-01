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
		birthday = '';

	let savingNotifications: any[] = [];

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
						console.log(error);
					}
				});
		} catch ({ message }) {
			console.log(message);
		} finally {
			loading = false;
		}
	});

	const updateProfile = async () => {
		try {
			if (loading) {
				return;
			}
			loading = true;
			const supabaseUser = supabase.auth.user();

			const UTCBirthday = birthday.split('/').map(x => {
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
				console.log(error);
			}
		} catch ({ message }) {
			console.log(message);
		} finally {
			savingNotifications = [
				...savingNotifications,
				{ type: 'success', message: 'Updated profile successfully' }
			];
			if (savingNotifications.length > 2) {
				savingNotifications.splice(0, savingNotifications.length - 2);
			}
			// console.log(savingNotifications);
			loading = false;
		}
	};
</script>

<section class="settings-panel">
	<!--
	{#each savingNotifications as { type, message }, i}
		{#if type == 'error'}
			<InlineNotification
				lowContrast
				kind="error"
				title="Error Saving Profile:"
				subtitle={message}
				timeout={10000}
				on:close={e=> {
					savingNotifications.splice(i, 1);
				}}
			/>
		{:else if type == 'success'}
			<InlineNotification
				lowContrast
				kind="success"
				title="Successfully Saved Profile Changes"
				timeout={1000}
				on:close={e=> {
					savingNotifications.splice(i, 1);
				}}
			/>
		{/if}
	{/each}
			-->
	<Tile>
		<Form>
			<FormGroup legendText="Display Name">
				<TextInput placeholder="Enter display name..." bind:value={display_name} />
			</FormGroup>
			<FormGroup>
				<TextInput placeholder="Enter user name..." bind:value={username}>
					<span slot="labelText" style="display: flex; align-items: center;">
						<span>Username</span>
						<TooltipIcon
							icon={Information}
							style="margin-left: 0.5rem"
							tooltipText="Your alphanumeric unique identifier"
							direction="right"
							align="end"
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
						/>
					</span>
				</TextArea>
			</FormGroup>
			<FormGroup legendText="Who can view your profile?">
				<RadioButtonGroup name="radio-button-group" selected="standard">
					<RadioButton id="radio-1" value="everyone" labelText="Everyone" />
					<RadioButton id="radio-2" value="friends" labelText="Friends" />
					<RadioButton id="radio-3" value="none" labelText="No one" />
				</RadioButtonGroup>
			</FormGroup>
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
