"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Calendar,
  Handshake,
  Pen,
  Send,
  Loader2,
  Bot,
  User,
} from "lucide-react";

// ── Chat bubble ───────────────────────────────────────────────────────────────
interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp?: number;
}

export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
          isUser
            ? "bg-[#C9A227]/20 text-[#C9A227]"
            : "bg-gradient-to-br from-[#C9A227] to-[#E8C840] text-[#050505]"
        )}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Message */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-[#C9A227] text-[#050505] rounded-tr-md"
            : "bg-[#181818] text-[#E0DCD4] border border-[#2A2A2A] rounded-tl-md"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        {isStreaming && (
          <span className="inline-flex ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Status indicator ──────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  thinking: { label: "Thinking...", color: "#C9A227" },
  building: { label: "Building EPK...", color: "#C9A227" },
  polishing: { label: "Polishing content...", color: "#E8C840" },
  done: { label: "Done", color: "#27C93F" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_LABELS[status] || { label: status, color: "#C9A227" };

  return (
    <div className="flex items-center justify-center py-2">
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest"
        style={{
          background: `${config.color}15`,
          color: config.color,
          border: `1px solid ${config.color}30`,
        }}
      >
        {status !== "done" && (
          <Loader2 className="w-3 h-3 animate-spin" />
        )}
        {config.label}
      </div>
    </div>
  );
}

// ── Quick actions ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  calendar: Calendar,
  handshake: Handshake,
  pen: Pen,
};

interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}

export function QuickActions({
  actions,
  onSelect,
}: {
  actions: QuickAction[];
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 px-4 pb-4">
      {actions.map((action) => {
        const Icon = ICON_MAP[action.icon] || Sparkles;
        return (
          <button
            key={action.label}
            onClick={() => onSelect(action.prompt)}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-[#2A2A2A] bg-[#0D0D0D] hover:border-[#C9A227]/40 hover:bg-[#C9A227]/5 transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A227]/20 transition-colors">
              <Icon className="w-3.5 h-3.5 text-[#C9A227]" />
            </div>
            <span className="text-xs text-[#A0A0A0] group-hover:text-[#EDE9E0] transition-colors font-medium">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Chat input ────────────────────────────────────────────────────────────────
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Tell me about your artist...",
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-[#2A2A2A] bg-[#0A0A0A] p-3">
      <div className="flex items-end gap-2 bg-[#141414] rounded-xl border border-[#2A2A2A] focus-within:border-[#C9A227]/40 transition-colors px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-sm text-[#EDE9E0] placeholder:text-[#555] resize-none outline-none min-h-[24px] max-h-[120px] py-1 scrollbar-hide"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
            value.trim() && !disabled
              ? "bg-[#C9A227] text-[#050505] hover:bg-[#E8C840]"
              : "bg-[#222] text-[#555] cursor-not-allowed"
          )}
        >
          {disabled ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-[#444] text-center mt-1.5">
        EPK Agent uses AI to create professional press kits
      </p>
    </div>
  );
}

// ── Welcome screen ────────────────────────────────────────────────────────────
export function ChatWelcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#E8C840] flex items-center justify-center mb-5 shadow-lg shadow-[#C9A227]/20">
        <Sparkles className="w-6 h-6 text-[#050505]" />
      </div>

      <h2 className="font-display text-2xl tracking-wider text-[#EDE9E0] mb-2">
        EPK AGENT
      </h2>
      <p className="text-sm text-[#777] max-w-[260px] leading-relaxed">
        I'll build you a professional Electronic Press Kit in minutes. Just tell me about your artist.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-5 max-w-[280px]">
        {["AI Bio Writing", "3 Templates", "Real-time Preview", "PDF Export"].map(
          (f) => (
            <span
              key={f}
              className="text-[10px] px-2.5 py-1 rounded-full border border-[#C9A227]/20 text-[#C9A227] bg-[#C9A227]/5"
            >
              {f}
            </span>
          )
        )}
      </div>
    </div>
  );
}
