/**
 * Vercel AI Gateway & OpenRouter Multi-Tier Provider — Artispreneur EPK Agent
 *
 * Tier Routing:
 * - Free Plan Users: OpenRouter Free Models (Qwen 2.5 72B Free, Llama 3.3 70B Free, Gemini 2.0 Flash Free)
 * - Paid / Subscriber Plan Users: Vercel AI Gateway / OpenRouter Paid Models (Qwen 2.5, DeepSeek, Claude, GPT-4o)
 * - Intelligent Built-in Fallback: Graceful local heuristic agent if external keys are missing.
 */

export interface GatewayMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
}

export interface GatewayTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface GatewayConfig {
  provider: "vercel" | "openrouter" | "deepseek" | "gemini" | "auto";
  isPaidUser?: boolean;
  model?: string;
}

export function getGatewayEndpoint(config: GatewayConfig): {
  url: string;
  apiKey: string;
  model: string;
  headers: Record<string, string>;
} {
  const isPaid = !!config.isPaidUser;

  // 1. Vercel AI Gateway
  if (process.env.VERCEL_AI_GATEWAY_KEY || process.env.AI_GATEWAY_KEY) {
    const key = process.env.VERCEL_AI_GATEWAY_KEY || process.env.AI_GATEWAY_KEY || "";
    const baseUrl = process.env.AI_GATEWAY_URL || "https://gateway.ai.vercel.com/v1";
    const model = isPaid
      ? (config.model || "qwen/qwen-2.5-72b-instruct")
      : "qwen/qwen-2.5-72b-instruct:free";

    return {
      url: `${baseUrl}/chat/completions`,
      apiKey: key,
      model,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
    };
  }

  // 2. OpenRouter (Supports free models and token allocation for paid subscriptions)
  if (process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY) {
    const key = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || "";
    const model = isPaid
      ? (config.model || "qwen/qwen-2.5-72b-instruct")
      : (config.model || "qwen/qwen-2.5-72b-instruct:free");

    return {
      url: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: key,
      model,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://artistsepks.com",
        "X-Title": "Artispreneur EPK Agent",
      },
    };
  }

  // 3. DeepSeek Direct
  if (process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY) {
    const key = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY || "";
    return {
      url: "https://api.deepseek.com/v1/chat/completions",
      apiKey: key,
      model: "deepseek-chat",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
    };
  }

  // 4. Default OpenRouter Fallback endpoint
  return {
    url: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: "free",
    model: "qwen/qwen-2.5-72b-instruct:free",
    headers: {
      "Content-Type": "application/json",
      "HTTP-Referer": "https://artistsepks.com",
      "X-Title": "Artispreneur EPK Agent",
    },
  };
}

export function isAnyProviderConfigured(): boolean {
  return !!(
    process.env.VERCEL_AI_GATEWAY_KEY ||
    process.env.AI_GATEWAY_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.ANTHROPIC_API_KEY
  );
}
