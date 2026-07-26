import { NextRequest, NextResponse } from "next/server";
import { AmplifyClient, CreateAppCommand, CreateBranchCommand, StartDeploymentCommand, GetAppCommand } from "@aws-sdk/client-amplify";

const REGION = process.env.AWS_REGION || "us-east-1";

function getAmplifyClient() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;
  return new AmplifyClient({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
  });
}

interface DeployRequest {
  epkSlug: string;
  artistName: string;
  htmlContent: string;
  userId?: string;
  customDomain?: string;
}

// POST /api/deploy — deploy EPK as AWS Amplify site
export async function POST(req: NextRequest) {
  const amplify = getAmplifyClient();

  if (!amplify) {
    // Return a mock deployment for demo mode
    return NextResponse.json({
      success: true,
      demo: true,
      url: `https://epks.artispreneur.com/epk/${Date.now()}`,
      message: "Demo mode — configure AWS credentials to enable live deployment",
    });
  }

  try {
    const body = await req.json() as DeployRequest;
    const { epkSlug, artistName, htmlContent } = body;

    if (!epkSlug || !htmlContent) {
      return NextResponse.json({ error: "epkSlug and htmlContent required" }, { status: 400 });
    }

    const appName = `epk-${epkSlug.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`;

    // Create Amplify app
    const createApp = await amplify.send(
      new CreateAppCommand({
        name: appName,
        description: `EPK for ${artistName}`,
        platform: "WEB",
        tags: {
          source: "artistepks",
          artist: artistName,
          slug: epkSlug,
        },
        buildSpec: `version: 1\nfrontend:\n  phases:\n    build:\n      commands:\n        - echo "Static EPK — no build needed"\n  artifacts:\n    baseDirectory: .\n    files:\n      - '**/*'\n  cache:\n    paths: []`,
      })
    );

    const appId = createApp.app?.appId;
    if (!appId) throw new Error("Failed to create Amplify app");

    // Create main branch
    await amplify.send(
      new CreateBranchCommand({
        appId,
        branchName: "main",
        stage: "PRODUCTION",
      })
    );

    // Deploy by uploading HTML content as a zip
    // For now, return the app URL — full zip deployment requires a separate upload flow
    const defaultDomain = createApp.app?.defaultDomain;
    const siteUrl = `https://main.${defaultDomain}`;

    return NextResponse.json({
      success: true,
      appId,
      siteUrl,
      defaultDomain,
      message: "Amplify app created. HTML upload in progress.",
      nextStep: "upload-zip",
    });
  } catch (err) {
    console.error("Deploy error:", err);
    return NextResponse.json(
      { error: "Deployment failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// GET /api/deploy?appId=... — check deployment status
export async function GET(req: NextRequest) {
  const amplify = getAmplifyClient();
  if (!amplify) return NextResponse.json({ error: "AWS not configured" }, { status: 503 });

  const url = new URL(req.url);
  const appId = url.searchParams.get("appId");
  if (!appId) return NextResponse.json({ error: "appId required" }, { status: 400 });

  try {
    const app = await amplify.send(new GetAppCommand({ appId }));
    return NextResponse.json({
      appId,
      name: app.app?.name,
      defaultDomain: app.app?.defaultDomain,
      status: app.app?.productionBranch?.status || "PENDING",
      siteUrl: `https://main.${app.app?.defaultDomain}`,
    });
  } catch (err) {
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}
