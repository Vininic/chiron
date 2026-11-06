import { describe, expect, it } from "vitest";
import { LABS } from "./catalog";
import { activeMutations, invariantIsBroken, labCompletion, validateLab } from "./engine";

describe("curated labs", () => {
  it("has four validated labs", () => {
    expect(LABS).toHaveLength(4);
    expect(LABS.flatMap(validateLab)).toEqual([]);
  });
  it("only turns an invariant red when an active mutation declares it", () => {
    const layer = LABS[0].layers[1];
    expect(activeMutations(layer, [])).toEqual([]);
    expect(invariantIsBroken("direcao-sem-retorno", activeMutations(layer, ["entrada-direta"]))).toBe(true);
  });
  it("uses unique completed layers for percentage", () => {
    expect(labCompletion(LABS[0], ["estado-unico", "estado-unico"])).toBe(33);
  });
});
