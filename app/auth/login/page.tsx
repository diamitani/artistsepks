"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authSignIn, authGetCurrentUser } from "@/lib/aws-auth";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Try Cognito first (AWS AgentCore backend)
      await authSignIn(email, password);
      router.push(redirectTo);
      router.refresh();
      return;
    } catch (cognitoErr) {
      // If Cognito fails and Supabase is configured, try Supabase as fallback
      if (hasSupabase) {
        const supabase = createClient();
        const { error: sbErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!sbErr) {
          router.push(redirectTo);
          router.refresh();
          return;
        }
      }
      setError(
        cognitoErr instanceof Error
          ? cognitoErr.message.replace("PreAuthentication failed", "Incorrect email or password")
          : "Sign in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-[#A0A0A0] uppercase tracking-wider">
            Password
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-[#C9A227] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" variant="gold" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-xs text-[#555]">
        No account?{" "}
        <Link
          href={`/auth/signup${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-[#C9A227] hover:underline"
        >
          Create one free
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <img
              src="/artispreneur%20logo.png"
              alt="Artispreneur"
              width="32"
              height="32"
              className="w-8 h-8 rounded object-contain"
            />
            <span className="font-display text-sm tracking-[0.2em] text-[#EDE9E0] uppercase">
              EPK Agent
            </span>
          </Link>
          <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0] mb-2">
            SIGN IN
          </h1>
          <p className="text-sm text-[#666]">Welcome back to your EPK dashboard</p>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <Suspense fallback={<div className="text-[#666] text-sm text-center">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-[10px] text-[#444] mt-6">
          Powered by Artispreneur · AWS Cognito · Secure Auth
        </p>
      </div>
    </main>
  );
}
