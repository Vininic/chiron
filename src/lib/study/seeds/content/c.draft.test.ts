import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { prose } from "./types";
import { C_AUTHORED_PROSE } from "./cAuthoredProse";
import { C_CURRICULUM } from "./cCurriculum";
import { C_EXAMPLES } from "./cExamples";

it("C draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos completos", () => {
  const titles = C_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  const authored = Object.keys(C_AUTHORED_PROSE);
  expect(authored).toEqual(titles.slice(0, authored.length));
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(C_EXAMPLES)).toEqual(authored);
  expect(authored.filter((title) => !titles.includes(title))).toEqual([]);
  expect(authored.map((title) => ({ title, words: proseWordCount([prose(C_AUTHORED_PROSE[title])]) }))
    .filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(C_EXAMPLES).every((examples) => examples.length === 2 &&
    examples.every((example) => example.code.includes("int main(")))).toBe(true);
});
