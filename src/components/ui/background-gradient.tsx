"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Adapted from the Aceternity background gradient.
 *
 * The mechanic — two stacked radial-gradient layers, one blurred into a halo,
 * drifting via background-position — is kept. Everything else is re-specified
 * for this site: the original's teal, violet, amber and azure would fight the
 * cherry-and-burgundy palette on every surface it touched, so the stops are
 * drawn from the palette instead. Corners are square, because cards here have
 * sharp edges and only buttons are round.
 *
 * It renders as a lit rim around a surface, not a glowing box: the halo sits
 * behind an opaque panel and only its edge shows.
 */
export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const reduced = useReducedMotion();
  const moving = animate && !reduced;

  const variants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
  };

  const stops = [
    "radial-gradient(circle farthest-side at 0 100%, #7a1028, transparent)",
    "radial-gradient(circle farthest-side at 100% 0, #c8102e, transparent)",
    "radial-gradient(circle farthest-side at 100% 100%, #3d0c18, transparent)",
    "radial-gradient(circle farthest-side at 0 0, #e8506a, #0a0908)",
  ].join(",");

  const layer = {
    variants: moving ? variants : undefined,
    initial: moving ? "initial" : undefined,
    animate: moving ? "animate" : undefined,
    transition: moving
      ? { duration: 14, repeat: Infinity, repeatType: "reverse" as const, ease: "linear" as const }
      : undefined,
    style: { backgroundSize: moving ? "300% 300%" : undefined, backgroundImage: stops },
  };

  return (
    <div className={cn("group relative p-px", containerClassName)}>
      <motion.div
        {...layer}
        aria-hidden="true"
        className="absolute inset-0 z-[1] opacity-35 blur-2xl transition-opacity duration-700 will-change-transform group-hover:opacity-70"
      />
      <motion.div
        {...layer}
        aria-hidden="true"
        className="absolute inset-0 z-[1] opacity-70 will-change-transform"
      />
      <div className={cn("relative z-10 bg-ink-raised", className)}>{children}</div>
    </div>
  );
};
