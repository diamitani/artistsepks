"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import {
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Building2,
  Briefcase,
  Radio,
  Newspaper,
  ListMusic,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { CampaignSubmission } from "@/lib/types";

const INITIAL_CAMPAIGNS: CampaignSubmission[] = [
  {
    id: "camp-1",
    title: "Fall 2024 West Coast Tour Booking Pitch",
    targetName: "The Troubadour (West Hollywood)",
    targetCategory: "Venue",
    contactEmail: "talent@troubadour.com",
    status: "Booked",
    epkSlug: "luna-sol",
    sentAt: "2024-09-12",
    updatedAt: "2024-09-18",
    pitchSubject: "Talent Submission: Luna Sol (13.4M+ Streams / Tour Hold)",
    pitchBody: "Sent tour routing and 500-cap club draw history with live reel.",
    notes: "Hold confirmed for Oct 18th. Rider advanced with stage production team.",
  },
  {
    id: "camp-2",
    title: "Sennheiser Creator Artist Sponsorship Pitch",
    targetName: "Sennheiser Audio Partnerships",
    targetCategory: "Brand",
    contactEmail: "partnerships@sennheiser.com",
    status: "In Review",
    epkSlug: "luna-sol",
    sentAt: "2024-09-14",
    updatedAt: "2024-09-17",
    pitchSubject: "Brand Partnership EPK: Luna Sol (EW-DX Vocal Endorsement)",
    pitchBody: "Submitted Brand EPK with demographic reach and tour video assets.",
    notes: "Introductory call requested for Thursday.",
  },
  {
    id: "camp-3",
    title: "Fresh Indie Horizons Spotify Placement",
    targetName: "Fresh Indie Horizons Playlist",
    targetCategory: "Playlist",
    contactEmail: "curator@freshindiehorizons.com",
    status: "Booked",
    epkSlug: "luna-sol",
    sentAt: "2024-09-10",
    updatedAt: "2024-09-16",
    pitchSubject: "Track Pitch: 'Midnight Horizon' by Luna Sol (Release 09/20)",
    pitchBody: "One-Sheet EPK with streaming preview and WAV download.",
    notes: "Placed in Slot #3 with 240k active listener reach.",
  },
  {
    id: "camp-4",
    title: "KCRW Morning Becomes Eclectic Radio Feature",
    targetName: "KCRW 89.9 FM Santa Monica",
    targetCategory: "Radio",
    contactEmail: "music@kcrw.org",
    status: "Sent",
    epkSlug: "luna-sol",
    sentAt: "2024-09-16",
    updatedAt: "2024-09-16",
    pitchSubject: "Radio Service: Luna Sol - 'Midnight Horizon' (Clean Master)",
    pitchBody: "Sent broadcast WAV, FCC clean radio edit, and EPK one-sheet.",
    notes: "Awaiting music director review.",
  },
  {
    id: "camp-5",
    title: "Earmilk Single Premiere & Interview Feature",
    targetName: "Earmilk Music Journal",
    targetCategory: "Blog",
    contactEmail: "editor@earmilk.com",
    status: "Opened",
    epkSlug: "luna-sol",
    sentAt: "2024-09-15",
    updatedAt: "2024-09-17",
    pitchSubject: "Exclusive Track Premiere & EPK: Luna Sol",
    pitchBody: "Exclusive 48-hour premiere window offered for next single release.",
    notes: "EPK link opened 3 times from New York IP.",
  },
];

const STATUS_COLORS: Record<CampaignSubmission["status"], { bg: string; text: string; border: string }> = {
  Draft: { bg: "bg-[#222]/30", text: "text-[#888]", border: "border-[#333]" },
  Sent: { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", border: "border-[#3B82F6]/30" },
  Opened: { bg: "bg-[#A855F7]/10", text: "text-[#A855F7]", border: "border-[#A855F7]/30" },
  "In Review": { bg: "bg-[#C9A227]/10", text: "text-[#C9A227]", border: "border-[#C9A227]/30" },
  Booked: { bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", border: "border-[#22C55E]/30" },
  Declined: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", border: "border-[#EF4444]/30" },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSubmission[]>(INITIAL_CAMPAIGNS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewModal, setShowNewModal] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    targetName: "",
    targetCategory: "Venue" as CampaignSubmission["targetCategory"],
    contactEmail: "",
    pitchSubject: "",
    pitchBody: "",
  });

  const filtered = campaigns.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.targetName || !newCampaign.contactEmail) return;

    const created: CampaignSubmission = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title || `Outreach to ${newCampaign.targetName}`,
      targetName: newCampaign.targetName,
      targetCategory: newCampaign.targetCategory,
      contactEmail: newCampaign.contactEmail,
      status: "Sent",
      epkSlug: "luna-sol",
      sentAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      pitchSubject: newCampaign.pitchSubject || `Talent Submission: Luna Sol`,
      pitchBody: newCampaign.pitchBody,
      notes: "Newly launched outreach submission.",
    };

    setCampaigns((prev) => [created, ...prev]);
    setShowNewModal(false);
    setNewCampaign({
      title: "",
      targetName: "",
      targetCategory: "Venue",
      contactEmail: "",
      pitchSubject: "",
      pitchBody: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-[#EDE9E0]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-[#EDE9E0] font-display">
              CAMPAIGNS & OUTREACH CRM
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              Submit your EPK to festival talent buyers, brands, labels, blogs, radio, and playlists with pipeline tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/directory"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#181818] border border-[#333] hover:border-[#555] text-white transition-colors"
            >
              Browse Directory
            </Link>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C9A227] text-black hover:bg-[#E8C840] transition-colors shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              New Pitch Campaign
            </button>
          </div>
        </div>

        {/* Pipeline Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Pitches Sent", value: campaigns.length.toString(), icon: Send },
            { label: "Pitches Opened", value: campaigns.filter((c) => ["Opened", "In Review", "Booked"].includes(c.status)).length.toString(), icon: Eye },
            { label: "In Active Review", value: campaigns.filter((c) => c.status === "In Review").length.toString(), icon: Clock },
            { label: "Booked / Placed", value: campaigns.filter((c) => c.status === "Booked").length.toString(), icon: CheckCircle2 },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
              <div className="flex items-center gap-2 text-xs text-[#888] font-mono mb-2">
                <stat.icon className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="uppercase">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-[#EDE9E0] font-mono">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {["all", "Draft", "Sent", "Opened", "In Review", "Booked", "Declined"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase font-semibold whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? "bg-[#C9A227] text-black shadow"
                  : "bg-[#111] text-[#777] border border-[#222] hover:text-white"
              }`}
            >
              {st === "all" ? "All Stages" : st}
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="rounded-2xl bg-[#0d0d0d] border border-[#222] overflow-hidden shadow-xl">
          <div className="divide-y divide-[#181818]">
            {filtered.map((item) => {
              const statusCfg = STATUS_COLORS[item.status];
              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#121212] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181818] text-[#888] border border-[#262626]">
                        {item.targetCategory}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] text-[#666] font-mono">
                        Sent {item.sentAt} · Updated {item.updatedAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#EDE9E0]">{item.title}</h3>
                    <p className="text-xs text-[#C9A227] font-mono mt-0.5">{item.targetName} ({item.contactEmail})</p>
                    
                    {item.notes && (
                      <p className="text-xs text-[#888] mt-2 italic leading-relaxed">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/epk/${item.epkSlug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#282828] text-xs text-[#AAA] hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View EPK
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#111] border border-[#333] p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1">Create Outreach Pitch</h3>
              <p className="text-xs text-[#888] mb-4">Send and track an EPK submission.</p>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Austin City Limits Festival Submission"
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-[#888] block mb-1">Target Category</label>
                    <select
                      value={newCampaign.targetCategory}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, targetCategory: e.target.value as any }))}
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Venue">Venue / Festival</option>
                      <option value="Brand">Brand / Sponsor</option>
                      <option value="Label">Record Label</option>
                      <option value="Blog">Music Blog</option>
                      <option value="Radio">Radio Station</option>
                      <option value="Playlist">Playlist Curator</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[#888] block mb-1">Target Org Name</label>
                    <input
                      type="text"
                      value={newCampaign.targetName}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, targetName: e.target.value }))}
                      placeholder="e.g. Red Rocks Amphitheatre"
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newCampaign.contactEmail}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="booking@target.com"
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#888] block mb-1">Pitch Subject</label>
                  <input
                    type="text"
                    value={newCampaign.pitchSubject}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, pitchSubject: e.target.value }))}
                    placeholder="Talent Submission: Luna Sol (13M+ Streams)"
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C9A227] text-black font-bold text-xs hover:bg-[#E8C840] transition-colors"
                  >
                    Launch Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
