import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AGENT_SYSTEM_PROMPT, EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL, FETCH_PAGE_TOOL, ADD_RIDER_TOOL } from "@/lib/agent";
import { fetchSpotifyData } from "@/lib/spotify";
import { scrapeSocialProfile } from "@/lib/social-scraper";
import { fetchPageText } from "@/lib/fetch-page";
import { getRiderById, getRiderSet } from "@/lib/riders";
import { streamDeepSeek, isConfigured as deepSeekConfigured, type DeepSeekTool } from "@/lib/deepseek";

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

  if (tool.name === "fetch_page") {
    const url = tool.input.url as string;
    if (!url) return JSON.stringify({ error: "No URL provided" });
    try {
      const text = await fetchPageText(url);
      return JSON.stringify({ url, content: text.slice(0, 8000) });
    } catch (err) {
      return JSON.stringify({ error: err instanceof Error ? err.message : "Page fetch failed" });
    }
  }

  if (tool.name === "add_rider") {
    const riderType = tool.input.riderType as string;
    const level = tool.input.level as string;
    const notes = tool.input.notes as string || "";
    const set = riderType === "backline" ? (level === "full" ? "festival" : "club") : "club";
    const riders = getRiderSet(riderType === "backline" ? "club" : "club");
    const rider = riders.find((r) => r.id.includes(riderType));
    if (!rider) return JSON.stringify({ error: `No rider found for ${riderType} ${level}` });
    return JSON.stringify({
      riderType,
      level,
      category: rider.name,
      items: rider.items,
      notes,
    });
  }

  return JSON.stringify({ error: `Unknown tool: ${tool.name}` });
}

// ── Claude provider ────────────────────────────────────────────────────────────

const CLAUDE_MODEL = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL || "claude-sonnet-4-5";
const ALL_CLAUDE_TOOLS = [EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL, FETCH_PAGE_TOOL, ADD_RIDER_TOOL] as Anthropic.Tool[];

// Lazy init — only construct if Claude is actually used
let _claude: Anthropic | null = null;
function getClaude(): Anthropic {
  if (!_claude) {
    const apiKey = process.env.ANTHROPIC_DIRECT_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_DIRECT_API_KEY or ANTHROPIC_API_KEY, or use AI_PROVIDER=gemini");
    }
    _claude = new Anthropic({
      apiKey,
      baseURL: process.env.ANTHROPIC_DIRECT_API_KEY ? "https://api.anthropic.com" : undefined,
    });
  }
  return _claude;
}

async function* streamClaudeWithTools(
  messages: Anthropic.MessageParam[]
): AsyncGenerator<{ type: string; data: unknown }> {
  // We may need multiple rounds if tools are called
  let currentMessages = [...messages];
  let round = 0;
  const MAX_ROUNDS = 5;

  while (round < MAX_ROUNDS) {
    round++;

    const claude = getClaude();
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

// ── DeepSeek provider ──────────────────────────────────────────────────────────

function deepSeekTools(): DeepSeekTool[] {
  const updateEpk: DeepSeekTool = {
    type: "function",
    function: {
      name: "update_epk",
      description: "Update the artist's Electronic Press Kit data. Call this to set or modify any field on the EPK.",
      parameters: {
        type: "object",
        properties: {
          template: { type: "string", enum: ["main", "booking", "brand"] },
          artistName: { type: "string" },
          artistTagline: { type: "string" },
          genre: { type: "string" },
          hometown: { type: "string" },
          bio: { type: "string" },
          shortBio: { type: "string" },
          heroImageUrl: { type: "string" },
          profileImageUrl: { type: "string" },
          youtubeVideoId: { type: "string" },
          spotifyArtistId: { type: "string" },
          bookingEmail: { type: "string" },
          stats: {
            type: "object",
            properties: {
              spotifyListeners: { type: "string" },
              youtubeSubscribers: { type: "string" },
              youtubeViews: { type: "string" },
              tiktokViews: { type: "string" },
              instagramFollowers: { type: "string" },
            },
          },
          releases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                type: { type: "string", enum: ["Album", "EP", "Single", "Mixtape"] },
                year: { type: "string" },
                tracks: { type: "number" },
                certification: { type: "string" },
                coverUrl: { type: "string" },
              },
              required: ["title", "type", "year"],
            },
          },
          timeline: {
            type: "array",
            items: {
              type: "object",
              properties: {
                year: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
              },
              required: ["year", "title", "description"],
            },
          },
          pressQuotes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                quote: { type: "string" },
                publication: { type: "string" },
              },
              required: ["quote", "publication"],
            },
          },
          socialLinks: {
            type: "object",
            properties: {
              instagram: { type: "string" },
              twitter: { type: "string" },
              tiktok: { type: "string" },
              youtube: { type: "string" },
              spotify: { type: "string" },
              website: { type: "string" },
            },
          },
          accentColor: { type: "string" },
        },
      },
    },
  };

  const spotifyTool: DeepSeekTool = {
    type: "function",
    function: {
      name: "fetch_spotify_data",
      description: "Fetch artist data from Spotify including discography, top tracks, genres, and follower count.",
      parameters: {
        type: "object",
        properties: {
          spotifyUrlOrId: { type: "string", description: "Spotify artist URL or ID" },
        },
        required: ["spotifyUrlOrId"],
      },
    },
  };

  const fetchPageTool: DeepSeekTool = {
    type: "function",
    function: {
      name: "fetch_page",
      description: "Read the text content of a web page or URL.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL to fetch" },
        },
        required: ["url"],
      },
    },
  };

  const socialScrapeTool: DeepSeekTool = {
    type: "function",
    function: {
      name: "scrape_social_profile",
      description: "Scrape follower counts and engagement data from a social media profile URL.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "Social media profile URL" },
        },
        required: ["url"],
      },
    },
  };

  const addRiderTool: DeepSeekTool = {
    type: "function",
    function: {
      name: "add_rider",
      description: "Add a technical rider (sound, lighting, backline, hospitality) to the EPK.",
      parameters: {
        type: "object",
        properties: {
          riderType: { type: "string", enum: ["backline", "sound", "lighting", "hospitality"] },
          level: { type: "string", enum: ["basic", "full"] },
          notes: { type: "string" },
        },
        required: ["riderType", "level"],
      },
    },
  };

  return [updateEpk, spotifyTool, fetchPageTool, socialScrapeTool, addRiderTool];
}

async function* streamDeepSeekProvider(
  messages: { role: string; content: string }[],
  epkContext: string
): AsyncGenerator<{ type: string; data: unknown }> {
  if (!deepSeekConfigured()) {
    throw new Error("DeepSeek API key not configured. Set DEEPSEEK_API_KEY in your environment.");
  }

  const tools = deepSeekTools();
  const normalised = messages.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.role === "user" && m === messages[messages.length - 1]
      ? m.content + epkContext
      : m.content,
  }));

  // We handle tool calls in a loop (multi-round)
  let currentMessages: any[] = [...normalised];
  let round = 0;
  const MAX_ROUNDS = 5;

  while (round < MAX_ROUNDS) {
    round++;

    const generator = streamDeepSeek(currentMessages, tools, AGENT_SYSTEM_PROMPT);
    const toolCalls: Array<{ id: string; name: string; input: unknown }> = [];

    for await (const event of generator) {
      if (event.type === "text") {
        yield { type: "text", data: event.data };
      } else if (event.type === "tool_call") {
        const tc = event.data as { id: string; name: string; input: unknown };
        if (tc.name === "update_epk") {
          yield { type: "epk_update", data: tc.input };
        } else {
          toolCalls.push(tc);
        }
      } else if (event.type === "done") {
        // Stream finished
      }
    }

    if (toolCalls.length === 0) break;

    // Execute tools and continue the conversation
    for (const tc of toolCalls) {
      const result = await executeTool(tc as ToolCall);
      currentMessages.push({
        role: "assistant",
        content: "",
        tool_calls: [{ id: tc.id, type: "function" as const, function: { name: tc.name, arguments: JSON.stringify(tc.input) } }],
      } as any);
      currentMessages.push({
        role: "tool",
        content: result,
        tool_call_id: tc.id,
      } as any);

      if (tc.name === "fetch_spotify_data") {
        try { yield { type: "spotify_data", data: JSON.parse(result) }; }
        catch { yield { type: "spotify_data", data: { error: result } }; }
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

        let generator;
        if (provider === "deepseek") {
          if (!deepSeekConfigured()) {
            throw new Error("DeepSeek selected (AI_PROVIDER=deepseek) but DEEPSEEK_API_KEY is not configured");
          }
          generator = streamDeepSeekProvider(normalised, contextSuffix);
        } else if (provider === "gemini" && genAI) {
          generator = streamGemini(normalised, contextSuffix);
        } else if (provider === "gemini" && !genAI) {
          throw new Error("Gemini selected (AI_PROVIDER=gemini) but GEMINI_API_KEY is not configured");
        } else {
          generator = streamClaudeWithTools(normalised as Anthropic.MessageParam[]);
        }

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
