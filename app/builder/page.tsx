"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatInput,
  ChatWelcome,
  QuickActions,
  StatusBadge,
} from "@/components/ui/chat";
import { MainTemplate } from "@/components/templates/MainTemplate";
import { BookingTemplate } from "@/components/templates/BookingTemplate";
import { BrandTemplate } from "@/components/templates/BrandTemplate";
import { QUICK_ACTIONS } from "@/lib/agent";
import type { EPKData, EPKTemplate, ArtistProfile } from "@/lib/types";
import type { ChatMessage, SSEEvent } from "@/lib/agent";
import { PdfDownload } from "@/components/ui/pdf-download";
import { ExampleBrowser } from "@/components/examples/browser";
import { DeployMenu } from "@/components/ui/deploy-menu";
import {
  Music2,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Download,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Eye,
  Palette,
  Library,
  UserCircle,
} from "lucide-react";

// ── Empty EPK data ────────────────────────────────────────────────────────────
const EMPTY_EPK: EPKData = {
  template: "main",
  artistName: "",
  artistTagline: "",
  genre: "",
  hometown: "",
  bio: "",
  shortBio: "",
  heroImageUrl: "",
  profileImageUrl: "",
  youtubeVideoId: "",
  spotifyArtistId: "",
  stats: {},
  releases: [],
  timeline: [],
  pressQuotes: [],
  collaborators: [],
  brandPartners: [],
  socialLinks: {},
  bookingEmail: "",
};

// ── Template selector pill ────────────────────────────────────────────────────
function TemplatePill({
  template,
  active,
  onClick,
}: {
  template: EPKTemplate;
  active: boolean;
  onClick: () => void;
}) {
  const config: Record<EPKTemplate, { label: string; color: string }> = {
    main: { label: "Main EPK", color: "#C9A227" },
    booking: { label: "Booking", color: "#C8102E" },
    brand: { label: "Brand", color: "#C9A227" },
  };

  const t = config[template];

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all",
        active
          ? "text-[#050505] font-semibold shadow-md"
          : "text-[#888] border border-[#333] hover:border-[#555]"
      )}
      style={active ? { background: t.color } : undefined}
    >
      {t.label}
    </button>
  );
}

// ── EPK update count badge ────────────────────────────────────────────────────
function UpdateCounter({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20"
    >
      <CheckCircle2 className="w-3 h-3 text-[#C9A227]" />
      <span className="text-[10px] text-[#C9A227] font-medium tracking-wider">
        {count} FIELDS SET
      </span>
    </motion.div>
  );
}

// ── Unique ID helper ──────────────────────────────────────────────────────────
let _idCounter = 0;
function uid() {
  return `msg_${Date.now()}_${++_idCounter}`;
}

// ── Deep merge for EPK patches ────────────────────────────────────────────────
function applyPatch(base: EPKData, patch: Partial<EPKData>): EPKData {
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof (result as Record<string, unknown>)[key] === "object" &&
      !Array.isArray((result as Record<string, unknown>)[key])
    ) {
      // Deep merge objects (like stats, socialLinks)
      (result as Record<string, unknown>)[key] = {
        ...((result as Record<string, unknown>)[key] as object),
        ...value,
      };
    } else {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}

// ── Count filled fields ───────────────────────────────────────────────────────
function countFilledFields(epk: EPKData): number {
  let count = 0;
  if (epk.artistName) count++;
  if (epk.artistTagline) count++;
  if (epk.genre) count++;
  if (epk.hometown) count++;
  if (epk.bio) count++;
  if (epk.shortBio) count++;
  if (epk.heroImageUrl) count++;
  if (epk.profileImageUrl) count++;
  if (epk.youtubeVideoId) count++;
  if (epk.spotifyArtistId) count++;
  if (epk.bookingEmail) count++;
  if (Object.values(epk.stats || {}).some(Boolean)) count++;
  if ((epk.releases || []).length > 0) count++;
  if ((epk.timeline || []).length > 0) count++;
  if ((epk.pressQuotes || []).length > 0) count++;
  if ((epk.collaborators || []).length > 0) count++;
  if ((epk.brandPartners || []).length > 0) count++;
  if (Object.values(epk.socialLinks || {}).some(Boolean)) count++;
  return count;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ██ MAIN BUILDER PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function BuilderPage() {
  // ── State ───────────────────────────────────────────────────────────────────
  const [epk, setEpk] = useState<EPKData>({ ...EMPTY_EPK });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Load intake data on mount ───────────────────────────────────────────────
  useEffect(() => {
    const intakeData = sessionStorage.getItem("intakeProfile");
    if (intakeData) {
      try {
        const profile: ArtistProfile = JSON.parse(intakeData);
        const bg = profile.background;
        if (bg.artistName) {
          const initialEpk: EPKData = {
            ...EMPTY_EPK,
            artistName: bg.artistName,
            genre: bg.genre,
            hometown: bg.hometown || bg.location,
            bio: bg.bio,
            shortBio: `${bg.artistName} is ${bg.isProfessional ? "a professional" : "an"} ${bg.genre} artist from ${bg.location}.`,
            bookingEmail: profile.contact.email,
            bookingPhone: profile.contact.phone,
            socialLinks: {
              website: profile.contact.website || undefined,
              instagram: (profile.enriched.socialMedia.instagram as any)?.handle ? `https://instagram.com/${(profile.enriched.socialMedia.instagram as any).handle}` : undefined,
            },
          };
          setEpk(initialEpk);
          setMessages([{
            id: uid(),
            role: "assistant",
            content: `👋 Welcome, **${bg.artistName}**! I've loaded your intake information. I can see you're ${bg.isProfessional ? "a professional" : "an aspiring"} ${bg.genre || "musician"} from ${bg.location || "your area"}. ${profile.goals?.primaryGoal ? `\n\nYour primary goal: *${profile.goals.primaryGoal}*` : ""}\n\nLet's build your EPK! What would you like to start with? I can enhance your bio, add your music, or set up your stats.`,
            timestamp: Date.now(),
          }]);
          sessionStorage.removeItem("intakeProfile");
        }
      } catch { /* ignore parse errors */ }
    }
  }, []);

  // ── Auto-scroll chat ────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, agentStatus]);

  // ── Send message to agent ───────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);
      setAgentStatus("thinking");

      // Build conversation history for Claude
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Create assistant message placeholder
      const assistantId = uid();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        epkPatches: [],
      };
      setMessages((prev) => [...prev, assistantMsg]);

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            epkData: epk,
          }),
        });

        if (!res.ok) {
          throw new Error(`Agent error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let assistantText = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6);
              if (payload === "[DONE]") break;

              try {
                const event: SSEEvent = JSON.parse(payload);

                switch (event.type) {
                  case "text":
                    assistantText += event.content;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: assistantText }
                          : m
                      )
                    );
                    break;

                  case "epk_update":
                    setEpk((prev) => applyPatch(prev, event.patch));
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? {
                              ...m,
                              epkPatches: [
                                ...(m.epkPatches || []),
                                event.patch,
                              ],
                            }
                          : m
                      )
                    );
                    break;

                  case "status":
                    setAgentStatus(event.status);
                    break;

                  case "done":
                    break;
                }
              } catch {
                // partial line, skip
              }
            }
          }
        }
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: `⚠️ ${errMsg}` } : m
          )
        );
      }

      setIsStreaming(false);
      setAgentStatus(null);
    },
    [isStreaming, messages, epk]
  );

  // ── Handle quick action ─────────────────────────────────────────────────────
  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  // ── Load example ────────────────────────────────────────────────────────────
  const handleLoadExample = (data: EPKData) => {
    setEpk(data);
    setMessages([{
      id: uid(),
      role: "assistant",
      content: `✨ Loaded the **${data.artistName}** example EPK. You can customize anything — just tell me what to change.`,
      timestamp: Date.now(),
    }]);
  };

  // ── Publish EPK ─────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!epk.artistName) return;
    setSaving(true);
    setSaveError("");

    try {
      const res = await fetch("/api/epk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(epk),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      const { slug } = await res.json();
      setPublishedSlug(slug);
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Failed to publish"
      );
    }

    setSaving(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const filledCount = countFilledFields(epk);
  const hasContent = filledCount > 0;
  const templateColor = epk.template === "booking" ? "#C8102E" : "#C9A227";

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="h-12 border-b border-[#C9A227]/10 flex items-center justify-between px-4 flex-shrink-0 bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          {/* Toggle chat */}
          <button
            onClick={() => setChatCollapsed(!chatCollapsed)}
            className="p-1.5 rounded-lg text-[#777] hover:text-[#EDE9E0] hover:bg-[#181818] transition-colors"
            title={chatCollapsed ? "Show chat" : "Hide chat"}
          >
            {chatCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center">
              <Music2 className="w-3 h-3 text-[#050505]" />
            </div>
            <span className="font-display text-sm tracking-wider text-[#EDE9E0] hidden sm:inline">
              EPK AGENT
            </span>
          </Link>

          <div className="h-4 w-px bg-[#333] mx-1" />

          {/* Template switcher */}
          <div className="flex items-center gap-1.5">
            {(["main", "booking", "brand"] as EPKTemplate[]).map((t) => (
              <TemplatePill
                key={t}
                template={t}
                active={epk.template === t}
                onClick={() => setEpk((prev) => ({ ...prev, template: t }))}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UpdateCounter count={filledCount} />

          {/* Profile / Intake */}
          <Link
            href="/builder/intake"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors"
          >
            <UserCircle className="w-3 h-3" />
            Profile
          </Link>

          {/* Examples browser */}
          {hasContent && (
            <button
              onClick={() => setShowExamples(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors"
            >
              <Library className="w-3 h-3" />
              Examples
            </button>
          )}

          {/* Pre-publish PDF download */}
          {hasContent && <PdfDownload data={epk} />}

          {/* Deploy menu */}
          {hasContent && <DeployMenu data={epk} slug={publishedSlug} />}

          {hasContent && !publishedSlug && (
            <Button
              variant="gold"
              size="sm"
              onClick={handlePublish}
              disabled={!epk.artistName || saving}
              className="rounded-full text-[10px] px-4"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  Publish
                </>
              )}
            </Button>
          )}

          {publishedSlug && (
            <div className="flex items-center gap-2">
              <Link
                href={`/epk/${publishedSlug}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-[10px] font-medium tracking-wider uppercase hover:bg-[#C9A227]/20 transition-colors"
              >
                <Eye className="w-3 h-3" />
                View Live
              </Link>
              <a
                href={`/api/pdf/${publishedSlug}`}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-[#888] text-[10px] font-medium tracking-wider uppercase hover:border-[#C9A227]/30 hover:text-[#C9A227] transition-colors"
              >
                <Download className="w-3 h-3" />
                PDF
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Examples browser modal */}
      <ExampleBrowser
        open={showExamples}
        onClose={() => setShowExamples(false)}
        onSelect={handleLoadExample}
      />

      {saveError && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 text-center">
          {saveError}
        </div>
      )}

      {/* ── Split panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── CHAT PANEL (Left) ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!chatCollapsed && (
            <motion.aside
              key="chat"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col border-r border-[#1E1E1E] bg-[#0A0A0A] overflow-hidden flex-shrink-0"
            >
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-[#1E1E1E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse" />
                  <span className="text-xs text-[#888] font-medium tracking-wider uppercase">
                    Agent Chat
                  </span>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      setMessages([]);
                      setEpk({ ...EMPTY_EPK });
                      setPublishedSlug(null);
                    }}
                    className="text-[10px] text-[#555] hover:text-[#C9A227] transition-colors tracking-wider uppercase"
                  >
                    New Chat
                  </button>
                )}
              </div>

              {/* Messages area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide"
              >
                {messages.length === 0 ? (
                  <>
                    <ChatWelcome />
                    <QuickActions
                      actions={QUICK_ACTIONS}
                      onSelect={handleQuickAction}
                    />
                  </>
                ) : (
                  <div className="py-3 space-y-1">
                    {messages.map((msg) => (
                      <div key={msg.id}>
                        <ChatBubble
                          role={msg.role}
                          content={msg.content}
                          isStreaming={
                            isStreaming &&
                            msg.role === "assistant" &&
                            msg.id ===
                              messages[messages.length - 1]?.id
                          }
                          timestamp={msg.timestamp}
                        />
                        {/* Show EPK update badges inline */}
                        {msg.epkPatches &&
                          msg.epkPatches.length > 0 && (
                            <div className="flex flex-wrap gap-1 px-14 py-1">
                              {msg.epkPatches.map((patch, i) => {
                                const keys = Object.keys(patch);
                                return keys.map((key) => (
                                  <span
                                    key={`${i}-${key}`}
                                    className="text-[9px] px-2 py-0.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 tracking-wider"
                                  >
                                    ✓ {key.replace(/([A-Z])/g, " $1").trim()}
                                  </span>
                                ));
                              })}
                            </div>
                          )}
                      </div>
                    ))}

                    {agentStatus && agentStatus !== "done" && (
                      <StatusBadge status={agentStatus} />
                    )}
                  </div>
                )}
              </div>

              {/* Input */}
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={() => sendMessage(input)}
                disabled={isStreaming}
                placeholder={
                  messages.length === 0
                    ? "Tell me about your artist..."
                    : "Ask for changes or add details..."
                }
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── PREVIEW PANEL (Center/Right) ───────────────────────────────── */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#111]">
          {hasContent ? (
            <>
              {/* Preview toolbar */}
              <div className="h-10 border-b border-[#222] bg-[#161616] flex items-center px-4 gap-3 flex-shrink-0">
                {/* Browser dots */}
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                {/* URL bar */}
                <div className="flex-1 h-6 rounded bg-[#222] flex items-center px-3 max-w-md">
                  <span className="text-[10px] text-[#555] truncate">
                    artistsepks.com/epk/
                    {epk.artistName
                      ? epk.artistName
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "")
                      : "your-artist"}
                  </span>
                </div>
                {/* Template indicator */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-widest"
                  style={{
                    background: `${templateColor}15`,
                    color: templateColor,
                  }}
                >
                  <Palette className="w-2.5 h-2.5" />
                  {epk.template}
                </div>
              </div>

              {/* Template preview */}
              <div
                ref={previewRef}
                className="flex-1 overflow-y-auto"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={epk.template}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {epk.template === "booking" ? (
                      <BookingTemplate data={epk} preview />
                    ) : epk.template === "brand" ? (
                      <BrandTemplate data={epk} preview />
                    ) : (
                      <MainTemplate data={epk} preview />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 rounded-2xl bg-[#181818] border border-[#2A2A2A] flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-[#C9A227]/40" />
                </div>
                <h3 className="font-display text-xl tracking-wider text-[#555] mb-3">
                  YOUR EPK PREVIEW
                </h3>
                <p className="text-sm text-[#444] leading-relaxed mb-6">
                  Start chatting with the agent to build your press kit. The
                  preview will update in real-time as your EPK takes shape.
                </p>
                {chatCollapsed && (
                  <Button
                    variant="gold-outline"
                    size="sm"
                    onClick={() => setChatCollapsed(false)}
                    className="rounded-full"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5" />
                    Open Chat
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
