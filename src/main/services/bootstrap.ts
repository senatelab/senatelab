import { getDb } from "../db.js";
import { log } from "../log.js";
import { randomUUID } from "node:crypto";

// Seed agents — chosen fresh, not derived from any upstream project.
const SEED_AGENTS = [
  { name: "Orion",  role: "Manager",   color: "#6366f1" },
  { name: "Vega",   role: "Backend",   color: "#06b6d4" },
  { name: "Lyra",   role: "Designer",  color: "#8b5cf6" },
  { name: "Helios", role: "Frontend",  color: "#22c55e" },
  { name: "Draco",  role: "SRE",       color: "#f59e0b" },
];

export async function bootstrap(): Promise<void> {
  const db = getDb();
  const count = db.prepare("SELECT COUNT(*) AS n FROM workspaces").get() as { n: number };
  if (count.n > 0) {
    log.info("bootstrap.skip", { reason: "existing workspace" });
    return;
  }

  const now = Date.now();
  const workspaceId = randomUUID();
  const defaultProvider = {
    kind: "openai-compat",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    maxTokens: 4096,
    temperature: 0.3,
  };

  const tx = db.transaction(() => {
    db.prepare(
      "INSERT INTO workspaces (id,name,path,created_at) VALUES (?,?,?,?)",
    ).run(workspaceId, "default", process.cwd(), now);

    const agentStmt = db.prepare(
      "INSERT INTO agents (id,name,role,avatar_color,status,workspace_id,provider_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
    );
    for (const a of SEED_AGENTS) {
      agentStmt.run(
        randomUUID(),
        a.name,
        a.role,
        a.color,
        "idle",
        workspaceId,
        JSON.stringify(defaultProvider),
        now,
        now,
      );
    }

    db.prepare(
      "INSERT INTO channels (id,workspace_id,name,kind,members_json) VALUES (?,?,?,?,?)",
    ).run(randomUUID(), workspaceId, "general", "channel", "[]");
  });
  tx();
  log.info("bootstrap.seeded", { workspaceId, agents: SEED_AGENTS.length });
}
