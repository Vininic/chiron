import { describe, expect, it } from "vitest";
import { bfs, pathIsValid } from "./grid";
import { cartTotal, marketInvariants, queueDirection, reserve, snakeInvariants, tickSnake } from "./simulations";

describe("shared grid", () => {
  it("finds a shortest valid route around walls", () => {
    const result = bfs({ x: 0, y: 0 }, { x: 2, y: 0 }, 3, 3, [{ x: 1, y: 0 }]);
    expect(result.reachable).toBe(true);
    expect(result.path).toHaveLength(5);
    expect(pathIsValid(result.path, 3, 3, [{ x: 1, y: 0 }])).toBe(true);
  });
  it("reports an unreachable goal", () => expect(bfs({ x: 0, y: 0 }, { x: 1, y: 1 }, 2, 2, [{ x: 1, y: 0 }, { x: 0, y: 1 }]).reachable).toBe(false));
});

describe("lab simulations", () => {
  it("queues a valid snake turn and applies it once", () => {
    const initial = { body: [{ x: 1, y: 1 }], food: { x: 4, y: 4 }, direction: "right" as const, width: 5, height: 5 };
    expect(tickSnake(queueDirection(initial, "down")).body[0]).toEqual({ x: 1, y: 2 });
    expect(queueDirection(initial, "left")).toBe(initial);
    expect(snakeInvariants(initial)["corpo-sem-duplicatas"]).toBe(true);
  });
  it("reserves the final unit for exactly one buyer and stores cents", () => {
    const initial = { products: [{ id: "olive", name: "Azeite", cents: 1299, stock: 1, reserved: 0 }], carts: {} };
    const a = reserve(initial, "A", "olive");
    const b = reserve(a, "B", "olive");
    expect(b).toBe(a);
    expect(marketInvariants(a)).toEqual({ "estoque-nao-negativo": true, "reserva-conciliada": true, "preco-congelado-em-centavos": true });
    expect(cartTotal(a.carts.A)).toBe(1299);
  });
});
