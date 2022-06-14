/// <reference types="@sveltejs/kit" />

import 'svelte';

type RoomMode = 'Normal' | 'Relay' | 'Showdown';

interface RoomAbstract {
	name: string;
	description: string;
	mode: RoomMode;
	playerCount: number;
	playerLimit: number;
	teamsEnabled: boolean;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}
