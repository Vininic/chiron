import type { ContentSource } from "./types";
import { HTML_PARSER_CHAPTER } from "./htmlParserChapter";
import { HTML_SEMANTICS_CHAPTER } from "./htmlSemanticsChapter";
import { HTML_LINKS_CHAPTER } from "./htmlLinksChapter";
import { HTML_MEDIA_CHAPTER } from "./htmlMediaChapter";
import { HTML_FORMS_CHAPTER } from "./htmlFormsChapter";
import { HTML_VALIDATION_CHAPTER } from "./htmlValidationChapter";
import { HTML_TABLES_CHAPTER } from "./htmlTablesChapter";
import { HTML_METADATA_CHAPTER } from "./htmlMetadataChapter";
import { HTML_ACCESSIBILITY_CHAPTER } from "./htmlAccessibilityChapter";
import { HTML_SECURITY_CHAPTER } from "./htmlSecurityChapter";
import { HTML_TESTING_CHAPTER } from "./htmlTestingChapter";
import { HTML_PROJECT_CHAPTER } from "./htmlProjectChapter";
import { HTML_CARDS, HTML_EXERCISES } from "./htmlAssessments";

export const HTML_CONTENT: ContentSource = {
  name: "HTML",
  kind: "stack",
  language: "HTML",
  chapters: [
    HTML_PARSER_CHAPTER,
    HTML_SEMANTICS_CHAPTER,
    HTML_LINKS_CHAPTER,
    HTML_MEDIA_CHAPTER,
    HTML_FORMS_CHAPTER,
    HTML_VALIDATION_CHAPTER,
    HTML_TABLES_CHAPTER,
    HTML_METADATA_CHAPTER,
    HTML_ACCESSIBILITY_CHAPTER,
    HTML_SECURITY_CHAPTER,
    HTML_TESTING_CHAPTER,
    HTML_PROJECT_CHAPTER,
  ],
  exercises: HTML_EXERCISES,
  cards: HTML_CARDS,
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-08-30",
  },
};
