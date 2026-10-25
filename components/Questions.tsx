"use client";

import { useState } from "react";
import { FAQ } from "@/lib/words";

/* Questions people ask: an accordion, the first one open. */
export default function Questions() {
  const [open, setOpen] = useState<boolean[]>(() => FAQ.map((_, i) => i === 0));
  const flip = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  return (
    <section className="band tb" id="faq" aria-labelledby="qa-h">
      <div className="wrap qa">
        <div>
          <h2 className="s" id="qa-h" data-r>Questions people ask</h2>
          <p className="ask" data-r>Something else? <a href="#contact">Ask us</a>.</p>
        </div>
        <ul className="faq">
          {FAQ.map((f, i) => (
            <li key={f.q} className={open[i] ? "open" : undefined}>
              <h3>
                <button type="button" id={`q${i}`} aria-expanded={open[i]} aria-controls={`a${i}`} onClick={() => flip(i)}>
                  {f.q}
                  <span className="pm" aria-hidden="true" />
                </button>
              </h3>
              <div className="ans" id={`a${i}`} role="region" aria-labelledby={`q${i}`} inert={!open[i]}>
                <div><p>{f.a}</p></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
