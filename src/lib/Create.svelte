<script lang="ts">
	import type { RoomMode } from 'src/app';

	import {
		Form,
		FormGroup,
		Checkbox,
		RadioButtonGroup,
		RadioButton,
		Select,
		SelectItem,
		Button,
		Tile,
		Toggle,
		Tooltip,
		TooltipDefinition,
		TooltipIcon,
		TextInput,
		TextArea
	} from 'carbon-components-svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';

	const roomModes = ['Classic', 'Relay', 'Showdown'];
	let roomName = "",
		roomDescription = '',
		roomMode: RoomMode = 'classic',
		roomPublic = true,
		loading = false;

	import { socket } from '$lib/socket.js';
	import { auth } from '$lib/firebase';

	const createRoom = async () => {
		try {
			loading = true;
			let idToken = await auth.currentUser?.getIdToken(true);

			socket.emit('create-room', {
				idToken,
				data: {
					roomName,
					roomDescription,
					roomMode,
					roomPublic
				}
			});
		}
		catch (error){
			console.error(error);
		}
		finally {
			loading = false;
		}
	};

	// export let darkMode: boolean;
</script>

<section class="create-room-panel">
	<div style="padding-bottom: 1rem;">
		<Tile style="flex-grow: 1;">
			<Form on:submit={createRoom}>
				<FormGroup legendText="Room Name">
					<TextInput bind:value={roomName} placeholder="Enter room name..." />
				</FormGroup>
				<FormGroup>
					<TextArea
						placeholder="Enter room description..."
						maxCount={100}
						style="max-height: 150px;"
						bind:value={roomDescription}
					>
						<span slot="labelText" style="display: flex; align-items: center;">
							<span>Room Description</span>
							<TooltipIcon
								icon={Information}
								style="margin-left: 0.5rem"
								tooltipText="Let others know what your room is about!"
								direction="right"
								align="end"
								on:click={(e) => e.preventDefault()}
							/>
						</span>
					</TextArea>
				</FormGroup>
				<FormGroup legendText="Game Mode">
					<RadioButtonGroup name="radio-button-group" bind:selected={roomMode}>
						<RadioButton id="radio-1" value="classic" labelText="Classic" />
						<RadioButton id="radio-2" value="relay" labelText="Relay" disabled />
						<RadioButton id="radio-3" value="deathmatch" labelText="Deathmatch" disabled />
					</RadioButtonGroup>
				</FormGroup>
				<FormGroup legendText="Room Visibility">
					<Toggle bind:toggled={roomPublic}>
						<span slot="labelA" style="display: flex; align-items: center;">
							Private
							<TooltipIcon
								icon={Information}
								style="margin-left: 0.5rem"
								tooltipText="Only users with the room code have access to your room"
								direction="right"
								align="end"
								on:click={(e) => e.preventDefault()}
							/>
						</span>
						<span slot="labelB" style="display: flex; align-items: center;">
							Public
							<TooltipIcon
								icon={Information}
								style="margin-left: 0.5rem"
								tooltipText="Anyone can view and join your room"
								direction="right"
								align="end"
								on:click={(e) => e.preventDefault()}
							/>
						</span>
					</Toggle>
				</FormGroup>
				<Button icon={AddFilled} disabled={loading} on:click={createRoom}>Create Room</Button>
			</Form>
		</Tile>
	</div>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.create-room-panel {
		display: flex;
		align-items: center;
		flex-direction: column;

		padding: 1rem;

		width: fit-content;
		height: 100%;

		text-align: left;
	}
</style>
