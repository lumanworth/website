import type { Metadata } from "next";
import "./how.css";
import Arrow from "@/components/Arrow";
import Journey from "@/components/Journey";
import Symbol from "@/components/Symbol";

export const metadata: Metadata = {
  title: "How we work",
  description: "Five steps on every job, and the ten stages under them, from the first email to the day we delete our copies.",
  alternates: { canonical: "/how" },
  openGraph: {
    title: "How we work, Lumanworth",
    description: "Five steps on every job, any size, and the ten stages under them.",
    url: "/how",
  },
};

/* How we work, from mock v10 (accepted 26 Oct 2026). Three sections and the footer: tb, ta, tb, so the footer (ta) closes the alternation. */
export default function How() {
  return (
    <main id="main">
      <section className="phead tb" aria-labelledby="h1">
        <div className="wrap">
          <h1 className="t1" id="h1" data-r>How we work</h1>
          <p className="lede" data-r>Five steps on every job, any size. Under them, ten stages, from your first email to the day we delete our copies.</p>
        </div>
      </section>

      <section className="band ta" aria-labelledby="j-h">
        <div className="wrap">
          <Journey />
        </div>
      </section>

      <section className="hclose band tb" aria-labelledby="q-h">
        <div className="wrap">
          <div>
            <div data-r><Symbol /></div>
            <h2 className="s" id="q-h" data-r>Small on purpose.</h2>
          </div>
          <div data-r>
            <p className="lede">A small number of jobs at a time, so the person you meet is the person who builds yours.</p>
            <a className="btn" href="/#contact">Start a project<Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
