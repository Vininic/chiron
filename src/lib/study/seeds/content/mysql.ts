import type { ContentSource } from "./types";
import { MYSQL_CARDS, MYSQL_EXERCISES } from "./mysqlAssessments";
import { MYSQL_CHAPTERS } from "./mysqlCurriculum";
import { mysqlChapter } from "./mysqlSupport";

const chapters = MYSQL_CHAPTERS.map(mysqlChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "mysql-checkout-recovery-gate" });
export const MYSQL_CONTENT: ContentSource = { name: "MySQL", kind: "stack", language: "SQL", chapters, exercises: MYSQL_EXERCISES, cards: MYSQL_CARDS, editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-09-08" } };
