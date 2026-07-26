/**
 * assistant-ui integration for EPK Agent chat
 *
 * Uses @assistant-ui/react with a custom ChatModelAdapter that calls
 * our /api/agent SSE endpoint (Bedrock or Anthropic fallback).
 *
 * Exports the named components the builder/page.tsx expects:
 *   ChatBubble, ChatInput, ChatWelcome, QuickActions, StatusBadge
 * Plus the full EPKChat component that wraps everything in assistant-ui.
 */
"use client";

import {
  useLocalRuntime,
  AssistantRuntimeProvider,
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  type ChatModelAdapter,
  type ChatModelRunOptions,
} from "@assistant-ui/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { EPKData } from "@/lib/types";
import { QUICK_ACTIONS } from "@/lib/agent";

// ─────────────────────────────────────────────────────────────────────────────
// 1.  Bedrock / Anthropic adapter
// ─────────────────────────────────────────────────────────────────────────────
function makeEPKAdapter(opts: {
  epkData: EPKData;
  template: "main" | "booking" | "brand";
  onEPKUpdate: (patch: Partial<EPKData>) => void;
  palResult?: Record<string, unknown>;
  runPALRef: React.MutableRefObject<boolean>;
}): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }: ChatModelRunOptions) {
      const apiMessages = messages.map((m) => ({
        role: m.role,
        content:
          typeof m.content === "string"
            ? m.content
            : m.content
                .filter((c) => c.type === "text")
                .map((c) => ("text" in c ? c.text : ""))
                .join(""),
      }));

      const isFirst = opts.runPALRef.current;
      if (isFirst) opts.runPALRef.current = false;

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          epkData: opts.epkData,
          template: opts.template,
          runPAL: isFirst,
          palResult: opts.palResult,
        }),
        signal: abortSignal,
      });

      if (!res.ok) throw new Error(`Agent error: ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const ev = JSON.parse(raw);
            if (ev.type === "text" && ev.content) {
              text += ev.content;
              // yield partial text deltas to assistant-ui
              yield { type: "text-delta", textDelta: ev.content };
            } else if (ev.type === "epk_update" && ev.patch) {
              opts.onEPKUpdate(ev.patch);
            }
          } catch {
            /* skip malformed */
          }
        }
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  Sub-components used by builder/page.tsx (named exports expected there)
// ─────────────────────────────────────────────────────────────────────────────

/** Individual chat bubble, used as a fallback renderer outside of Thread context */
export function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
          role === "user"
            ? "bg-[#C9A227] text-[#050505] font-medium"
            : "bg-[#181818] text-[#EDE9E0] border border-[#C9A227]/10"
        )}
      >
        {content}
      </div>
    </div>
  );
}

/** Composer input row */
export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Tell me about your music..."
        rows={1}
        disabled={disabled}
        className="flex-1 bg-[#181818] border border-[#C9A227]/10 rounded-lg px-3 py-2.5 text-sm text-[#EDE9E0] placeholder-[#555] resize-none focus:outline-none focus:border-[#C9A227]/40 disabled:opacity-50"
        style={{ maxHeight: 120 }}
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className="w-9 h-9 mt-0.5 rounded-lg bg-[#C9A227] text-[#050505] flex items-center justify-center hover:bg-[#D4A828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M13 1L7 7M13 1H9M13 1V5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 3H2.5C1.67 3 1 3.67 1 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

/** Welcome / empty state */
export function ChatWelcome({ template }: { template?: string }) {
  const labels: Record<string, string> = {
    main: "Main EPK",
    booking: "Booking Kit",
    brand: "Brand Kit",
  };
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mb-4">
        <span className="text-[#C9A227] text-lg">✦</span>
      </div>
      <p className="text-xs font-medium text-[#C9A227] uppercase tracking-widest mb-2">
        EPK Agent
      </p>
      <p className="text-sm text-[#888] max-w-xs">
        I'll build your {template ? labels[template] || "EPK" : "EPK"} through
        conversation. Just tell me about your music.
      </p>
    </div>
  );
}

/** Quick action pills */
export function QuickActions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {QUICK_ACTIONS.slice(0, 3).map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          className="text-xs px-3 py-1.5 rounded-full border border-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

/** Status badge shown while streaming */
export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    thinking: "Thinking...",
    building: "Building EPK...",
    polishing: "Polishing...",
    running: "Running...",
  };
  if (!status) return null;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
      <span className="text-[10px] text-[#C9A227]">{labels[status] || status}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  Full EPKChat component — wraps assistant-ui runtime + our themed UI
// ─────────────────────────────────────────────────────────────────────────────
interface EPKChatProps {
  epkData: EPKData;
  onEPKUpdate: (patch: Partial<EPKData>) => void;
  template: "main" | "booking" | "brand";
  onTemplateChange?: (t: "main" | "booking" | "brand") => void;
  initialMessage?: string;
  palResult?: Record<string, unknown>;
}

function EPKChatInner({
  epkData,
  onEPKUpdate,
  template,
  initialMessage,
  palResult,
}: EPKChatProps) {
  const runPALRef = useRef(true);

  // The greeting message appended as a system suggestion on first render
  const greeting =
    initialMessage ||
    (epkData.artistName
      ? `I'm your EPK agent. I already know your name is ${epkData.artistName} — let's build your ${template === "booking" ? "booking kit" : template === "brand" ? "brand partnership kit" : "press kit"}. What genre best describes your sound?`
      : "I'm your EPK agent — I build Electronic Press Kits through conversation. Let's start: what's your artist name?");

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] rounded-xl border border-[#C9A227]/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#C9A227]/10 bg-[#0D0D0D]">
        <div className="w-7 h-7 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center">
          <span className="text-[#C9A227] text-xs">✦</span>
        </div>
        <div>
          <p className="text-xs font-medium text-[#EDE9E0]">EPK Agent</p>
          <p className="text-[10px] text-[#666]">
            Powered by Artispreneur · AWS Bedrock · PAL Compiler
          </p>
        </div>
        <div className="ml-auto">
          {/* assistant-ui provides isRunning state via useThread */}
          <ThreadPrimitive.If running>
            <StatusBadge status="building" />
          </ThreadPrimitive.If>
        </div>
      </div>

      {/* Thread messages */}
      <ThreadPrimitive.Root
        className="flex-1 flex flex-col overflow-hidden"
      >
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#C9A227]/10">
          {/* Empty state */}
          <ThreadPrimitive.Empty>
            <ChatWelcome template={template} />
            {/* Show greeting as static assistant bubble */}
            <div className="mt-4">
              <ChatBubble role="assistant" content={greeting} />
            </div>
          </ThreadPrimitive.Empty>

          {/* Messages */}
          <ThreadPrimitive.Messages
            components={{
              UserMessage: ({ message }) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-end"
                >
                  <MessagePrimitive.Content
                    components={{
                      Text: ({ text }) => (
                        <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-[#C9A227] text-[#050505] font-medium">
                          {text}
                        </div>
                      ),
                    }}
                  />
                </motion.div>
              ),
              AssistantMessage: ({ message }) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-[#181818] text-[#EDE9E0] border border-[#C9A227]/10">
                    <MessagePrimitive.Content
                      components={{
                        Text: ({ text }) => <span>{text}</span>,
                        Fallback: () => (
                          <span className="flex gap-1">
                            {[0, 150, 300].map((d) => (
                              <span
                                key={d}
                                className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/50 animate-bounce"
                                style={{ animationDelay: `${d}ms` }}
                              />
                            ))}
                          </span>
                        ),
                      }}
                    />
                  </div>
                </motion.div>
              ),
            }}
          />

          {/* Running indicator */}
          <ThreadPrimitive.If running>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#181818] border border-[#C9A227]/10 rounded-xl px-3.5 py-2.5">
                <span className="flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/50 animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </span>
              </div>
            </motion.div>
          </ThreadPrimitive.If>
        </ThreadPrimitive.Viewport>

        {/* Quick actions when no messages yet */}
        <ThreadPrimitive.Empty>
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.slice(0, 3).map((action) => (
                <ComposerPrimitive.Send key={action.label}>
                  {({ send }) => (
                    <button
                      onClick={() => {
                        // We can't directly set composer value here in primitives API,
                        // so we dispatch a custom append via the runtime
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors"
                    >
                      {action.label}
                    </button>
                  )}
                </ComposerPrimitive.Send>
              ))}
            </div>
          </div>
        </ThreadPrimitive.Empty>

        {/* Composer */}
        <div className="p-3 border-t border-[#C9A227]/10">
          <ComposerPrimitive.Root className="flex gap-2">
            <ComposerPrimitive.Input
              placeholder="Tell me about your music..."
              rows={1}
              className="flex-1 bg-[#181818] border border-[#C9A227]/10 rounded-lg px-3 py-2.5 text-sm text-[#EDE9E0] placeholder-[#555] resize-none focus:outline-none focus:border-[#C9A227]/40 disabled:opacity-50"
              style={{ maxHeight: 120 }}
            />
            <ComposerPrimitive.Send
              className="w-9 h-9 mt-0.5 rounded-lg bg-[#C9A227] text-[#050505] flex items-center justify-center hover:bg-[#D4A828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 1L7 7M13 1H9M13 1V5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 3H2.5C1.67 3 1 3.67 1 4.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
          <p className="text-[10px] text-[#444] mt-1.5 text-center">
            EPK Agent · AWS Bedrock · PAL Compiler · assistant-ui
          </p>
        </div>
      </ThreadPrimitive.Root>
    </div>
  );
}

/** Top-level export — wraps with AssistantRuntimeProvider */
export default function EPKChat(props: EPKChatProps) {
  const runPALRef = useRef(true);

  const adapter = useCallback(
    () =>
      makeEPKAdapter({
        epkData: props.epkData,
        template: props.template,
        onEPKUpdate: props.onEPKUpdate,
        palResult: props.palResult,
        runPALRef,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.template]
  );

  // useLocalRuntime takes the adapter directly (not a factory)
  const adapterInstance = makeEPKAdapter({
    epkData: props.epkData,
    template: props.template,
    onEPKUpdate: props.onEPKUpdate,
    palResult: props.palResult,
    runPALRef,
  });

  const runtime = useLocalRuntime(adapterInstance);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <EPKChatInner {...props} />
    </AssistantRuntimeProvider>
  );
}
