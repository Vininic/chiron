import type { ContentSource } from "./types";
import { SUPABASE_CARDS, SUPABASE_EXERCISES } from "./supabaseAssessments";
import { SUPABASE_CURRICULUM } from "./supabaseCurriculum";
import { supabaseChapter } from "./supabaseSupport";

const chapters = SUPABASE_CURRICULUM.map(supabaseChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "supabase-rls-storage-realtime-recovery-gate" });

export const SUPABASE_CONTENT: ContentSource = {
  name: "Supabase", kind: "tool", language: "TypeScript", chapters,
  exercises: SUPABASE_EXERCISES, cards: SUPABASE_CARDS,
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-09-11" },
};
