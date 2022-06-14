<script lang="ts">
	import type { RoomAbstract } from 'src/app';

	import Textfield from '@smui/textfield';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Card, {
		Content,
		PrimaryAction,
		Media,
		MediaContent,
		Actions,
		ActionButtons,
		ActionIcons
	} from '@smui/card';
	import Button, { Label, Icon } from '@smui/button';
	// import IconButton, { Icon } from '@smui/icon-button';

	let rooms: RoomAbstract[] = [
        {
            name: "Mango's room",
            description: "Join for fun AIME practice!",
            mode: "Relay",
            playerCount: 6,
            playerLimit: 8,
            teamsEnabled: true
        },
        {
            name: "Pineappo!!",
            description: "With a side of jelly",
            mode: "Showdown",
            playerCount: 3,
            playerLimit: 8,
            teamsEnabled: false
        }
    ];

	let roomcode = '';
</script>

<section class="join-room-panel">
	<h3 class="mdc-typography--subtitle2" style="color: #555;">Join with code</h3>

	<article class="roomcode-wrapper">
		<div class = "roomcode-field">
			<Textfield
				variant="filled"
				bind:value={roomcode}
				label="Room Code"
				required
				input$minLength={4}
				input$maxlength={4}
			/>
		</div>
		<Button variant = "raised">
			<Icon class="material-icons">arrow_forward</Icon>
			<Label>Join</Label>
		</Button>
	</article>

	<h3 class="mdc-typography--subtitle2" style="color: #555;">Public Rooms</h3>
	<section class="room-listing">
		{#each rooms as room, i}
			<Card style="min-width: 250px; height: 300px; margin: 1rem;">
				<PrimaryAction>
					<Media class="card-media-16x9" aspectRatio="16x9" />
					<Content class="mdc-typography--body2">
						<h2 class="mdc-typography--headline6" style="margin: 0;">{room.name}</h2>
						<h3 class="mdc-typography--subtitle2" style="margin: 0 0 10px; color: #888;">
							{room.mode + " Mode"}
						</h3>
						{room.description}
					</Content>
				</PrimaryAction>
				<Actions>
					<ActionButtons>
						<Button>
							<Label>Join Room</Label>
						</Button>
					</ActionButtons>
					<ActionIcons>
						{room.playerCount}/{room.playerLimit}
						<Wrapper>
                            {#if room.teamsEnabled}
                                <Icon class="material-icons" style="margin-left: .5rem;">group</Icon>

                                <Tooltip>Teams Enabled</Tooltip>
                            {:else}
                                <Icon class="material-icons" style="margin-left: .5rem;">person</Icon>

                                <Tooltip>Teams Disabled</Tooltip>
                            {/if}
							
						</Wrapper>
					</ActionIcons>
				</Actions>
			</Card>
		{/each}
	</section>
</section>

<style lang="scss">
	@import '../typography.scss';

	.join-room-panel {
		display: flex;
		align-items: stretch;
		flex-direction: column;

		padding: 1rem;

		width: 100%;
		height: 100%;

		text-align: left;

		.roomcode-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;

			.roomcode-field {
				margin-right: .5rem;
			}
		}

		.room-listing {
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			width: 100%;
		}
	}
</style>
