import type { EPKData } from "@/lib/types";
import { resolveModel } from "@/framework/gateway/llm-router";

export interface AgentExecutionContext {
  sessionId: string;
  userId?: string;
  currentEPK: Partial<EPKData>;
  history: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  verifiedDSPStats?: Record<string, unknown>;
}

export interface AgentToolCallResult {
  toolName: string;
  args: Record<string, unknown>;
  output: Record<string, unknown>;
}

export class ArtispreneurAgentHarness {
  private context: AgentExecutionContext;

  constructor(context: AgentExecutionContext) {
    this.context = context;
  }

  public getContext(): AgentExecutionContext {
    return this.context;
  }

  public updateEPKState(patch: Partial<EPKData>): Partial<EPKData> {
    this.context.currentEPK = {
      ...this.context.currentEPK,
      ...patch,
      stats: {
        ...this.context.currentEPK.stats,
        ...patch.stats,
      },
      socialLinks: {
        ...this.context.currentEPK.socialLinks,
        ...patch.socialLinks,
      },
    };
    return this.context.currentEPK;
  }

  public appendMessage(role: "user" | "assistant", content: string) {
    this.context.history.push({ role, content });
  }

  public getModelConfig(taskType: "default-agent" | "fast-interview" | "deep-scorer" | "bio-polisher" = "default-agent") {
    return resolveModel(taskType);
  }
}
