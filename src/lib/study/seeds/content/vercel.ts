import type { ContentSource } from "./types";
import { VERCEL_CARDS, VERCEL_EXERCISES } from "./vercelAssessments";
import { VERCEL_CURRICULUM } from "./vercelCurriculum";
import { vercelChapter } from "./vercelSupport";

const chapters = VERCEL_CURRICULUM.map(vercelChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo: Vercel CLI, team/project, deployment, edge, DNS, storage e providers reais permanecem Pending. */
export const VERCEL_CONTENT: ContentSource = {
  name: "Vercel", kind: "stack", language: "Vercel / JavaScript / JSON", chapters,
  exercises: VERCEL_EXERCISES, cards: VERCEL_CARDS,
};
