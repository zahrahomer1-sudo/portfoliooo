"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Pixel scroll range for an element, as [start, end], for feeding straight into
 * `useTransform(scrollY, range, …)`.
 *
 * This exists because `useScroll({ target })` returned a frozen progress for
 * some elements on this page while working for others, and a scroll effect that
 * silently never runs is worse than one that is a few lines longer. Measuring
 * offsetTop and offsetHeight leaves nothing to infer.
 *
 * `from` and `to` are fractions of the element's own height.
 */
export function useScrollRange(
  ref: RefObject<HTMLElement | null>,
  from = 0,
  to = 1,
): [number, number] {
  const [range, setRange] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      let top = 0;
      for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
      }
      const height = el.offsetHeight;
      const start = top + height * from;
      const end = top + height * to;
      setRange([start, Math.max(end, start + 1)]);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, from, to]);

  return range;
}
