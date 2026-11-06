import { expect, it } from "vitest";
import { DOCKER_AUTHORED_PROSE } from "./dockerAuthoredProse";
import { DOCKER_CURRICULUM } from "./dockerCurriculum";
import { DOCKER_EXAMPLES } from "./dockerExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Docker draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(DOCKER_AUTHORED_PROSE);
  const expected = DOCKER_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expected);
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(DOCKER_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(DOCKER_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(DOCKER_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
