# Skill — Generate Design System (Artispreneur Standard)

**Purpose:** Resolve a concrete, anti-slop design system (palette, typography scale, layout geometry, section order) for the EPK based on the selected EPK type and brand assets.

**Trigger:** EPK type selection is known (Single/Album Launch, Tour/Booking, A&R/Label, Sync Licensing, Press/Media) and intake data is collected.

**Inputs:** `epk-design-tokens.md`, `skills/epk-builder/SKILL.md`, brand assets/uploads from artist intake.

**Procedure:**
1. **Load Artispreneur Base Tokens:**
   - Obsidian background (`#080808`), Card surface (`#141414`), Metallic Gold accent (`#C9A227`), Platinum text (`#EDE9E0`).
   - Typography: Display in `Bebas Neue` / `Syne`, Body in `DM Sans` / `Inter`, Monospace for metrics.
2. **Apply Type-Specific Layout Configuration:**
   - Single Launch → Emphasize focus track waveform player & artwork.
   - Tour Booking → Emphasize 24-channel tech rider & interactive stage plot.
   - A&R Deck → Emphasize streaming velocity charts & audience demographics.
   - Sync Licensing → Emphasize stem downloads & 100% one-stop clearance badges.
   - Press Outreach → Emphasize 300DPI photo ZIP bundle & accredited press quotes.
3. **Assemble the 8-Module Blueprint:**
   - Hero → Live Stats → Triple-Tier Bio → Lossless Audio → Press Vault → Tech Rider/Sync → Press Proof → Booking Lock.
4. **Enforce Quality Gate:**
   - Verify WCAG 2.2 AA contrast, no generic placeholder text, 100% responsive geometry.

**Output:** `epk-design-system.json` containing resolved tokens, component configurations, and quality verification flags.
