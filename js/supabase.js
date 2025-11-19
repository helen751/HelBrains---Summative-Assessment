
// Core Auth Module for HelBrains

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  window.ENV.SUPABASE_URL,
  window.ENV.SUPABASE_KEY
);

// Persistent session
export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? session.user : null;
}


// Protect pages (redirects if not logged in)
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) window.location.href = "login.html";
}
