# Design

The visual world for Zahrah's portfolio: Apple-adjacent glass over a cinematic
dark ground, with editorial typography and red used as light rather than paint.

The supplied reference (`photographers.framer.website`) is blocked by this
environment's egress, so nothing here is derived from browsing it. It is built
from the written brief plus the single screenshot supplied — full-bleed footage,
enormous wide-grotesque display type reading through the image, minimal chrome.

## Ground

Near-black `#0a0908`, never `#000`: pure black flattens the glass edges and
kills the inset highlight that makes a panel look like a panel.

Hero and About sit on a fixed film layer. It crossfades to the ground across the
back half of that wrapper, so there is no seam where one background ends and the
next begins. Everything from the album down is on the dark ground.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#0a0908` | Ground |
| `ink-raised` | `#121011` | Media wells, raised surfaces |
| `paper` | `#f2efec` | Type. Warm, so it does not glare |
| `cherry` | `#c8102e` | Fills, large type, light. **Not small text** |
| `cherry-soft` | `#e8506a` | The only red that clears 4.5:1 on the ground |
| `wine` | `#7a1028` | Hover states, depth |
| `burgundy` | `#3d0c18` | Shadow tint, atmosphere |

Red is light falling on the scene, not a colour applied to it. One red thing per
viewport. `cherry` fails contrast for body-sized text — that is what
`cherry-soft` exists for, and the distinction is not optional.

## Glass

Four properties, all four required:

```css
background: rgb(255 255 255 / 0.055);
border: 1px solid rgb(255 255 255 / 0.12);
box-shadow:
  inset 0 1px 0 0 rgb(255 255 255 / 0.2),    /* top rim catches light */
  inset 0 -1px 0 0 rgb(0 0 0 / 0.3),         /* bottom rim falls away */
  0 24px 48px -28px rgb(61 12 24 / 0.75);    /* burgundy, never black */
backdrop-filter: blur(18px) saturate(155%);
```

The saturation lift is what stops the blur greying out whatever is behind it.
Without `backdrop-filter` support the panels go opaque rather than transparent —
an unreadable panel is worse than an un-glassy one.

`.glass` for surfaces over the film, `.glass-strong` for the album dialog.

## Navigation

Sticky and always present. It grew from a reveal-on-scroll-up component, but a
nav you have to scroll up to summon is a nav people cannot find. It uses
`.glass-nav`, which is denser than `.glass`: the bar crosses the hero's huge
white headline, and a 5% white film over that leaves the labels invisible.

Anchor clicks are eased by Lenis from `SmoothScroll`, which intercepts every
`a[href^="#"]` once at the root. A native hash jump is instant and fights the
smoothing.

## Shape

**Rounded CTAs, sharp everything else.** Buttons and the floating nav are fully
round; cards, panels, dialogs and images have square corners. This is the rule
that keeps it from looking like every other glass template.

## Type

Archivo for display, Inter Tight for everything else.

Softened deliberately: display weight 400 (not 500), tracking −0.018em (not
−0.035em), line-height 0.98 (not 0.88), width 104% (not 112%). Body sits at
weight 380, line-height 1.65. The earlier setting was poster typography — tight,
heavy, correct on a billboard and hard on a page you actually read.

Labels are sentence case by default (`.label`). `.label-caps` still exists for
the few places wide-tracked uppercase earns itself — frame indices, metadata —
but caps everywhere was a large part of what made the page feel severe.

The hero headline is glass (`.glass-type`): a 20% white fill with a 68% white
stroke at its edge, so the film genuinely shows through each letterform and the
stroke keeps the shape readable. It replaced a `mix-blend-mode: difference`
treatment, which inverted the type against the footage but let nothing through
it.

No dashes anywhere in the copy. Sentences that wanted an em dash are split into
two, or take a comma.

## Album

Five frames, then a way onward. A film holds the full height of the section
behind everything and the title is pinned at its centre, so both stay put while
the frames travel past — one continuous move rather than a header followed by a
grid. The film clears as the first frames arrive; the title releases only after
the last one. The title is blended so it survives both bright frames and bare
ground passing underneath.

Frame captions live inside the image, top-left, not below it: a caption below
passes straight through the pinned title on its way up the screen.

One scrolling visual story, not a gallery. Frames sit in a loose three-column
rhythm and travel at different speeds (`depth` per frame, 1 = moves with the
page). A shallow pointer tilt — 3 degrees maximum — suggests the surface has
depth; anything more distorts the photograph, which is the thing being sold.

Clicking a frame opens a dialog with its story and a prefilled WhatsApp print
enquiry. The custom cursor exists only inside this section, where it is the
affordance saying a frame will open; the rest of the site keeps the pointer
people already know.

## Motion

Lenis for scroll inertia. One authored entrance, `cubic-bezier(0.16, 1, 0.3, 1)`,
varied by delay. Scroll-linked: the film's fade and scale, the album parallax.
Spring physics only on the frame tilt.

All of it off under `prefers-reduced-motion`, including Lenis and including the
film's drift — and under reduced motion the film is contained to its wrapper
rather than fixed, because a backdrop that never fades would otherwise sit
behind every section on the site.

## Preloading

The hero film is preloaded with the document (`<link rel="preload" as="video">`
plus `preload="auto"`), because it is the first thing anyone sees. The album
film is deliberately not: it is warmed by an IntersectionObserver a full
viewport before the section arrives, so it is ready on time without putting
several megabytes in front of the first paint. Album photographs go through
next/image, which serves AVIF or WebP at the size actually needed and preloads
the first frame.

Source media is compressed at rest by `npm run optimize` (sharp, long edge
capped at 2400px). Videos are not compressed: no H.264 decoder here.

## Refusals

No cards, no gradients as decoration, no rounded panels, no eyebrow labels, no
emoji icons, no pure black, no `cherry` on small text. Section numbering appears
twice — Process and album frame indices — in both cases because the sequence is
the content.

## Open

Album presentation is a homepage section plus a per-frame dialog. Whether albums
also deserve their own routes (better for sharing and search) is unresolved, as
is print pricing.
