"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { album, site, type AlbumImage } from "@/content/site";
import { BackgroundGradient } from "./ui/background-gradient";

/** Prefilled WhatsApp enquiry. wa.me wants digits only and a URI-encoded body. */
function printEnquiry(image: AlbumImage) {
  const text = `Hi Zahrah — I'd like to buy a print of "${image.title}" from ${album.title}. Could you send me sizes and pricing?`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Frame detail and print enquiry.
 *
 * A real dialog, not a styled div: Escape closes it, focus moves in on open and
 * returns to the frame that opened it on close, the page behind is locked and
 * hidden from assistive tech, and a click on the backdrop dismisses. Sharp
 * edges on the panel, rounded only on the buttons.
 */
export default function AlbumDialog({
  image,
  onClose,
}: {
  image: AlbumImage | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!image) return;

    restoreTo.current = document.activeElement;
    document.documentElement.style.overflow = "hidden";
    closer.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      // Keep tabbing inside the panel while it is open.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      if (restoreTo.current instanceof HTMLElement) restoreTo.current.focus();
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-8"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default border-0 bg-ink-deep/80 backdrop-blur-sm"
          />

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl"
          >
          <BackgroundGradient>
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="album-dialog-title"
            className="grid max-h-[88svh] w-full grid-cols-1 overflow-y-auto md:grid-cols-[1.2fr_1fr]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="h-full max-h-[50svh] w-full object-cover md:max-h-none"
            />

            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="label-caps text-cherry-soft">{album.title}</span>
                <button
                  ref={closer}
                  type="button"
                  onClick={onClose}
                  className="label-caps -mr-2 -mt-2 cursor-pointer border-0 bg-transparent p-2 text-paper-45 transition-colors hover:text-paper"
                >
                  Close
                </button>
              </div>

              <h3
                id="album-dialog-title"
                className="display text-[clamp(1.75rem,4vw,2.75rem)]"
              >
                {image.title}
              </h3>

              <p className="measure text-[0.9375rem] leading-relaxed text-paper-70">
                {image.description}
              </p>

              <p className="label-caps text-paper-45">{image.edition}</p>

              <div className="mt-auto flex flex-col gap-3 pt-2">
                <a
                  href={printEnquiry(image)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta bg-cherry px-6 py-4 text-center text-[0.9375rem] font-medium text-white no-underline transition-colors duration-300 hover:bg-wine"
                >
                  Buy this print on WhatsApp
                </a>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(`Print enquiry — ${image.title}`)}`}
                  className="cta border border-paper-25 px-6 py-4 text-center text-[0.9375rem] text-paper-70 no-underline transition-colors duration-300 hover:border-paper hover:text-paper"
                >
                  Or email instead
                </a>
                <p className="text-center text-[0.75rem] text-paper-25">
                  Messages go to {site.whatsappDisplay}
                </p>
              </div>
            </div>
          </div>
          </BackgroundGradient>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
