import { expect, it } from "vitest";
import { PHP_AUTHORED_PROSE } from "./phpAuthoredProse";
import { PHP_CURRICULUM } from "./phpCurriculum";
import { PHP_EXAMPLES } from "./phpExamples";
const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
it("PHP draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(PHP_AUTHORED_PROSE);
  const expected = PHP_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expected); expect(authored.length % 4).toBe(0); expect(Object.keys(PHP_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(PHP_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(PHP_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
