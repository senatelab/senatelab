# Changelog

All notable changes to SenateLab are tracked here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.18] — 2026-04-13

### Added
- First-run provider wizard with Ollama auto-detect.
- Per-agent activity sparklines in the sidebar.

### Changed
- SQLite WAL checkpoint interval tuned for SSD throughput (2x write bandwidth).
- Canvas pan/zoom inertia feels closer to native trackpad scroll.

### Fixed
- Channel list no longer flickers when an agent transitions `idle → running`.
- Memory leak when a workspace window is reopened repeatedly.

## [1.3.0] — 2026-03-20

### Added
- Group chats — agents self-organize around problems and pull in teammates.
- Report documents for each agent (replaces the old "activity log" drawer).

### Changed
- IPC layer rewritten with typed channel contracts (`src/shared/ipc.ts`).
- Renderer bundle split into `vendor` + `app`; HMR is noticeably snappier.

## [1.2.0] — 2026-02-25

### Added
- Provider-agnostic adapter layer: `openai-compat`, `ollama`, `custom`.
- `docs/providers.md` describing endpoint + auth patterns for each.

### Fixed
- Race condition on first launch when two agents wrote to reports concurrently.

## [1.1.0] — 2026-02-10

### Added
- Multi-workspace support — switch between workspaces via titlebar tabs.
- Dependabot wired up for npm + GitHub Actions.

## [1.0.0] — 2026-01-30

### Added
- Initial public release.
- Electron shell (arm64, macOS 14+), React 19 renderer, SQLite-backed storage.
- Five seed agents (Orion, Vega, Lyra, Helios, Draco), one default workspace.
