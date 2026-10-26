"use client";

import { useState } from "react";
import Arrow from "./Arrow";
import { SCOPE } from "@/lib/words";

type Side = keyof typeof SCOPE;

/* Company: what we take on, or what we turn down. Both lists are in the page for readers without script; the switch shows one,
   changes the heading, and says which in one status line. The items rise in turn. */
export default function Scope() {
  const [side, setSide] = useState<Side>("on");
  const [said, setSaid] = useState("");
  const pick = (k: Side) => { setSide(k); setSaid(`Showing ${SCOPE[k].h.slice(0, -1).toLowerCase()}`); };
  const s = SCOPE[side];
  return (
    <section className="scope band tb" aria-labelledby="sc-h">
      <div className="wrap">
        <div className="top">
          <h2 className="s" id="sc-h" data-r>{s.h}</h2>
          <div className="track" role="group" aria-label="Kind of work" data-r>
            {(Object.keys(SCOPE) as Side[]).map((k) => (
              <button key={k} type="button" aria-pressed={k === side} onClick={() => pick(k)}>{SCOPE[k].label}</button>
            ))}
          </div>
        </div>
        <p className="sr" aria-live="polite">{said}</p>
        <div data-r>
          {(Object.keys(SCOPE) as Side[]).map((k) => (
            <ul className="list" key={k} hidden={k !== side} aria-label={SCOPE[k].label}>
              {SCOPE[k].items.map(([b, t], n) => (
                <li key={b} style={{ animationDelay: `${n * 50}ms` }}><b>{b}</b><span>{t}</span></li>
              ))}
            </ul>
          ))}
        </div>
        <div className="close" data-r>
          <p>Not on either list? Ask. One meeting usually settles it.</p>
          <a className="btn" href="/#contact">Start a project<Arrow /></a>
        </div>
      </div>
    </section>
  );
}
