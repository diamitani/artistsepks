import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { artistName, genre, hometown, rawBio, stats, releases, template } = body;

  if (!artistName) {
    return new Response(JSON.stringify({ error: "artistName is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const templateContext =
    template === "booking"
      ? "a booking kit focused on live performance capabilities, technical requirements, and booking logistics"
      : template === "brand"
      ? "a brand partnership kit highlighting the artist's brand appeal, audience demographics, and partnership value"
      : "a main press kit for media, blogs, and industry professionals";

  const statsText = stats
    ? Object.entries(stats)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    : "";

  const releasesText = releases?.length
    ? releases
        .slice(0, 5)
        .map(
          (r: { title: string; type: string; year: string; certification?: string }) =>
            `${r.title} (${r.type}, ${r.year}${r.certification ? `, ${r.certification}` : ""})`
        )
        .join("; ")
    : "";

  const systemPrompt = `You are a music industry publicist and copywriter specializing in electronic press kits (EPKs).
You write compelling, professional artist bios that get attention from press, blogs, and industry professionals.
Your writing is vivid, specific, and avoids generic music clichés. Every bio you write feels earned and authentic.
You write for ${templateContext}.`;

  const userPrompt = `Write a professional artist bio for ${artistName}${genre ? ` (${genre})` : ""}${hometown ? ` from ${hometown}` : ""}.

${rawBio ? `Artist's own description: "${rawBio}"` : ""}
${statsText ? `Stats: ${statsText}` : ""}
${releasesText ? `Notable releases: ${releasesText}` : ""}

Requirements:
- 2–3 paragraphs, 150–250 words total
- Open with a strong hook — not "Born in..." or "[Name] is a..."
- Weave in concrete achievements and stats naturally (don't just list them)
- End with a forward-looking sentence about their trajectory
- Write in third person, present tense
- Tone: authoritative but not stiff — feels like great music press writing

Return ONLY the bio text. No headings, no labels, no preamble.`;

  // Stream the response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: process.env.ANTHROPIC_DEFAULT_SONNET_MODEL || "claude-sonnet-4-5",
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userPrompt }],
        });

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
