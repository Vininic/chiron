import type { ContentSource } from "./types";
import { TAILWIND_BOOK } from "./tailwindBook";

export const TAILWIND_CSS_CONTENT: ContentSource = {
  name: "Tailwind CSS",
  kind: "stack",
  language: "CSS",
  chapters: TAILWIND_BOOK.map((c) => c.chapter),
  exercises: TAILWIND_BOOK.flatMap((c) => c.exercises),
  cards: TAILWIND_BOOK.flatMap((c) => c.cards),
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-10-23",
  },
};
