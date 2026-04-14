"use client";

import { EPKData } from "@/lib/types";
import { Music2, ExternalLink } from "lucide-react";

interface Props {
  data: EPKData;
  preview?: boolean;
}

export function MainTemplate({ data, preview = false }: Props) {
  const gold = "#C9A227";
  const goldLight = "#E8C840";
  const dark = "#050505";
  const card = "#0D0D0D";
  const offWhite = "#EDE9E0";
  const gray = "#A0A0A0";

  const hasStats = Object.values(data.stats || {}).some(Boolean);
  const hasReleases = (data.releases || []).length > 0;
  const hasTimeline = (data.timeline || []).length > 0;
  const hasCollabs = (data.collaborators || []).length > 0;
  const hasSocial = Object.values(data.socialLinks || {}).some(Boolean);

  return (
    <div
      style={{
        background: dark,
        color: offWhite,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: preview ? "auto" : "100vh",
        position: "relative",
      }}
    >
      {/* Grain */}
      <div
        style={{
          position: "fixed",
          inset: "-200%",
          width: "400%",
          height: "400%",
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid rgba(201,162,39,0.15)`,
          padding: "0 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={16} color={dark} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em", color: offWhite }}>
            {data.artistName.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: gray }}>
          <a href="#bio" style={{ color: gray, textDecoration: "none" }}>Bio</a>
          <a href="#music" style={{ color: gray, textDecoration: "none" }}>Music</a>
          <a href="#discography" style={{ color: gray, textDecoration: "none" }}>Discography</a>
          {data.bookingEmail && (
            <a
              href={`mailto:${data.bookingEmail}`}
              style={{
                background: gold, color: dark, padding: "6px 16px",
                borderRadius: 4, fontWeight: 700, textDecoration: "none",
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >
              Book Now
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: preview ? 220 : 560,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 5% 60px",
          overflow: "hidden",
          background: data.heroImageUrl
            ? `url(${data.heroImageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, #0D0D0D 0%, #181818 50%, #0D0D0D 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 60%, transparent 100%)",
          }}
        />
        {/* Lamp glow */}
        <div
          style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 300, height: 300,
            background: `radial-gradient(ellipse at top, ${gold}20 0%, transparent 70%)`,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {data.genre && (
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: gold, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              {data.genre} · {data.hometown}
            </span>
          )}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 0.9,
              color: offWhite,
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            {data.artistName}
          </h1>
          {data.artistTagline && (
            <p style={{ color: gray, marginTop: 12, maxWidth: 500, fontSize: 15 }}>
              {data.artistTagline}
            </p>
          )}
        </div>
      </section>

      {/* Stats bento */}
      {hasStats && (
        <section style={{ padding: "60px 5%", background: "#0D0D0D" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
            {[
              { key: "spotifyListeners", label: "Spotify Listeners" },
              { key: "youtubeSubscribers", label: "YouTube Subscribers" },
              { key: "youtubeViews", label: "YouTube Views" },
              { key: "tiktokViews", label: "TikTok Views" },
              { key: "instagramFollowers", label: "Instagram" },
            ].filter((s) => (data.stats as Record<string, string>)[s.key]).map((s) => (
              <div
                key={s.key}
                style={{
                  background: "#181818",
                  borderRadius: 12,
                  padding: "20px 16px",
                  textAlign: "center",
                  border: `1px solid rgba(201,162,39,0.1)`,
                }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: gold, letterSpacing: "0.05em" }}>
                  {(data.stats as Record<string, string>)[s.key]}
                </div>
                <div style={{ fontSize: 10, color: gray, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bio */}
      {data.bio && (
        <section id="bio" style={{ padding: "80px 5%" }}>
          <div style={{ display: "grid", gridTemplateColumns: data.profileImageUrl ? "1fr 1fr" : "1fr", gap: 60, maxWidth: 1100, margin: "0 auto" }}>
            {data.profileImageUrl && (
              <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "3/4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.profileImageUrl} alt={data.artistName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: "0.25em", color: gold, textTransform: "uppercase", marginBottom: 16 }}>
                The Artist
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 24, lineHeight: 1 }}>
                ABOUT {data.artistName.toUpperCase()}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: gray, whiteSpace: "pre-wrap" }}>{data.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* YouTube + Spotify */}
      {(data.youtubeVideoId || data.spotifyArtistId) && (
        <section id="music" style={{ padding: "80px 5%", background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 40 }}>
              MUSIC
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: data.youtubeVideoId && data.spotifyArtistId ? "1fr 1fr" : "1fr", gap: 24 }}>
              {data.youtubeVideoId && (
                <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${data.youtubeVideoId}`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}
              {data.spotifyArtistId && (
                <div style={{ borderRadius: 12, overflow: "hidden" }}>
                  <iframe
                    src={`https://open.spotify.com/embed/artist/${data.spotifyArtistId}?utm_source=generator&theme=0`}
                    style={{ width: "100%", height: 380, border: "none" }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Discography */}
      {hasReleases && (
        <section id="discography" style={{ padding: "80px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 40 }}>
              DISCOGRAPHY
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
              {data.releases?.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: card,
                    borderRadius: 10,
                    overflow: "hidden",
                    border: `1px solid rgba(201,162,39,0.1)`,
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1",
                      background: r.coverUrl ? `url(${r.coverUrl}) center/cover` : `linear-gradient(135deg, #181818 0%, #222 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!r.coverUrl && <Music2 size={32} color={gold} opacity={0.4} />}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: offWhite, marginBottom: 4 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: gray }}>
                      {r.type} · {r.year}
                      {r.tracks && ` · ${r.tracks} tracks`}
                    </div>
                    {r.certification && (
                      <div
                        style={{
                          marginTop: 8,
                          display: "inline-block",
                          background: `${gold}15`,
                          color: gold,
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          border: `1px solid ${gold}30`,
                        }}
                      >
                        RIAA {r.certification}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {hasTimeline && (
        <section style={{ padding: "80px 5%", background: "#0D0D0D" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 40 }}>
              TIMELINE
            </h2>
            <div style={{ position: "relative", paddingLeft: 40 }}>
              <div style={{ position: "absolute", left: 8, top: 8, bottom: 8, width: 1, background: `${gold}30` }} />
              {data.timeline?.map((t, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 40 }}>
                  <div
                    style={{
                      position: "absolute", left: -36, top: 4,
                      width: 12, height: 12, borderRadius: "50%",
                      background: gold, border: `2px solid ${gold}`,
                    }}
                  />
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: "0.15em", color: gold }}>{t.year}</span>
                  <h3 style={{ fontWeight: 700, color: offWhite, margin: "4px 0 8px", fontSize: 16 }}>{t.title}</h3>
                  <p style={{ fontSize: 14, color: gray, lineHeight: 1.7 }}>{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collaborators */}
      {hasCollabs && (
        <section style={{ padding: "60px 5%" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 24 }}>
              COLLABORATORS
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {data.collaborators?.map((c, i) => (
                <span
                  key={i}
                  style={{
                    background: "#181818",
                    border: `1px solid rgba(201,162,39,0.15)`,
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 13,
                    color: offWhite,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social */}
      {hasSocial && (
        <section style={{ padding: "80px 5%", background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 24 }}>
              CONNECT
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {Object.entries(data.socialLinks || {}).filter(([, v]) => v).map(([k, v]) => (
                <a
                  key={k}
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#181818",
                    border: `1px solid rgba(201,162,39,0.15)`,
                    borderRadius: 8,
                    padding: "10px 18px",
                    color: offWhite,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  <ExternalLink size={12} color={gold} />
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
            padding: "100px 5%",
            background: `linear-gradient(135deg, #0D0D0D 0%, #181818 50%, #0D0D0D 100%)`,
            textAlign: "center",
            borderTop: `1px solid ${gold}20`,
          }}
        >
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,4rem)", color: offWhite, letterSpacing: "0.05em", marginBottom: 16 }}>
            BOOK {data.artistName.toUpperCase()}
          </h2>
          <p style={{ color: gray, marginBottom: 32, fontSize: 15 }}>
            For booking inquiries, press, and partnership opportunities.
          </p>
          <a
            href={`mailto:${data.bookingEmail}`}
            style={{
              display: "inline-block",
              background: gold,
              color: dark,
              padding: "14px 40px",
              borderRadius: 6,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            {data.bookingEmail}
          </a>
        </section>
      )}

      {/* Footer */}
      <footer style={{ borderTop: `1px solid rgba(201,162,39,0.1)`, padding: "24px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", color: gray, fontSize: 14 }}>
          {data.artistName.toUpperCase()}
        </span>
        <span style={{ fontSize: 12, color: "#555" }}>
          Built with <a href="/" style={{ color: gold, textDecoration: "none" }}>EPK Agent</a>
        </span>
      </footer>
    </div>
  );
}
