"use client";

import { useEffect, useRef, useState } from "react";
import Replay from "./Replay";
import { EVENTS } from "@/lib/words";
import { onFirstView, reducedMotion } from "@/lib/view";

/* Business systems: one service call record building event by event, from booking to paid. Rendered whole on the server;
   with script it empties and plays once in view, and again on Play again. Under reduced motion it stays whole. */
export default function Record() {
  const [n, setN] = useState(EVENTS.length);
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const touched = useRef(false);

  const play = () => {
    clearTimeout(timer.current);
    if (reducedMotion()) { setN(EVENTS.length); return; }
    let i = 1;
    setN(i);
    const add = () => {
      setN(++i);
      if (i < EVENTS.length) timer.current = window.setTimeout(add, 650);
    };
    timer.current = window.setTimeout(add, 650);
  };

  useEffect(() => {
    if (reducedMotion()) return;
    setN(0);
    const stop = onFirstView(box.current, () => { if (!touched.current) play(); });
    return () => { stop(); clearTimeout(timer.current); };
  }, []);

  return (
    <div className="demo ts" ref={box} data-r>
      <div className="jh">
        <div><b>Service call, Harbour Cafe coolroom</b><span>One record, from booking to paid</span></div>
        <button type="button" className="rb" aria-label="Play again" onClick={() => { touched.current = true; play(); }}><Replay /></button>
      </div>
      <ol className="ev">
        {EVENTS.slice(0, n).map((x) => (
          <li key={x.e}>
            <b>{x.a}{x.off && <span className="off">no signal</span>}</b>
            <span className="t mono">{x.t}</span>
            <span className="e mono">{x.e}, {x.who}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
