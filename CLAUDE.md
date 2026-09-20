# CLAUDE.md

Guidance for Claude Code (claude.com/claude-code) working in this repository.

## Status: empty repository

As of this file's creation, `portfoliooo` contains no application code — this
CLAUDE.md is the first commit. There is no build system, no dependency
manifest, no test runner, and no source tree yet.

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

TBD — no code yet.

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

TBD. Not configured. A Vercel connection is available in Claude Code sessions
for this account, but nothing in this repository is wired to it yet.
