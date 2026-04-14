"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EPKData, EPKTemplate, Release, TimelineEvent } from "@/lib/types";
import {
  Music2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  ArrowRight,
} from "lucide-react";

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: "template", label: "Template", emoji: "🎨" },
  { id: "basics", label: "Basics", emoji: "👤" },
  { id: "stats", label: "Stats", emoji: "📊" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "story", label: "Story", emoji: "📝" },
  { id: "social", label: "Social", emoji: "🔗" },
  { id: "preview", label: "Preview", emoji: "✨" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMPTY: EPKData = {
  template: "main",
  artistName: "",
  artistTagline: "",
  genre: "",
  hometown: "",
  bio: "",
  shortBio: "",
  heroImageUrl: "",
  profileImageUrl: "",
  youtubeVideoId: "",
  spotifyArtistId: "",
  stats: { spotifyListeners: "", youtubeSubscribers: "", youtubeViews: "", tiktokViews: "", instagramFollowers: "" },
  releases: [],
  timeline: [],
  pressQuotes: [],
  collaborators: [],
  brandPartners: [],
  socialLinks: {},
  bookingEmail: "",
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-[#A0A0A0] uppercase tracking-wider mb-1.5">
      {children} {required && <span className="text-[#C9A227]">*</span>}
    </label>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

// ── Step: Template ────────────────────────────────────────────────────────────
function StepTemplate({ data, onChange }: { data: EPKData; onChange: (d: Partial<EPKData>) => void }) {
  const templates: { id: EPKTemplate; label: string; desc: string; accent: string; icon: string }[] = [
    { id: "main", label: "Main EPK", desc: "Full artist profile for venues, labels, and media.", accent: "#C9A227", icon: "🎤" },
    { id: "booking", label: "Booking Kit", desc: "Technical rider + packages for talent buyers and promoters.", accent: "#C8102E", icon: "🎪" },
    { id: "brand", label: "Brand Kit", desc: "Partnership pitch deck for brand sponsorships and collabs.", accent: "#C9A227", icon: "🤝" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">CHOOSE TEMPLATE</h2>
        <p className="text-sm text-[#A0A0A0]">Pick the one that matches who you're sending this to.</p>
      </div>
      <div className="grid gap-4">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange({ template: t.id })}
            className={cn(
              "relative rounded-xl border p-5 text-left transition-all",
              data.template === t.id
                ? "border-[#C9A227] bg-[#C9A227]/5"
                : "border-[#333] bg-[#0D0D0D] hover:border-[#C9A227]/40"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{t.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display tracking-wider text-[#EDE9E0]">{t.label.toUpperCase()}</span>
                  {data.template === t.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                  )}
                </div>
                <p className="text-sm text-[#A0A0A0] mt-0.5">{t.desc}</p>
              </div>
            </div>
            {data.template === t.id && (
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: t.accent }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step: Basics ──────────────────────────────────────────────────────────────
function StepBasics({ data, onChange }: { data: EPKData; onChange: (d: Partial<EPKData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">ARTIST INFO</h2>
        <p className="text-sm text-[#A0A0A0]">Core identity for your press kit.</p>
      </div>

      <FieldRow>
        <Label required>Artist / Band Name</Label>
        <Input
          placeholder="e.g. Luh Kel"
          value={data.artistName}
          onChange={(e) => onChange({ artistName: e.target.value })}
        />
      </FieldRow>

      <FieldRow>
        <Label>Tagline</Label>
        <Input
          placeholder="e.g. The voice of a generation"
          value={data.artistTagline}
          onChange={(e) => onChange({ artistTagline: e.target.value })}
        />
      </FieldRow>

      <div className="grid grid-cols-2 gap-4">
        <FieldRow>
          <Label>Genre</Label>
          <Input
            placeholder="e.g. R&B / Hip-Hop"
            value={data.genre}
            onChange={(e) => onChange({ genre: e.target.value })}
          />
        </FieldRow>
        <FieldRow>
          <Label>Hometown</Label>
          <Input
            placeholder="e.g. St. Louis, MO"
            value={data.hometown}
            onChange={(e) => onChange({ hometown: e.target.value })}
          />
        </FieldRow>
      </div>

      <FieldRow>
        <Label required>Full Bio</Label>
        <Textarea
          placeholder="Paste your bio here — our AI will polish it into press-ready language..."
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          className="min-h-[140px]"
        />
        <p className="text-xs text-[#555] mt-1">Aim for 150–300 words. Include your origin story, notable achievements, and sound.</p>
      </FieldRow>

      <FieldRow>
        <Label>Short Bio (1–2 sentences)</Label>
        <Textarea
          placeholder="A punchy 1–2 sentence version for quick intros..."
          value={data.shortBio}
          onChange={(e) => onChange({ shortBio: e.target.value })}
          className="min-h-[70px]"
        />
      </FieldRow>

      <FieldRow>
        <Label>Booking Email</Label>
        <Input
          type="email"
          placeholder="booking@yourlabel.com"
          value={data.bookingEmail}
          onChange={(e) => onChange({ bookingEmail: e.target.value })}
        />
      </FieldRow>
    </div>
  );
}

// ── Step: Stats ───────────────────────────────────────────────────────────────
function StepStats({ data, onChange }: { data: EPKData; onChange: (d: Partial<EPKData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">AUDIENCE STATS</h2>
        <p className="text-sm text-[#A0A0A0]">Show your reach. Use human-readable numbers (e.g. "1.5M+").</p>
      </div>

      {[
        { key: "spotifyListeners", label: "Spotify Monthly Listeners", placeholder: "1.5M+" },
        { key: "youtubeSubscribers", label: "YouTube Subscribers", placeholder: "2.5M" },
        { key: "youtubeViews", label: "YouTube Total Views", placeholder: "1B+" },
        { key: "tiktokViews", label: "TikTok Total Views", placeholder: "3B+" },
        { key: "instagramFollowers", label: "Instagram Followers", placeholder: "2.3M" },
      ].map((field) => (
        <FieldRow key={field.key}>
          <Label>{field.label}</Label>
          <Input
            placeholder={field.placeholder}
            value={(data.stats as Record<string, string>)[field.key] || ""}
            onChange={(e) =>
              onChange({ stats: { ...data.stats, [field.key]: e.target.value } })
            }
          />
        </FieldRow>
      ))}
    </div>
  );
}

// ── Step: Music ───────────────────────────────────────────────────────────────
function StepMusic({ data, onChange }: { data: EPKData; onChange: (d: Partial<EPKData>) => void }) {
  const releases = data.releases || [];

  const addRelease = () => {
    onChange({
      releases: [
        ...releases,
        { title: "", type: "Single", year: new Date().getFullYear().toString(), coverUrl: "", streamingUrl: "" },
      ],
    });
  };

  const updateRelease = (i: number, patch: Partial<Release>) => {
    const next = [...releases];
    next[i] = { ...next[i], ...patch };
    onChange({ releases: next });
  };

  const removeRelease = (i: number) => {
    onChange({ releases: releases.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">MUSIC & EMBEDS</h2>
        <p className="text-sm text-[#A0A0A0]">Add your streaming embeds and discography.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldRow>
          <Label>Spotify Artist ID</Label>
          <Input
            placeholder="24CgJHK6T7C5OmUbiLLMjJ"
            value={data.spotifyArtistId}
            onChange={(e) => onChange({ spotifyArtistId: e.target.value })}
          />
          <p className="text-[10px] text-[#555] mt-0.5">Found in your Spotify artist URL</p>
        </FieldRow>
        <FieldRow>
          <Label>Featured YouTube Video ID</Label>
          <Input
            placeholder="fB-If0inWuI"
            value={data.youtubeVideoId}
            onChange={(e) => onChange({ youtubeVideoId: e.target.value })}
          />
          <p className="text-[10px] text-[#555] mt-0.5">The ID at the end of the YouTube URL</p>
        </FieldRow>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Discography</Label>
          <button
            onClick={addRelease}
            className="flex items-center gap-1 text-xs text-[#C9A227] hover:text-[#E8C840] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Release
          </button>
        </div>

        <div className="space-y-3">
          {releases.map((r, i) => (
            <div key={i} className="rounded-lg border border-[#333] bg-[#0D0D0D] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#C9A227] font-medium">Release {i + 1}</span>
                <button onClick={() => removeRelease(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-[#555] hover:text-[#C8102E] transition-colors" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input placeholder="Title" value={r.title} onChange={(e) => updateRelease(i, { title: e.target.value })} />
                </div>
                <select
                  className="h-10 rounded-md border border-border bg-secondary/50 px-2 text-sm text-foreground outline-none"
                  value={r.type}
                  onChange={(e) => updateRelease(i, { type: e.target.value as Release["type"] })}
                >
                  <option>Single</option>
                  <option>Album</option>
                  <option>EP</option>
                  <option>Mixtape</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Year" value={r.year} onChange={(e) => updateRelease(i, { year: e.target.value })} />
                <Input placeholder="Certification (e.g. Platinum)" value={r.certification || ""} onChange={(e) => updateRelease(i, { certification: e.target.value })} />
                <Input placeholder="Tracks" type="number" value={r.tracks || ""} onChange={(e) => updateRelease(i, { tracks: parseInt(e.target.value) || undefined })} />
              </div>
              <Input placeholder="Album art URL (optional)" value={r.coverUrl || ""} onChange={(e) => updateRelease(i, { coverUrl: e.target.value })} />
            </div>
          ))}

          {releases.length === 0 && (
            <div
              onClick={addRelease}
              className="rounded-lg border border-dashed border-[#333] p-6 text-center cursor-pointer hover:border-[#C9A227]/30 transition-colors"
            >
              <Plus className="w-5 h-5 text-[#555] mx-auto mb-1" />
              <p className="text-sm text-[#555]">Add your first release</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step: Story ───────────────────────────────────────────────────────────────
function StepStory({ data, onChange }: { data: EPKData; onChange: (d: Partial<EPKData>) => void }) {
  const timeline = data.timeline || [];
  const collaborators = data.collaborators || [];

  const addTimelineItem = () =>
    onChange({ timeline: [...timeline, { year: "", title: "", description: "" }] });

  const updateTimeline = (i: number, patch: Partial<TimelineEvent>) => {
    const next = [...timeline];
    next[i] = { ...next[i], ...patch };
    onChange({ timeline: next });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">STORY & TIMELINE</h2>
        <p className="text-sm text-[#A0A0A0]">Key milestones and notable collaborations.</p>
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Career Timeline</Label>
          <button
            onClick={addTimelineItem}
            className="flex items-center gap-1 text-xs text-[#C9A227] hover:text-[#E8C840] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </button>
        </div>
        <div className="space-y-3">
          {timeline.map((t, i) => (
            <div key={i} className="rounded-lg border border-[#333] bg-[#0D0D0D] p-4 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Year" value={t.year} onChange={(e) => updateTimeline(i, { year: e.target.value })} />
                <div className="col-span-2">
                  <Input placeholder="Milestone title" value={t.title} onChange={(e) => updateTimeline(i, { title: e.target.value })} />
                </div>
              </div>
              <Textarea
                placeholder="Brief description..."
                value={t.description}
                onChange={(e) => updateTimeline(i, { description: e.target.value })}
                className="min-h-[60px]"
              />
              <button onClick={() => onChange({ timeline: timeline.filter((_, idx) => idx !== i) })} className="text-xs text-[#555] hover:text-[#C8102E] transition-colors">
                Remove
              </button>
            </div>
          ))}
          {timeline.length === 0 && (
            <div onClick={addTimelineItem} className="rounded-lg border border-dashed border-[#333] p-5 text-center cursor-pointer hover:border-[#C9A227]/30 transition-colors">
              <p className="text-sm text-[#555]">Add your first milestone</p>
            </div>
          )}
        </div>
      </div>

      {/* Collaborators */}
      <FieldRow>
        <Label>Notable Collaborators</Label>
        <Textarea
          placeholder="PnB Rock, Queen Naija, Lil Tjay, A Boogie wit da Hoodie..."
          value={(collaborators || []).join(", ")}
          onChange={(e) =>
            onChange({ collaborators: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
          className="min-h-[70px]"
        />
        <p className="text-xs text-[#555] mt-1">Comma-separated list of artists you've worked with</p>
      </FieldRow>

      {/* Brand partners */}
      <FieldRow>
        <Label>Brand Partnerships</Label>
        <Textarea
          placeholder="Nike, Fashion Nova, Reebok, Disney..."
          value={(data.brandPartners || []).join(", ")}
          onChange={(e) =>
            onChange({ brandPartners: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
          className="min-h-[70px]"
        />
        <p className="text-xs text-[#555] mt-1">Brands you've worked with or endorsed</p>
      </FieldRow>
    </div>
  );
}

// ── Step: Social ──────────────────────────────────────────────────────────────
function StepSocial({ data, onChange }: { data: EPKData; onChange: (d: Partial<EPKData>) => void }) {
  const social = data.socialLinks || {};

  const platforms = [
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname" },
    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourname" },
    { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/yourname" },
    { key: "spotify", label: "Spotify Profile", placeholder: "https://open.spotify.com/artist/..." },
    { key: "appleMusic", label: "Apple Music", placeholder: "https://music.apple.com/artist/..." },
    { key: "website", label: "Official Website", placeholder: "https://yourname.com" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">SOCIAL & LINKS</h2>
        <p className="text-sm text-[#A0A0A0]">Add any relevant links. All optional.</p>
      </div>

      {platforms.map((p) => (
        <FieldRow key={p.key}>
          <Label>{p.label}</Label>
          <Input
            placeholder={p.placeholder}
            value={(social as Record<string, string>)[p.key] || ""}
            onChange={(e) =>
              onChange({ socialLinks: { ...social, [p.key]: e.target.value } })
            }
          />
        </FieldRow>
      ))}

      {/* Photos */}
      <FieldRow>
        <Label>Hero / Banner Image URL</Label>
        <Input
          placeholder="https://... (landscape image, 16:9)"
          value={data.heroImageUrl}
          onChange={(e) => onChange({ heroImageUrl: e.target.value })}
        />
      </FieldRow>
      <FieldRow>
        <Label>Profile / Press Photo URL</Label>
        <Input
          placeholder="https://... (portrait or square)"
          value={data.profileImageUrl}
          onChange={(e) => onChange({ profileImageUrl: e.target.value })}
        />
      </FieldRow>
    </div>
  );
}

// ── Step: Preview ─────────────────────────────────────────────────────────────
function StepPreview({ data, onUpdate }: { data: EPKData; onUpdate: (d: Partial<EPKData>) => void }) {
  const [generating, setGenerating] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [streamedBio, setStreamedBio] = useState("");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  const tColor = data.template === "booking" ? "#C8102E" : "#C9A227";

  const handlePublish = async () => {
    setGenerating(true);
    setGeneratingBio(true);
    setStreamedBio("");
    setError("");

    let finalBio = data.bio;

    // Step 1: Stream AI-polished bio
    if (data.bio || data.artistName) {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artistName: data.artistName,
            genre: data.genre,
            hometown: data.hometown,
            rawBio: data.bio,
            stats: data.stats,
            releases: data.releases,
            template: data.template,
          }),
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let bioAcc = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              if (line.startsWith("data: ")) {
                const payload = line.slice(6);
                if (payload === "[DONE]") break;
                try {
                  const parsed = JSON.parse(payload);
                  if (parsed.text) {
                    bioAcc += parsed.text;
                    setStreamedBio(bioAcc);
                  }
                } catch {
                  // partial line, skip
                }
              }
            }
          }
        }

        if (bioAcc) {
          finalBio = bioAcc;
          onUpdate({ bio: bioAcc });
        }
      } catch (e) {
        console.warn("AI generation failed, using original bio:", e);
      }
    }

    setGeneratingBio(false);

    // Step 2: Save EPK to database
    try {
      const epkPayload = { ...data, bio: finalBio };
      const res = await fetch("/api/epk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(epkPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      const { slug } = await res.json();
      setPublishedSlug(slug);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to publish. Please try again.");
    }

    setGenerating(false);
  };

  const isPublished = publishedSlug !== null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-wider text-[#EDE9E0] mb-1">READY TO PUBLISH</h2>
        <p className="text-sm text-[#A0A0A0]">Review your EPK summary and generate your hosted page.</p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-[#333] bg-[#0D0D0D] overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: tColor }} />
        <div className="p-5 space-y-4">
          <div>
            <span className="text-xs text-[#666] uppercase tracking-wider">{data.template.toUpperCase()} EPK</span>
            <h3 className="font-display text-2xl tracking-wider mt-0.5" style={{ color: tColor }}>
              {data.artistName || "—"}
            </h3>
            {data.genre && <p className="text-xs text-[#A0A0A0]">{data.genre} · {data.hometown}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-[#666]">Releases</span>
              <span className="ml-2 text-[#EDE9E0]">{data.releases?.length || 0}</span>
            </div>
            <div>
              <span className="text-[#666]">Timeline events</span>
              <span className="ml-2 text-[#EDE9E0]">{data.timeline?.length || 0}</span>
            </div>
            <div>
              <span className="text-[#666]">Collaborators</span>
              <span className="ml-2 text-[#EDE9E0]">{data.collaborators?.length || 0}</span>
            </div>
            <div>
              <span className="text-[#666]">Social links</span>
              <span className="ml-2 text-[#EDE9E0]">
                {Object.values(data.socialLinks || {}).filter(Boolean).length}
              </span>
            </div>
          </div>

          {(streamedBio || data.bio) && (
            <div className="border-t border-[#222] pt-3">
              {generatingBio && (
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-3 h-3 text-[#C9A227] animate-spin" />
                  <span className="text-xs text-[#C9A227]">AI polishing bio...</span>
                </div>
              )}
              <p className="text-xs text-[#666] leading-relaxed">
                {(streamedBio || data.bio).slice(0, 300)}…
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI note */}
      {!isPublished && (
        <div className="rounded-lg border border-[#C9A227]/20 bg-[#C9A227]/5 p-4 flex gap-3">
          <Sparkles className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="text-[#C9A227] font-medium">AI will enhance your bio</span>
            <p className="text-[#A0A0A0] mt-0.5">
              Your bio will be rewritten in a professional press voice before publishing.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {isPublished ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#C9A227] bg-[#C9A227]/5 p-5 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
            <p className="font-display tracking-wider text-[#EDE9E0]">EPK PUBLISHED!</p>
            <p className="text-xs text-[#A0A0A0] mt-1">artistepks.com/epk/{publishedSlug}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="gold" className="flex-1" asChild>
              <Link href={`/epk/${publishedSlug}`} target="_blank">
                View EPK
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href={`/api/pdf/${publishedSlug}`} download>
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="gold"
          size="lg"
          className="w-full rounded-full tracking-widest uppercase text-sm"
          onClick={handlePublish}
          disabled={!data.artistName || generating}
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {generatingBio ? "Writing your bio…" : "Saving EPK…"}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate & Publish EPK
            </>
          )}
        </Button>
      )}
    </div>
  );
}

// ── Builder shell ─────────────────────────────────────────────────────────────
function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTemplate = (searchParams.get("template") as EPKTemplate) || "main";

  const [step, setStep] = useState(0);
  const [data, setData] = useState<EPKData>({ ...EMPTY, template: initialTemplate });

  const update = (patch: Partial<EPKData>) => setData((prev) => ({ ...prev, ...patch }));

  const stepComponents = [
    <StepTemplate key="template" data={data} onChange={update} />,
    <StepBasics key="basics" data={data} onChange={update} />,
    <StepStats key="stats" data={data} onChange={update} />,
    <StepMusic key="music" data={data} onChange={update} />,
    <StepStory key="story" data={data} onChange={update} />,
    <StepSocial key="social" data={data} onChange={update} />,
    <StepPreview key="preview" data={data} onUpdate={update} />,
  ];

  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[#C9A227]/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center">
            <Music2 className="w-3 h-3 text-[#050505]" />
          </div>
          <span className="font-display text-sm tracking-wider text-[#EDE9E0]">EPK AGENT</span>
        </Link>

        {/* Progress steps */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all whitespace-nowrap",
                  i === step
                    ? "bg-[#C9A227] text-[#050505] font-semibold"
                    : i < step
                    ? "text-[#C9A227] cursor-pointer hover:bg-[#C9A227]/10"
                    : "text-[#555] cursor-not-allowed"
                )}
              >
                {i < step ? <CheckCircle2 className="w-3 h-3" /> : <span>{s.emoji}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn("w-4 h-px", i < step ? "bg-[#C9A227]/40" : "bg-[#333]")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {stepComponents[step]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {!isLast && (
            <div className="flex gap-3 mt-8">
              {!isFirst && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button
                variant="gold"
                onClick={() => setStep((s) => s + 1)}
                className={cn("rounded-full tracking-widest uppercase text-xs", isFirst ? "w-full" : "flex-1")}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mt-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === step ? "w-4 bg-[#C9A227]" : i < step ? "w-2 bg-[#C9A227]/40" : "w-2 bg-[#333]"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-6 h-6 text-[#C9A227] animate-spin" /></div>}>
      <BuilderContent />
    </Suspense>
  );
}
