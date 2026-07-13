import { describe, it, expect } from "vitest";
import { runSeed } from "./index";

describe("seed", () => {
  it("runs without error and produces content", () => {
    const { index, libs } = runSeed();
    expect(index.sources.length).toBeGreaterThan(0);
    expect(index.nodes.length).toBeGreaterThan(0);
    expect(index.cards.length).toBeGreaterThan(0);
    expect(Object.keys(libs).length).toBe(index.sources.length);
  });

  it("each source has corresponding lib", () => {
    const { index, libs } = runSeed();
    for (const src of index.sources) {
      expect(libs[src.id]).toBeDefined();
      expect(libs[src.id].sourceId).toBe(src.id);
    }
  });

  it("every card has a valid nodeId", () => {
    const { index } = runSeed();
    const nodeIds = new Set(index.nodes.map((n) => n.id));
    for (const card of index.cards) {
      expect(nodeIds.has(card.nodeId)).toBe(true);
    }
  });

  it("every section has a valid nodeId", () => {
    const { index, libs } = runSeed();
    const nodeIds = new Set(index.nodes.map((n) => n.id));
    for (const lib of Object.values(libs)) {
      for (const sec of lib.sections) {
        expect(nodeIds.has(sec.nodeId)).toBe(true);
      }
    }
  });

  it("every exercise has a valid nodeId", () => {
    const { index, libs } = runSeed();
    const nodeIds = new Set(index.nodes.map((n) => n.id));
    for (const lib of Object.values(libs)) {
      for (const ex of lib.exercises) {
        expect(nodeIds.has(ex.nodeId)).toBe(true);
      }
    }
  });
});
