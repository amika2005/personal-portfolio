"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

/** Scrolls through Lenis when it's running, so it doesn't fight a native smooth scroll. */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Scrolls to a page offset through Lenis when it's running. */
export function scrollToY(y: number, duration = 1.4) {
  if (instance) instance.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/** Freezes scrolling (e.g. under a modal); Lenis ignores overflow: hidden on its own. */
export function setScrollLocked(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 2,
    });

    instance = lenis;
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  return <>{children}</>;
}
