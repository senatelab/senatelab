# Contributing to SenateLab

Thanks for considering a contribution. This project aims to stay small, focused, and reviewable.

## Ground rules

- **One concern per PR.** A refactor, a feature, and a doc fix are three PRs.
- **Tests for behavior, not scaffolding.** If a change is user-observable, there should be a test.
- **Be explicit about tradeoffs.** If you picked Option A over Option B, say so in the PR description.

## Development

```bash
git clone https://github.com/KnotekBerzas/senatelab.git
cd senatelab
npm install
npm run dev
```

In a second terminal:

```bash
npm start      # launches the Electron shell against the Vite dev server
npm test       # runs Vitest
npm run lint   # prettier --check
```

## Project layout

```
src/
├── main/       # Electron main process (Node)
├── preload/    # contextBridge surface
├── renderer/   # React 19 UI
└── shared/     # types + IPC channel map, imported by both sides
tests/          # Vitest; mirror src/ structure where it helps
docs/           # public-facing docs served at senatelab.xyz/documentation
```

## Commit style

Conventional Commits. The prefixes we use most: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`, `test`, `ci`. Keep the subject under 72 chars.

## Before you open a PR

1. `npm run lint` passes.
2. `npm test` passes.
3. `npm run build` produces a clean dist.
4. The PR description links an issue or explains the motivation.

## Code review

- At least one maintainer approval is required before merge.
- Squash-merge is the default; preserve the PR title as the commit subject.
- Rebase on `main` if there are conflicts — we don't use merge commits on trunk.

## Release process

Releases are cut from `main` via annotated tags. A maintainer will bump `package.json`, append a `CHANGELOG.md` entry, and push the tag; CI handles the build.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be kind, be specific, stay on the technical merits.
