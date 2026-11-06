import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { prose } from "./types";
import { RUBY_AUTHORED_PROSE } from "./rubyAuthoredProse";
import { RUBY_CURRICULUM } from "./rubyCurriculum";
import { RUBY_EXAMPLES } from "./rubyExamples";

it("Ruby draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const titles = RUBY_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  const authored = Object.keys(RUBY_AUTHORED_PROSE);
  expect(authored).toEqual(titles.slice(0, authored.length));
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(RUBY_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: proseWordCount([prose(RUBY_AUTHORED_PROSE[title])]) }))
    .filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(RUBY_EXAMPLES).every((examples) => examples.length === 2 &&
    examples.every((example) => example.code.length > 120))).toBe(true);
});
