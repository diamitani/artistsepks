// ── Technical Rider Templates ─────────────────────────────────────────────────
// Standard backline, sound, lighting, and hospitality riders for booking EPKs.

export interface RiderItem {
  category: string;
  item: string;
  details?: string;
  optional?: boolean;
}

export interface RiderTemplate {
  id: string;
  name: string;
  description: string;
  items: RiderItem[];
}

// ── Backline Riders ───────────────────────────────────────────────────────────

export const BACKLINE_BASIC: RiderTemplate = {
  id: "backline-basic",
  name: "Basic Backline (Club/DI)",
  description: "Standard club show backline requirements",
  items: [
    { category: "Guitar", item: "Fender Twin Reverb or equivalent", details: "2 channels" },
    { category: "Guitar", item: "Vox AC30 or equivalent", details: "Optional 2nd amp" },
    { category: "Bass", item: "Ampeg SVT CL + 8x10 cab or equivalent", details: "DI capable" },
    { category: "Drums", item: "5-piece kit with hardware", details: "Kick, snare, rack tom x2, floor tom, hi-hat, crash, ride" },
    { category: "Drums", item: "Drum throne + rug", details: "Non-slip surface" },
    { category: "Keys", item: "Nord Stage 3 88 or equivalent", details: "With sustain pedal, stand" },
    { category: "DI", item: "2x Direct Injection boxes", details: "Active/passive" },
    { category: "DI", item: "Stereo DI for keys/laptop", details: "" },
  ],
};

export const BACKLINE_FULL: RiderTemplate = {
  id: "backline-full",
  name: "Full Backline (Festival/Theater)",
  description: "Complete backline for headline-level shows",
  items: [
    { category: "Guitar", item: "Fender Twin Reverb + Vox AC30", details: "Both provided" },
    { category: "Bass", item: "Ampeg SVT 2 + 8x10 cab", details: "Plus backup head" },
    { category: "Drums", item: "DW Collector's or equivalent 6-piece", details: "Kick, snare, rack toms x2, floor toms x2" },
    { category: "Drums", item: "Zildjian K Custom cymbal set", details: "Hi-hat, crash x2, ride, splash, china" },
    { category: "Drums", item: "Drum throne, rug, hardware", details: "Double-braced stands" },
    { category: "Keys", item: "Nord Stage 4 88 + Nord Lead", details: "With stands, pedals" },
    { category: "Keys", item: "Korg Kronos or equivalent", details: "Backup" },
    { category: "Percussion", item: "Percussion riser (if available)", details: "" },
    { category: "DI", item: "4x Radial JDI passive DI boxes", details: "" },
    { category: "Backline Tech", item: "Backline technician", details: "Load-in + soundcheck + show" },
  ],
};

// ── Sound Riders ──────────────────────────────────────────────────────────────

export const SOUND_BASIC: RiderTemplate = {
  id: "sound-basic",
  name: "Basic Sound (Club)",
  description: "Minimum sound requirements for a club show",
  items: [
    { category: "PA", item: "House PA system", details: "Adequate for venue capacity" },
    { category: "Mons", item: "4x wedge monitors", details: "Separate monitor mix" },
    { category: "Mics", item: "Shure SM58 vocal mics x3", details: "With stands and cables" },
    { category: "Mics", item: "Shure SM57 instrument mics x4", details: "For guitar cabs, snare, toms" },
    { category: "Mics", item: "AKG D112 or equivalent kick mic", details: "" },
    { category: "Mics", item: "Overhead condenser pair", details: "Small diaphragm" },
    { category: "FOH", item: "FOH engineer", details: "Soundcheck + monitoring" },
  ],
};

export const SOUND_FULL: RiderTemplate = {
  id: "sound-full",
  name: "Full Sound (Festival/Theater)",
  description: "Professional sound production requirements",
  items: [
    { category: "PA", item: "Line array PA system", details: "Left + right + subs, tuned to room" },
    { category: "Mons", item: "6x wedge monitors or IEMs", details: "Separate mixes, IEMs preferred" },
    { category: "Mons", item: "Monitor engineer", details: "Dedicated" },
    { category: "Mics", item: "Shure Beta 58A vocal mics x3", details: "with shock mounts" },
    { category: "Mics", item: "Shure SM57 x6", details: "Full drum and cab miking" },
    { category: "Mics", item: "AKG D112 x2 + Beta 52", details: "Kick drum" },
    { category: "Mics", item: "Overhead condensers", details: "Matched pair" },
    { category: "FOH", item: "FOH engineer", details: "Experienced with genre" },
    { category: "FOH", item: "Digital mixing console", details: "Avid, Yamaha, or DiGiCo" },
    { category: "Inputs", item: "24-32 channel input list", details: "Including spares" },
  ],
};

// ── Lighting Riders ───────────────────────────────────────────────────────────

export const LIGHTING_BASIC: RiderTemplate = {
  id: "lighting-basic",
  name: "Basic Lighting",
  description: "Minimum lighting requirements",
  items: [
    { category: "Front", item: "Front wash (warm + cool)", details: "" },
    { category: "Back", item: "Backlight / silhouette", details: "" },
    { category: "Control", item: "Basic light operator", details: "Follows setlist" },
  ],
};

export const LIGHTING_FULL: RiderTemplate = {
  id: "lighting-full",
  name: "Full Lighting Production",
  description: "Full lighting rig for headline shows",
  items: [
    { category: "Rig", item: "Moving heads x12", details: "Beam/wash hybrid" },
    { category: "Rig", item: "LED wash x16", details: "RGBA, floor + truss mount" },
    { category: "Rig", item: "Strobes x4", details: "DMX controlled" },
    { category: "Rig", item: "Haze machine", details: "With fluid" },
    { category: "Rig", item: "Truss structure", details: "As per stage plot" },
    { category: "Control", item: "Lighting console + operator", details: "GrandMA or Avolites" },
    { category: "Video", item: "LED screen (IMAG)", details: "Optional, if stage allows" },
  ],
};

// ── Hospitality Riders ────────────────────────────────────────────────────────

export const HOSPITALITY_BASIC: RiderTemplate = {
  id: "hospitality-basic",
  name: "Basic Hospitality",
  description: "Standard hospitality requirements",
  items: [
    { category: "Catering", item: "Catering for 4 (band + crew)", details: "Hot meal, vegetarian option" },
    { category: "Drinks", item: "Water (still + sparkling) x8", details: "Room temperature" },
    { category: "Drinks", item: "Assorted soft drinks x6", details: "" },
    { category: "Drinks", item: "Coffee + tea service", details: "Throughout day" },
    { category: "Room", item: "Green room / dressing room", details: "Clean, heated/cooled, private" },
    { category: "Room", item: "Towels x4", details: "" },
  ],
};

export const HOSPITALITY_FULL: RiderTemplate = {
  id: "hospitality-full",
  name: "Full Hospitality (Headline)",
  description: "Premium hospitality for main act",
  items: [
    { category: "Catering", item: "Catering for 8 (band + crew + guests)", details: "Hot meal + salad bar, vegan/GF options" },
    { category: "Drinks", item: "Water (still + sparkling) x24", details: "Room temp + chilled" },
    { category: "Drinks", item: "Assorted soft drinks x12", details: "" },
    { category: "Drinks", item: "Sports drinks x6", details: "" },
    { category: "Drinks", item: "Coffee + tea service", details: "Throughout day + setup" },
    { category: "Room", item: "Private dressing room x2", details: "Lockable, with mirrors, clothes rack" },
    { category: "Room", item: "Towels x8 + robe x2", details: "" },
    { category: "Room", item: "WiFi (dedicated SSID)", details: "Stable, sufficient bandwidth" },
    { category: "Room", item: "Security for dressing room", details: "If outdoor festival" },
    { category: "Transport", item: "Artist pick-up/drop-off", details: "SUV or van" },
  ],
};

// ── Combined templates for quick selection ────────────────────────────────────

export const RIDER_SETS: Record<string, RiderTemplate[]> = {
  club: [BACKLINE_BASIC, SOUND_BASIC, LIGHTING_BASIC, HOSPITALITY_BASIC],
  theater: [BACKLINE_FULL, SOUND_FULL, LIGHTING_FULL, HOSPITALITY_BASIC],
  festival: [BACKLINE_FULL, SOUND_FULL, LIGHTING_FULL, HOSPITALITY_FULL],
  custom: [],
};

export const ALL_RIDERS: RiderTemplate[] = [
  BACKLINE_BASIC, BACKLINE_FULL,
  SOUND_BASIC, SOUND_FULL,
  LIGHTING_BASIC, LIGHTING_FULL,
  HOSPITALITY_BASIC, HOSPITALITY_FULL,
];

export function getRiderById(id: string): RiderTemplate | undefined {
  return ALL_RIDERS.find((r) => r.id === id);
}

export function getRiderSet(type: keyof typeof RIDER_SETS): RiderTemplate[] {
  return RIDER_SETS[type] || [];
}
