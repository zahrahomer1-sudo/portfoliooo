"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { album, type AlbumImage } from "@/content/site";
import AlbumDialog from "./AlbumDialog";
import { useScrollRange } from "./primitives/useScrollRange";

const column: Record<AlbumImage["column"], string> = {
  left: "col-span-12 md:col-span-7 md:col-start-1",
  centre: "col-span-12 md:col-span-6 md:col-start-4",
  right: "col-span-12 md:col-span-6 md:col-start-7",
};

/**
 * The album.
 *
 * A film holds the full height of the section behind everything, and the title
 * sits pinned at its centre — both stay put while the frames travel past, so
 * the whole thing reads as one continuous move rather than a header followed by
 * a grid. The film fades as the first frames arrive, which is the transition
 * from the opening shot into the album proper; the title only releases once the
 * last frame has gone by.
 *
 * The title is set in blend mode so it stays legible whether a bright frame or
 * bare ground is passing underneath it.
 */
export default function Album({
  film: available,
}: {
  /** Which album film formats exist on disk, resolved by the server. */
  film: { webm: boolean; mp4: boolean };
}) {
  const [open, setOpen] = useState<AlbumImage | null>(null);
  const [hasFilm, setHasFilm] = useState(available.webm || available.mp4);
  const reduced = useReducedMotion();

  const section = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();

  // Film holds through the opening viewport, then clears as the frames arrive.
  const filmRange = useScrollRange(section, 0.06, 0.34);
  const filmOpacity = useTransform(scrollY, filmRange, [1, 0]);
  const filmScale = useTransform(scrollY, filmRange, [1, 1.14]);

  // Title drifts slowly across the whole section, then leaves at the very end.
  const titleRange = useScrollRange(section, 0, 1);
  const titleY = useTransform(scrollY, titleRange, [70, -70]);
  const titleFade = useTransform(scrollY, titleRange, [1, 1, 0]);
  const titleScale = useTransform(scrollY, titleRange, [1.04, 0.94]);

  /**
   * Warm the album film once the visitor is roughly a screen away.
   *
   * Fetching it at page load would put several megabytes in front of the first
   * paint for a section most people have not reached yet, which is the opposite
   * of preloading well. Starting a screen early means it is ready by the time
   * the section arrives without ever competing with the hero.
   */
  useEffect(() => {
    const el = section.current;
    const video = film.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        video.preload = "auto";
        video.load();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="album"
      ref={section}
      aria-labelledby="album-heading"
      data-cursor-zone
      className="cursor-none-fine relative"
    >
      {/* Film. Sticky and pulled back out of flow so it adds no height. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 -mb-[100svh] h-svh overflow-hidden"
        style={reduced ? undefined : { opacity: filmOpacity }}
      >
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale: filmScale }}
        >
          {hasFilm ? (
            <video
              ref={film}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setHasFilm(false)}
              className="h-full w-full object-cover"
            >
              {available.webm ? (
                <source src={album.video} type="video/webm" />
              ) : null}
              {available.mp4 ? (
                <source src={album.videoMp4} type="video/mp4" />
              ) : null}
            </video>
          ) : (
            // No album footage yet: hold the first frame instead of an empty box.
            <Image
              src={album.images[0].src}
              alt=""
              fill
              sizes="100vw"
              className="scale-110 object-cover opacity-60 blur-sm"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-ink/45" />
        <div className="grain absolute inset-0" />
      </motion.div>

      {/* Pinned title. Above the frames, blended so it survives both. */}
      <motion.div
        className="pointer-events-none sticky top-0 z-20 -mb-[100svh] flex h-svh flex-col items-center justify-center px-6 text-center mix-blend-difference"
        style={reduced ? undefined : { opacity: titleFade }}
      >
        <motion.h2
          id="album-heading"
          className="display display-tight max-w-[16ch] text-[clamp(2.5rem,9vw,7rem)] text-white"
          style={reduced ? undefined : { y: titleY, scale: titleScale }}
        >
          {album.title}
        </motion.h2>
        <motion.p
          className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/75"
          style={reduced ? undefined : { y: titleY }}
        >
          {album.standfirst}
        </motion.p>
      </motion.div>

      {/* Opening viewport: film and title alone. */}
      <div className="h-svh" aria-hidden="true" />

      <div className="shell relative z-10 pb-28 pt-[20svh] sm:pb-40">
        <div className="grid grid-cols-12 gap-x-6 gap-y-24 sm:gap-y-40">
          {album.images.map((image, i) => (
            <div key={image.id} className={column[image.column]}>
              <Frame image={image} index={i} onOpen={setOpen} />
            </div>
          ))}
        </div>

        <div className="mt-24 flex justify-center sm:mt-32">
          <a
            href={album.viewMore.href}
            className="cta glass px-8 py-4 text-[0.9375rem] text-paper no-underline transition-colors duration-500 hover:bg-white/12"
          >
            {album.viewMore.label}
          </a>
        </div>
      </div>

      <AlbumDialog image={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function Frame({
  image,
  index,
  onOpen,
}: {
  image: AlbumImage;
  index: number;
  onOpen: (image: AlbumImage) => void;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const drift = (image.depth - 1) * 150;
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  function track(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduced || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    // Shallow on purpose: a photograph rotated in perspective is a distorted
    // photograph, and the photograph is the thing being sold.
    setTilt({
      x: -((e.clientY - top - height / 2) / height) * 3,
      y: ((e.clientX - left - width / 2) / width) * 3,
    });
  }

  return (
    <motion.div style={reduced ? undefined : { y }}>
      <button
        ref={ref}
        type="button"
        data-cursor="View"
        onMouseMove={track}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        onClick={() => onOpen(image)}
        aria-label={`${image.title}, open frame and print details`}
        className="group block w-full cursor-none border-0 bg-transparent p-0 text-left"
        style={{ perspective: "1200px" }}
      >
        <motion.figure
          className="relative m-0 overflow-hidden bg-ink-raised"
          style={{
            aspectRatio: image.ratio,
            transformStyle: "preserve-3d",
            rotateX: tilt.x,
            rotateY: tilt.y,
          }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        >
          {/* next/image, not a bare img: these are multi-megabyte camera files
              and the optimizer serves AVIF or WebP at the size actually needed. */}
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 55vw"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/25 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />

          {/* Index sits inside the frame. A caption below it would pass
              straight through the pinned title on the way up. */}
          <figcaption className="absolute left-4 top-4 flex items-center gap-3">
            <span className="label-caps nums text-white/55">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.8125rem] text-white/0 transition-colors duration-500 group-hover:text-white/80 group-focus-visible:text-white/80">
              {image.title}
            </span>
          </figcaption>
        </motion.figure>
      </button>
    </motion.div>
  );
}
