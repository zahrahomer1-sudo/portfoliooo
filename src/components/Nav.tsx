"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#studio", label: "Studio" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
        <nav
          aria-label="Primary"
          className="shell flex items-center justify-between py-5 sm:py-7"
        >
          <a href="#top" className="label no-underline text-white">
            {site.name}
          </a>

          <ul className="hidden gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="label no-underline text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-panel"
            className="label -mr-3 cursor-pointer border-0 bg-transparent px-3 py-3 text-white md:hidden"
          >
            Menu
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-panel"
            className="fixed inset-0 z-50 bg-ink text-paper md:hidden"
            initial={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? undefined : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="shell flex items-center justify-between py-5">
              <span className="label">{site.name}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="label -mr-3 cursor-pointer border-0 bg-transparent px-3 py-3 text-paper"
              >
                Close
              </button>
            </div>

            <ul className="shell mt-6 flex flex-col">
              {links.map((l, i) => (
                <li key={l.href} className="border-t border-white/12">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display block py-5 text-[2.75rem] leading-none no-underline"
                    initial={reduced ? undefined : { opacity: 0, y: 16 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.18 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
