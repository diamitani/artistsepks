import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ArtispreneurNav } from "@/components/ui/artispreneur-nav";
import { ArtispreneurFooter } from "@/components/ui/artispreneur-footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artistsepks.com"),
  title: "ArtistEPKs — AI Electronic Press Kit Builder | Powered by Artispreneur",
  description:
    "Build luxury, high-converting Electronic Press Kits in minutes. AI-powered bio writing, direct Spotify & Apple Music sync, 300DPI press asset vaults, interactive riders, and PDF export for artists, managers, and labels.",
  keywords: [
    "Artist EPK",
    "Electronic Press Kit",
    "EPK Builder",
    "Music Press Kit Template",
    "Music Industry Pitch Deck",
    "DJ EPK",
    "Band Press Kit",
    "Artispreneur",
    "Music Manager Tools",
    "Record Label EPK",
  ],
  authors: [{ name: "Artispreneur", url: "https://artispreneur.com" }],
  creator: "Artispreneur",
  publisher: "ArtistsEPKs by Artispreneur",
  openGraph: {
    title: "ArtistEPKs — The Modern EPK Builder Platform",
    description:
      "Pitch like a major label. AI bio writing, verified DSP metrics, tech rider generator, and DocSend-style EPK analytics.",
    url: "https://artistsepks.com",
    siteName: "ArtistsEPKs",
    images: [
      {
        url: "/artispreneur-logo.png",
        width: 1200,
        height: 630,
        alt: "ArtistsEPKs — Powered by Artispreneur",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtistEPKs — AI Electronic Press Kit Platform",
    description:
      "Create high-impact music press kits in minutes. Powered by Artispreneur.",
    images: ["/artispreneur-logo.png"],
    creator: "@artispreneur",
  },
  icons: {
    icon: "/artispreneur-logo.png",
    shortcut: "/artispreneur-logo.png",
    apple: "/artispreneur-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ArtistsEPKs",
    operatingSystem: "Web",
    applicationCategory: "MultimediaApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Artispreneur",
      url: "https://artispreneur.com",
      logo: "https://artistsepks.com/artispreneur-logo.png",
    },
    description:
      "The premier AI-powered Electronic Press Kit and pitch deck platform for artists, managers, and record labels.",
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${bebasNeue.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#050505] text-[#EDE9E0] selection:bg-[#C9A227]/30 selection:text-[#EDE9E0]">
        <div className="grain-overlay" aria-hidden="true" />
        <ArtispreneurNav />
        <main className="flex-1 pt-16">{children}</main>
        <ArtispreneurFooter />
      </body>
    </html>
  );
}

