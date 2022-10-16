import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { user } from '$lib/sessionStore';

export const load: PageLoad = async (event) => {
	user.set((await supabase.auth.getUser()).data.user);
};
