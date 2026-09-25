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

const WORD_MS = 520;
const SESSION_KEY = "zh:intro-seen";

/** Nothing mutates this store externally; it exists to read one client-only
 *  value during render without a setState-in-effect hydration dance. */
const subscribe = () => () => {};
const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1" ? "seen" : "fresh";
  } catch {
    // Private mode. The intro replays; nothing depends on this.
    return "fresh";
  }
};
const readServer = () => "server" as const;

/**
 * Full-screen introduction. White ground, black type, one line of copy whose
 * final noun keeps being rewritten — the range is the point, so the sentence
 * refuses to settle on a single title.
 *
 * It runs once per tab. Returning mid-session should not make someone sit
 * through it again, and a reduced-motion visitor never sees it at all. The page
 * underneath is complete and indexed either way: this is an overlay, never a
 * gate on content.
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
      window.setTimeout(dismiss, WORD_MS * professions.length + 240),
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
          className="fixed inset-0 z-50 flex items-center bg-white"
          role="status"
          aria-live="polite"
          aria-label={`${site.name}. Loading.`}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-5 top-5 z-10 cursor-pointer border-0 bg-transparent p-2 text-[#0b0a0a] sm:right-8 sm:top-8"
          >
            <span className="label-caps">Skip</span>
          </button>

          <p className="shell display text-[clamp(1.75rem,6vw,4.5rem)] text-[#0b0a0a]">
            <span>Hey, I&rsquo;m {site.name} — a </span>
            <span className="relative inline-grid overflow-hidden align-bottom">
              {/* Reserve the widest word so the line never reflows mid-cycle. */}
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1"
              >
                {longest(professions)}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={professions[index]}
                  className="col-start-1 row-start-1 italic text-[#c8102e]"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
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
