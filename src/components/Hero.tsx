"use client";

import { motion, useReducedMotion } from "motion/react";
import { hero, site } from "@/content/site";

/**
 * The headline is glass: the film shows through the letterforms, held together
 * by a brighter stroke at their edges. See `.glass-type` in globals.css.
 *
 * It previously used `mix-blend-mode: difference`, which inverted the type
 * against the footage but was never actually see through. Nothing is blended
 * now, so the old constraint about ancestor transforms no longer applies.
 */
export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between pb-8 pt-28 sm:pb-12"
    >
      <div className="shell flex justify-end pt-6 sm:pt-12">
        <motion.p
          className="glass measure max-w-[34ch] p-5 text-[0.9375rem] leading-relaxed text-paper-70 sm:p-6 sm:text-base"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {hero.intro}
        </motion.p>
      </div>

      <div className="shell">
        <h1 className="display glass-type text-[clamp(2.75rem,10.5vw,9rem)]">
          {hero.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={reduced ? undefined : { y: "105%" }}
                animate={reduced ? undefined : { y: "0%" }}
                transition={{
                  duration: 1.25,
                  delay: 0.2 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-y-4 border-t border-paper-12 pt-5">
          <span className="label text-paper-45">{site.role}</span>
          <a
            href="#album"
            className="label group flex items-center gap-2 text-paper-70 no-underline"
          >
            {hero.scrollCue}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-1"
            >
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
