import { getComposio } from "./client";

// Read-only / storage toolkits only. Do NOT add anything here that lets an
// agent post or publish on an artist's behalf (e.g. write-scope social APIs) —
// automated posting is explicitly out of scope for this integration.
export const TOOLKITS = {
  googleDrive: "googledrive",
  spotify: "spotify",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube",
} as const;

export type ToolkitKey = keyof typeof TOOLKITS;

export interface ConnectedAccountSummary {
  id: string;
  toolkitSlug: string;
  status: string;
}

export async function startConnection(
  userId: string,
  toolkitKey: ToolkitKey
): Promise<{ redirectUrl: string; connectionRequestId: string } | { error: string }> {
  const composio = getComposio();
  if (!composio) return { error: "Composio isn't configured on this deployment." };

  const toolkitSlug = TOOLKITS[toolkitKey];
  try {
    const connectionRequest = await composio.toolkits.authorize(userId, toolkitSlug);
    if (!connectionRequest.redirectUrl) {
      return { error: "Composio didn't return a connection link for this toolkit." };
    }
    return {
      redirectUrl: connectionRequest.redirectUrl,
      connectionRequestId: connectionRequest.id,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not start the connection." };
  }
}

export async function listConnections(userId: string): Promise<ConnectedAccountSummary[]> {
  const composio = getComposio();
  if (!composio) return [];

  try {
    const { items } = await composio.connectedAccounts.list({ userIds: [userId] });
    return items.map((item) => ({
      id: item.id,
      toolkitSlug: item.toolkit.slug,
      status: item.status,
    }));
  } catch {
    return [];
  }
}

export async function isToolkitConnected(userId: string, toolkitKey: ToolkitKey): Promise<boolean> {
  const toolkitSlug = TOOLKITS[toolkitKey];
  const connections = await listConnections(userId);
  return connections.some((c) => c.toolkitSlug === toolkitSlug && c.status === "ACTIVE");
}
