"use client";

import { motion, useReducedMotion } from "motion/react";
import { about } from "@/content/site";

/**
 * Still over the film, so it reads as part of the opening rather than as the
 * first section of a separate page. The copy sits on glass because at this
 * point the frame underneath is still moving.
 */
export default function About() {
  const reduced = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="shell flex min-h-[86svh] items-center py-24 sm:py-32"
    >
      <div className="grid w-full grid-cols-12 gap-y-8">
        <motion.div
          className="col-span-12 lg:col-span-7"
          initial={reduced ? undefined : { opacity: 0, y: 26 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            id="about-heading"
            className="display text-[clamp(2rem,5.5vw,4.25rem)] text-paper"
          >
            {about.heading}
          </h2>
        </motion.div>

        <motion.div
          className="glass col-span-12 p-6 sm:p-8 lg:col-span-4 lg:col-start-9"
          initial={reduced ? undefined : { opacity: 0, y: 26 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {about.body.map((p) => (
            <p
              key={p}
              className="measure mb-4 text-[1rem] leading-relaxed text-paper-70 last:mb-0"
            >
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
