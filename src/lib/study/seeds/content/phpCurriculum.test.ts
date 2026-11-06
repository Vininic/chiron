import { expect, it } from "vitest";
import { PHP_CURRICULUM } from "./phpCurriculum";
it("PHP curriculum — 12 capítulos e 48 seções únicas", () => {
  const lessons = PHP_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(PHP_CURRICULUM).toHaveLength(12); expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(PHP_CURRICULUM.every(([, , , chapterLessons]) => chapterLessons.length === 4)).toBe(true);
});
