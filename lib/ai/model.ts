import { createGateway } from "@ai-sdk/gateway";
import type { LanguageModel } from "ai";

// ── Vercel AI Gateway — single source of truth for model selection ────────────
// Every LLM call in this app goes through this one function. To point the app
// at a different model (e.g. a cheaper one, or a different provider entirely),
// set GATEWAY_MODEL — no code changes required.
//
// See .env.example for how to get an AI_GATEWAY_API_KEY.

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

const DEFAULT_MODEL_ID = process.env.GATEWAY_MODEL || "anthropic/claude-sonnet-5";

export function getModel(): LanguageModel {
  return gateway(DEFAULT_MODEL_ID);
}
