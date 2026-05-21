"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IntakeWizard } from "@/components/intake/wizard";
import type { ArtistProfile } from "@/lib/types";

export default function IntakePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing profile in session/localStorage
    const savedId = localStorage.getItem("currentProfileId");
    if (savedId) {
      fetch(`/api/profile?id=${savedId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.id) setProfile(data);
          else createNewProfile();
        })
        .catch(() => createNewProfile());
    } else {
      createNewProfile();
    }
    setLoading(false);
  }, []);

  const createNewProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const data = await res.json();
      setProfile(data.profile);
      localStorage.setItem("currentProfileId", data.id);
    } catch {
      // Offline fallback - create in-memory
      setProfile({
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        intakeComplete: false,
        contact: { firstName: "", lastName: "", email: "", phone: "", website: "", managerName: "", managerContact: "", label: "", labelContact: "" },
        background: { artistName: "", stageName: "", location: "", hometown: "", yearsInBusiness: 0, isProfessional: false, genre: "", style: "", themes: [], energy: "", influences: [], bio: "" },
        goals: { primaryGoal: "", performanceFrequency: "", streamingTarget: "", revenueTarget: "", wantsDistribution: false, wantsSyncLicensing: false, wantsBrandPartnerships: false, wantsInfluencerWork: false, timeline: "", smartGoals: [] },
        assets: { hasPro: false, proOrganization: "", hasCopyrights: false, copyrightDetails: "", dsps: [], hasSplitSheets: false, hasContracts: false, businessEntity: "", hasEin: false, hasBankAccount: false, studioAccess: "", needsHelp: [] },
        resources: { investmentBudget: "", timeCommitment: "", availability: "", teamMembers: [] },
        enriched: { socialMedia: {}, discography: [] },
        files: [],
        collaborations: [],
        intakePhase: 0,
      });
    }
  };

  const handleSave = async (updated: ArtistProfile) => {
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", profile: updated }),
      });
    } catch { /* offline - data still in memory */ }
    setProfile(updated);
  };

  const handleComplete = (completed: ArtistProfile) => {
    localStorage.setItem("currentProfileId", completed.id);
    // Store profile data in session for the builder to pick up
    sessionStorage.setItem("intakeProfile", JSON.stringify(completed));
    router.push("/builder");
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#C9A227] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <button
          onClick={createNewProfile}
          className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#050505] font-semibold text-sm tracking-wider uppercase"
        >
          Start Intake
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] overflow-hidden">
      <IntakeWizard
        profile={profile}
        onSave={handleSave}
        onComplete={handleComplete}
      />
    </div>
  );
}
