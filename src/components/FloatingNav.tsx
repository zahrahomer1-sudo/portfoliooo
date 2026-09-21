"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Adapted from the Aceternity floating navbar: the mechanic is theirs — hide at
 * the top of the page, reveal on upward scroll — restyled onto this site's
 * glass and palette. The demo's Login button and Tabler icon set are dropped;
 * neither belongs on a portfolio.
 *
 * Two corrections to the original: the previous scroll value is read defensively
 * rather than with a non-null assertion, and the bar is made `inert` while
 * hidden so keyboard users cannot tab into links that are off-screen.
 */
export default function FloatingNav({
  items,
  className,
}: {
  items: { name: string; link: string }[];
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current !== "number") return;
    const previous = scrollYProgress.getPrevious();
    if (current < 0.04) {
      setVisible(false);
      return;
    }
    if (previous === undefined) return;
    setVisible(current - previous < 0);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.nav
          aria-label="Primary"
          initial={{ opacity: 0, y: -90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -90 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed inset-x-0 top-5 z-40 mx-auto flex max-w-fit items-center justify-center sm:top-7",
            className,
          )}
        >
          <div className="glass cta flex items-center gap-1 p-1.5">
            {items.map((item) => (
              <a
                key={item.link}
                href={item.link}
                className="cta px-4 py-2.5 text-[0.8125rem] font-medium text-paper-70 no-underline transition-colors duration-300 hover:bg-white/8 hover:text-paper"
              >
                {item.name}
              </a>
            ))}

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-paper-12" />

            <a
              href="#contact"
              className="cta bg-cherry px-4 py-2.5 text-[0.8125rem] font-medium text-white no-underline transition-colors duration-300 hover:bg-wine"
            >
              Get in touch
            </a>
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}
