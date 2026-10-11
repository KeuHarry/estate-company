// axe-core WCAG 2.1 AA scan of every route against a running server.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3500";
const paths = ["/", "/rentals", "/rentals?city=Cape%20Town&furnished=1", "/rentals/casa-alba", "/rentals/linden-court", "/owners", "/about", "/contact", "/missing-page"];

// The 3D scenes need a real GPU to render at a usable speed; Chromium falls back to
// software rendering by itself where there is none.
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chromium" }),
  args: ["--use-angle=gl", "--enable-gpu", "--ignore-gpu-blocklist"],
});
// Reduced motion renders headlines in their final state, so contrast is measured at rest.
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const page = await context.newPage();
let total = 0;
for (const path of paths) {
  // "load" rather than "networkidle": the dev server's HMR socket keeps the network busy.
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  total += violations.length;
  console.log(`${violations.length ? "✗" : "✓"} ${path}`);
  for (const v of violations) {
    console.log(`   ${v.id} (${v.impact}): ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`     ${n.target.join(" ")} ${n.failureSummary?.split("\n")[1] ?? ""}`);
  }
}
await browser.close();
process.exit(total ? 1 : 0);
