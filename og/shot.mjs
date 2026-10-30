// Renders og/share.html to public/og.png (1200 by 630). Run: node og/shot.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
const here = new URL(".", import.meta.url);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(new URL("share.html", here).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: fileURLToPath(new URL("../public/og.png", here)) });
await b.close();
