/* Runs fn once, the first time el is at least `at` in view. Returns the cleanup. */
export function onFirstView(el: Element | null, fn: () => void, at = 0.45) {
  if (!el) return () => {};
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    fn();
  }, { threshold: at });
  io.observe(el);
  return () => io.disconnect();
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
