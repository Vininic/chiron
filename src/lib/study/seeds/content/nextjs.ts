import type { ContentSource } from "./types";
import { NEXTJS_ROUTING_CHAPTER } from "./nextjsRoutingChapter";
import { NEXTJS_COMPONENTS_CHAPTER } from "./nextjsComponentsChapter";
import { NEXTJS_CACHE_CHAPTER } from "./nextjsCacheChapter";
import { NEXTJS_ACTIONS_CHAPTER } from "./nextjsActionsChapter";
import { NEXTJS_STREAMING_CHAPTER } from "./nextjsStreamingChapter";
import { NEXTJS_ERRORS_CHAPTER } from "./nextjsErrorsChapter";
import { NEXTJS_AUTH_CHAPTER } from "./nextjsAuthChapter";
import { NEXTJS_HANDLERS_CHAPTER } from "./nextjsHandlersChapter";
import { NEXTJS_METADATA_CHAPTER } from "./nextjsMetadataChapter";
import { NEXTJS_PERFORMANCE_CHAPTER } from "./nextjsPerformanceChapter";
import { NEXTJS_TESTING_CHAPTER } from "./nextjsTestingChapter";
import { NEXTJS_PROJECT_CHAPTER } from "./nextjsProjectChapter";
import { NEXTJS_CARDS, NEXTJS_EXERCISES } from "./nextjsAssessments";

export const NEXTJS_CONTENT: ContentSource = {
  name: "Next.js",
  kind: "stack",
  language: "TypeScript/TSX",
  chapters: [
    NEXTJS_ROUTING_CHAPTER,
    NEXTJS_COMPONENTS_CHAPTER,
    NEXTJS_CACHE_CHAPTER,
    NEXTJS_ACTIONS_CHAPTER,
    NEXTJS_STREAMING_CHAPTER,
    NEXTJS_ERRORS_CHAPTER,
    NEXTJS_AUTH_CHAPTER,
    NEXTJS_HANDLERS_CHAPTER,
    NEXTJS_METADATA_CHAPTER,
    NEXTJS_PERFORMANCE_CHAPTER,
    NEXTJS_TESTING_CHAPTER,
    NEXTJS_PROJECT_CHAPTER,
  ],
  exercises: NEXTJS_EXERCISES,
  cards: NEXTJS_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-08-29",
  },
};
