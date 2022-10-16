import { supabase } from '$lib/supabaseClient';
import { user } from '$lib/sessionStore';
export const load = async (event) => {
    user.set((await supabase.auth.getUser()).data.user);
};
//# sourceMappingURL=+layout.js.map