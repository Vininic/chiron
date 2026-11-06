import { describe, expect, it } from "vitest";
import { computeRetention, formatInterval, gradeForButton, predictIntervalDays, REVIEW_BUTTONS } from "./review";
import { computeSM2 } from "./srs";
import type { Card } from "./types";

const freshCard: Pick<Card, "ease" | "intervalDays" | "reps" | "lapses"> = {
  ease: 2.5,
  intervalDays: 0,
  reps: 0,
  lapses: 0,
};

describe("gradeForButton", () => {
  it("maps each button to a distinct SM2 grade", () => {
    const grades = REVIEW_BUTTONS.map(gradeForButton);
    expect(new Set(grades).size).toBe(4);
  });

  it("again maps to a failing grade (<3) and the rest to passing grades", () => {
    expect(gradeForButton("again")).toBeLessThan(3);
    expect(gradeForButton("hard")).toBeGreaterThanOrEqual(3);
    expect(gradeForButton("good")).toBeGreaterThanOrEqual(3);
    expect(gradeForButton("easy")).toBeGreaterThanOrEqual(3);
  });
});

describe("predictIntervalDays", () => {
  it("matches computeSM2 exactly for every button on a fresh card", () => {
    const today = "2026-08-13";
    for (const button of REVIEW_BUTTONS) {
      const expected = computeSM2(freshCard.ease, freshCard.intervalDays, freshCard.reps, freshCard.lapses, gradeForButton(button), today).intervalDays;
      expect(predictIntervalDays(freshCard, button, today)).toBe(expected);
    }
  });

  it("orders predictions monotonically: again <= hard <= good <= easy", () => {
    const today = "2026-08-13";
    const matureCard = { ease: 2.5, intervalDays: 30, reps: 4, lapses: 0 };
    const [again, hard, good, easy] = REVIEW_BUTTONS.map((b) => predictIntervalDays(matureCard, b, today));
    expect(again).toBeLessThanOrEqual(hard);
    expect(hard).toBeLessThanOrEqual(good);
    expect(good).toBeLessThanOrEqual(easy);
  });
});

describe("formatInterval", () => {
  it("formats sub-day intervals", () => {
    expect(formatInterval(0)).toBe("<1d");
  });
  it("formats day-scale intervals", () => {
    expect(formatInterval(1)).toBe("1d");
    expect(formatInterval(29)).toBe("29d");
  });
  it("formats month-scale intervals", () => {
    expect(formatInterval(60)).toBe("2m");
  });
  it("formats year-scale intervals", () => {
    expect(formatInterval(400)).toBe("1.1a");
  });
});

describe("computeRetention", () => {
  it("returns 0 for an empty session", () => {
    expect(computeRetention([])).toBe(0);
  });
  it("counts grades >=3 as passing", () => {
    expect(computeRetention([0, 1, 2, 3, 4, 5])).toBeCloseTo(0.5);
  });
  it("is 1 when every grade passes", () => {
    expect(computeRetention([3, 4, 5])).toBe(1);
  });
});
