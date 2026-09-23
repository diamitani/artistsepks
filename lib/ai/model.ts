import { createGateway, type GatewayProviderOptions } from "@ai-sdk/gateway";
import type { LanguageModel } from "ai";

// ── Vercel AI Gateway — single source of truth for model selection ────────────
// Every LLM call in this app goes through this file. To point the app at a
// different model (e.g. a cheaper one, or a different provider entirely), set
// GATEWAY_MODEL — no code changes required.
//
// Base model is Kimi (Moonshot AI). If the primary model errors or is down,
// the Gateway itself retries the request on the fallback models in order.
//
// See .env.example for how to get an AI_GATEWAY_API_KEY.

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export const BASE_MODEL_ID = "moonshotai/kimi-k3";
const SECONDARY_MODEL_ID = "anthropic/claude-sonnet-5";

export const PRIMARY_MODEL_ID = process.env.GATEWAY_MODEL?.trim() || BASE_MODEL_ID;

// Comma-separated list in GATEWAY_FALLBACK_MODELS overrides the defaults.
// Default: Kimi is always a fallback when it isn't the primary; otherwise Claude.
export const FALLBACK_MODEL_IDS = (
  process.env.GATEWAY_FALLBACK_MODELS
    ? process.env.GATEWAY_FALLBACK_MODELS.split(",")
    : [BASE_MODEL_ID, SECONDARY_MODEL_ID]
)
  .map((id) => id.trim())
  .filter((id) => id && id !== PRIMARY_MODEL_ID);

export function getModel(): LanguageModel {
  return gateway(PRIMARY_MODEL_ID);
}

// Pass as `providerOptions` to streamText / generateText so the Gateway can
// fail over to the fallback models.
export const gatewayProviderOptions = {
  gateway: { models: FALLBACK_MODEL_IDS } satisfies GatewayProviderOptions,
};
