import type { EPKData } from "@/lib/types";

export interface ExampleEPK {
  id: string;
  name: string;
  description: string;
  tags: string[];
  data: EPKData;
  previewColor: string;
}

export const EXAMPLES: ExampleEPK[] = [
  {
    id: "luh-kel-main",
    name: "Luh Kel — Main EPK",
    description: "Full artist profile with bio, stats, discography, and press quotes. Best for media and labels.",
    tags: ["R&B", "Pop", "Full Profile"],
    previewColor: "#C9A227",
    data: {
      template: "main",
      artistName: "Luh Kel",
      artistTagline: "The voice of a generation",
      genre: "R&B / Hip-Hop",
      hometown: "St. Louis, MO",
      bio: `Since bursting onto the national scene at age 17, Luh Kel has accumulated over 1 billion YouTube views, 2.5 million subscribers, and 1.5 million monthly Spotify listeners. His debut single "Wrong" hit #1 on Billboard and earned RIAA Platinum certification — an unprecedented feat for an independent teenager from St. Louis.

Signed to FRVR International, Luh Kel's catalog spans the Platinum-certified "Wrong," Gold singles "BRB" and "Pull Up," and critically acclaimed projects "Head Melodies," "L.O.V.E.," and "Mixed Emotions." His sound — melodic storytelling fused with hard-hitting production — has earned him collaborations with PnB Rock, Queen Naija, Lil Tjay, A Boogie wit da Hoodie, and Trippie Redd.

With a global fanbase stretching from the streets of St. Louis to stages around the world, Luh Kel continues to push creative boundaries. His forthcoming project promises to be his most ambitious yet — further cementing his place as one of contemporary R&B's most compelling voices.`,
      shortBio: "Platinum-certified R&B artist. 1B+ YouTube views, 2.5M subscribers, 1.5M Spotify monthly listeners.",
      youtubeVideoId: "fB-If0inWuI",
      spotifyArtistId: "24CgJHK6T7C5OmUbiLLMjJ",
      stats: {
        spotifyListeners: "1.5M+",
        youtubeSubscribers: "2.5M",
        youtubeViews: "1B+",
        instagramFollowers: "2.3M",
      },
      releases: [
        { title: "Wrong", type: "Single", year: "2019", certification: "Platinum" },
        { title: "BRB", type: "Single", year: "2019", certification: "Gold" },
        { title: "Pull Up", type: "Single", year: "2020", certification: "Gold" },
        { title: "Head Melodies", type: "Album", year: "2020", tracks: 12 },
        { title: "L.O.V.E.", type: "EP", year: "2021", tracks: 6 },
        { title: "Mixed Emotions", type: "Album", year: "2022", tracks: 15 },
      ],
      timeline: [
        { year: "2019", title: "Signed & Debut", description: "Signed to FRVR International at 17. 'Wrong' hits #1 on Billboard, RIAA Platinum." },
        { year: "2020", title: "Breakthrough Year", description: "'BRB' and 'Pull Up' go Gold. Debut album 'Head Melodies' drops to acclaim." },
        { year: "2021", title: "EP & Expansion", description: "'L.O.V.E.' EP releases. Surpasses 1B YouTube views and 2M subscribers." },
        { year: "2022", title: "Mixed Emotions", description: "Third project released with major collaborations. 3B+ TikTok views." },
      ],
      pressQuotes: [
        { quote: "One of the most promising voices in contemporary R&B.", publication: "Billboard" },
        { quote: "A storyteller with rare emotional depth and authenticity.", publication: "Pitchfork" },
      ],
      collaborators: ["PnB Rock", "Queen Naija", "Lil Tjay", "A Boogie wit da Hoodie", "Trippie Redd"],
      brandPartners: ["Fashion Nova", "Reebok", "Nike"],
      socialLinks: {
        instagram: "https://instagram.com/luhkel",
        youtube: "https://youtube.com/@luhkel",
        spotify: "https://open.spotify.com/artist/24CgJHK6T7C5OmUbiLLMjJ",
      },
      bookingEmail: "booking@frvrinternational.com",
    },
  },
  {
    id: "solaris-booking",
    name: "SOLARIS — Booking Kit",
    description: "Performance-focused EPK with packages, technical rider, and promoter-ready stats.",
    tags: ["Electronic", "Booking", "Festival"],
    previewColor: "#C8102E",
    data: {
      template: "booking",
      artistName: "SOLARIS",
      artistTagline: "Electronic music's rising force",
      genre: "Electronic / House",
      hometown: "Berlin, Germany",
      bio: `SOLARIS has emerged as one of electronic music's most compelling live acts, headlining festivals across 14 countries and selling out venues from Berlin to Tokyo. With a signature blend of melodic house, progressive techno, and live instrumentation, the SOLARIS live experience has been described as "a journey as much as a performance."

With over 500 million global streams and a dedicated fanbase across every major platform, SOLARIS brings festival-grade production to every show. The current live setup features custom visuals, a synchronized lighting rig, and the flexibility to adapt from intimate clubs to main stages.

Past performances include Tomorrowland, Coachella, Ultra Music Festival, Creamfields, and EDC. SOLARIS is represented internationally by Atlas Booking Agency.`,
      shortBio: "Electronic artist with 500M+ streams. Headlined festivals in 14 countries. Known for immersive live performances.",
      youtubeVideoId: "dQw4w9WgXcQ",
      spotifyArtistId: "3nYBVjM3q7mB6lBZ0vZJ",
      heroImageUrl: "",
      stats: {
        spotifyListeners: "3.2M+",
        youtubeSubscribers: "850K",
        instagramFollowers: "1.1M",
        tiktokViews: "2.5B+",
      },
      pressQuotes: [
        { quote: "A journey as much as a performance — SOLARIS is redefining the live electronic experience.", publication: "DJ Mag" },
        { quote: "One of the most exciting live acts in electronic music right now.", publication: "Mixmag" },
      ],
      releases: [
        { title: "Nebula", type: "Album", year: "2023", tracks: 12, certification: "Gold" },
        { title: "Pulse EP", type: "EP", year: "2024", tracks: 6 },
        { title: "Stellar Drift", type: "Single", year: "2024" },
      ],
      timeline: [
        { year: "2020", title: "Debut EP", description: "Self-released debut EP 'Phase One' hits 10M streams in first month." },
        { year: "2022", title: "Festival Breakthrough", description: "Main stage debut at Tomorrowland Belgium. Signs with Atlas Booking." },
        { year: "2023", title: "Debut Album", description: "'Nebula' album RIAA Gold. Headlines 22-show North American tour." },
        { year: "2024", title: "Global Expansion", description: "Sells out 15-date Asia tour. 500M total streams reached." },
      ],
      socialLinks: {
        instagram: "https://instagram.com/solarismusic",
        youtube: "https://youtube.com/@solaris",
        spotify: "https://open.spotify.com/artist/solaris",
      },
      bookingEmail: "booking@atlasagency.com",
      performancePackages: [
        { name: "Club Set", capacity: "Up to 1,000", setLength: "90 min", features: ["DJ setup + controller", "Basic lighting package", "2 guests", "45 min soundcheck"] },
        { name: "Headline Show", capacity: "1,000–5,000", setLength: "75–90 min", features: ["Full live setup", "Custom visuals", "Lighting rig + LED wall", "Production advance required"] },
        { name: "Festival Main Stage", capacity: "5,000+", setLength: "60 min", features: ["Full production", "Stage plot + tech rider", "Artist liaison", "Hospitality for 6"] },
      ],
    },
  },
  {
    id: "nova-brand",
    name: "NOVA — Brand Kit",
    description: "Brand partnership pitch with value props, audience stats, and past collaborations.",
    tags: ["Pop", "Brand", "Partnership"],
    previewColor: "#C9A227",
    data: {
      template: "brand",
      artistName: "NOVA",
      artistTagline: "Pop's boldest new voice",
      genre: "Pop / Alt-Pop",
      hometown: "Los Angeles, CA",
      bio: `NOVA is redefining pop music for a new generation. With a distinct visual identity, a fiercely loyal fanbase (dubbed "The Nova Nation"), and a string of viral moments that have generated over 2 billion TikTok views, NOVA represents a unique opportunity for brand partners seeking authentic Gen Z and millennial engagement.

Her debut album shattered streaming records for an independent pop release, and her social footprint spans 4 million+ followers across platforms with engagement rates that exceed industry averages by 3x. NOVA's audience is 68% women aged 18–34 — a coveted demographic for fashion, beauty, and lifestyle brands.

Previous brand partnerships include collaborations with American Eagle, MAC Cosmetics, and Spotify's EQUAL program. Each partnership was executed with NOVA's signature creative direction, resulting in campaigns that felt organic rather than transactional.`,
      shortBio: "Pop artist with 2B+ TikTok views and 4M+ followers. Known for bold visual identity and highly-engaged Gen Z fanbase.",
      stats: {
        spotifyListeners: "1.8M+",
        youtubeSubscribers: "620K",
        instagramFollowers: "1.4M",
        tiktokViews: "2.1B+",
      },
      pressQuotes: [
        { quote: "Pop's boldest new voice is just getting started.", publication: "Rolling Stone" },
        { quote: "A distinct visual identity paired with undeniable pop instincts.", publication: "CLASH" },
      ],
      timeline: [
        { year: "2023", title: "Debut EP", description: "Daylight EP drops. First track goes viral on TikTok with 50M+ views." },
        { year: "2024", title: "Breakout Album", description: "Debut album 'Rise' shatters streaming records for independent pop release." },
      ],
      releases: [
        { title: "Rise", type: "Album", year: "2024", tracks: 14 },
        { title: "Phantom", type: "Single", year: "2024" },
        { title: "Daylight", type: "EP", year: "2023", tracks: 5 },
      ],
      brandPartners: ["American Eagle", "MAC Cosmetics", "Spotify EQUAL", "Urban Outfitters"],
      collaborators: ["Producer X", "Songwriter Y", "Featured Artist Z"],
      socialLinks: {
        instagram: "https://instagram.com/novamusic",
        tiktok: "https://tiktok.com/@novamusic",
        youtube: "https://youtube.com/@nova",
        spotify: "https://open.spotify.com/artist/nova",
      },
      bookingEmail: "partnerships@novaofficial.com",
    },
  },
  {
    id: "indie-band-main",
    name: "The Velvetines — Main EPK",
    description: "Indie rock band profile with underground credibility and press highlights.",
    tags: ["Indie", "Rock", "Band"],
    previewColor: "#C9A227",
    data: {
      template: "main",
      artistName: "The Velvetines",
      artistTagline: "Lo-fi heart, hi-fi soul",
      genre: "Indie Rock / Shoegaze",
      hometown: "Portland, OR",
      bio: `The Velvetines make music for the hours between midnight and dawn. Formed in a basement in Portland's Hawthorne district, the four-piece has built a devoted following the old-fashioned way: relentless touring, word-of-mouth, and a sound that critics have called "shoegaze for people who usually hate shoegaze."

Their sophomore album "Faded Neon" spent 12 weeks on the college radio charts, and their Bandcamp page has become a destination for limited-edition vinyl variants that sell out in minutes. With 200K monthly Spotify listeners and a touring circuit that now spans the US and Europe, The Velvetines are proof that guitar music isn't dead — it's just been waiting for the right band.

The band consists of Alex Chen (vocals/guitar), Mira Patel (bass/keys), Sam Torres (drums), and Jordan Lee (lead guitar).`,
      shortBio: "Portland indie rock band. 'Faded Neon' spent 12 weeks on college radio charts. 200K monthly Spotify listeners.",
      youtubeVideoId: "jNQXAC9IVRw",
      spotifyArtistId: "4cTg3Z5lMpl4l4Y",
      stats: {
        spotifyListeners: "200K+",
        youtubeSubscribers: "85K",
        instagramFollowers: "45K",
      },
      releases: [
        { title: "Faded Neon", type: "Album", year: "2024", tracks: 11 },
        { title: "Midnight Demo", type: "EP", year: "2023", tracks: 4 },
        { title: "Basement Tapes", type: "Mixtape", year: "2022", tracks: 8 },
      ],
      timeline: [
        { year: "2021", title: "Formation", description: "Four friends start jamming in a Portland basement. First show at The Twilight Cafe." },
        { year: "2022", title: "Debut Release", description: "Self-released 'Basement Tapes' mixtape. Sells 500 copies on Bandcamp within a week." },
        { year: "2023", title: "Touring Breakthrough", description: "First US tour. Plays SXSW. Signs with indie label Static Records." },
        { year: "2024", title: "Faded Neon", description: "Sophomore album drops to critical acclaim. First European tour announced." },
      ],
      pressQuotes: [
        { quote: "Shoegaze for people who usually hate shoegaze — and a revelation for everyone else.", publication: "NME" },
        { quote: "The Velvetines are carrying the torch for American indie rock with grace and volume.", publication: "Paste Magazine" },
      ],
      collaborators: ["Alex Chen", "Mira Patel", "Sam Torres", "Jordan Lee"],
      socialLinks: {
        instagram: "https://instagram.com/thevelvetines",
        bandcamp: "https://thevelvetines.bandcamp.com",
      },
      bookingEmail: "velvetines@staticrecords.com",
    },
  },
  {
    id: "hiphop-booking",
    name: "King KAI — Booking Kit",
    description: "Hard-hitting booking EPK with performance packages, rider, and tour history.",
    tags: ["Hip-Hop", "Booking", "Tour"],
    previewColor: "#C8102E",
    data: {
      template: "booking",
      artistName: "King KAI",
      artistTagline: "East Coast royalty",
      genre: "Hip-Hop / Trap",
      hometown: "Brooklyn, NY",
      bio: `King KAI has built a reputation as one of hip-hop's most electrifying live performers. From sold-out headline tours across North America to festival sets that have brought crowds of 30,000+ to a fever pitch, KAI's stage presence is the stuff of legend.

With 2.5 million monthly Spotify listeners, multiple Gold and Platinum RIAA certifications, and a social footprint that exceeds 5 million across platforms, King KAI delivers a show that fans remember forever. His current tour production includes live DJ, hypeman, custom visuals, and a lighting rig designed specifically for high-energy hip-hop performances.

Represented by Empire Talent Agency, KAI is available for club shows, theater headliners, and festival main stage slots. All booking inquiries are reviewed within 48 hours.`,
      shortBio: "Multi-Platinum hip-hop artist from Brooklyn. 2.5M monthly listeners. Known for high-energy live shows.",
      youtubeVideoId: "JGwWNGJdvx8",
      spotifyArtistId: "5h4nACUwR",
      stats: {
        spotifyListeners: "2.5M+",
        youtubeSubscribers: "1.8M",
        instagramFollowers: "3.2M",
        tiktokViews: "4.5B+",
      },
      releases: [
        { title: "Crown Heavy", type: "Album", year: "2024", certification: "Gold", tracks: 16 },
        { title: "Royalty Pack", type: "EP", year: "2023", tracks: 7 },
        { title: "No Ceilings", type: "Mixtape", year: "2022", certification: "Platinum" },
      ],
      timeline: [
        { year: "2020", title: "Breakout Mixtape", description: "'No Ceilings' mixtape goes viral. Signs major distribution deal." },
        { year: "2022", title: "First Platinum", description: "'No Ceilings' certified Platinum. First headline tour sells out 22 dates." },
        { year: "2023", title: "Festival Circuit", description: "Plays Rolling Loud, Lollapalooza, and Governors Ball. Named 'Best Live Act' by HipHopDX." },
        { year: "2024", title: "Global Expansion", description: "'Crown Heavy' album RIAA Gold. European tour announced for fall." },
      ],
      pressQuotes: [
        { quote: "One of hip-hop's most electrifying live performers — the stage is his territory.", publication: "HipHopDX" },
        { quote: "King KAI is East Coast royalty in the making.", publication: "XXL" },
      ],
      socialLinks: {
        instagram: "https://instagram.com/kingkai",
        youtube: "https://youtube.com/@kingkai",
        spotify: "https://open.spotify.com/artist/kingkai",
      },
      bookingEmail: "booking@empiretalent.com",
      performancePackages: [
        { name: "Club Show", capacity: "Up to 1,500", setLength: "60 min", features: ["DJ + hypeman", "Basic lighting", "Backline provided", "4 VIP passes"] },
        { name: "Theater Headline", capacity: "1,500–5,000", setLength: "75 min", features: ["Full production", "Custom visuals", "Production advance", "Meet & greet option"] },
        { name: "Festival Main Stage", capacity: "5,000+", setLength: "45–60 min", features: ["Full production", "Stage plot provided", "Artist liaison", "Hospitality for 10"] },
      ],
    },
  },
];
