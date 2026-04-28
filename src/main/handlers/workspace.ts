import { IpcMain } from "electron";
import { randomUUID } from "node:crypto";
import { getDb } from "../db.js";
import { IPC } from "../../shared/ipc.js";
import type { Workspace } from "../../shared/types.js";

interface WorkspaceRow {
  id: string;
  name: string;
  path: string;
  created_at: number;
}

function rowToWorkspace(r: WorkspaceRow): Workspace {
  return { id: r.id, name: r.name, path: r.path, createdAt: r.created_at };
}

export function registerWorkspaceHandlers(ipc: IpcMain): void {
  ipc.handle(IPC.workspaceList, (): Workspace[] => {
    const rows = getDb()
      .prepare("SELECT id,name,path,created_at FROM workspaces ORDER BY created_at ASC")
      .all() as WorkspaceRow[];
    return rows.map(rowToWorkspace);
  });

  ipc.handle(IPC.workspaceCreate, (_e, name: string, p: string): Workspace => {
    const id = randomUUID();
    const createdAt = Date.now();
    getDb()
      .prepare("INSERT INTO workspaces (id,name,path,created_at) VALUES (?,?,?,?)")
      .run(id, name, p, createdAt);
    return { id, name, path: p, createdAt };
  });

  ipc.handle(IPC.workspaceDelete, (_e, id: string): void => {
    getDb().prepare("DELETE FROM workspaces WHERE id = ?").run(id);
  });
}
