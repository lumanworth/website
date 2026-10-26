"use client";

import { useEffect, useRef, useState } from "react";
import Replay from "./Replay";
import { NETWORKS, PAGE_KB } from "@/lib/words";
import { onFirstView, reducedMotion } from "@/lib/view";

type Net = keyof typeof NETWORKS;

/* Websites and apps: a sample page loading at the chosen speed. The words land first, the photo after.
   Plays once in view unless someone has already chosen, on a switch of network, and on Load again. Under reduced motion the page is simply there. */
export default function Signal() {
  const [net, setNet] = useState<Net>("4g");
  const [phase, setPhase] = useState<"" | "wait" | "txton">("");
  const box = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const touched = useRef(false);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const load = (n: Net) => {
    clear();
    setNet(n);
    const b = bar.current;
    if (reducedMotion() || !b) { setPhase(""); return; }
    const { words, done } = NETWORKS[n];
    setPhase("wait");
    b.style.transition = "none";
    b.style.width = "0";
    b.style.opacity = "1";
    void b.offsetWidth;
    b.style.transition = `width ${done}s linear`;
    b.style.width = "100%";
    timers.current.push(
      window.setTimeout(() => setPhase("txton"), words * 1000),
      window.setTimeout(() => { setPhase(""); b.style.transition = "opacity .4s"; b.style.opacity = "0"; }, done * 1000),
    );
  };

  useEffect(() => {
    const stop = onFirstView(box.current, () => { if (!touched.current) load("4g"); }, 0.5);
    return () => { stop(); clear(); };
  }, []);

  const n = NETWORKS[net];
  return (
    <div className="browser" ref={box} data-r>
      <div className="bar">
        <div className="track" role="group" aria-label="Network">
          {(Object.keys(NETWORKS) as Net[]).map((k) => (
            <button key={k} type="button" aria-pressed={k === net} onClick={() => { touched.current = true; load(k); }}>{NETWORKS[k].name}</button>
          ))}
        </div>
        <button type="button" className="rb" aria-label="Load again" onClick={() => { touched.current = true; load(net); }}><Replay /></button>
      </div>
      <div className={phase ? `site ${phase}` : "site"}>
        <span className="load" ref={bar} />
        <div className="sn"><b>Northside Physio</b><span>Book, Find us</span></div>
        <div className="txt">
          <div className="h">Same week appointments.</div>
          <p>Book online, or call the clinic on weekdays.</p>
          <span className="bk">Book a time</span>
        </div>
        <div className="ph" role="img" aria-label="Clinic photo" />
      </div>
      <div className="figs" aria-live="polite">
        <div><b>{n.words} s</b>words readable</div>
        <div><b>{n.done} s</b>page complete</div>
        <div><b>{PAGE_KB} KB</b>page weight</div>
      </div>
    </div>
  );
}
