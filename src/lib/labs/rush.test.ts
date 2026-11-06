import { describe, expect, it } from "vitest";
import { reverseGenerate, rushDifficulty, rushIsValid, solveRush, type RushBoard } from "./rush";

const SOLVED: RushBoard = { size: 4, targetId: "target", pieces: [{ id: "target", x: 2, y: 1, length: 2, orientation: "h" }, { id: "pillar", x: 0, y: 2, length: 2, orientation: "v" }] };
describe("Rush Hour engine", () => {
  it("finds the shortest legal solution", () => { const board = { ...SOLVED, pieces: [{ ...SOLVED.pieces[0], x: 0 }, SOLVED.pieces[1]] }; const result = solveRush(board); expect(result.solved).toBe(true); expect(result.moves).toHaveLength(3); });
  it("reverse generation preserves a solvable board", () => { const generated = reverseGenerate(SOLVED, 4, () => 0); expect(rushIsValid(generated)).toBe(true); expect(solveRush(generated).solved).toBe(true); });
  it("measures solution and branching rather than only counting pieces", () => { const difficulty = rushDifficulty({ ...SOLVED, pieces: [{ ...SOLVED.pieces[0], x: 0 }, SOLVED.pieces[1]] }); expect(difficulty.minimumMoves).toBe(2); expect(difficulty.branching).toBeGreaterThan(0); });
});
