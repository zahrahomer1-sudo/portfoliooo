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
  role: "Photographer, videographer and designer",
  // TODO: confirm domain before launch; used for canonical URLs and OG tags.
  url: "https://example.com",
  email: "zahrah.omer1@gmail.com",
  /**
   * Supplied as 03002773339 and read as Pakistan (+92). wa.me needs digits
   * only, no plus, no spaces. Correct the country code here if that is wrong —
   * a wrong code fails silently as a dead link.
   */
  whatsapp: "923002773339",
  whatsappDisplay: "+92 300 277 3339",
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
   * Drop real footage at public/media/hero.webm (and/or .mp4 — both are wired).
   * Until then the poster still is used with a slow drift, which is why the
   * section does not look broken without it.
   */
  video: "/media/hero.webm",
  videoMp4: "/media/hero.mp4",
  poster: "/media/hero-poster.png",
  headline: ["Pictures that", "hold their nerve"],
  intro:
    "Hey, I’m Zahrah. I shoot, cut and design. Photography, film, identity and the sites they live on. Based in Pakistan, working wherever the project is.",
  scrollCue: "Scroll to explore",
} as const;

/** Figures supplied by Zahrah. Not estimates — change them here, nowhere else. */
export const stats = {
  hours: 5,
  years: 6,
} as const;

export const about = {
  heading: "I make work that earns a second look.",
  body: [
    "I move between a camera, a timeline and a typeface, and I've stopped treating those as separate jobs. A brand that photographs badly was designed badly.",
    "The throughline is authorship. Deciding what a thing is before deciding what it looks like, then holding that through every frame.",
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
  /** Optional muted loop revealed on hover. None exist yet. */
  preview?: string;
  /** Grid weight. "wide" spans the full column set, "tall" doubles height. */
  scale?: "wide" | "tall" | "standard";
};

export const projects: Project[] = [
  {
    slug: "portrait-series",
    title: "Portrait Series",
    discipline: "Photography",
    year: "",
    summary:
      "Placeholder slot. Replace with a real series: what you were after, what you changed on the day, what the client did with it.",
    image: "/media/work-01.png",
    scale: "wide",
  },
  {
    slug: "short-film",
    title: "Short Film",
    discipline: "Videography",
    year: "",
    summary: "Placeholder slot. Replace with a real film and its brief.",
    image: "/media/work-02.png",
    scale: "tall",
  },
  {
    slug: "identity-system",
    title: "Identity System",
    discipline: "Brand and graphic design",
    year: "",
    summary: "Placeholder slot. Replace with a real identity and its problem.",
    image: "/media/work-03.png",
    scale: "standard",
  },
  {
    slug: "editorial-site",
    title: "Editorial Site",
    discipline: "Web design and development",
    year: "",
    summary: "Placeholder slot. Replace with a real site and what it had to do.",
    image: "/media/work-04.png",
    scale: "standard",
  },
  {
    slug: "campaign",
    title: "Campaign",
    discipline: "Creative direction",
    year: "",
    summary: "Placeholder slot. Replace with a real campaign end to end.",
    image: "/media/work-05.png",
    scale: "wide",
  },
];

export type AlbumImage = {
  id: string;
  src: string;
  /** Intrinsic pixel size, so next/image can reserve space and pick a source. */
  width: number;
  height: number;
  alt: string;
  title: string;
  /** Shown in the popup. Replace with the real story behind the frame. */
  description: string;
  /** Placeholder slots below; swap for real edition details. */
  edition: string;
  /** Loose column placement and parallax depth. 1 = moves with the page. */
  column: "left" | "centre" | "right";
  depth: number;
  ratio: string;
};

export const album = {
  /**
   * TODO: the title and every frame title and description below are
   * placeholders. Alt text IS accurate (written from the photographs) but the
   * titles, the story of each frame and the print details are yours to write.
   */
  title: "Selected frames",
  standfirst:
    "Scroll it as one piece. The frames arrive at different speeds, the way a room reveals itself.",
  video: "/media/album.webm",
  videoMp4: "/media/album.mp4",
  /** TODO: point at the full album once one exists. */
  viewMore: { label: "See more work", href: "#work" },
  images: [
    {
      id: "a1",
      src: "/media/album-01.jpg",
      width: 1600,
      height: 2400,
      alt: "Black and white photograph of an elderly man seen from behind in a covered market, wearing a white kurta and embroidered cap, a woven basket slung across his back.",
      title: "Frame one",
      description: "Placeholder. Replace with what was happening here and why it stayed in the edit.",
      edition: "Print details to be confirmed",
      column: "left",
      depth: 0.82,
      ratio: "2 / 3",
    },
    {
      id: "a2",
      src: "/media/album-02.jpg",
      width: 2180,
      height: 2400,
      alt: "Black and white photograph of a man standing behind a cart piled high with leaves and sacks, looking off to one side.",
      title: "Frame two",
      description: "Placeholder. Replace with the real note for this frame.",
      edition: "Print details to be confirmed",
      column: "right",
      depth: 1.12,
      ratio: "2180 / 2400",
    },
    {
      id: "a3",
      src: "/media/album-03.jpg",
      width: 2400,
      height: 1600,
      alt: "Colour photograph of a young child with windblown hair looking towards the camera, a hand raised to their mouth, makeshift shelters out of focus behind them.",
      title: "Frame three",
      description: "Placeholder. Replace with the real note for this frame.",
      edition: "Print details to be confirmed",
      column: "centre",
      depth: 0.9,
      ratio: "3 / 2",
    },
    {
      id: "a4",
      src: "/media/album-04.jpg",
      width: 1193,
      height: 1751,
      alt: "Colour photograph of a bare tree silhouetted against a deep orange sunset, the sun sitting low behind its trunk.",
      title: "Frame four",
      description: "Placeholder. Replace with the real note for this frame.",
      edition: "Print details to be confirmed",
      column: "right",
      depth: 0.78,
      ratio: "1193 / 1751",
    },
  ] satisfies AlbumImage[],
} as const;

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
    title: "Brand and graphic design",
    body: "Identity, art direction and the unglamorous system underneath. Type scale, grid, and rules that survive other people using them.",
  },
  {
    title: "Web design and development",
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
    body: "Shoot, design, build. Fewer options, better executed, is a service, not a shortcut.",
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
      "Brand and graphic design",
      "Web design and development",
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
      "Product or ecommerce",
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
      "Under PKR 50,000",
      "PKR 50,000 to 150,000",
      "PKR 150,000 to 500,000",
      "PKR 500,000+",
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
    options: ["Within weeks", "1 to 3 months", "3 months+", "No fixed date"],
  },
  {
    id: "extra",
    question: "Anything else I should know?",
    hint: "Optional. References, constraints, the thing you almost did not mention.",
    type: "longtext",
    optional: true,
  },
] as const;
