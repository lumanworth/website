"use client";

import { useEffect, useState } from "react";
import Symbol from "./Symbol";

type ThemedDocument = Document & { startViewTransition?: (update: () => void) => unknown };

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  /* Lights: the switch stores a choice; the label stays fixed and aria-pressed carries the state. */
  const toggleLights = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const r = e.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vx", `${r.left + r.width / 2}px`);
    root.style.setProperty("--vy", `${r.top + r.height / 2}px`);
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("lw-theme", next);
      } catch {}
      setLight(next === "light");
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as ThemedDocument;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
    else apply();
  };

  return (
    <header className={open ? "nav open" : "nav"}>
      <div className="wrap">
        <a className="lockup" href="/" aria-label="Lumanworth home">
          <Symbol />
          <span className="word">Lumanworth</span>
        </a>
        <nav aria-label="Main" id="mainnav">
          <ul onClick={() => setOpen(false)}>
            <li><a href="/#build">What we do</a></li>
            <li><a href="/#how">How we work</a></li>
            <li><a href="/#company">Company</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>
        <button className="lights" type="button" aria-pressed={light} onClick={toggleLights}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="bulb" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
          </svg>
          <span>Lights</span>
        </button>
        <button className="menu" type="button" aria-expanded={open} aria-controls="mainnav" onClick={() => setOpen((o) => !o)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span>Menu</span>
        </button>
      </div>
    </header>
  );
}
