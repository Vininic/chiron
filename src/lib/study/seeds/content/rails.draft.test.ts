import { expect, it } from "vitest";
import { RAILS_AUTHORED_PROSE } from "./railsAuthoredProse";
import { RAILS_CURRICULUM } from "./railsCurriculum";
import { RAILS_EXAMPLES } from "./railsExamples";

function wordCount(parts: string[]): number {
  return parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

it("Ruby on Rails draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(RAILS_AUTHORED_PROSE);
  const expectedPrefix = RAILS_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expectedPrefix);
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(RAILS_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(RAILS_AUTHORED_PROSE[title]) }))
    .filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(RAILS_EXAMPLES).every((examples) => examples.length === 2 &&
    examples.every((example) => example.code.length > 120))).toBe(true);
});
