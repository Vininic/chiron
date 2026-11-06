import { expect, it } from "vitest";
import { JAVA_CURRICULUM } from "./javaCurriculum";

it("Java — currículo possui 12 capítulos, 48 seções únicas e escada completa", () => {
  expect(JAVA_CURRICULUM).toHaveLength(12);
  expect(JAVA_CURRICULUM.every(([, , , lessons]) => lessons.length === 4)).toBe(true);
  const titles = JAVA_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  expect(titles).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(new Set(JAVA_CURRICULUM.map(([, level]) => level))).toEqual(new Set(["basico", "intermediario", "avancado"]));
});
