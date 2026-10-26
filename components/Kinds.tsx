"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
import { KINDS, type Kind } from "@/lib/words";

const DUR = 7000;

function Body({ k }: { k: Kind }) {
  return (
    <>
      <p className="p">{k.p}</p>
      <dl className="ba">
        <div className="bf"><dt>Before</dt><dd>{k.before}</dd></div>
        <div className="af"><dt>After</dt><dd>{k.after}</dd></div>
      </dl>
      <a className="more" href="#contact">Talk to us about this<Arrow /></a>
    </>
  );
}

/* What we do: a list and a panel. The active line fills as a timer and moves on by itself, until someone points at one.
   Every kind sits in the same grid cell of the panel, so the panel is as tall as the longest and never jumps. On phones the words open under the line. */
export default function Kinds() {
  const [act, setAct] = useState(0);
  const [held, setHeld] = useState(false);
  const section = useRef<HTMLElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ln = lines.current[act];
    lines.current.forEach((l, i) => { if (l && i !== act) l.style.width = "0"; });
    if (!ln) return;
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) { ln.style.width = "100%"; return; }
    let t0 = performance.now(), inView = false, raf = 0;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.4 });
    if (section.current) io.observe(section.current);
    const tick = (now: number) => {
      if (inView) {
        const q = Math.min(1, (now - t0) / DUR);
        ln.style.width = `${q * 100}%`;
        if (q >= 1) { setAct((a) => (a + 1) % KINDS.length); return; }
      } else t0 = now - (parseFloat(ln.style.width) || 0) / 100 * DUR;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [act, held]);

  const hold = (i: number) => { setHeld(true); setAct(i); };

  return (
    <section className="what band tb" id="what" aria-labelledby="what-h" ref={section} onFocus={() => setHeld(true)}>
      <div className="wrap grid">
        <div>
          <h2 className="s" id="what-h" data-r>What we do</h2>
          <p className="lede" data-r>We take the parts of a business that run on spreadsheets, paper, phone calls and memory, and turn them into systems people actually use.</p>
          <a className="pl" href="/what" data-r>All of what we do<Arrow /></a>
          <ul className="kinds">
            {KINDS.map((k, i) => (
              <li key={k.h} className={i === act ? "act" : undefined}>
                <button type="button" aria-expanded={i === act} aria-controls={`kind-${i}`} onMouseEnter={() => hold(i)} onFocus={() => hold(i)} onClick={() => hold(i)}>
                  <span className="ln" ref={(el) => { lines.current[i] = el; }} />
                  <span className="h">{k.h}</span>
                  <span className="t">{k.t}</span>
                </button>
                <div className="mob" inert={i !== act}><Body k={k} /></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel ts">
          {KINDS.map((k, i) => (
            <div key={k.h} id={`kind-${i}`} className={i === act ? "in on" : "in"} inert={i !== act}>
              <p className="k">{k.h}</p>
              <Body k={k} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
