"use client";

import { useState } from "react";
import Arrow from "./Arrow";
import { SCOPE } from "@/lib/words";

type Side = keyof typeof SCOPE;

/* Company: what we take on, or what we turn down. The switch changes the heading and the list; the items rise in turn. */
export default function Scope() {
  const [side, setSide] = useState<Side>("on");
  const s = SCOPE[side];
  return (
    <section className="scope band tb" aria-labelledby="sc-h">
      <div className="wrap">
        <div className="top">
          <h2 className="s" id="sc-h" data-r>{s.h}</h2>
          <div className="track" role="group" aria-label="Kind of work" data-r>
            {(Object.keys(SCOPE) as Side[]).map((k) => (
              <button key={k} type="button" aria-pressed={k === side} onClick={() => setSide(k)}>{SCOPE[k].label}</button>
            ))}
          </div>
        </div>
        <ul className="list" data-r>
          {s.items.map(([b, t], n) => (
            <li key={side + b} style={{ animationDelay: `${n * 50}ms` }}><b>{b}</b><span>{t}</span></li>
          ))}
        </ul>
        <div className="close" data-r>
          <p>Not on either list? Ask. One meeting usually settles it.</p>
          <a className="btn" href="/#contact">Start a project<Arrow /></a>
        </div>
      </div>
    </section>
  );
}
