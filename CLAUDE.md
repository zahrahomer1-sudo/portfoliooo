# CLAUDE.md

Guidance for Claude Code (claude.com/claude-code) working in this repository.

## Status

A personal portfolio site for Zahrah, built with Next.js and Tailwind.

Read [PRODUCT.md](PRODUCT.md) before any design or build work — it records
confirmed product truth and, just as importantly, which facts are deliberately
undecided. [DESIGN.md](DESIGN.md) records the visual system.

**No real media or case-study content exists yet.** Every project entry in
`src/content/site.ts` is a labelled placeholder and every media slot renders an
"awaiting asset" state. Do not invent clients, testimonials, metrics or project
outcomes to fill them.

## Repository

- Remote: https://github.com/zahrahomer1-sudo/portfoliooo (public)
- Default branch: `main` (configured on GitHub; not yet created — the repo has
  no commits on it)
- Intended purpose: a personal portfolio site

## Branch and commit workflow

- Do not commit directly to `main`. Work on a feature branch and push with
  `git push -u origin <branch-name>`.
- Claude Code web sessions are assigned a `claude/<name>` branch and must push
  only to that branch.
- Do not open a pull request unless explicitly asked.

## Architecture

Next.js 16 (App Router) + React 19 + Tailwind CSS v4. Motion for animation,
Lenis for scroll feel. One route: `/`, plus `POST /api/contact`.

Things that are not obvious from a single file:

- **All copy and content lives in `src/content/site.ts`.** Components import
  from it and never hardcode strings. Editing the site's words, projects,
  services or contact questions means editing that one file.
- **Media existence is resolved on the server**, in `src/lib/media.ts`, and
  passed down as boolean props. It is deliberately not inferred from a browser
  `error` event: a lazy image below the fold never requests anything, so it
  never errors, and the placeholder would silently never appear. Drop a real
  file at the path in `site.ts` and the placeholder disappears on next build.
- **`Reveal` (`src/components/primitives/Reveal.tsx`) is the only entrance
  animation.** One curve, one distance, varied by delay. Its start state is
  server-rendered as `opacity:0`, so `layout.tsx` ships a `<noscript>` override
  — without it the page would be present but invisible to a no-JS client.
- **Design tokens are CSS custom properties** in the `@theme` block of
  `src/app/globals.css`, consumed as Tailwind utilities (`text-cherry`,
  `bg-ink`). Browser surfaces — selection, caret, focus ring — are themed there
  too.
- **The contact form never submits until the review step.** `/api/contact`
  answers `501` when no delivery provider is configured, and the client turns
  that into a prefilled mailto rather than faking success. See `.env.example`.

## Commands

| Task | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Run dev server | `npm run dev` |
| Build for production | `npm run build` |
| Serve the build | `npm run start` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Run tests | None yet |

Run `npm run build`, `npm run lint` and `npm run typecheck` before pushing;
all three pass on the current tree.

## Deployment

Not yet wired up. The app builds and serves with `npm run build && npm run start`.
A Vercel connector is available in Claude Code sessions for this account.

Before launch: set the real domain in `site.url` (`src/content/site.ts`) — it
drives canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt` — and
configure contact delivery per `.env.example`.

## Design workflow

The [impeccable](https://github.com/pbakaus/impeccable) skill is installed at
`.agents/skills/impeccable/` and symlinked into `.claude/skills/`. Its commands
(`shape`, `document`, `audit`, `critique`, `polish`, …) are listed in that
skill's `SKILL.md`. `PRODUCT.md` is its product record; `DESIGN.md` does not
exist yet and is created by design work, not by init.
