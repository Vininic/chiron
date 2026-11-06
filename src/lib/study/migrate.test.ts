import { describe, it, expect } from "vitest";
import { migrateIndex, freshIndex } from "./migrate";

describe("migrateIndex", () => {
  it("defaults reviewLog to [] for pre-existing data that predates it, without touching real data", () => {
    const legacy = {
      version: 5,
      schemaVersion: 1,
      sources: [{ id: "s1", kind: "repo", name: "Chronos", addedAt: "2026-01-01", version: 1 }],
      nodes: [],
      cards: [{ id: "c1", sourceId: "s1", nodeId: "n1", frontMd: "Q", backMd: "A", ease: 2.5, intervalDays: 1, dueDate: "2026-01-02", lapses: 0, reps: 1 }],
      attempts: [],
      sessions: [],
      score: { total: 10, streak: 2, lastStudyDate: "2026-01-01" },
      // reviewLog intentionally absent — this is what data looked like before it existed
    };
    const migrated = migrateIndex(legacy);
    expect(migrated.reviewLog).toEqual([]);
    expect(migrated.sources).toHaveLength(1);
    expect(migrated.cards).toHaveLength(1);
    expect(migrated.score.total).toBe(10);
  });

  it("passes through an already-present reviewLog unchanged", () => {
    const withLog = { ...freshIndex(), reviewLog: [{ date: "2026-01-01", grade: 5, cardId: "c1" }] };
    const migrated = migrateIndex(withLog);
    expect(migrated.reviewLog).toHaveLength(1);
  });

  it("still starts fresh for data that doesn't look like an index at all", () => {
    const migrated = migrateIndex({ nonsense: true });
    expect(migrated).toEqual(freshIndex());
  });
});
