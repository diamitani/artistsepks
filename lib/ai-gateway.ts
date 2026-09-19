/**
 * Vercel AI Gateway Integration — Artispreneur
 * Provides routed, cached, and unified LLM access through Vercel AI Gateway.
 */

export const VERCEL_AI_GATEWAY_CONFIG = {
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY || "",
  baseUrl: process.env.AI_GATEWAY_URL || "https://gateway.ai.vercel.com/v1",
  defaultModel: "anthropic/claude-3-5-sonnet-20241022",
  backupModel: "openai/gpt-4o",
};

export interface AIGatewayMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIGatewayRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * Execute chat completion through the Vercel AI Gateway
 */
export async function fetchAIGatewayChat(
  messages: AIGatewayMessage[],
  options: AIGatewayRequestOptions = {}
) {
  const model = options.model || VERCEL_AI_GATEWAY_CONFIG.defaultModel;
  const apiKey = VERCEL_AI_GATEWAY_CONFIG.apiKey;
  const baseUrl = VERCEL_AI_GATEWAY_CONFIG.baseUrl;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: options.stream ?? false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vercel AI Gateway error (${response.status}): ${errorText}`);
  }

  return response;
}
