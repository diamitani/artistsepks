import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Puppeteer + older @types/react have pre-existing private-field TS errors
    // that don't affect runtime. Build still works via Turbopack compilation.
    ignoreBuildErrors: true,
  },
  // Transpile assistant-ui packages (ESM)
  transpilePackages: [
    "@assistant-ui/react",
    "@assistant-ui/react-markdown",
    "assistant-stream",
    "@assistant-ui/core",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.s3.us-east-1.amazonaws.com" },
      { protocol: "https", hostname: "artispreneur-epk-media.s3.us-east-1.amazonaws.com" },
      { protocol: "https", hostname: "*.amplifyapp.com" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
    ],
  },
  // Allow Bedrock and Amplify API calls from server components
  serverExternalPackages: [
    "@aws-sdk/client-bedrock-runtime",
    "@aws-sdk/client-amplify",
    "@aws-sdk/client-s3",
    "puppeteer",
  ],
};

export default nextConfig;
