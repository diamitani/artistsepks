import { NextRequest } from "next/server";
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { AGENT_SYSTEM_PROMPT, EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL, FETCH_PAGE_TOOL, ADD_RIDER_TOOL } from "@/lib/agent";
import { buildEPKSystemInstructions, palCompile, ALL_EPK_TOOLS, isBedrockConfigured } from "@/lib/bedrock-agent";
import { isConfigured as isDeepSeekConfigured, streamDeepSeek, type DeepSeekMessage } from "@/lib/deepseek";
import { fetchSpotifyData } from "@/lib/spotify";
import { scrapeSocialProfile } from "@/lib/social-scraper";
import { fetchPageText } from "@/lib/fetch-page";
import { getRiderById, getRiderSet } from "@/lib/riders";

// ── SSE helper ────────────────────────────────────────────────────────────────
function sendSSE(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: unknown) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

// ── Tool executor ─────────────────────────────────────────────────────────────
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
    if (!clientId || !clientSecret) return JSON.stringify({ error: "Spotify API not configured" });
    try {
      const data = await fetchSpotifyData(spotifyUrlOrId);
      if (!data) return JSON.stringify({ error: "Could not fetch Spotify data" });
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
    const { riderType, level, notes } = tool.input as { riderType: string; level: string; notes?: string };
    try {
      // getRiderSet takes a preset key like "club" | "theater" | "festival"
      // Map riderType+level to the closest preset
      const presetKey = level === "full" ? "festival" : "club";
      const riderSet = getRiderSet(presetKey as "club" | "theater" | "festival" | "custom");
      // Also get individual rider by id if available
      const riderId = `${riderType}-${level}`;
      const singleRider = getRiderById(riderId);
      const items = singleRider ? [singleRider] : riderSet;
      return JSON.stringify({ riderType, level, items, notes: notes || "" });
    } catch {
      return JSON.stringify({ error: "Invalid rider type or level" });
    }
  }

  if (tool.name === "update_epk") {
    return JSON.stringify({ success: true, patch: tool.input });
  }

  return JSON.stringify({ error: `Unknown tool: ${tool.name}` });
}

// ── PAL compile endpoint ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const artistName = url.searchParams.get("artist") || undefined;
  const genre = url.searchParams.get("genre") || undefined;
  const goal = url.searchParams.get("goal") || undefined;
  const template = (url.searchParams.get("template") || "main") as "main" | "booking" | "brand";

  try {
    const palResult = await palCompile({ artistName, genre, goal, templateHint: template });
    return Response.json({ success: true, pal: palResult });
  } catch (err) {
    return Response.json({ error: "PAL compile failed", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// ── Main agent streaming endpoint ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { messages, epkData, template, runPAL, palResult } = await req.json();

  // Validate
  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing messages", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Step 1: Run PAL compile if this is the first message
        if (runPAL) {
          sendSSE(controller, encoder, { type: "status", status: "thinking" });
          const pal = await palCompile({
            artistName: epkData?.artistName,
            genre: epkData?.genre,
            goal: epkData?.goal,
            templateHint: template || "main",
          });
          sendSSE(controller, encoder, { type: "pal_compile", pal });
        }

        // Step 2: Build system instructions with PAL context + design style
        const systemInstructions = buildEPKSystemInstructions({
          template: template || "main",
          artistName: epkData?.artistName,
          genre: epkData?.genre,
          accentColor: epkData?.accentColor,
          palCompileResult: palResult,
        });

        sendSSE(controller, encoder, { type: "status", status: "building" });

        // Step 3: Route to DeepSeek → Anthropic → Bedrock
        if (isDeepSeekConfigured()) {
          await streamWithDeepSeek(messages, systemInstructions, controller, encoder);
        } else if (process.env.ANTHROPIC_API_KEY) {
          await streamWithAnthropic(messages, systemInstructions, controller, encoder);
        } else if (isBedrockConfigured()) {
          await streamWithBedrock(messages, systemInstructions, controller, encoder);
        } else {
          sendSSE(controller, encoder, {
            type: "text",
            content: "No AI provider configured. Set DEEPSEEK_API_KEY, ANTHROPIC_API_KEY, or AWS credentials.",
          });
        }
      } catch (err) {
        console.error("Agent error:", err);
        sendSSE(controller, encoder, {
          type: "text",
          content: "I ran into an error. Please try again.",
        });
        sendSSE(controller, encoder, { type: "done" });
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

// ── Bedrock streaming ─────────────────────────────────────────────────────────
async function streamWithBedrock(
  messages: unknown[],
  systemInstructions: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2048,
    system: systemInstructions,
    messages,
    tools: ALL_EPK_TOOLS,
  };

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6",
    body: JSON.stringify(body),
    contentType: "application/json",
    accept: "application/json",
  });

  const response = await client.send(command);
  if (!response.body) {
    sendSSE(controller, encoder, { type: "done" });
    controller.close();
    return;
  }

  let toolUseId = "";
  let toolName = "";
  let toolInputStr = "";
  const pendingToolUse: ToolCall[] = [];

  for await (const event of response.body) {
    if (!event.chunk?.bytes) continue;
    const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));

    if (chunk.type === "content_block_start") {
      if (chunk.content_block?.type === "tool_use") {
        toolUseId = chunk.content_block.id || "";
        toolName = chunk.content_block.name || "";
        toolInputStr = "";
      }
    } else if (chunk.type === "content_block_delta") {
      if (chunk.delta?.type === "text_delta") {
        sendSSE(controller, encoder, { type: "text", content: chunk.delta.text });
      } else if (chunk.delta?.type === "input_json_delta") {
        toolInputStr += chunk.delta.partial_json || "";
      }
    } else if (chunk.type === "content_block_stop") {
      if (toolName) {
        let toolInput: Record<string, unknown> = {};
        try { toolInput = JSON.parse(toolInputStr); } catch { /* */ }
        pendingToolUse.push({ id: toolUseId, name: toolName, input: toolInput });
        toolName = "";
        toolInputStr = "";
        toolUseId = "";
      }
    } else if (chunk.type === "message_stop") {
      // Execute pending tool calls
      for (const tool of pendingToolUse) {
        const result = await executeTool(tool);

        if (tool.name === "update_epk") {
          let patch: Record<string, unknown> = {};
          try { patch = JSON.parse(result); } catch { /* */ }
          if (patch.success && patch.patch) {
            sendSSE(controller, encoder, { type: "epk_update", patch: patch.patch });
          }
        } else if (tool.name === "fetch_spotify_data") {
          sendSSE(controller, encoder, { type: "spotify_data", data: JSON.parse(result) });
        }
      }
    }
  }

  sendSSE(controller, encoder, { type: "status", status: "done" });
  sendSSE(controller, encoder, { type: "done" });
  controller.close();
}

// ── DeepSeek streaming ────────────────────────────────────────────────────────
async function streamWithDeepSeek(
  messages: unknown[],
  systemInstructions: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  // Convert Anthropic-format tools to DeepSeek/OpenAI format
  const deepSeekTools = ALL_EPK_TOOLS.map((t) => {
    const tool = t as { name: string; description: string; input_schema: Record<string, unknown> };
    return {
      type: "function" as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input_schema,
      },
    };
  });

  // Convert messages to DeepSeek format (text-only content)
  const deepSeekMessages: DeepSeekMessage[] = messages.map((m) => {
    const msg = m as { role: string; content: string };
    return {
      role: msg.role as DeepSeekMessage["role"],
      content: msg.content,
    };
  });

  let hasSentText = false;
  const pendingToolCalls: ToolCall[] = [];

  try {
    for await (const chunk of streamDeepSeek(deepSeekMessages, deepSeekTools, systemInstructions)) {
      if (chunk.type === "text" && typeof chunk.data === "string") {
        sendSSE(controller, encoder, { type: "text", content: chunk.data });
        hasSentText = true;
      } else if (chunk.type === "tool_call") {
        const tc = chunk.data as ToolCall;
        pendingToolCalls.push(tc);
      } else if (chunk.type === "done") {
        // Execute all pending tool calls
        for (const tool of pendingToolCalls) {
          const result = await executeTool(tool);
          if (tool.name === "update_epk") {
            let patch: Record<string, unknown> = {};
            try { patch = JSON.parse(result); } catch { /* */ }
            if (patch.success && patch.patch) {
              sendSSE(controller, encoder, { type: "epk_update", patch: patch.patch });
            }
          } else if (tool.name === "fetch_spotify_data") {
            sendSSE(controller, encoder, { type: "spotify_data", data: JSON.parse(result) });
          }
        }
      }
    }

    // If no text was sent at all (edge case), send a fallback
    if (!hasSentText) {
      sendSSE(controller, encoder, {
        type: "text",
        content: "I processed your request. What would you like to do next?",
      });
    }
  } catch (err) {
    console.error("DeepSeek streaming error:", err);
    sendSSE(controller, encoder, {
      type: "text",
      content: "I hit a snag processing that. Can you try again?",
    });
  } finally {
    sendSSE(controller, encoder, { type: "status", status: "done" });
    sendSSE(controller, encoder, { type: "done" });
    controller.close();
  }
}

// ── Anthropic fallback ────────────────────────────────────────────────────────
async function streamWithAnthropic(
  messages: unknown[],
  systemInstructions: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    sendSSE(controller, encoder, { type: "text", content: "AI provider not configured. Please set AWS credentials or ANTHROPIC_API_KEY." });
    sendSSE(controller, encoder, { type: "done" });
    controller.close();
    return;
  }

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemInstructions,
    messages: messages as Parameters<typeof client.messages.stream>[0]["messages"],
    tools: ALL_EPK_TOOLS as Parameters<typeof client.messages.stream>[0]["tools"],
  });

  let pendingToolUse: ToolCall | null = null;
  let toolInputStr = "";

  for await (const event of stream) {
    if (event.type === "content_block_start" && event.content_block?.type === "tool_use") {
      pendingToolUse = {
        id: event.content_block.id,
        name: event.content_block.name,
        input: {},
      };
      toolInputStr = "";
    } else if (event.type === "content_block_delta") {
      if (event.delta?.type === "text_delta") {
        sendSSE(controller, encoder, { type: "text", content: event.delta.text });
      } else if (event.delta?.type === "input_json_delta" && pendingToolUse) {
        toolInputStr += event.delta.partial_json || "";
      }
    } else if (event.type === "content_block_stop" && pendingToolUse) {
      try { pendingToolUse.input = JSON.parse(toolInputStr); } catch { /* */ }
      const result = await executeTool(pendingToolUse);
      if (pendingToolUse.name === "update_epk") {
        let patch: Record<string, unknown> = {};
        try { patch = JSON.parse(result); } catch { /* */ }
        if (patch.success && patch.patch) {
          sendSSE(controller, encoder, { type: "epk_update", patch: patch.patch });
        }
      }
      pendingToolUse = null;
    }
  }

  sendSSE(controller, encoder, { type: "status", status: "done" });
  sendSSE(controller, encoder, { type: "done" });
  controller.close();
}
