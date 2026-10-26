import type { Metadata } from "next";
import Sides from "@/components/Sides";
import { ANSWERS } from "@/lib/words";
import { OG_BASE } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Security and data",
  description: "Your records stay in your accounts, in Australia. What sits with you, what sits with us, and the two statements behind it.",
  alternates: { canonical: "/security" },
  openGraph: {
    ...OG_BASE,
    title: "Security and data, Lumanworth",
    description: "Your records stay in your accounts, in Australia. We build around them, never with them.",
    url: "/security",
  },
};

const Down = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
  </svg>
);

/* Security and data, from mock v10 (accepted 26 Oct 2026). Three sections and the footer: tb, ta, tb, so the footer (ta) closes the alternation. */
export default function Security() {
  return (
    <main id="main">
      <section className="phead tb" aria-labelledby="h1">
        <div className="wrap">
          <h1 className="t1" id="h1" data-r>Security and data</h1>
          <p className="lede" data-r>Your records stay in your accounts, in Australia. We build around them, never with them.</p>
        </div>
      </section>

      <section className="band ta" aria-labelledby="sides-h">
        <div className="wrap">
          <Sides />
        </div>
      </section>

      <section className="sqa band tb" aria-labelledby="sqa-h">
        <div className="wrap">
          <div>
            <h2 className="s" id="sqa-h" data-r>In plain words.</h2>
            <p className="ask" data-r>Something else? <a href="mailto:support@lumanworth.com">Ask us</a>.</p>
          </div>
          <div>
            <dl className="ans" data-r>
              {ANSWERS.map(([q, a]) => (
                <div key={q}><dt>{q}</dt><dd>{a}</dd></div>
              ))}
            </dl>
            <div className="dl" data-r>
              <a href="/docs/data-handling.pdf" download>How we handle your data<Down /></a>
              <a href="/docs/security.pdf" download>How we keep your product secure<Down /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
