import { describe, expect, it } from "vitest";
import { heuristicDigest } from "./insight";
import { freshIndex } from "@/lib/study/migrate";

describe("Aetheris digest fallback", () => {
  it("is never empty without an AI provider", () => expect(heuristicDigest(freshIndex())).toHaveLength(1));
});
