import type { PageLoad } from './$types';
import { auth } from "$lib/firebase";
import { user } from '$lib/sessionStore';
import { onAuthStateChanged } from 'firebase/auth';

export const load: PageLoad = async (event) => {
	onAuthStateChanged(auth, currentUser => {
		user.set({
			pending: false,
			user: currentUser
		});
	});
};
