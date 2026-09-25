"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const prefersStill = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stillOnServer = () => false;

/**
 * Counts to a number when it first comes into view.
 *
 * The element reserves its final width from the outset so the line beside it
 * does not shuffle sideways while the digits climb, and a reduced-motion
 * visitor is simply given the finished number.
 */
export default function CountUp({
  to,
  duration = 1600,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useSyncExternalStore(subscribe, prefersStill, stillOnServer);
  const ref = useRef<HTMLSpanElement>(null);
  const [counted, setCounted] = useState(0);
  const [finished, setFinished] = useState(false);

  // Read during render rather than written from an effect: a reduced-motion
  // visitor is simply handed the final number, no animation to skip.
  const value = reduced ? to : counted;
  const done = reduced || finished;

  useEffect(() => {
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Ease out: the count should arrive, not stop dead.
          setCounted(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
          else setFinished(true);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration, reduced]);

  return (
    <span ref={ref} className={`nums relative inline-grid ${className}`}>
      {/* Reserves the final width so nothing reflows mid-count. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {to}
      </span>
      <span className="col-start-1 row-start-1" aria-hidden={!done}>
        {value}
      </span>
    </span>
  );
}
