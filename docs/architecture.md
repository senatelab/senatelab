# Architecture

SenateLab is an Electron app with three isolation boundaries:

1. **Main process (Node)** — owns the DB, the provider adapters, and the IPC server.
2. **Preload** — exposes a narrow, typed surface via `contextBridge`.
3. **Renderer (React 19)** — runs in a sandboxed `BrowserWindow` with `contextIsolation: true`.

```
┌─────────────────────────────────────────────────────────┐
│  Renderer (React 19, Zustand, sandboxed)                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  window.senatelab → SenateLabAPI (typed)          │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │ contextBridge                 │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │  Preload (src/preload)                            │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │ ipcRenderer.invoke            │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│  Main process (Node)                                    │
│  ┌───────────────┐   ┌─────────────┐   ┌────────────┐   │
│  │  Handlers     │──▶│  SQLite     │   │  Providers │   │
│  │  workspace.ts │   │  better-    │   │  openai    │   │
│  │  agent.ts     │   │  sqlite3    │   │  ollama    │   │
│  │  message.ts   │   │  (WAL)      │   │  custom    │   │
│  └───────┬───────┘   └─────────────┘   └─────┬──────┘   │
│          │                                   │          │
│          ▼                                   ▼          │
│   IPC channel map (src/shared/ipc.ts)   Network egress  │
└─────────────────────────────────────────────────────────┘
```

## Data model

All tables live in one SQLite file. Schema is in `src/main/db.ts`:

- `workspaces(id, name, path, created_at)`
- `agents(id, name, role, avatar_color, status, workspace_id, provider_json, ...)`
- `channels(id, workspace_id, name, kind, members_json)`
- `messages(id, channel_id, sender_id, body, created_at, reply_to_id?)`
- `tasks(id, workspace_id, owner_id, title, body, status, ...)`
- `reports(id, agent_id, body, created_at)`

WAL mode is on for concurrent reads during agent streaming. `foreign_keys` is on, so workspace deletion cascades.

## IPC contract

Channel names are namespaced `resource:verb` and defined once in `src/shared/ipc.ts`. Both sides import the same constants — adding a channel in main without exposing it in preload is a TypeScript error.

## Agent lifecycle

```
  ┌───────┐    start     ┌─────────┐   awaits     ┌─────────┐
  │ idle  │─────────────▶│ running │─────────────▶│ waiting │
  └───▲───┘              └────┬────┘              └────┬────┘
      │                       │                        │
      │  stop / completed     │  error                 │  resume
      └───────────────────────┴────────────────────────┘
                              ▼
                         ┌─────────┐
                         │  error  │
                         └─────────┘
```

Transitions are persisted in `agents.status` — the UI reflects the live row via Zustand.

## Why Electron + SQLite

- **Electron**: single codebase across macOS/Windows/Linux (we ship arm64 mac first, the rest are in the roadmap).
- **SQLite**: zero-ops local storage with ACID guarantees. We don't need a server for a single-user app.
- **No Node in renderer**: reduces the attack surface and makes the UI swappable.
