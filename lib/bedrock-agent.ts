/**
 * AWS Bedrock AgentCore Client
 * Powers the EPK AI agent via Claude 3.5 Sonnet on AWS Bedrock
 * Falls back to Anthropic SDK if Bedrock is not configured
 */
import { AGENT_SYSTEM_PROMPT, EPK_UPDATE_TOOL, SPOTIFY_FETCH_TOOL, SOCIAL_SCRAPE_TOOL, FETCH_PAGE_TOOL, ADD_RIDER_TOOL } from "./agent";

// ── Bedrock config ─────────────────────────────────────────────────────────────
export const BEDROCK_CONFIG = {
  region: process.env.AWS_REGION || "us-east-1",
  modelId: process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

export function isBedrockConfigured(): boolean {
  return !!(BEDROCK_CONFIG.accessKeyId && BEDROCK_CONFIG.secretAccessKey);
}

// ── Message types ─────────────────────────────────────────────────────────────
export interface BedrockMessage {
  role: "user" | "assistant";
  content: string | BedrockContentBlock[];
}

export interface BedrockContentBlock {
  type: "text" | "tool_use" | "tool_result";
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: string | Array<{ type: string; text?: string }>;
}

// ── PAL Compile function ───────────────────────────────────────────────────────
/**
 * PAL = Prompt Abstraction Layer
 * Compiles a vague user request into a precise EPK build plan
 * This runs BEFORE the main agent interview begins
 */
export async function palCompile(input: {
  artistName?: string;
  genre?: string;
  goal?: string;
  notes?: string;
  templateHint?: string;
}): Promise<{
  siteType: string;
  primaryUser: string;
  goalOfEPK: string;
  toneVibe: string;
  template: "main" | "booking" | "brand";
  v1Sections: string[];
  v11Skips: string[];
  aestheticDirection: string;
  onboardingQuestion: string;
}> {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import("@aws-sdk/client-bedrock-runtime");

  const client = new BedrockRuntimeClient({
    region: BEDROCK_CONFIG.region,
    credentials: {
      accessKeyId: BEDROCK_CONFIG.accessKeyId,
      secretAccessKey: BEDROCK_CONFIG.secretAccessKey,
    },
  });

  const palPrompt = `You are running PAL (Prompt Abstraction Layer) for an EPK (Electronic Press Kit) builder.

PAL COMPILE:
Artist name: ${input.artistName || "unknown"}
Genre/style: ${input.genre || "unknown"}
Goal: ${input.goal || "general EPK"}
Notes: ${input.notes || "none"}
Template hint: ${input.templateHint || "main"}

Based on this context, output a JSON object with these exact fields:
{
  "siteType": "Portfolio/Tool",
  "primaryUser": "who will view this EPK",
  "goalOfEPK": "what the EPK must make them do",
  "toneVibe": "editorial dark, bold, minimal, etc.",
  "template": "main|booking|brand",
  "v1Sections": ["list of sections to build now"],
  "v11Skips": ["nice-to-haves for later"],
  "aestheticDirection": "Editorial Dark with gold accents",
  "onboardingQuestion": "The FIRST question to ask the artist to begin their EPK interview"
}

Output ONLY the JSON, no markdown, no explanation.`;

  try {
    const command = new InvokeModelCommand({
      modelId: BEDROCK_CONFIG.modelId,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 800,
        messages: [{ role: "user", content: palPrompt }],
      }),
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await client.send(command);
    const body = JSON.parse(new TextDecoder().decode(response.body));
    const text = body.content?.[0]?.text || "{}";

    // Strip markdown fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("PAL compile error:", err);
    // Return sensible defaults
    return {
      siteType: "Portfolio/Tool",
      primaryUser: "Media, labels, and venues",
      goalOfEPK: "Book shows and get press coverage",
      toneVibe: "Editorial dark with gold accents",
      template: (input.templateHint as "main" | "booking" | "brand") || "main",
      v1Sections: ["Hero", "Stats", "Bio", "Music", "Discography", "Timeline", "Press", "Social", "CTA"],
      v11Skips: ["Analytics", "Custom domain", "Animation upgrades"],
      aestheticDirection: "Editorial Dark — dark charcoal background, gold accent, music industry gravitas",
      onboardingQuestion: `Let's build your EPK. What's your artist name${input.artistName ? ` — is ${input.artistName} the name you go by professionally?` : "?"}`,
    };
  }
}

// ── Bedrock streaming agent ────────────────────────────────────────────────────
export async function* streamBedrockAgent(
  messages: BedrockMessage[],
  systemPrompt?: string,
  tools?: unknown[]
): AsyncGenerator<{ type: string; [key: string]: unknown }> {
  const { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } = await import("@aws-sdk/client-bedrock-runtime");

  const client = new BedrockRuntimeClient({
    region: BEDROCK_CONFIG.region,
    credentials: {
      accessKeyId: BEDROCK_CONFIG.accessKeyId,
      secretAccessKey: BEDROCK_CONFIG.secretAccessKey,
    },
  });

  const body: Record<string, unknown> = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2048,
    messages,
    system: systemPrompt || AGENT_SYSTEM_PROMPT,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
  }

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: BEDROCK_CONFIG.modelId,
    body: JSON.stringify(body),
    contentType: "application/json",
    accept: "application/json",
  });

  const response = await client.send(command);

  if (!response.body) return;

  for await (const event of response.body) {
    if (event.chunk?.bytes) {
      const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
      yield chunk;
    }
  }
}

// ── Build full EPK system instructions using design style templates ───────────
export function buildEPKSystemInstructions(opts: {
  template: "main" | "booking" | "brand";
  artistName?: string;
  genre?: string;
  accentColor?: string;
  palCompileResult?: Record<string, unknown>;
}): string {
  const templateDescriptions = {
    main: "Main EPK — full artist profile for media, labels, and venues. Sections: Hero, Stats, Bio, Music, Discography, Timeline, Press Quotes, Social, CTA.",
    booking: "Booking Kit — for promoters and talent buyers. Sections: Hero, Performance Packages, Technical Rider, Stats, Show History, Booking CTA.",
    brand: "Brand Kit — for sponsors and brand partnerships. Sections: Hero, Value Props, Audience Data, Past Collabs, Partnership Tiers, Inquiry CTA.",
  };

  const aestheticGuidelines = {
    main: "Editorial Dark: dark charcoal (#111) background, gold (#C9A227) accent, Cormorant Garamond display font, DM Mono body. Music industry gravitas.",
    booking: "Bold SaaS: dark bg, crimson (#C8102E) accent, Bebas Neue headlines, clean data-forward layout for promoters.",
    brand: "Luxury Minimal: white/cream bg, gold (#C9A227) accent, editorial serif display, refined whitespace. Brand partnership energy.",
  };

  return `${AGENT_SYSTEM_PROMPT}

--- EPK CONSTRUCTION CONTEXT ---

TEMPLATE: ${opts.template.toUpperCase()} — ${templateDescriptions[opts.template]}
${opts.artistName ? `ARTIST: ${opts.artistName}` : ""}
${opts.genre ? `GENRE: ${opts.genre}` : ""}
${opts.accentColor ? `ACCENT COLOR: ${opts.accentColor}` : ""}

DESIGN STYLE: ${aestheticGuidelines[opts.template]}

PAL COMPILE RESULT:
${opts.palCompileResult ? JSON.stringify(opts.palCompileResult, null, 2) : "Not yet compiled — run PAL compile first."}

CONSTRUCTION RULES:
1. Follow the section order exactly for the ${opts.template} template
2. Apply the aesthetic direction above — never generic
3. Every update_epk call must move toward completing the full section list
4. Bio must be third-person, press-ready, 150-300 words
5. Stats must be from scraper or user-reported — NEVER invented
6. End every message with exactly one question advancing the interview

AVAILABLE DESIGN TEMPLATES FOR ONLINE SITE:
- Editorial Dark (default for main)
- Bold SaaS (default for booking)  
- Luxury Minimal (default for brand)
- Warm Creative (alternative — Playfair Display, warm tones)
- Studio Refined (alternative — geometric, clean)
The artist can request any style. Apply it via the accentColor and template fields.`;
}

// ── Export the EPK agent tools list ───────────────────────────────────────────
export const ALL_EPK_TOOLS = [
  EPK_UPDATE_TOOL,
  SPOTIFY_FETCH_TOOL,
  SOCIAL_SCRAPE_TOOL,
  FETCH_PAGE_TOOL,
  ADD_RIDER_TOOL,
];
