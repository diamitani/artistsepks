"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import {
  Compass,
  Building2,
  Briefcase,
  Radio,
  Newspaper,
  ListMusic,
  Users,
  Search,
  CheckCircle2,
  Send,
  ExternalLink,
  Mail,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import type { DirectoryListing } from "@/lib/types";

const INITIAL_DIRECTORY: DirectoryListing[] = [
  // Venues
  {
    id: "dir-v1",
    category: "venues",
    name: "The Troubadour",
    subtitle: "Historic 500-Cap Music Hall",
    location: "West Hollywood, CA",
    genreFocus: ["Indie Rock", "Alternative Pop", "Singer-Songwriter", "Folk"],
    contactEmail: "talent@troubadour.com",
    website: "https://troubadour.com",
    capacityOrReach: "500 Cap",
    verified: true,
    description: "Legendary live venue booking breakout national tours, album release showcases, and premier residency runs.",
    submissionGuidelines: "Send live performance reel, Spotify streaming links, and confirmed tour routing 6-8 weeks in advance.",
    acceptingSubmissions: true,
  },
  {
    id: "dir-v2",
    category: "venues",
    name: "Bowery Ballroom",
    subtitle: "Premier NYC Showcase Venue",
    location: "New York, NY",
    genreFocus: ["Indie Pop", "Electronic", "Alternative", "Hip-Hop"],
    contactEmail: "booking@bowerypresents.com",
    website: "https://boweryballroom.com",
    capacityOrReach: "575 Cap",
    verified: true,
    description: "Top-tier acoustic sound system with world-class production, consistently voted best club venue in North America.",
    submissionGuidelines: "Submit EPK with recent Northeast draw history and press coverage.",
    acceptingSubmissions: true,
  },
  // Brands
  {
    id: "dir-b1",
    category: "brands",
    name: "Sennheiser Creator Audio",
    subtitle: "Global Audio Hardware Sponsor",
    location: "Wedemark, Germany / Global",
    genreFocus: ["All Genres", "Electronic", "Vocalist", "Live Touring"],
    contactEmail: "partnerships@sennheiser.com",
    website: "https://sennheiser.com",
    capacityOrReach: "$10K-$50K Endorsements",
    verified: true,
    description: "Providing microphone sponsorships, wireless in-ear monitoring systems, and studio gear to rising talent.",
    submissionGuidelines: "Requires min 25k+ followers, active tour dates, and high-res video content.",
    acceptingSubmissions: true,
  },
  // Radio
  {
    id: "dir-r1",
    category: "radio",
    name: "KCRW 89.9 FM (Morning Becomes Eclectic)",
    subtitle: "Tastemaker Public Radio",
    location: "Santa Monica, CA",
    genreFocus: ["Indie Pop", "Global Sounds", "Electronic", "Soul"],
    contactEmail: "music@kcrw.org",
    website: "https://kcrw.com",
    capacityOrReach: "1.2M Weekly Listeners",
    verified: true,
    description: "Premier tastemaker radio station broadcasting groundbreaking independent music globally.",
    submissionGuidelines: "WAV downloads + short bio + one-sheet EPK required.",
    acceptingSubmissions: true,
  },
  // Blogs
  {
    id: "dir-bl1",
    category: "blogs",
    name: "Earmilk Music Journal",
    subtitle: "Contemporary Music Discovery Blog",
    location: "New York / Global",
    genreFocus: ["Electronic", "Hip-Hop", "Indie Pop", "R&B"],
    contactEmail: "editor@earmilk.com",
    website: "https://earmilk.com",
    capacityOrReach: "650K Monthly Readers",
    verified: true,
    description: "Curated daily features, track premieres, album reviews, and interview spotlight articles.",
    submissionGuidelines: "Accepting single premiere submissions 2-3 weeks ahead of release date.",
    acceptingSubmissions: true,
  },
  // Playlists
  {
    id: "dir-p1",
    category: "playlists",
    name: "Fresh Indie Horizons (Spotify Curated)",
    subtitle: "Independent Tastemaker Playlist",
    location: "Global",
    genreFocus: ["Indie Pop", "Bedroom Pop", "Dream Pop", "Synthwave"],
    contactEmail: "curator@freshindiehorizons.com",
    website: "https://spotify.com",
    capacityOrReach: "240K Followers",
    verified: true,
    description: "Weekly refreshed independent playlist with 240,000+ active streaming listeners.",
    submissionGuidelines: "Direct track pitch via EPK with release date and 30-sec hook timestamp.",
    acceptingSubmissions: true,
  },
  // Artists
  {
    id: "dir-a1",
    category: "artists",
    name: "Aura V",
    subtitle: "Electronic Pop Vocalist & Composer",
    location: "Berlin / London",
    genreFocus: ["Synth Pop", "Darkwave", "Electronic"],
    contactEmail: "mgmt@auravmusic.com",
    website: "https://artistsepks.com/epk/aura-v",
    capacityOrReach: "280K Listeners",
    verified: true,
    description: "Collaborative vocalist and synth programmer seeking co-writers and US tour support slots.",
    submissionGuidelines: "Open to feature verses, production collaborations, and split tour dates.",
    acceptingSubmissions: true,
  },
];

export default function DirectoryPage() {
  const [activeCategory, setActiveCategory] = useState<DirectoryListing["category"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pitchModalItem, setPitchModalItem] = useState<DirectoryListing | null>(null);
  const [pitchSent, setPitchSent] = useState(false);

  const filtered = INITIAL_DIRECTORY.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genreFocus.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSendPitch = (e: React.FormEvent) => {
    e.preventDefault();
    setPitchSent(true);
    setTimeout(() => {
      setPitchSent(false);
      setPitchModalItem(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-[#EDE9E0]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-[#EDE9E0] font-display">
              INDUSTRY DIRECTORY & ARTIST NETWORK
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              Connect with verified talent bookers, brand partners, radio directors, music blogs, curators, and fellow artists.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, genre, capacity..."
              className="w-full bg-[#111] border border-[#262626] focus:border-[#C9A227] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Contacts", icon: Compass },
              { id: "venues", label: "Venues & Festivals", icon: Building2 },
              { id: "brands", label: "Brands & Sponsors", icon: Briefcase },
              { id: "radio", label: "Radio Stations", icon: Radio },
              { id: "blogs", label: "Music Blogs & Press", icon: Newspaper },
              { id: "playlists", label: "Playlists & DSPs", icon: ListMusic },
              { id: "artists", label: "Browse Artists", icon: Users },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#C9A227] text-black font-bold shadow"
                      : "bg-[#111] text-[#888] border border-[#222] hover:text-white"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0c0c0c] border border-[#222] hover:border-[#333] p-5 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-wider font-semibold">
                      {item.category.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-[#EDE9E0] group-hover:text-[#C9A227] transition-colors mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#888]">{item.subtitle}</p>
                  </div>
                  {item.verified && (
                    <span className="p-1 rounded-full bg-[#22C55E]/10 text-[#22C55E]" title="Verified Partner">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#777] font-mono mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#555]" /> {item.location}
                  </span>
                  <span>·</span>
                  <span>{item.capacityOrReach}</span>
                </div>

                <p className="text-xs text-[#AAA] leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.genreFocus.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#161616] text-[#888] border border-[#262626]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between gap-2">
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-[#777] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors"
                    title="Visit Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => setPitchModalItem(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#C9A227] text-black font-bold text-xs hover:bg-[#E8C840] transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  Pitch EPK
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pitch EPK Modal */}
        {pitchModalItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#111] border border-[#333] p-6 shadow-2xl relative">
              <button
                onClick={() => setPitchModalItem(null)}
                className="absolute top-4 right-4 text-[#777] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-mono text-[#C9A227] uppercase">PITCH SUBMISSION</span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Submit EPK to {pitchModalItem.name}
                </h3>
                <p className="text-xs text-[#888]">{pitchModalItem.contactEmail}</p>
              </div>

              {pitchSent ? (
                <div className="py-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-white">EPK Pitch Submitted!</h4>
                  <p className="text-xs text-[#888]">Track status in your Campaigns CRM.</p>
                </div>
              ) : (
                <form onSubmit={handleSendPitch} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-[#888] block mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      defaultValue={`Talent Submission / EPK: Luna Sol (13M+ Streams)`}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[#888] block mb-1">
                      Attached EPK Link
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`https://artistsepks.com/epk/luna-sol`}
                      className="w-full bg-[#141414] border border-[#2a2a2a] text-[#C9A227] font-mono rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[#888] block mb-1">
                      Custom Pitch Note
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={`Hi ${pitchModalItem.name} team,\n\nI wanted to share Luna Sol's official verified EPK for upcoming booking/programming consideration. Full discography, 300DPI press photos, and technical riders are attached.\n\nBest regards,\nAtlas Management`}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl p-3 text-xs text-white outline-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPitchModalItem(null)}
                      className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#C9A227] text-black font-bold text-xs hover:bg-[#E8C840] transition-colors"
                    >
                      Send Submission
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
