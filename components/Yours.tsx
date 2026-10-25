"use client";

import { useRef, useState } from "react";
import { OWN } from "@/lib/words";

/* Yours to keep: a folder. The active tab takes the sheet's colour; arrow keys move between tabs. */
export default function Yours() {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const o = OWN[cur];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : OWN.length - 1)) % OWN.length;
    setCur(n);
    tabs.current[n]?.focus();
  };

  return (
    <section className="keep band tb" id="yours" aria-labelledby="yours-h">
      <div className="wrap">
        <div className="head">
          <h2 className="big2" id="yours-h" data-r>Yours<br />to keep.</h2>
          <p className="lede" data-r>Once a phase is paid, what we built is yours. Not a licence. Not a subscription. Yours, down to the last account.</p>
        </div>
        <div className="folder" data-r>
          <div role="tablist" aria-label="What you keep">
            {OWN.map((t, i) => (
              <button
                key={t.h}
                ref={(el) => { tabs.current[i] = el; }}
                type="button"
                role="tab"
                id={`own-${i}`}
                aria-selected={i === cur}
                aria-controls="own-sheet"
                tabIndex={i === cur ? 0 : -1}
                onClick={() => setCur(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {t.h}
              </button>
            ))}
          </div>
          <div className="sheet ts" id="own-sheet" role="tabpanel" tabIndex={0} aria-labelledby={`own-${cur}`} key={cur}>
            <div>
              <h3>{o.h}</h3>
              <p>{o.p}</p>
            </div>
            <dl className="rowsx">
              {o.rows.map(([k, v], i) => (
                <div key={k} style={{ animationDelay: `${i * 45}ms` }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
