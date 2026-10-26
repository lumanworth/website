"use client";

import { useEffect, useRef, useState } from "react";
import { ASKS } from "@/lib/words";
import { onFirstView, reducedMotion } from "@/lib/view";

/* AI in the workflow: the trace runs, then the answer, then its source. The third question has no source, so it is withheld.
   Rendered answered on the server; with script the first question plays once in view. A chosen answer is announced once it is complete. */
export default function Ask() {
  const [q, setQ] = useState(0);
  const [lines, setLines] = useState(ASKS[0].trace.length);
  const [chars, setChars] = useState(ASKS[0].a.length);
  const [said, setSaid] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const touched = useRef(false);

  const clear = () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.current = []; };

  const ask = (i: number, chosen: boolean) => {
    if (chosen) touched.current = true;
    else if (touched.current) return;
    clear();
    const x = ASKS[i];
    const done = () => { setChars(x.a.length); if (chosen) setSaid(`${x.a} ${x.src}`); };
    setQ(i);
    setSaid("");
    if (reducedMotion()) { setLines(x.trace.length); done(); return; }
    setLines(0);
    setChars(0);
    x.trace.forEach((_, k) => timers.current.push(window.setTimeout(() => setLines(k + 1), k * 380)));
    timers.current.push(window.setTimeout(() => {
      let n = 0;
      const iv = window.setInterval(() => {
        if (++n >= x.a.length) { clearInterval(iv); done(); } else setChars(n);
      }, 20);
      timers.current.push(iv);
    }, (x.trace.length - 1) * 380 + 250));
  };

  useEffect(() => {
    if (reducedMotion()) return;
    setLines(0);
    setChars(0);
    const stop = onFirstView(box.current, () => ask(0, false), 0.5);
    return () => { stop(); clear(); };
  }, []);

  const x = ASKS[q];
  const complete = chars >= x.a.length;
  return (
    <div className="demo ts" ref={box} data-r>
      <ul className="qs">
        {ASKS.map((y, i) => (
          <li key={y.q}><button type="button" aria-pressed={i === q} onClick={() => ask(i, true)}>{y.q}</button></li>
        ))}
      </ul>
      <ol className="trace mono" aria-hidden="true">
        {x.trace.slice(0, lines).map((l) => <li key={q + l}>{l}</li>)}
      </ol>
      <div className="answer">
        <p className="a">{x.a.slice(0, chars)}{!complete && lines === x.trace.length && <span className="cur" aria-hidden="true" />}</p>
        <p className={complete ? "src mono on" : "src mono"}>{x.src}</p>
      </div>
      <p className="sr" aria-live="polite">{said}</p>
    </div>
  );
}
