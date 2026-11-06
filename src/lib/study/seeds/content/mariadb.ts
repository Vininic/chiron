import type { ContentSource } from "./types";
import { MARIADB_CARDS, MARIADB_EXERCISES } from "./mariadbAssessments";
import { MARIADB_CURRICULUM } from "./mariadbCurriculum";
import { mariadbChapter } from "./mariadbSupport";

const chapters = MARIADB_CURRICULUM.map(mariadbChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({
  kind: "labref",
  labId: "agora",
  layerId: "mariadb-ledger-recovery-gate",
});

export const MARIADB_CONTENT: ContentSource = {
  name: "MariaDB",
  kind: "stack",
  language: "SQL",
  chapters,
  exercises: MARIADB_EXERCISES,
  cards: MARIADB_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-09-09",
  },
};
