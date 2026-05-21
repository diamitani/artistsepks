import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderEPKToHtml } from "@/lib/export/html";
import type { EPKData } from "@/lib/types";

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json();
    const { data, template } = body as { data: EPKData; template?: string };

    if (!data || !data.artistName) {
      return NextResponse.json({ error: "EPK data with artistName is required" }, { status: 400 });
    }

    const html = renderEPKToHtml(data, template as any);

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
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    const arrayBuffer = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-epk.pdf"`,
        "Content-Length": pdf.byteLength.toString(),
      },
    });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
