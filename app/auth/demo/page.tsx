/**
 * /app/auth/demo/page.tsx
 *
 * One-click demo access page. Hitting this page:
 *  1. Calls /api/auth/demo to set the demo session cookie
 *  2. Redirects to /dashboard
 *
 * Accessible at: /auth/demo or directly at /demo
 * No login required — anyone can use demo mode for testing.
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"starting" | "ready" | "error">("starting");
  const [msg, setMsg] = useState("Starting demo session...");

  useEffect(() => {
    async function startDemo() {
      try {
        const res = await fetch("/api/auth/demo");
        const data = await res.json();
        if (data.success) {
          setStatus("ready");
          setMsg("Demo session active! Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 800);
        } else {
          setStatus("error");
          setMsg("Could not start demo session.");
        }
      } catch {
        setStatus("error");
        setMsg("Network error — please try again.");
      }
    }
    startDemo();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
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

        <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            status === "ready"
              ? "bg-green-500/10 border border-green-500/20"
              : status === "error"
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-[#C9A227]/10 border border-[#C9A227]/20"
          }`}>
            {status === "starting" && (
              <div className="w-6 h-6 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            )}
            {status === "ready" && <span className="text-green-400 text-2xl">✓</span>}
            {status === "error" && <span className="text-red-400 text-2xl">✗</span>}
          </div>

          <h1 className="font-display text-xl tracking-wider text-[#EDE9E0] mb-2">
            {status === "ready" ? "DEMO ACTIVE" : status === "error" ? "ERROR" : "LOADING DEMO"}
          </h1>
          <p className="text-sm text-[#888] mb-6">{msg}</p>

          {status === "error" && (
            <button
              onClick={() => { setStatus("starting"); setMsg("Retrying..."); }}
              className="w-full py-2.5 rounded-lg bg-[#C9A227] text-[#050505] text-sm font-medium"
            >
              Try Again
            </button>
          )}

          {status !== "ready" && (
            <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
              <p className="text-[10px] text-[#555]">
                Demo mode gives full access to the builder and dashboard.
                No account required.
              </p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-[#444] mt-6">
          Demo sessions last 24 hours · No data is persisted to production
        </p>
      </div>
    </main>
  );
}
