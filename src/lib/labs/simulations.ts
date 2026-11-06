import { cellKey, type Cell } from "./grid";

export type Direction = "up" | "down" | "left" | "right";
export interface SnakeState { body: Cell[]; food: Cell; direction: Direction; queued?: Direction; width: number; height: number; }
const STEP: Record<Direction, Cell> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };

export function queueDirection(state: SnakeState, direction: Direction): SnakeState {
  return direction === OPPOSITE[state.direction] ? state : { ...state, queued: direction };
}

export function tickSnake(state: SnakeState): SnakeState {
  const direction = state.queued ?? state.direction;
  const delta = STEP[direction];
  const head = state.body[0];
  const next = { x: (head.x + delta.x + state.width) % state.width, y: (head.y + delta.y + state.height) % state.height };
  const ate = cellKey(next) === cellKey(state.food);
  return { ...state, direction, queued: undefined, body: ate ? [next, ...state.body] : [next, ...state.body.slice(0, -1)] };
}

export function snakeInvariants(state: SnakeState): Record<string, boolean> {
  const ids = state.body.map(cellKey);
  return {
    "corpo-sem-duplicatas": new Set(ids).size === ids.length,
    "direcao-sem-retorno": !state.queued || state.queued !== OPPOSITE[state.direction],
    "corpo-dentro-da-grade": state.body.every((cell) => cell.x >= 0 && cell.y >= 0 && cell.x < state.width && cell.y < state.height),
  };
}

export interface Product { id: string; name: string; cents: number; stock: number; reserved: number; }
export interface CartItem { productId: string; centsAtReservation: number; quantity: number; }
export interface MarketState { products: Product[]; carts: Record<string, CartItem[]>; }

export function reserve(state: MarketState, buyer: string, productId: string): MarketState {
  const product = state.products.find((item) => item.id === productId);
  if (!product || product.stock - product.reserved < 1) return state;
  return {
    products: state.products.map((item) => item.id === productId ? { ...item, reserved: item.reserved + 1 } : item),
    carts: { ...state.carts, [buyer]: [...(state.carts[buyer] ?? []), { productId, centsAtReservation: product.cents, quantity: 1 }] },
  };
}

export function marketInvariants(state: MarketState): Record<string, boolean> {
  const reservedByProducts = new Map<string, number>();
  for (const cart of Object.values(state.carts)) for (const item of cart) reservedByProducts.set(item.productId, (reservedByProducts.get(item.productId) ?? 0) + item.quantity);
  return {
    "estoque-nao-negativo": state.products.every((product) => product.stock - product.reserved >= 0),
    "reserva-conciliada": state.products.every((product) => product.reserved === (reservedByProducts.get(product.id) ?? 0)),
    "preco-congelado-em-centavos": Object.values(state.carts).flat().every((item) => Number.isInteger(item.centsAtReservation) && item.centsAtReservation > 0),
  };
}

export function cartTotal(cart: CartItem[]): number { return cart.reduce((total, item) => total + item.centsAtReservation * item.quantity, 0); }

