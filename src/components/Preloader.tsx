"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { professions, site } from "@/content/site";

/** Slower than it was. Each title needs long enough to actually be read. */
const WORD_MS = 900;
const SESSION_KEY = "zh:intro-seen";

const subscribe = () => () => {};
const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1" ? "seen" : "fresh";
  } catch {
    return "fresh";
  }
};
const readServer = () => "server" as const;

/**
 * Full screen introduction on a burgundy ground, set in the middle of the
 * screen, with the final noun of the sentence rewriting itself. The range is
 * the point, so the line refuses to settle on one title.
 *
 * Runs once per tab, is skipped entirely under reduced motion, and overlays a
 * page that is already complete and indexed rather than gating it.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const phase = useSyncExternalStore(subscribe, readSession, readServer);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const timers = useRef<number[]>([]);

  const active = phase === "fresh" && !reduced && !dismissed;

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* Nothing to persist to; the overlay still closes. */
    }
  }, []);

  useEffect(() => {
    if (!active) {
      document.documentElement.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";

    professions.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(window.setTimeout(() => setIndex(i), WORD_MS * i));
    });
    timers.current.push(
      window.setTimeout(dismiss, WORD_MS * professions.length + 320),
    );

    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", escape);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      window.removeEventListener("keydown", escape);
      document.documentElement.style.overflow = "";
    };
  }, [active, dismiss]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed inset-0 z-90 flex items-center justify-center bg-burgundy px-6"
          role="status"
          aria-live="polite"
          aria-label={`${site.name}. Loading.`}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="label absolute right-5 top-5 cursor-pointer border-0 bg-transparent p-2 text-paper-45 transition-colors hover:text-paper sm:right-8 sm:top-8"
          >
            Skip
          </button>

          <p className="display text-center text-[clamp(1.75rem,6vw,4.5rem)] text-paper">
            <span>Hey, I&rsquo;m {site.name}, a </span>
            <span className="relative inline-grid overflow-hidden text-left align-bottom">
              {/* Reserve the widest word so the line never reflows mid cycle. */}
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1"
              >
                {longest(professions)}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={professions[index]}
                  className="col-start-1 row-start-1 italic text-cherry-soft"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  {professions[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function longest(words: readonly string[]) {
  return words.reduce((a, b) => (b.length > a.length ? b : a), "");
}
