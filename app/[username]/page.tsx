import { Metadata } from "next";
import Link from "next/link";
import { Music2, MapPin, Star, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

interface PublicProfile {
  username: string;
  displayName: string;
  tagline?: string;
  genre?: string;
  location?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  socialLinks?: Array<{ platform: string; url: string; followers?: string }>;
  venues?: Array<{ id: string; name: string; city: string; verified: boolean }>;
  stats?: Record<string, string>;
  bookingEmail?: string;
  website?: string;
  hasEpk?: boolean;
  epkSlug?: string;
  engagementScore?: { overall: number; label: string };
  socialDashboard?: any;
}

function sanitizeUsername(input: string): boolean {
  return /^[a-zA-Z0-9-]{3,30}$/.test(input);
}

function platformIcon(p: string) {
  if (p === "instagram") return "📸"; if (p === "youtube") return "🎬";
  if (p === "spotify") return "🎵"; if (p === "tiktok") return "🎶";
  if (p === "twitter" || p === "x") return "🐦";
  if (p === "soundcloud") return "☁️"; if (p === "bandcamp") return "💿";
  if (p === "apple-music") return "🍎"; if (p === "facebook") return "👤";
  return "🔗";
}

function formatStat(val: string | number | undefined): string {
  if (!val) return "";
  const n = typeof val === "string" ? parseInt(val.replace(/[^0-9]/g, "")) || 0 : val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

async function getProfile(username: string): Promise<PublicProfile | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && sanitizeUsername(username)) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/profiles?profile_data->>username=eq.${encodeURIComponent(username)}&select=profile_data`,
        {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          next: { revalidate: 30 },
        }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows?.[0]?.profile_data) {
          const pd = rows[0].profile_data;
          const bg = pd.background || {};
          const ct = pd.contact || {};
          const dash = pd.socialDashboard;
          return {
            username: pd.username || username,
            displayName: bg.artistName || `${ct.firstName || ""} ${ct.lastName || ""}`.trim() || username,
            tagline: bg.style || pd.epkData?.artistTagline,
            genre: bg.genre || pd.epkData?.genre,
            location: bg.location || pd.epkData?.hometown,
            avatarUrl: pd.avatarUrl || pd.epkData?.profileImageUrl,
            coverUrl: pd.coverUrl || pd.epkData?.heroImageUrl,
            bio: bg.bio || pd.epkData?.shortBio || pd.epkData?.bio,
            socialLinks: pd.socialLinks || [],
            venues: pd.venues || [],
            website: pd.website || ct.website,
            bookingEmail: pd.bookingEmail || ct.email || pd.epkData?.bookingEmail,
            hasEpk: !!pd.epkData?.artistName,
            epkSlug: pd.epkSlug,
            engagementScore: dash?.engagementScore,
            socialDashboard: dash,
          };
        }
      }
    } catch {}
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  if (!sanitizeUsername(username)) return { title: "Artist Not Found" };
  const profile = await getProfile(username);
  if (!profile) return { title: "Artist Not Found" };
  return {
    title: `${profile.displayName} — Artist Profile`,
    description: profile.bio?.slice(0, 160) || `${profile.displayName} on ArtistEPKs`,
    openGraph: {
      title: `${profile.displayName} — Artist Profile`,
      description: profile.bio?.slice(0, 160),
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  if (!sanitizeUsername(username)) return <NotFound />;
  const profile = await getProfile(username);
  if (!profile) return <NotFound />;

  const socialLinks = profile.socialLinks || [];
  const venues = profile.venues || [];
  const dash = profile.socialDashboard;
  const isLive = !!profile.displayName;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Cover with animated gradient */}
      <div className="relative h-52 md:h-72 overflow-hidden bg-[#0A0A0A]"
        style={profile.coverUrl ? {
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : {}}>
        {!profile.coverUrl && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/10 via-[#050505] to-[#C9A227]/5" />
            <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#C9A227]/5 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#C9A227]/3 blur-[80px]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Profile header */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 md:-mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5 md:gap-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 border-[#050505] overflow-hidden bg-[#1A1A1A] flex-shrink-0 shadow-2xl">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5">
                <Music2 className="w-10 h-10 md:w-14 md:h-14 text-[#C9A227]/30" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <h1 className="font-display text-3xl md:text-5xl tracking-wider text-[#EDE9E0] leading-tight">
              {profile.displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              <span className="text-[#666]">@{profile.username}</span>
              {profile.genre && <><span className="text-[#444]">·</span><span className="text-[#C9A227] font-medium">{profile.genre}</span></>}
              {profile.location && <><span className="text-[#444]">·</span><span className="text-[#888]">{profile.location}</span></>}
            </div>
            {profile.tagline && (
              <p className="text-sm text-[#A0A0A0] mt-2 leading-relaxed max-w-xl">{profile.tagline}</p>
            )}
          </div>

          <div className="flex gap-2 pb-2 w-full md:w-auto">
            {profile.bookingEmail && (
              <a href={`mailto:${profile.bookingEmail}`}
                className="flex-1 md:flex-none text-center px-6 py-3 rounded-xl bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-all shadow-lg shadow-[#C9A227]/20">
                Contact
              </a>
            )}
            {profile.hasEpk && (
              <Link href={`/epk/${profile.epkSlug || profile.username}`}
                className="flex-1 md:flex-none text-center px-6 py-3 rounded-xl border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold tracking-wider uppercase hover:bg-[#C9A227]/10 transition-all">
                View EPK
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {dash && (dash.spotify || dash.instagram || dash.tiktok || dash.youtube) && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dash.spotify && (
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-4 text-center group hover:border-[#C9A227]/20 transition-colors">
                <div className="text-[9px] text-[#555] uppercase tracking-wider mb-1">Spotify</div>
                <div className="font-display text-xl md:text-2xl tracking-wider text-[#C9A227]">{formatStat(dash.spotify.monthlyListeners)}</div>
                <div className="text-[9px] text-[#555] mt-1">monthly listeners</div>
              </div>
            )}
            {dash.instagram && (
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-4 text-center group hover:border-[#C9A227]/20 transition-colors">
                <div className="text-[9px] text-[#555] uppercase tracking-wider mb-1">Instagram</div>
                <div className="font-display text-xl md:text-2xl tracking-wider text-[#C9A227]">{formatStat(dash.instagram.followers)}</div>
                <div className="text-[9px] text-[#555] mt-1">{dash.instagram.engagementRate}% eng.</div>
              </div>
            )}
            {dash.tiktok && (
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-4 text-center group hover:border-[#C9A227]/20 transition-colors">
                <div className="text-[9px] text-[#555] uppercase tracking-wider mb-1">TikTok</div>
                <div className="font-display text-xl md:text-2xl tracking-wider text-[#C9A227]">{formatStat(dash.tiktok.followers)}</div>
                <div className="text-[9px] text-[#555] mt-1">{dash.tiktok.engagementRate}% eng.</div>
              </div>
            )}
            {dash.youtube && (
              <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-4 text-center group hover:border-[#C9A227]/20 transition-colors">
                <div className="text-[9px] text-[#555] uppercase tracking-wider mb-1">YouTube</div>
                <div className="font-display text-xl md:text-2xl tracking-wider text-[#C9A227]">{formatStat(dash.youtube.subscribers)}</div>
                <div className="text-[9px] text-[#555] mt-1">{dash.youtube.engagementRate}% eng.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Engagement score */}
      {profile.engagementScore && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-gradient-to-br from-[#C9A227]/5 to-[#C9A227]/0 border border-[#C9A227]/15 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#C9A227]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#EDE9E0]">Engagement Score: {profile.engagementScore.overall}/10</div>
              <div className="text-[10px] text-[#888] mt-0.5">{profile.engagementScore.label} — across {[dash?.instagram, dash?.tiktok, dash?.youtube].filter(Boolean).length} platforms</div>
            </div>
          </div>
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-5 md:p-6">
            <h2 className="font-display text-xs tracking-wider text-[#C9A227] uppercase mb-3">About</h2>
            <p className="text-sm text-[#A0A0A0] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
        </div>
      )}

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-5">
            <h2 className="font-display text-xs tracking-wider text-[#C9A227] uppercase mb-3">Connect</h2>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs text-[#EDE9E0] hover:border-[#C9A227]/30 hover:bg-[#C9A227]/[0.02] transition-all capitalize">
                  <span className="text-sm">{platformIcon(link.platform)}</span>
                  <span>{link.platform}</span>
                  {link.followers && <span className="text-[9px] text-[#555] ml-1">{link.followers}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Venues */}
      {venues.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-5">
            <h2 className="font-display text-xs tracking-wider text-[#C9A227] uppercase mb-3">Venues Performed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {venues.map((v) => (
                <div key={v.id} className="flex items-center gap-2.5 bg-[#181818] rounded-lg px-3.5 py-2.5 border border-[#222]">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#EDE9E0] truncate">{v.name}</div>
                    <div className="text-[9px] text-[#666]">{v.city}</div>
                  </div>
                  {v.verified && <Star className="w-3 h-3 text-[#C9A227] fill-[#C9A227] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 pb-8 text-center">
        <p className="text-[10px] text-[#555]">
          Powered by <a href="https://artispreneur.com" className="text-[#777] hover:text-[#C9A227]">Artispreneur</a>
          {" · "}
          <Link href="/" className="text-[#777] hover:text-[#C9A227]">ArtistEPKs</Link>
        </p>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mx-auto mb-4">
          <Music2 className="w-8 h-8 text-[#555]" />
        </div>
        <h1 className="font-display text-2xl tracking-wider text-[#EDE9E0] mb-2">Artist Not Found</h1>
        <p className="text-sm text-[#888] mb-6">This profile doesn't exist yet. Claim yours.</p>
        <Link href="/profile-wizard"
          className="inline-flex px-6 py-3 rounded-xl bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] shadow-lg shadow-[#C9A227]/20 transition-all">
          Create Yours
        </Link>
      </div>
    </div>
  );
}
