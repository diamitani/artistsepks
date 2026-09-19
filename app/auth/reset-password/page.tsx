"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to update password. Your reset link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050505] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A227]/5 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-[#0D0D0D] border border-[#222] shadow-2xl space-y-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#C9A227]/30 text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>New Password</span>
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-[#EDE9E0]">
            Set New <span className="text-[#C9A227]">Password</span>
          </h1>
          <p className="text-xs text-[#888]">
            Choose a strong password for your artist account.
          </p>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#22C55E]/30 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#22C55E]/15 flex items-center justify-center mx-auto text-[#22C55E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-display text-lg text-[#EDE9E0] uppercase tracking-wide">
              Password Updated
            </h4>
            <p className="text-xs text-[#AAA]">
              Your password has been changed successfully. Redirecting to your dashboard...
            </p>
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
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A227] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none transition-colors"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#888] uppercase tracking-wider mb-1.5 font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A227] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#EDE9E0] placeholder-[#555] focus:outline-none transition-colors"
                  placeholder="Repeat password"
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
                  <span>Updating password...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Update Password</span>
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
