# Design

The visual world for Zahrah's portfolio. Derived from the written brief —
premium, editorial, artistic, cinematic — not from a reference site. The
reference link supplied (`photographers.framer.website`) could not be reached
from the build environment and the two promised uploads had not arrived, so
nothing here is interpreted from them.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#0b0a0a` | Type, and the one dark section |
| `paper` | `#faf8f5` | Ground. Warm, so the red reads as ink rather than alert |
| `cherry` | `#c8102e` | Accent. One use per viewport, never a fill |
| `wine` | `#7a1028` | Reserved for depth |
| `burgundy` | `#3d0c18` | Cinematic ground behind film |
| `ink-80/55/30/12` | — | Secondary type and rules, tinted from ink, never grey |

Red is punctuation. It lands on the last line of the hero, the live word in the
preloader, the progress bar, the process numerals and hover states. If a
viewport has two red things competing, one of them is wrong.

## Type

Instrument Serif for display, Inter Tight for everything else.

- Display: `line-height: 0.92`, `letter-spacing: -0.03em`, clamped so it never
  exceeds roughly 7rem. Past that it stops being typography and becomes texture.
- Body: 17px baseline, `measure` caps line length at 62ch.
- `label`: 11px, `0.16em` tracking, uppercase. Navigation, metadata, buttons.

The serif/grotesque pairing is the whole identity. No third face.

## Layout

Twelve columns, `clamp(1.25rem, 5vw, 5rem)` gutters, 96rem maximum.

Sections are separated by a 1px rule and generous vertical space, not by
alternating background bands. Exactly one section — Studio — inverts to ink,
marking the shift from showing work to explaining the practice.

Work is an asymmetric editorial grid: spans and vertical offsets vary per item
so the eye travels. It is deliberately not a card grid, and there are no cards
anywhere on the page.

## Motion

One authored entrance (`Reveal`): 28px rise, `cubic-bezier(0.16, 1, 0.3, 1)`,
1.1s, varied only by delay. Lenis smooths the scroll. The hero film has a slight
parallax. Everything else is a state change, not an animation.

All of it is off under `prefers-reduced-motion`, including Lenis — hijacking
someone's scrollbar is the effect most likely to make them ill.

## Refusals

No cards, no gradients, no rounded boxes, no glass, no eyebrow labels above
headings, no drop shadows, no emoji standing in for icons. Section numbers
appear once, in Process, where the sequence genuinely is the content.

## Open

The presentation model for case studies — detail pages or in-page — is
undecided in PRODUCT.md, so work items present in place and navigate nowhere.
Resolve that before adding routes.
