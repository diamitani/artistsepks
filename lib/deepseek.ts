// ── DeepSeek API Provider ─────────────────────────────────────────────────────
// OpenAI-compatible API. Uses raw fetch — no SDK needed.

const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
}

export interface DeepSeekTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface DeepSeekDelta {
  role?: string;
  content?: string | null;
  tool_calls?: Array<{
    index: number;
    id?: string;
    type?: "function";
    function?: { name?: string; arguments?: string };
  }>;
}

export interface DeepSeekChunk {
  choices: Array<{
    delta: DeepSeekDelta;
    finish_reason: string | null;
    index: number;
  }>;
}

export function getKey(): string {
  const key = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY not configured");
  return key;
}

export function isConfigured(): boolean {
  return !!(process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY);
}

// ── Streaming chat completion with tool support ───────────────────────────────

export async function* streamDeepSeek(
  messages: DeepSeekMessage[],
  tools: DeepSeekTool[],
  systemPrompt: string
): AsyncGenerator<{ type: "text" | "tool_call" | "done"; data: unknown }> {
  const allMessages: DeepSeekMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const body: Record<string, unknown> = {
    model: DEEPSEEK_MODEL,
    messages: allMessages,
    stream: true,
    max_tokens: 8192,
    ...(tools.length > 0 ? { tools } : {}),
  };

  const res = await fetch(DEEPSEEK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`DeepSeek API error ${res.status}: ${err.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("DeepSeek stream not available");

  const decoder = new TextDecoder();
  let buffer = "";

  // Accumulate tool call arguments across chunks
  const toolCalls: Map<number, { id: string; name: string; args: string }> = new Map();

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
      if (payload === "[DONE]") {
        yield { type: "done", data: null };
        return;
      }

      try {
        const chunk: DeepSeekChunk = JSON.parse(payload);
        for (const choice of chunk.choices) {
          const delta = choice.delta;

          // Text content
          if (delta.content) {
            yield { type: "text", data: delta.content };
          }

          // Tool calls
          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              if (!toolCalls.has(tc.index)) {
                toolCalls.set(tc.index, {
                  id: tc.id || `call_${tc.index}`,
                  name: tc.function?.name || "",
                  args: "",
                });
              }
              const existing = toolCalls.get(tc.index)!;
              if (tc.function?.name) existing.name = tc.function.name;
              if (tc.function?.arguments) existing.args += tc.function.arguments;
            }
          }
        }

        // When finish_reason is "tool_calls", yield completed tool calls
        for (const choice of chunk.choices) {
          if (choice.finish_reason === "tool_calls") {
            for (const [idx, tc] of toolCalls) {
              try {
                const parsed = JSON.parse(tc.args);
                yield {
                  type: "tool_call",
                  data: { id: tc.id, name: tc.name, input: parsed },
                };
              } catch {
                yield {
                  type: "tool_call",
                  data: { id: tc.id, name: tc.name, input: tc.args },
                };
              }
            }
            toolCalls.clear();
          }
        }
      } catch {
        // Skip malformed JSON chunks
      }
    }
  }
}
