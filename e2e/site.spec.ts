import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/what", "/how", "/security", "/company", "/privacy", "/terms"];

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

      /* Reduced motion: content is placed at once, so axe measures settled colours rather than a fade in progress. */
      await page.emulateMedia({ reducedMotion: "reduce" });
      const res = await page.goto(path, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await noOverflow(page);
      expect(errors, "console errors").toEqual([]);
      expect(offsite, "third party requests").toEqual([]);

      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("home", () => {
  test("the What we do timer pauses and plays again", async ({ page }, info) => {
    await page.goto("/");
    const desk = info.project.name === "desktop";
    const pz = page.locator(desk ? ".panel .pz" : ".pz.ph");
    await expect(page.locator(desk ? ".pz.ph" : ".panel .pz")).toBeHidden();
    await page.locator("#what").scrollIntoViewIfNeeded();
    const line = page.locator(".kinds li.act .ln");
    const width = () => line.evaluate((l) => parseFloat((l as HTMLElement).style.width) || 0);
    await expect.poll(width).toBeGreaterThan(5);
    await page.mouse.move(0, 0);
    await pz.click();
    await expect(pz).toHaveAttribute("aria-label", "Play");
    const act = await page.locator(".kinds li.act .h").textContent();
    await page.waitForTimeout(7500);
    await expect(page.locator(".kinds li.act .h")).toHaveText(act!);
    await expect(line).toHaveAttribute("style", /width: 100%/);
    await pz.click();
    await expect(pz).toHaveAttribute("aria-label", "Pause");
    await expect(page.locator(".kinds li.act .h"), "play starts the same line again").toHaveText(act!);
    await page.mouse.move(0, 0);
    await page.evaluate(() => document.getElementById("what")!.scrollIntoView());
    await expect.poll(width).toBeGreaterThan(5);
    await expect.poll(width).toBeLessThan(100);
  });

  test("under reduced motion the timer is still and there is no pause button", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".pz")).toHaveCount(2);
    for (const b of await page.locator(".pz").all()) await expect(b).toBeHidden();
  });

  test("headings, bands and legal links are in place", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(/Built to last/);
    for (const h of ["What we do", "How we work", "Questions people ask", "Start a project"]) {
      await expect(page.getByRole("heading", { name: h, exact: true })).toBeVisible();
    }
    await expect(page.locator("footer a[href='/privacy']")).toBeVisible();
    await expect(page.locator("footer a[href='/terms']")).toBeVisible();
    await expect(page.locator("text=0419")).toHaveCount(0);
  });

  test("trimmed: records and Perth live on their pages, bands alternate, page links and the clients line", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#data, #company")).toHaveCount(0);
    const tones = await page.locator("main > section").evaluateAll((s) => s.map((x) => (x.classList.contains("ta") ? "ta" : x.classList.contains("tb") ? "tb" : "none")));
    expect(tones).toEqual(["ta", "tb", "ta", "tb", "ta", "tb"]);
    await expect(page.locator("footer")).toHaveClass(/\bta\b/);
    await expect(page.locator("#what a.pl[href='/what']")).toHaveText("All of what we do");
    await expect(page.locator("#how a.pl[href='/how']")).toHaveText("The full process");
    await expect(page.locator("#contact .cl")).toHaveText("Most of our work comes by introduction. We do not publish client names.");
    const under = (id: string) => page.evaluate((id) => { const f = document.getElementById(id)!; scrollTo(0, f.getBoundingClientRect().top + scrollY - 10); }, id);
    await under("yours");
    await expect(page.locator("header.nav")).toHaveClass(/\btb\b/);
    await under("faq");
    await expect(page.locator("header.nav")).toHaveClass(/\bta\b/);
  });

  test("the folder, the steps and the questions work by keyboard and click", async ({ page }) => {
    await page.goto("/");
    const first = page.getByRole("tab", { name: "In your name" });
    await first.focus();
    await page.keyboard.press("ArrowLeft");
    const last = page.getByRole("tab", { name: "After handover" });
    await expect(last).toBeFocused();
    await expect(last).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#own-sheet h3")).toHaveText("After handover");

    await page.getByRole("tab", { name: "Build" }).click();
    await expect(page.locator("#step-detail h3")).toHaveText("Build");
    const next = page.getByRole("button", { name: "Next step" });
    await next.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#step-detail h3")).toHaveText("Check");
    await expect(next).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#step-detail h3")).toHaveText("Release");
    await expect(next).toBeDisabled();
    await expect(page.getByRole("button", { name: "Previous step" })).toBeFocused();

    const q = page.getByRole("button", { name: "Who owns it?" });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#a2")).toBeVisible();
  });

  test("security headers and no powered by", async ({ request }) => {
    const r = await request.get("/");
    const h = r.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  });

  test("lights switch flips the theme and remembers it", async ({ page }) => {
    await page.goto("/");
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    const lights = page.getByRole("button", { name: "Lights" });
    await expect(lights).toHaveAttribute("aria-pressed", String(before === "light"));
    await lights.click();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before);
    await expect(lights).toHaveAttribute("aria-pressed", String(before !== "light"));
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before);
  });

  test("the form validates, then reports not connected while no email keys are set", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send" }).click();
    const invalid = await page.evaluate(() => document.querySelector("form")!.checkValidity());
    expect(invalid).toBe(false);
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Test Person");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("test@example.com");
    await page.getByRole("textbox", { name: "What do you need" }).fill("A short test enquiry from the e2e suite.");
    await page.getByRole("button", { name: "Send" }).click();
    const status = page.locator(".formfoot small");
    await expect(status).toHaveText(/not connected yet/);
  });

  test("the contact route rejects junk and drops bots quietly", async ({ request }) => {
    expect((await request.post("/api/contact", { data: "nope", headers: { "Content-Type": "application/json" } })).status()).toBe(400);
    expect((await request.post("/api/contact", { data: { name: "x", email: "bad", what: "y" } })).status()).toBe(400);
    const bot = await request.post("/api/contact", { data: { name: "x", email: "a@b.co", what: "y", website: "spam" } });
    expect(bot.status()).toBe(200);
    const cross = await request.post("/api/contact", { data: { name: "x", email: "a@b.co", what: "y" }, headers: { Origin: "https://evil.example" } });
    expect(cross.status()).toBe(403);
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

test.describe("security and data", () => {
  test("the switch moves rows between the sides and the statements download", async ({ page, request }) => {
    await page.goto("/security");
    const ours = page.locator(".side.ours li");
    await expect(page.getByRole("button", { name: "During the build" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".side").first().locator("li", { hasText: "Our access" })).toContainText("multi factor");
    await page.getByRole("button", { name: "After handover" }).click();
    await expect(page.getByRole("button", { name: "After handover" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".side").first().locator("li", { hasText: "Credentials" })).toContainText("your own vault");
    await expect(ours.filter({ hasText: "Invoices" })).toHaveCount(1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id), "after handover state").toEqual([]);
    for (const f of ["/docs/data-handling.pdf", "/docs/security.pdf"]) {
      const res = await request.get(f);
      expect(res.status(), f).toBe(200);
      expect(res.headers()["content-type"]).toContain("application/pdf");
    }
  });

  test("the nav opens in the tone of the head", async ({ page }) => {
    await page.goto("/security");
    await expect(page.locator("header.nav")).toHaveClass(/\btb\b/);
    await page.goto("/");
    await expect(page.locator("header.nav")).toHaveClass(/\bta\b/);
  });

  test("the nav and footer link to the page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#mainnav a[href='/security']")).toHaveCount(1);
    await expect(page.locator("footer a[href='/security']")).toHaveCount(1);
  });
});

test.describe("how we work", () => {
  test("stages step by key and button, the switch changes the words and is remembered", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/how");
    const panel = page.locator("#stage-panel");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(10);
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
    await expect(panel).toContainText("Stage 1 of 10");
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(5).click();
    await expect(panel).toContainText("Build phase");
    await expect(panel).toContainText("Build and check repeat for each build phase.");
    await page.getByRole("button", { name: "A website" }).click();
    await expect(panel.locator("h3")).toHaveText("Build");
    await expect(panel).not.toContainText("repeat for each build phase");
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id), "website track").toEqual([]);
    await page.reload();
    await expect(page.getByRole("button", { name: "A website" })).toHaveAttribute("aria-pressed", "true");
    await tabs.nth(9).click();
    const next = page.getByRole("button", { name: "Next stage" });
    await expect(next).toHaveAttribute("aria-disabled", "true");
    await next.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toContainText("Stage 10 of 10");
    await expect(next).toBeFocused();
    await page.getByRole("button", { name: "Play" }).click();
    await expect(panel).toContainText("Stage 1 of 10");
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  });

  test("the timer holds out of view, under reduced motion, and when focus comes in", async ({ browser }) => {
    const still = await browser.newPage({ reducedMotion: "reduce" });
    await still.goto("/how");
    await still.locator("#stage-panel").scrollIntoViewIfNeeded();
    const away = await browser.newPage();
    await away.goto("/how");
    await away.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await away.waitForTimeout(7500);
    await expect(still.locator("#stage-panel"), "reduced motion").toContainText("Stage 1 of 10");
    await expect(away.locator("#stage-panel"), "out of view").toContainText("Stage 1 of 10");
    await away.locator("#stage-panel").scrollIntoViewIfNeeded();
    await away.getByRole("tab").first().focus();
    await expect(away.getByRole("button", { name: "Play" })).toBeVisible();
    await expect(away.locator(".sr[aria-live]")).toHaveText("");
    await away.keyboard.press("ArrowRight");
    await expect(away.locator(".sr[aria-live]")).toHaveText("Stage 2 of 10, First session");
    await still.close();
    await away.close();
  });

  test("the timer moves on and pause holds it", async ({ page }) => {
    await page.goto("/how");
    await page.locator("#stage-panel").scrollIntoViewIfNeeded();
    await expect(page.locator("#stage-panel")).toContainText("Stage 2 of 10", { timeout: 9000 });
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
    await page.waitForTimeout(7000);
    await expect(page.locator("#stage-panel")).toContainText("Stage 2 of 10");
  });

  test("stage labels sit level and the warm marks follow the band", async ({ browser, baseURL }, info) => {
    test.skip(info.project.name !== "desktop", "the labels show at desktop width");
    for (const [theme, rgb] of [["light", "rgb(74, 50, 32)"], ["dark", "rgb(136, 144, 104)"]]) {
      const ctx = await browser.newContext({ ...info.project.use, baseURL, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.addInitScript((t) => localStorage.setItem("lw-theme", t), theme);
      await page.goto("/how");
      await page.getByRole("button", { name: "A system" }).click();
      const tops = await page.locator(".grp .nm").evaluateAll((ns) => ns.map((n) => Math.round(n.getBoundingClientRect().top)));
      expect(new Set(tops).size, "one line of labels").toBe(1);
      const under = await page.locator(".track button[aria-pressed='true']").evaluate((b) => getComputedStyle(b, "::after").backgroundColor);
      expect(under, `switch line in ${theme}`).toBe(rgb);
      await ctx.close();
    }
  });

  test("the nav opens in the tone of the head", async ({ page }) => {
    await page.goto("/how");
    await expect(page.locator(".hclose .lede")).toHaveText("A small number of jobs at a time, so the person you meet is the person who builds yours.");
    await expect(page.locator("header.nav")).toHaveClass(/\btb\b/);
  });
});

test.describe("what we do", () => {
  test("each example works when clicked", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/what");
    await expect(page.locator("header.nav")).toHaveClass(/\btb\b/);
    for (const id of ["sys", "flow", "ai", "web"]) await expect(page.locator(`.idx a[href='#${id}']`)).toHaveCount(1);

    const events = page.locator("#sys .ev li");
    await expect(events).toHaveCount(10);
    await page.getByRole("button", { name: "Play again" }).click();
    await expect(events).toHaveCount(10);
    await expect(events.filter({ hasText: "no signal" })).toHaveCount(1);
    await expect(events.last()).toContainText("invoice.paid");

    const tot = page.locator("#flow .tot");
    await expect(tot).toContainText("33 min");
    await page.getByRole("button", { name: "Redesigned" }).click();
    await expect(tot).toContainText("5 min");
    await expect(page.locator("#flow .steps li.gone")).toHaveCount(4);
    await expect(page.locator("#flow .sr")).toHaveText("Redesigned: 4 steps taken out, 5 minutes of office time on each job.");
    const clipped = (sel: string) => page.locator(sel).evaluateAll((ls) => ls.filter((l) => l.scrollHeight > l.clientHeight + 1).length);
    await expect.poll(() => clipped("#flow .steps li:not(.gone)"), { message: "kept steps clipped" }).toBe(0);
    await page.getByRole("button", { name: "Mapped" }).click();
    await expect(tot).toContainText("33 min");
    await expect(page.locator("#flow .steps li.cut")).toHaveCount(0);
    await expect.poll(() => clipped("#flow .steps li"), { message: "mapped steps clipped" }).toBe(0);

    await page.getByRole("button", { name: "What torque for the bucket pin bolts?" }).click();
    await expect(page.locator("#ai .answer")).toContainText("No source, so no answer");
    await expect(page.locator("#ai .trace")).toContainText("answer withheld");
    await expect(page.locator("#ai .sr")).toContainText("Not in the operator manual");

    await page.getByRole("button", { name: "3G" }).click();
    await expect(page.getByRole("button", { name: "3G" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#web .figs")).toContainText("2.4 s");
    await expect(page.locator("#web .figs")).toContainText("4.8 s");

    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id), "after clicks").toEqual([]);
  });

  test("the record and the answer play once in view", async ({ page }) => {
    await page.goto("/what");
    const card = page.locator("#sys .ev");
    await expect(card.locator("li")).toHaveCount(10);
    await expect(card.locator("li.w"), "rows wait out of view").toHaveCount(10);
    const h0 = await card.evaluate((e) => e.getBoundingClientRect().height);
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator("li.w")).toHaveCount(0, { timeout: 9000 });
    expect(await card.evaluate((e) => e.getBoundingClientRect().height), "the card keeps its size while it plays").toBe(h0);
    await page.locator("#ai .answer").scrollIntoViewIfNeeded();
    await expect(page.locator("#ai .src")).toHaveClass(/\bon\b/, { timeout: 6000 });
    await expect(page.locator("#ai .answer .a")).toHaveText("SAE 15W-40. About 38 litres with a new filter.");
    await expect(page.locator("#ai .sr")).toHaveText("");
  });
});

test.describe("company", () => {
  test("facts, and the switch between take on and turn down", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/company");
    await expect(page.locator("header.nav")).toHaveClass(/\btb\b/);
    await expect(page.locator(".facts")).toContainText("Lumanworth Pty Ltd");
    await expect(page.locator(".facts")).toContainText("On registration");
    await expect(page.locator("#s-h")).toHaveText("A small number of jobs at a time.");
    const list = page.locator(".scope .list:visible li");
    const on = page.getByRole("button", { name: "We take on" });
    const off = page.getByRole("button", { name: "We turn down" });
    const status = page.locator(".scope .sr[aria-live]");
    await expect(list).toHaveCount(8);
    await expect(page.locator(".scope .list li")).toHaveCount(16);
    await expect(page.locator("#sc-h")).toHaveText("What we take on.");
    await expect(status).toHaveText("");
    await off.click();
    await expect(off).toHaveAttribute("aria-pressed", "true");
    await expect(on).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#sc-h")).toHaveText("What we turn down.");
    await expect(status).toHaveText("Showing what we turn down");
    await expect(list).toHaveCount(8);
    await expect(list.first()).toContainText("Hardware and firmware");
    await on.click();
    await expect(on).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#sc-h")).toHaveText("What we take on.");
    await expect(status).toHaveText("Showing what we take on");
    await expect(list.first()).toContainText("Web apps and admin consoles");
    await off.click();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const bad = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ") + " " + n.failureSummary).join(" | ")}`), "turn down state").toEqual([]);
  });
});

test("privacy names no providers and says where data goes", async ({ page }) => {
  await page.goto("/privacy");
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/Vercel|Resend/);
  expect(text).toContain("including in the United States");
  expect(text).toContain("Our hosting provider receives your IP address");
});

test.describe("open graph", () => {
  for (const path of pages) {
    test(`${path} carries the base fields`, async ({ page }) => {
      await page.goto(path);
      const og = (p: string) => page.locator(`meta[property="og:${p}"]`);
      const url = `https://lumanworth.com${path === "/" ? "" : path}`;
      await expect(og("type")).toHaveAttribute("content", "website");
      await expect(og("site_name")).toHaveAttribute("content", "Lumanworth");
      await expect(og("locale")).toHaveAttribute("content", "en_AU");
      await expect(og("title")).toHaveAttribute("content", await page.title());
      await expect(og("url")).toHaveAttribute("content", url);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
    });
  }
});

test.describe("nav", () => {
  test("hover underlines a link and keeps its colour", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover needs the inline nav");
    await page.goto("/what");
    const link = page.locator("#mainnav a[href='/how']");
    const before = await link.evaluate((a) => getComputedStyle(a).color);
    expect(await link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("none");
    await link.hover();
    await expect.poll(() => link.evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe("underline");
    expect(await link.evaluate((a) => getComputedStyle(a).color)).toBe(before);
  });

  test("links to the pages and marks the current one", async ({ page }) => {
    for (const [path, label] of [["/what", "What we do"], ["/how", "How we work"], ["/security", "Security and data"], ["/company", "Company"]]) {
      await page.goto(path);
      const current = page.locator("#mainnav a[aria-current='page']");
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(label);
      await expect(current).toHaveAttribute("href", path);
    }
    await page.goto("/");
    await expect(page.locator("#mainnav a[aria-current='page']")).toHaveCount(0);
    await expect(page.locator("#mainnav a[href='/#contact']")).toHaveCount(1);
  });

  test("the five links fit on one line at the narrowest desktop width", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1280) < 900, "desktop only");
    for (const width of [961, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/company");
      const r = await page.evaluate(() => {
        const nav = document.querySelector(".nav")!.getBoundingClientRect();
        const as = [...document.querySelectorAll("#mainnav a")].map((a) => a.getBoundingClientRect());
        const lights = document.querySelector(".nav .lights")!.getBoundingClientRect();
        return { oneLine: new Set(as.map((a) => Math.round(a.top))).size === 1 && as.every((a) => a.height < 30), inside: lights.right <= nav.right, clear: as.at(-1)!.right <= lights.left };
      });
      expect(r, `width ${width}`).toEqual({ oneLine: true, inside: true, clear: true });
    }
    await page.setViewportSize({ width: 960, height: 800 });
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
    await expect(page.locator("#mainnav")).toBeHidden();
  });
});

test.describe("phone", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 1280) > 900, "phone only");
  test("menu opens and closes", async ({ page }) => {
    await page.goto("/");
    const menu = page.getByRole("button", { name: "Menu" });
    await expect(page.locator("#mainnav")).toBeHidden();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    const [pill, end] = await page.evaluate(() => [document.querySelector(".nav")!.getBoundingClientRect().right, document.querySelector(".nav .menu")!.getBoundingClientRect().right]);
    expect(end, "menu button sits inside the nav").toBeLessThanOrEqual(pill);
    await menu.click();
    await expect(page.locator("#mainnav")).toBeVisible();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.locator("#mainnav a", { hasText: "Contact" }).click();
    await expect(page.locator("#mainnav")).toBeHidden();
    await noOverflow(page);
  });
});
