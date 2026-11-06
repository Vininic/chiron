import { describe, it, expect } from "vitest";
import { applyContentSource } from "./materialize";
import { freshIndex } from "@/lib/study/migrate";
import { prose } from "./types";
import type { ContentSource } from "./types";

function minimalSource(chapterCount: number): ContentSource {
  return {
    name: "Test Stack",
    kind: "stack",
    language: "TypeScript",
    chapters: Array.from({ length: chapterCount }, (_, i) => ({
      title: `Chapter ${i + 1}`,
      level: "basico" as const,
      nodeTitle: `Chapter ${i + 1}`,
      nodeKind: "concept" as const,
      sections: [{ title: "S1", order: 1, blocks: [prose(["placeholder"])] }],
    })),
    exercises: [],
    cards: [],
  };
}

describe("applyContentSource", () => {
  it("chains each chapter's node to require the previous chapter's node", () => {
    const { index } = applyContentSource(freshIndex(), minimalSource(4));
    const byTitle = Object.fromEntries(index.nodes.map((n) => [n.title, n]));

    expect(byTitle["Chapter 1"].requires).toEqual([]);
    expect(byTitle["Chapter 2"].requires).toEqual([byTitle["Chapter 1"].id]);
    expect(byTitle["Chapter 3"].requires).toEqual([byTitle["Chapter 2"].id]);
    expect(byTitle["Chapter 4"].requires).toEqual([byTitle["Chapter 3"].id]);
  });

  it("produces a single unconnected root when there is only one chapter", () => {
    const { index } = applyContentSource(freshIndex(), minimalSource(1));
    expect(index.nodes).toHaveLength(1);
    expect(index.nodes[0].requires).toEqual([]);
  });

  it("does not duplicate a node when two chapters share the same nodeTitle", () => {
    const source = minimalSource(2);
    source.chapters[1].nodeTitle = source.chapters[0].nodeTitle;
    const { index } = applyContentSource(freshIndex(), source);
    expect(index.nodes).toHaveLength(1);
  });
});
