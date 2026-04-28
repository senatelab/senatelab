<div align="center">

<img src="docs/assets/banner.png" alt="SenateLab" width="100%" />

# SenateLab

**A team workspace for your AI agents.**

Stop running single agents. SenateLab gives them a shared canvas to communicate, delegate, and ship work together — with full human visibility.

[![CI](https://img.shields.io/badge/CI-passing-22c55e?style=flat-square)](https://github.com/KnotekBerzas/senatelab/actions)
[![Release](https://img.shields.io/badge/release-v1.3.18-0b0d10?style=flat-square)](https://github.com/KnotekBerzas/senatelab/releases)
[![License](https://img.shields.io/badge/license-MIT-d4d9e1?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS_arm64-1c1f24?style=flat-square)](https://senatelabs.vercel.app/download)
[![Electron](https://img.shields.io/badge/electron-33-2a2e35?style=flat-square)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-848a93?style=flat-square)](https://www.typescriptlang.org/)

[Website](https://senatelab.xyz) · [Download](https://senatelabs.vercel.app/download) · [Docs](https://senatelabs.vercel.app/documentation) · [Changelog](CHANGELOG.md)

</div>

---

## What is SenateLab?

SenateLab is a desktop workspace where multiple AI agents operate as a team. Each agent has a role, a scope, and a live report. They message each other through structured channels, coordinate across folders, and surface what needs your attention — without you having to poll.

Built for engineers who already have one agent doing their work and want five doing it together.

## Quick Start

```bash
# Download the latest build
curl -LO https://senatelabs.vercel.app/download
open SenateLab_1.3.18_aarch64.dmg

# Or build from source
git clone https://github.com/senatelab/senatelab.git
cd senatelab
npm install
npm run dev
```

On first launch, SenateLab bootstraps a default workspace with five seed agents. Configure your provider in Settings → Providers.

## Features

| Feature              | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| Spatial Canvas       | Every agent has a place on a shared workspace canvas                 |
| Structured Channels  | Agents communicate through typed channels — not ad-hoc prompts       |
| Persistent Memory    | SQLite (WAL) keeps conversations, decisions, and learned patterns    |
| Provider-agnostic    | OpenAI-compatible, Ollama, or bring-your-own endpoint                |
| Live Status Reports  | Each agent maintains a live report — know what's happening, always  |
| Access Control       | Granular per-agent permissions at the folder, tool, and action level |
| Task Queue           | Agents create, track, and complete tasks asynchronously              |
| Human-in-the-loop    | Nothing runs without approval when an agent flags it for review      |

## Architecture

```
┌────────────────────────── Electron ──────────────────────────┐
│                                                              │
│   ┌──────────────┐   IPC    ┌────────────────────────────┐   │
│   │  Renderer    │ ────────▶│   Main process             │   │
│   │  React 19    │          │   ┌────────────────────┐   │   │
│   │  (canvas UI) │◀──────── │   │ SQLite (WAL)       │   │   │
│   └──────────────┘          │   └────────────────────┘   │   │
│                             │   ┌────────────────────┐   │   │
│                             │   │ Provider adapters  │   │   │
│                             │   │ openai-compat /    │   │   │
│                             │   │ ollama / custom    │   │   │
│                             │   └────────────────────┘   │   │
│                             └────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Runtime**: Electron 33, Node 22
- **UI**: React 19, Zustand
- **Storage**: better-sqlite3 (WAL mode)
- **Providers**: OpenAI-compatible HTTP, Ollama, custom
- **Tooling**: Vite 6, TypeScript 5.7, Vitest
- **Distribution**: electron-builder (arm64 DMG)

## Benchmarks

Measured on M2 MacBook Pro, cold start to responsive UI:

| Metric                        | v1.0.0 | v1.3.18 | Δ      |
| ----------------------------- | ------ | ------- | ------ |
| Cold start (ms)               | 1450   | 820     | -43%   |
| 5-agent canvas render (ms)    | 120    | 48      | -60%   |
| IPC roundtrip (p95, µs)       | 740    | 310     | -58%   |
| SQLite write throughput (/s)  | 2400   | 4800    | +100%  |
| Memory steady (MB)            | 340    | 280     | -18%   |

## Roadmap

- [x] Multi-agent shared canvas
- [x] SQLite-backed persistent memory
- [x] OpenAI-compatible + Ollama providers
- [x] Live agent reports
- [ ] Hardware-isolated agent sandboxes (Q2)
- [ ] Windows + Linux builds (Q2)
- [ ] Plugin SDK (Q3)
- [ ] Self-hosted relay for team deployments (Q3)

## Documentation

- [Quickstart](docs/quickstart.md)
- [Architecture](docs/architecture.md)
- [Providers](docs/providers.md)
- [Guardrails](docs/guardrails.md)
- [API reference](docs/api.md)

## Contributing

We welcome issues, pull requests, and RFCs. See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © SenateLab Contributors
