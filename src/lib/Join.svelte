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

	import { get, onValue, ref } from 'firebase/database';
	import { rtdb } from './firebase';
	import { user } from '$lib/sessionStore';

	let roomHeaders: DataTableHeader[] = [
		{ key: 'name', value: 'Room Name' },
		{ key: 'description', value: 'Description', sort: false },
		{ key: 'mode', value: 'Mode' },
		{ key: 'players', value: 'Players' },
		{ key: 'teamsEnabled', value: 'Teams' },
		{ key: 'join', empty: true }
	];

	let loadingPublicRooms = false;

	let rooms: RoomAbstract[] = [];

	const parseMode = (mode: string) => {
		switch (mode) {
			case 'classic':
				return 'Classic';
			case 'relay':
				return 'Relay';
			case 'deathmatch':
				return 'Deathmatch';
			default:
				return 'Classic';
		}
	};

	onValue(ref(rtdb, 'publicRooms'), async (snapshot) => {
		if (loadingPublicRooms) return;
		loadingPublicRooms = true;
		try {
			if (!snapshot.exists()) {
				rooms = [];
				return;
			}
			const snap = snapshot.val();

			const roomsPromise: any[] = [];
			Object.keys(snap).forEach((roomId) => {
				roomsPromise.push(get(ref(rtdb, 'rooms/' + roomId)));
			});

			rooms = (await Promise.allSettled(roomsPromise)).map((room, i) => {
				if (room.status === 'rejected') {
					return;
				}

				let realRoom: any = room.value;
				if (!realRoom.exists()){
					return;
				}

				realRoom = realRoom.val();

				return {
					...realRoom,
					id: Object.keys(snap)[i],
					join: Object.keys(snap)[i],
					mode: parseMode(realRoom.mode),
					players: (Object.keys(realRoom.users).length ?? '0') + '/' + realRoom.maxUsers,
					teamsEnabled: realRoom.teamsEnabled ? 'Enabled' : 'Disabled'
				};
			});
		} catch (error) {
			console.error(error);
		} finally {
			loadingPublicRooms = false;
		}
	});

	const getPublicRooms = async ()=> {
		if (loadingPublicRooms) return;
		loadingPublicRooms = true;
		try {
			const snapshot = await get(ref(rtdb, 'publicRooms'));
			if (!snapshot.exists()) {
				rooms = [];
				return;
			}

			const snap = snapshot.val();

			const roomsPromise: any[] = [];
			Object.keys(snap).forEach((roomId) => {
				roomsPromise.push(get(ref(rtdb, 'rooms/' + roomId)));
			});

			rooms = (await Promise.allSettled(roomsPromise)).map((room, i) => {
				if (room.status === 'rejected') {
					return;
				}

				let realRoom: any = room.value;
				if (!realRoom.exists()){
					return;
				}

				realRoom = realRoom.val();

				return {
					...realRoom,
					id: Object.keys(snap)[i],
					join: Object.keys(snap)[i],
					mode: parseMode(realRoom.mode),
					players: (Object.keys(realRoom.users).length ?? '0') + '/' + realRoom.maxUsers,
					teamsEnabled: realRoom.teamsEnabled ? 'Enabled' : 'Disabled'
				};
			});
		} catch (error) {
			console.error(error);
		} finally {
			loadingPublicRooms = false;
		}
	}
	/**
	onValue(ref(rtdb, 'rooms'), (snapshot) => {
		const snap = snapshot.val();
		if (!snapshot.exists()) {
			rooms = [];
			return;
		}
		rooms = Object.keys(snap).map((i) => {
			const room = snap[i];

			return {
				...room,
				id: i,
				join: i,
				mode: parseMode(room.mode),
				players: (Object.keys(room.users).length ?? '0') + '/' + room.maxUsers,
				teamsEnabled: room.teamsEnabled ? 'Enabled' : 'Disabled'
			};
		});

		console.log(rooms);
	});
	*/

	let pageSize = 5;
	let page = 1;

	let roomCode: string = '';

	let loadingJoin = false;

	const joinRoom = async (code = roomCode) => {
		loadingJoin = true;
		try {
			const idToken = await $user.user.getIdToken(true);
			socket.emit('join-room', {
				idToken,
				data: {
					code
				}
			});
		} catch (error) {
			console.error(error);
		}
		loadingJoin = false;
	};
</script>

<section class="join-room-panel">
	<article class="roomcode-wrapper">
		<TextInput
			bind:value={roomCode}
			maxlength={4}
			labelText="Join with Code"
			placeholder="Enter room code..."
		/>
		<Button
			disabled={loadingJoin}
			on:click={() => joinRoom()}
			kind="ghost"
			icon={CaretRight}
			style="margin-left: .5rem;"
		>
			Join
		</Button>
	</article>

	<section class="room-listing">
		<div style={'border: 1px solid #ffffff;'}>
			<DataTable
				sortable
				zebra
				title="Public Rooms"
				description={rooms.length + ' public rooms open'}
				headers={roomHeaders}
				rows={rooms}
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
							disabled={loadingJoin}
							on:click={() => joinRoom(cell.value)}
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
			display: flex;
			align-items: center;
			margin-bottom: 2rem;
		}

		.room-listing {
			width: 100%;
			max-width: 1056px;

			padding-bottom: 1rem;
		}
	}
</style>
