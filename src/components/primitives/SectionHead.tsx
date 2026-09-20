import Reveal from "./Reveal";

/**
 * Section headings carry their own weight — no eyebrow, no 01/02/03 numbering.
 * The index label is only rendered where the sequence itself is the content.
 */
export default function SectionHead({
  id,
  title,
  lead,
}: {
  id: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-14 sm:mb-20">
      <Reveal>
        <h2
          id={id}
          className="display text-[clamp(2.5rem,7vw,5.5rem)] text-ink"
        >
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={0.08}>
          <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-ink-55 sm:text-lg">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
