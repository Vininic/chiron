import { describe, it, expect } from "vitest";
import { computeDagLayout, NODE_WIDTH, NODE_HEIGHT } from "./layout";
import type { MapNode } from "@/lib/study/types";

function node(id: string, requires: string[] = []): MapNode {
  return { id, sourceId: "s1", title: id, kind: "concept", requires, mastery: 0 };
}

describe("computeDagLayout", () => {
  it("returns nothing for an empty node list", () => {
    const layout = computeDagLayout([]);
    expect(layout.nodes).toEqual([]);
    expect(layout.layerCount).toBe(0);
  });

  it("puts every node with no prerequisites in layer 0", () => {
    const layout = computeDagLayout([node("a"), node("b"), node("c")]);
    expect(layout.layerCount).toBe(1);
    expect(layout.nodes.every((n) => n.layer === 0)).toBe(true);
  });

  it("layers by longest-path depth from a root, not just direct parent count", () => {
    // a -> b -> c: c depends on b depends on a. c's real depth is 2, not 1.
    const layout = computeDagLayout([node("a"), node("b", ["a"]), node("c", ["b"])]);
    const byId = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));
    expect(byId.a.layer).toBe(0);
    expect(byId.b.layer).toBe(1);
    expect(byId.c.layer).toBe(2);
    expect(layout.layerCount).toBe(3);
  });

  it("takes the LONGEST of multiple paths to the same node (diamond dependency)", () => {
    //   a       a is layer 0
    //  / \      b, c are layer 1 (both depend only on a)
    // b   c     d depends on both b and c -> layer 2, not layer 1
    //  \ /
    //   d
    const layout = computeDagLayout([
      node("a"), node("b", ["a"]), node("c", ["a"]), node("d", ["b", "c"]),
    ]);
    const byId = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));
    expect(byId.d.layer).toBe(2);
  });

  it("never hangs on a cycle — breaks it and still lays out every node", () => {
    const layout = computeDagLayout([node("a", ["b"]), node("b", ["a"])]);
    expect(layout.nodes).toHaveLength(2);
    expect(layout.nodes.every((n) => Number.isFinite(n.layer))).toBe(true);
  });

  it("ignores a requires id pointing outside the given node set, without crashing", () => {
    const layout = computeDagLayout([node("a", ["ghost-id-from-another-source"])]);
    expect(layout.nodes).toHaveLength(1);
    expect(layout.nodes[0].layer).toBe(0);
  });

  it("is deterministic: identical input always produces identical positions", () => {
    const nodes = [node("a"), node("b", ["a"]), node("c", ["a"]), node("d", ["b", "c"])];
    const first = computeDagLayout(nodes);
    const second = computeDagLayout(nodes);
    expect(first).toEqual(second);
  });

  it("orders a layer by the mean position of its prerequisites (barycenter), reducing crossings", () => {
    // Two layer-0 roots in input order [left, right]. Two layer-1 children,
    // fed in the OPPOSITE order from what their parents would suggest —
    // the barycenter pass should still place child-of-left before
    // child-of-right, uncrossing the edges rather than preserving input order.
    const nodes = [
      node("left"), node("right"),
      node("child-of-right", ["right"]),
      node("child-of-left", ["left"]),
    ];
    const layout = computeDagLayout(nodes);
    const byId = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));
    expect(byId.left.order).toBeLessThan(byId.right.order);
    expect(byId["child-of-left"].order).toBeLessThan(byId["child-of-right"].order);
  });

  it("centers each layer so a narrower layer isn't pinned to the left edge", () => {
    // layer 0 has 3 nodes (wide), layer 1 has 1 node (narrow) depending on all three
    const nodes = [node("a"), node("b"), node("c"), node("d", ["a", "b", "c"])];
    const layout = computeDagLayout(nodes);
    const d = layout.nodes.find((n) => n.id === "d")!;
    const layer0Xs = layout.nodes.filter((n) => n.layer === 0).map((n) => n.x);
    const layer0Center = (Math.min(...layer0Xs) + Math.max(...layer0Xs) + NODE_WIDTH) / 2;
    expect(Math.abs(d.x + NODE_WIDTH / 2 - layer0Center)).toBeLessThan(1);
  });

  it("never overlaps two nodes in the same layer", () => {
    const nodes = Array.from({ length: 6 }, (_, i) => node(`n${i}`));
    const layout = computeDagLayout(nodes);
    const xs = layout.nodes.map((n) => n.x).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) {
      expect(xs[i] - xs[i - 1]).toBeGreaterThanOrEqual(NODE_WIDTH);
    }
  });

  it("reports a height proportional to the real layer count", () => {
    const layout = computeDagLayout([node("a"), node("b", ["a"]), node("c", ["b"])]);
    expect(layout.height).toBeGreaterThan(NODE_HEIGHT * 2);
  });
});
