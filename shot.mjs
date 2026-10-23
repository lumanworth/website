// Renders home.png (1280), home-phone.png (390) and privacy-phone.png (390). Run: node shot.mjs
import { createRequire } from "node:module";
const require = createRequire("/Users/aaronrobbins/Documents/dev/faultpilot-appstore/package.json");
const { chromium } = require("@playwright/test");
const dir = new URL("./", import.meta.url).pathname;
const b = await chromium.launch();
for (const [file, w, out] of [["index.html",1280,"home.png"],["index.html",390,"home-phone.png"],["privacy.html",390,"privacy-phone.png"],["privacy.html",1280,"privacy.png"]]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: w < 500 ? 2 : 1.25 });
  await p.goto("file://" + dir + file, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: dir + out, fullPage: true });
  console.log(out, w, await p.evaluate(() => [document.body.scrollHeight, document.documentElement.scrollWidth]));
  await p.close();
}
await b.close();
