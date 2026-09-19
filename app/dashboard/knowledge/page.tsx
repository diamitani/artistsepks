"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import {
  BookOpen,
  Upload,
  FileText,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
  Bot,
  BrainCircuit,
} from "lucide-react";
import type { KnowledgeFile } from "@/lib/types";

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<KnowledgeFile[]>([
    {
      id: "kf-1",
      name: "2024_Album_Liner_Notes_&_Lyrics.pdf",
      type: "lyrics",
      size: "2.4 MB",
      uploadedAt: "2024-03-15",
      summary: "Full lyrics, track-by-track production credits, and thematic essays for upcoming release.",
    },
    {
      id: "kf-2",
      name: "RollingStone_Feature_Transcript.docx",
      type: "interview",
      size: "840 KB",
      uploadedAt: "2024-02-10",
      summary: "90-minute interview transcript covering creative evolution, influences, and live touring vision.",
    },
    {
      id: "kf-3",
      name: "Festival_Tech_Rider_2024.pdf",
      type: "tech-spec",
      size: "1.1 MB",
      uploadedAt: "2024-01-20",
      summary: "16-channel input list, wireless microphone frequency requirements, stage plot, and monitor specs.",
    },
  ]);

  const [promptInput, setPromptInput] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "agent"; text: string }[]>([
    {
      sender: "agent",
      text: "Welcome to your Artist Knowledge Base. I have indexed your lyrics, interview transcripts, and technical riders. How can I assist you with your press narrative, pitch angles, or rider logistics today?",
    },
  ]);

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isPrompting) return;

    const userMsg = promptInput.trim();
    setPromptInput("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsPrompting(true);

    setTimeout(() => {
      let reply = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("bio") || lower.includes("pitch")) {
        reply = `Based on your indexed interview notes and lyrics, here is a compelling pitch angle:\n\n"Synthesizing nocturnal ambient soundscapes with stadium-scale pop songwriting, this project explores themes of emotional resilience and creative independence across 13M+ streams."`;
      } else if (lower.includes("rider") || lower.includes("tech") || lower.includes("venue")) {
        reply = `According to your 2024 Tech Spec document, your live configuration requires a minimum 24x16ft stage, 16 input channels, stereo IEM feeds, and 110dB SPL clean headroom.`;
      } else {
        reply = `I analyzed your knowledge base documents. Your core motifs center on authentic musicianship, innovative sound design, and festival live draw. I can compile this directly into your next EPK generation run.`;
      }

      setChatHistory((prev) => [...prev, { sender: "agent", text: reply }]);
      setIsPrompting(false);
    }, 700);
  };

  const handleSimulateUpload = () => {
    const newFile: KnowledgeFile = {
      id: `kf-${Date.now()}`,
      name: "New_Press_Release_Draft.pdf",
      type: "press-release",
      size: "1.2 MB",
      uploadedAt: new Date().toISOString().slice(0, 10),
      summary: "Official press release regarding upcoming national headline tour and single premiere.",
    };
    setFiles((prev) => [newFile, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-[#EDE9E0]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-[#EDE9E0] font-display">
              ARTIST KNOWLEDGE BASE
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              Upload raw lyrics, interview transcripts, press clippings, and prompt the AI workspace canvas.
            </p>
          </div>

          <button
            onClick={handleSimulateUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C9A227] text-black hover:bg-[#E8C840] transition-colors shadow"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Document
          </button>
        </div>

        {/* 2-Column Grid: Document Vault (Left) + AI Workspace Canvas (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Indexed Documents (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#AAA] font-bold">
                INDEXED REFERENCE FILES ({files.length})
              </h2>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222] hover:border-[#333] transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center flex-shrink-0 text-[#C9A227]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#EDE9E0] truncate">
                        {file.name}
                      </div>
                      <div className="text-[10px] text-[#666] font-mono mt-0.5">
                        {file.size} · Uploaded {file.uploadedAt}
                      </div>
                      {file.summary && (
                        <p className="text-[11px] text-[#888] mt-2 leading-relaxed">
                          {file.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: AI Canvas & Knowledge Prompt Workspace (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col h-[600px] rounded-2xl bg-[#0d0d0d] border border-[#222] overflow-hidden">
            {/* Canvas Header */}
            <div className="px-5 py-3.5 bg-[#121212] border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#C9A227]" />
                <span className="text-xs font-mono uppercase font-bold text-[#EDE9E0]">
                  AI KNOWLEDGE CANVAS
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#22C55E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                3 SOURCES CONNECTED
              </span>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "agent" && (
                    <div className="w-6 h-6 rounded bg-[#C9A227] flex items-center justify-center text-black flex-shrink-0 font-bold text-[10px]">
                      AI
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-xl max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-[#C9A227] text-black font-medium"
                        : "bg-[#181818] text-[#DDD] border border-[#262626] whitespace-pre-line"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isPrompting && (
                <div className="flex gap-2 items-center text-xs text-[#888] font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
                  Analyzing indexed documents...
                </div>
              )}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleSendPrompt} className="p-3 bg-[#0a0a0a] border-t border-[#1c1c1c] flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask anything about your artist lore, press angles, or riders..."
                className="flex-1 bg-[#141414] border border-[#282828] focus:border-[#C9A227] rounded-xl px-4 py-2 text-xs text-white outline-none"
              />
              <button
                type="submit"
                disabled={!promptInput.trim() || isPrompting}
                className="px-4 py-2 rounded-xl bg-[#C9A227] text-black font-bold text-xs hover:bg-[#E8C840] transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
