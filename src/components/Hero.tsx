"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero, site } from "@/content/site";

/**
 * The video is a composed block, not wallpaper. It holds the right-hand
 * columns and bleeds off the viewport edge; type never sits on top of it, so
 * legibility never depends on what frame happens to be playing.
 */
export default function Hero({
  hasVideo,
  hasPoster,
}: {
  hasVideo: boolean;
  hasPoster: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [videoFailed, setVideoFailed] = useState(!hasVideo);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-28 sm:pb-14"
    >
      <div className="shell grid w-full grid-cols-12 items-end gap-y-10">
        <div className="col-span-12 lg:col-span-6 xl:col-span-5">
          <h1 className="display text-[clamp(3rem,11vw,7rem)] text-ink">
            {hero.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduced ? undefined : { y: "105%" }}
                  animate={reduced ? undefined : { y: "0%" }}
                  transition={{
                    duration: 1.15,
                    delay: 0.15 + i * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {i === hero.headline.length - 1 ? (
                    <em className="not-italic text-cherry">{line}</em>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <p className="measure mt-8 text-[1.0625rem] leading-relaxed text-ink-55">
            {hero.caption}
          </p>
        </div>

        <div className="col-span-12 lg:col-span-6 xl:col-span-7">
          <motion.div
            style={reduced ? undefined : { y: mediaY }}
            className="relative aspect-[4/5] w-full overflow-hidden bg-burgundy sm:aspect-[16/10] lg:aspect-auto lg:h-[68svh] lg:-mr-[clamp(1.25rem,5vw,5rem)] lg:w-[calc(100%+clamp(1.25rem,5vw,5rem))]"
          >
            {!videoFailed ? (
              <video
                src={hero.video}
                poster={hasPoster ? hero.poster : undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`Showreel of ${site.name} at work`}
                onError={() => setVideoFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-end justify-between gap-4 p-5 text-paper/80 sm:p-7">
                <span className="label">Hero film — 16:9</span>
                <span className="label">public/media/hero.mp4</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="shell mt-12 flex items-center justify-between">
        <span className="label text-ink-30">Scroll</span>
        <span className="label text-ink-30">{site.role}</span>
      </div>
    </section>
  );
}
