// Downloads the CC0 assets behind the 3D scenes from Poly Haven (https://polyhaven.com/license)
// and compresses them for the web:
//   HDRIs    → public/3d/hdri/<name>.hdr        (1k, used for lighting and glass reflections)
//   textures → public/3d/tex/<name>_<map>.webp  (1k PBR sets)
//   models   → public/3d/models/<name>.glb      (simplified, meshopt-compressed, WebP textures)
// Raw downloads are cached in .assets-raw/ (git-ignored). Run: npm run assets:3d [-- --force]
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const raw = join(root, ".assets-raw");
const pub = join(root, "public/3d");
const force = process.argv.includes("--force");

const hdris = [
  { id: "kloofendal_48d_partly_cloudy_puresky", out: "day" },
  { id: "qwantani_sunset_puresky", out: "dusk" },
];

// Plaster only contributes surface relief: its colour comes from the material, so render stays white.
const textures = [
  { id: "plaster_grey_04", out: "plaster", maps: ["nor_gl", "Rough"] },
  { id: "japanese_cedar_planks", out: "cedar", maps: ["Diffuse", "nor_gl", "Rough"] },
  { id: "long_white_tiles", out: "tiles", maps: ["Diffuse", "nor_gl", "Rough"] },
  { id: "leafy_grass", out: "grass", maps: ["Diffuse", "nor_gl", "Rough"] },
  { id: "oak_wood_planks", out: "oak", maps: ["Diffuse", "nor_gl"] },
];

// `ratio` is the share of triangles kept; the scanned tree is far denser than a website needs.
const models = [
  { id: "island_tree_02", out: "tree", ratio: 0.08 },
  { id: "shrub_02", out: "shrub", ratio: 0.3 },
  { id: "potted_plant_02", out: "potted-plant", ratio: 0.35 },
  { id: "sofa_03", out: "sofa", ratio: 0.6 },
  { id: "mid_century_lounge_chair", out: "lounge-chair", ratio: 0.5 },
  { id: "coffee_table_round_01", out: "coffee-table", ratio: 0.5 },
];

const api = async (id) => {
  const res = await fetch(`https://api.polyhaven.com/files/${id}`);
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  return res.json();
};

async function download(url, file) {
  if (existsSync(file) && !force) return;
  // Only ever fetch from Poly Haven's own file host.
  if (!url.startsWith("https://dl.polyhaven.org/")) throw new Error(`unexpected host: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

for (const dir of ["hdri", "tex", "models"]) mkdirSync(join(pub, dir), { recursive: true });

for (const h of hdris) {
  const files = await api(h.id);
  const src = join(raw, "hdri", h.id, `${h.id}_1k.hdr`);
  await download(files.hdri["1k"].hdr.url, src);
  copyFileSync(src, join(pub, "hdri", `${h.out}.hdr`));
  console.log(`✓ hdri/${h.out}.hdr`);
}

for (const t of textures) {
  const files = await api(t.id);
  for (const map of t.maps) {
    const src = join(raw, "textures", t.id, `${t.id}_${map}_1k.jpg`);
    await download(files[map]["1k"].jpg.url, src);
    const name = { Diffuse: "color", nor_gl: "normal", Rough: "rough" }[map];
    const out = join(pub, "tex", `${t.out}_${name}.webp`);
    await sharp(src).resize(1024, 1024, { fit: "cover" }).webp({ quality: map === "Diffuse" ? 80 : 85 }).toFile(out);
    console.log(`✓ tex/${t.out}_${name}.webp`);
  }
}

const cli = join(root, "node_modules/.bin/gltf-transform");
for (const m of models) {
  const files = await api(m.id);
  const gltf = files.gltf["1k"].gltf;
  const dir = join(raw, "models", m.id);
  const entry = join(dir, `${m.id}.gltf`);
  await download(gltf.url, entry);
  for (const [rel, info] of Object.entries(gltf.include)) await download(info.url, join(dir, rel));
  const out = join(pub, "models", `${m.out}.glb`);
  execFileSync(
    cli,
    ["optimize", entry, out, "--compress", "meshopt", "--texture-compress", "webp", "--texture-size", "1024", "--simplify-ratio", String(m.ratio), "--simplify-error", "0.002"],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  console.log(`✓ models/${m.out}.glb`);
}
