import { expect, it } from "vitest";
import { RAILS_CURRICULUM } from "./railsCurriculum";

it("Ruby on Rails curriculum — 12 capítulos e 48 seções únicas", () => {
  const lessons = RAILS_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(RAILS_CURRICULUM).toHaveLength(12);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(RAILS_CURRICULUM.every(([, , , chapterLessons]) => chapterLessons.length === 4)).toBe(true);
});
