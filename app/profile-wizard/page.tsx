"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Music2, ArrowRight, CheckCircle2, Loader2, Sparkles,
  Camera, Upload, Globe, Link2, MapPin,
  TrendingUp, Plus, X, Search, Star, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SocialLink {
  platform: string;
  url: string;
  followers?: string;
}

interface VenueEntry {
  id: string;
  name: string;
  city: string;
  date?: string;
  verified: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  artistName: string;
  genre: string;
  location: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  socialLinks: SocialLink[];
  venues: VenueEntry[];
  bookingEmail: string;
  website: string;
}

const emptyForm: FormData = {
  firstName: "", lastName: "", email: "", username: "",
  artistName: "", genre: "", location: "", bio: "",
  avatarUrl: "", coverUrl: "",
  socialLinks: [],
  venues: [],
  bookingEmail: "", website: "",
};

const PLATFORM_OPTIONS = [
  "instagram", "tiktok", "youtube", "spotify", "twitter",
  "apple-music", "soundcloud", "bandcamp", "facebook", "website",
];

function platformIcon(p: string) {
  if (p === "instagram") return "📸"; if (p === "youtube") return "🎬";
  if (p === "spotify") return "🎵"; if (p === "tiktok") return "🎶";
  if (p === "twitter") return "🐦"; if (p === "soundcloud") return "☁️";
  if (p === "bandcamp") return "💿"; if (p === "apple-music") return "🍎";
  if (p === "facebook") return "👤"; return "🔗";
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [venueSearch, setVenueSearch] = useState("");
  const [venueResults, setVenueResults] = useState<any[]>([]);
  const [showVenueSearch, setShowVenueSearch] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [socialDashboard, setSocialDashboard] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "username") setUsernameError(null);
  };

  const handleUpload = async (file: File, type: "avatar" | "cover") => {
    const setLoading = type === "avatar" ? setAvatarUploading : setCoverUploading;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        update(type === "avatar" ? "avatarUrl" : "coverUrl", data.url);
      }
    } catch (e) {
      console.error("Upload failed", e);
    }
    setLoading(false);
  };

  // Venue search
  useEffect(() => {
    if (venueSearch.length < 2) { setVenueResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/venues?q=${encodeURIComponent(venueSearch)}`);
        const data = await res.json();
        setVenueResults(data.venues || []);
      } catch { setVenueResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [venueSearch]);

  const addVenue = (v: any) => {
    if (form.venues.find((x) => x.id === v.id)) return;
    update("venues", [...form.venues, { id: v.id, name: v.name, city: `${v.city}, ${v.state}`, verified: false }]);
    setShowVenueSearch(false);
    setVenueSearch("");
  };

  const removeVenue = (id: string) => {
    update("venues", form.venues.filter((v) => v.id !== id));
  };

  const addSocialLink = () => {
    if (!newLinkPlatform || !newLinkUrl) return;
    update("socialLinks", [...form.socialLinks, { platform: newLinkPlatform, url: newLinkUrl }]);
    setNewLinkPlatform("");
    setNewLinkUrl("");
  };

  const removeSocialLink = (i: number) => {
    update("socialLinks", form.socialLinks.filter((_, j) => j !== i));
  };

  // Fetch social dashboard
  const fetchSocialDashboard = async () => {
    setDashboardLoading(true);
    const urls: Record<string, string> = {};
    for (const link of form.socialLinks) {
      if (link.url) urls[link.platform] = link.url;
    }
    if (Object.keys(urls).length === 0) {
      setDashboardLoading(false);
      setSocialDashboard(null);
      return;
    }
    try {
      const res = await fetch("/api/social/dashboard", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      if (res.ok) {
        const data = await res.json();
        setSocialDashboard(data);
        // Auto-fill stats from dashboard
        if (data.spotify) update("genre", data.spotify.genres[0] || form.genre);
      }
    } catch {}
    setDashboardLoading(false);
  };

  const steps = [
    {
      title: "Identity", desc: "Your name, artist name, and how fans find you.",
      fields: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} placeholder="John" />
            <Input label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} placeholder="Doe" />
          </div>
          <Input label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="john@example.com" type="email" />
          <Input label="Artist / Band Name" value={form.artistName} onChange={(v) => update("artistName", v)} placeholder="Your stage name" />
          <div>
            <Input label="Username" value={form.username} onChange={(v) => update("username", v.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="yourname" />
            {form.username && <p className="text-[10px] text-[#666] mt-1">artistepks.com/{form.username}</p>}
            {usernameError && <p className="text-[10px] text-red-400 mt-1">{usernameError}</p>}
          </div>
        </div>
      ),
      canProceed: () => form.firstName && form.email && form.artistName && form.username,
    },
    {
      title: "Photos", desc: "Upload your profile picture and cover image.",
      fields: () => (
        <div className="space-y-6">
          {/* Profile photo */}
          <div>
            <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-2">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#2A2A2A] overflow-hidden flex items-center justify-center bg-[#141414] flex-shrink-0">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : avatarUploading ? (
                  <Loader2 className="w-5 h-5 text-[#C9A227] animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-[#555]" />
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#888] hover:text-[#C9A227] transition-colors px-3 py-2 rounded-lg border border-[#2A2A2A]">
                {form.avatarUrl ? "Change" : "Upload"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "avatar"); }} />
            </div>
          </div>
          {/* Cover image */}
          <div>
            <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-2">Cover Image</label>
            <div className="relative h-32 rounded-xl border-2 border-dashed border-[#2A2A2A] overflow-hidden bg-[#141414] flex items-center justify-center cursor-pointer hover:border-[#C9A227]/30 transition-colors"
              onClick={() => coverInputRef.current?.click()}>
              {form.coverUrl ? (
                <img src={form.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : coverUploading ? (
                <Loader2 className="w-5 h-5 text-[#C9A227] animate-spin" />
              ) : (
                <div className="text-center"><Upload className="w-5 h-5 text-[#555] mx-auto mb-1" /><span className="text-[10px] text-[#555]">Click to upload cover</span></div>
              )}
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "cover"); }} />
            </div>
          </div>
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: "Genre & Bio", desc: "Tell fans what you sound like and your story.",
      fields: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Genre" value={form.genre} onChange={(v) => update("genre", v)} placeholder="R&B, Hip-Hop, Indie..." />
            <Input label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="City, State" />
          </div>
          <div>
            <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)}
              placeholder="Tell your story — who you are, your sound, what makes you unique..."
              rows={5}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors resize-none" />
            <p className="text-[10px] text-[#555] mt-1 text-right">{form.bio.length} chars</p>
          </div>
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: "Social Links", desc: "Connect your profiles. We'll pull your stats automatically.",
      fields: () => (
        <div className="space-y-4">
          {/* Existing links */}
          <div className="space-y-2">
            {form.socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2.5">
                <span className="text-sm">{platformIcon(link.platform)}</span>
                <span className="text-[10px] text-[#888] uppercase w-20">{link.platform}</span>
                <span className="text-xs text-[#A0A0A0] flex-1 truncate">{link.url}</span>
                <button onClick={() => removeSocialLink(i)} className="text-[#555] hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {/* Add new link */}
          <div className="flex gap-2">
            <select value={newLinkPlatform} onChange={(e) => setNewLinkPlatform(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-[#EDE9E0] outline-none focus:border-[#C9A227]/40">
              <option value="">Platform</option>
              {PLATFORM_OPTIONS.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
            <input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://..." className="flex-1 bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40" />
            <button onClick={addSocialLink} disabled={!newLinkPlatform || !newLinkUrl}
              className="px-3 py-2.5 rounded-xl bg-[#C9A227] text-[#050505] disabled:opacity-30 transition-opacity">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Fetch dashboard button */}
          {form.socialLinks.length > 0 && (
            <button onClick={fetchSocialDashboard} disabled={dashboardLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xs font-medium hover:bg-[#C9A227]/20 transition-colors">
              {dashboardLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {dashboardLoading ? "Pulling live data..." : "Pull Live Stats from Social Media"}
            </button>
          )}
          {/* Dashboard results */}
          {socialDashboard && (
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-medium">Live Data</span>
                <span className="text-[10px] text-[#555]">Updated just now</span>
              </div>
              {socialDashboard.engagementScore && (
                <div className="flex items-center gap-3 bg-[#C9A227]/5 rounded-lg p-3">
                  <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                    <span className="font-display text-lg text-[#C9A227]">{socialDashboard.engagementScore.overall}</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#EDE9E0]">Engagement Score</div>
                    <div className="text-[10px] text-[#888]">{socialDashboard.engagementScore.label}</div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {socialDashboard.spotify && <StatBox label="Spotify" value={socialDashboard.spotify.monthlyListeners} sub="monthly listeners" />}
                {socialDashboard.instagram && <StatBox label="Instagram" value={String(socialDashboard.instagram.followers)} sub={`${socialDashboard.instagram.engagementRate}% eng.`} />}
                {socialDashboard.tiktok && <StatBox label="TikTok" value={String(socialDashboard.tiktok.followers)} sub={`${socialDashboard.tiktok.engagementRate}% eng.`} />}
                {socialDashboard.youtube && <StatBox label="YouTube" value={String(socialDashboard.youtube.subscribers)} sub={`${socialDashboard.youtube.engagementRate}% eng.`} />}
              </div>
            </div>
          )}
          <Input label="Website" value={form.website} onChange={(v) => update("website", v)} placeholder="https://yourwebsite.com" />
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: "Venues", desc: "Add venues and festivals you've performed at.",
      fields: () => (
        <div className="space-y-4">
          {/* Selected venues */}
          {form.venues.length > 0 && (
            <div className="space-y-2">
              {form.venues.map((v) => (
                <div key={v.id} className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="text-xs text-[#EDE9E0] flex-1">{v.name}</span>
                  <span className="text-[10px] text-[#666]">{v.city}</span>
                  {v.verified ? (
                    <Star className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
                  ) : (
                    <button onClick={() => update("venues", form.venues.map((x) => x.id === v.id ? { ...x, verified: true } : x))}
                      className="text-[10px] text-[#555] hover:text-[#C9A227]">Verify</button>
                  )}
                  <button onClick={() => removeVenue(v.id)} className="text-[#555] hover:text-red-400"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
          {/* Search */}
          {showVenueSearch ? (
            <div>
              <input value={venueSearch} onChange={(e) => setVenueSearch(e.target.value)}
                placeholder="Search venues by name or city..."
                className="w-full bg-[#141414] border border-[#C9A227]/40 rounded-xl px-4 py-3 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227] transition-colors"
                autoFocus />
              {venueResults.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-2">
                  {venueResults.map((v) => (
                    <button key={v.id} onClick={() => addVenue(v)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#181818] text-left transition-colors">
                      <MapPin className="w-3 h-3 text-[#C9A227]" />
                      <div><div className="text-xs text-[#EDE9E0]">{v.name}</div><div className="text-[9px] text-[#666]">{v.city}, {v.state} · {v.type} · {v.capacity}</div></div>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => { setShowVenueSearch(false); setVenueSearch(""); }}
                className="text-[10px] text-[#555] mt-2 hover:text-[#888]">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowVenueSearch(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#333] text-[#888] text-xs hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add a Venue
            </button>
          )}
          <Input label="Booking Email" value={form.bookingEmail} onChange={(v) => update("bookingEmail", v)} placeholder="booking@example.com" type="email" />
        </div>
      ),
      canProceed: () => true,
    },
  ];

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const profileData = {
      id: form.username,
      username: form.username,
      contact: { firstName: form.firstName, lastName: form.lastName, email: form.email },
      background: { artistName: form.artistName, genre: form.genre, location: form.location, bio: form.bio },
      avatarUrl: form.avatarUrl || undefined,
      coverUrl: form.coverUrl || undefined,
      socialLinks: form.socialLinks,
      venues: form.venues,
      bookingEmail: form.bookingEmail || undefined,
      website: form.website || undefined,
      socialDashboard: socialDashboard || undefined,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", profile: profileData }),
      });
      if (res.ok) {
        setSaved(true);
        setProfileUrl(`${window.location.origin}/${form.username}`);
        localStorage.setItem("currentProfileUsername", form.username);
      } else {
        const err = await res.json();
        setUsernameError(err.error || "Save failed");
      }
    } catch { setUsernameError("Could not save"); }
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
          <p className="text-sm text-[#888] mb-2">{profileUrl}</p>
          <div className="flex flex-col gap-3 mt-6">
            <Button variant="gold" className="w-full" asChild>
              <Link href={profileUrl.replace(window.location.origin, "")} target="_blank">View My Profile <ArrowRight className="w-3.5 h-3.5" /></Link>
            </Button>
            <Button variant="outline" className="w-full border-[#333] text-[#888]" asChild>
              <Link href="/builder">Build Full EPK</Link>
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
      <header className="h-14 border-b border-[#1E1E1E] flex items-center justify-between px-6 bg-[#0A0A0A]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center">
            <Music2 className="w-3 h-3 text-[#050505]" />
          </div>
          <span className="font-display text-sm tracking-wider text-[#EDE9E0]">ArtistEPKs</span>
        </Link>
        <span className="text-[10px] text-[#555]">Free Artist Profile</span>
      </header>
      <div className="h-1 bg-[#1E1E1E]"><div className="h-full bg-[#C9A227] transition-all duration-300" style={{ width: `${progress}%` }} /></div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="flex justify-center gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-[#C9A227]" : i < step ? "bg-[#C9A227]/40" : "bg-[#2A2A2A]"}`} />
            ))}
          </div>
          <h1 className="font-display text-xl tracking-wider text-[#EDE9E0] text-center mb-1">{current.title}</h1>
          <p className="text-xs text-[#666] text-center mb-8">{current.desc}</p>
          {current.fields()}
          <div className="flex items-center justify-between mt-8 gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="px-4 py-2 rounded-lg text-xs text-[#888] hover:text-[#EDE9E0] disabled:opacity-30 transition-colors">Back</button>
            {step < steps.length - 1 ? (
              <button onClick={() => { if (current.canProceed()) setStep(step + 1); }} disabled={!current.canProceed()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors disabled:opacity-30">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors disabled:opacity-30">
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
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4}
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors resize-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors" />
      )}
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-[#181818] rounded-lg p-3">
      <div className="text-[10px] text-[#888] uppercase">{label}</div>
      <div className="font-display text-lg text-[#C9A227] tracking-wider">{value}</div>
      <div className="text-[9px] text-[#555]">{sub}</div>
    </div>
  );
}
