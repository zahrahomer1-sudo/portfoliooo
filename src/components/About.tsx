import { about } from "@/content/site";
import Reveal from "./primitives/Reveal";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="shell rule py-24 sm:py-36"
    >
      <div className="grid grid-cols-12 gap-y-10">
        <div className="col-span-12 lg:col-span-7 lg:col-start-1">
          <Reveal>
            <h2
              id="about-heading"
              className="display text-[clamp(2.25rem,6vw,4.75rem)]"
            >
              {about.heading}
            </h2>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          {about.body.map((p, i) => (
            <Reveal key={p} delay={0.06 * (i + 1)}>
              <p className="measure mb-5 text-[1.0625rem] leading-relaxed text-ink-80 last:mb-0">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
