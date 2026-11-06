/** Chapter/Block-native content authoring — the format PLANO.md §F1→F2
 *  content should be written in going forward, replacing `seeds/data.ts`'s
 *  flat `bodyMd` strings one stack at a time.
 *
 *  The difference from `SeedSource` (data.ts) isn't cosmetic: `bodyMd` is one
 *  opaque string per section, so nothing about it — word count, whether it
 *  has a `porque`/`quebraria`, whether it cites real code — is checkable by
 *  `lib/content/contract.ts` without first parsing it back apart (which is
 *  what `mdToBlocks` does, lossily, for legacy content). Content authored
 *  here builds `Block[]` directly, so what the author writes is exactly what
 *  the contract measures — no bridge, no parsing ambiguity. */
import type {
  Block, ChapterLevel, NodeKind, ExerciseType, ExerciseLevel, SourceKind, ContentOrigin,
} from "@/lib/study/types";

export interface ContentSection {
  title: string;
  blocks: Block[];
  order: number;
}

export interface ContentChapter {
  title: string;
  level: ChapterLevel;
  /** All sections in this chapter attach to this one node — see the module
   *  doc in python.ts for why chapter-granularity nodes are the right choice
   *  for stack apostilas (as opposed to repo apostilas, where a node per
   *  function/file is the point). */
  nodeTitle: string;
  nodeKind: NodeKind;
  sections: ContentSection[];
}

export interface ContentExercise {
  nodeTitle: string;
  type: ExerciseType;
  level: ExerciseLevel;
  promptMd: string;
  choices?: string[];
  answerKeyMd: string;
  /** Criteria the AI grader checks for type-2 answers (Practice's RubricRunner). */
  rubricMd?: string;
  points: number;
}

export interface ContentCard {
  nodeTitle: string;
  frontMd: string;
  backMd: string;
}

export interface ContentSource {
  name: string;
  kind: SourceKind;
  language?: string;
  origin?: ContentOrigin;
  chapters: ContentChapter[];
  exercises: ContentExercise[];
  cards: ContentCard[];
  /** Publication attestations. These are deliberately separate from the
   * structural contract: counts and word minimums cannot prove that prose is
   * independently authored or that snippets were actually verified. */
  editorial?: {
    proseReviewed: true;
    assessmentsReviewed: true;
    examplesVerified: true;
    reviewedAt: string;
  };
}

/** Convenience for writing prose blocks as an array of lines (avoids
 *  backtick-in-template-literal friction the same way data.ts's `body()`
 *  helper does), joined with `\n\n` between "paragraphs" the caller already
 *  separated with blank-string entries. */
export function prose(lines: string[]): Block {
  return { kind: "prose", md: lines.join("\n") };
}

export function code(lang: string, lines: string[], caption?: string): Block {
  return { kind: "code", lang, code: lines.join("\n"), caption };
}

export function porque(lines: string[]): Block {
  return { kind: "porque", md: lines.join("\n") };
}

export function quebraria(lines: string[]): Block {
  return { kind: "quebraria", md: lines.join("\n") };
}
