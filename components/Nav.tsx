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
      <a className="lockup" href="/" aria-label="Lumanworth home">
        <Symbol />
        <span className="word">Lumanworth</span>
      </a>
      <nav aria-label="Main" id="mainnav">
        <ul onClick={() => setOpen(false)}>
          <li><a href="/#what">What we do</a></li>
          <li><a href="/#how">How we work</a></li>
          <li><a href="/#yours">Yours</a></li>
          <li><a href="/#faq">Questions</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </nav>
      <button className="sw lights" type="button" aria-pressed={light} onClick={toggleLights}>Lights</button>
      <button className="sw menu" type="button" aria-expanded={open} aria-controls="mainnav" onClick={() => setOpen((o) => !o)}>Menu</button>
    </header>
  );
}
