import { Sandbox } from "@vercel/sandbox";

export interface SandboxExecutionOptions {
  sandboxName?: string;
  files?: Array<{ path: string; content: string }>;
  command?: string;
  args?: string[];
  persistent?: boolean;
}

export interface SandboxExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

/**
 * Executes code or tests generated templates inside an isolated Vercel Sandbox.
 */
export async function runInVercelSandbox(
  options: SandboxExecutionOptions
): Promise<SandboxExecutionResult> {
  const startTime = Date.now();
  const sandboxName = options.sandboxName || process.env.VERCEL_SANDBOX_NAME || "my-sandbox-438763";
  const persistent = options.persistent ?? true;

  const sandbox = await Sandbox.getOrCreate({
    name: sandboxName,
    persistent,
    networkPolicy: "deny-all",
  });

  await sandbox.update({ networkPolicy: "deny-all" });

  try {
    if (options.files && options.files.length > 0) {
      await sandbox.writeFiles(options.files);
    }

    const command = options.command || "node";
    const args = options.args || ["/vercel/generated.mjs"];

    const result = await sandbox.runCommand(command, args);
    const stdout = await result.stdout();
    const stderr = await result.stderr();

    return {
      success: result.exitCode === 0,
      stdout,
      stderr,
      exitCode: result.exitCode,
      durationMs: Date.now() - startTime,
    };
  } finally {
    if (!persistent) {
      await sandbox.stop();
    }
  }
}
