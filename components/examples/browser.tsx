"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Grid3X3, Search, Music2 } from "lucide-react";
import { EXAMPLES, type ExampleEPK } from "@/lib/examples";
import type { EPKData } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (data: EPKData) => void;
}

export function ExampleBrowser({ open, onClose, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = [...new Set(EXAMPLES.flatMap((e) => e.tags))].sort();

  const filtered = EXAMPLES.filter((ex) => {
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase()) && !ex.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedTags.length > 0 && !selectedTags.some((t) => ex.tags.includes(t))) {
      return false;
    }
    return true;
  });

  const handleSelect = (ex: ExampleEPK) => {
    // Deep clone the data to avoid mutations
    const cloned: EPKData = JSON.parse(JSON.stringify(ex.data));
    onSelect(cloned);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl w-[90vw] max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#E8C840] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#050505]" />
                </div>
                <div>
                  <h2 className="font-display text-sm tracking-wider text-[#EDE9E0]">Example EPKs</h2>
                  <p className="text-[10px] text-[#666]">Clone a template to get started instantly</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#888] hover:text-[#EDE9E0] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search + tags */}
            <div className="px-6 py-3 border-b border-[#1E1E1E] space-y-2.5">
              <div className="flex items-center gap-2 bg-[#141414] rounded-xl border border-[#2A2A2A] px-3 py-2">
                <Search className="w-3.5 h-3.5 text-[#555]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search examples..."
                  className="flex-1 bg-transparent text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      )
                    }
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[#C9A227] text-[#050505]"
                        : "bg-[#181818] text-[#888] border border-[#2A2A2A] hover:border-[#555]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Grid3X3 className="w-8 h-8 text-[#444] mb-3" />
                  <p className="text-sm text-[#666]">No examples match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map((ex) => (
                    <ExampleCard key={ex.id} example={ex} onSelect={handleSelect} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExampleCard({ example, onSelect }: { example: ExampleEPK; onSelect: (ex: ExampleEPK) => void }) {
  return (
    <button
      onClick={() => onSelect(example)}
      className="text-left group bg-[#0D0D0D] border border-[#2A2A2A] hover:border-[#C9A227]/40 rounded-xl p-4 transition-all hover:bg-[#C9A227]/[0.02]"
    >
      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${example.previewColor}20` }}
        >
          <Music2 className="w-4 h-4" style={{ color: example.previewColor }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-[#EDE9E0] group-hover:text-[#C9A227] transition-colors truncate">
            {example.name}
          </h3>
          <p className="text-[11px] text-[#777] mt-1 line-clamp-2 leading-relaxed">
            {example.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {example.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#181818] text-[#666] border border-[#2A2A2A]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
