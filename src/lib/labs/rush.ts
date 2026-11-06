export type RushOrientation = "h" | "v";
export interface RushPiece { id: string; x: number; y: number; length: 2 | 3; orientation: RushOrientation; }
export interface RushBoard { size: number; pieces: RushPiece[]; targetId: string; }
export interface RushSolution { moves: RushBoard[]; explored: number; solved: boolean; }

function boardKey(board: RushBoard): string { return board.pieces.map((piece) => `${piece.id}:${piece.x},${piece.y}`).join("|"); }
function cells(piece: RushPiece): string[] { return Array.from({ length: piece.length }, (_, index) => piece.orientation === "h" ? `${piece.x + index},${piece.y}` : `${piece.x},${piece.y + index}`); }
export function rushIsValid(board: RushBoard): boolean {
  const occupied = new Set<string>();
  return board.pieces.every((piece) => piece.x >= 0 && piece.y >= 0 && (piece.orientation === "h" ? piece.x + piece.length <= board.size : piece.y + piece.length <= board.size) && cells(piece).every((cell) => !occupied.has(cell) && (occupied.add(cell), true)));
}
export function rushSolved(board: RushBoard): boolean { const target = board.pieces.find((piece) => piece.id === board.targetId); return !!target && target.orientation === "h" && target.x + target.length === board.size; }
export function rushNextBoards(board: RushBoard): RushBoard[] {
  const result: RushBoard[] = [];
  for (let index = 0; index < board.pieces.length; index += 1) {
    for (const delta of [-1, 1] as const) {
      const piece = board.pieces[index]; const nextPiece = { ...piece, ...(piece.orientation === "h" ? { x: piece.x + delta } : { y: piece.y + delta }) };
      const next = { ...board, pieces: board.pieces.map((item, itemIndex) => itemIndex === index ? nextPiece : item) };
      if (rushIsValid(next)) result.push(next);
    }
  }
  return result;
}
export function solveRush(start: RushBoard, limit = 20_000): RushSolution {
  if (!rushIsValid(start)) return { moves: [], explored: 0, solved: false };
  const queue = [start]; const parents = new Map<string, string | null>([[boardKey(start), null]]); const boards = new Map<string, RushBoard>([[boardKey(start), start]]);
  for (let cursor = 0; cursor < queue.length && queue.length <= limit; cursor += 1) {
    const current = queue[cursor]; const key = boardKey(current);
    if (rushSolved(current)) { const moves: RushBoard[] = []; let cursorKey: string | null = key; while (cursorKey) { moves.unshift(boards.get(cursorKey)!); cursorKey = parents.get(cursorKey) ?? null; } return { moves, explored: queue.length, solved: true }; }
    for (const next of rushNextBoards(current)) { const nextKey = boardKey(next); if (!parents.has(nextKey)) { parents.set(nextKey, key); boards.set(nextKey, next); queue.push(next); } }
  }
  return { moves: [], explored: queue.length, solved: false };
}
/** Reverse walk from a solved board guarantees a generated board has a path back. */
export function reverseGenerate(solved: RushBoard, steps: number, pick: (max: number) => number = (max) => Math.floor(Math.random() * max)): RushBoard {
  let current = solved;
  for (let step = 0; step < steps; step += 1) { const options = rushNextBoards(current); if (!options.length) break; current = options[pick(options.length) % options.length]; }
  return current;
}
export function rushDifficulty(board: RushBoard): { minimumMoves: number; branching: number; blockers: number } {
  const solution = solveRush(board); const target = board.pieces.find((piece) => piece.id === board.targetId); const blockers = target ? board.pieces.filter((piece) => piece.id !== target.id && cells(piece).some((cell) => { const [x, y] = cell.split(",").map(Number); return y === target.y && x > target.x; })).length : 0;
  return { minimumMoves: Math.max(0, solution.moves.length - 1), branching: Number((rushNextBoards(board).length).toFixed(1)), blockers };
}

