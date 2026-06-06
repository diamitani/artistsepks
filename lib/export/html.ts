import type { EPKData, EPKTemplate } from "@/lib/types";

// ── Helper: generate a complete standalone HTML page from EPKData ──────────────

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap');
`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderStats(data: EPKData, accent: string): string {
  const stats = [
    { key: "spotifyListeners", label: "Spotify Listeners" },
    { key: "youtubeSubscribers", label: "YouTube Subscribers" },
    { key: "youtubeViews", label: "YouTube Views" },
    { key: "tiktokViews", label: "TikTok Views" },
    { key: "instagramFollowers", label: "Instagram" },
  ].filter((s) => data.stats && (data.stats as Record<string, string>)[s.key]);

  if (stats.length === 0) return "";

  return `
    <section style="padding:60px 5%;background:#0D0D0D">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px">
        ${stats
          .map(
            (s) => `
          <div style="background:#181818;border-radius:12px;padding:20px 16px;text-align:center;border:1px solid ${accent}20">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:${accent};letter-spacing:0.05em">${escapeHtml((data.stats as Record<string, string>)[s.key])}</div>
            <div style="font-size:10px;color:#A0A0A0;text-transform:uppercase;letter-spacing:0.15em;margin-top:4px">${s.label}</div>
          </div>`
          )
          .join("")}
      </div>
    </section>`;
}

function renderBio(data: EPKData, accent: string): string {
  if (!data.bio) return "";
  return `
    <section id="bio" style="padding:80px 5%">
      <div style="display:grid;grid-template-columns:${data.profileImageUrl ? "1fr 1fr" : "1fr"};gap:60px;max-width:1100px;margin:0 auto">
        ${data.profileImageUrl ? `<div style="border-radius:12px;overflow:hidden;aspect-ratio:3/4"><img src="${escapeHtml(data.profileImageUrl)}" alt="${escapeHtml(data.artistName)}" style="width:100%;height:100%;object-fit:cover"/></div>` : ""}
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:0.25em;color:${accent};text-transform:uppercase;margin-bottom:16px">The Artist</div>
          <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 24px;line-height:1">ABOUT ${escapeHtml(data.artistName).toUpperCase()}</h2>
          <p style="font-size:15px;line-height:1.8;color:#A0A0A0;white-space:pre-wrap">${escapeHtml(data.bio)}</p>
        </div>
      </div>
    </section>`;
}

function renderMusic(data: EPKData): string {
  if (!data.youtubeVideoId && !data.spotifyArtistId) return "";
  return `
    <section id="music" style="padding:80px 5%;background:#0D0D0D">
      <div style="max-width:1100px;margin:0 auto">
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 40px">MUSIC</h2>
        <div style="display:grid;grid-template-columns:${data.youtubeVideoId && data.spotifyArtistId ? "1fr 1fr" : "1fr"};gap:24px">
          ${data.youtubeVideoId ? `<div style="border-radius:12px;overflow:hidden;aspect-ratio:16/9"><iframe src="https://www.youtube.com/embed/${escapeHtml(data.youtubeVideoId)}" style="width:100%;height:100%;border:none" allowfullscreen loading="lazy"></iframe></div>` : ""}
          ${data.spotifyArtistId ? `<iframe src="https://open.spotify.com/embed/artist/${escapeHtml(data.spotifyArtistId)}?utm_source=generator&theme=0" style="width:100%;height:380px;border:none;border-radius:12px" loading="lazy"></iframe>` : ""}
        </div>
      </div>
    </section>`;
}

function renderReleases(data: EPKData, accent: string): string {
  if (!data.releases?.length) return "";
  return `
    <section id="discography" style="padding:80px 5%">
      <div style="max-width:1100px;margin:0 auto">
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 40px">DISCOGRAPHY</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px">
          ${data.releases
            .map(
              (r) => `
            <div style="background:#0D0D0D;border-radius:10px;overflow:hidden;border:1px solid ${accent}20">
              <div style="aspect-ratio:1;background:${r.coverUrl ? `url(${escapeHtml(r.coverUrl)}) center/cover` : "linear-gradient(135deg,#181818,#222)"};display:flex;align-items:center;justify-content:center"></div>
              <div style="padding:14px 16px">
                <div style="font-size:14px;font-weight:600;color:#EDE9E0;margin-bottom:4px">${escapeHtml(r.title)}</div>
                <div style="font-size:11px;color:#A0A0A0">${r.type} · ${r.year}${r.tracks ? ` · ${r.tracks} tracks` : ""}</div>
                ${r.certification ? `<div style="margin-top:8px;display:inline-block;background:${accent}15;color:${accent};font-size:10px;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.1em;border:1px solid ${accent}30">RIAA ${escapeHtml(r.certification)}</div>` : ""}
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function renderTimeline(data: EPKData, accent: string): string {
  if (!data.timeline?.length) return "";
  return `
    <section style="padding:80px 5%;background:#0D0D0D">
      <div style="max-width:800px;margin:0 auto">
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 40px">TIMELINE</h2>
        <div style="position:relative;padding-left:40px">
          <div style="position:absolute;left:8px;top:8px;bottom:8px;width:1px;background:${accent}30"></div>
          ${data.timeline
            .map(
              (t) => `
            <div style="position:relative;margin-bottom:40px">
              <div style="position:absolute;left:-36px;top:4px;width:12px;height:12px;border-radius:50%;background:${accent};border:2px solid ${accent}"></div>
              <span style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:0.15em;color:${accent}">${escapeHtml(t.year)}</span>
              <h3 style="font-weight:700;color:#EDE9E0;margin:4px 0 8px;font-size:16px">${escapeHtml(t.title)}</h3>
              <p style="font-size:14px;color:#A0A0A0;line-height:1.7">${escapeHtml(t.description)}</p>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function renderSocial(data: EPKData, accent: string): string {
  const entries = Object.entries(data.socialLinks || {}).filter(([, v]) => v);
  if (!entries.length) return "";
  return `
    <section style="padding:40px 5%;background:#0D0D0D">
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px">
        ${entries
          .map(
            ([k, v]) => `
          <a href="${escapeHtml(v || "")}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:8px;background:#181818;border:1px solid ${accent}20;border-radius:8px;padding:10px 18px;color:#EDE9E0;text-decoration:none;font-size:13px;font-weight:500;text-transform:capitalize">${k}</a>`
          )
          .join("")}
      </div>
    </section>`;
}

function renderCta(data: EPKData, accent: string, label: string): string {
  if (!data.bookingEmail) return "";
  return `
    <section style="padding:100px 5%;background:linear-gradient(135deg,#0D0D0D,#181818,#0D0D0D);text-align:center;border-top:1px solid ${accent}20">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,5vw,4rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 16px">${label}</h2>
      <p style="color:#A0A0A0;margin-bottom:32px;font-size:15px">${label.includes("BOOK") ? "For booking inquiries, press, and partnership opportunities." : "Let's start a conversation."}</p>
      <a href="mailto:${escapeHtml(data.bookingEmail)}" style="display:inline-block;background:${accent};color:#050505;padding:14px 40px;border-radius:6px;font-weight:700;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;font-size:12px">${escapeHtml(data.bookingEmail)}</a>
    </section>`;
}

// ── Main template HTML ─────────────────────────────────────────────────────────

function renderMainTemplate(data: EPKData): string {
  const accent = data.accentColor || "#C9A227";
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>${escapeHtml(data.artistName)} — EPK</title>
      <style>${FONTS}body{margin:0;background:#050505;color:#EDE9E0;font-family:'DM Sans',system-ui,sans-serif}*{box-sizing:border-box}</style>
    </head>
    <body>
      <nav style="position:sticky;top:0;z-index:50;background:rgba(5,5,5,0.9);backdrop-filter:blur(12px);border-bottom:1px solid ${accent}20;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:64px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:6px;background:${accent};display:flex;align-items:center;justify-content:center;font-size:18px;color:#050505;font-weight:700">♪</div>
          <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.1em;color:#EDE9E0">${escapeHtml(data.artistName).toUpperCase()}</span>
        </div>
        <div style="display:flex;gap:24px;font-size:13px;color:#A0A0A0">
          <a href="#bio" style="color:#A0A0A0;text-decoration:none">Bio</a>
          <a href="#music" style="color:#A0A0A0;text-decoration:none">Music</a>
          <a href="#discography" style="color:#A0A0A0;text-decoration:none">Discography</a>
          ${data.bookingEmail ? `<a href="mailto:${escapeHtml(data.bookingEmail)}" style="background:${accent};color:#050505;padding:6px 16px;border-radius:4px;font-weight:700;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">Book Now</a>` : ""}
        </div>
      </nav>

      <section style="position:relative;min-height:560px;display:flex;align-items:flex-end;padding:0 5% 60px;overflow:hidden;background:${data.heroImageUrl ? `url(${escapeHtml(data.heroImageUrl)}) center/cover no-repeat` : "linear-gradient(135deg,#0D0D0D,#181818,#0D0D0D)"}">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,5,0.95),rgba(5,5,5,0.4),transparent)"></div>
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:300px;height:300px;background:radial-gradient(ellipse at top,${accent}20,transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          ${data.genre ? `<span style="font-size:11px;letter-spacing:0.2em;color:${accent};text-transform:uppercase;display:block;margin-bottom:8px">${escapeHtml(data.genre)}${data.hometown ? ` · ${escapeHtml(data.hometown)}` : ""}</span>` : ""}
          <h1 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,8vw,6rem);line-height:0.9;color:#EDE9E0;letter-spacing:0.05em;margin:0">${escapeHtml(data.artistName)}</h1>
          ${data.artistTagline ? `<p style="color:#A0A0A0;margin-top:12px;max-width:500px;font-size:15px">${escapeHtml(data.artistTagline)}</p>` : ""}
        </div>
      </section>

      ${renderStats(data, accent)}
      ${renderBio(data, accent)}
      ${renderMusic(data)}
      ${renderReleases(data, accent)}
      ${renderTimeline(data, accent)}
      ${renderSocial(data, accent)}
      ${renderCta(data, accent, `BOOK ${escapeHtml(data.artistName).toUpperCase()}`)}

      <footer style="border-top:1px solid ${accent}20;padding:24px 5%;display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:'Bebas Neue',sans-serif;letter-spacing:0.1em;color:#A0A0A0;font-size:14px">${escapeHtml(data.artistName).toUpperCase()}</span>
        <span style="font-size:12px;color:#555">Built with EPK Agent</span>
      </footer>
    </body>
    </html>`;
}

// ── Booking template HTML ──────────────────────────────────────────────────────

function renderBookingTemplate(data: EPKData): string {
  const red = "#C8102E";
  const packages = data.performancePackages || [];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>${escapeHtml(data.artistName)} — Booking Kit</title>
      <style>${FONTS}body{margin:0;background:#050505;color:#EDE9E0;font-family:'DM Sans',system-ui,sans-serif}*{box-sizing:border-box}</style>
    </head>
    <body>
      <nav style="position:sticky;top:0;z-index:50;background:rgba(5,5,5,0.95);backdrop-filter:blur(12px);border-bottom:2px solid ${red};padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:64px">
        <div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:6px;background:${red};display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;font-weight:700">♪</div><span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.1em;color:#EDE9E0">${escapeHtml(data.artistName).toUpperCase()} — BOOKING</span></div>
        ${data.bookingEmail ? `<a href="mailto:${escapeHtml(data.bookingEmail)}" style="background:${red};color:#fff;padding:8px 20px;border-radius:4px;font-weight:700;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">Request Booking</a>` : ""}
      </nav>

      <section style="position:relative;min-height:440px;display:flex;align-items:flex-end;padding:0 5% 60px;background:${data.heroImageUrl ? `url(${escapeHtml(data.heroImageUrl)}) center/cover no-repeat` : "linear-gradient(135deg,#0D0D0D,#1a0305)"};overflow:hidden">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,5,0.97),rgba(5,5,5,0.5),transparent)"></div>
        <div style="position:relative;z-index:1">
          <span style="font-size:11px;color:${red};letter-spacing:0.25em;text-transform:uppercase;display:block;margin-bottom:8px">Booking Information</span>
          <h1 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,8vw,6rem);line-height:0.9;color:#EDE9E0;letter-spacing:0.05em;margin:0;text-shadow:0 0 40px ${red}40">${escapeHtml(data.artistName)}</h1>
          ${data.genre ? `<p style="color:#A0A0A0;margin-top:12px;font-size:14px">${escapeHtml(data.genre)}${data.hometown ? ` · ${escapeHtml(data.hometown)}` : ""}</p>` : ""}
        </div>
      </section>

      ${renderStats(data, red)}

      ${data.bio ? `
      <section style="padding:60px 5%;background:#0D0D0D">
        <div style="max-width:800px">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:0.25em;color:${red};text-transform:uppercase;margin-bottom:12px">About the Artist</div>
          <div style="border-left:3px solid ${red};padding-left:20px;font-size:15px;line-height:1.8;color:#A0A0A0">${escapeHtml(data.bio)}</div>
        </div>
      </section>` : ""}

      <section style="padding:60px 5%">
        <div style="max-width:1100px;margin:0 auto">
          <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,3vw,2.5rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 8px">PERFORMANCE PROFILE</h2>
          <div style="width:60px;height:3px;background:${red};margin-bottom:32px"></div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-bottom:40px">
            ${packages.map((p) => `
            <div style="background:#0D0D0D;border:1px solid ${red}30;border-radius:10px;padding:24px 20px">
              <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:${red};letter-spacing:0.1em;margin-bottom:12px">${escapeHtml(p.name).toUpperCase()}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
                <div style="background:#181818;border-radius:6px;padding:8px 10px"><div style="font-size:10px;color:#A0A0A0;text-transform:uppercase;letter-spacing:0.1em">Capacity</div><div style="font-size:13px;color:#EDE9E0;font-weight:600;margin-top:2px">${escapeHtml(p.capacity)}</div></div>
                <div style="background:#181818;border-radius:6px;padding:8px 10px"><div style="font-size:10px;color:#A0A0A0;text-transform:uppercase;letter-spacing:0.1em">Set Length</div><div style="font-size:13px;color:#EDE9E0;font-weight:600;margin-top:2px">${escapeHtml(p.setLength)}</div></div>
              </div>
              <ul style="list-style:none;padding:0;margin:0">${p.features.map((f) => `<li style="display:flex;align-items:center;gap:8px;font-size:13px;color:#A0A0A0;margin-bottom:8px"><span style="width:6px;height:6px;border-radius:50%;background:${red};flex-shrink:0"></span>${escapeHtml(f)}</li>`).join("")}</ul>
            </div>`).join("")}
          </div>
        </div>
      </section>

      ${renderReleases(data, red)}
      ${renderSocial(data, red)}
      ${renderCta(data, red, `BOOK ${escapeHtml(data.artistName).toUpperCase()}`)}

      <footer style="border-top:1px solid ${red}30;padding:20px 5%;display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:'Bebas Neue',sans-serif;letter-spacing:0.1em;color:#A0A0A0;font-size:13px">${escapeHtml(data.artistName).toUpperCase()} · BOOKING</span>
        <span style="font-size:12px;color:#555">Built with EPK Agent</span>
      </footer>
    </body>
    </html>`;
}

// ── Brand template HTML ────────────────────────────────────────────────────────

function renderBrandTemplate(data: EPKData): string {
  const gold = "#C9A227";
  const hasBrands = (data.brandPartners || []).length > 0;

  const valueProps = [
    { n: "01", title: "Authentic Reach", desc: `${data.artistName}'s fanbase is passionate, diverse, and deeply engaged.` },
    { n: "02", title: "Cultural Alignment", desc: "Known for authenticity — every brand collaboration is thoughtfully integrated." },
    { n: "03", title: "Proven Results", desc: "Past partnerships have generated measurable ROI through impressions and co-created content." },
  ];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>${escapeHtml(data.artistName)} — Brand Kit</title>
      <style>${FONTS}body{margin:0;background:#F5F0EB;color:#1A1A1A;font-family:'DM Sans',system-ui,sans-serif}*{box-sizing:border-box}</style>
    </head>
    <body>
      <header style="position:sticky;top:0;z-index:50;background:rgba(245,240,235,0.95);backdrop-filter:blur(12px);border-bottom:1px solid #E8DFD5;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:64px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:6px;background:${gold};display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;font-weight:700">♪</div>
          <div><div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:0.1em;color:#1A1A1A;line-height:1">${escapeHtml(data.artistName).toUpperCase()}</div><div style="font-size:10px;color:#666;letter-spacing:0.1em;text-transform:uppercase">Brand Partnership Kit</div></div>
        </div>
        ${data.bookingEmail ? `<a href="mailto:${escapeHtml(data.bookingEmail)}" style="border:2px solid ${gold};color:${gold};padding:7px 18px;border-radius:4px;font-weight:700;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">Inquire</a>` : ""}
      </header>

      <section style="min-height:500px;display:flex;align-items:stretch">
        <div style="flex:0 0 40%;background:${data.profileImageUrl ? `url(${escapeHtml(data.profileImageUrl)}) center/cover no-repeat` : "linear-gradient(135deg,#1A1A1A,#333)"}"></div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 5%;background:#F5F0EB">
          <span style="font-size:11px;letter-spacing:0.2em;color:${gold};text-transform:uppercase;display:block;margin-bottom:12px">${escapeHtml(data.genre || "Artist")} · ${escapeHtml(data.hometown || "Worldwide")}</span>
          <h1 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,6vw,5rem);line-height:0.9;color:#1A1A1A;letter-spacing:0.05em;margin:0 0 20px">${escapeHtml(data.artistName)}</h1>
          ${data.shortBio ? `<p style="font-size:15px;color:#666;line-height:1.8;max-width:400px">${escapeHtml(data.shortBio)}</p>` : ""}
        </div>
      </section>

      ${renderStats(data, gold)}

      ${data.bio ? `
      <section style="padding:80px 5%">
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:60px;max-width:1100px;margin:0 auto">
          <div><h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:#1A1A1A;letter-spacing:0.05em;line-height:0.9;margin:0 0 12px">THE<br/>STORY</h2><div style="width:40px;height:3px;background:${gold}"></div></div>
          <p style="font-size:15px;color:#666;line-height:1.9">${escapeHtml(data.bio)}</p>
        </div>
      </section>` : ""}

      <section style="padding:80px 5%;background:#FDFAF7">
        <div style="max-width:1100px;margin:0 auto">
          <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,3vw,2.5rem);color:#1A1A1A;letter-spacing:0.05em;margin:0 0 32px">BRAND VALUE</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px">${valueProps.map((v) => `
            <div style="background:#fff;border:1px solid #E8DFD5;border-radius:10px;padding:28px 24px">
              <div style="font-family:'Bebas Neue',sans-serif;font-size:40px;color:${gold};margin-bottom:12px;line-height:1">${v.n}</div>
              <h3 style="font-weight:700;color:#1A1A1A;margin:0 0 10px;font-size:16px">${v.title}</h3>
              <p style="font-size:14px;color:#666;line-height:1.7;margin:0">${v.desc}</p>
            </div>`).join("")}
          </div>
        </div>
      </section>

      ${hasBrands ? `
      <section style="padding:80px 5%">
        <div style="max-width:1100px;margin:0 auto">
          <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,3vw,2.5rem);color:#1A1A1A;letter-spacing:0.05em;margin:0 0 32px">PAST PARTNERSHIPS</h2>
          <div style="display:flex;flex-wrap:wrap;gap:12px">${data.brandPartners?.map((b) => `<span style="display:flex;align-items:center;gap:8px;border:1px solid #E8DFD5;background:#fff;border-radius:8px;padding:10px 18px;font-size:14px;font-weight:500;color:#1A1A1A">★ ${escapeHtml(b)}</span>`).join("")}</div>
        </div>
      </section>` : ""}

      ${renderMusic(data)}
      ${renderSocial(data, gold)}

      ${data.bookingEmail ? `
      <section style="padding:80px 5%;background:#1A1A1A;text-align:center">
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,5vw,3.5rem);color:#EDE9E0;letter-spacing:0.05em;margin:0 0 12px">LET'S COLLABORATE</h2>
        <p style="color:#aaa;font-size:14px;margin-bottom:28px">For brand partnerships, licensing, and sponsorship inquiries.</p>
        <a href="mailto:${escapeHtml(data.bookingEmail)}" style="display:inline-block;background:${gold};color:#1A1A1A;padding:14px 40px;border-radius:6px;font-weight:700;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;font-size:12px">${escapeHtml(data.bookingEmail)}</a>
      </section>` : ""}

      <footer style="border-top:1px solid #E8DFD5;padding:20px 5%;display:flex;justify-content:space-between;align-items:center;background:#F5F0EB">
        <span style="font-family:'Bebas Neue',sans-serif;letter-spacing:0.1em;color:#666;font-size:13px">${escapeHtml(data.artistName).toUpperCase()} · BRAND KIT</span>
        <span style="font-size:12px;color:#aaa">Built with EPK Agent</span>
      </footer>
    </body>
    </html>`;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function renderEPKToHtml(data: EPKData, template?: EPKTemplate): string {
  const t = template || data.template || "main";
  switch (t) {
    case "booking":
      return renderBookingTemplate(data);
    case "brand":
      return renderBrandTemplate(data);
    default:
      return renderMainTemplate(data);
  }
}

export function generateSiteHtml(data: EPKData): string {
  const html = renderEPKToHtml(data);
  return html.replace(
    "</body>",
    `  <p style="text-align:center;font-size:10px;color:#555;padding:16px;margin:0">Generated by <a href="https://artistsepks.com" style="color:${data.accentColor || "#C9A227"}">ArtistEPKs</a></p>\n</body>`
  );
}
