import { Composio } from "@composio/core";

let client: Composio | null | undefined;

export function getComposio(): Composio | null {
  if (client !== undefined) return client;

  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    client = null;
    return null;
  }

  client = new Composio({ apiKey });
  return client;
}

export function isComposioConfigured(): boolean {
  return Boolean(process.env.COMPOSIO_API_KEY);
}
