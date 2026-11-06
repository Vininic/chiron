import { expect, it } from "vitest";
import { DOCKER_CURRICULUM } from "./dockerCurriculum";

it("Docker curriculum — 12 capítulos e 48 seções únicas", () => {
  const lessons = DOCKER_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(DOCKER_CURRICULUM).toHaveLength(12);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(DOCKER_CURRICULUM.every(([, , , chapterLessons]) => chapterLessons.length === 4)).toBe(true);
});
