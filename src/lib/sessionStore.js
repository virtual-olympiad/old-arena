import { writable } from 'svelte/store';
export const user = writable({
    pending: true,
    user: null,
});
export const room = writable({
    roomId: '',
    isHost: false,
    problems: []
});
//# sourceMappingURL=sessionStore.js.map