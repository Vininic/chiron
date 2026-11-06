import { expect, it } from "vitest";
import { VUE_AUTHORED_PROSE } from "./vueAuthoredProse";
import { VUE_CURRICULUM } from "./vueCurriculum";
import { VUE_EXAMPLES } from "./vueExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Vue.js draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(VUE_AUTHORED_PROSE);
  const expected = VUE_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expected);
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(VUE_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(VUE_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(VUE_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
