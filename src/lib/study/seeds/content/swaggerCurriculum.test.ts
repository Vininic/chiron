import { expect, it } from "vitest";
import { SWAGGER_CURRICULUM } from "./swaggerCurriculum";

it("Swagger possui 14 capítulos, 56 seções únicas e escada básica a avançada", () => {
  expect(SWAGGER_CURRICULUM).toHaveLength(14);
  expect(SWAGGER_CURRICULUM.map(([, level]) => level)).toEqual([
    "basico", "basico", "basico", "basico",
    "intermediario", "intermediario", "intermediario", "intermediario", "intermediario",
    "avancado", "avancado", "avancado", "avancado", "avancado",
  ]);
  const titles = SWAGGER_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  expect(titles).toHaveLength(56);
  expect(new Set(titles).size).toBe(56);
  expect(SWAGGER_CURRICULUM.every(([, , primer, lessons]) => primer.length > 80 && lessons.length === 4)).toBe(true);
  expect(SWAGGER_CURRICULUM.flatMap(([, , , lessons]) => lessons).every(([title, ...substance]) => title.length >= 8 && substance.every((part) => part.length > 30))).toBe(true);
});
