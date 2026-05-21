import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AGENT_SYSTEM_PROMPT, EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL } from "@/lib/agent";
import { fetchSpotifyData } from "@/lib/spotify";
import { scrapeSocialProfile } from "@/lib/social-scraper";

// ── Provider helpers ───────────────────────────────────────────────────────────

function sendSSE(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: unknown) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

// ── Tool executor ──────────────────────────────────────────────────────────────

interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

async function executeTool(tool: ToolCall): Promise<string> {
  if (tool.name === "fetch_spotify_data") {
    const spotifyUrlOrId = tool.input.spotifyUrlOrId as string;
    if (!spotifyUrlOrId) return JSON.stringify({ error: "No Spotify URL or ID provided" });

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return JSON.stringify({ error: "Spotify API not configured", hint: "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET" });
    }

    try {
      const data = await fetchSpotifyData(spotifyUrlOrId);
      if (!data) return JSON.stringify({ error: "Could not fetch Spotify data — invalid artist ID or URL" });
      return JSON.stringify(data);
    } catch (err) {
      return JSON.stringify({ error: err instanceof Error ? err.message : "Spotify fetch failed" });
    }
  }

  if (tool.name === "scrape_social_profile") {
    const url = tool.input.url as string;
    if (!url) return JSON.stringify({ error: "No URL provided" });

    try {
      const data = await scrapeSocialProfile(url);
      return JSON.stringify(data);
    } catch (err) {
      return JSON.stringify({ error: err instanceof Error ? err.message : "Social scrape failed" });
    }
  }

  return JSON.stringify({ error: `Unknown tool: ${tool.name}` });
}

// ── Claude provider ────────────────────────────────────────────────────────────

const claude = process.env.ANTHROPIC_DIRECT_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_DIRECT_API_KEY, baseURL: "https://api.anthropic.com" })
  : new Anthropic();

const CLAUDE_MODEL = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL || "claude-sonnet-4-5";

const ALL_CLAUDE_TOOLS = [EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL] as Anthropic.Tool[];

async function* streamClaudeWithTools(
  messages: Anthropic.MessageParam[]
): AsyncGenerator<{ type: string; data: unknown }> {
  // We may need multiple rounds if tools are called
  let currentMessages = [...messages];
  let round = 0;
  const MAX_ROUNDS = 5;

  while (round < MAX_ROUNDS) {
    round++;

    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: AGENT_SYSTEM_PROMPT,
      tools: ALL_CLAUDE_TOOLS,
      messages: currentMessages,
      stream: true,
    });

    let currentToolName = "";
    let toolInputBuffer = "";
    let currentToolId = "";
    const toolCalls: ToolCall[] = [];
    let hasText = false;

    for await (const event of response) {
      switch (event.type) {
        case "content_block_start":
          if (event.content_block.type === "tool_use") {
            currentToolName = event.content_block.name;
            currentToolId = event.content_block.id;
            toolInputBuffer = "";
          }
          break;

        case "content_block_delta":
          if (event.delta.type === "text_delta") {
            hasText = true;
            yield { type: "text", data: event.delta.text };
          } else if (event.delta.type === "input_json_delta") {
            toolInputBuffer += event.delta.partial_json;
          }
          break;

        case "content_block_stop":
          if (currentToolName && toolInputBuffer) {
            try {
              const parsed = JSON.parse(toolInputBuffer);
              if (currentToolName === "update_epk") {
                yield { type: "epk_update", data: parsed };
              } else {
                toolCalls.push({ id: currentToolId, name: currentToolName, input: parsed });
              }
            } catch { /* skip malformed */ }
          }
          currentToolName = "";
          toolInputBuffer = "";
          currentToolId = "";
          break;

        case "message_stop":
          break;
      }
    }

    // If no tool calls that need resolution, we're done
    if (toolCalls.length === 0) break;

    // Execute tools and add results to the conversation
    for (const tool of toolCalls) {
      const result = await executeTool(tool);
      currentMessages.push({
        role: "assistant",
        content: [{ type: "tool_use", id: tool.id, name: tool.name, input: tool.input }],
      } as Anthropic.MessageParam);
      currentMessages.push({
        role: "user",
        content: [{ type: "tool_result", tool_use_id: tool.id, content: result }],
      } as Anthropic.MessageParam);

      // If it was a spotify fetch, also yield the data for the frontend
      if (tool.name === "fetch_spotify_data") {
        try {
          yield { type: "spotify_data", data: JSON.parse(result) };
        } catch {
          yield { type: "spotify_data", data: { error: result } };
        }
      }
    }
  }
}

// ── Gemini provider ────────────────────────────────────────────────────────────

const geminiKey = process.env.GEMINI_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

function geminiSchema() {
  const epkProps: Record<string, unknown> = {
    template: { type: SchemaType.STRING, enum: ["main", "booking", "brand"] },
    artistName: { type: SchemaType.STRING },
    artistTagline: { type: SchemaType.STRING },
    genre: { type: SchemaType.STRING },
    hometown: { type: SchemaType.STRING },
    bio: { type: SchemaType.STRING },
    shortBio: { type: SchemaType.STRING },
    heroImageUrl: { type: SchemaType.STRING },
    profileImageUrl: { type: SchemaType.STRING },
    youtubeVideoId: { type: SchemaType.STRING },
    spotifyArtistId: { type: SchemaType.STRING },
    bookingEmail: { type: SchemaType.STRING },
    bookingPhone: { type: SchemaType.STRING },
    accentColor: { type: SchemaType.STRING },
  };

  return [{
    functionDeclarations: [
      {
        name: "update_epk",
        description: "Update EPK fields. Call this to set or modify any field.",
        parameters: { type: SchemaType.OBJECT, properties: epkProps as Record<string, unknown> },
      },
    ],
  }];
}

async function* streamGemini(messages: { role: string; content: string }[], epkContext: string) {
  if (!genAI) throw new Error("Gemini not configured (GEMINI_API_KEY missing)");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: AGENT_SYSTEM_PROMPT,
    tools: geminiSchema() as object[],
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" as const : "user" as const,
    parts: [{ text: m.content }],
  }));

  const lastMsg = messages[messages.length - 1];
  const userPrompt = lastMsg ? lastMsg.content + epkContext : "";

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(userPrompt);

  for await (const chunk of result.stream) {
    const candidates = chunk.candidates;
    if (!candidates?.length) continue;

    for (const part of candidates[0]?.content?.parts || []) {
      if (part.text) yield { type: "text" as const, data: part.text };
      if (part.functionCall?.name === "update_epk") {
        const args = part.functionCall.args as Record<string, unknown> || {};
        const patch = Object.fromEntries(Object.entries(args).filter(([, v]) => v !== undefined));
        if (Object.keys(patch).length > 0) yield { type: "epk_update" as const, data: patch };
      }
    }
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

  const provider = process.env.AI_PROVIDER || "claude";
  const contextSuffix = epkData
    ? `\n\n[Current EPK state: ${JSON.stringify(epkData)}]`
    : "";

  // Normalise messages
  const normalised = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "assistant" : "user" as "user" | "assistant",
    content: m.role === "user" && m === messages[messages.length - 1]
      ? m.content + contextSuffix
      : m.content,
  }));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sendSSE(controller, encoder, { type: "status", status: "thinking" });

        const generator = provider === "gemini" && genAI
          ? streamGemini(normalised, contextSuffix)
          : streamClaudeWithTools(normalised as Anthropic.MessageParam[]);

        sendSSE(controller, encoder, { type: "status", status: "building" });

        for await (const event of generator) {
          const key = event.type === "text" ? "content" : "patch";
          sendSSE(controller, encoder, { type: event.type, [key]: event.data });
        }

        sendSSE(controller, encoder, { type: "status", status: "done" });
        sendSSE(controller, encoder, { type: "done" });
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Agent request failed";
        sendSSE(controller, encoder, { type: "text", content: `Error: ${message}` });
        sendSSE(controller, encoder, { type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
