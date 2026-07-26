import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.EPK_MEDIA_BUCKET || "artispreneur-epk-media";
const REGION = process.env.AWS_REGION || "us-east-1";

function getS3Client() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// POST /api/upload — multipart file upload to S3
export async function POST(req: NextRequest) {
  const s3 = getS3Client();

  // If S3 not configured, return a placeholder URL
  if (!s3) {
    const fallbackUrl = `https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=1600`;
    return NextResponse.json({ url: fallbackUrl, source: "pexels-fallback" });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = (formData.get("userId") as string) || "anonymous";
    const type = (formData.get("type") as string) || "general"; // hero | profile | media

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "audio/mpeg", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    // Max 20MB
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 20MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const key = `epk-media/${userId}/${type}/${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "max-age=31536000",
      })
    );

    const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    return NextResponse.json({ url, key, bucket: BUCKET, source: "s3" });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed", details: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

// GET /api/upload?key=... — get presigned URL for direct browser upload
export async function GET(req: NextRequest) {
  const s3 = getS3Client();
  if (!s3) return NextResponse.json({ error: "S3 not configured" }, { status: 503 });

  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const userId = url.searchParams.get("userId") || "anonymous";
  const type = url.searchParams.get("type") || "general";
  const contentType = url.searchParams.get("contentType") || "image/jpeg";

  if (!key && !userId) {
    return NextResponse.json({ error: "key or userId required" }, { status: 400 });
  }

  const objectKey = key || `epk-media/${userId}/${type}/${Date.now()}.jpg`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${objectKey}`;

  return NextResponse.json({ uploadUrl: presignedUrl, publicUrl, key: objectKey });
}
