import { expect, it } from "vitest";
import { POSTMAN_CURRICULUM } from "./postmanCurriculum";

it("Postman curriculum — 12 capítulos e 48 seções únicas", () => {
  const lessons = POSTMAN_CURRICULUM.flatMap(([, , , chapterLessons]) => chapterLessons);
  expect(POSTMAN_CURRICULUM).toHaveLength(12);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(POSTMAN_CURRICULUM.every(([, , primer, chapterLessons]) => primer.length > 80 && chapterLessons.length === 4)).toBe(true);
  expect(lessons.every(([title, thesis, mechanism, incident]) => title.length > 4 && thesis.length > 70 && mechanism.length > 25 && incident.length > 35)).toBe(true);
});
