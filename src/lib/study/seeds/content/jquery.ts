import type { ContentSource } from "./types";
import { JQUERY_BOOK } from "./jqueryBook";

export const JQUERY_CONTENT: ContentSource = {
  name: "jQuery",
  kind: "stack",
  language: "JavaScript",
  chapters: JQUERY_BOOK.map((c) => c.chapter),
  exercises: JQUERY_BOOK.flatMap((c) => c.exercises),
  cards: JQUERY_BOOK.flatMap((c) => c.cards),
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-10-26",
  },
};
