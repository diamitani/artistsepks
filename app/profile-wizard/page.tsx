"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music2, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  artistName: string;
  genre: string;
  location: string;
  bio: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  spotify: string;
  website: string;
  bookingEmail: string;
}

const emptyForm: FormData = {
  firstName: "", lastName: "", email: "", username: "",
  artistName: "", genre: "", location: "", bio: "",
  instagram: "", tiktok: "", youtube: "", spotify: "",
  website: "", bookingEmail: "",
};

function validateUsername(u: string): string | null {
  if (!u) return "Username is required";
  if (u.length < 3) return "At least 3 characters";
  if (u.length > 30) return "At most 30 characters";
  if (!/^[a-zA-Z0-9-]+$/.test(u)) return "Letters, numbers, and hyphens only";
  return null;
}

export default function ProfileWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState("");

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "username") setUsernameError(null);
  };

  const steps = [
    {
      title: "Your Name",
      desc: "Tell us who you are so we can set up your profile.",
      fields: () => (
        <div className="space-y-4">
          <Input label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} placeholder="John" />
          <Input label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} placeholder="Doe" />
          <Input label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="john@example.com" type="email" />
        </div>
      ),
      canProceed: () => form.firstName && form.email,
    },
    {
      title: "Artist Name & Username",
      desc: "This is how fans will find you on ArtistEPKs.",
      fields: () => (
        <div className="space-y-4">
          <Input label="Artist / Band Name" value={form.artistName} onChange={(v) => update("artistName", v)} placeholder="Your artist name" />
          <div>
            <Input label="Username" value={form.username} onChange={(v) => { update("username", v.toLowerCase().replace(/[^a-z0-9-]/g, "")); }} placeholder="yourname" />
            {form.username && (
              <p className="text-[10px] text-[#666] mt-1">
                artistepks.com/{form.username || "yourname"}
              </p>
            )}
            {usernameError && <p className="text-[10px] text-red-400 mt-1">{usernameError}</p>}
          </div>
        </div>
      ),
      canProceed: () => form.artistName && form.username && !validateUsername(form.username),
    },
    {
      title: "Genre & Location",
      desc: "Help people discover you by genre and scene.",
      fields: () => (
        <div className="space-y-4">
          <Input label="Genre" value={form.genre} onChange={(v) => update("genre", v)} placeholder="e.g. R&B, Hip-Hop, Indie Rock" />
          <Input label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="City, State" />
          <Input label="Bio (a few sentences)" value={form.bio} onChange={(v) => update("bio", v)} placeholder="Tell people about your music, style, and what makes you unique..." type="textarea" />
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: "Social Links",
      desc: "Connect your profiles so fans can follow you everywhere.",
      fields: () => (
        <div className="space-y-4">
          <Input label="Instagram URL" value={form.instagram} onChange={(v) => update("instagram", v)} placeholder="https://instagram.com/yourname" />
          <Input label="TikTok URL" value={form.tiktok} onChange={(v) => update("tiktok", v)} placeholder="https://tiktok.com/@yourname" />
          <Input label="YouTube URL" value={form.youtube} onChange={(v) => update("youtube", v)} placeholder="https://youtube.com/@yourname" />
          <Input label="Spotify URL" value={form.spotify} onChange={(v) => update("spotify", v)} placeholder="https://open.spotify.com/artist/..." />
          <Input label="Website" value={form.website} onChange={(v) => update("website", v)} placeholder="https://yourwebsite.com" />
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: "Contact & Done",
      desc: "How should people reach you for bookings and opportunities?",
      fields: () => (
        <div className="space-y-4">
          <Input label="Booking Email (optional)" value={form.bookingEmail} onChange={(v) => update("bookingEmail", v)} placeholder="booking@example.com" type="email" />
          <div className="bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-2 text-[#C9A227] text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Your profile is free forever
            </div>
            <p className="text-[11px] text-[#888] leading-relaxed">
              Upgrade to unlock the full EPK builder with AI bios, Spotify embeds, discography, press quotes, and a professional PDF download.
            </p>
          </div>
        </div>
      ),
      canProceed: () => true,
    },
  ];

  const handleSave = async () => {
    if (saving) return;
    const err = validateUsername(form.username);
    if (err) { setUsernameError(err); return; }

    setSaving(true);
    const profileData = {
      username: form.username,
      id: form.username,
      contact: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      },
      background: {
        artistName: form.artistName,
        genre: form.genre,
        location: form.location,
        bio: form.bio,
      },
      socialLinks: {
        instagram: form.instagram || undefined,
        tiktok: form.tiktok || undefined,
        youtube: form.youtube || undefined,
        spotify: form.spotify || undefined,
        website: form.website || undefined,
      },
      bookingEmail: form.bookingEmail || undefined,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          profile: profileData,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setProfileUrl(`${window.location.origin}/${form.username}`);
        localStorage.setItem("currentProfileUsername", form.username);
      } else {
        const err = await res.json();
        setUsernameError(err.error || "Save failed");
      }
    } catch {
      setUsernameError("Could not save. Check your connection.");
    }
    setSaving(false);
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#27C93F]/10 border border-[#27C93F]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#27C93F]" />
          </div>
          <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0] mb-2">Profile Created!</h1>
          <p className="text-sm text-[#888] mb-2">Your profile is live at:</p>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#C9A227] hover:underline font-medium block mb-6">
            {profileUrl}
          </a>
          <div className="flex flex-col gap-3">
            <Button variant="gold" asChild className="w-full">
              <Link href="/builder">
                Upgrade to Full EPK <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full border-[#333] text-[#888]">
              <Link href={profileUrl} target="_blank">View My Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-[#1E1E1E] flex items-center justify-between px-6 bg-[#0A0A0A]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center">
            <Music2 className="w-3 h-3 text-[#050505]" />
          </div>
          <span className="font-display text-sm tracking-wider text-[#EDE9E0]">ArtistEPKs</span>
        </Link>
        <span className="text-[10px] text-[#555]">Free Artist Profile</span>
      </header>

      {/* Progress */}
      <div className="h-1 bg-[#1E1E1E]">
        <div className="h-full bg-[#C9A227] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-[#C9A227]" : i < step ? "bg-[#C9A227]/40" : "bg-[#2A2A2A]"}`} />
            ))}
          </div>

          <h1 className="font-display text-xl tracking-wider text-[#EDE9E0] text-center mb-1">
            {current.title}
          </h1>
          <p className="text-xs text-[#666] text-center mb-8">{current.desc}</p>

          {current.fields()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 rounded-lg text-xs text-[#888] hover:text-[#EDE9E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => { if (current.canProceed()) setStep(step + 1); }}
                disabled={!current.canProceed()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors disabled:opacity-30"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {saving ? "Saving..." : "Create Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors"
        />
      )}
    </div>
  );
}
