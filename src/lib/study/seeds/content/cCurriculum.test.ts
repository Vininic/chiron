import { expect, it } from "vitest";
import { C_CURRICULUM } from "./cCurriculum";

it("C draft — currículo C17/C23 possui 12 capítulos e 48 seções únicas", () => {
  const titles = C_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  expect(C_CURRICULUM).toHaveLength(12);
  expect(titles).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(C_CURRICULUM.every(([, , , lessons]) => lessons.length === 4)).toBe(true);
});
