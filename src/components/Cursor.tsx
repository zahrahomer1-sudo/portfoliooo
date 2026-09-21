"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor for the album experience only.
 *
 * It exists where it earns its place — over the photography, where it becomes
 * the affordance telling you a frame will open — and nowhere else, so the rest
 * of the site keeps the pointer people already know how to use.
 *
 * Runs only on a fine pointer with motion allowed. Position is written straight
 * to the DOM inside a rAF loop rather than through React state: a cursor that
 * re-renders a component tree on every pointermove is a cursor that lags.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      const el = (e.target as Element | null)?.closest?.("[data-cursor]");
      const zone = (e.target as Element | null)?.closest?.("[data-cursor-zone]");
      setActive(Boolean(zone));
      setLabel(el instanceof HTMLElement ? el.dataset.cursor || null : null);
    };

    const tick = () => {
      // Easing factor, not a spring: the cursor should trail the pointer just
      // enough to feel weighted, never enough to feel broken.
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-60 hidden [@media(pointer:fine)]:block"
      style={{ opacity: active ? 1 : 0, transition: "opacity 260ms ease" }}
    >
      <div
        className={`flex items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur-md transition-[width,height] duration-400 ease-[var(--ease-out-expo)] ${
          label ? "h-20 w-20" : "h-3 w-3"
        }`}
      >
        <span
          className={`label text-white transition-opacity duration-300 ${
            label ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
