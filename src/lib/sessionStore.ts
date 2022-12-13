import { writable, type Writable } from 'svelte/store';

export const user: Writable<any> = writable({
    pending: true,
    user: null,
});

export const room: Writable<any> = writable({
    roomId: '',
    isHost: false,
    problems: []
})