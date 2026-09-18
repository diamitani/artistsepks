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
  title: "EPK Agent — Create Professional Press Kits with AI",
  description: "Build, manage, and share your Electronic Press Kit in minutes. AI-powered content, professional templates, PDF export, and hosted pages.",
  openGraph: {
    title: "EPK Agent",
    description: "Create professional EPKs with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${bebasNeue.variable}`}>
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
              <img src="/artispreneur%20logo.png" alt="Artispreneur" width="20" height="20" className="w-5 h-5 rounded flex-shrink-0 object-contain" />
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
