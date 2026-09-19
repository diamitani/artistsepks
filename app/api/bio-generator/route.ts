import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artistName, genre, location, influences, highlights, tone } = body;

    if (!artistName || !artistName.trim()) {
      return NextResponse.json({ error: "Artist name is required" }, { status: 400 });
    }

    const cleanName = artistName.trim();
    const cleanGenre = (genre || "Contemporary Music").trim();
    const cleanLoc = (location || "United States").trim();
    const cleanInf = (influences || "pioneering sonic innovators").trim();
    const cleanHigh = (highlights || "").trim();

    let p1 = "";
    let p2 = "";
    let p3 = "";
    let tagline = "";

    switch (tone) {
      case "booking":
        tagline = `High-Voltage Live Performance & Festival Powerhouse`;
        p1 = `Commanding stages with undeniable charisma and sonic precision, ${cleanName} is redefining live ${cleanGenre}. Hailing from ${cleanLoc}, the act fuses dynamic instrumentation with infectious crowd energy, establishing an electric reputation across venues and festival circuits nationwide.`;
        p2 = `Drawing inspiration from ${cleanInf}, ${cleanName}'s live set delivers an immersive auditory journey that bridges raw performance authenticity with state-of-the-art production. ${cleanHigh ? `Having built momentum through ${cleanHigh}, ` : ""}every show is crafted to transform casual listeners into lifelong believers.`;
        p3 = `With upcoming tour routing and headline appearances on the horizon, ${cleanName} continues to prove that genuine showmanship and undeniable stage presence remain the ultimate currency in modern live music.`;
        break;

      case "press":
        tagline = `Evocative ${cleanGenre} with Raw Narrative Depth`;
        p1 = `In an era of fleeting digital noise, ${cleanName} emerges with a rare, intentional voice in ${cleanGenre}. Rooted in the creative hotbed of ${cleanLoc}, the artist crafts lush, atmospheric soundscapes paired with piercing lyrical vulnerability that resonates deep within the modern cultural zeitgeist.`;
        p2 = `Channeling the timeless craftsmanship of ${cleanInf}, ${cleanName} weaves complex emotional tapestries across intricate arrangements and bold rhythmic textures. ${cleanHigh ? `Highlighted by ${cleanHigh}, ` : ""}their catalog has captured the attention of tastemaker blogs, radio curators, and discerning listeners worldwide.`;
        p3 = `As critical acclaim continues to mount, ${cleanName} stands on the precipice of a defining creative breakthrough, carving out an indelible legacy on their own unapologetic terms.`;
        break;

      case "onesheet":
        tagline = `Fast-Rising ${cleanGenre} Phenomenon`;
        p1 = `${cleanName} is a visionary ${cleanGenre} artist based in ${cleanLoc}. Fusing elements of ${cleanInf} with cutting-edge production and hypnotic vocal presence, ${cleanName} has quickly established undeniable momentum${cleanHigh ? `—driven by ${cleanHigh}` : ""}. With explosive streaming trajectory, active tour routing, and widespread tastemaker recognition, ${cleanName} represents the vanguard of modern independent music.`;
        p2 = "";
        p3 = "";
        break;

      case "major":
      default:
        tagline = `The Next Signature Voice in ${cleanGenre}`;
        p1 = `With an undeniable sonic identity and commanding commercial momentum, ${cleanName} is rapidly ascending as one of the most exciting new forces in ${cleanGenre}. Operating out of ${cleanLoc}, the artist combines world-class songwriting chops with forward-thinking production that demands attention from the first bar.`;
        p2 = `Synthesizing the foundational essence of ${cleanInf} into a fresh, contemporary framework, ${cleanName}'s sound balances mainstream playlist appeal with authentic artistry. ${cleanHigh ? `Strengthened by milestones including ${cleanHigh}, ` : ""}their organic streaming trajectory reflects a deeply engaged, rapidly expanding global audience.`;
        p3 = `Backed by a relentless work ethic and an undeniable creative vision, ${cleanName} is positioned for breakout crossover success across DSP algorithms, global festival stages, and major cultural partnerships.`;
        break;
    }

    const fullBio = [p1, p2, p3].filter(Boolean).join("\n\n");

    return NextResponse.json({
      artistName: cleanName,
      tagline,
      bio: fullBio,
      paragraphs: [p1, p2, p3].filter(Boolean),
      wordCount: fullBio.split(/\s+/).length,
    });
  } catch (err) {
    console.error("Bio generation error:", err);
    return NextResponse.json({ error: "Failed to generate bio" }, { status: 500 });
  }
}
