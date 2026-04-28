import { describe, it, expect } from "vitest";
import { IPC } from "../src/shared/ipc.js";

describe("IPC channel map", () => {
  it("every channel name is namespaced", () => {
    for (const name of Object.values(IPC)) {
      expect(name).toMatch(/^(workspace|agent|channel|message|task|report):/);
    }
  });

  it("channel names are unique", () => {
    const names = Object.values(IPC);
    expect(new Set(names).size).toBe(names.length);
  });
});
