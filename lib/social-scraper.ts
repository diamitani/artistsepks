// ── Obscura-powered social media scraper ──────────────────────────────────────
// Uses the Obscura headless browser to scrape engagement data from social platforms

import { execSync, ChildProcess, spawn } from "child_process";
import * as puppeteer from "puppeteer-core";
import path from "path";

const OBSCURA_BIN = process.env.OBSCURA_PATH || path.join(process.cwd(), "bin", "obscura");
const OBSCURA_PORT = 9922; // different from default to avoid conflicts

let obscuraProcess: ChildProcess | null = null;

// ── Platform detection ─────────────────────────────────────────────────────────

type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "unknown";

function detectPlatform(url: string): Platform {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return "unknown";
}

function extractHandle(url: string, platform: Platform): string {
  const clean = url.replace(/https?:\/\//, "").replace(/\/$/, "");
  const parts = clean.split("/");
  // Patterns: instagram.com/handle, tiktok.com/@handle, youtube.com/@handle
  const handle = parts.find((p) => p.startsWith("@")) || parts[1] || "";
  return handle.replace(/^@/, "");
}

// ── Scrapers per platform ──────────────────────────────────────────────────────

interface SocialProfile {
  platform: Platform;
  handle: string;
  displayName?: string;
  followers?: string;
  following?: string;
  posts?: string;
  engagement?: {
    avgLikes?: string;
    avgComments?: string;
    engagementRate?: string;
  };
  avatarUrl?: string;
  bio?: string;
  raw: Record<string, unknown>;
}

async function scrapeInstagram(page: puppeteer.Page, handle: string): Promise<SocialProfile> {
  await page.goto(`https://www.instagram.com/${handle}/`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  // Wait for meta tags or profile data
  await page.waitForSelector("meta[property='og:description']", { timeout: 10000 }).catch(() => {});

  const data = await page.evaluate(() => {
    // Try structured data from meta tags
    const metaDesc = document.querySelector("meta[property='og:description']")?.getAttribute("content") || "";
    const metaTitle = document.querySelector("meta[property='og:title']")?.getAttribute("content") || "";
    const metaImage = document.querySelector("meta[property='og:image']")?.getAttribute("content") || "";

    // Parse the description: "123K Followers, 456 Following, 789 Posts"
    const followerMatch = metaDesc.match(/([\d,.KMNB]+)\s*Followers?/i);
    const followingMatch = metaDesc.match(/([\d,.KMNB]+)\s*Following/i);
    const postsMatch = metaDesc.match(/([\d,.KMNB]+)\s*Posts?/i);

    return {
      metaTitle,
      metaImage,
      followers: followerMatch?.[1] || "",
      following: followingMatch?.[1] || "",
      posts: postsMatch?.[1] || "",
      rawDescription: metaDesc,
    };
  });

  return {
    platform: "instagram",
    handle,
    displayName: data.metaTitle || handle,
    followers: data.followers,
    following: data.following,
    posts: data.posts,
    avatarUrl: data.metaImage || undefined,
    raw: data as Record<string, unknown>,
  };
}

async function scrapeTikTok(page: puppeteer.Page, handle: string): Promise<SocialProfile> {
  await page.goto(`https://www.tiktok.com/@${handle}`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  await new Promise((r) => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    // TikTok loads data in script tags with JSON
    const metaDesc = document.querySelector("meta[name='description']")?.getAttribute("content") || "";
    const metaTitle = document.querySelector("meta[property='og:title']")?.getAttribute("content") || "";
    const metaImage = document.querySelector("meta[property='og:image']")?.getAttribute("content") || "";

    // Parse: "123M Followers, 456K Likes"
    const followerMatch = metaDesc.match(/([\d,.KMNB]+)\s*Followers?/i);
    const likesMatch = metaDesc.match(/([\d,.KMNB]+)\s*Likes?/i);

    return {
      metaTitle,
      metaImage,
      followers: followerMatch?.[1] || "",
      likes: likesMatch?.[1] || "",
      rawDescription: metaDesc,
    };
  });

  return {
    platform: "tiktok",
    handle,
    displayName: data.metaTitle || handle,
    followers: data.followers,
    engagement: {
      avgLikes: data.likes || undefined,
    },
    avatarUrl: data.metaImage || undefined,
    raw: data as Record<string, unknown>,
  };
}

async function scrapeYouTube(page: puppeteer.Page, handle: string): Promise<SocialProfile> {
  const url = handle.startsWith("UC")
    ? `https://www.youtube.com/channel/${handle}`
    : `https://www.youtube.com/@${handle}`;

  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const metaDesc = document.querySelector("meta[name='description']")?.getAttribute("content") || "";
    const metaTitle = document.querySelector("meta[property='og:title']")?.getAttribute("content") || "";
    const metaImage = document.querySelector("meta[property='og:image']")?.getAttribute("content") || "";

    // YouTube subs are sometimes in the description or title
    const subMatch = metaDesc.match(/([\d,.KMNB]+)\s*subscribers?/i);
    const viewMatch = metaDesc.match(/([\d,.KMNB]+)\s*views?/i);

    return {
      metaTitle,
      metaImage,
      subscribers: subMatch?.[1] || "",
      views: viewMatch?.[1] || "",
      rawDescription: metaDesc,
    };
  });

  return {
    platform: "youtube",
    handle,
    displayName: data.metaTitle || handle,
    followers: data.subscribers,
    engagement: {
      avgLikes: data.views || undefined,
    },
    avatarUrl: data.metaImage || undefined,
    raw: data as Record<string, unknown>,
  };
}

async function scrapeTwitter(page: puppeteer.Page, handle: string): Promise<SocialProfile> {
  await page.goto(`https://x.com/${handle}`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  const data = await page.evaluate(() => {
    const metaDesc = document.querySelector("meta[name='description']")?.getAttribute("content") || "";
    const metaTitle = document.querySelector("meta[property='og:title']")?.getAttribute("content") || "";
    const metaImage = document.querySelector("meta[property='og:image']")?.getAttribute("content") || "";

    const followerMatch = metaDesc.match(/([\d,.KMNB]+)\s*Followers?/i);

    return {
      metaTitle,
      metaImage,
      followers: followerMatch?.[1] || "",
      rawDescription: metaDesc,
    };
  });

  return {
    platform: "twitter",
    handle,
    displayName: data.metaTitle || handle,
    followers: data.followers,
    avatarUrl: data.metaImage || undefined,
    raw: data as Record<string, unknown>,
  };
}

// ── Obscura lifecycle ──────────────────────────────────────────────────────────

function isObscuraAvailable(): boolean {
  try {
    execSync(`"${OBSCURA_BIN}" --help`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function startObscura(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (obscuraProcess) {
      resolve(`ws://127.0.0.1:${OBSCURA_PORT}/devtools/browser`);
      return;
    }

    obscuraProcess = spawn(OBSCURA_BIN, ["serve", "--port", String(OBSCURA_PORT)], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timeout = setTimeout(() => {
      reject(new Error("Obscura failed to start within 10s"));
    }, 10000);

    obscuraProcess.stdout?.on("data", (data: Buffer) => {
      const msg = data.toString();
      if (msg.includes("listening") || msg.includes("ws://") || msg.includes("9222")) {
        clearTimeout(timeout);
        resolve(`ws://127.0.0.1:${OBSCURA_PORT}/devtools/browser`);
      }
    });

    obscuraProcess.stderr?.on("data", (data: Buffer) => {
      const msg = data.toString();
      // Obscura may log the WS URL to stderr
      if (msg.includes("ws://") || msg.includes("listening")) {
        clearTimeout(timeout);
        resolve(`ws://127.0.0.1:${OBSCURA_PORT}/devtools/browser`);
      }
    });

    obscuraProcess.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    obscuraProcess.on("exit", (code) => {
      clearTimeout(timeout);
      if (code !== 0) reject(new Error(`Obscura exited with code ${code}`));
    });
  });
}

function stopObscura(): void {
  if (obscuraProcess) {
    obscuraProcess.kill("SIGTERM");
    obscuraProcess = null;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function scrapeSocialProfile(url: string): Promise<SocialProfile> {
  const platform = detectPlatform(url);
  if (platform === "unknown") {
    throw new Error(`Unsupported platform. Supported: Instagram, TikTok, YouTube, Twitter/X`);
  }

  if (!isObscuraAvailable()) {
    throw new Error(
      `Obscura not found at ${OBSCURA_BIN}. Download from https://github.com/h4ckf0r0day/obscura`
    );
  }

  const wsEndpoint = await startObscura();
  const handle = extractHandle(url, platform);

  let browser;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
      defaultViewport: { width: 1280, height: 800 },
    });

    const page = await browser.newPage();

    let result: SocialProfile;
    switch (platform) {
      case "instagram":
        result = await scrapeInstagram(page, handle);
        break;
      case "tiktok":
        result = await scrapeTikTok(page, handle);
        break;
      case "youtube":
        result = await scrapeYouTube(page, handle);
        break;
      case "twitter":
        result = await scrapeTwitter(page, handle);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return result;
  } finally {
    if (browser) await browser.disconnect();
    stopObscura();
  }
}

export { detectPlatform, extractHandle, isObscuraAvailable };
