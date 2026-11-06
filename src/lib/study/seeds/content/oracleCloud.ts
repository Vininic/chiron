import type { ContentSource } from "./types";
import { ORACLE_CLOUD_CARDS, ORACLE_CLOUD_EXERCISES } from "./oracleCloudAssessments";
import { ORACLE_CLOUD_CURRICULUM } from "./oracleCloudCurriculum";
import { oracleCloudChapter } from "./oracleCloudSupport";
const chapters = ORACLE_CLOUD_CURRICULUM.map(oracleCloudChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });
/** Oracle Cloud completo; tenancy, IAM, data plane, providers, DNS e edge reais permanecem Pending sem sandbox isolado. */
export const ORACLE_CLOUD_CONTENT: ContentSource = { name: "Oracle Cloud", kind: "stack", language: "Oracle Cloud / JavaScript / JSON", chapters, exercises: ORACLE_CLOUD_EXERCISES, cards: ORACLE_CLOUD_CARDS, editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-09-30" } };

