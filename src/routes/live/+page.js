import { room } from '$lib/sessionStore';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
export const load = async (event) => {
    if (!get(room)?.roomId) {
        if (browser) {
            goto('/');
        }
    }
};
//# sourceMappingURL=+page.js.map