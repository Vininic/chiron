import type { ContentSource } from "./types";
import { OPENCODE_BOOK } from "./opencodeBook";

export const OPENCODE_CONTENT: ContentSource = {
  name: "OpenCode",
  kind: "tool",
  language: "OpenCode",
  chapters: OPENCODE_BOOK.map((c) => c.chapter),
  exercises: OPENCODE_BOOK.flatMap((c) => c.exercises),
  cards: OPENCODE_BOOK.flatMap((c) => c.cards),
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-11-03",
  },
};
