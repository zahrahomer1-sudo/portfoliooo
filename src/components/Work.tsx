"use client";

import { useState } from "react";
import { projects, type Project } from "@/content/site";
import MediaSlot from "./primitives/MediaSlot";
import Reveal from "./primitives/Reveal";
import SectionHead from "./primitives/SectionHead";

/**
 * Asymmetric editorial grid: spans and vertical offsets vary per item so the
 * eye travels rather than scanning rows. Deliberately not a card grid — the
 * work is the container.
 *
 * Items do not navigate anywhere. PRODUCT.md records the case-study
 * presentation model as an open decision, so this presents each piece in place
 * instead of inventing routes that would have to be unpicked later.
 */
export default function Work({
  available,
}: {
  /** Media paths confirmed present on disk, resolved by the server. */
  available: Record<string, boolean>;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="shell rule py-24 sm:py-36"
    >
      <SectionHead
        id="work-heading"
        title="Selected work"
        lead="A short list, kept short on purpose. Each piece is here because it solved something, not because it filled a grid."
      />

      <ul className="grid grid-cols-12 gap-x-6 gap-y-16 sm:gap-y-24">
        {projects.map((project, i) => (
          <WorkItem
            key={project.slug}
            project={project}
            index={i}
            active={activeSlug === project.slug}
            onActivate={setActiveSlug}
            available={available}
          />
        ))}
      </ul>
    </section>
  );
}

/** Column placement per scale. Offsets create the asymmetry without randomness. */
const placement: Record<NonNullable<Project["scale"]>, string> = {
  wide: "col-span-12",
  tall: "col-span-12 sm:col-span-7 sm:col-start-1",
  standard: "col-span-12 sm:col-span-5 sm:col-start-8",
};

const ratios: Record<NonNullable<Project["scale"]>, string> = {
  wide: "16 / 9",
  tall: "4 / 5",
  standard: "4 / 5",
};

function WorkItem({
  project,
  index,
  active,
  onActivate,
  available,
}: {
  project: Project;
  index: number;
  active: boolean;
  onActivate: (slug: string | null) => void;
  available: Record<string, boolean>;
}) {
  const scale = project.scale ?? "standard";
  const offset = scale === "standard" && index % 2 === 1 ? "sm:mt-24" : "";

  return (
    <li className={`${placement[scale]} ${offset}`}>
      <Reveal>
        <figure
          className="group m-0"
          onMouseEnter={() => onActivate(project.slug)}
          onMouseLeave={() => onActivate(null)}
          onFocus={() => onActivate(project.slug)}
          onBlur={() => onActivate(null)}
          tabIndex={0}
        >
          <MediaSlot
            image={project.image}
            preview={project.preview}
            hasImage={Boolean(project.image && available[project.image])}
            hasPreview={Boolean(project.preview && available[project.preview])}
            alt={`${project.title} — ${project.discipline}`}
            label={`${project.discipline} — ${project.title}`}
            ratio={ratios[scale]}
            active={active}
          />

          <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="display text-[clamp(1.5rem,3vw,2.25rem)]">
              {project.title}
            </h3>
            <span className="label text-ink-55">
              {project.discipline} · {project.year}
            </span>
            <p className="measure basis-full text-[0.9375rem] leading-relaxed text-ink-55">
              {project.summary}
            </p>
          </figcaption>
        </figure>
      </Reveal>
    </li>
  );
}
