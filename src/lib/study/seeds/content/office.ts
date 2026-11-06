import type { ContentSource } from "./types";
import { OFFICE_BOOK } from "./officeBook";

export const OFFICE_CONTENT: ContentSource = {
  name: "Pacote Office",
  kind: "tool",
  language: "Office",
  chapters: OFFICE_BOOK.map((c) => c.chapter),
  exercises: OFFICE_BOOK.flatMap((c) => c.exercises),
  cards: OFFICE_BOOK.flatMap((c) => c.cards),
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-10-31",
  },
};
