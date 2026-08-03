import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Artispreneur — Artist Electronic Press Kits | AI-Powered EPK Builder",
  description:
    "Create professional Electronic Press Kits in minutes. AI writes your bio, pulls your stats, and builds a stunning hosted page + PDF. Built for independent artists, bands, and music professionals.",
  keywords: [
    "EPK builder",
    "electronic press kit",
    "artist press kit",
    "music press kit",
    "booking kit",
    "AI press kit",
    "artist portfolio",
    "music industry",
  ],
  openGraph: {
    title: "Artispreneur — Artist Electronic Press Kits",
    description:
      "AI-powered press kits that get you booked. Professional templates, Spotify integration, PDF export, and hosted pages.",
    type: "website",
    siteName: "Artispreneur",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Artispreneur — Artist EPK Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artispreneur — Artist EPK Builder",
    description:
      "AI-powered press kits that get you booked. Professional templates, Spotify integration, PDF export, and hosted pages.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artistepks.com";
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Artispreneur",
    url: siteUrl,
    logo: `${siteUrl}/artispreneur-logo.png`,
    description:
      "AI-powered Electronic Press Kit builder for independent artists, bands, and music professionals.",
    sameAs: [
      "https://artispreneur.com",
    ],
    offers: {
      "@type": "Service",
      name: "EPK Builder",
      description:
        "Create professional Electronic Press Kits with AI-powered bio writing, Spotify integration, and professional templates.",
    },
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${bebasNeue.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a
              href="https://artispreneur.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 group"
            >
              <img src="/artispreneur-logo.png" alt="Artispreneur" width="20" height="20" className="w-5 h-5 rounded flex-shrink-0 object-contain" />
              <span className="text-[11px] text-[#777] group-hover:text-[#C0272D] transition-colors tracking-wider uppercase font-medium">
                Powered by <span className="text-[#EDE9E0] group-hover:text-[#F5C100]">Artispreneur</span>
              </span>
            </a>
            <span className="text-[10px] text-[#555]">
              ArtistEPKs &mdash; Electronic Press Kits for Independent Artists
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
