import { process } from "@/content/site";
import Reveal from "./primitives/Reveal";
import SectionHead from "./primitives/SectionHead";

/**
 * Numbered, because here the sequence genuinely is the content — these are
 * ordered stages, not four interchangeable features.
 */
export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="shell rule py-24 sm:py-36"
    >
      <SectionHead id="process-heading" title="How it goes" />

      <ol className="m-0 grid grid-cols-12 gap-x-6 gap-y-12 p-0">
        {process.map((step, i) => (
          <li key={step.title} className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Reveal delay={i * 0.06}>
              <span className="label block text-cherry-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-4 text-[clamp(1.5rem,3vw,2rem)]">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper-45">
                {step.body}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
