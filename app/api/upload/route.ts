import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "JPEG, PNG, WebP, or GIF only" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large — max 5MB" }, { status: 400 });
    }

    // Convert to base64 data URL
    const bytes = await file.arrayBuffer();
    const binary = String.fromCharCode(...new Uint8Array(bytes));
    const base64 = btoa(binary);
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      type: file.type,
      size: file.size,
      name: file.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
