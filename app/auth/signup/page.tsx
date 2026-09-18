"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Music2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/builder";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmNeeded, setConfirmNeeded] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // If session is returned, email confirmation is off — redirect immediately
    if (data.session) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    // Email confirmation required
    setConfirmNeeded(true);
    setLoading(false);
  }

  if (confirmNeeded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-8">
            <div className="w-8 h-8 rounded bg-[#C9A227] flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#050505]" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#C9A227]/20 bg-[#0D0D0D] p-8">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="font-display text-xl tracking-wider text-[#EDE9E0] mb-2">
              CHECK YOUR EMAIL
            </h2>
            <p className="text-sm text-[#A0A0A0] mb-4">
              We sent a confirmation link to{" "}
              <span className="text-[#C9A227]">{email}</span>.
            </p>
            <p className="text-xs text-[#555]">
              Click it to activate your account, then you'll be redirected to the EPK builder.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full rounded-full text-xs border-[#333]"
              onClick={() => setConfirmNeeded(false)}
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            CREATE ACCOUNT
          </h1>
          <p className="text-xs text-[#555] mb-6">
            Start building your press kit in minutes
          </p>

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
                minLength={8}
                className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
                placeholder="min. 8 characters"
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Free Account"}
            </Button>
            <p className="text-center text-xs text-[#555]">
              Already have an account?{" "}
              <Link
                href={`/auth/login${redirectTo !== "/builder" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
                className="text-[#C9A227] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
