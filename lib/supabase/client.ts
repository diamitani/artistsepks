import { createBrowserClient } from "@supabase/ssr";

// Null-safe Supabase client — returns null when not configured (Cognito auth path)
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.includes("your-project") || !key || key === "your-anon-key") {
    // Return a no-op stub so callers don't have to null-check
    return {
      auth: {
        signInWithPassword: async () => ({ error: new Error("Supabase not configured — using Cognito auth") }),
        signUp: async () => ({ error: new Error("Supabase not configured — using Cognito auth") }),
        signOut: async () => ({}),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: null, error: new Error("Supabase not configured") }),
        insert: () => ({ data: null, error: new Error("Supabase not configured") }),
        update: () => ({ data: null, error: new Error("Supabase not configured") }),
        delete: () => ({ data: null, error: new Error("Supabase not configured") }),
      }),
    } as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}

export const hasSupabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && !url.includes("your-project") && key && key !== "your-anon-key");
})();
