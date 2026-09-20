import { services } from "@/content/site";
import Reveal from "./primitives/Reveal";
import SectionHead from "./primitives/SectionHead";

/**
 * A typographic list, not a card rack. The rule between rows does the
 * separating; the type scale does the ranking.
 */
export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="shell rule py-24 sm:py-36"
    >
      <SectionHead
        id="services-heading"
        title="What I do"
        lead="Five disciplines that keep turning out to be one job."
      />

      <ul className="m-0 list-none p-0">
        {services.map((service, i) => (
          <li key={service.title} className="border-t border-ink-12">
            <Reveal delay={i * 0.04}>
              <div className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 sm:py-11">
                <h3 className="display col-span-12 text-[clamp(1.75rem,4vw,3rem)] sm:col-span-6">
                  {service.title}
                </h3>
                <p className="measure col-span-12 self-center text-[1rem] leading-relaxed text-ink-55 sm:col-span-5 sm:col-start-8">
                  {service.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
