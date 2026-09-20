# CLAUDE.md

Guidance for Claude Code (claude.com/claude-code) working in this repository.

## Status: no application code yet

`portfoliooo` contains no application code. There is no build system, no
dependency manifest, no test runner, and no source tree yet.

Product context is captured in [PRODUCT.md](PRODUCT.md) — read it before any
design or build work. It records confirmed product truth and, just as
importantly, which facts are deliberately undecided.

**Anything below marked "TBD" must be filled in by whoever adds the first
code, not guessed at.** A CLAUDE.md that describes commands which do not exist
is worse than no CLAUDE.md: it sends Claude off running things that fail.

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

No code yet. The stack is decided: **Next.js + Tailwind CSS**.

A contact form is a confirmed requirement, so the site is not purely static — it
needs a route handler plus a delivery service, or a third-party form service.

Once a stack is chosen, record here the things that are not obvious from
reading a single file: how pages/routes are organized, where content (projects,
bio, images) lives and in what format, how styling is structured, and anything
that spans more than one directory.

## Commands

TBD — no build tooling yet.

Record the real, verified commands once they exist:

| Task | Command |
| --- | --- |
| Install dependencies | TBD |
| Run dev server | TBD |
| Build for production | TBD |
| Lint | TBD |
| Typecheck | TBD |
| Run tests | TBD |

## Deployment

Not configured. A Vercel connector is available in Claude Code sessions for this
account, but nothing in this repository is wired to it.

## Design workflow

The [impeccable](https://github.com/pbakaus/impeccable) skill is installed at
`.agents/skills/impeccable/` and symlinked into `.claude/skills/`. Its commands
(`shape`, `document`, `audit`, `critique`, `polish`, …) are listed in that
skill's `SKILL.md`. `PRODUCT.md` is its product record; `DESIGN.md` does not
exist yet and is created by design work, not by init.
