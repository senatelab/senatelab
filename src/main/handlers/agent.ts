import { IpcMain } from "electron";
import { randomUUID } from "node:crypto";
import { getDb } from "../db.js";
import { IPC } from "../../shared/ipc.js";
import type { Agent, ProviderConfig, AgentStatus } from "../../shared/types.js";
import { log } from "../log.js";

interface AgentRow {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  status: AgentStatus;
  workspace_id: string;
  provider_json: string;
  created_at: number;
  updated_at: number;
}

function rowToAgent(r: AgentRow): Agent {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    avatarColor: r.avatar_color,
    status: r.status,
    workspaceId: r.workspace_id,
    provider: JSON.parse(r.provider_json) as ProviderConfig,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function registerAgentHandlers(ipc: IpcMain): void {
  ipc.handle(IPC.agentList, (_e, workspaceId: string): Agent[] => {
    const rows = getDb()
      .prepare("SELECT * FROM agents WHERE workspace_id = ? ORDER BY created_at ASC")
      .all(workspaceId) as AgentRow[];
    return rows.map(rowToAgent);
  });

  ipc.handle(
    IPC.agentCreate,
    (_e, partial: Omit<Agent, "id" | "createdAt" | "updatedAt">): Agent => {
      const id = randomUUID();
      const now = Date.now();
      getDb()
        .prepare(
          "INSERT INTO agents (id,name,role,avatar_color,status,workspace_id,provider_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
        )
        .run(
          id,
          partial.name,
          partial.role,
          partial.avatarColor,
          partial.status,
          partial.workspaceId,
          JSON.stringify(partial.provider),
          now,
          now,
        );
      return { ...partial, id, createdAt: now, updatedAt: now };
    },
  );

  const setStatus = (id: string, status: AgentStatus): void => {
    getDb()
      .prepare("UPDATE agents SET status = ?, updated_at = ? WHERE id = ?")
      .run(status, Date.now(), id);
  };

  ipc.handle(IPC.agentStart, (_e, id: string): void => {
    setStatus(id, "running");
    log.info("agent.start", { id });
  });

  ipc.handle(IPC.agentStop, (_e, id: string): void => {
    setStatus(id, "idle");
    log.info("agent.stop", { id });
  });

  ipc.handle(IPC.agentUpdateProvider, (_e, id: string, provider: ProviderConfig): void => {
    getDb()
      .prepare("UPDATE agents SET provider_json = ?, updated_at = ? WHERE id = ?")
      .run(JSON.stringify(provider), Date.now(), id);
  });
}
