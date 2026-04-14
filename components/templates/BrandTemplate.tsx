"use client";

import { EPKData } from "@/lib/types";
import { Music2, ExternalLink, Star } from "lucide-react";

interface Props {
  data: EPKData;
  preview?: boolean;
}

export function BrandTemplate({ data, preview = false }: Props) {
  const gold = "#C9A227";
  const dark = "#1A1A1A";
  const cream = "#F5F0EB";
  const creamBorder = "#E8DFD5";
  const gray = "#666";
  const lightCard = "#fff";

  const hasStats = Object.values(data.stats || {}).some(Boolean);
  const hasCollabs = (data.collaborators || []).length > 0;
  const hasBrands = (data.brandPartners || []).length > 0;
  const hasSocial = Object.values(data.socialLinks || {}).some(Boolean);

  const valueProps = [
    {
      n: "01",
      title: "Authentic Reach",
      desc: `${data.artistName}'s fanbase is passionate, diverse, and deeply engaged — driving real action with every campaign.`,
    },
    {
      n: "02",
      title: "Cultural Alignment",
      desc: "Known for authenticity and creativity, every brand collaboration is thoughtfully integrated, not just a placement.",
    },
    {
      n: "03",
      title: "Proven Results",
      desc: "Past brand partnerships have generated measurable ROI through social impressions, product launches, and co-created content.",
    },
  ];

  return (
    <div
      style={{
        background: cream,
        color: dark,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: preview ? "auto" : "100vh",
      }}
    >
      {/* Masthead */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(245,240,235,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${creamBorder}`,
          padding: "0 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.1em", color: dark, lineHeight: 1 }}>
              {data.artistName.toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: gray, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Brand Partnership Kit
            </div>
          </div>
        </div>
        {data.bookingEmail && (
          <a
            href={`mailto:${data.bookingEmail}`}
            style={{
              border: `2px solid ${gold}`, color: gold, padding: "7px 18px",
              borderRadius: 4, fontWeight: 700, textDecoration: "none",
              fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            Inquire
          </a>
        )}
      </header>

      {/* Hero — 2 col split */}
      <section style={{ minHeight: preview ? 200 : 500, display: "flex", alignItems: "stretch" }}>
        {/* Image */}
        <div
          style={{
            flex: "0 0 40%",
            background: data.profileImageUrl
              ? `url(${data.profileImageUrl}) center/cover no-repeat`
              : `linear-gradient(135deg, ${dark} 0%, #333 100%)`,
          }}
        />
        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 5%",
            background: cream,
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: "0.2em", color: gold, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
            {data.genre || "Artist"} · {data.hometown || "Worldwide"}
          </span>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              lineHeight: 0.9,
              color: dark,
              letterSpacing: "0.05em",
              margin: "0 0 20px",
            }}
          >
            {data.artistName}
          </h1>
          {data.shortBio && (
            <p style={{ fontSize: 15, color: gray, lineHeight: 1.8, maxWidth: 400 }}>{data.shortBio}</p>
          )}
        </div>
      </section>

      {/* Stats band — dark */}
      {hasStats && (
        <div style={{ background: dark, padding: "28px 5%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 24 }}>
            {[
              { key: "spotifyListeners", label: "Spotify Listeners" },
              { key: "youtubeSubscribers", label: "YT Subscribers" },
              { key: "tiktokViews", label: "TikTok Views" },
              { key: "instagramFollowers", label: "Instagram" },
            ].filter((s) => (data.stats as Record<string, string>)[s.key]).map((s) => (
              <div key={s.key} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: gold, letterSpacing: "0.05em" }}>
                  {(data.stats as Record<string, string>)[s.key]}
                </div>
                <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Story */}
      {data.bio && (
        <section style={{ padding: "80px 5%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, maxWidth: 1100, margin: "0 auto" }}>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: dark, letterSpacing: "0.05em", lineHeight: 0.9, margin: "0 0 12px" }}>
                THE<br />STORY
              </h2>
              <div style={{ width: 40, height: 3, background: gold }} />
            </div>
            <div>
              <p style={{ fontSize: 15, color: gray, lineHeight: 1.9 }}>{data.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* Value props */}
      <section style={{ padding: "80px 5%", background: "#FDFAF7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: dark, letterSpacing: "0.05em", marginBottom: 32 }}>
            BRAND VALUE
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {valueProps.map((v) => (
              <div
                key={v.n}
                style={{
                  background: lightCard,
                  border: `1px solid ${creamBorder}`,
                  borderRadius: 10,
                  padding: "28px 24px",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: gold, marginBottom: 12, lineHeight: 1 }}>
                  {v.n}
                </div>
                <h3 style={{ fontWeight: 700, color: dark, marginBottom: 10, fontSize: 16 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: gray, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand partnerships */}
      {hasBrands && (
        <section style={{ padding: "80px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: dark, letterSpacing: "0.05em", marginBottom: 32 }}>
              PAST PARTNERSHIPS
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {data.brandPartners?.map((b, i) => (
                <span
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    border: `1px solid ${creamBorder}`,
                    background: lightCard,
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: dark,
                  }}
                >
                  <Star size={12} fill={gold} color={gold} />
                  {b}
                </span>
              ))}
            </div>

            <div
              style={{
                marginTop: 32,
                background: "#FDFAF7",
                border: `1px solid ${creamBorder}`,
                borderLeft: `4px solid ${gold}`,
                borderRadius: 8,
                padding: "24px 20px",
              }}
            >
              <p style={{ fontSize: 14, color: gray, lineHeight: 1.8, marginBottom: 16 }}>
                {data.artistName} is open to brand partnerships that align authentically with their artistic vision and fan community. Preferred collaboration types: product launches, social campaigns, event activations, and co-created content.
              </p>
              {data.bookingEmail && (
                <a
                  href={`mailto:${data.bookingEmail}`}
                  style={{
                    display: "inline-block",
                    border: `2px solid ${gold}`,
                    color: gold,
                    padding: "8px 20px",
                    borderRadius: 4,
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Start a Partnership Conversation
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Music */}
      {(data.youtubeVideoId || data.spotifyArtistId) && (
        <section style={{ padding: "80px 5%", background: "#FDFAF7" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: dark, letterSpacing: "0.05em", marginBottom: 32 }}>
              THE MUSIC
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: data.youtubeVideoId && data.spotifyArtistId ? "1fr 1fr" : "1fr", gap: 20 }}>
              {data.youtubeVideoId && (
                <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9" }}>
                  <iframe src={`https://www.youtube.com/embed/${data.youtubeVideoId}`} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen loading="lazy" />
                </div>
              )}
              {data.spotifyArtistId && (
                <iframe src={`https://open.spotify.com/embed/artist/${data.spotifyArtistId}?utm_source=generator`} style={{ width: "100%", height: 340, border: "none", borderRadius: 10 }} loading="lazy" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Collaborators as social proof */}
      {hasCollabs && (
        <section style={{ padding: "60px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", color: dark, letterSpacing: "0.05em", marginBottom: 20 }}>
              COLLABORATORS
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
              {data.collaborators?.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: lightCard,
                    border: `1px solid ${creamBorder}`,
                    borderRadius: 8,
                    padding: "14px 16px",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 500,
                    color: dark,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social */}
      {hasSocial && (
        <section style={{ padding: "40px 5%", background: dark }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
              {Object.entries(data.socialLinks || {}).filter(([, v]) => v).map(([k, v]) => (
                <a
                  key={k}
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#222",
                    borderRadius: 8, padding: "12px",
                    color: "#EDE9E0", textDecoration: "none", fontSize: 12,
                    textTransform: "capitalize", fontWeight: 500,
                    border: "1px solid #333",
                    transition: "background 0.2s",
                  }}
                >
                  <ExternalLink size={11} color={gold} />
                  {k}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {data.bookingEmail && (
        <section
          style={{
            background: dark,
            padding: "80px 5%",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: "#EDE9E0", letterSpacing: "0.05em", marginBottom: 12 }}>
            LET&rsquo;S COLLABORATE
          </h2>
          <p style={{ color: "#aaa", fontSize: 14, marginBottom: 28 }}>
            For brand partnerships, licensing, and sponsorship inquiries.
          </p>
          <a
            href={`mailto:${data.bookingEmail}`}
            style={{
              display: "inline-block", background: gold, color: dark,
              padding: "14px 40px", borderRadius: 6, fontWeight: 700,
              textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12,
            }}
          >
            {data.bookingEmail}
          </a>
        </section>
      )}

      <footer style={{ borderTop: `1px solid ${creamBorder}`, padding: "20px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", background: cream }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", color: gray, fontSize: 13 }}>
          {data.artistName.toUpperCase()} · BRAND KIT
        </span>
        <span style={{ fontSize: 12, color: "#aaa" }}>
          Built with <a href="/" style={{ color: gold, textDecoration: "none" }}>EPK Agent</a>
        </span>
      </footer>
    </div>
  );
}
