import { expect, it } from "vitest";
import { CPP_CURRICULUM } from "./cppCurriculum";

it("C++ curriculum — 12 capítulos e 48 seções únicas em escada", () => {
  expect(CPP_CURRICULUM).toHaveLength(12);
  expect(CPP_CURRICULUM.every(([, , , lessons]) => lessons.length === 4)).toBe(true);
  const titles = CPP_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));
  expect(titles).toHaveLength(48);
  expect(new Set(titles).size).toBe(48);
  expect(CPP_CURRICULUM.slice(0, 3).every(([, level]) => level === "basico")).toBe(true);
  expect(CPP_CURRICULUM.slice(3, 7).every(([, level]) => level === "intermediario")).toBe(true);
  expect(CPP_CURRICULUM.slice(7).every(([, level]) => level === "avancado")).toBe(true);
});
