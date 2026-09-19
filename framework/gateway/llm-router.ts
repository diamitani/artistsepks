export type LLMProvider = "anthropic" | "openai" | "google" | "deepseek";

export interface GatewayModelConfig {
  provider: LLMProvider;
  model: string;
  temperature: number;
  maxTokens: number;
}

export const GATEWAY_CONFIG: Record<string, GatewayModelConfig> = {
  "default-agent": {
    provider: "anthropic",
    model: "claude-3-7-sonnet-20250219",
    temperature: 0.7,
    maxTokens: 4096,
  },
  "fast-interview": {
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    temperature: 0.5,
    maxTokens: 1024,
  },
  "deep-scorer": {
    provider: "google",
    model: "gemini-1.5-pro",
    temperature: 0.3,
    maxTokens: 2048,
  },
  "bio-polisher": {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 1500,
  },
};

export function resolveModel(routeKey: keyof typeof GATEWAY_CONFIG = "default-agent"): GatewayModelConfig {
  return GATEWAY_CONFIG[routeKey] || GATEWAY_CONFIG["default-agent"];
}
