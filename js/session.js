// LOAD SESSION USER INFO
import { getCurrentUser } from './supabase.js';

export async function loadSession() {
    const user = await getCurrentUser();
    if (!user) return;

    const holder = document.getElementById("hb-username");
    if (holder) {
        const stored = JSON.parse(localStorage.getItem("hb_profile") || "{}");
        holder.textContent = stored.firstname || "User";
    }
}
