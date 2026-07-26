import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Determine the base URL for the EPK page
  const host =
    request.headers.get("host") ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const epkUrl = `${protocol}://${host}/epk/${slug}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    // Set viewport for a standard document width
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

    // Load the EPK page, wait for network to be idle
    await page.goto(epkUrl, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait an extra moment for fonts and animations to settle
    await new Promise((r) => setTimeout(r, 1500));

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    // Optionally bump the download counter in Supabase
    // (fire-and-forget, don't block response)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        fetch(`${supabaseUrl}/rest/v1/rpc/increment_epk_downloads`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ epk_slug: slug }),
        }).catch(() => {});
      }
    } catch {
      // Non-critical
    }

    // Copy to a plain ArrayBuffer to satisfy TypeScript's strict buffer types
    const arrayBuffer = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-epk.pdf"`,
        "Content-Length": pdf.byteLength.toString(),
      },
    });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
