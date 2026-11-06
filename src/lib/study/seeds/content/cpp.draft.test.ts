import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { prose } from "./types";
import { CPP_AUTHORED_PROSE } from "./cppAuthoredProse";
import { CPP_CURRICULUM } from "./cppCurriculum";
import { CPP_EXAMPLES } from "./cppExamples";

it("C++ draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const titles = CPP_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  const authored = Object.keys(CPP_AUTHORED_PROSE);
  expect(authored).toEqual(titles.slice(0, authored.length));
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(CPP_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: proseWordCount([prose(CPP_AUTHORED_PROSE[title])]) }))
    .filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(CPP_EXAMPLES).every((examples) => examples.length === 2 &&
    examples.every((example) => example.code.includes("int main(")))).toBe(true);
});
