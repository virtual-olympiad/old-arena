<script lang="ts">
	import type { RoomMode } from 'src/app';

	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
    import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import Select, { Option } from '@smui/select';
	import Tooltip, { Wrapper, Title, Content, Link, RichActions } from '@smui/tooltip';
    import Button, { Label, Icon } from '@smui/button';

	const roomModes = ['Normal', 'Relay', 'Showdown'];
	let roomName = "Mango's room",
		roomDescription = '',
		roomMode: RoomMode = "Normal",
		roomPublic = true;
	
	import { socket } from "../lib/socket.js";

	const createRoom = () => {
		socket.emit("create-room", {
			username: username,
			roomName: roomName,
			roomDescription: roomDescription,
			roomMode: roomMode,
			roomPublic: roomPublic
		});
	}
	
	export let username:string;
</script>

<section class="create-room-panel">
	<div class="room-details create-panel">
        <Wrapper>
            <h3 class="mdc-typography--subtitle2 tooltip-title" style="color: #555;">Room Details <span class = "material-icons md-18">info</span></h3>       
            <Tooltip xPos = "start" yPos = "above">
              Let others know what your room is about!
            </Tooltip>
        </Wrapper>
		<div>
			<Textfield variant="outlined" bind:value={roomName} label="Room Name" required />
		</div>
		<div>
			<Textfield
				textarea
				input$maxlength={50}
				input$resizable={false}
				bind:value={roomDescription}
				label="Room Description"
			>
				<CharacterCounter slot="internalCounter">0 / 50</CharacterCounter>
			</Textfield>
		</div>
	</div>
	<div class="room-mode create-panel">
        <Wrapper rich>
            <h3 class="mdc-typography--subtitle2 tooltip-title" style="color: #555;">Game Mode <span class = "material-icons md-18">info</span></h3>       
            <Tooltip interactive>
              <Title>VO's New Modes</Title>
              <Content>
                Normal - The classic problemset mode <br/>
                Relay - Your team solves questions one by one <br/>
                Showdown - Teams clash with 1v1s
              </Content>
              <RichActions>
                <Button><Label>Learn More</Label></Button>
              </RichActions>
            </Tooltip>
        </Wrapper>
		<Select variant="outlined" bind:value={roomMode} label="Game Mode" required>
			<Option value="" />
			{#each roomModes as mode}
				<Option value={mode}>{mode}</Option>
			{/each}
		</Select>
	</div>

	<div class="room-settings create-panel">
		<h3 class="mdc-typography--subtitle2" style="color: #555;">Additional Settings</h3>
		<FormField align="end">
            <Checkbox bind:checked={roomPublic} />
			<span slot="label">Public Room</span>
		</FormField>
	</div>
    <div>
        <Button on:click = {createRoom} variant="raised">
            <Icon class="material-icons">add_circle_outline</Icon>
            <Label>Create Room</Label>
        </Button>
    </div>
</section>

<style lang="scss">
	@import '../variables.scss';
	@import '../typography.scss';

    .tooltip-title {
        display: inline-flex;
        align-items: center;

        &:hover {
            cursor: pointer;
        }

        > span {
            margin-left: .5rem;
        }
    }

	.create-room-panel {
		display: flex;
		align-items: center;
		flex-direction: column;

		padding: 1rem;

		width: fit-content;
		height: 100%;

		text-align: left;

		div {
			margin: 1rem;
		}

		.create-panel {
			display: flex;
			align-items: center;
			flex-direction: column;

			width: 100%;

			background-color: #fff;
			padding: 0.5rem;
			border: 1px solid $border-color;

			div {
				background-color: $background-color;
			}
		}

		> .room-details {
			text-align: left;
		}
	}
</style>
