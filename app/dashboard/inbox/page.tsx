"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import {
  Mail,
  Search,
  CheckCircle2,
  Send,
  Reply,
  Archive,
  Star,
  Trash2,
  Sparkles,
  Building2,
  Briefcase,
  Users,
} from "lucide-react";
import type { InboxMessage } from "@/lib/types";

const SAMPLE_MESSAGES: InboxMessage[] = [
  {
    id: "msg-1",
    senderName: "Marcus Thorne",
    senderRole: "Talent Buyer @ The Troubadour",
    senderAvatar: "MT",
    subject: "Fall 2024 Headline Date & Support Slot Hold",
    preview: "Hey team, we loved Luna Sol's live reel and EPK submission. We have October 18th available...",
    content: `Hi Atlas Management team,

We reviewed Luna Sol's EPK submission and live performance reel for our upcoming Fall season. The sound is incredible and the engagement numbers are exactly what our room caters to.

We currently have a hold for Friday, October 18th for a co-headline showcase (500 Cap Room). Standard 75-minute set length.

Please let us know if routing aligns and we can advance the tech rider with production.

Best regards,
Marcus Thorne
Head of Talent Booking · The Troubadour`,
    date: "Today, 2:15 PM",
    unread: true,
    category: "booking",
    replyCount: 2,
  },
  {
    id: "msg-2",
    senderName: "Elena Rostova",
    senderRole: "Brand Partnerships Director @ Sennheiser",
    senderAvatar: "ER",
    subject: "Creator Endorsement & Wireless Rig Sponsorship",
    preview: "We'd love to discuss providing Luna Sol with our EW-DX wireless microphone system...",
    content: `Hi there,

Following up on your brand submission via Artispreneur. We are currently selecting artists for our 2024 Artist Endorsement Program and would love to outfit Luna Sol with our EW-DX wireless vocal system and custom in-ear monitors.

Would you be open to a 15-minute introductory call this Thursday?

Cheers,
Elena Rostova
Sennheiser Creator Relations`,
    date: "Yesterday",
    unread: false,
    category: "brand",
    replyCount: 1,
  },
  {
    id: "msg-3",
    senderName: "Julian Hayes",
    senderRole: "Lead Curator @ Fresh Indie Horizons",
    senderAvatar: "JH",
    subject: "Track Placement Confirmation for 'Midnight Horizon'",
    preview: "Added 'Midnight Horizon' to Position #3 on Fresh Indie Horizons playlist (240k reach)...",
    content: `Hey Luna Sol,

Just letting you know we added 'Midnight Horizon' to Position #3 on our Fresh Indie Horizons Spotify playlist for the next 4 weeks!

Tag us on Instagram stories so we can repost to our 85k audience.

Keep making incredible music!
Julian`,
    date: "Sep 16",
    unread: false,
    category: "press",
    replyCount: 0,
  },
];

export default function InboxPage() {
  const [messages, setMessages] = useState<InboxMessage[]>(SAMPLE_MESSAGES);
  const [selectedMessageId, setSelectedMessageId] = useState<string>(SAMPLE_MESSAGES[0].id);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setTimeout(() => {
      setReplyText("");
      setReplySent(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-[#EDE9E0]">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#EDE9E0] font-display">
              INBOX & BOOKING INQUIRIES
            </h1>
            <p className="text-xs text-[#888]">
              Direct communication with talent bookers, brands, curators, and collaborators.
            </p>
          </div>
        </div>

        {/* 2-Pane Split: Message List (Left) + Detail Reader & Composer (Right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Message Thread List (w-80 md:w-96) */}
          <div className="w-80 md:w-96 border-r border-[#1f1f1f] bg-[#080808] flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-[#1c1c1c]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="divide-y divide-[#171717]">
              {messages.map((msg) => {
                const isSelected = msg.id === selectedMessageId;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`w-full text-left p-4 transition-colors flex gap-3 ${
                      isSelected ? "bg-[#141414] border-l-2 border-[#C9A227]" : "hover:bg-[#0e0e0e]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center font-bold text-xs text-[#C9A227] flex-shrink-0">
                      {msg.senderAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-xs truncate ${msg.unread ? "font-bold text-white" : "text-[#CCC]"}`}>
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-[#666] font-mono flex-shrink-0">{msg.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-[#EDE9E0] truncate mb-1">
                        {msg.subject}
                      </div>
                      <p className="text-[11px] text-[#777] line-clamp-2 leading-relaxed">
                        {msg.preview}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Message Content & Reply Composer */}
          <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
            {activeMessage ? (
              <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
                <div>
                  {/* Subject & Actions */}
                  <div className="flex items-start justify-between gap-4 border-b border-[#1f1f1f] pb-4 mb-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20">
                        {activeMessage.category.toUpperCase()} INQUIRY
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-[#EDE9E0] mt-2">
                        {activeMessage.subject}
                      </h2>
                      <div className="text-xs text-[#888] mt-1">
                        From <strong className="text-white">{activeMessage.senderName}</strong> ({activeMessage.senderRole})
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="text-xs md:text-sm text-[#DDD] leading-relaxed whitespace-pre-line space-y-4 max-w-2xl bg-[#0c0c0c] border border-[#1f1f1f] rounded-2xl p-6 mb-6">
                    {activeMessage.content}
                  </div>
                </div>

                {/* Reply Composer */}
                <div className="rounded-2xl bg-[#0d0d0d] border border-[#222] p-4 max-w-2xl">
                  {replySent ? (
                    <div className="py-4 text-center text-xs text-[#22C55E] flex items-center justify-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4" /> Reply Sent Successfully!
                    </div>
                  ) : (
                    <form onSubmit={handleSendReply} className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#777] font-mono">
                        <span>Reply as Atlas Management / Luna Sol</span>
                      </div>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${activeMessage.senderName}...`}
                        className="w-full bg-[#141414] border border-[#262626] focus:border-[#C9A227] rounded-xl p-3 text-xs text-white outline-none leading-relaxed"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A227] text-black font-bold text-xs hover:bg-[#E8C840] transition-colors disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send Reply
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-[#666]">
                Select a message to view
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
