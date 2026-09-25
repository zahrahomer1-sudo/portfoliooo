"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky glass nav — always present, never hiding on scroll direction.
 *
 * It grew from the Aceternity floating navbar, but the reveal-on-scroll-up
 * mechanic is gone: a nav you have to scroll up to summon is a nav people
 * cannot find. What remains is the glass pill, which only gains its background
 * once the page has moved, so it does not sit as a bar across the opening frame.
 *
 * The active section is tracked so the current place is marked. Anchor clicks
 * are eased by SmoothScroll, not handled here.
 */
export default function FloatingNav({
  items,
  className,
}: {
  items: { name: string; link: string }[];
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = items
      .map((i) => document.getElementById(i.link.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));

    // Bias the band to the upper middle of the viewport so the section you are
    // reading is the one marked, not the one just entering from below.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 top-4 z-40 mx-auto flex max-w-fit items-center justify-center px-4 sm:top-6",
        className,
      )}
    >
      <div
        className={cn(
          "cta flex items-center gap-0.5 p-1.5 transition-opacity duration-700 ease-[var(--ease-out-expo)]",
          scrolled ? "glass-nav" : "glass-nav opacity-90",
        )}
      >
        {items.map((item) => {
          const current = active === item.link;
          return (
            <a
              key={item.link}
              href={item.link}
              aria-current={current ? "true" : undefined}
              className={cn(
                "cta relative px-3.5 py-2.5 text-[0.8125rem] no-underline transition-colors duration-300 sm:px-4",
                current ? "text-paper" : "text-paper-45 hover:text-paper",
              )}
            >
              {item.name}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-3.5 bottom-1.5 h-px origin-left bg-cherry-soft transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  current ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          );
        })}

        <a
          href="#contact"
          className="cta ml-1 bg-cherry px-4 py-2.5 text-[0.8125rem] text-white no-underline transition-colors duration-300 hover:bg-wine"
        >
          Get in touch
        </a>
      </div>
    </nav>
  );
}
