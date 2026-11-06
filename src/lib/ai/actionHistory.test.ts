import { describe, expect, it } from "vitest";
import { freshIndex, freshLib } from "@/lib/study/migrate";
import { logHistory, markHistoryUndone } from "./actionHistory";

describe("Aetheris action history", () => {
  it("retains a restorable snapshot and marks an entry undone", () => {
    const index = freshIndex(); const libs = { x: freshLib("x") };
    const entry = logHistory([{ type: "plan_session", note: "25min" }], ["Plano"], index, libs)[0];
    expect(entry.indexBefore).toEqual(index);
    expect(markHistoryUndone([entry], entry.id)[0].undone).toBe(true);
  });
});
