import { studio } from "@/content/site";
import Reveal from "./primitives/Reveal";

/**
 * Marks the shift from showing work to explaining how the practice is run.
 *
 * It used to invert to a dark ground for contrast. Now that the whole page is
 * dark that would read as an accident, so it separates itself with a raised
 * glass surface and tighter measure instead — same job, no seam.
 */
export default function Studio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="relative py-24 sm:py-36"
    >
      <div className="shell">
        <div className="glass grid grid-cols-12 gap-y-10 p-8 sm:p-14">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <h2
              id="studio-heading"
              className="display text-[clamp(2.25rem,6vw,4.75rem)]"
            >
              {studio.heading}
            </h2>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          {studio.body.map((p, i) => (
            <Reveal key={p} delay={0.06 * (i + 1)}>
              <p className="measure mb-5 text-[1.0625rem] leading-relaxed text-paper-70 last:mb-0">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
