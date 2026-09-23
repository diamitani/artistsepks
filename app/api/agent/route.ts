import { NextRequest } from "next/server";
import { streamText, tool, jsonSchema, stepCountIs, type ModelMessage } from "ai";
import { getModel, gatewayProviderOptions } from "@/lib/ai/model";
import { AGENT_SYSTEM_PROMPT, EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL, FETCH_PAGE_TOOL, ADD_RIDER_TOOL } from "@/lib/agent";
import { fetchSpotifyData } from "@/lib/spotify";
import { scrapeSocialProfile } from "@/lib/social-scraper";
import { fetchPageText } from "@/lib/fetch-page";
import { getRiderSet } from "@/lib/riders";

// ── SSE helper ─────────────────────────────────────────────────────────────────

function sendSSE(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: unknown) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

// ── Tool executors ───────────────────────────────────────────────────────────
// These implementations are unchanged from the previous hand-rolled provider
// loop — only how they're wired to the model changed (AI SDK tool-calling
// instead of manually branching on Anthropic / Gemini / DeepSeek response
// shapes).

async function execFetchSpotifyData(input: { spotifyUrlOrId?: string }): Promise<Record<string, unknown>> {
  const spotifyUrlOrId = input?.spotifyUrlOrId;
  if (!spotifyUrlOrId) return { error: "No Spotify URL or ID provided" };

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { error: "Spotify API not configured", hint: "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET" };
  }

  try {
    const data = await fetchSpotifyData(spotifyUrlOrId);
    if (!data) return { error: "Could not fetch Spotify data — invalid artist ID or URL" };
    return data as unknown as Record<string, unknown>;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Spotify fetch failed" };
  }
}

async function execScrapeSocialProfile(input: { url?: string }): Promise<Record<string, unknown>> {
  const url = input?.url;
  if (!url) return { error: "No URL provided" };
  try {
    return (await scrapeSocialProfile(url)) as unknown as Record<string, unknown>;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Social scrape failed" };
  }
}

async function execFetchPage(input: { url?: string }): Promise<Record<string, unknown>> {
  const url = input?.url;
  if (!url) return { error: "No URL provided" };
  try {
    const text = await fetchPageText(url);
    return { url, content: text.slice(0, 8000) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Page fetch failed" };
  }
}

async function execAddRider(input: { riderType?: string; level?: string; notes?: string }): Promise<Record<string, unknown>> {
  const riderType = input?.riderType || "";
  const level = input?.level || "";
  const notes = input?.notes || "";
  const set = level === "full" ? "festival" : "club";
  const riders = getRiderSet(set);
  const rider = riders.find((r) => r.id.includes(riderType));
  if (!rider) return { error: `No rider found for ${riderType} ${level}` };
  return { riderType, level, category: rider.name, items: rider.items, notes };
}

// ── Tool set for the AI SDK ──────────────────────────────────────────────────
// `update_epk` intentionally has no `execute`: it's a signal tool the client
// consumes directly (see the `tool-call` handling below), not something the
// model needs a result back for. Leaving it result-less means the AI SDK's
// step loop stops right after the model emits it — same as the old
// Claude/DeepSeek loops, which never fed it back into the conversation and
// simply ended the round once it (and nothing else) had been called.

// Raw JSON Schema objects (our tool defs predate the AI SDK and were written
// for Anthropic's `input_schema` shape, which is a plain JSON Schema — so
// `jsonSchema()` can wrap them directly with no zod conversion needed).
function schemaOf<T>(raw: unknown) {
  return jsonSchema<T>(raw as Parameters<typeof jsonSchema>[0]);
}

const AGENT_TOOLS = {
  update_epk: tool({
    description: EPK_UPDATE_TOOL.description,
    inputSchema: schemaOf<Record<string, unknown>>(EPK_UPDATE_TOOL.input_schema),
  }),
  fetch_spotify_data: tool({
    description: SPOTIFY_FETCH_TOOL.description,
    inputSchema: schemaOf<{ spotifyUrlOrId?: string }>(SPOTIFY_FETCH_TOOL.input_schema),
    execute: execFetchSpotifyData,
  }),
  scrape_social_profile: tool({
    description: SOCIAL_SCRAPE_TOOL.description,
    inputSchema: schemaOf<{ url?: string }>(SOCIAL_SCRAPE_TOOL.input_schema),
    execute: execScrapeSocialProfile,
  }),
  fetch_page: tool({
    description: FETCH_PAGE_TOOL.description,
    inputSchema: schemaOf<{ url?: string }>(FETCH_PAGE_TOOL.input_schema),
    execute: execFetchPage,
  }),
  add_rider: tool({
    description: ADD_RIDER_TOOL.description,
    inputSchema: schemaOf<{ riderType?: string; level?: string; notes?: string }>(ADD_RIDER_TOOL.input_schema),
    execute: execAddRider,
  }),
};

const MAX_ROUNDS = 5;

async function* streamGatewayAgent(
  messages: ModelMessage[]
): AsyncGenerator<{ type: string; data: unknown }> {
  const result = streamText({
    model: getModel(),
    providerOptions: gatewayProviderOptions,
    system: AGENT_SYSTEM_PROMPT,
    messages,
    tools: AGENT_TOOLS,
    stopWhen: stepCountIs(MAX_ROUNDS),
  });

  for await (const part of result.fullStream) {
    if (part.type === "text-delta") {
      if (part.text) yield { type: "text", data: part.text };
    } else if (part.type === "tool-call" && part.toolName === "update_epk") {
      yield { type: "epk_update", data: part.input };
    } else if (part.type === "tool-result" && part.toolName === "fetch_spotify_data") {
      yield { type: "spotify_data", data: part.output as Record<string, unknown> };
    } else if (part.type === "error") {
      throw part.error instanceof Error ? part.error : new Error(String(part.error));
    }
  }
}

// ── Known genres (must match wizard.tsx) ──────────────────────────────────────

const KNOWN_GENRES: Record<string, string[]> = {
  "Hip-Hop / Rap": ["hip-hop", "hip hop", "rap", "hiphop", "trap", "boom bap"],
  "R&B / Soul": ["r&b", "rnb", "r and b", "soul", "neo-soul", "neo soul"],
  "Electronic / EDM": ["electronic", "edm", "house", "techno", "dubstep", "drum and bass", "dnb", "trance"],
  "Pop": ["pop"],
  "Alternative / Indie Pop": ["indie", "indie pop", "alternative", "alt"],
  "Rock / Metal": ["rock", "metal", "punk", "grunge", "hard rock", "hardcore"],
  "Acoustic / Folk": ["folk", "acoustic", "singer-songwriter", "singer songwriter"],
  "Country / Americana": ["country", "americana", "bluegrass"],
  "Latin / Reggaeton": ["latin", "reggaeton", "bachata", "salsa", "dembow"],
  "Afrobeats / World": ["afrobeats", "afro", "world", "dancehall", "reggae", "soca"],
  "Jazz / Classical": ["jazz", "classical", "orchestral", "big band", "bebop"],
  "Ambient / Cinematic": ["ambient", "cinematic", "lo-fi", "lofi", "chillwave", "new age"],
};

function matchGenre(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [genre, keywords] of Object.entries(KNOWN_GENRES)) {
    for (const kw of keywords) {
      // Match the keyword as a whole word (not embedded in "professional" etc.)
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(lower)) return genre;
    }
  }
  return null;
}

// ── Intent detection ──────────────────────────────────────────────────────────

const INTENT_PATTERNS = [
  /\b(build|create|make|start|generate|need)\b.*\b(epk|press kit|booking kit|brand kit|one.?sheet)\b/i,
  /\b(i'd like|i want|i need|let's|help me)\b/i,
  /\b(get started|begin|new epk)\b/i,
];

function isIntentStatement(text: string): boolean {
  return INTENT_PATTERNS.some((p) => p.test(text));
}

// ── Phased fallback — the "offline assistant" ─────────────────────────────────
// Deliberately deterministic (no LLM call): guaranteed not to hallucinate
// genres/stats/etc, and guaranteed not to crash if the AI Gateway is
// unreachable or misconfigured. Kept exactly as-is.

async function* streamIntelligentFallback(
  messages: { role: string; content: string }[],
  epkData?: any
): AsyncGenerator<{ type: string; data: unknown }> {
  const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
  // Strip the injected context suffix before processing
  const text = lastUserMsg.replace(/\[EPK progress:[\s\S]*$/, "").replace(/\[REMEMBER:[\s\S]*$/, "").trim();
  const lower = text.toLowerCase();

  const patch: Record<string, any> = {};
  let reply = "";

  // ── Phase 0: Intent / greeting — never write data ──────────────────────────
  if (isIntentStatement(text) || lower.match(/^(hi|hello|hey|yo|sup|what's up|good morning|good evening)/)) {
    const name = epkData?.artistName;
    if (name) {
      reply = `Welcome back, ${name}! Let's keep building your press kit. What would you like to work on — bio, music links, social media, or template selection?`;
    } else {
      reply = `Welcome to the EPK Studio! I'm here to build your professional press kit. Let's start with the basics.\n\nWhat's your artist or stage name?`;
    }
  }

  // ── Phase 1: Artist name ───────────────────────────────────────────────────
  if (!reply && !epkData?.artistName) {
    // Only extract a name if the input looks like a name (short, no URLs, no questions)
    const cleaned = text.replace(/^(my name is|i'm|im|call me|artist name is|i go by|they call me)\s+/i, "").split(/[.,\n?!]/)[0].trim();
    if (cleaned && cleaned.length < 50 && cleaned.length > 0 && !cleaned.includes("http") && !cleaned.includes("?")) {
      patch.artistName = cleaned;
      reply = `Great to meet you, ${cleaned}! I've set your artist name.\n\nWhat genre of music do you make? For example: Hip-Hop, R&B, Pop, Rock, Electronic, Country, Jazz, or something else?`;
    } else {
      reply = `Let's get started! What's your artist or stage name?`;
    }
  }

  // ── Phase 2: Genre (strict enum matching) ──────────────────────────────────
  if (!reply && epkData?.artistName && !epkData?.genre) {
    const detectedGenre = matchGenre(text);
    if (detectedGenre) {
      patch.genre = detectedGenre;
      const name = epkData.artistName;
      reply = `I've set your genre to **${detectedGenre}**.\n\nWhere are you currently based, or what city is your hometown?`;
    } else {
      // Don't guess — ask again with options
      reply = `I didn't catch a specific genre from that. Which of these fits best?\n\nHip-Hop / Rap, R&B / Soul, Pop, Rock, Electronic / EDM, Country, Folk, Jazz, Latin, Afrobeats, Ambient, or Indie?\n\nYou can also tell me a more specific sub-genre.`;
    }
  }

  // ── Phase 3: Location ──────────────────────────────────────────────────────
  if (!reply && epkData?.artistName && epkData?.genre && !epkData?.hometown) {
    const locMatch = text.match(/^(?:i'm based in|based in|from|i live in|i'm from|located in)?\s*(.+)/i);
    const loc = locMatch ? locMatch[1].trim() : text.trim();
    if (loc && loc.length < 80 && loc.length > 1 && !loc.includes("http")) {
      patch.hometown = loc;
      reply = `Got it — **${loc}**! I've updated your location.\n\nWhat type of artist are you? For example: vocalist, producer, rapper, songwriter, DJ, instrumentalist, or multiple?`;
    } else {
      reply = `Where are you based? City and state (or country) works great.`;
    }
  }

  // ── Phase 4: Influences ────────────────────────────────────────────────────
  if (!reply && (lower.includes("influence") || lower.includes("inspired by") || lower.includes("sounds like"))) {
    const influences = text.replace(/^(my influences are|influenced by|inspired by|sounds like|i listen to)\s*/i, "")
      .split(/[,&]+|\band\b/i).map((s) => s.trim()).filter((s) => s.length > 0 && s.length < 60);
    if (influences.length > 0) {
      patch.influences = influences;
      reply = `Great influences — **${influences.join(", ")}**! I've added these to your artist profile.\n\nDo you have a Spotify artist link or any music links I should pull data from?`;
    }
  }

  // ── Phase 5: Email detection ───────────────────────────────────────────────
  if (!reply && text.includes("@")) {
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      patch.bookingEmail = emailMatch[0];
      reply = `I've set your booking contact to **${emailMatch[0]}**.\n\nWould you like to choose a template? Options are: Main EPK, Booking Kit, Brand Kit, One-Sheet, or Media/Press.`;
    }
  }

  // ── Phase 6: URL / link detection ──────────────────────────────────────────
  if (!reply && text.match(/https?:\/\//)) {
    // Don't process links in the fallback — tell the user we need AI for that
    reply = `I see you've shared a link! Unfortunately I'm running in offline mode right now and can't scan URLs. Please try again in a moment, or you can enter your information manually.\n\nWhat would you like to update on your EPK?`;
  }

  // ── Default: context-aware prompt ──────────────────────────────────────────
  if (!reply) {
    const name = epkData?.artistName;
    const genre = epkData?.genre;
    const hasStats = epkData?.stats && Object.keys(epkData.stats).length > 0;
    const hasBio = epkData?.bio && epkData.bio.length > 50;

    if (!name) {
      reply = `Let's build your press kit! What's your artist or stage name?`;
    } else if (!genre) {
      reply = `Thanks, ${name}! What genre of music do you make? For example: Hip-Hop, R&B, Pop, Rock, Electronic, Country, Jazz, or Indie?`;
    } else if (!epkData?.hometown) {
      reply = `Where are you based, ${name}? City and state works great.`;
    } else if (!hasBio) {
      reply = `Tell me about your journey as an artist — how did you get started, what drives your music, and what makes you unique? I'll use this to write a professional press bio for you.`;
    } else if (!hasStats) {
      reply = `Do you have any social media or streaming links? I can pull your follower counts and streaming stats automatically from Spotify, Instagram, YouTube, or TikTok.`;
    } else {
      reply = `Your EPK is coming together nicely, ${name}! What would you like to work on next — adding press quotes, career milestones, performance packages, or adjusting the design?`;
    }
  }

  // Yield patch if any fields updated
  if (Object.keys(patch).length > 0) {
    yield { type: "epk_update", data: patch };
  }

  // Stream text response smoothly
  const words = reply.split(" ");
  for (let i = 0; i < words.length; i += 3) {
    const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
    yield { type: "text", data: chunk };
    await new Promise((r) => setTimeout(r, 30));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ██ POST handler
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages, epkData } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages array is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const contextSuffix = epkData
    ? `\n\n[EPK progress: ${epkData.artistName || "no name yet"}, template: ${epkData.template || "main"}, fields set: artistName=${!!epkData.artistName} genre=${!!epkData.genre} bio=${!!epkData.bio} stats=${Object.keys(epkData.stats || {}).length} releases=${(epkData.releases || []).length} timeline=${(epkData.timeline || []).length} pressQuotes=${(epkData.pressQuotes || []).length} socialLinks=${Object.keys(epkData.socialLinks || {}).length} bookingEmail=${!!epkData.bookingEmail}]`
    : "";

  // Normalise messages — always inject a hidden instruction to keep the agent asking
  const normalised = messages.map((m: { role: string; content: string }, i: number) => {
    const isLastUser = m.role === "user" && i === messages.length - 1;
    let content = m.content;
    if (isLastUser) {
      content += contextSuffix;
      content += "\n\n[REMEMBER: End your response with exactly ONE question. Never end without asking what's next. If you just updated the EPK, ask the next question in the interview flow. If stuck, ask what genre they make.]";
    }
    return {
      role: m.role === "assistant" ? "assistant" : "user" as "user" | "assistant",
      content,
    };
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sendSSE(controller, encoder, { type: "status", status: "thinking" });

        // Build fallback provider chain: the AI Gateway first, and the
        // guaranteed-not-to-crash heuristic assistant as the last resort if
        // the Gateway is unreachable or misconfigured.
        const attempts: Array<{
          name: string;
          init: () => AsyncGenerator<{ type: string; data: unknown }>;
        }> = [
          { name: "AI Gateway", init: () => streamGatewayAgent(normalised as ModelMessage[]) },
          { name: "Artispreneur AI Assistant", init: () => streamIntelligentFallback(normalised, epkData) },
        ];

        let lastError: Error | null = null;
        let succeeded = false;

        for (const attempt of attempts) {
          try {
            const generator = attempt.init();
            sendSSE(controller, encoder, { type: "status", status: "building" });

            for await (const event of generator) {
              const key = event.type === "text" ? "content" : "patch";
              sendSSE(controller, encoder, { type: event.type, [key]: event.data });
            }

            succeeded = true;
            lastError = null;
            break;
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            const isLastAttempt = attempt === attempts[attempts.length - 1];

            if (!isLastAttempt) {
              // Keep provider error details in the server logs, not the chat
              console.error(`[agent] ${attempt.name} failed:`, lastError.message);
              sendSSE(controller, encoder, {
                type: "text",
                content: "(Switching to backup assistant for a moment.)\n\n",
              });
              continue;
            }
          }
        }

        if (!succeeded && lastError) {
          throw lastError;
        }

        sendSSE(controller, encoder, { type: "status", status: "done" });
        sendSSE(controller, encoder, { type: "done" });
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Agent request failed";
        const userMessage = `Error: ${message}`;
        sendSSE(controller, encoder, { type: "text", content: userMessage });
        sendSSE(controller, encoder, { type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
