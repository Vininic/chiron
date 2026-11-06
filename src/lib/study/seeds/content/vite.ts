import type { ContentSource } from "./types";
import { VITE_BOOK } from "./viteBook";

export const VITE_CONTENT: ContentSource = {
  name: "Vite",
  kind: "tool",
  language: "JavaScript",
  chapters: VITE_BOOK.map((c) => c.chapter),
  exercises: VITE_BOOK.flatMap((c) => c.exercises),
  cards: VITE_BOOK.flatMap((c) => c.cards),
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-10-25",
  },
};
