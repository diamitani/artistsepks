import { getComposio } from "./client";

// NOTE: these action slugs follow Composio's documented naming convention for
// the Google Drive toolkit (GOOGLEDRIVE_<VERB>_FILE), but have NOT been
// confirmed against a live Composio tool catalog — no API key was available
// to verify them at build time. If uploads/downloads fail with an "unknown
// action" style error, list the toolkit's actual tool slugs via the Composio
// dashboard or `composio.tools.get({ toolkits: ["googledrive"] })` and adjust
// this map.
const ACTIONS = {
  upload: "GOOGLEDRIVE_UPLOAD_FILE",
  find: "GOOGLEDRIVE_FIND_FILE",
  download: "GOOGLEDRIVE_DOWNLOAD_FILE",
} as const;

export interface DriveActionResult {
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

async function run(userId: string, slug: string, args: Record<string, unknown>): Promise<DriveActionResult> {
  const composio = getComposio();
  if (!composio) return { ok: false, error: "Composio isn't configured on this deployment." };

  try {
    const result = await composio.tools.execute(slug, { userId, arguments: args });
    if (!result.successful) {
      return { ok: false, error: result.error ?? "Drive action failed." };
    }
    return { ok: true, data: result.data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Drive action failed." };
  }
}

export async function saveToDrive(
  userId: string,
  file: { name: string; mimeType: string; base64Content: string; folderId?: string }
): Promise<DriveActionResult> {
  return run(userId, ACTIONS.upload, {
    file_name: file.name,
    mime_type: file.mimeType,
    file_content: file.base64Content,
    ...(file.folderId ? { parent_id: file.folderId } : {}),
  });
}

export async function findDriveFiles(userId: string, query?: string): Promise<DriveActionResult> {
  return run(userId, ACTIONS.find, query ? { query } : {});
}

export async function importFromDrive(userId: string, fileId: string): Promise<DriveActionResult> {
  return run(userId, ACTIONS.download, { file_id: fileId });
}
