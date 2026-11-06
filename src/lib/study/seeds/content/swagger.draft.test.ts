import { expect, it } from "vitest";
import { SWAGGER_AUTHORED_PROSE } from "./swaggerAuthoredProse";
import { SWAGGER_CURRICULUM } from "./swaggerCurriculum";
import { SWAGGER_EXAMPLES } from "./swaggerExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Swagger draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(SWAGGER_AUTHORED_PROSE);
  const expected = SWAGGER_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expected);
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(SWAGGER_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(SWAGGER_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(SWAGGER_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
