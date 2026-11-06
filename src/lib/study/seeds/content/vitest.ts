import type { ContentSource } from "./types";
import { VITEST_BOOK } from "./vitestBook";

export const VITEST_CONTENT: ContentSource = {
  name: "Vitest",
  kind: "tool",
  language: "TypeScript",
  chapters: VITEST_BOOK.map((c) => c.chapter),
  exercises: VITEST_BOOK.flatMap((c) => c.exercises),
  cards: VITEST_BOOK.flatMap((c) => c.cards),
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-10-25",
  },
};
