/** Node.js — apostila curada e integralmente autoral. */
import type { ContentSource } from "./types";
import { NODEJS_RUNTIME_CHAPTER } from "./nodejsRuntimeChapter";
import { NODEJS_MODULES_CHAPTER } from "./nodejsModulesChapter";
import { NODEJS_FILES_CHAPTER } from "./nodejsFilesChapter";
import { NODEJS_HTTP_CHAPTER } from "./nodejsHttpChapter";
import { NODEJS_EVENT_LOOP_CHAPTER } from "./nodejsEventLoopChapter";
import { NODEJS_STREAMS_CHAPTER } from "./nodejsStreamsChapter";
import { NODEJS_EVENTS_CHAPTER } from "./nodejsEventsChapter";
import { NODEJS_PERSISTENCE_CHAPTER } from "./nodejsPersistenceChapter";
import { NODEJS_SECURITY_CHAPTER } from "./nodejsSecurityChapter";
import { NODEJS_WORKERS_CHAPTER } from "./nodejsWorkersChapter";
import { NODEJS_OBSERVABILITY_CHAPTER } from "./nodejsObservabilityChapter";
import { NODEJS_TESTING_CHAPTER } from "./nodejsTestingChapter";
import { NODEJS_PROJECT_CHAPTER } from "./nodejsProjectChapter";
import { NODEJS_CARDS, NODEJS_EXERCISES } from "./nodejsAssessments";

export const NODEJS_CONTENT: ContentSource = {
  name: "Node.js",
  kind: "stack",
  language: "JavaScript",
  chapters: [
    NODEJS_RUNTIME_CHAPTER,
    NODEJS_MODULES_CHAPTER,
    NODEJS_FILES_CHAPTER,
    NODEJS_HTTP_CHAPTER,
    NODEJS_EVENT_LOOP_CHAPTER,
    NODEJS_STREAMS_CHAPTER,
    NODEJS_EVENTS_CHAPTER,
    NODEJS_PERSISTENCE_CHAPTER,
    NODEJS_SECURITY_CHAPTER,
    NODEJS_WORKERS_CHAPTER,
    NODEJS_OBSERVABILITY_CHAPTER,
    NODEJS_TESTING_CHAPTER,
    NODEJS_PROJECT_CHAPTER,
  ],
  exercises: NODEJS_EXERCISES,
  cards: NODEJS_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-08-28",
  },
};
