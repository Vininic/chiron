import { expect, it } from "vitest";
import { FLASK_AUTHORED_PROSE } from "./flaskAuthoredProse";
import { FLASK_CURRICULUM } from "./flaskCurriculum";
import { FLASK_EXAMPLES } from "./flaskExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Flask draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(FLASK_AUTHORED_PROSE);
  const expected = FLASK_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expected);
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(FLASK_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(FLASK_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(FLASK_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
