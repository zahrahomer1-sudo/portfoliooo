"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { album, type AlbumImage } from "@/content/site";
import AlbumDialog from "./AlbumDialog";

const column: Record<AlbumImage["column"], string> = {
  left: "col-span-12 md:col-span-7 md:col-start-1",
  centre: "col-span-12 md:col-span-6 md:col-start-4",
  right: "col-span-12 md:col-span-6 md:col-start-7",
};

/**
 * The album: one scrolling visual story rather than a gallery grid.
 *
 * Frames sit in a loose three-column rhythm and travel at different speeds, so
 * the section reveals itself the way a room does. Each one opens a dialog with
 * the frame's story and the print enquiry.
 */
export default function Album() {
  const [open, setOpen] = useState<AlbumImage | null>(null);

  return (
    <section
      id="album"
      aria-labelledby="album-heading"
      data-cursor-zone
      className="cursor-none-fine relative py-28 sm:py-40"
    >
      <div className="shell">
        <header className="mb-20 grid grid-cols-12 gap-y-6 sm:mb-28">
          <h2
            id="album-heading"
            className="display col-span-12 text-[clamp(2.5rem,8vw,6.5rem)] lg:col-span-7"
          >
            {album.title}
          </h2>
          <p className="measure col-span-12 self-end text-[1rem] leading-relaxed text-paper-45 lg:col-span-4 lg:col-start-9">
            {album.standfirst}
          </p>
        </header>

        <div className="grid grid-cols-12 gap-x-6 gap-y-24 sm:gap-y-40">
          {album.images.map((image, i) => (
            <div key={image.id} className={column[image.column]}>
              <Frame image={image} index={i} onOpen={setOpen} />
            </div>
          ))}
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

  // depth 1 travels with the page; below drifts slower, above overtakes it.
  const drift = (image.depth - 1) * 140;
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  function track(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduced || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    // Deliberately shallow. A photograph rotated in perspective is a distorted
    // photograph; this is only enough to suggest the surface has depth.
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
        aria-label={`${image.title} — open frame and print details`}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/25 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
        </motion.figure>

        <figcaption className="mt-4 flex items-baseline justify-between gap-4">
          <span className="display text-[1.125rem] tracking-tight">
            {image.title}
          </span>
          <span className="label nums text-paper-25">
            {String(index + 1).padStart(2, "0")}
          </span>
        </figcaption>
      </button>
    </motion.div>
  );
}
