"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Globe,
  Radio,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [authMethod, setAuthMethod] = useState<"password" | "magic-link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  // Handle OAuth Sign In
  async function handleOAuth(provider: "google" | "apple" | "spotify") {
    try {
      setOauthLoading(provider);
      setError("");
      const supabase = createClient();
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (oAuthError) throw oAuthError;
    } catch (err: any) {
      setError(err?.message || `Failed to authenticate with ${provider}`);
      setOauthLoading(null);
    }
  }

  // Handle Email + Password or Magic Link Sign In
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (authMethod === "magic-link") {
        const { error: magicError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (magicError) throw magicError;
        setMagicSent(true);
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Invalid login credentials. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* OAuth Social Logins */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading || loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#444] text-xs font-semibold text-[#EDE9E0] transition-all disabled:opacity-50"
        >
          {oauthLoading === "google" ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleOAuth("apple")}
            disabled={!!oauthLoading || loading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#444] text-xs font-semibold text-[#EDE9E0] transition-all disabled:opacity-50"
          >
            {oauthLoading === "apple" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
            ) : (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.93-12.04-14.54-6.08-9.19-10.9-19.75-14.46-31.67-3.56-11.93-5.34-23.27-5.34-34.02 0-14.28 3.56-25.96 10.68-35.04 7.12-9.08 16.03-13.62 26.73-13.62 4.35 0 9.29 1.16 14.82 3.48 5.53 2.32 9.28 3.54 11.24 3.65 1.52-.11 5.39-1.39 11.61-3.83 6.22-2.45 11.66-3.48 16.32-3.09 12.39.99 22.18 5.67 29.38 14.04-10.88 6.64-16.2 15.82-15.96 27.53.25 9.3 3.84 17.06 10.78 23.29 6.94 6.23 15.34 9.77 25.21 10.63-2.22 6.84-4.88 13.91-7.98 21.22zM119.22 33.64c0-7.39 2.65-14.27 7.95-20.65 5.3-6.38 11.83-10.37 19.59-11.99.76 7.61-1.63 14.62-7.17 21.03-5.54 6.41-12.33 10.27-20.37 11.61z" />
              </svg>
            )}
            <span>Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("spotify")}
            disabled={!!oauthLoading || loading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#444] text-xs font-semibold text-[#EDE9E0] transition-all disabled:opacity-50"
          >
            {oauthLoading === "spotify" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
            ) : (
              <svg className="w-3.5 h-3.5 fill-[#1DB954]" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            )}
            <span>Spotify</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-[#222]" />
        <span className="bg-[#0D0D0D] px-3 text-[10px] text-[#666] uppercase tracking-widest font-semibold absolute">
          Or continue with email
        </span>
      </div>

      {/* Method Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#141414] rounded-xl border border-[#222]">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("password");
            setError("");
          }}
          className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
            authMethod === "password"
              ? "bg-[#C9A227] text-[#050505] shadow"
              : "text-[#888] hover:text-[#EDE9E0]"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod("magic-link");
            setError("");
          }}
          className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
            authMethod === "magic-link"
              ? "bg-[#C9A227] text-[#050505] shadow"
              : "text-[#888] hover:text-[#EDE9E0]"
          }`}
        >
          Magic Link
        </button>
      </div>

      {/* Magic Link Sent State */}
      {magicSent ? (
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#C9A227]/30 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center mx-auto text-[#C9A227]">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-display text-lg text-[#EDE9E0] uppercase tracking-wide">
            Magic Link Dispatched
          </h4>
          <p className="text-xs text-[#AAA] leading-relaxed">
            We sent a secure, one-click login link to <strong className="text-[#EDE9E0]">{email}</strong>.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMagicSent(false)}
            className="border-[#333] text-xs text-[#CCC] mt-2"
          >
            Use different method
          </Button>
        </div>
      ) : (
        /* Email Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#C0272D]/10 border border-[#C0272D]/30 flex items-center gap-2.5 text-xs text-[#EF4444]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs text-[#888] uppercase tracking-wider mb-1.5 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A227] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none transition-colors"
                placeholder="artist@recordlabel.com"
              />
            </div>
          </div>

          {authMethod === "password" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-[#888] uppercase tracking-wider font-medium">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-[#C9A227] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A227] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold tracking-wider uppercase text-xs h-11 shadow-lg shadow-[#C9A227]/20 rounded-xl mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{authMethod === "password" ? "Sign In To Account" : "Send Magic Login Link"}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-[#666] pt-1">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/signup${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-[#C9A227] font-semibold hover:underline"
            >
              Create Free Account
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050505] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C9A227]/6 blur-[180px] pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Form Box (7 cols) */}
        <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-[#0D0D0D] border border-[#222] shadow-2xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#C9A227]/30 text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>ArtistEPKs Studio Access</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[#EDE9E0]">
              Sign In To <span className="text-[#C9A227]">ArtistEPKs</span>
            </h1>
            <p className="text-xs text-[#888]">
              Manage your music press kits, live Spotify sync, and A&amp;R viewer analytics.
            </p>
          </div>

          <Suspense fallback={<div className="text-xs text-[#777]">Loading authentication interface...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Right Feature Showcase (5 cols) */}
        <div className="lg:col-span-5 p-7 rounded-3xl bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#C9A227]/20 shadow-2xl space-y-5 hidden lg:block">
          <div className="flex items-center gap-2.5">
            <img src="/artispreneur-logo.png" alt="Artispreneur" className="w-6 h-6 object-contain" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              Why Music Pros Join
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-[#AAA]">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141414] border border-[#222]">
              <Radio className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#EDE9E0]">Live Spotify &amp; DSP Sync</p>
                <p className="text-[11px] text-[#777]">Streams and monthly listeners refresh automatically.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141414] border border-[#222]">
              <Globe className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#EDE9E0]">Custom Vanity URL</p>
                <p className="text-[11px] text-[#777]">Claim your branded link: artistsepks.com/@yourname</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141414] border border-[#222]">
              <TrendingUp className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#EDE9E0]">DocSend-Style Analytics</p>
                <p className="text-[11px] text-[#777]">Track when festival bookers and A&amp;Rs open your kit.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] text-[#666]">
            <span>100% Free to start</span>
            <span className="text-[#22C55E] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Platform
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
