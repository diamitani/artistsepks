import { NextRequest } from "next/server";
import { isConfigured as isDeepSeekConfigured } from "@/lib/deepseek";

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

  const encoder = new TextEncoder();

  // Route: DeepSeek → Anthropic
  if (isDeepSeekConfigured()) {
    return streamWithDeepSeek(encoder, systemPrompt, userPrompt);
  }

  return streamWithAnthropic(encoder, systemPrompt, userPrompt);
}

// ── DeepSeek bio generation ──────────────────────────────────────────────────
async function streamWithDeepSeek(
  encoder: TextEncoder,
  systemPrompt: string,
  userPrompt: string
): Promise<Response> {
  const key = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "DEEPSEEK_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 1024,
          }),
        });

        if (!res.ok) {
          const err = await res.text().catch(() => "");
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: `DeepSeek API error: ${err.slice(0, 200)}` })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const payload = trimmed.slice(6);
            if (payload === "[DONE]") continue;

            try {
              const chunk = JSON.parse(payload);
              const content = chunk.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                );
              }
            } catch { /* skip */ }
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

// ── Anthropic bio generation (fallback) ───────────────────────────────────────
async function streamWithAnthropic(
  encoder: TextEncoder,
  systemPrompt: string,
  userPrompt: string
): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "No AI provider configured. Set DEEPSEEK_API_KEY or ANTHROPIC_API_KEY." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const client = new Anthropic({ apiKey });

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