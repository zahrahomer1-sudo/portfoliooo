"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis handles the scroll feel, and also owns in-page anchor jumps: a native
 * hash jump is instant and fights the smoothing, so every `#section` link is
 * intercepted here and eased instead. Doing it once at the root means links
 * anywhere on the page behave the same without each component knowing about it.
 *
 * Disabled outright under prefers-reduced-motion — hijacking the scrollbar is
 * the effect most likely to make someone ill — and there anchors fall back to
 * the browser's own behaviour.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;

      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -8, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Keep the URL honest without letting the browser jump.
      history.replaceState(null, "", `#${id}`);
    };

    document.addEventListener("click", onAnchorClick);

    if (reduced.matches) {
      return () => document.removeEventListener("click", onAnchorClick);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
