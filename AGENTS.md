<!-- BEGIN:nextjs-agent-rules -->
# ArtistEPKs — Next.js 16 App Router (React 19)

This is NOT vanilla Next.js. Key details for agents editing this repo:

## Stack
- Next.js 16.2.3 with Turbopack, React 19, TypeScript 5, Tailwind 4
- AI: AWS Bedrock (Claude Sonnet 4 via us.anthropic.claude-sonnet-4-6) → Anthropic fallback
- Auth: AWS Cognito (us-east-1_VyKGNlV9r) via Amplify v6 → Supabase fallback
- Storage: Supabase epks table → DynamoDB (artispreneur-epks) fallback → demo mode
- Chat UI: @assistant-ui/react 0.14 with useLocalRuntime + ThreadPrimitive
- Media: AWS S3 (artispreneur-epk-media bucket)
- Deploy: AWS Amplify via /api/deploy
- PDF: Puppeteer (requires Chrome binary in production)

## Critical files
- lib/bedrock-agent.ts — Bedrock client, PAL compiler, system instruction builder
- lib/aws-auth.ts — Cognito auth, AuthProvider React context
- lib/agent.ts — system prompt, tool definitions, QUICK_ACTIONS
- app/api/agent/route.ts — SSE streaming: Bedrock primary, Anthropic fallback
- components/ui/chat.tsx — assistant-ui EPKChat + named exports (ChatBubble, ChatInput, etc.)

## Auth flow
1. Cognito JWT in Authorization: Bearer header (getCognitoUserId)
2. Supabase session cookie fallback (getUser)
3. Demo mode if neither configured

## EPK templates
- main: Editorial Dark, gold #C9A227
- booking: Bold SaaS, crimson #C8102E
- brand: Luxury Minimal, gold #C9A227

## PAL Compiler
- GET /api/agent?artist=X&template=main → runs palCompile() → returns JSON build plan
- palCompile() calls Bedrock to extract: siteType, template, v1Sections[], aestheticDirection, onboardingQuestion
- buildEPKSystemInstructions() enriches AGENT_SYSTEM_PROMPT with template + PAL context

## Breaking changes vs standard Next.js
- No pages/ directory — App Router only
- Turbopack build (not webpack) — use npm run build not tsc
- ignoreBuildErrors: true in next.config.ts (puppeteer-core TS18028 noise)
- transpilePackages needed for @assistant-ui/react (ESM)
- Supabase client is null-safe stub when SUPABASE_URL not set
- assistant-ui useLocalRuntime takes adapter INSTANCE per template change, not factory
<!-- END:nextjs-agent-rules -->
