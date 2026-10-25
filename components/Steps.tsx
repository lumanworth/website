"use client";

import { useEffect, useRef } from "react";

const steps = [
  ["Brief", "We read what you have, talk to the people who will use it, and write back one page in plain words. Nothing is priced before you agree it."],
  ["Design", "You click through the screens and accept them before anything is built."],
  ["Build", "Small changes, each tested, on a preview you can use from the first week."],
  ["Check", "Sign in, data and payments checked against a written list before release."],
  ["Release", "Live on your approval, on your accounts, with a handover pack."],
];

/* The line under the steps fills once when the band comes into view. Without JavaScript the dots simply show. */
export default function Steps() {
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("landed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("landed");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="sec how" id="how" aria-labelledby="how-h">
      <div className="wrap">
        <h2 id="how-h">How we work</h2>
        <p className="lede">The same five steps on every job, scaled to its size.</p>
        <ol className="steps" ref={list}>
          {steps.map(([title, body], i) => (
            <li key={title}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <div className="after">
          <h3>After handover</h3>
          <p>You run it on your own accounts, and the handover pack lets your team, or any engineer you choose, carry it on. New work is quoted as a new phase. Small changes are quoted before we start them.</p>
        </div>
      </div>
    </section>
  );
}
