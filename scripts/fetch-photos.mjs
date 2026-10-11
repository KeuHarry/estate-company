// Downloads the Unsplash photos listed in src/data/photos.ts as WebP files in
// public/images/photos. Run: npm run photos
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = fileURLToPath(new URL("..", import.meta.url));
const jiti = createJiti(import.meta.url);
const { photos } = await jiti.import(`${root}src/data/photos.ts`);
const outDir = `${root}public/images/photos`;
mkdirSync(outDir, { recursive: true });

await Promise.all(
  Object.values(photos).map(async (photo) => {
    const file = `${outDir}/${photo.name}.webp`;
    if (existsSync(file) && !process.argv.includes("--force")) return;
    const params = new URLSearchParams({ w: String(photo.width), q: "74", fm: "webp" });
    if (photo.aspect) {
      params.set("ar", photo.aspect);
      params.set("fit", "crop");
      params.set("crop", "faces,entropy");
    }
    const res = await fetch(`${photo.cdn}?${params}`);
    if (!res.ok) throw new Error(`${photo.name}: HTTP ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log(`✓ ${photo.name}.webp`);
  }),
);
