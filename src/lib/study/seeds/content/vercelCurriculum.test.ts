import { expect, it } from "vitest";
import { VERCEL_CURRICULUM } from "./vercelCurriculum";

it("Vercel curriculum — 12 capítulos e 48 seções únicas", () => {
  expect(VERCEL_CURRICULUM).toHaveLength(12);
  expect(VERCEL_CURRICULUM.every(([, , primer, lessons]) => primer.length >= 80 && lessons.length === 4)).toBe(true);
  const lessons = VERCEL_CURRICULUM.flatMap(([, , , entries]) => entries);
  expect(lessons).toHaveLength(48);
  expect(new Set(lessons.map(([title]) => title)).size).toBe(48);
  expect(lessons.every((entry) => entry.every((value) => value.length >= 20))).toBe(true);
});
