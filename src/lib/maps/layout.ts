// Pure, deterministic DAG layout for the F5 map canvas — a small Sugiyama-
// style layered layout: layer = longest-path depth from a root (so
// prerequisite depth doubles as the visual "level" the plan wants), then a
// barycenter pass orders each layer to reduce edge crossings. No rendering
// concerns here — Maps.tsx turns this into SVG.
import type { MapNode } from "@/lib/study/types";

export interface LayoutNode {
  id: string;
  layer: number;
  order: number;
  x: number;
  y: number;
}

export interface DagLayout {
  nodes: LayoutNode[];
  width: number;
  height: number;
  layerCount: number;
}

export const NODE_WIDTH = 168;
export const NODE_HEIGHT = 56;
const NODE_GAP_X = 32;
const LAYER_GAP_Y = 96;

/** Longest-path depth from any root (a node with no in-set prerequisite).
 *  Guards against a cycle (shouldn't exist in real data, but a corrupt or
 *  hand-edited `requires` list could form one) by tracking the recursion
 *  stack and treating a back-edge as "no further prerequisite" rather than
 *  recursing forever. */
function computeLayers(nodes: MapNode[]): Map<string, number> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const layer = new Map<string, number>();
  const visiting = new Set<string>();

  function depthOf(id: string): number {
    const cached = layer.get(id);
    if (cached !== undefined) return cached;
    const node = byId.get(id);
    if (!node) return 0;
    if (visiting.has(id)) return 0; // cycle guard — break here, don't recurse forever
    visiting.add(id);

    const validPrereqs = node.requires.filter((r) => byId.has(r) && r !== id);
    const depth = validPrereqs.length === 0
      ? 0
      : 1 + Math.max(...validPrereqs.map((r) => depthOf(r)));

    visiting.delete(id);
    layer.set(id, depth);
    return depth;
  }

  for (const n of nodes) depthOf(n.id);
  return layer;
}

/** One barycenter pass: each layer (after the first) is ordered by the mean
 *  order-index of its direct prerequisites, which are guaranteed to already
 *  be placed (every prerequisite sits in a strictly earlier layer). Ties
 *  break on the node's original input position, so the layout is stable and
 *  reproducible for identical input — a requirement for it to be testable
 *  as "same input, same map" at all. */
export function computeDagLayout(nodes: MapNode[]): DagLayout {
  if (nodes.length === 0) return { nodes: [], width: 0, height: 0, layerCount: 0 };

  const inputOrder = new Map(nodes.map((n, i) => [n.id, i]));
  const layerOf = computeLayers(nodes);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const layerCount = Math.max(...Array.from(layerOf.values())) + 1;
  const layers: MapNode[][] = Array.from({ length: layerCount }, () => []);
  for (const n of nodes) layers[layerOf.get(n.id) ?? 0].push(n);

  const orderOf = new Map<string, number>();

  layers[0]
    .sort((a, b) => (inputOrder.get(a.id) ?? 0) - (inputOrder.get(b.id) ?? 0))
    .forEach((n, i) => orderOf.set(n.id, i));

  for (let l = 1; l < layers.length; l++) {
    const withBarycenter = layers[l].map((n) => {
      const prereqs = n.requires.filter((r) => byId.has(r));
      const mean = prereqs.length === 0
        ? Infinity // no real prerequisite placed it here (shouldn't happen past layer 0, but stay safe)
        : prereqs.reduce((sum, r) => sum + (orderOf.get(r) ?? 0), 0) / prereqs.length;
      return { node: n, mean, fallback: inputOrder.get(n.id) ?? 0 };
    });
    withBarycenter.sort((a, b) => (a.mean - b.mean) || (a.fallback - b.fallback));
    withBarycenter.forEach(({ node: n }, i) => orderOf.set(n.id, i));
    layers[l] = withBarycenter.map((w) => w.node);
  }

  const maxLayerWidth = Math.max(...layers.map((l) => l.length));
  const width = maxLayerWidth * (NODE_WIDTH + NODE_GAP_X) - NODE_GAP_X;

  const positioned: LayoutNode[] = [];
  layers.forEach((layerNodes, l) => {
    const layerWidth = layerNodes.length * (NODE_WIDTH + NODE_GAP_X) - NODE_GAP_X;
    const xOffset = (width - layerWidth) / 2;
    layerNodes.forEach((n, i) => {
      positioned.push({
        id: n.id,
        layer: l,
        order: i,
        x: xOffset + i * (NODE_WIDTH + NODE_GAP_X),
        y: l * (NODE_HEIGHT + LAYER_GAP_Y),
      });
    });
  });

  return {
    nodes: positioned,
    width,
    height: layerCount * (NODE_HEIGHT + LAYER_GAP_Y) - LAYER_GAP_Y,
    layerCount,
  };
}
