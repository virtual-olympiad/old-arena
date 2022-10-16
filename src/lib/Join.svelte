<script lang="ts">
	import type { RoomAbstract } from 'src/app';

	import { socket } from '$lib/socket';
	import { onMount } from 'svelte';

	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		ToolbarMenu,
		ToolbarMenuItem,
		Button,
		Pagination,
		TextInput,
		Loading
	} from 'carbon-components-svelte';

	import Renew from 'carbon-icons-svelte/lib/Renew.svelte';
	import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';

	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

	let roomHeaders: DataTableHeader[] = [
		{ key: 'name', value: 'Room Name' },
		{ key: 'description', value: 'Description', sort: false },
		{ key: 'mode', value: 'Mode' },
		{ key: 'players', value: 'Players' },
		{ key: 'teamsEnabled', value: 'Teams' },
		{ key: 'join', empty: true }
	];

	import { supabase } from '$lib/supabaseClient';

	let loadingPublicRooms = false;

	let rooms: RoomAbstract[] = [];

	const getPublicRooms = async () => {
		try {
			loadingPublicRooms = true;

			let {
				data: publicRooms,
				error,
				status
			} = await supabase
				.from('rooms')
				.select(`id, name, description, mode, players`, { count: 'exact' })
				.eq('public', 'true');

			rooms = publicRooms as RoomAbstract[];

			if (error && status !== 406) throw error;
		} catch ({ message }) {
			alert(message);
		} finally {
			loadingPublicRooms = false;
		}
	};

	let pageSize = 5;
	let page = 1;

	onMount(() => {
		getPublicRooms();

		socket.on('update-rooms', (newRooms) => {
			rooms = newRooms;
		});
	});

	let roomCode: string = '';

	const joinRoom = () => {
		socket.emit('join-room', {
			username: username,
			roomCode: roomCode
		});
	};

	export let username: string;
</script>

<section class="join-room-panel">
	<article class="roomcode-wrapper">
		<TextInput maxlength={4} labelText="Join with Code" placeholder="Enter room code..." />
	</article>

	<section class="room-listing">
		<div style={'border: 1px solid #ffffff;'}>
			<DataTable
				sortable
				zebra
				title="Public Rooms"
				description={rooms.length + ' public rooms open'}
				headers={roomHeaders}
				rows={rooms.map((room) => {
					return {
						...room,
						players: (room.playerCount ?? '-') + '/' + (room.playerLimit ?? '-'),
						teamsEnabled: room.teamsEnabled ? 'Enabled' : 'Disabled'
					};
				})}
				style="overflow: auto hidden;"
			>
				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch persistent shouldFilterRows />
						<Button
							on:click={getPublicRooms}
							disabled={loadingPublicRooms}
							kind="ghost"
							tooltipPosition="top"
							tooltipAlignment="end"
							iconDescription="Refresh"
							icon={Renew}
						/>
					</ToolbarContent>
				</Toolbar>
				<svelte:fragment slot="cell" let:cell>
					{#if loadingPublicRooms}
						{#if cell.key === 'name'}
							<Loading withOverlay={false} small />
						{/if}
					{:else if cell.key === 'join'}
						<Button
							style="float: right;"
							kind="ghost"
							iconDescription="Join"
							icon={CaretRight}
							href="#"
						/>
					{:else}{cell.value}{/if}
				</svelte:fragment>
			</DataTable>
			<Pagination bind:pageSize bind:page totalItems={rooms.length} pageSizeInputDisabled />
		</div>
	</section>
</section>

<style lang="scss">
	.join-room-panel {
		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 1rem;

		width: 100%;
		height: 100%;

		text-align: left;

		.roomcode-wrapper {
			margin-bottom: 2rem;
		}

		.room-listing {
			width: 100%;
			max-width: 1056px;

			padding-bottom: 1rem;
		}
	}
</style>
