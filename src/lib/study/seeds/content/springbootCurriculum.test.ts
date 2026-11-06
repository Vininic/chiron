import { expect, it } from "vitest";
import { SPRING_BOOT_CURRICULUM } from "./springbootCurriculum";

it("Spring Boot — currículo integral tem 12 capítulos, 48 seções únicas e escada de níveis", () => {
  expect(SPRING_BOOT_CURRICULUM).toHaveLength(12);
  expect(SPRING_BOOT_CURRICULUM.every(([, , , lessons]) => lessons.length === 4)).toBe(true);
  const titles = SPRING_BOOT_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  expect(titles).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(new Set(SPRING_BOOT_CURRICULUM.map(([, level]) => level))).toEqual(new Set(["basico", "intermediario", "avancado"]));
});
