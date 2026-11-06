import { expect, it } from "vitest";
import { GIT_GITHUB_AUTHORED_PROSE } from "./gitGithubAuthoredProse";
import { GIT_GITHUB_CURRICULUM } from "./gitGithubCurriculum";
import { GIT_GITHUB_EXAMPLES } from "./gitGithubExamples";

const wordCount = (parts: string[]) => parts.join(" ").trim().split(/\s+/u).filter(Boolean).length;

it("Git / GitHub draft — capítulos completos têm seções autorais ≥600 palavras e dois exemplos", () => {
  const authored = Object.keys(GIT_GITHUB_AUTHORED_PROSE);
  const expected = GIT_GITHUB_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title)).slice(0, authored.length);
  expect(authored).toEqual(expected);
  expect(authored.length % 4).toBe(0);
  expect(Object.keys(GIT_GITHUB_EXAMPLES)).toEqual(authored);
  expect(authored.map((title) => ({ title, words: wordCount(GIT_GITHUB_AUTHORED_PROSE[title]) })).filter(({ words }) => words < 600)).toEqual([]);
  expect(Object.values(GIT_GITHUB_EXAMPLES).every((examples) => examples.length === 2 && examples.every((example) => example.code.length > 120))).toBe(true);
});
