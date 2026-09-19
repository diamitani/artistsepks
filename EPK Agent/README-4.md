# EPK Agent — Claude Managed Agent Package

This package is a complete, ready-to-upload agent bundle for Claude Managed Agents (Claude Skills format),
built on the ROSTR Agent Builder soul/skill conventions.

## Structure

```
epk-agent/
  soul.md                              # Full agent identity, mission, guardrails, orchestration
  SKILL.md                             # Top-level Claude Agent Skill manifest (YAML frontmatter + procedure)
  skills/
    format-inputs.skill.md
    extract-music-metadata.skill.md
    analyze-music-theme.skill.md
    extract-social-media-data.skill.md
    calculate-engagement-score.skill.md
    analyze-link-contents.skill.md
    create-discography.skill.md
    compile-data.skill.md
    generate-bio.skill.md
    generate-design-system.skill.md
    generate-epk.skill.md
  references/
    epk-intake-questions.md            # Canonical intake field map
    epk-template-library.md            # 5 template specs (One Sheeter, General, Booking, Media, Brand)
    epk-design-tokens.md                # Design system rules per template
    mcp-tool-manifest.md                # Composio / Canva / Vercel tool-to-skill mapping + approval gates
```

## How to use

1. Upload the whole `epk-agent/` folder (or the zip) to Claude as a Managed Agent / Skill bundle.
2. `soul.md` is the agent's persistent identity — load it first in any session.
3. `SKILL.md` is the invocable skill manifest — Claude reads its `description` to decide when to trigger
   the EPK Agent, then follows the numbered skill map.
4. Each file in `skills/` is a discrete, single-responsibility procedure with explicit inputs, outputs, and
   guardrails — they execute in the dependency order defined in `SKILL.md`.
5. Connect the required MCPs before running: Composio (for platform data), Canva (optional, polished
   rendering), Vercel (optional, hosting). See `references/mcp-tool-manifest.md` for exact scopes.

## Pipeline summary

```
intake submission
    → format-inputs                 → master.md
    → extract-music-metadata         → discography-raw.json
        → analyze-music-theme        → music-theme-analysis.md
        → create-discography         → discography.md / discography.csv
    → extract-social-media-data      → social-media-raw.json
        → calculate-engagement-score → engagement-score.md
    → analyze-link-contents          → press-link-summary.md
    → compile-data (merges all)      → enhanced.md
        → generate-bio               → bio-long.md / bio-short.md
        → generate-design-system     → epk-design-system.json
    → generate-epk                   → epk.html / epk.pdf (+ optional Vercel deploy)
```

## Design principles carried over from ROSTR core

- No fabricated facts: every number/claim traces to a source artifact.
- Approval gating on all writes/publishes/deploys (Vercel production, Canva public share).
- Artifact contracts: every generated file has provenance, confidence, and input_artifacts.
- Read-only platform access via Composio; this agent never posts/messages/modifies connected accounts.
