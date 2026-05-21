"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Plus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";

interface DomainEntry {
  id: string;
  domain: string;
  epkSlug: string;
  verified: boolean;
  createdAt: string;
}

const DEMO_DOMAINS: DomainEntry[] = [];

const DNS_RECORDS = [
  { type: "CNAME", name: "@", value: "artistsepks.com", ttl: "3600" },
  { type: "CNAME", name: "www", value: "artistsepks.com", ttl: "3600" },
];

export default function DomainsPage() {
  const [domains, setDomains] = useState<DomainEntry[]>(DEMO_DOMAINS);
  const [newDomain, setNewDomain] = useState("");
  const [selectedEpk, setSelectedEpk] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Demo EPKs for domain mapping
  const myEpks = [
    { slug: "luh-kel", name: "Luh Kel" },
    { slug: "my-artist", name: "My Artist" },
  ];

  const handleAddDomain = async () => {
    if (!newDomain || !selectedEpk) return;
    setAdding(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    const entry: DomainEntry = {
      id: `dom_${Date.now()}`,
      domain: newDomain,
      epkSlug: selectedEpk,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    setDomains((prev) => [...prev, entry]);
    setNewDomain("");
    setSelectedEpk("");
    setShowAdd(false);
    setAdding(false);
  };

  const handleVerify = async (id: string) => {
    // In production, this would check DNS propagation
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verified: true } : d))
    );
  };

  const handleRemove = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCopyRecord = (index: number) => {
    const record = DNS_RECORDS[index];
    const text = `${record.type} ${record.name} → ${record.value}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDE9E0]">
      {/* Header */}
      <header className="h-14 border-b border-[#1E1E1E] flex items-center justify-between px-6 bg-[#0A0A0A]">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-[#EDE9E0] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wider uppercase font-medium">Dashboard</span>
        </Link>
        <div>
          <span className="font-display text-sm tracking-wider text-[#EDE9E0]">Custom Domains</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#C9A227]/5 border border-[#C9A227]/20 mb-8">
          <Globe className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-[#EDE9E0] mb-1">Custom Domain Setup</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Point your own domain to your EPK page. Add a CNAME record to your DNS provider pointing to{" "}
              <code className="text-[#C9A227] bg-[#C9A227]/10 px-1 py-0.5 rounded">artistsepks.com</code>,
              then verify below. Propagation can take up to 48 hours.
            </p>
          </div>
        </div>

        {/* Add domain button / form */}
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#333] w-full text-left text-[#888] hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">Add Custom Domain</span>
          </button>
        ) : (
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
            <div>
              <label className="text-[10px] text-[#666] uppercase tracking-wider font-medium block mb-1.5">
                Your Domain
              </label>
              <input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="epk.yourartist.com"
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#EDE9E0] placeholder:text-[#555] outline-none focus:border-[#C9A227]/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#666] uppercase tracking-wider font-medium block mb-1.5">
                Link to EPK
              </label>
              <select
                value={selectedEpk}
                onChange={(e) => setSelectedEpk(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#EDE9E0] outline-none focus:border-[#C9A227]/40 transition-colors"
              >
                <option value="">Select an EPK...</option>
                {myEpks.map((epk) => (
                  <option key={epk.slug} value={epk.slug}>
                    {epk.name} ({epk.slug})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAddDomain}
                disabled={!newDomain || !selectedEpk || adding}
                className="px-4 py-2 rounded-lg bg-[#C9A227] text-[#050505] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8C840] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {adding && <Loader2 className="w-3 h-3 animate-spin" />}
                Add Domain
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg border border-[#333] text-[#888] text-xs hover:text-[#EDE9E0] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* DNS instructions */}
        <div className="mt-8">
          <h3 className="text-xs font-medium text-[#EDE9E0] tracking-wider uppercase mb-3">
            DNS Configuration
          </h3>
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="text-left px-4 py-3 text-[10px] text-[#666] uppercase tracking-wider font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-[10px] text-[#666] uppercase tracking-wider font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-[10px] text-[#666] uppercase tracking-wider font-medium">Value</th>
                  <th className="text-left px-4 py-3 text-[10px] text-[#666] uppercase tracking-wider font-medium">TTL</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {DNS_RECORDS.map((record, i) => (
                  <tr key={i} className="border-b border-[#1E1E1E] last:border-0">
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-[#181818] text-[10px] font-mono text-[#C9A227] border border-[#C9A227]/20">
                        {record.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#EDE9E0]">{record.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#888]">{record.value}</td>
                    <td className="px-4 py-3 text-xs text-[#666]">{record.ttl}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCopyRecord(i)}
                        className="p-1 rounded hover:bg-[#181818] transition-colors"
                        title="Copy record"
                      >
                        {copiedIndex === i ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#555]" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#555] mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            DNS changes can take 1–48 hours to propagate worldwide
          </p>
        </div>

        {/* Domain list */}
        {domains.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-medium text-[#EDE9E0] tracking-wider uppercase mb-3">
              Your Domains
            </h3>
            <div className="space-y-2">
              {domains.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {entry.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#555]" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-[#EDE9E0]">{entry.domain}</div>
                      <div className="text-[10px] text-[#666]">
                        → epk/{entry.epkSlug}
                        {entry.verified ? " · Verified" : " · Awaiting verification"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!entry.verified && (
                      <button
                        onClick={() => handleVerify(entry.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] text-[10px] font-medium tracking-wider uppercase hover:bg-[#C9A227]/20 transition-colors"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#333] text-[#888] text-[10px] hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help section */}
        <div className="mt-12 p-4 rounded-xl bg-[#181818] border border-[#2A2A2A]">
          <h4 className="text-xs font-medium text-[#EDE9E0] mb-2">How to set up your domain</h4>
          <ol className="text-xs text-[#888] space-y-2 leading-relaxed list-decimal list-inside">
            <li>Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)</li>
            <li>Add a CNAME record pointing your domain to <code className="text-[#C9A227]">artistsepks.com</code></li>
            <li>Wait for DNS propagation (usually 1–2 hours, up to 48)</li>
            <li>Click "Verify" above to confirm the connection</li>
            <li>Once verified, your EPK will be accessible at your custom domain</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
