import type { ContentSource } from "./types";
import { SQLSERVER_CARDS, SQLSERVER_EXERCISES } from "./sqlserverAssessments";
import { SQLSERVER_CURRICULUM } from "./sqlserverCurriculum";
import { sqlServerChapter } from "./sqlserverSupport";

const chapters = SQLSERVER_CURRICULUM.map(sqlServerChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({
  kind: "labref",
  labId: "agora",
  layerId: "sqlserver-ledger-query-store-recovery-gate",
});

export const SQLSERVER_CONTENT: ContentSource = {
  name: "Microsoft SQL Server",
  kind: "stack",
  language: "SQL",
  chapters,
  exercises: SQLSERVER_EXERCISES,
  cards: SQLSERVER_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-09-09",
  },
};
