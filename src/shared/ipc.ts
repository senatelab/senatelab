// IPC channel names shared between main and renderer.
// Keep this file in sync with preload/index.ts bindings.

import type {
  Agent,
  Workspace,
  Channel,
  Message,
  Task,
  Report,
  ProviderConfig,
} from "./types";

export const IPC = {
  // Workspace lifecycle
  workspaceList: "workspace:list",
  workspaceCreate: "workspace:create",
  workspaceDelete: "workspace:delete",

  // Agents
  agentList: "agent:list",
  agentCreate: "agent:create",
  agentStart: "agent:start",
  agentStop: "agent:stop",
  agentUpdateProvider: "agent:update-provider",

  // Channels
  channelList: "channel:list",
  channelCreate: "channel:create",

  // Messages
  messageList: "message:list",
  messageSend: "message:send",
  messageStream: "message:stream",

  // Tasks
  taskList: "task:list",
  taskUpsert: "task:upsert",

  // Reports
  reportList: "report:list",
  reportUpsert: "report:upsert",
} as const;

export type IPCChannel = (typeof IPC)[keyof typeof IPC];

// Renderer-facing API surface exposed via contextBridge.
export interface SenateLabAPI {
  workspace: {
    list: () => Promise<Workspace[]>;
    create: (name: string, path: string) => Promise<Workspace>;
    delete: (id: string) => Promise<void>;
  };
  agent: {
    list: (workspaceId: string) => Promise<Agent[]>;
    create: (partial: Omit<Agent, "id" | "createdAt" | "updatedAt">) => Promise<Agent>;
    start: (id: string) => Promise<void>;
    stop: (id: string) => Promise<void>;
    updateProvider: (id: string, provider: ProviderConfig) => Promise<void>;
  };
  channel: {
    list: (workspaceId: string) => Promise<Channel[]>;
    create: (partial: Omit<Channel, "id">) => Promise<Channel>;
  };
  message: {
    list: (channelId: string, limit?: number) => Promise<Message[]>;
    send: (channelId: string, body: string, senderId: string) => Promise<Message>;
    onStream: (cb: (chunk: { channelId: string; body: string }) => void) => () => void;
  };
  task: {
    list: (workspaceId: string) => Promise<Task[]>;
    upsert: (task: Task) => Promise<Task>;
  };
  report: {
    list: (agentId: string) => Promise<Report[]>;
    upsert: (report: Report) => Promise<Report>;
  };
}

declare global {
  interface Window {
    senatelab: SenateLabAPI;
  }
}
