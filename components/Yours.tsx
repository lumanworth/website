"use client";

import { useRef } from "react";

/* The lamp again, as a pointer spotlight on the cards. Fine pointers only; the cards read the same without it. */
export default function Yours() {
  const cells = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = cells.current;
    if (!el) return;
    for (const c of Array.from(el.children) as HTMLElement[]) {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
  };

  return (
    <section className="sec yours" id="yours" aria-labelledby="yours-h">
      <div className="wrap">
        <h2 id="yours-h" className="statement">What we build for you is yours once each phase is paid.</h2>
        <p className="lede">Accounts are opened in your name on day one, and we work in them as a guest you can remove. Our own tools and any open source parts come with a permanent licence to use them.</p>
        <div className="cells" ref={cells} onPointerMove={onMove}>
          <div className="cell">
            <h3>In your name</h3>
            <p>Everything the product runs on is opened in your name before the first line is written.</p>
            <ul aria-label="Opened in your name">
              <li>Code</li><li>Hosting</li><li>Database</li><li>Payments</li><li>Domain</li>
            </ul>
          </div>
          <div className="cell">
            <h3>Written down</h3>
            <p>A runbook, a changelog and a handover pack with every release, so anyone can pick it up cold.</p>
          </div>
          <div className="cell">
            <h3>Agreed in writing</h3>
            <p>Each phase has a fixed price and a target date, agreed in writing before work starts. Changes you ask for are quoted before we start.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
