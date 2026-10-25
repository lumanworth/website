"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Rises each [data-r] block into place the first time it is seen. Without script, or under reduced motion, everything is simply there. */
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
      { threshold: 0.15 },
    );
    document.querySelectorAll("[data-r]:not(.on)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
