import { beforeAll, describe, expect, it } from "vitest";
import { runSeed } from "./seeds";
import { restore, toPersisted, hydrate, type ChironData } from "./persistence";
import { addCard, addExercise, addSource, reviewCard, updateNodeMastery, updateSection } from "./service";
import { freshLib } from "./migrate";
import { stabilizeIds } from "./stableIds";

let seed: ChironData;
beforeAll(() => { seed = runSeed(); }, 60_000);

function firstBuiltIn(data: ChironData) {
  const source = data.index.sources.find((s) => s.contentOrigin === "built_in")!;
  const lib = data.libs[source.id];
  const node = data.index.nodes.find((n) => n.sourceId === source.id)!;
  const card = data.index.cards.find((c) => c.sourceId === source.id)!;
  return { source, lib, node, card, section: lib.sections[0] };
}

describe("seed ids", () => {
  it("are identical across runs, so persisted progress keeps pointing at the same content", () => {
    const again = runSeed();
    expect(again.index.sources.map((s) => s.id)).toEqual(seed.index.sources.map((s) => s.id));
    expect(again.index.cards.map((c) => c.id)).toEqual(seed.index.cards.map((c) => c.id));
    const id = seed.index.sources[0].id;
    expect(again.libs[id].sections.map((s) => s.id)).toEqual(seed.libs[id].sections.map((s) => s.id));
  });

  it("are unique per entity kind", () => {
    const ids = [
      ...seed.index.sources.map((s) => s.id), ...seed.index.nodes.map((n) => n.id), ...seed.index.cards.map((c) => c.id),
      ...Object.values(seed.libs).flatMap((l) => [...l.chapters.map((c) => c.id), ...l.sections.map((s) => s.id), ...l.exercises.map((e) => e.id)]),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("persisted state", () => {
  it("is a small fraction of the seed — the catalog itself is never stored", () => {
    const stored = JSON.stringify(toPersisted(seed, seed)).length;
    expect(JSON.stringify(seed).length).toBeGreaterThan(5_000_000);
    expect(stored).toBeLessThan(50_000);
  });

  it("round-trips progress over built-in content", () => {
    const { source, lib, node, card, section } = firstBuiltIn(seed);
    let index = updateNodeMastery(seed.index, node.id, 3);
    index = reviewCard(index, card.id, 4);
    const read = updateSection(lib, section.id, { readAt: "2026-10-20" });
    const data: ChironData = { index, libs: { ...seed.libs, [source.id]: read } };

    const back = hydrate(JSON.parse(JSON.stringify(toPersisted(data, seed))), runSeed());
    expect(back.index.nodes.find((n) => n.id === node.id)?.mastery).toBe(3);
    expect(back.index.cards.find((c) => c.id === card.id)?.reps).toBe(1);
    expect(back.libs[source.id].sections.find((s) => s.id === section.id)?.readAt).toBe("2026-10-20");
    expect(back.index.sources).toHaveLength(seed.index.sources.length);
  });

  it("keeps the person's own cards, exercises and sources", () => {
    const { source, lib, node } = firstBuiltIn(seed);
    let index = addCard(seed.index, { sourceId: source.id, nodeId: node.id, frontMd: "Minha pergunta", backMd: "Minha resposta" }).index;
    const withExercise = addExercise(lib, { sourceId: source.id, nodeId: node.id, type: 2, level: "beginner", promptMd: "Por quê?", answerKeyMd: "Porque.", points: 10 }).lib;
    const created = addSource(index, { kind: "stack", name: "Rust (criada no app)", contentOrigin: "ai_generated" });
    index = created.index;
    const data: ChironData = { index, libs: { ...seed.libs, [source.id]: withExercise, [created.id]: freshLib(created.id) } };

    const back = hydrate(toPersisted(data, seed), seed);
    expect(back.index.cards.some((c) => c.frontMd === "Minha pergunta")).toBe(true);
    expect(back.libs[source.id].exercises.some((e) => e.promptMd === "Por quê?")).toBe(true);
    expect(back.index.sources.find((s) => s.id === created.id)?.contentOrigin).toBe("ai_generated");
    expect(back.libs[created.id]).toBeDefined();
  });
});

describe("restore", () => {
  it("converts an old whole-document save with random ids without losing progress", () => {
    // Recreate the pre-fix shape: same content, random ids, everything stored.
    const legacyIds = new Map<string, string>();
    const randomize = (value: unknown): unknown => {
      if (typeof value === "string" && /^[snkcxe]\.[^\s]+$/.test(value)) {
        if (!legacyIds.has(value)) legacyIds.set(value, crypto.randomUUID());
        return legacyIds.get(value);
      }
      if (Array.isArray(value)) return value.map(randomize);
      if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [String(randomize(k)), randomize(v)]));
      return value;
    };
    const { node, card } = firstBuiltIn(seed);
    const progressed: ChironData = { index: reviewCard(updateNodeMastery(seed.index, node.id, 2), card.id, 5), libs: seed.libs };
    const legacy = randomize(progressed) as ChironData;
    expect(legacy.index.nodes.find((n) => n.title === node.title && n.mastery === 2)?.id).not.toBe(node.id);

    const back = restore(legacy, seed);
    expect(back.index.nodes.find((n) => n.id === node.id)?.mastery).toBe(2);
    expect(back.index.cards.find((c) => c.id === card.id)?.reps).toBe(1);
  });

  it("re-keys by meaning, so stabilizing twice changes nothing", () => {
    expect(stabilizeIds(seed)).toEqual(seed);
  });

  it("falls back to the seed for garbage instead of an empty app", () => {
    expect(restore(null, seed).index.sources.length).toBe(seed.index.sources.length);
    expect(restore({ nope: true }, seed).index.sources.length).toBe(seed.index.sources.length);
  });
});
