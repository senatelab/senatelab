# Security Policy

## Supported versions

| Version  | Supported |
| -------- | --------- |
| 1.3.x    | ✅        |
| 1.2.x    | ❌        |
| < 1.2    | ❌        |

## Reporting a vulnerability

Do **not** open a public issue for security problems. Email `security@senatelab.xyz` with:

- A description of the issue.
- Steps to reproduce (minimal test case preferred).
- Affected versions and OS.
- Any proof-of-concept or logs you can share.

You should get an acknowledgement within 3 business days. We aim to ship a fix within 14 days for high-severity issues and will credit reporters in the release notes unless you prefer anonymity.

## Scope

In scope: the SenateLab desktop app, its IPC surface, its storage layer, and the update channel.

Out of scope: upstream provider services (OpenAI, Ollama, etc.) — report those to the respective vendors.

## Threat model notes

- Agents run in the main Electron process, isolated from the renderer via `contextIsolation: true` and a narrow `contextBridge` surface.
- The SQLite store lives in the OS-standard user-data directory and is not synced by default.
- API keys are stored in OS keychain when available, falling back to an encrypted local blob.

Security-relevant changes are called out in the `CHANGELOG.md` under a dedicated **Security** subsection.
