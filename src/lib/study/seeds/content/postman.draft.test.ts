import { expect, it } from "vitest";
import { POSTMAN_AUTHORED_PROSE } from "./postmanAuthoredProse";
import { POSTMAN_CURRICULUM } from "./postmanCurriculum";
import { POSTMAN_EXAMPLES } from "./postmanExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Postman draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const ordered = POSTMAN_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  const authored = Object.keys(POSTMAN_AUTHORED_PROSE);
  expect(authored).toEqual(ordered.slice(0, authored.length));
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(POSTMAN_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(POSTMAN_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(POSTMAN_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
