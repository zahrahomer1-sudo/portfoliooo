# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + Tailwind CSS. User decision, confirmed during init.

Deploy target not confirmed. A Vercel connector is available to sessions on this
project, but nothing is wired to it.

## Users

Primary: recruiters and hiring managers, deciding whether the owner is a fit for
a role. They arrive with limited time and a comparison set, want evidence of
capability, and need a way to make contact.

Confirmed second audience: **print buyers.** Adding a buy-print call to action
to the album means the site now sells to people who want a photograph on their
wall, not only to people deciding whether to hire. These two want different
things from the same page and the balance between them is not yet settled —
raise it before letting either one take over the layout.

Academic reviewers and peers were offered during init and not selected.

## Product Purpose

A personal portfolio presenting the owner's completed design work to recruiters
and giving them a way to get in touch. Success is a recruiter grasping the range
and quality of the work quickly, then initiating contact.

## Positioning

The work spans photography/videography, UX design, and graphic and brand design.
That combination is the confirmed differentiator: a portfolio in any one of those
disciplines rarely covers the other two credibly. Future work must present the
span as deliberate range rather than an unfocused list.

## Operating Context

Recruiter review is fast and comparative, often a first pass across many
candidates and frequently on a phone. The site is most likely reached from a link
in an application, a CV, or a professional profile rather than through search.

## Capabilities and Constraints

Confirmed:

- Presents finished case studies — writeups plus imagery — that already exist.
- Contact form. This requires a form backend: a Next.js route handler plus a
  delivery service, or a third-party form service. The site is therefore not
  purely static.
- Media includes photography and video, so asset weight and loading strategy are
  real constraints on the recruiter's first pass, not polish concerns.
- Enquiry budgets are quoted in PKR, confirmed by the user. The band edges
  (50k / 150k / 500k) are a first pass, not a price list — adjust them to where
  the real decisions fall.
- Print sales via WhatsApp enquiry. Each album frame opens a dialog with a
  prefilled message to +92 300 277 3339. No cart, no payment, no stock: the
  transaction happens in the conversation.
- Discipline confirmed as photography, videography, UX design, and graphic and
  brand design — a wider span than a single-discipline portfolio.

Explicitly undecided — do not resolve without asking:

- Whether case studies get per-project detail pages or live on a single page.
  Detail pages were offered and not selected, yet finished writeups exist, so the
  presentation model is genuinely open.
- Owner's name, domain, and existing profile links.
- Downloadable CV. Offered during init and not selected.
- Contact form delivery mechanism and spam handling.
- Print pricing, sizes, editions and shipping. Every album frame currently says
  "print details to be confirmed" because none of it has been established.

## Evidence on Hand

Real hero footage exists and is committed at `public/media/hero.mp4` (H.264 +
AAC, 1.4 MB). Everything else in `public/media/` is still generated placeholder.

Finished case studies exist — writeups with accompanying imagery — but none are in
this repository and no paths are known. Their number, subject matter, and split
across the three disciplines are unconfirmed.

Nothing else is established. There are no confirmed clients, employers,
testimonials, press mentions, awards, or metrics. Future work must not invent any,
and must not fabricate project names or outcomes to fill a layout.

## Product Principles

1. Respect the scan. The first pass is short; the work must register before
   anything else does.
2. Show the range, argue the coherence. Three disciplines is the position, but it
   fails if it reads as scattered.
3. The artefacts lead. Writeups support the imagery; they do not replace it.
4. Contact is a primary path, not a footer afterthought.
5. Never fabricate credibility. Absent proof stays absent.
