"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { SIDES, type SideRow } from "@/lib/words";

type When = keyof typeof SIDES;
const WHEN: [When, string][] = [["build", "During the build"], ["after", "After handover"]];

/* Yours and ours: the switch moves our access out and the credentials across. Rows that stay glide from where they were (first, last, invert, play). */
export default function Sides() {
  const [when, setWhen] = useState<When>("build");
  const box = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  const fresh = useRef<Set<string>>(new Set());

  const pick = (w: When) => {
    if (w === when || !box.current) return;
    const rects = new Map<string, DOMRect>();
    box.current.querySelectorAll<HTMLElement>("li[data-k]").forEach((li) => rects.set(li.dataset.k!, li.getBoundingClientRect()));
    before.current = rects;
    const next = SIDES[w].yours.concat(SIDES[w].ours).map((r) => r.k);
    fresh.current = new Set(next.filter((k) => !rects.has(k)));
    setWhen(w);
  };

  useLayoutEffect(() => {
    const rects = before.current;
    before.current = null;
    if (!rects || !box.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    box.current.querySelectorAll<HTMLElement>("li[data-k]").forEach((li) => {
      const b = rects.get(li.dataset.k!);
      if (!b) return;
      const a = li.getBoundingClientRect();
      const dx = b.left - a.left, dy = b.top - a.top;
      if (dx || dy) li.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: dx ? 700 : 450, easing: "cubic-bezier(.2, .7, .2, 1)" });
    });
  }, [when]);

  const row = (r: SideRow) => (
    <li key={r.k} data-k={r.k} className={[r.f === 1 ? "never" : r.f === 2 ? "gone" : "", fresh.current.has(r.k) ? "new" : ""].join(" ").trim() || undefined}>
      <b>{r.h}</b>
      <span>{r.d}</span>
    </li>
  );

  return (
    <>
      <div className="jtop">
        <h2 className="s" id="sides-h" data-r>Yours and ours.</h2>
        <div className="track" role="group" aria-label="When" data-r>
          {WHEN.map(([k, t]) => (
            <button key={k} type="button" aria-pressed={when === k} onClick={() => pick(k)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="sides" ref={box} data-r>
        <div className="side ts">
          <div className="hd"><h3>Your accounts</h3><span className="mono">In Australia</span></div>
          <ul aria-live="polite">{SIDES[when].yours.map(row)}</ul>
        </div>
        <div className="side ours ts">
          <div className="hd"><h3>Our side</h3><span className="mono">Kept small</span></div>
          <ul aria-live="polite">{SIDES[when].ours.map(row)}</ul>
        </div>
      </div>
    </>
  );
}
