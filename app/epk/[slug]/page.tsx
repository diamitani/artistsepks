import { MainTemplate } from "@/components/templates/MainTemplate";
import { BookingTemplate } from "@/components/templates/BookingTemplate";
import { BrandTemplate } from "@/components/templates/BrandTemplate";
import type { EPKData } from "@/lib/types";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Demo data for the Luh Kel showcase EPKs
function getDemoData(slug: string): EPKData {
  const template = slug.includes("booking")
    ? "booking"
    : slug.includes("brand")
    ? "brand"
    : "main";

  return {
    template,
    artistName: "Luh Kel",
    artistTagline: "The voice of a generation",
    genre: "R&B / Hip-Hop",
    hometown: "St. Louis, MO",
    bio: `Born May 20, 2002 in St. Louis, Missouri, Luh Kel discovered his passion for music at an early age, drawing inspiration from the streets of his hometown and the legends who came before him. Signed at just 17 years old, he burst onto the national scene with his breakout single "Wrong," which debuted at #1 on Billboard and earned RIAA Platinum certification.

With over 1 billion YouTube views, 2.5 million subscribers, and 1.5 million monthly Spotify listeners, Luh Kel has established himself as one of the most compelling voices in contemporary R&B. His music blends melodic storytelling with hard-hitting production, creating an authentic sound that resonates across generations.

His discography includes the RIAA Platinum "Wrong," RIAA Gold singles "BRB" and "Pull Up," and critically acclaimed projects "Head Melodies," "L.O.V.E.," and "Mixed Emotions." Notable collaborations include PnB Rock, Queen Naija, Lil Tjay, A Boogie wit da Hoodie, and Trippie Redd.

Signed to FRVR International, Luh Kel continues to push creative boundaries while building a loyal global fanbase that stretches from the streets of St. Louis to stages around the world.`,
    shortBio: "Platinum-certified R&B artist from St. Louis, MO. Signed at 17. 1B+ YouTube views, 2.5M subscribers, 1.5M Spotify monthly listeners.",
    heroImageUrl: "",
    profileImageUrl: "",
    youtubeVideoId: "fB-If0inWuI",
    spotifyArtistId: "24CgJHK6T7C5OmUbiLLMjJ",
    stats: {
      youtubeSubscribers: "2.5M",
      youtubeViews: "1B+",
      tiktokViews: "3B+",
      spotifyListeners: "1.5M+",
      instagramFollowers: "2.3M",
    },
    releases: [
      { title: "Wrong", type: "Single", year: "2019", certification: "Platinum", streamingUrl: "" },
      { title: "BRB", type: "Single", year: "2019", certification: "Gold" },
      { title: "Pull Up", type: "Single", year: "2020", certification: "Gold" },
      { title: "Head Melodies", type: "Album", year: "2020", tracks: 12 },
      { title: "L.O.V.E.", type: "EP", year: "2021", tracks: 6 },
      { title: "Mixed Emotions", type: "Album", year: "2022", tracks: 15 },
    ],
    timeline: [
      { year: "2019", title: "Signed & Debut", description: 'Signed to FRVR International at age 17. Debut single "Wrong" hits #1 on Billboard and earns RIAA Platinum certification.' },
      { year: "2020", title: "Breakthrough Year", description: '"BRB" and "Pull Up" both earn RIAA Gold. Debut album "Head Melodies" drops to widespread acclaim.' },
      { year: "2021", title: "EP & Expansion", description: '"L.O.V.E." EP releases. Surpasses 1 billion YouTube views and 2 million subscribers.' },
      { year: "2022", title: "Mixed Emotions", description: 'Third project "Mixed Emotions" released with major collaborations. TikTok presence surpasses 3 billion total views.' },
    ],
    pressQuotes: [
      { quote: "One of the most promising voices in contemporary R&B.", publication: "Billboard" },
      { quote: "A storyteller with rare emotional depth.", publication: "Pitchfork" },
    ],
    collaborators: ["PnB Rock", "Queen Naija", "Lil Tjay", "A Boogie wit da Hoodie", "Trippie Redd", "Ari Lennox", "Summer Walker"],
    brandPartners: ["Fashion Nova", "Reebok", "Nike", "Disney"],
    socialLinks: {
      instagram: "https://instagram.com/luhkel",
      youtube: "https://youtube.com/@luhkel",
      spotify: "https://open.spotify.com/artist/24CgJHK6T7C5OmUbiLLMjJ",
    },
    bookingEmail: "booking@frvrinternational.com",
    performancePackages: [
      { name: "Club / Venue", capacity: "Up to 1,500", setLength: "45 min", features: ["Backing track setup", "Full rider provided", "Merch table included", "2 VIP guest passes"] },
      { name: "Headline Show", capacity: "1,500–5,000", setLength: "75 min", features: ["Full live band optional", "Production advance provided", "VIP meet & greet available", "Custom stage design"] },
      { name: "Festival", capacity: "5,000+", setLength: "45–60 min", features: ["Full production package", "Stage plots & advance", "Dedicated artist liaison", "Full hospitality advance"] },
    ],
  };
}

async function getEPKData(slug: string): Promise<EPKData> {
  // Try to fetch from Supabase if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/epks?slug=eq.${encodeURIComponent(slug)}&select=template,data`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 60 }, // ISR: revalidate every 60s
        }
      );

      if (res.ok) {
        const rows = await res.json();
        if (rows?.length > 0) {
          const row = rows[0];
          const epkData: EPKData = {
            ...row.data,
            template: row.template,
          };

          // Fire-and-forget view increment
          fetch(`${supabaseUrl}/rest/v1/rpc/increment_epk_views`, {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ epk_slug: slug }),
          }).catch(() => {});

          return epkData;
        }
      }
    } catch {
      // Fall through to demo data
    }
  }

  // Fall back to demo data
  return getDemoData(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEPKData(slug);
  return {
    title: `${data.artistName} — EPK`,
    description: data.shortBio || data.bio?.slice(0, 160),
  };
}

export default async function EPKPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getEPKData(slug);

  if (data.template === "booking") return <BookingTemplate data={data} />;
  if (data.template === "brand") return <BrandTemplate data={data} />;
  return <MainTemplate data={data} />;
}
