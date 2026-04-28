# API reference

The renderer talks to the main process through a narrow typed surface exposed on `window.senatelab`. The full contract lives in `src/shared/ipc.ts`.

## Workspaces

```ts
window.senatelab.workspace.list(): Promise<Workspace[]>
window.senatelab.workspace.create(name: string, path: string): Promise<Workspace>
window.senatelab.workspace.delete(id: string): Promise<void>
```

## Agents

```ts
window.senatelab.agent.list(workspaceId: string): Promise<Agent[]>
window.senatelab.agent.create(partial): Promise<Agent>
window.senatelab.agent.start(id: string): Promise<void>
window.senatelab.agent.stop(id: string): Promise<void>
window.senatelab.agent.updateProvider(id: string, provider: ProviderConfig): Promise<void>
```

## Channels

```ts
window.senatelab.channel.list(workspaceId: string): Promise<Channel[]>
window.senatelab.channel.create(partial): Promise<Channel>
```

## Messages

```ts
window.senatelab.message.list(channelId: string, limit?: number): Promise<Message[]>
window.senatelab.message.send(channelId: string, body: string, senderId: string): Promise<Message>
window.senatelab.message.onStream(cb: (chunk: { channelId; body }) => void): () => void  // returns unsubscribe
```

## Tasks / Reports

```ts
window.senatelab.task.list(workspaceId: string): Promise<Task[]>
window.senatelab.task.upsert(task: Task): Promise<Task>

window.senatelab.report.list(agentId: string): Promise<Report[]>
window.senatelab.report.upsert(report: Report): Promise<Report>
```

## Error handling

Every method returns a Promise. Rejections carry an `Error` whose `message` is the same string the main process logged. The renderer should wrap calls in try/catch and display the error in context — there is no global toast.

## Typing

Import the shared types from the renderer:

```ts
import type { Agent, Workspace, Message } from "@shared/types";
```

The `@shared/*` alias is configured in both `tsconfig.json` and `vite.config.ts`.
