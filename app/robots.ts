import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/checkout/",
          "/builder/",
          "/profile-wizard/",
          "/dashboard/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/api/",
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://artistepks.com"}/sitemap.xml`,
  };
}
