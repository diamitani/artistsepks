"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, FileText, Target, Briefcase, Clock, CheckCircle2,
  ArrowRight, ArrowLeft, Save, Loader2, Sparkles
} from "lucide-react";
import type { ArtistProfile } from "@/lib/types";

interface Props {
  profile: ArtistProfile;
  onSave: (profile: ArtistProfile) => void;
  onComplete: (profile: ArtistProfile) => void;
}

const PHASES = [
  { id: 0, label: "Contact", icon: User, desc: "Basic contact & team info" },
  { id: 1, label: "Background", icon: FileText, desc: "Your story & brand" },
  { id: 2, label: "Goals", icon: Target, desc: "What you want to achieve" },
  { id: 3, label: "Assets", icon: Briefcase, desc: "What you have in place" },
  { id: 4, label: "Resources", icon: Clock, desc: "Time, budget & team" },
  { id: 5, label: "Review", icon: CheckCircle2, desc: "Review & continue" },
];

const STEP_COLORS = ["#C9A227", "#C8102E", "#C9A227", "#C8102E", "#C9A227", "#27C93F"];

export function IntakeWizard({ profile, onSave, onComplete }: Props) {
  const [phase, setPhase] = useState(profile.intakePhase || 0);
  const [data, setData] = useState<ArtistProfile>(profile);
  const [saving, setSaving] = useState(false);

  const update = (path: string, value: unknown) => {
    setData((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj: Record<string, unknown> = next as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i++) {
        (obj as Record<string, unknown>)[keys[i]] = { ...(obj as Record<string, unknown>)[keys[i]] as Record<string, unknown> };
        obj = (obj as Record<string, unknown>)[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = () => {
    setSaving(true);
    const updated = { ...data, intakePhase: phase, updatedAt: new Date().toISOString() };
    onSave(updated);
    setData(updated);
    setTimeout(() => setSaving(false), 500);
  };

  const handleNext = () => {
    handleSave();
    if (phase < 5) setPhase(phase + 1);
  };

  const handleComplete = () => {
    const updated = { ...data, intakeComplete: true, intakePhase: 5, updatedAt: new Date().toISOString() };
    onSave(updated);
    onComplete(updated);
  };

  const nextDisabled = () => {
    if (phase === 0) return !data.contact.firstName || !data.contact.email;
    if (phase === 1) return !data.background.artistName;
    return false;
  };

  const progress = ((phase + 1) / PHASES.length) * 100;

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#E8C840] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#050505]" />
          </div>
          <div>
            <h2 className="font-display text-sm tracking-wider text-[#EDE9E0]">Artist Intake</h2>
            <p className="text-[10px] text-[#666]">Tell us about yourself so we can build the perfect EPK</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: STEP_COLORS[phase] }}
          />
        </div>

        {/* Phase tabs */}
        <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-hide">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            const active = phase === i;
            const done = phase > i;
            return (
              <button
                key={p.id}
                onClick={() => setPhase(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wider transition-all whitespace-nowrap flex-shrink-0 ${
                  active
                    ? "text-[#050505] font-semibold shadow-md"
                    : done
                    ? "text-[#555] border border-[#2A2A2A]"
                    : "text-[#444]"
                }`}
                style={active ? { background: STEP_COLORS[i] } : done ? { borderColor: STEP_COLORS[i] + "40" } : {}}
              >
                <Icon className="w-3 h-3" />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            {phase === 0 && <ContactForm data={data.contact} update={update} />}
            {phase === 1 && <BackgroundForm data={data.background} update={update} />}
            {phase === 2 && <GoalsForm data={data.goals} update={update} />}
            {phase === 3 && <AssetsForm data={data.assets} update={update} />}
            {phase === 4 && <ResourcesForm data={data.resources} update={update} />}
            {phase === 5 && <ReviewStep data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1E1E1E] px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => setPhase(Math.max(0, phase - 1))}
          disabled={phase === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#888] hover:text-[#EDE9E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#666] hover:text-[#C9A227] transition-colors"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>

        {phase < 5 ? (
          <button
            onClick={handleNext}
            disabled={nextDisabled()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: STEP_COLORS[phase], color: "#050505" }}
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase text-[#050505]"
            style={{ background: "#27C93F" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done — Start EPK
          </button>
        )}
      </div>
    </div>
  );
}

// ── Form sub-components ────────────────────────────────────────────────────────

function Input({ label, value, onChange, placeholder, type = "text", small }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; small?: boolean;
}) {
  return (
    <div className={small ? "" : "mb-3"}>
      <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors"
        />
      )}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
        value ? "text-[#050505] font-medium" : "text-[#888] border border-[#2A2A2A]"
      }`}
      style={value ? { background: "#C9A227" } : {}}
    >
      {value ? "✓" : ""} {label}
    </button>
  );
}

function TagInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="mb-3">
      <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-[10px] border border-[#C9A227]/20">
            {t}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-red-400">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              onChange([...tags, input.trim()]);
              setInput("");
            }
          }}
          placeholder="Type and press Enter..."
          className="flex-1 bg-[#141414] border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 text-xs text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors"
        />
        <button
          onClick={() => { if (input.trim()) { onChange([...tags, input.trim()]); setInput(""); } }}
          className="px-2.5 py-1.5 rounded-lg bg-[#2A2A2A] text-xs text-[#888] hover:text-[#EDE9E0] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ContactForm({ data, update }: { data: ArtistProfile["contact"]; update: (p: string, v: unknown) => void }) {
  return (
    <div>
      <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1">Contact & Team</h3>
      <p className="text-xs text-[#666] mb-4">Basic info so we know who you are and who represents you.</p>
      <div className="grid grid-cols-2 gap-x-3">
        <Input label="First Name" value={data.firstName} onChange={(v) => update("contact.firstName", v)} placeholder="John" />
        <Input label="Last Name" value={data.lastName} onChange={(v) => update("contact.lastName", v)} placeholder="Doe" />
        <Input label="Email" value={data.email} onChange={(v) => update("contact.email", v)} placeholder="john@example.com" type="email" />
        <Input label="Phone" value={data.phone} onChange={(v) => update("contact.phone", v)} placeholder="+1 (555) 123-4567" type="tel" />
      </div>
      <Input label="Website" value={data.website} onChange={(v) => update("contact.website", v)} placeholder="https://yourwebsite.com" />
      <div className="border-t border-[#1E1E1E] my-4 pt-4">
        <h4 className="text-xs text-[#888] uppercase tracking-wider mb-2">Team</h4>
        <div className="grid grid-cols-2 gap-x-3">
          <Input label="Manager Name" value={data.managerName} onChange={(v) => update("contact.managerName", v)} placeholder="Manager name" small />
          <Input label="Manager Contact" value={data.managerContact} onChange={(v) => update("contact.managerContact", v)} placeholder="Email or phone" small />
          <Input label="Label" value={data.label} onChange={(v) => update("contact.label", v)} placeholder="Label name" small />
          <Input label="Label Contact" value={data.labelContact} onChange={(v) => update("contact.labelContact", v)} placeholder="Email or phone" small />
        </div>
      </div>
    </div>
  );
}

function BackgroundForm({ data, update }: { data: ArtistProfile["background"]; update: (p: string, v: unknown) => void }) {
  return (
    <div>
      <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1">Background & Bio</h3>
      <p className="text-xs text-[#666] mb-4">Tell us your story, style, and influences.</p>
      <div className="grid grid-cols-2 gap-x-3">
        <Input label="Artist/Band Name" value={data.artistName} onChange={(v) => update("background.artistName", v)} placeholder="Your artist name" />
        <Input label="Stage Name (if different)" value={data.stageName} onChange={(v) => update("background.stageName", v)} placeholder="Stage name" small />
        <Input label="Current Location" value={data.location} onChange={(v) => update("background.location", v)} placeholder="City, State" />
        <Input label="Hometown" value={data.hometown} onChange={(v) => update("background.hometown", v)} placeholder="Where you're from" />
        <Input label="Years in the Business" value={String(data.yearsInBusiness || "")} onChange={(v) => update("background.yearsInBusiness", Number(v) || 0)} placeholder="0" type="number" small />
        <div className="flex items-end mb-3">
          <Toggle label="I'm a professional musician" value={data.isProfessional} onChange={(v) => update("background.isProfessional", v)} />
        </div>
      </div>
      <Input label="Genre" value={data.genre} onChange={(v) => update("background.genre", v)} placeholder="e.g. R&B, Hip-Hop, Indie Rock" />
      <Input label="Style Description" value={data.style} onChange={(v) => update("background.style", v)} placeholder="Describe your sound/style" type="textarea" />
      <Input label="Energy / Vibe" value={data.energy} onChange={(v) => update("background.energy", v)} placeholder="e.g. High-energy, Laid-back, Dark, Uplifting" />
      <TagInput label="Themes (what your music is about)" tags={data.themes} onChange={(v) => update("background.themes", v)} />
      <TagInput label="Influences" tags={data.influences} onChange={(v) => update("background.influences", v)} />
      <Input label="Bio (we'll enhance this)" value={data.bio} onChange={(v) => update("background.bio", v)} placeholder="Tell us about yourself, your journey, and what makes your music unique..." type="textarea" />
    </div>
  );
}

function GoalsForm({ data, update }: { data: ArtistProfile["goals"]; update: (p: string, v: unknown) => void }) {
  return (
    <div>
      <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1">Goals & Aspirations</h3>
      <p className="text-xs text-[#666] mb-4">What do you want to achieve with your music?</p>
      <Input label="Primary Goal" value={data.primaryGoal} onChange={(v) => update("goals.primaryGoal", v)} placeholder="e.g. Build a sustainable music career, Go viral, Get signed" />
      <div className="grid grid-cols-2 gap-x-3">
        <Input label="Performance Goal" value={data.performanceFrequency} onChange={(v) => update("goals.performanceFrequency", v)} placeholder="e.g. A few shows a month, Tour full-time" small />
        <Input label="Streaming Target" value={data.streamingTarget} onChange={(v) => update("goals.streamingTarget", v)} placeholder="e.g. 10,000 monthly listeners" small />
        <Input label="Revenue Target" value={data.revenueTarget} onChange={(v) => update("goals.revenueTarget", v)} placeholder="e.g. $5,000/month" small />
        <Input label="Timeline" value={data.timeline} onChange={(v) => update("goals.timeline", v)} placeholder="e.g. 6 months, 1 year, 5 years" small />
      </div>
      <div className="border-t border-[#1E1E1E] my-4 pt-4">
        <h4 className="text-xs text-[#888] uppercase tracking-wider mb-2">Interests</h4>
        <div className="flex flex-wrap gap-2">
          <Toggle label="Distribution" value={data.wantsDistribution} onChange={(v) => update("goals.wantsDistribution", v)} />
          <Toggle label="Sync Licensing" value={data.wantsSyncLicensing} onChange={(v) => update("goals.wantsSyncLicensing", v)} />
          <Toggle label="Brand Partnerships" value={data.wantsBrandPartnerships} onChange={(v) => update("goals.wantsBrandPartnerships", v)} />
          <Toggle label="Influencer Work" value={data.wantsInfluencerWork} onChange={(v) => update("goals.wantsInfluencerWork", v)} />
        </div>
      </div>
      <TagInput label="SMART Goals (specific, measurable targets)" tags={data.smartGoals} onChange={(v) => update("goals.smartGoals", v)} />
    </div>
  );
}

function AssetsForm({ data, update }: { data: ArtistProfile["assets"]; update: (p: string, v: unknown) => void }) {
  return (
    <div>
      <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1">Current Assets</h3>
      <p className="text-xs text-[#666] mb-4">What do you already have in place?</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Toggle label="Registered with a PRO" value={data.hasPro} onChange={(v) => update("assets.hasPro", v)} />
        <Toggle label="Copyrights registered" value={data.hasCopyrights} onChange={(v) => update("assets.hasCopyrights", v)} />
        <Toggle label="Split sheets created" value={data.hasSplitSheets} onChange={(v) => update("assets.hasSplitSheets", v)} />
        <Toggle label="Contracts in place" value={data.hasContracts} onChange={(v) => update("assets.hasContracts", v)} />
        <Toggle label="EIN obtained" value={data.hasEin} onChange={(v) => update("assets.hasEin", v)} />
        <Toggle label="Business bank account" value={data.hasBankAccount} onChange={(v) => update("assets.hasBankAccount", v)} />
      </div>
      {data.hasPro && (
        <Input label="PRO Organization" value={data.proOrganization} onChange={(v) => update("assets.proOrganization", v)} placeholder="ASCAP / BMI / SESAC" />
      )}
      {data.hasCopyrights && (
        <Input label="Copyright Details" value={data.copyrightDetails} onChange={(v) => update("assets.copyrightDetails", v)} placeholder="What's registered?" type="textarea" small />
      )}
      <div className="border-t border-[#1E1E1E] my-4 pt-4">
        <h4 className="text-xs text-[#888] uppercase tracking-wider mb-2">DSPs You're On</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {["Spotify", "Apple Music", "Tidal", "Amazon Music", "YouTube Music", "SoundCloud", "Bandcamp"].map((dsp) => (
            <Toggle key={dsp} label={dsp} value={data.dsps.includes(dsp)} onChange={(v) => {
              if (v) update("assets.dsps", [...data.dsps, dsp]);
              else update("assets.dsps", data.dsps.filter((d) => d !== dsp));
            }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <div>
          <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-1">Business Entity</label>
          <select
            value={data.businessEntity}
            onChange={(e) => update("assets.businessEntity", e.target.value)}
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#EDE9E0] outline-none focus:border-[#C9A227]/40 transition-colors"
          >
            <option value="none">None / Sole Proprietor</option>
            <option value="llc">LLC</option>
            <option value="corp">Corporation</option>
            <option value="nonprofit">Non-Profit</option>
          </select>
        </div>
        <Input label="Studio Access" value={data.studioAccess} onChange={(v) => update("assets.studioAccess", v)} placeholder="Home studio, rental, etc." small />
      </div>
      <TagInput label="What do you need help with?" tags={data.needsHelp} onChange={(v) => update("assets.needsHelp", v)} />
    </div>
  );
}

function ResourcesForm({ data, update }: { data: ArtistProfile["resources"]; update: (p: string, v: unknown) => void }) {
  return (
    <div>
      <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1">Resources & Availability</h3>
      <p className="text-xs text-[#666] mb-4">Your capacity to invest in your career.</p>
      <div className="grid grid-cols-2 gap-x-3">
        <Input label="Investment Budget" value={data.investmentBudget} onChange={(v) => update("resources.investmentBudget", v)} placeholder="e.g. $500/month, $5,000 upfront" />
        <div>
          <label className="text-[10px] text-[#888] uppercase tracking-wider font-medium block mb-1">Time Commitment</label>
          <select
            value={data.timeCommitment}
            onChange={(e) => update("resources.timeCommitment", e.target.value)}
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#EDE9E0] outline-none focus:border-[#C9A227]/40 transition-colors"
          >
            <option value="">Select...</option>
            <option value="full-time">Full-Time (30+ hrs/week)</option>
            <option value="part-time">Part-Time (10-30 hrs/week)</option>
            <option value="weekend">Weekends / Evenings</option>
            <option value="limited">Limited (a few hrs/month)</option>
          </select>
        </div>
      </div>
      <Input label="Availability Details" value={data.availability} onChange={(v) => update("resources.availability", v)} placeholder="When you're available for shows, studio, meetings..." type="textarea" />
      <TagInput label="Team Members (producers, engineers, etc.)" tags={data.teamMembers} onChange={(v) => update("resources.teamMembers", v)} />
    </div>
  );
}

function ReviewStep({ data }: { data: ArtistProfile }) {
  const bg = data.background;
  const ct = data.contact;
  return (
    <div>
      <h3 className="font-display text-lg tracking-wider text-[#EDE9E0] mb-1">Review</h3>
      <p className="text-xs text-[#666] mb-4">Here's a summary of everything we've collected. Ready to build your EPK?</p>

      <div className="space-y-3">
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4">
          <div className="text-[10px] text-[#C9A227] uppercase tracking-wider font-medium mb-2">Artist</div>
          <div className="text-lg font-display tracking-wider text-[#EDE9E0]">{bg.artistName || "—"}</div>
          {bg.genre && <div className="text-xs text-[#888]">{bg.genre} · {bg.location || "Location TBD"}</div>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4">
            <div className="text-[10px] text-[#888] uppercase tracking-wider font-medium mb-2">Contact</div>
            <div className="text-xs text-[#EDE9E0]">{ct.firstName} {ct.lastName}</div>
            <div className="text-[10px] text-[#666]">{ct.email}{ct.phone ? ` · ${ct.phone}` : ""}</div>
          </div>
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4">
            <div className="text-[10px] text-[#888] uppercase tracking-wider font-medium mb-2">Career</div>
            <div className="text-xs text-[#EDE9E0]">{bg.yearsInBusiness ? `${bg.yearsInBusiness} years` : "New"} · {bg.isProfessional ? "Professional" : "Developing"}</div>
            <div className="text-[10px] text-[#666]">{bg.influences.length ? `Inspired by ${bg.influences.slice(0, 3).join(", ")}` : ""}</div>
          </div>
        </div>

        {data.goals.primaryGoal && (
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4">
            <div className="text-[10px] text-[#888] uppercase tracking-wider font-medium mb-2">Primary Goal</div>
            <div className="text-sm text-[#EDE9E0]">{data.goals.primaryGoal}</div>
            {data.goals.timeline && <div className="text-[10px] text-[#666] mt-1">Timeline: {data.goals.timeline}</div>}
          </div>
        )}

        {data.assets.needsHelp.length > 0 && (
          <div className="bg-[#C8102E]/10 border border-[#C8102E]/20 rounded-xl p-4">
            <div className="text-[10px] text-[#C8102E] uppercase tracking-wider font-medium mb-2">Needs Help With</div>
            <div className="flex flex-wrap gap-1">
              {data.assets.needsHelp.map((h, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8102E]/10 text-[#C8102E] border border-[#C8102E]/20">{h}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
