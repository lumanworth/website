"use client";

import { useEffect, useRef } from "react";
import Arrow from "./Arrow";

type Line = { hx: number; hy: number; w: number; h: number; ox: number; oy: number; vx: number; vy: number; lit: number; x: number; y: number; slot: Slot | null };
type Slot = { x: number; y: number; lit: boolean };
type Bar = { x: number; y: number; w: number; h: number; lit: boolean };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const MAX = 1200;

/* The hero: a field of the symbol's lines.
   Lines spring away from the cursor and tilt, lit runs type across the rows like code at three indents, a tap sends a ring out,
   and scrolling gathers every line into the mark, where they fuse into the solid symbol. Reduced motion draws the field once, still. */
export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = hero.current, cv = canvas.current;
    const cx = cv?.getContext("2d");
    if (!section || !cv || !cx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, L: Line[] = [], grid: Line[][] = [], rows = 0, cols = 0, bars: Bar[] = [];
    let mx = -9e3, my = -9e3, last = performance.now(), raf = 0;
    let rings: { x: number; y: number; r: number }[] = [];
    let writers: { row: number; col: number; left: number; t: number }[] = [];
    let col = { base: "", lit: "", fg: "" };

    /* #2C3829 sits between Ink and Ink step three; every other value is a ramp step */
    const colours = () => {
      const d = document.documentElement.dataset.theme !== "light";
      col = { base: d ? "#2C3829" : "#DFD9C6", lit: d ? "#889068" : "#5B6B3A", fg: d ? "#F0E8D5" : "#1E2A1C" };
    };

    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const lw = W < 700 ? 16 : 22, lh = lw / 4, sx = lw + 12, sy = lh * 3.2;
      L = []; grid = []; rows = 0; cols = 0;
      for (let y = sy; y < H; y += sy, rows++) {
        const row: Line[] = [];
        let c = 0;
        for (let x = (rows % 3 === 1 ? lw * 0.45 : 0) + 8; x < W; x += sx, c++) {
          const l: Line = { hx: x, hy: y, w: lw, h: lh, ox: 0, oy: 0, vx: 0, vy: 0, lit: 0, x, y, slot: null };
          L.push(l); row.push(l);
        }
        grid.push(row); cols = Math.max(cols, c);
      }
      /* the mark sits right of the copy on desktop, above it on phones */
      const wrapR = Math.min(W, (W + MAX) / 2);
      const s = Math.min(W < 700 ? W * 0.8 : (wrapR - W * 0.5) * 0.82, H * 0.6) / 42;
      const ox = W < 700 ? (W - 42 * s) / 2 : wrapR - 42 * s - 40, oy = W < 700 ? H * 0.14 : (H - 36 * s) / 2;
      bars = ([[1, 3, true], [13, 15, false], [1, 27, false]] as const).map(([bx, by, lit]) => ({ x: ox + bx * s, y: oy + by * s, w: 28 * s, h: 7 * s, lit }));
      const slots: Slot[] = [], gx = lw + 3, gy = lh + 3;
      for (const b of bars) {
        const nc = Math.floor((b.w - 2) / gx), nr = Math.floor((b.h - 2) / gy), px = (b.w - nc * gx + 3) / 2, py = (b.h - nr * gy + 3) / 2, R = b.h / 2;
        for (let r = 0; r < nr; r++) for (let c = 0; c < nc; c++) {
          const x = b.x + px + c * gx, y = b.y + py + r * gy, mxp = x + lw / 2, myp = y + lh / 2;
          const ex = Math.min(Math.max(mxp, b.x + R), b.x + b.w - R);
          if (Math.hypot(mxp - ex, myp - (b.y + R)) > R - 1) continue;
          slots.push({ x, y, lit: b.lit });
        }
      }
      const step = L.length / Math.max(1, slots.length);
      slots.forEach((sl, i) => { const l = L[Math.floor(i * step)]; if (l) l.slot = sl; });
    };

    const spawn = () => {
      const indent = [0, 2, 4][Math.floor(Math.random() * 3)];
      writers.push({ row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * Math.max(1, cols - 16) / 6) * 6 + indent, left: 4 + Math.floor(Math.random() * 10), t: 0 });
    };

    const pill = (x: number, y: number, w: number, h: number) => { cx.beginPath(); cx.roundRect(x, y, w, h, h / 2); cx.fill(); };

    const draw = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const r = section.getBoundingClientRect();
      const p = still ? 0 : clamp(-r.top / Math.max(1, section.offsetHeight - innerHeight));
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, f = 1 - e, fz = clamp((e - 0.86) / 0.14);
      cx.clearRect(0, 0, W, H);
      if (!still && e < 0.3) {
        if (writers.length < 3 && Math.random() < 0.04) spawn();
        for (const w of writers) {
          w.t += dt;
          if (w.t > 55) { w.t = 0; const l = grid[w.row]?.[w.col]; if (l) l.lit = 1; w.col++; w.left--; }
        }
        writers = writers.filter((w) => w.left > 0);
      }
      for (const g of rings) g.r += dt * 0.9;
      rings = rings.filter((g) => g.r < Math.max(W, H));
      for (const l of L) {
        const tx = l.slot ? l.slot.x : l.hx, ty = l.slot ? l.slot.y : l.hy, bx = l.hx + (tx - l.hx) * e, by = l.hy + (ty - l.hy) * e;
        const dx = bx + l.ox - mx, dy = by + l.oy - my, d = Math.hypot(dx, dy);
        if (d < 150 && f > 0) {
          const k = (1 - d / 150) * 1.6 * f;
          l.vx += (dx / d) * k; l.vy += (dy / d) * k;
          if (d < 85) l.lit = Math.max(l.lit, (1 - d / 85) * 1.1);
        }
        l.vx += -l.ox * 0.06; l.vy += -l.oy * 0.06; l.vx *= 0.82; l.vy *= 0.82; l.ox += l.vx; l.oy += l.vy;
        l.x = bx + l.ox; l.y = by + l.oy;
        for (const g of rings) { const dd = Math.abs(Math.hypot(l.x - g.x, l.y - g.y) - g.r); if (dd < 16) l.lit = Math.max(l.lit, 1 - dd / 16); }
        l.lit *= 0.968;
        const alpha = l.slot ? 1 - fz : f;
        if (alpha <= 0.01) continue;
        const tilt = Math.atan2(l.vy, l.vx) * Math.min(1, Math.hypot(l.vx, l.vy) / 4) * 0.6 * f;
        cx.globalAlpha = alpha;
        cx.fillStyle = l.slot && e > 0.55 ? (l.slot.lit ? col.lit : col.fg) : l.lit > 0.35 ? col.lit : col.base;
        cx.save(); cx.translate(l.x + l.w / 2, l.y + l.h / 2); cx.rotate(tilt); pill(-l.w / 2, -l.h / 2, l.w, l.h); cx.restore();
      }
      if (fz > 0) {
        cx.globalAlpha = fz;
        for (const b of bars) { cx.fillStyle = b.lit ? col.lit : col.fg; pill(b.x, b.y, b.w, b.h); }
      }
      cx.globalAlpha = 1;
    };

    const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
    /* the loop runs only while the hero is on screen */
    const seen = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    const redraw = () => { if (still) draw(performance.now()); };

    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const leave = () => { mx = my = -9e3; };
    const down = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 }); };
    const resize = () => { build(); redraw(); };
    const theme = new MutationObserver(() => { colours(); redraw(); });

    colours(); build();
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    addEventListener("resize", resize, { passive: true });
    if (still) redraw();
    else {
      addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      cv.addEventListener("pointerdown", down);
      seen.observe(section);
    }
    return () => {
      cancelAnimationFrame(raf);
      seen.disconnect();
      theme.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cv.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <section className="hero ta" id="top" aria-labelledby="h1" ref={hero}>
      <div className="stage">
        <canvas ref={canvas} aria-hidden="true" />
        <div className="hcopy">
          <h1 id="h1">
            Built to last.
            <br />
            Yours to keep.
          </h1>
          <p className="lede">A Perth software company. We build the systems businesses run on, and we build them to be run without us.</p>
          <a className="btn" href="#contact">
            Start a project
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
