import { expect, it } from "vitest";
import { FLASK_CURRICULUM } from "./flaskCurriculum";

it("Flask curriculum define 12 capítulos, 48 seções únicas e níveis completos", () => {
  const lessons = FLASK_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(FLASK_CURRICULUM).toHaveLength(12);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(new Set(FLASK_CURRICULUM.map(([, level]) => level))).toEqual(new Set(["basico", "intermediario", "avancado"]));
  expect(FLASK_CURRICULUM.every(([, , primer, chapterLessons]) => primer.length > 60 && chapterLessons.length === 4)).toBe(true);
});
