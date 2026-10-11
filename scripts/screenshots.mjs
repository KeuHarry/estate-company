// Usage: node scripts/screenshots.mjs <outDir> <path> [path...]
// Full-page screenshots at 1440 / 768 / 390 px, plus a horizontal-overflow check.
import { chromium } from "@playwright/test";

const [outDir, ...paths] = process.argv.slice(2);
const base = process.env.BASE_URL ?? "http://localhost:3500";
const widths = (process.env.WIDTHS ?? "1440,768,390").split(",").map(Number);

// CHROME_PATH lets you reuse an already-downloaded Chromium instead of `npx playwright install`.
// The 3D scenes need a real GPU to render at a usable speed; Chromium falls back to
// software rendering by itself where there is none.
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chromium" }),
  args: ["--use-angle=gl", "--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(Number(process.env.SETTLE ?? 4000)); // let the house rise
    if (process.env.VIEWPORT_ONLY) {
      const name = path.replace(/^\//, "").replace(/[/?=&]/g, "_") || "root";
      await page.screenshot({ path: `${outDir}/${name}-${width}-top.png` });
    }
    // Scroll through to trigger lazy content, then return to top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = path.replace(/^\//, "").replace(/[/?=&]/g, "_") || "root";
    await page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: true });
    console.log(`${name} @${width}: overflow ${overflow}px`);
  }
  await page.close();
}
await browser.close();
