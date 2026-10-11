import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MarkSvg, ogFonts } from "@/lib/og";

export const alt = "Arise — architect-designed homes to rent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Satori can't decode WebP, so a JPEG crop of Casa Alba sits next to this file.
  const photo = await readFile(join(process.cwd(), "src/app/og-photo.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(180deg, #a9cdea 0%, #e6f1fa 70%, #ffffff 100%)", fontFamily: "Manrope" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 64px 72px", width: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <MarkSvg size={52} />
            <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.05em", color: "#121418" }}>arise</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 68, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1, color: "#121418" }}>Wake up somewhere extraordinary.</span>
            <span style={{ marginTop: 22, fontSize: 26, fontWeight: 500, color: "#3c434c" }}>Homes to rent in Lisbon, Barcelona, Cape Town, Dubai and Paris</span>
          </div>
        </div>
        { }
        <img src={src} alt="" width={520} height={630} style={{ objectFit: "cover", borderTopLeftRadius: 48, borderBottomLeftRadius: 48, marginLeft: "auto" }} />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
