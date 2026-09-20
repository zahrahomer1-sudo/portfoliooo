/**
 * Single source of truth for every word and media path on the site.
 *
 * PLACEHOLDER CONTENT — READ BEFORE PUBLISHING
 * --------------------------------------------
 * PRODUCT.md records that finished case studies exist but none are in this
 * repository. Nothing here claims a client, an employer, a testimonial, an
 * award or a metric, because none has been confirmed. The project entries are
 * empty slots shaped like real ones so the layout can be built and reviewed;
 * replace `title`, `discipline`, `year`, `summary` and the media paths with
 * real work before this goes live. Deleting a slot is fine — the grid adapts.
 */

export const site = {
  name: "Zahrah",
  role: "Photographer, videographer & designer",
  // TODO: confirm domain before launch; used for canonical URLs and OG tags.
  url: "https://example.com",
  email: "hello@example.com",
} as const;

/** Preloader rotation. Order matters — it reads as a sentence being rewritten. */
export const professions = [
  "videographer",
  "photographer",
  "designer",
  "creative director",
  "brand builder",
] as const;

export const hero = {
  /**
   * Drop a file at public/media/hero.mp4 (and an optional hero-poster.jpg).
   * Absent, the hero renders its typographic treatment alone — by design, not
   * as a broken state.
   */
  video: "/media/hero.mp4",
  poster: "/media/hero-poster.jpg",
  headline: ["Pictures", "that hold", "their nerve."],
  caption: "Independent creative direction — photography, film and identity.",
} as const;

export const about = {
  heading: "I make work that earns a second look.",
  body: [
    "I move between a camera, a timeline and a typeface, and I have stopped pretending those are separate jobs. A brand that photographs badly was designed badly. A film that cuts well was storyboarded like a layout.",
    "The through-line is authorship: deciding what a thing is before deciding what it looks like, then holding that decision through every frame, spread and screen.",
  ],
} as const;

export type Project = {
  slug: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  /** Poster image. Falls back to a typographic placeholder when missing. */
  image?: string;
  /** Optional muted loop revealed on hover. */
  preview?: string;
  /** Grid weight. "wide" spans the full column set, "tall" doubles height. */
  scale?: "wide" | "tall" | "standard";
};

export const projects: Project[] = [
  {
    slug: "portrait-series",
    title: "Portrait Series",
    discipline: "Photography",
    year: "—",
    summary:
      "Placeholder slot. Replace with a real series: what you were after, what you changed on the day, what the client did with it.",
    image: "/media/work-01.jpg",
    preview: "/media/work-01.mp4",
    scale: "wide",
  },
  {
    slug: "short-film",
    title: "Short Film",
    discipline: "Videography",
    year: "—",
    summary: "Placeholder slot. Replace with a real film and its brief.",
    image: "/media/work-02.jpg",
    preview: "/media/work-02.mp4",
    scale: "tall",
  },
  {
    slug: "identity-system",
    title: "Identity System",
    discipline: "Brand & graphic design",
    year: "—",
    summary: "Placeholder slot. Replace with a real identity and its problem.",
    image: "/media/work-03.jpg",
    scale: "standard",
  },
  {
    slug: "editorial-site",
    title: "Editorial Site",
    discipline: "Web design & development",
    year: "—",
    summary: "Placeholder slot. Replace with a real site and what it had to do.",
    image: "/media/work-04.jpg",
    scale: "standard",
  },
  {
    slug: "campaign",
    title: "Campaign",
    discipline: "Creative direction",
    year: "—",
    summary: "Placeholder slot. Replace with a real campaign end to end.",
    image: "/media/work-05.jpg",
    preview: "/media/work-05.mp4",
    scale: "wide",
  },
];

export const services = [
  {
    title: "Photography",
    body: "Portrait, editorial, product and event. Shot with the final layout already in mind, so the crop you need exists.",
  },
  {
    title: "Videography",
    body: "Concept through grade. Short film, brand film, social cutdowns that were planned as cutdowns rather than salvaged into them.",
  },
  {
    title: "Brand & graphic design",
    body: "Identity, art direction and the unglamorous system underneath — type scale, grid, and rules that survive other people using them.",
  },
  {
    title: "Web design & development",
    body: "Design and build. Sites that load fast, read well on a phone, and do not collapse the moment real content arrives.",
  },
  {
    title: "Creative direction",
    body: "For teams who have the pieces and need someone to decide what they add up to, then hold that line through production.",
  },
] as const;

export const studio = {
  heading: "Running it as a business, not a hobby with a camera.",
  body: [
    "Working for yourself means the work has to survive contact with budgets, timelines and people who were not in the room when you had the idea. I would rather build that in from the start than protect an idea that cannot ship.",
    "That is the entrepreneurial part: owning the outcome, not just the deliverable.",
  ],
} as const;

export const process = [
  {
    title: "Interrogate",
    body: "What is this actually for, who decides it worked, and what is the honest constraint nobody has said out loud yet.",
  },
  {
    title: "Direct",
    body: "A single clear decision about what the thing is. Everything downstream is held against it.",
  },
  {
    title: "Produce",
    body: "Shoot, design, build. Fewer options, better executed, is a service — not a shortcut.",
  },
  {
    title: "Hand over",
    body: "Files organised, systems documented, and enough context that the work keeps working after I leave.",
  },
] as const;

export type ContactStep = {
  id: string;
  question: string;
  hint?: string;
  type: "text" | "email" | "longtext" | "choice";
  options?: readonly string[];
  optional?: boolean;
  /** Basic client-side validation message. */
  required_message?: string;
};

export const contactSteps: readonly ContactStep[] = [
  {
    id: "name",
    question: "First, what should I call you?",
    type: "text",
    required_message: "A name, so I know who I am replying to.",
  },
  {
    id: "email",
    question: "Where do I reach you?",
    hint: "I only use this to reply.",
    type: "email",
    required_message: "A valid email address, otherwise this goes nowhere.",
  },
  {
    id: "looking_for",
    question: "What are you looking for?",
    type: "choice",
    options: [
      "Photography",
      "Videography",
      "Brand & graphic design",
      "Web design & development",
      "Creative direction",
      "Not sure yet",
    ],
  },
  {
    id: "project_type",
    question: "And what kind of project is it?",
    type: "choice",
    options: [
      "Brand or campaign",
      "Editorial or personal",
      "Product or e-commerce",
      "Event",
      "Something else",
    ],
  },
  {
    id: "budget",
    question: "Roughly what budget are you working with?",
    hint: "An honest range saves us both a call.",
    type: "choice",
    options: [
      "Under £1k",
      "£1k – £5k",
      "£5k – £15k",
      "£15k+",
      "Rather discuss it",
    ],
  },
  {
    id: "brief",
    question: "Tell me about it.",
    hint: "What it is, who it is for, and what would make it a success.",
    type: "longtext",
    required_message: "Even two lines helps.",
  },
  {
    id: "timeline",
    question: "When does this need to happen?",
    type: "choice",
    options: ["Within weeks", "1 – 3 months", "3 months+", "No fixed date"],
  },
  {
    id: "extra",
    question: "Anything else I should know?",
    hint: "Optional. References, constraints, the thing you almost did not mention.",
    type: "longtext",
    optional: true,
  },
] as const;
