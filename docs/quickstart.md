# Quickstart

Get from a cold install to five agents on a shared canvas in under 5 minutes.

## 1. Install

**macOS (Apple Silicon):**

```bash
curl -LO https://senatelab.xyz/SenateLab_1.3.18_aarch64.dmg
open SenateLab_1.3.18_aarch64.dmg
```

Drag to Applications, launch. The first launch creates a local SQLite store at `~/Library/Application Support/SenateLab/senatelab.db`.

## 2. Configure a provider

Open **Settings → Providers**. Pick one:

| Provider        | Base URL                              | Notes                                  |
| --------------- | ------------------------------------- | -------------------------------------- |
| OpenAI-compat   | `https://api.openai.com/v1`           | Works with any compatible server       |
| Ollama (local)  | `http://localhost:11434/v1`           | No API key needed                      |
| Custom          | Your own endpoint                     | Must implement `/chat/completions`     |

Paste your key (stored in the OS keychain). Click **Test connection** — you should see a green checkmark.

## 3. First workspace

SenateLab seeds a `default` workspace on first launch with five agents:

- **Orion** (Manager)
- **Vega** (Backend)
- **Lyra** (Designer)
- **Helios** (Frontend)
- **Draco** (SRE)

Add more via **Agents → New**. Each agent gets a role, a scope (which folders it can read/write), and a provider.

## 4. Say hi

Select `#general` in the sidebar and type a message. Watch the status pill on an agent flip from `idle → running → waiting for you`.

## Where to go next

- [Architecture](architecture.md) — how the pieces fit together.
- [Providers](providers.md) — adapter patterns and retry behavior.
- [Guardrails](guardrails.md) — access control, human-in-the-loop review.
- [API reference](api.md) — IPC surface exposed to the renderer.
