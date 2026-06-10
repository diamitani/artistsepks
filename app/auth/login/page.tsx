"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Music2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
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
        <label className="block text-xs text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        variant="gold"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-xs text-[#555]">
        No account?{" "}
        <Link href={`/auth/signup${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`} className="text-[#C9A227] hover:underline">
          Create one free
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#C9A227] flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#050505]" />
            </div>
            <span className="font-display text-lg tracking-wider text-[#EDE9E0]">
              EPK AGENT
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-[#C9A227]/10 bg-[#0D0D0D] p-8">
          <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0] mb-1">
            SIGN IN
          </h1>
          <p className="text-xs text-[#555] mb-6">Welcome back to EPK Agent</p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
