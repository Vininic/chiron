import { describe, expect, it } from "vitest";
import { buildRubricGradingMessages, parseRubricVerdict } from "./rubric";
import type { Exercise } from "./types";

const exercise: Exercise = {
  id: "ex-1",
  sourceId: "src-1",
  nodeId: "node-1",
  type: 2,
  level: "intermediate",
  promptMd: "Por que usar um set aqui?",
  answerKeyMd: "Porque busca é O(1) em vez de O(n).",
  rubricMd: "Menciona complexidade; menciona set vs lista.",
  points: 20,
};

describe("buildRubricGradingMessages", () => {
  it("includes the rubric, model answer, and student answer in the user turn", () => {
    const messages = buildRubricGradingMessages(exercise, "Porque é mais rápido");
    const userMsg = messages.find((m) => m.role === "user")!;
    expect(userMsg.content).toContain(exercise.rubricMd!);
    expect(userMsg.content).toContain(exercise.answerKeyMd);
    expect(userMsg.content).toContain("Porque é mais rápido");
  });

  it("falls back to a generic instruction when rubricMd is absent", () => {
    const messages = buildRubricGradingMessages({ ...exercise, rubricMd: undefined }, "resposta");
    const userMsg = messages.find((m) => m.role === "user")!;
    expect(userMsg.content).toMatch(/resposta-modelo/i);
  });
});

describe("parseRubricVerdict", () => {
  it("parses a well-formed verdict", () => {
    const v = parseRubricVerdict("NOTA: 0.75\nFEEDBACK: Bom uso de complexidade, faltou mencionar o set.");
    expect(v.fraction).toBe(0.75);
    expect(v.feedback).toBe("Bom uso de complexidade, faltou mencionar o set.");
  });

  it("clamps out-of-range scores", () => {
    expect(parseRubricVerdict("NOTA: 1.5\nFEEDBACK: ok").fraction).toBe(1);
    expect(parseRubricVerdict("NOTA: -0.3\nFEEDBACK: ok").fraction).toBe(0);
  });

  it("treats an unparsed reply as a zero score, not a silent pass", () => {
    const v = parseRubricVerdict("Essa resposta está ótima!");
    expect(v.fraction).toBe(0);
    expect(v.feedback).toBe("Essa resposta está ótima!");
  });
});
