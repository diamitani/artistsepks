import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && sessionData?.user) {
      // Ensure initial profile exists
      try {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", sessionData.user.id)
          .maybeSingle();

        if (!existingProfile) {
          await supabase.from("profiles").insert({
            user_id: sessionData.user.id,
            profile_data: {
              email: sessionData.user.email,
              name: sessionData.user.user_metadata?.full_name || sessionData.user.email?.split("@")[0],
              plan: "free",
              created_via: sessionData.user.app_metadata?.provider || "email",
            },
          });
        }
      } catch (profileErr) {
        console.warn("Could not sync user profile in callback:", profileErr);
      }

      // Safe redirect protection: ensure next starts with /
      const safeNext = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_error`);
}
