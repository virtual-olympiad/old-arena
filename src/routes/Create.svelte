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

	const roomModes = ['Normal', 'Relay', 'Showdown'];
	let roomName = "Mango's room",
		roomDescription = '',
		roomMode: RoomMode = 'Standard',
		roomPublic = true;

	import { socket } from '../lib/socket.js';

	const createRoom = () => {
		socket.emit('create-room', {
			username: username,
			roomName: roomName,
			roomDescription: roomDescription,
			roomMode: roomMode,
			roomPublic: roomPublic
		});
	};

	export let username: string;
</script>

<section class="create-room-panel">
	<div style="padding-bottom: 1rem;">
		<Tile style="flex-grow: 1;">
			<Form on:submit>
				<FormGroup legendText="Room Name">
					<TextInput placeholder="Enter room name..." />
				</FormGroup>
				<FormGroup>
					<TextArea
						placeholder="Enter room description..."
						maxCount={100}
						style="max-height: 150px;"
					>
						<span slot="labelText" style="display: flex; align-items: center;">
							<span>Room Description</span>
							<TooltipIcon
								icon={Information}
								style="margin-left: 0.5rem"
								tooltipText="Let others know what your room is about!"
								direction="right"
								align="end"
							/>
						</span>
					</TextArea>
				</FormGroup>
				<FormGroup legendText="Game Mode">
					<RadioButtonGroup name="radio-button-group" selected="standard">
						<RadioButton id="radio-1" value="standard" labelText="Standard" />
						<RadioButton id="radio-2" value="relay" labelText="Relay" disabled />
						<RadioButton id="radio-3" value="showdown" labelText="Showdown" disabled />
					</RadioButtonGroup>
				</FormGroup>
				<FormGroup legendText="Room Transparency">
					<Toggle>
						<span slot="labelA" style="display: flex; align-items: center;">
							Public
							<TooltipIcon
								icon={Information}
								style="margin-left: 0.5rem"
								tooltipText="Anyone can see and join your room"
								direction="right"
								align="end"
							/>
						</span>
						<span slot="labelB" style="display: flex; align-items: center;">
							Private
							<TooltipIcon
								icon={Information}
								style="margin-left: 0.5rem"
								tooltipText="Only people you send the room code to can join your lobby"
								direction="right"
								align="end"
							/>
						</span>
					</Toggle>
				</FormGroup>
				<Button type="submit" icon={AddFilled}>Create Room</Button>
			</Form>
		</Tile>
	</div>
</section>

<style lang="scss">
	@import '../variables.scss';

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
