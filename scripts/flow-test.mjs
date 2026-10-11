// End-to-end smoke test: the photo hero, mobile menu, rentals filters ↔ URL, the property 3D
// viewer controls, the viewing form and the newsletter.
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3500";
// The 3D scenes need a real GPU to render at a usable speed; Chromium falls back to
// software rendering by itself where there is none.
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chromium" }),
  args: ["--use-angle=gl", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const errors = [];
const step = (s) => console.log("✓", s);
const fail = (s) => {
  throw new Error(s);
};
const watch = (page) => {
  page.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
};

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  watch(page);

  // 1. Home: hero, canvas, search
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: /Wake up somewhere/ }).waitFor();
  const heroImg = page.locator("#hero-title").locator("xpath=ancestor::section").locator("img").first();
  await heroImg.waitFor();
  if (!(await heroImg.evaluate((img) => img.complete && img.naturalWidth > 0))) await page.waitForFunction((el) => el.complete && el.naturalWidth > 0, await heroImg.elementHandle());
  if (await page.locator("section[aria-labelledby=hero-title] canvas").count()) fail("hero should not contain a WebGL canvas");
  step("home renders the hero headline and photo, with no WebGL in the hero");
  const pick = async (scope, combobox, option) => {
    await scope.getByRole("combobox", { name: combobox }).click();
    await page.getByRole("option", { name: option }).click();
  };
  await pick(page, "City", "Lisbon");
  await page.getByRole("button", { name: "Find a home" }).click();
  await page.waitForURL(/\/rentals\?city=Lisbon/);
  step("hero search goes to /rentals?city=Lisbon");

  // 2. Rentals filters
  await page.getByText(/^2 homes in Lisbon$/).waitFor();
  step("Lisbon filter shows 2 homes");
  await page.getByRole("button", { name: "Furnished" }).click();
  await page.waitForURL(/furnished=1/);
  await pick(page, "Type of home", "Villa");
  await page.waitForURL(/type=villa/);
  await page.getByText(/^1 home in Lisbon$/).waitFor();
  step("type + furnished filters narrow to 1 home and sync to the URL");
  await pick(page, "Maximum rent", "Up to €3,000");
  await page.getByText("No homes match all of these filters").waitFor();
  step("empty state appears");
  await page.getByRole("button", { name: "Clear filters" }).last().click();
  await page.waitForURL((u) => u.pathname === "/rentals" && !u.search);
  step("clear filters resets the URL");

  // 3. Property page
  await page.getByRole("link", { name: "Casa Alba" }).first().click();
  await page.waitForURL(/\/rentals\/casa-alba/);
  await page.getByRole("heading", { level: 1, name: "Casa Alba" }).waitFor();
  step("card links to the property page");
  await page.getByRole("button", { name: /All 4 photos/ }).click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("ArrowRight");
  await page.getByText("2 / 4").waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  step("photo lightbox opens, pages with arrow keys and closes with Escape");
  const viewer = page.locator("#viewer-title");
  await viewer.scrollIntoViewIfNeeded();
  await page.getByRole("radio", { name: "Dusk" }).click();
  if ((await page.getByRole("radio", { name: "Dusk" }).getAttribute("aria-checked")) !== "true") fail("dusk not selected");
  await page.getByRole("button", { name: "Pull floors apart" }).click();
  await page.getByRole("button", { name: "Stack the floors" }).waitFor();
  step("3D viewer time-of-day and exploded toggles respond");

  const form = page.locator("aside form");
  await form.getByRole("button", { name: "Request viewing" }).click();
  await page.getByText("Enter your name.").waitFor();
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  if (focused !== "name") fail(`expected focus on name, got ${focused}`);
  step("empty viewing form shows errors and focuses the first field");
  await form.getByLabel("Name").fill("Test Tenant");
  await form.getByLabel("Email").fill("tenant@example.com");
  await form.getByRole("button", { name: "Preferred day" }).click();
  await page.getByRole("button", { name: /next month/i }).click();
  await page.locator("[data-slot=calendar] button[data-day]:not([disabled])").nth(5).click();
  if ((await form.locator("input[name=date]").inputValue()).length !== 10) fail("date picker did not set a yyyy-mm-dd value");
  step("date picker sets a day from the calendar");
  await form.getByRole("button", { name: "Request viewing" }).click();
  await page.getByRole("heading", { name: "Viewing requested" }).waitFor();
  step("viewing request succeeds with a reference");

  // 4. Newsletter
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByRole("button", { name: "Stay updated" }).click();
  await page.getByText(/Enter an email address like/).waitFor();
  await page.getByLabel("Email address").fill("news@example.com");
  await page.getByRole("button", { name: "Stay updated" }).click();
  await page.getByText(/Subscribed\./).waitFor();
  step("newsletter validates and subscribes");

  // 5. 404
  const res = await page.goto(base + "/rentals/no-such-home");
  if (res?.status() !== 404) fail(`expected 404, got ${res?.status()}`);
  await page.getByRole("heading", { name: "This page isn't here" }).waitFor();
  step("unknown listing returns the 404 page");
  await ctx.close();

  // 6. Mobile menu
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await mctx.newPage();
  watch(m);
  await m.goto(base + "/about", { waitUntil: "networkidle" });
  await m.getByRole("button", { name: "Open menu" }).click();
  await m.locator("#mobile-menu").getByRole("link", { name: "Contact" }).click();
  await m.waitForURL(/\/contact/);
  await m.locator("#mobile-menu").waitFor({ state: "detached" });
  step("mobile menu navigates and closes on route change");
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) fail(`horizontal overflow of ${overflow}px on mobile`);
  step("no horizontal overflow at 390px");
  await mctx.close();

  if (errors.length) fail(`console errors:\n${errors.join("\n")}`);
  step("no console errors");
} finally {
  await browser.close();
}
