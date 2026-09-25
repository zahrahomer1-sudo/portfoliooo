"use client";

import { motion, useReducedMotion } from "motion/react";
import { stats } from "@/content/site";
import CountUp from "./primitives/CountUp";

/**
 * Two figures, set as a line of type rather than in cards, offset either side
 * of a hairline. The numbers count up the first time they are seen; everything
 * else holds still, so the movement means something.
 */
export default function Stats() {
  const reduced = useReducedMotion();

  return (
    <section
      id="stats"
      aria-label="By the numbers"
      className="shell py-24 sm:py-32"
    >
      <div className="grid grid-cols-12 items-center gap-y-10">
        <motion.p
          className="display col-span-12 text-[clamp(1.75rem,4.6vw,3.5rem)] text-paper sm:col-span-5"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <CountUp to={stats.hours} />
          <span className="text-cherry-soft">k+</span>{" "}
          <span className="text-paper-70">hours behind the lens</span>
        </motion.p>

        <div
          aria-hidden="true"
          className="col-span-12 flex justify-center sm:col-span-2"
        >
          <motion.span
            className="block h-px w-16 origin-center bg-paper-25 sm:h-24 sm:w-px"
            initial={reduced ? undefined : { scaleX: 0, scaleY: 0 }}
            whileInView={reduced ? undefined : { scaleX: 1, scaleY: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <motion.p
          className="display col-span-12 text-[clamp(1.75rem,4.6vw,3.5rem)] text-paper sm:col-span-5 sm:text-right"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <CountUp to={stats.years} />
          <span className="text-cherry-soft">+</span>{" "}
          <span className="text-paper-70">years of experience</span>
        </motion.p>
      </div>
    </section>
  );
}
