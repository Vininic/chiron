import { expect, it } from "vitest";
import { VUE_CURRICULUM } from "./vueCurriculum";

it("Vue.js curriculum — 12 capítulos e 48 seções únicas", () => {
  const lessons = VUE_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(VUE_CURRICULUM).toHaveLength(12);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(VUE_CURRICULUM.every(([, , , chapterLessons]) => chapterLessons.length === 4)).toBe(true);
});
