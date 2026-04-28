# Guardrails

SenateLab is built on the assumption that you want agents **visible** and **bounded** — not autonomous and opaque. This doc describes the controls.

## Access control

Every agent has an explicit scope:

- **Folders** it can read / write
- **Tools** it can invoke (shell, file-write, HTTP, …)
- **Actions** it can perform inside a tool (e.g. `git push` vs `git status`)

The default scope is read-only on the active workspace folder and no tool access. You opt in per agent.

Permissions are evaluated in the main process before any tool call is dispatched. A renderer never invokes tools directly — the renderer's only role is to display the agent's intent and gather your approval when needed.

## Human-in-the-loop review

Certain classes of actions are always gated:

| Category             | Example                                      | Gate     |
| -------------------- | -------------------------------------------- | -------- |
| Destructive          | `rm -rf`, `git push --force`, DB truncate    | Approve  |
| External payment     | Any HTTPS request to known billing endpoints | Approve  |
| Secret access        | Read from the OS keychain                    | Approve  |
| Network to new host  | First call to a domain the agent hasn't used | Approve  |

When an agent requests a gated action, it transitions to `waiting`. You see the intent in the canvas and approve or deny from the agent's report pane.

## Visible coordination

Agents can message each other through channels, but those messages are persisted and readable. There is no private-side channel. This is by design: if two agents decide something together, you can read exactly how they got there.

## Sandboxing (coming soon)

v1.4 introduces hardware-level isolation via lightweight VMs per agent process. Until then, agents run in the main Electron process under the same OS user. Don't give an agent permission to do something you wouldn't do yourself.

## Audit log

Everything an agent does — every tool call, every LLM request, every approval — is appended to a local audit log. Export it via **Settings → Export audit**.

## Threat boundaries

- **Untrusted content from the web** → treated as data, never passed to `eval`-like sinks.
- **Prompt injection from tools** → tool output is wrapped in a fenced envelope before being forwarded to the model; models are instructed to treat it as untrusted.
- **Secrets in transcripts** → the audit log redacts fields that match configured regex patterns.

We don't claim to solve prompt injection. We do claim to make the attack surface observable.
