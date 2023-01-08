import { fetchProfile } from '$lib/firebase';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    if (params.uid === '') {
        throw redirect(307, '/profile');
    }

    const profile = await fetchProfile(params.uid, true);
    return {
        profile
    };
}) satisfies PageServerLoad;