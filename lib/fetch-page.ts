// ── Web Page Fetcher ──────────────────────────────────────────────────────────
// Reads web pages and returns text content for the agent to analyze.

export async function fetchPageText(url: string): Promise<string> {
  const timeout = 10000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EPKAgent/1.0; +https://artistsepks.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    clearTimeout(timer);

    // Strip HTML tags and extract readable text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
      .replace(/\s+/g, " ")
      .trim();

    // Return first 8000 chars — enough for article/press content
    return text.slice(0, 8000) + (text.length > 8000 ? "\n\n[Content truncated...]" : "");
  } catch (err) {
    clearTimeout(timer);
    throw new Error(`Could not fetch ${url}: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}
