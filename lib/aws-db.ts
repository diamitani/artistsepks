/**
 * lib/aws-db.ts — AWS DynamoDB data layer
 *
 * Replaces Supabase for EPK storage, profiles, domains, and subscriptions.
 * Tables (all in us-east-1):
 *   artispreneur-epks       PK: id, GSI: user_id-updatedAt-index
 *   artispreneur-profiles   PK: id, GSI: userId-index, username-index
 *   artispreneur-domains    PK: id, GSI: userId-index, domain-index
 *   artispreneur-plans      PK: userId
 *
 * Auth: resolves userId from Cognito JWT Bearer header OR demo cookie.
 */
import { NextRequest } from "next/server";
import {
  DynamoDBClient,
  CreateTableCommand,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

// ── Config ─────────────────────────────────────────────────────────────────────
const REGION = process.env.AWS_REGION || "us-east-1";
export const TABLES = {
  epks: process.env.EPK_DYNAMO_TABLE || "artispreneur-epks",
  profiles: process.env.PROFILE_DYNAMO_TABLE || "artispreneur-profiles",
  domains: process.env.DOMAINS_DYNAMO_TABLE || "artispreneur-domains",
  plans: process.env.PLANS_DYNAMO_TABLE || "artispreneur-plans",
};

// ── Client ─────────────────────────────────────────────────────────────────────
let _docClient: DynamoDBDocumentClient | null = null;

export function getDocClient(): DynamoDBDocumentClient | null {
  if (_docClient) return _docClient;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;

  const raw = new DynamoDBClient({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
  });
  _docClient = DynamoDBDocumentClient.from(raw, {
    marshallOptions: { removeUndefinedValues: true },
  });
  return _docClient;
}

export function isAwsConfigured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

// ── Auth resolution ─────────────────────────────────────────────────────────────
export const DEMO_USER_ID = "demo-user-pat";
export const DEMO_USER = {
  id: DEMO_USER_ID,
  email: "demo@artispreneur.com",
  name: "Demo User",
  plan: "free" as const,
};

/**
 * Resolve user ID from request.
 * Priority: Cognito JWT → demo cookie → demo bypass (if DEMO_MODE=true).
 */
export function resolveUserId(req: NextRequest): string | null {
  // 1. Cognito JWT
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64url").toString()
      );
      if (payload.sub) return payload.sub as string;
    } catch { /* bad token */ }
  }

  // 2. Demo session cookie
  const demoCookie = req.cookies.get("epk-demo-session");
  if (demoCookie?.value === "active") return DEMO_USER_ID;

  // 3. DEMO_MODE env bypass (for testing)
  if (process.env.DEMO_MODE === "true") return DEMO_USER_ID;

  return null;
}

// ── EPK operations ─────────────────────────────────────────────────────────────
export interface EPKRecord {
  id: string;
  slug: string;
  user_id: string;
  template: "main" | "booking" | "brand";
  data: Record<string, unknown>;
  views: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export async function listEPKs(userId: string): Promise<EPKRecord[]> {
  const db = getDocClient();
  if (!db) return [];
  const result = await db.send(new QueryCommand({
    TableName: TABLES.epks,
    IndexName: "user_id-updated_at-index",
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: { ":uid": userId },
    ScanIndexForward: false,
  }));
  return (result.Items || []) as EPKRecord[];
}

export async function getEPKBySlug(slug: string): Promise<EPKRecord | null> {
  const db = getDocClient();
  if (!db) return null;
  const result = await db.send(new QueryCommand({
    TableName: TABLES.epks,
    IndexName: "slug-index",
    KeyConditionExpression: "slug = :slug",
    ExpressionAttributeValues: { ":slug": slug },
    Limit: 1,
  }));
  return (result.Items?.[0] as EPKRecord) || null;
}

export async function createEPK(record: Omit<EPKRecord, "views" | "downloads" | "created_at" | "updated_at">): Promise<EPKRecord> {
  const db = getDocClient();
  const now = new Date().toISOString();
  const full: EPKRecord = { ...record, views: 0, downloads: 0, created_at: now, updated_at: now };
  if (db) {
    await db.send(new PutCommand({ TableName: TABLES.epks, Item: full }));
  }
  return full;
}

export async function updateEPK(id: string, userId: string, patch: Partial<EPKRecord>): Promise<boolean> {
  const db = getDocClient();
  if (!db) return false;
  const now = new Date().toISOString();
  await db.send(new UpdateCommand({
    TableName: TABLES.epks,
    Key: { id },
    ConditionExpression: "user_id = :uid",
    UpdateExpression: "SET #data = :data, template = :tmpl, updated_at = :now",
    ExpressionAttributeNames: { "#data": "data" },
    ExpressionAttributeValues: {
      ":uid": userId,
      ":data": patch.data || {},
      ":tmpl": patch.template || "main",
      ":now": now,
    },
  }));
  return true;
}

export async function deleteEPK(id: string, userId: string): Promise<boolean> {
  const db = getDocClient();
  if (!db) return false;
  await db.send(new DeleteCommand({
    TableName: TABLES.epks,
    Key: { id },
    ConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: { ":uid": userId },
  }));
  return true;
}

export async function incrementEPKViews(slug: string): Promise<void> {
  const db = getDocClient();
  if (!db) return;
  const record = await getEPKBySlug(slug);
  if (!record) return;
  await db.send(new UpdateCommand({
    TableName: TABLES.epks,
    Key: { id: record.id },
    UpdateExpression: "ADD #views :one",
    ExpressionAttributeNames: { "#views": "views" },
    ExpressionAttributeValues: { ":one": 1 },
  }));
}

export async function incrementEPKDownloads(slug: string): Promise<void> {
  const db = getDocClient();
  if (!db) return;
  const record = await getEPKBySlug(slug);
  if (!record) return;
  await db.send(new UpdateCommand({
    TableName: TABLES.epks,
    Key: { id: record.id },
    UpdateExpression: "ADD downloads :one",
    ExpressionAttributeValues: { ":one": 1 },
  }));
}

// ── Profile operations ─────────────────────────────────────────────────────────
export async function getProfile(id: string): Promise<Record<string, unknown> | null> {
  const db = getDocClient();
  if (!db) return null;
  const result = await db.send(new GetCommand({ TableName: TABLES.profiles, Key: { id } }));
  return (result.Item as Record<string, unknown>) || null;
}

export async function getProfileByUsername(username: string): Promise<Record<string, unknown> | null> {
  const db = getDocClient();
  if (!db) return null;
  const result = await db.send(new QueryCommand({
    TableName: TABLES.profiles,
    IndexName: "username-index",
    KeyConditionExpression: "username = :u",
    ExpressionAttributeValues: { ":u": username },
    Limit: 1,
  }));
  return (result.Items?.[0] as Record<string, unknown>) || null;
}

export async function saveProfile(profile: Record<string, unknown>): Promise<void> {
  const db = getDocClient();
  if (!db) return;
  await db.send(new PutCommand({
    TableName: TABLES.profiles,
    Item: { ...profile, updated_at: new Date().toISOString() },
  }));
}

// ── Plan operations ────────────────────────────────────────────────────────────
export interface PlanRecord {
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  current_period_end?: string;
}

export async function getPlan(userId: string): Promise<PlanRecord | null> {
  const db = getDocClient();
  if (!db) return null;
  const result = await db.send(new GetCommand({ TableName: TABLES.plans, Key: { userId } }));
  return (result.Item as PlanRecord) || null;
}

export async function savePlan(record: PlanRecord): Promise<void> {
  const db = getDocClient();
  if (!db) return;
  await db.send(new PutCommand({ TableName: TABLES.plans, Item: record }));
}

// ── Domain operations ──────────────────────────────────────────────────────────
export interface DomainRecord {
  id: string;
  user_id: string;
  domain: string;
  epk_slug: string;
  verified: boolean;
  created_at: string;
}

export async function listDomains(userId: string): Promise<DomainRecord[]> {
  const db = getDocClient();
  if (!db) return [];
  const result = await db.send(new QueryCommand({
    TableName: TABLES.domains,
    IndexName: "userId-index",
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: { ":uid": userId },
  }));
  return (result.Items || []) as DomainRecord[];
}

export async function createDomain(record: Omit<DomainRecord, "created_at">): Promise<DomainRecord> {
  const db = getDocClient();
  const full = { ...record, created_at: new Date().toISOString() };
  if (db) await db.send(new PutCommand({ TableName: TABLES.domains, Item: full }));
  return full;
}

export async function deleteDomain(id: string, userId: string): Promise<void> {
  const db = getDocClient();
  if (!db) return;
  await db.send(new DeleteCommand({
    TableName: TABLES.domains,
    Key: { id },
    ConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: { ":uid": userId },
  }));
}

// ── In-memory demo store (when AWS not configured) ─────────────────────────────
const demoEPKs = new Map<string, EPKRecord>();
const demoProfiles = new Map<string, Record<string, unknown>>();

export function getDemoStore() {
  return { epks: demoEPKs, profiles: demoProfiles };
}
