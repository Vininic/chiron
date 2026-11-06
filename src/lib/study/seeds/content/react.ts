import type { ContentSource } from "./types";
import { REACT_RENDERING_CHAPTER } from "./reactRenderingChapter";
import { REACT_STATE_CHAPTER } from "./reactStateChapter";
import { REACT_FORMS_CHAPTER } from "./reactFormsChapter";
import { REACT_EFFECTS_CHAPTER } from "./reactEffectsChapter";
import { REACT_REDUCERS_CHAPTER } from "./reactReducersChapter";
import { REACT_CONTEXT_CHAPTER } from "./reactContextChapter";
import { REACT_HOOKS_CHAPTER } from "./reactHooksChapter";
import { REACT_CONCURRENCY_CHAPTER } from "./reactConcurrencyChapter";
import { REACT_PERFORMANCE_CHAPTER } from "./reactPerformanceChapter";
import { REACT_ACCESSIBILITY_CHAPTER } from "./reactAccessibilityChapter";
import { REACT_TESTING_CHAPTER } from "./reactTestingChapter";
import { REACT_PROJECT_CHAPTER } from "./reactProjectChapter";
import { REACT_CARDS, REACT_EXERCISES } from "./reactAssessments";

export const REACT_CONTENT: ContentSource = {
  name: "React",
  kind: "stack",
  language: "TypeScript/TSX",
  chapters: [
    REACT_RENDERING_CHAPTER,
    REACT_STATE_CHAPTER,
    REACT_FORMS_CHAPTER,
    REACT_EFFECTS_CHAPTER,
    REACT_REDUCERS_CHAPTER,
    REACT_CONTEXT_CHAPTER,
    REACT_HOOKS_CHAPTER,
    REACT_CONCURRENCY_CHAPTER,
    REACT_PERFORMANCE_CHAPTER,
    REACT_ACCESSIBILITY_CHAPTER,
    REACT_TESTING_CHAPTER,
    REACT_PROJECT_CHAPTER,
  ],
  exercises: REACT_EXERCISES,
  cards: REACT_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-08-28",
  },
};
