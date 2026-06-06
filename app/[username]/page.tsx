import { Metadata } from "next";
import Link from "next/link";
import { Music2, Globe, Link2 } from "lucide-react";

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
  socialLinks?: { instagram?: string; tiktok?: string; youtube?: string; spotify?: string; website?: string };
  stats?: Record<string, string>;
  bookingEmail?: string;
  hasEpk?: boolean;
  epkSlug?: string;
}

function sanitizeUsername(input: string): boolean {
  return /^[a-zA-Z0-9-]{3,30}$/.test(input);
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
          return {
            username: pd.username || username,
            displayName: pd.background?.artistName || pd.contact?.firstName + " " + pd.contact?.lastName || username,
            tagline: pd.background?.style || pd.epkData?.artistTagline,
            genre: pd.background?.genre || pd.epkData?.genre,
            location: pd.background?.location || pd.epkData?.hometown,
            avatarUrl: pd.epkData?.profileImageUrl,
            coverUrl: pd.epkData?.heroImageUrl,
            bio: pd.background?.bio || pd.epkData?.shortBio || pd.epkData?.bio,
            socialLinks: pd.epkData?.socialLinks || pd.background?.socialLinks,
            stats: pd.epkData?.stats || pd.enriched?.stats,
            bookingEmail: pd.contact?.email || pd.epkData?.bookingEmail,
            hasEpk: !!pd.epkData?.artistName,
            epkSlug: pd.epkSlug,
          };
        }
      }
    } catch { /* fall through */ }
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

  if (!sanitizeUsername(username)) {
    return <NotFound />;
  }

  const profile = await getProfile(username);

  if (!profile) {
    return <NotFound />;
  }

  const socialEntries = Object.entries(profile.socialLinks || {}).filter(([, v]) => v);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Cover */}
      <div
        className="relative h-48 md:h-64 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A] overflow-hidden"
        style={profile.coverUrl ? { backgroundImage: `url(${profile.coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        {!profile.coverUrl && (
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #C9A227 0%, transparent 50%)" }} />
        )}
      </div>

      {/* Profile header */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#050505] overflow-hidden bg-[#1A1A1A] flex-shrink-0 shadow-xl">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5">
                <Music2 className="w-8 h-8 md:w-10 md:h-10 text-[#C9A227]/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pb-2">
            <h1 className="font-display text-2xl md:text-4xl tracking-wider text-[#EDE9E0]">
              {profile.displayName}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-[#888]">
              <span>@{profile.username}</span>
              {profile.genre && <><span className="text-[#555]">·</span><span style={{ color: "#C9A227" }}>{profile.genre}</span></>}
              {profile.location && <><span className="text-[#555]">·</span><span>{profile.location}</span></>}
            </div>
            {profile.tagline && (
              <p className="text-sm text-[#A0A0A0] mt-1 italic">{profile.tagline}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-2 w-full md:w-auto">
            {profile.bookingEmail && (
              <a href={`mailto:${profile.bookingEmail}`}
                className="flex-1 md:flex-none text-center px-5 py-2.5 rounded-xl bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors">
                Contact
              </a>
            )}
            {profile.hasEpk && (
              <Link href={`/epk/${profile.epkSlug || profile.username}`}
                className="flex-1 md:flex-none text-center px-5 py-2.5 rounded-xl border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold tracking-wider uppercase hover:bg-[#C9A227]/10 transition-colors">
                View EPK
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {profile.stats && Object.keys(profile.stats).length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(profile.stats).filter(([, v]) => v).slice(0, 4).map(([key, val]) => (
              <div key={key} className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-4 text-center">
                <div className="font-display text-xl md:text-2xl tracking-wider text-[#C9A227]">{val}</div>
                <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-5">
            <h2 className="font-display text-sm tracking-wider text-[#C9A227] uppercase mb-3">About</h2>
            <p className="text-sm text-[#A0A0A0] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
        </div>
      )}

      {/* Social links */}
      {socialEntries.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl p-5">
            <h2 className="font-display text-sm tracking-wider text-[#C9A227] uppercase mb-3">Connect</h2>
            <div className="flex flex-wrap gap-2">
              {socialEntries.map(([platform, url]) => (
                <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#181818] border border-[#2A2A2A] text-xs text-[#EDE9E0] hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors capitalize">
                  {platform === "website" && <Globe className="w-3.5 h-3.5" />}
                  {platform !== "website" && <Link2 className="w-3.5 h-3.5" />}
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state — claim this profile */}
      {!profile.displayName && (
        <div className="max-w-4xl mx-auto px-4 mt-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-4">
            <Music2 className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h2 className="font-display text-xl tracking-wider text-[#EDE9E0] mb-2">This profile is available</h2>
          <p className="text-sm text-[#888] mb-6">Claim your free artist profile at artistepks.com/username</p>
          <Link href="/profile-wizard"
            className="inline-flex px-6 py-3 rounded-xl bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors">
            Create Your Profile
          </Link>
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
        <p className="text-sm text-[#888] mb-6">This profile doesn't exist yet. Claim your free artist profile.</p>
        <Link href="/profile-wizard"
          className="inline-flex px-5 py-2.5 rounded-xl bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors">
          Create Yours
        </Link>
      </div>
    </div>
  );
}
