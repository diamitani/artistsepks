import { NextRequest, NextResponse } from "next/server";
import { renderEPKToHtml } from "@/lib/export/html";
import type { EPKData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body as { data: EPKData };

    if (!data || !data.artistName) {
      return NextResponse.json({ error: "EPK data with artistName is required" }, { status: 400 });
    }

    const html = renderEPKToHtml(data);
    const slug = data.artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Build a minimal-site bundle: index.html + static assets note
    // Extract body content from rendered HTML
    const bodyStart = html.indexOf("<body>") + 6;
    const bodyEnd = html.lastIndexOf("</body>");
    const bodyContent = bodyStart > 5 && bodyEnd > bodyStart
      ? html.slice(bodyStart, bodyEnd)
      : html;

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${data.artistName} — EPK</title>
  <meta name="description" content="${data.shortBio || data.bio?.slice(0, 160) || "Electronic Press Kit"}"/>
  <meta property="og:title" content="${data.artistName} — EPK"/>
  <meta property="og:description" content="${data.shortBio || data.bio?.slice(0, 160) || "Professional Electronic Press Kit"}"/>
  <meta property="og:type" content="website"/>
  ${data.heroImageUrl ? `<meta property="og:image" content="${data.heroImageUrl}"/>` : ""}
  <meta name="twitter:card" content="summary_large_image"/>
  <style>
    body { margin: 0; padding: 0; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;

    // Build zip with index.html
    // For simplicity, return HTML directly (can be saved as .html)
    // In production, use archiver or jszip for proper .zip
    const encoder = new TextEncoder();
    const bytes = encoder.encode(indexHtml);

    return new Response(bytes, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${slug}-epk.html"`,
        "Content-Length": bytes.length.toString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
