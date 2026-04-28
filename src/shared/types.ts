// Shared domain types. Used by main, preload, and renderer.

export type AgentStatus = "idle" | "running" | "waiting" | "error";

export type ProviderKind = "openai-compat" | "ollama" | "custom";

export interface ProviderConfig {
  kind: ProviderKind;
  baseUrl: string;
  apiKey?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: AgentStatus;
  workspaceId: string;
  provider: ProviderConfig;
  createdAt: number;
  updatedAt: number;
}

export interface Workspace {
  id: string;
  name: string;
  path: string;
  createdAt: number;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  kind: "channel" | "dm" | "group";
  memberIds: string[];
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  body: string;
  createdAt: number;
  replyToId?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  ownerId: string;
  title: string;
  body?: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  createdAt: number;
  updatedAt: number;
}

export interface Report {
  id: string;
  agentId: string;
  body: string;
  createdAt: number;
}
