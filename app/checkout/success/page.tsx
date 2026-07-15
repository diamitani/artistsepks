"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Music2, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "epk_onetime";
  const [countdown, setCountdown] = useState(8);

  const planLabel =
    plan === "pro_monthly"
      ? "Pro Monthly"
      : plan === "pro_yearly"
      ? "Pro Annual"
      : "EPK";

  const nextStep =
    plan.startsWith("pro_") ? "/dashboard" : "/builder";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push(nextStep);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [nextStep, router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#27C93F]/10 border border-[#27C93F]/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#27C93F]" />
          </div>
        </div>

        <h1 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-2">
          PAYMENT CONFIRMED
        </h1>
        <p className="text-[#A0A0A0] mb-2">
          Your {planLabel} plan is now active.
        </p>
        <p className="text-xs text-[#555] mb-8">
          Redirecting you in {countdown}s...
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gold" size="lg" asChild className="rounded-full">
            <Link href={nextStep}>
              {plan.startsWith("pro_") ? "Go to Dashboard" : "Build Your EPK"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <p className="text-[10px] text-[#444] mt-8">
          Questions? Email{" "}
          <a href="mailto:support@artistsepks.com" className="text-[#C9A227] hover:underline">
            support@artistsepks.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
