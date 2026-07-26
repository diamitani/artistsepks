"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authSignUp, authConfirmSignUp } from "@/lib/aws-auth";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authSignUp(email, password, name);
      if (result.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        setStep("verify");
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authConfirmSignUp(email, code);
      router.push(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}&verified=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "verify") {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-[#C9A227] text-lg">✉</span>
          </div>
          <p className="text-sm text-[#A0A0A0]">
            We sent a verification code to <span className="text-[#EDE9E0]">{email}</span>
          </p>
        </div>
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors text-center tracking-[0.5em] text-lg"
            placeholder="000000"
          />
        </div>
        <Button type="submit" variant="gold" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
        <button
          type="button"
          onClick={() => setStep("form")}
          className="w-full text-xs text-[#555] hover:text-[#888] transition-colors"
        >
          ← Back to sign up
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none focus:border-[#C9A227]/50 transition-colors"
          placeholder="Artist or manager name"
        />
      </div>
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
          placeholder="Min 8 characters"
        />
      </div>
      <Button type="submit" variant="gold" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Free Account"}
      </Button>
      <p className="text-center text-xs text-[#555]">
        Already have an account?{" "}
        <Link href={`/auth/login${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-[#C9A227] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
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
            CREATE ACCOUNT
          </h1>
          <p className="text-sm text-[#666]">Build your first EPK free — no credit card needed</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <Suspense fallback={<div className="text-[#666] text-sm text-center">Loading...</div>}>
            <SignupForm />
          </Suspense>
        </div>
        <p className="text-center text-[10px] text-[#444] mt-6">
          Powered by Artispreneur · AWS Cognito · Secure Auth
        </p>
      </div>
    </main>
  );
}
