/// <reference types="@sveltejs/kit" />

import 'svelte';

type RoomMode = 'Standard' | 'Relay' | 'Showdown';

interface RoomAbstract {
	id: number;
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
