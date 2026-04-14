"use client";

import { EPKData } from "@/lib/types";
import { Music2, ExternalLink } from "lucide-react";

interface Props {
  data: EPKData;
  preview?: boolean;
}

export function BookingTemplate({ data, preview = false }: Props) {
  const red = "#C8102E";
  const dark = "#050505";
  const card = "#0D0D0D";
  const offWhite = "#EDE9E0";
  const gray = "#A0A0A0";

  const hasStats = Object.values(data.stats || {}).some(Boolean);
  const hasReleases = (data.releases || []).length > 0;
  const hasSocial = Object.values(data.socialLinks || {}).some(Boolean);

  // Default packages if none provided
  const packages = data.performancePackages || [
    { name: "Club / Venue", capacity: "Up to 1,000", setLength: "45 min", features: ["Backing track setup", "Full rider provided", "Merch table", "2 guests backstage"] },
    { name: "Headline Show", capacity: "1,000–5,000", setLength: "75 min", features: ["Full live band option", "Production advance", "VIP meet & greet", "Custom stage design"] },
    { name: "Festival", capacity: "5,000+", setLength: "45–60 min", features: ["Full production package", "Stage plots provided", "Artist liaison required", "Hospitality advance"] },
  ];

  return (
    <div
      style={{
        background: dark,
        color: offWhite,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: preview ? "auto" : "100vh",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(5,5,5,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `2px solid ${red}`,
          padding: "0 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={16} color={offWhite} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em", color: offWhite }}>
            {data.artistName.toUpperCase()} — BOOKING
          </span>
        </div>
        {data.bookingEmail && (
          <a
            href={`mailto:${data.bookingEmail}`}
            style={{
              background: red, color: offWhite, padding: "8px 20px",
              borderRadius: 4, fontWeight: 700, textDecoration: "none",
              fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            Request Booking
          </a>
        )}
      </nav>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: preview ? 180 : 440,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 5% 60px",
          background: data.heroImageUrl
            ? `url(${data.heroImageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, #0D0D0D 0%, #1a0305 100%)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.5) 60%, transparent 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 11, color: red, letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Booking Information
          </span>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 0.9,
              color: offWhite,
              letterSpacing: "0.05em",
              margin: 0,
              textShadow: `0 0 40px ${red}40`,
            }}
          >
            {data.artistName}
          </h1>
          {(data.genre || data.hometown) && (
            <p style={{ color: gray, marginTop: 12, fontSize: 14 }}>
              {data.genre}{data.genre && data.hometown && " · "}{data.hometown}
            </p>
          )}
        </div>
      </section>

      {/* Stats bar */}
      {hasStats && (
        <div style={{ background: red, padding: "20px 5%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 24 }}>
            {[
              { key: "spotifyListeners", label: "Spotify Listeners" },
              { key: "youtubeSubscribers", label: "YT Subscribers" },
              { key: "instagramFollowers", label: "Instagram" },
              { key: "tiktokViews", label: "TikTok Views" },
            ].filter((s) => (data.stats as Record<string, string>)[s.key]).map((s) => (
              <div key={s.key} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: offWhite, letterSpacing: "0.05em" }}>
                  {(data.stats as Record<string, string>)[s.key]}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bio */}
      {data.bio && (
        <section style={{ padding: "60px 5%", background: card }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: "0.25em", color: red, textTransform: "uppercase", marginBottom: 12 }}>
              About the Artist
            </div>
            <div
              style={{
                borderLeft: `3px solid ${red}`,
                paddingLeft: 20,
                fontSize: 15,
                lineHeight: 1.8,
                color: gray,
              }}
            >
              {data.bio}
            </div>
          </div>
        </section>
      )}

      {/* Performance profile */}
      <section style={{ padding: "60px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 8 }}>
            PERFORMANCE PROFILE
          </h2>
          <div style={{ width: 60, height: 3, background: red, marginBottom: 32 }} />

          {/* Packages */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
            {packages.map((p, i) => (
              <div
                key={i}
                style={{
                  background: card,
                  border: `1px solid rgba(200,16,46,0.2)`,
                  borderRadius: 10,
                  padding: "24px 20px",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: red, letterSpacing: "0.1em", marginBottom: 12 }}>
                  {p.name.toUpperCase()}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  <div style={{ background: "#181818", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: gray, textTransform: "uppercase", letterSpacing: "0.1em" }}>Capacity</div>
                    <div style={{ fontSize: 13, color: offWhite, fontWeight: 600, marginTop: 2 }}>{p.capacity}</div>
                  </div>
                  <div style={{ background: "#181818", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: gray, textTransform: "uppercase", letterSpacing: "0.1em" }}>Set Length</div>
                    <div style={{ fontSize: 13, color: offWhite, fontWeight: 600, marginTop: 2 }}>{p.setLength}</div>
                  </div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: gray, marginBottom: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: red, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical rider stub */}
          <div style={{ background: card, borderRadius: 10, border: `1px solid rgba(200,16,46,0.15)`, overflow: "hidden" }}>
            <div style={{ background: red, padding: "12px 20px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", margin: 0, fontSize: 16 }}>
                TECHNICAL RIDER (SUMMARY)
              </h3>
            </div>
            <div style={{ padding: 20 }}>
              {[
                { section: "Audio", items: [["Main PA", "Line array preferred, min 10kW"], ["Monitors", "6+ wedge monitors or IEM capable"], ["FOH Position", "Centered, unobstructed sightlines"]] },
                { section: "Hospitality", items: [["Catering", "Hot meal + vegetarian option for 10"], ["Dressing Room", "Private, lockable, with mirrors"], ["Transportation", "Ground transport from/to hotel"]] },
              ].map((block) => (
                <div key={block.section} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: red, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 10 }}>{block.section}</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                        {["Equipment", "Specification"].map((h) => (
                          <th key={h} style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, color: gray, textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.items.map(([eq, spec], j) => (
                        <tr key={j} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                          <td style={{ padding: "8px", color: offWhite }}>{eq}</td>
                          <td style={{ padding: "8px", color: gray }}>{spec}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#555", marginTop: 12 }}>
                Full technical rider available upon confirmed booking inquiry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Music embeds */}
      {(data.youtubeVideoId || data.spotifyArtistId) && (
        <section style={{ padding: "60px 5%", background: card }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 8 }}>FEATURED MUSIC</h2>
            <div style={{ width: 60, height: 3, background: red, marginBottom: 32 }} />
            <div style={{ display: "grid", gridTemplateColumns: data.youtubeVideoId && data.spotifyArtistId ? "1fr 1fr" : "1fr", gap: 20 }}>
              {data.youtubeVideoId && (
                <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9" }}>
                  <iframe src={`https://www.youtube.com/embed/${data.youtubeVideoId}`} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen loading="lazy" />
                </div>
              )}
              {data.spotifyArtistId && (
                <iframe src={`https://open.spotify.com/embed/artist/${data.spotifyArtistId}?utm_source=generator&theme=0`} style={{ width: "100%", height: 340, border: "none", borderRadius: 10 }} loading="lazy" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Discography */}
      {hasReleases && (
        <section style={{ padding: "60px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 32 }}>
              DISCOGRAPHY HIGHLIGHTS
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
              {data.releases?.map((r, i) => (
                <div key={i} style={{ background: card, borderRadius: 8, padding: "16px", border: `1px solid rgba(200,16,46,0.12)` }}>
                  <div style={{ fontWeight: 600, color: offWhite, marginBottom: 4, fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: gray }}>{r.type} · {r.year}</div>
                  {r.certification && (
                    <div style={{ marginTop: 6, fontSize: 10, color: red, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      RIAA {r.certification}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social */}
      {hasSocial && (
        <section style={{ padding: "40px 5%", background: card }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {Object.entries(data.socialLinks || {}).filter(([, v]) => v).map(([k, v]) => (
              <a
                key={k}
                href={v}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  border: `1px solid rgba(200,16,46,0.25)`,
                  borderRadius: 6, padding: "8px 16px",
                  color: offWhite, textDecoration: "none", fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                <ExternalLink size={11} color={red} />
                {k}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {data.bookingEmail && (
        <section
          style={{
            background: `linear-gradient(135deg, ${red}22 0%, #050505 100%)`,
            padding: "80px 5%",
            textAlign: "center",
            borderTop: `1px solid ${red}30`,
          }}
        >
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 12 }}>
            READY TO BOOK?
          </h2>
          <p style={{ color: gray, fontSize: 14, marginBottom: 28 }}>
            Send booking inquiries directly to our management team.
          </p>
          <a
            href={`mailto:${data.bookingEmail}`}
            style={{
              display: "inline-block", background: red, color: offWhite,
              padding: "14px 40px", borderRadius: 6, fontWeight: 700,
              textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12,
            }}
          >
            {data.bookingEmail}
          </a>
        </section>
      )}

      <footer style={{ borderTop: `1px solid rgba(200,16,46,0.15)`, padding: "20px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", color: gray, fontSize: 13 }}>
          {data.artistName.toUpperCase()} · BOOKING
        </span>
        <span style={{ fontSize: 12, color: "#555" }}>
          Built with <a href="/" style={{ color: red, textDecoration: "none" }}>EPK Agent</a>
        </span>
      </footer>
    </div>
  );
}
