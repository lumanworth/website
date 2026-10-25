"use client";

import { useEffect, useRef } from "react";
import Symbol from "./Symbol";

/* The lamp: the cursor lights the grid and rests on the symbol when the pointer leaves. Fine pointers only, off under reduced motion. */
export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const lit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = hero.current, l = lit.current;
    const sym = h?.querySelector<SVGSVGElement>(".big-sym");
    if (!h || !l || !sym) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const home = () => {
      const s = sym.getBoundingClientRect(), r = h.getBoundingClientRect();
      tx = s.left - r.left + s.width / 2;
      ty = s.top - r.top + s.height / 2;
    };
    const step = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      l.style.setProperty("--lx", `${x}px`);
      l.style.setProperty("--ly", `${y}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      const r = h.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      kick();
    };
    const leave = () => { home(); kick(); };
    const resize = () => { home(); kick(); };

    home();
    x = tx;
    y = ty;
    kick();
    h.addEventListener("pointermove", move, { passive: true });
    h.addEventListener("pointerleave", leave);
    addEventListener("resize", resize, { passive: true });
    return () => {
      h.removeEventListener("pointermove", move);
      h.removeEventListener("pointerleave", leave);
      removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="h1" ref={hero}>
      <div className="grid base" aria-hidden="true" />
      <div className="grid lit" aria-hidden="true" ref={lit} />
      <div className="wrap">
        <div>
          <h1 id="h1" className="in">
            Built to last.
            <br />
            Yours to keep.
          </h1>
          <p className="in">
            Lumanworth is a Perth software company. We build the systems businesses run on, from websites and apps to the platforms behind them, and we build them to be run without us.
          </p>
          <div className="cta in">
            <a className="btn" href="#contact">
              Start a project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="link" href="#how">How we work</a>
          </div>
        </div>
        <div className="hero-right">
          <Symbol className="sym big-sym" />
        </div>
      </div>
    </section>
  );
}
