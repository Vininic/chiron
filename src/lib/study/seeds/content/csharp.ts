import type { ContentSource } from "./types";
import { CSHARP_CARDS, CSHARP_EXERCISES } from "./csharpAssessments";
import { CSHARP_CURRICULUM } from "./csharpCurriculum";
import { csharpChapter } from "./csharpSupport";

const chapters = CSHARP_CURRICULUM.map(csharpChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

export const CSHARP_CONTENT: ContentSource = {
  name: "C#",
  kind: "stack",
  language: "C#",
  chapters,
  exercises: CSHARP_EXERCISES,
  cards: CSHARP_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-09-14",
  },
};
