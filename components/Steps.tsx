"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
import { STEPS } from "@/lib/words";

/* How we work: a scrubber. Five dots at exact quarters, so the fill ends on a dot centre at every step.
   Once in view it walks through the steps by itself, and stops for good as soon as someone points at or focuses the section. */
export default function Steps() {
  const [cur, setCur] = useState(0);
  const auto = useRef(true);
  const section = useRef<HTMLElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const last = STEPS.length - 1;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !section.current) return;
    let iv = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      iv = window.setInterval(() => {
        setCur((c) => {
          if (!auto.current || c >= last) { clearInterval(iv); return c; }
          return c + 1;
        });
      }, 2200);
    }, { threshold: 0.5 });
    io.observe(section.current);
    return () => { io.disconnect(); clearInterval(iv); };
  }, [last]);

  const pick = (i: number, focus = false) => {
    auto.current = false;
    setCur(i);
    if (focus) nodes.current[i]?.focus();
  };
  /* at either end the pressed button disables, so focus moves to the other one */
  const by = (d: number) => {
    const n = cur + d;
    pick(n);
    if (n === 0) next.current?.focus();
    if (n === last) prev.current?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : -1;
    if (n >= 0 && n <= last) { e.preventDefault(); pick(n, true); }
  };
  const s = STEPS[cur];

  return (
    <section className="how band ta" id="how" aria-labelledby="how-h" ref={section} onFocus={() => { auto.current = false; }} onPointerEnter={() => { auto.current = false; }}>
      <div className="wrap">
        <h2 className="s" id="how-h" data-r>How we work</h2>
        <p className="lede" data-r>Five steps, every job, any size. Each one ends with something in your hands and a decision that is yours.</p>
        <div className="scrub">
          <div className="rail"><i style={{ width: `${(cur / last) * 100}%` }} /></div>
          <div className="nodes" role="tablist" aria-label="Steps">
            {STEPS.map((st, i) => (
              <button
                key={st.h}
                ref={(el) => { nodes.current[i] = el; }}
                type="button"
                role="tab"
                id={`step-${i}`}
                aria-selected={i === cur}
                aria-controls="step-detail"
                tabIndex={i === cur ? 0 : -1}
                className={i < cur ? "done" : undefined}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => pick(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span />
                <b>{st.h}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="detail" id="step-detail" role="tabpanel" aria-labelledby={`step-${cur}`}>
          <div>
            <div className="fade" key={cur}>
              <h3>{s.h}</h3>
              <span className="n mono">Step {cur + 1} of {STEPS.length}</span>
            </div>
            <div className="pn">
              <button ref={prev} type="button" aria-label="Previous step" disabled={cur === 0} onClick={() => by(-1)}><Arrow back /></button>
              <button ref={next} type="button" aria-label="Next step" disabled={cur === last} onClick={() => by(1)}><Arrow /></button>
            </div>
          </div>
          <div className="fade" key={`w${cur}`}>
            <p className="p">{s.p}</p>
            <dl>
              <div><dt>You get</dt><dd>{s.get}</dd></div>
              <div><dt>You decide</dt><dd>{s.you}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
