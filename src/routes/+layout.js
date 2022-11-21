import { auth } from "$lib/firebase";
import { user } from '$lib/sessionStore';
import { onAuthStateChanged } from 'firebase/auth';
export const load = async (event) => {
    onAuthStateChanged(auth, currentUser => {
        user.set({
            pending: false,
            user: currentUser
        });
    });
};
//# sourceMappingURL=+layout.js.map