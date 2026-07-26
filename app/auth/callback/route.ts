/**
 * /auth/callback — handles Cognito hosted UI redirect + Supabase PKCE code exchange
 * Also handles demo redirect from /api/auth/demo
 */
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");

  // Cognito hosted UI error
  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    // Try Supabase PKCE exchange first (if configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && !supabaseUrl.includes("placeholder") && supabaseKey && supabaseKey !== "placeholder-key") {
      try {
        const { createServerClient } = await import("@supabase/ssr");
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (cookiesToSet) =>
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              ),
          },
        });
        const { error: sbError } = await supabase.auth.exchangeCodeForSession(code);
        if (!sbError) return NextResponse.redirect(`${origin}${next}`);
      } catch { /* fall through */ }
    }

    // Cognito authorization_code flow — exchange for tokens
    const cognitoClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const cognitoDomain = process.env.COGNITO_DOMAIN; // e.g. https://your-pool.auth.us-east-1.amazoncognito.com
    const redirectUri = process.env.COGNITO_REDIRECT_URI || `${origin}/auth/callback`;

    if (cognitoClientId && cognitoDomain) {
      try {
        const tokenRes = await fetch(`${cognitoDomain}/oauth2/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: cognitoClientId,
            code,
            redirect_uri: redirectUri,
          }),
        });

        if (tokenRes.ok) {
          const tokens = await tokenRes.json();
          const res = NextResponse.redirect(`${origin}${next}`);
          // Store tokens as httpOnly cookies
          res.cookies.set("cognito-access-token", tokens.access_token || "", {
            httpOnly: true,
            path: "/",
            maxAge: tokens.expires_in || 3600,
            sameSite: "lax",
          });
          res.cookies.set("cognito-id-token", tokens.id_token || "", {
            httpOnly: false, // readable by client for API auth headers
            path: "/",
            maxAge: tokens.expires_in || 3600,
            sameSite: "lax",
          });
          return res;
        }
      } catch { /* fall through */ }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_error`);
}
