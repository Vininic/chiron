export type Cell = { x: number; y: number };

export function cellKey(cell: Cell): string { return `${cell.x},${cell.y}`; }
export function equalCell(a: Cell, b: Cell): boolean { return a.x === b.x && a.y === b.y; }

export function neighbors(cell: Cell, width: number, height: number): Cell[] {
  return [
    { x: cell.x + 1, y: cell.y }, { x: cell.x - 1, y: cell.y },
    { x: cell.x, y: cell.y + 1 }, { x: cell.x, y: cell.y - 1 },
  ].filter((next) => next.x >= 0 && next.y >= 0 && next.x < width && next.y < height);
}

export interface PathResult { path: Cell[]; visited: Cell[]; reachable: boolean; }

/** Breadth-first search is the shared grid primitive: shortest path on an unweighted board. */
export function bfs(start: Cell, goal: Cell, width: number, height: number, walls: Cell[] = []): PathResult {
  const wallSet = new Set(walls.map(cellKey));
  const queue = [start];
  const parent = new Map<string, Cell | null>([[cellKey(start), null]]);
  const visited: Cell[] = [];
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    visited.push(current);
    if (equalCell(current, goal)) {
      const path: Cell[] = [];
      let step: Cell | null = current;
      while (step) { path.unshift(step); step = parent.get(cellKey(step)) ?? null; }
      return { path, visited, reachable: true };
    }
    for (const next of neighbors(current, width, height)) {
      const key = cellKey(next);
      if (!wallSet.has(key) && !parent.has(key)) { parent.set(key, current); queue.push(next); }
    }
  }
  return { path: [], visited, reachable: false };
}

export function pathIsValid(path: Cell[], width: number, height: number, walls: Cell[] = []): boolean {
  const wallSet = new Set(walls.map(cellKey));
  const seen = new Set<string>();
  return path.every((cell, i) => {
    const valid = cell.x >= 0 && cell.y >= 0 && cell.x < width && cell.y < height && !wallSet.has(cellKey(cell)) && !seen.has(cellKey(cell));
    seen.add(cellKey(cell));
    return valid && (i === 0 || Math.abs(cell.x - path[i - 1].x) + Math.abs(cell.y - path[i - 1].y) === 1);
  });
}

