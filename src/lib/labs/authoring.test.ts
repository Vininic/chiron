import { describe, expect, it } from "vitest";
import { LABS } from "./catalog";
import { buildLabAuthoringPrompt, parseLabDraft } from "./authoring";

describe("lab authoring", () => {
  it("asks for executable mutation/invariant links", () => expect(buildLabAuthoringPrompt("cache")).toContain("breaks"));
  it("keeps a valid proposal in draft status", () => {
    const result = parseLabDraft(JSON.stringify({ lab: LABS[0] }), "estado");
    expect("draft" in result && result.draft.status).toBe("draft");
  });
  it("rejects a mutation that cannot make a declared invariant fail", () => {
    const bad = structuredClone(LABS[0]);
    bad.layers[0].mutations[0].breaks = ["inexistente"];
    const result = parseLabDraft(JSON.stringify({ lab: bad }), "estado");
    expect("error" in result).toBe(true);
  });
});
