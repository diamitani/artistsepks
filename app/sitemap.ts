import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artistepks.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/#features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#templates`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/auth/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // EPK dynamic routes from Supabase
  let epkRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnon && !supabaseUrl.includes("placeholder")) {
      const res = await fetch(`${supabaseUrl}/rest/v1/epks?select=slug,updated_at&order=updated_at.desc&limit=1000`, {
        headers: { apikey: supabaseAnon, Authorization: `Bearer ${supabaseAnon}` },
      });
      if (res.ok) {
        const epks = await res.json();
        epkRoutes = epks.map((epk: { slug: string; updated_at: string }) => ({
          url: `${baseUrl}/epk/${epk.slug}`,
          lastModified: new Date(epk.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        }));
      }
    }
  } catch {
    // Skip dynamic routes if Supabase not available
  }

  return [...staticRoutes, ...epkRoutes];
}
