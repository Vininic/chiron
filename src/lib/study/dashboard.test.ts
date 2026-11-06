import { describe, it, expect } from "vitest";
import {
  computeActivitySeries, computeWeeklyRetention, computeWeakestNodes,
  computeNextInQueue, computeMasteryBySource, computeMasteryDistribution,
  computeUpcomingDue, planSessionBlocks, computeNextChapter,
} from "./dashboard";
import { addChapter } from "./service";
import { freshIndex, freshLib } from "./migrate";
import { addSource, addNode, addCard, addSection } from "./service";
import { today } from "./types";

describe("computeActivitySeries", () => {
  it("buckets session block minutes into theory vs practice, by day", () => {
    const base = freshIndex();
    const withSession = {
      ...base,
      sessions: [{
        id: "s1", date: today(), budgetMin: 60,
        blocks: [
          { kind: "read" as const, refId: "x", estMin: 20, done: true },
          { kind: "exercise" as const, refId: "x", estMin: 15, done: true },
          { kind: "review" as const, refId: "x", estMin: 5, done: true },
        ],
      }],
    };
    const series = computeActivitySeries(withSession, 3);
    expect(series).toHaveLength(3);
    const todayEntry = series[series.length - 1];
    expect(todayEntry.date).toBe(today());
    expect(todayEntry.theoryMin).toBe(20);
    expect(todayEntry.practiceMin).toBe(20);
    expect(series[0].theoryMin).toBe(0);
  });
});

describe("computeWeeklyRetention", () => {
  it("splits reviewLog entries by SM-2's own correct threshold (grade >= 3)", () => {
    const base = freshIndex();
    const withLog = {
      ...base,
      reviewLog: [
        { date: today(), grade: 5 as const, cardId: "c1" },
        { date: today(), grade: 4 as const, cardId: "c2" },
        { date: today(), grade: 1 as const, cardId: "c3" },
      ],
    };
    const weeks = computeWeeklyRetention(withLog, 2);
    const thisWeek = weeks[weeks.length - 1];
    expect(thisWeek.firstTryCorrect).toBe(2);
    expect(thisWeek.lapses).toBe(1);
    expect(thisWeek.recallRate).toBeCloseTo(2 / 3);
  });

  it("reports recallRate 0 for a week with no reviews, not NaN", () => {
    const weeks = computeWeeklyRetention(freshIndex(), 4);
    for (const w of weeks) expect(Number.isNaN(w.recallRate)).toBe(false);
  });
});

describe("computeWeakestNodes", () => {
  it("ranks nodes lowest-mastery-first and excludes already-mastered ones", () => {
    let index = freshIndex();
    const { index: i1, id: srcId } = addSource(index, { kind: "stack", name: "React" });
    index = i1;
    const { index: i2, id: n1 } = addNode(index, { sourceId: srcId, title: "useState", kind: "concept", requires: [] });
    index = i2;
    const { index: i3, id: n2 } = addNode(index, { sourceId: srcId, title: "useEffect", kind: "concept", requires: [] });
    index = i3;
    // n1 stays mastery 0; bump n2 to fully mastered (4) and a third to 4 as well
    const { index: i4, id: n3 } = addNode(index, { sourceId: srcId, title: "useMemo", kind: "concept", requires: [] });
    index = i4;
    index = { ...index, nodes: index.nodes.map((n) => (n.id === n3 ? { ...n, mastery: 4 as const } : n)) };

    const weak = computeWeakestNodes(index, 5);
    expect(weak.map((w) => w.node.id)).toEqual([n1, n2]);
    expect(weak[0].sourceName).toBe("React");
  });
});

describe("computeNextInQueue", () => {
  it("interleaves due reviews and next-unread sections, capped at the limit", () => {
    let index = freshIndex();
    const { index: i1, id: srcId } = addSource(index, { kind: "repo", name: "Chronos" });
    index = i1;
    const { index: i2, id: nodeId } = addNode(index, { sourceId: srcId, title: "n", kind: "concept", requires: [] });
    index = i2;
    const { index: i3 } = addCard(index, { sourceId: srcId, nodeId, frontMd: "Q1", backMd: "A1" });
    index = i3;

    const { lib } = addSection(freshLib(srcId), { sourceId: srcId, chapterId: "c1", nodeId, title: "Section A", blocks: [], order: 1 });

    const queue = computeNextInQueue(index, { [srcId]: lib }, 4);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.some((q) => q.kind === "review")).toBe(true);
    expect(queue.some((q) => q.kind === "section")).toBe(true);
    expect(queue.length).toBeLessThanOrEqual(4);
  });

  it("skips sources whose every section is already read", () => {
    let index = freshIndex();
    const { index: i1, id: srcId } = addSource(index, { kind: "repo", name: "Chronos" });
    index = i1;
    const { index: i2, id: nodeId } = addNode(index, { sourceId: srcId, title: "n", kind: "concept", requires: [] });
    index = i2;

    const { lib: baseLib, id: sectionId } = addSection(freshLib(srcId), { sourceId: srcId, chapterId: "c1", nodeId, title: "Read already", blocks: [], order: 1 });
    const lib = { ...baseLib, sections: baseLib.sections.map((s) => (s.id === sectionId ? { ...s, readAt: today() } : s)) };

    const queue = computeNextInQueue(index, { [srcId]: lib }, 4);
    expect(queue.some((q) => q.kind === "section")).toBe(false);
  });
});

describe("computeMasteryBySource", () => {
  it("computes a real percentage per source, sorted highest first", () => {
    let index = freshIndex();
    const { index: i1, id: srcA } = addSource(index, { kind: "stack", name: "A" });
    index = i1;
    const { index: i2, id: srcB } = addSource(index, { kind: "stack", name: "B" });
    index = i2;
    const { index: i3, id: nodeA } = addNode(index, { sourceId: srcA, title: "a", kind: "concept", requires: [] });
    index = i3;
    index = { ...index, nodes: index.nodes.map((n) => (n.id === nodeA ? { ...n, mastery: 4 as const } : n)) };
    const { index: i4 } = addNode(index, { sourceId: srcB, title: "b", kind: "concept", requires: [] });
    index = i4;

    const result = computeMasteryBySource(index);
    expect(result[0].source.name).toBe("A");
    expect(result[0].pct).toBe(1);
    expect(result[1].pct).toBe(0);
  });

  it("does not divide by zero for a source with no nodes yet", () => {
    const { index } = addSource(freshIndex(), { kind: "repo", name: "Empty" });
    const result = computeMasteryBySource(index);
    expect(result[0].pct).toBe(0);
  });
});

describe("computeNextChapter", () => {
  it("picks the lowest-order chapter that still has an unmastered node", () => {
    let index = freshIndex();
    const { index: i1, id: srcId } = addSource(index, { kind: "stack", name: "React" });
    index = i1;
    const { index: i2, id: n1 } = addNode(index, { sourceId: srcId, title: "n1", kind: "concept", requires: [] });
    index = i2;
    index = { ...index, nodes: index.nodes.map((n) => (n.id === n1 ? { ...n, mastery: 4 as const } : n)) };
    const { index: i3, id: n2 } = addNode(index, { sourceId: srcId, title: "n2", kind: "concept", requires: [] });
    index = i3;

    let lib = freshLib(srcId);
    const { lib: l1, id: sec1 } = addSection(lib, { sourceId: srcId, chapterId: "ch1", nodeId: n1, title: "S1", blocks: [], order: 1 });
    const { lib: l2, id: sec2 } = addSection(l1, { sourceId: srcId, chapterId: "ch2", nodeId: n2, title: "S2", blocks: [], order: 2 });
    lib = l2;
    const { lib: l3, id: ch1Id } = addChapter(lib, { sourceId: srcId, title: "Capítulo 1 (dominado)", level: "basico", order: 1, sectionIds: [sec1] });
    const { lib: l4, id: ch2Id } = addChapter(l3, { sourceId: srcId, title: "Capítulo 2 (pendente)", level: "basico", order: 2, sectionIds: [sec2] });
    lib = l4;

    const next = computeNextChapter(lib, index);
    expect(next?.id).toBe(ch2Id);
  });

  it("returns null when every chapter's nodes are fully mastered", () => {
    let index = freshIndex();
    const { index: i1, id: srcId } = addSource(index, { kind: "stack", name: "S" });
    index = i1;
    const { index: i2, id: nodeId } = addNode(index, { sourceId: srcId, title: "n", kind: "concept", requires: [] });
    index = i2;
    index = { ...index, nodes: index.nodes.map((n) => (n.id === nodeId ? { ...n, mastery: 4 as const } : n)) };

    const { lib: baseLib, id: secId } = addSection(freshLib(srcId), { sourceId: srcId, chapterId: "c1", nodeId, title: "S", blocks: [], order: 1 });
    const { lib } = addChapter(baseLib, { sourceId: srcId, title: "Único", level: "basico", order: 1, sectionIds: [secId] });

    expect(computeNextChapter(lib, index)).toBeNull();
  });
});

describe("computeMasteryDistribution", () => {
  it("counts nodes into 5 mastery buckets", () => {
    let index = freshIndex();
    const { index: i1, id: srcId } = addSource(index, { kind: "stack", name: "S" });
    index = i1;
    const { index: i2 } = addNode(index, { sourceId: srcId, title: "n", kind: "concept", requires: [] });
    index = i2;
    const dist = computeMasteryDistribution(index);
    expect(dist).toHaveLength(5);
    expect(dist[0]).toBe(1);
    expect(dist.reduce((a, b) => a + b, 0)).toBe(1);
  });
});

describe("planSessionBlocks", () => {
  it("never plans more minutes than the budget", () => {
    for (const budget of [25, 60, 90]) {
      for (const due of [0, 5, 50, 500]) {
        const blocks = planSessionBlocks(budget, due);
        const total = blocks.reduce((a, b) => a + b.estMin, 0);
        expect(total).toBeLessThanOrEqual(budget);
      }
    }
  });

  it("caps review time even with a huge backlog, leaving room for read/exercise", () => {
    const blocks = planSessionBlocks(60, 500);
    const review = blocks.find((b) => b.kind === "review");
    expect(review?.estMin).toBeLessThan(60);
    expect(blocks.some((b) => b.kind === "read")).toBe(true);
  });

  it("omits a block kind entirely when it would be zero minutes", () => {
    const blocks = planSessionBlocks(25, 0);
    expect(blocks.every((b) => b.estMin > 0)).toBe(true);
  });
});

describe("computeUpcomingDue", () => {
  it("counts cards due on each of the next N days", () => {
    const { index: i1, id: srcId } = addSource(freshIndex(), { kind: "repo", name: "S" });
    const { index: i2, id: nodeId } = addNode(i1, { sourceId: srcId, title: "n", kind: "concept", requires: [] });
    const { index } = addCard(i2, { sourceId: srcId, nodeId, frontMd: "Q", backMd: "A" });

    const upcoming = computeUpcomingDue(index, 14);
    expect(upcoming).toHaveLength(14);
    expect(upcoming[0]).toBeGreaterThanOrEqual(1); // freshly added cards default to due today
  });
});
