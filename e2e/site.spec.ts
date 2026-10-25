import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/privacy", "/terms"];

async function noOverflow(page: Page) {
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(sw, "no horizontal overflow").toBeLessThanOrEqual(iw);
}

test.describe("pages", () => {
  for (const path of pages) {
    test(`${path} renders, is accessible and makes no third party request`, async ({ page, baseURL }) => {
      const errors: string[] = [];
      const offsite: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
      page.on("request", (r) => { if (!r.url().startsWith(baseURL!)) offsite.push(r.url()); });

      const res = await page.goto(path, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await noOverflow(page);
      expect(errors, "console errors").toEqual([]);
      expect(offsite, "third party requests").toEqual([]);

      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("home", () => {
  test("headings, bands and legal links are in place", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(/Built to last/);
    for (const h of ["What we do", "How we work", "The company", "Start a project"]) {
      await expect(page.getByRole("heading", { name: h, exact: true })).toBeVisible();
    }
    await expect(page.locator("footer a[href='/privacy']")).toBeVisible();
    await expect(page.locator("footer a[href='/terms']")).toBeVisible();
    await expect(page.locator("text=0419")).toHaveCount(0);
  });

  test("security headers and no powered by", async ({ request }) => {
    const r = await request.get("/");
    const h = r.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("lights switch flips the theme and remembers it", async ({ page }) => {
    await page.goto("/");
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.getByRole("button", { name: "Lights" }).click();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before);
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before);
  });

  test("the form validates, then reports sent or not connected", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send" }).click();
    const invalid = await page.evaluate(() => document.querySelector("form")!.checkValidity());
    expect(invalid).toBe(false);
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Test Person");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("test@example.com");
    await page.getByRole("textbox", { name: "What do you need" }).fill("A short test enquiry from the e2e suite.");
    await page.getByRole("button", { name: "Send" }).click();
    const status = page.locator(".formfoot small");
    await expect(status).toHaveText(/Thank you|not connected yet|did not send/);
  });

  test("the contact route rejects junk and drops bots quietly", async ({ request }) => {
    expect((await request.post("/api/contact", { data: "nope", headers: { "Content-Type": "application/json" } })).status()).toBe(400);
    expect((await request.post("/api/contact", { data: { name: "x", email: "bad", what: "y" } })).status()).toBe(400);
    const bot = await request.post("/api/contact", { data: { name: "x", email: "a@b.co", what: "y", website: "spam" } });
    expect(bot.status()).toBe(200);
  });

  test("speed: few requests, small page", async ({ page }) => {
    let bytes = 0;
    let count = 0;
    page.on("response", async (r) => {
      count++;
      const b = await r.body().catch(() => Buffer.alloc(0));
      bytes += b.length;
    });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    expect(count, "requests").toBeLessThanOrEqual(16);
    expect(bytes, "bytes transferred (uncompressed)").toBeLessThan(600_000);
  });
});

test.describe("phone", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 1280) > 900, "phone only");
  test("menu opens and closes", async ({ page }) => {
    await page.goto("/");
    const menu = page.getByRole("button", { name: "Menu" });
    await expect(page.locator("#mainnav")).toBeHidden();
    await menu.click();
    await expect(page.locator("#mainnav")).toBeVisible();
    await page.locator("#mainnav a", { hasText: "Company" }).click();
    await expect(page.locator("#mainnav")).toBeHidden();
    await noOverflow(page);
  });
});
