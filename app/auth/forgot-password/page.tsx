"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;

      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send password reset link. Please verify your email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050505] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A227]/5 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-[#0D0D0D] border border-[#222] shadow-2xl space-y-6 relative z-10">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#888] hover:text-[#EDE9E0] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#C9A227]/30 text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Account Recovery</span>
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-[#EDE9E0]">
            Reset Your <span className="text-[#C9A227]">Password</span>
          </h1>
          <p className="text-xs text-[#888]">
            Enter the email associated with your artist account and we will send you a password reset link.
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#22C55E]/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#22C55E]/15 flex items-center justify-center mx-auto text-[#22C55E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-display text-lg text-[#EDE9E0] uppercase tracking-wide">
              Reset Link Sent
            </h4>
            <p className="text-xs text-[#AAA] leading-relaxed">
              Check your inbox at <strong className="text-[#EDE9E0]">{email}</strong>. Click the link provided to choose a new password.
            </p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#333] text-xs text-[#CCC] mt-2"
            >
              <Link href="/auth/login">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
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

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full bg-[#C9A227] hover:bg-[#d8b030] text-[#050505] font-bold tracking-wider uppercase text-xs h-11 shadow-lg shadow-[#C9A227]/20 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending reset link...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
