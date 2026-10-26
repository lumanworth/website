"use client";

import { useEffect, useRef, useState } from "react";
import { MAP_STEPS } from "@/lib/words";
import { reducedMotion } from "@/lib/view";

const BEFORE = MAP_STEPS.reduce((n, s) => n + s.mins, 0);
const AFTER = MAP_STEPS.reduce((n, s) => n + (s.after?.mins ?? 0), 0);
const CUT = MAP_STEPS.filter((s) => !s.after).length;

/* Workflow: the office's day on each job, mapped, then redesigned. The steps that go are struck through, then leave,
   the kept steps change, and the total counts down. */
export default function Mapped() {
  const [view, setView] = useState<"b" | "cut" | "a">("b");
  const [mins, setMins] = useState(BEFORE);
  const [said, setSaid] = useState("");
  const shown = useRef(BEFORE);
  const wait = useRef(0);
  const raf = useRef(0);

  useEffect(() => () => { clearTimeout(wait.current); cancelAnimationFrame(raf.current); }, []);

  const count = (to: number) => {
    cancelAnimationFrame(raf.current);
    const from = shown.current;
    const set = (v: number) => { shown.current = v; setMins(v); };
    if (reducedMotion()) return set(to);
    const t0 = performance.now();
    const f = (now: number) => {
      const q = Math.min(1, (now - t0) / 900);
      set(Math.round(from + (to - from) * q));
      if (q < 1) raf.current = requestAnimationFrame(f);
    };
    raf.current = requestAnimationFrame(f);
  };

  const pick = (w: "b" | "a") => {
    if ((w === "b") === (view === "b")) return;
    clearTimeout(wait.current);
    if (w === "b") {
      setView("b");
      count(BEFORE);
      setSaid(`Mapped: ${BEFORE} minutes of office time on each job.`);
      return;
    }
    setView("cut");
    wait.current = window.setTimeout(() => {
      setView("a");
      count(AFTER);
      setSaid(`Redesigned: ${CUT} steps taken out, ${AFTER} minutes of office time on each job.`);
    }, reducedMotion() ? 0 : 900);
  };

  return (
    <div className="map" data-r>
      <div>
        <div className="track" role="group" aria-label="The process">
          <button type="button" aria-pressed={view === "b"} onClick={() => pick("b")}>Mapped</button>
          <button type="button" aria-pressed={view !== "b"} onClick={() => pick("a")}>Redesigned</button>
        </div>
        <p className="tot"><span className="n">{mins}</span> min<small>{view === "a" ? "of office time on each job, redesigned" : "of office time on each job"}</small></p>
        <p className="sr" aria-live="polite">{said}</p>
      </div>
      <ol className="steps">
        {MAP_STEPS.map((s) => {
          const out = view !== "b" && !s.after;
          const now = view === "a" && s.after ? s.after : { h: s.before, mins: s.mins };
          return (
            <li key={s.before} className={out ? (view === "a" ? "cut gone" : "cut") : undefined} aria-hidden={out && view === "a" ? true : undefined}>
              <span>{now.h}</span><span className="mono">{now.mins} min</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
