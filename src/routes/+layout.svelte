<script lang="ts">
	import '../app.scss';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

	import 'carbon-components-svelte/css/all.css';
	import { Theme, Content, ToastNotification, Loading } from 'carbon-components-svelte';

	import Navbar from './Navbar.svelte';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { app, pushNotification, room, user } from '$lib/sessionStore';
	import { onDestroy, onMount } from 'svelte';
	import { socket } from '$lib/socket';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';

	let authConnected = false;
	let notif: any = $app.notification;

	onAuthStateChanged(auth, (currentUser) => {
		user.set({
			...$user,
			user: currentUser
		});
	});

	const appSub = app.subscribe((app) => {
		if (browser) {
			if (app.theme == 'g90') {
				document.querySelectorAll('.latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', 'filter: invert(1) hue-rotate(180deg);');
				});
			} else {
				document.querySelectorAll('.latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', '');
				});
			}

			if (app.notification?.caption != notif?.caption) {
				notif = app.notification;
				console.log(notif);
			}
		}
	});

	const userSub = user.subscribe((user) => {
		if (!user.pending) {
			authConnected = true;
		}
	});

	socket.on('exit-room-success', ({ roomId }) => {
		room.set({
			...$room,
			roomId: '',
			gameState: 'none'
		});

		goto('/live');
		pushNotification(
			'success',
			'You have left the room',
			'Your answers have been saved',
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	socket.on('create-room-success', ({ roomId }) => {
		room.set({
			...$room,
			roomId,
			gameState: 'lobby'
		});

		goto('/live');
		pushNotification(
			'success',
			'You have created a room',
			'Share the code to invite others',
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	socket.on('join-room-success', ({ roomId, gameState }) => {
		room.set({
			...$room,
			roomId,
			gameState: gameState == 'game' ? 'game' : 'lobby'
		});

		goto('/live');
		pushNotification(
			'success',
			'You have joined a room',
			'Have fun!',
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	socket.on('started-game', () => {
		room.set({
			...$room,
			gameState: 'game'
		});

		pushNotification(
			'success',
			'Game Started',
			'Good Luck!',
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	socket.on('connect', () => {
		if (['/', '/live'].includes($page.url.pathname)) {
			pushNotification(
				'info',
				'You have connected to the server',
				'',
				new Date().toLocaleString(),
				false,
				3000
			);
		}
	});

	socket.on('disconnect', (reason) => {
		if (!['/', '/live'].includes($page.url.pathname)) {
			return;
		}

		let uiTitle = '';
		let uiReason = '';
		switch (reason) {
			case 'io client disconnect':
				uiTitle = 'You have chosen to disconnect!';
				uiReason = "What's up script kiddie?";
				break;
			case 'io server disconnect':
				uiTitle = 'You have been forcefully disconnected from the server';
				uiReason = 'You may have been idle for too long.';
				break;
			case 'ping timeout':
				uiTitle = 'The server connection has timed out.';
				uiReason = 'The server may be offline.';
				break;
			case 'transport close':
				uiTitle = 'You have disconnected from the server';
				uiReason = 'Please check your internet connection.';
				break;
			default:
				uiTitle = 'The connection has encountered an error';
				uiReason = 'You have disconnected. The server may be offline.';
		}

		pushNotification('error', uiTitle, uiReason, new Date().toLocaleString(), false, 0);
	});

	socket.on('create-room-error', ({ error, message }) => {
		pushNotification(
			'error',
			'Error creating room',
			message,
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	socket.on('join-room-error', ({ error, message }) => {
		pushNotification(
			'error',
			'Error joining room',
			message,
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	socket.on('start-game-error', ({ error, message }) => {
		pushNotification(
			'error',
			'Error starting game',
			message,
			new Date().toLocaleString(),
			false,
			3000
		);
	});

	onDestroy(() => {
		appSub();
		userSub();
	});
</script>

<svelte:head>
	<!-- Roboto -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
	/>
	<!-- Roboto Mono -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
	<!-- Katex -->
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"
		integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0"
		crossorigin="anonymous"
	/>
</svelte:head>

<Theme bind:theme={$app.theme} persist persistKey="__carbon-theme" />

<div class="svelte">
	<Navbar />
	{#if authConnected}
		<section class="main-content">
			<slot />
		</section>
	{:else}
		<Loading />
	{/if}

	{#key notif}
		{#if $app.notification}
			<div class="toast">
				<div transition:fly={{ y: 20 }}>
					<ToastNotification lowContrast {...$app.notification} />
				</div>
			</div>
		{/if}
	{/key}
</div>

<style lang="scss">
	.svelte {
		width: 100vw;
		height: 100vh;

		position: relative;
	}

	.main-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 48px;
		padding: 1rem;

		overflow: auto;
	}

	.toast {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	@media screen and (max-width: 671px) {
		.main-content {
			padding: 0;
		}
	}
</style>
