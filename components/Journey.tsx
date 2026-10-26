"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
import { PHASES, STAGES, pickTrack, type Track } from "@/lib/words";

const DUR = 6500;
const phaseOf = (i: number) => {
  let a = 0;
  for (let g = 0; g < PHASES.length; g++) {
    a += PHASES[g][1];
    if (i < a) return g;
  }
  return PHASES.length - 1;
};
const Pause = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>;
const Play = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>;

/* From hello to handover: ten lines under the five steps. The current line fills as a timer and moves on while the band is in view;
   pause, a click or the arrow keys stop it. The switch changes every part that depends on the kind of job, and is remembered. */
export default function Journey() {
  const [track, setTrack] = useState<Track>("s");
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(true);
  const band = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t0 = useRef(0);
  const [live, setLive] = useState(false);
  const [told, setTold] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("lw-track");
      if (s === "w" || s === "s") setTrack(s);
    } catch {}
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  const go = useCallback((i: number) => {
    t0.current = performance.now();
    setK(i);
  }, []);

  /* The timer only runs while the band is in view and the browser tab is showing. */
  useEffect(() => {
    const el = band.current;
    if (!el) return;
    let seen = false;
    const sync = () => setLive(seen && !document.hidden);
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }, { threshold: 0.35 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  /* Fill the current line from a frame loop, written straight to the element so the page does not re-render every frame.
     The loop runs only while playing and live; coming back into view starts the current line again. */
  useEffect(() => {
    fills.current.forEach((f, j) => { if (f) f.style.width = j < k || (j === k && !playing) ? "100%" : "0"; });
    if (!playing || !live) return;
    t0.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const q = Math.min(1, (now - t0.current) / DUR);
      const f = fills.current[k];
      if (f) f.style.width = `${q * 100}%`;
      if (q >= 1) {
        if (k < STAGES.length - 1) go(k + 1);
        else setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [k, playing, live, go]);

  const hold = () => { setPlaying(false); setTold(true); };
  const choose = (t: Track) => {
    setTrack(t);
    try { localStorage.setItem("lw-track", t); } catch {}
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d || i + d < 0 || i + d >= STAGES.length) return;
    e.preventDefault();
    hold();
    go(i + d);
    tabs.current[i + d]?.focus();
  };
  const toggle = () => {
    if (!playing && k === STAGES.length - 1) go(0);
    setPlaying(!playing);
  };

  const s = STAGES[k];
  const rp = s.rp && track === "s" ? s.rp.s : "";
  let n0 = 0;

  return (
    <div className={track === "s" ? "journey sys" : "journey"} ref={band}
      onFocus={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPlaying(false); }}>
      <div className="jtop">
        <div>
          <h2 className="s" id="j-h" data-r>From hello to handover.</h2>
          <p className="lede" data-r>Each stage ends with something in your hands.</p>
        </div>
        <div className="track" role="group" aria-label="Kind of job" data-r>
          <button type="button" aria-pressed={track === "w"} onClick={() => choose("w")}>A website</button>
          <button type="button" aria-pressed={track === "s"} onClick={() => choose("s")}>A system</button>
        </div>
      </div>

      <div className="lines" role="tablist" aria-label="Stages" data-r>
        {PHASES.map(([name, n], g) => {
          const first = n0;
          n0 += n;
          return (
            <div key={name} className={phaseOf(k) === g ? "grp on" : "grp"} style={{ "--n": n } as React.CSSProperties}>
              <div className="segs">
                {Array.from({ length: n }, (_, j) => {
                  const i = first + j;
                  return (
                    <button key={i} type="button" role="tab" id={`stage-${i}`} aria-controls="stage-panel" aria-selected={i === k} tabIndex={i === k ? 0 : -1}
                      aria-label={`Stage ${i + 1}, ${pickTrack(STAGES[i].h, track)}`} ref={(el) => { tabs.current[i] = el; }}
                      className="seg"
                      onClick={() => { hold(); go(i); }} onKeyDown={(e) => onKey(e, i)}>
                      <span className="no mono">{i + 1}</span>
                      <span className="bar"><i ref={(el) => { fills.current[i] = el; }} /></span>
                    </button>
                  );
                })}
              </div>
              <span className="nm">{name}</span>
            </div>
          );
        })}
      </div>

      {/* Announce a stage only once someone has chosen one, not on every timed step: the status line stays in the page and fills only then.
          The controls sit outside the keyed parts and use aria-disabled, so focus stays on them at either end. */}
      <p className="sr" aria-live="polite">{told && !playing ? `Stage ${k + 1} of ${STAGES.length}, ${pickTrack(s.h, track)}` : ""}</p>
      <div className="stagep ts" id="stage-panel" role="tabpanel" aria-labelledby={`stage-${k}`}>
        <div>
          <div className="fade" key={`a${track}${k}`}>
            <span className="of mono">Stage {k + 1} of {STAGES.length}</span>
            <h3>{pickTrack(s.h, track)}</h3>
            <span className="st">{PHASES[phaseOf(k)][0]}</span>
          </div>
          <div className="ctl">
            <button type="button" aria-label="Previous stage" aria-disabled={k === 0} onClick={() => { if (k > 0) { hold(); go(k - 1); } }}><Arrow back /></button>
            <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>{playing ? <Pause /> : <Play />}</button>
            <button type="button" aria-label="Next stage" aria-disabled={k === STAGES.length - 1} onClick={() => { if (k < STAGES.length - 1) { hold(); go(k + 1); } }}><Arrow /></button>
          </div>
        </div>
        <div className="fade" key={`b${track}${k}`}>
          <p className="p">{pickTrack(s.p, track)}</p>
          <dl><div><dt>You get</dt><dd>{pickTrack(s.get, track)}</dd></div></dl>
          {rp && <p className="rp">{rp}</p>}
        </div>
      </div>
    </div>
  );
}
