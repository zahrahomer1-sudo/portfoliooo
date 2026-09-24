"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero } from "@/content/site";

/**
 * The film that hero and about sit on top of.
 *
 * Fixed rather than scrolling, so the content travels over a held frame, then
 * crossfaded to the page's black ground across the back half of its wrapper.
 * Doing it as a fade on scroll rather than a section boundary means there is no
 * seam where one background stops and another starts.
 *
 * The fade range is measured rather than taken from `useScroll({ target })`.
 * That hook works elsewhere on this page but returned a frozen progress for
 * this particular element — a wrapper that starts at the very top of the
 * document — and a background that never fades would sit behind every section
 * on the site. Measuring offsetTop and height directly is a few more lines and
 * leaves nothing to infer.
 */
export default function CinematicBackdrop({
  hasWebm,
  hasMp4,
  hasPoster,
  children,
}: {
  hasWebm: boolean;
  hasMp4: boolean;
  hasPoster: boolean;
  children: ReactNode;
}) {
  const hasVideo = hasWebm || hasMp4;
  const reduced = useReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<[number, number]>([0, 1]);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, range, [1, 0]);
  const scale = useTransform(scrollY, range, [1, 1.1]);

  useEffect(() => {
    const measure = () => {
      const el = wrapper.current;
      if (!el) return;
      const top = el.offsetTop;
      const height = el.offsetHeight;
      const viewport = window.innerHeight;
      // Hold the frame through the hero, then release it over the back half,
      // finishing just before the wrapper leaves the viewport.
      setRange([top + height * 0.4, Math.max(top + height - viewport * 0.25, top + height * 0.5)]);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (wrapper.current) observer.observe(wrapper.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Under reduced motion the fade does not run, so a fixed layer would sit
  // behind every section below. Contain it to the wrapper instead.
  const position = reduced ? "absolute" : "fixed";

  return (
    <div ref={wrapper} className="relative">
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none ${position} inset-0 z-0 overflow-hidden bg-ink`}
        style={reduced ? undefined : { opacity }}
      >
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale }}
        >
          {hasVideo ? (
            /* No poster while real footage is playing: the only poster in the
               repo is the generated abstract one, and flashing that before a
               real frame is a worse first impression than the dark ground.
               Drop a real frame at hero.poster and re-add it here. */
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            >
              {hasWebm ? <source src={hero.video} type="video/webm" /> : null}
              {hasMp4 ? <source src={hero.videoMp4} type="video/mp4" /> : null}
            </video>
          ) : hasPoster ? (
            // No footage yet: the poster drifts so the section reads as
            // cinematic rather than as a stalled video element.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.poster}
              alt=""
              fetchPriority="high"
              className={`h-full w-full object-cover ${reduced ? "" : "animate-[drift_28s_ease-in-out_infinite_alternate]"}`}
            />
          ) : null}
        </motion.div>

        {/* Reading scrim, weighted to the lower half where the type sits. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_9_8/0.35)_0%,rgb(10_9_8/0.15)_38%,rgb(10_9_8/0.82)_100%)]" />
        <div className="grain absolute inset-0" />
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
