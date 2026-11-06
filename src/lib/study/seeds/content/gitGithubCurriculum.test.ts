import { expect, it } from "vitest";
import { GIT_GITHUB_CURRICULUM } from "./gitGithubCurriculum";

it("Git / GitHub curriculum — 12 capítulos e 48 seções únicas", () => {
  const lessons = GIT_GITHUB_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(GIT_GITHUB_CURRICULUM).toHaveLength(12);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(GIT_GITHUB_CURRICULUM.every(([, , , chapterLessons]) => chapterLessons.length === 4)).toBe(true);
});
