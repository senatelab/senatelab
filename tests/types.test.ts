import { describe, it, expect } from "vitest";
import type { Agent, ProviderConfig } from "../src/shared/types.js";

describe("shared types", () => {
  it("Agent carries a ProviderConfig", () => {
    const provider: ProviderConfig = {
      kind: "openai-compat",
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-4o-mini",
    };
    const agent: Agent = {
      id: "a1",
      name: "Orion",
      role: "Manager",
      avatarColor: "#6366f1",
      status: "idle",
      workspaceId: "w1",
      provider,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    expect(agent.provider.kind).toBe("openai-compat");
  });

  it("status is one of the allowed values", () => {
    const allowed = ["idle", "running", "waiting", "error"] as const;
    for (const s of allowed) {
      expect(allowed).toContain(s);
    }
  });
});
