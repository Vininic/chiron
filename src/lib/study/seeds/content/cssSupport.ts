import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { CSS_CHAPTER_FOUNDATIONS, CSS_SECTION_DEEPENING, CSS_SECTION_OPERATIONS, CSS_SECTION_ADDITIONS, CSS_SECTION_FINAL } from "./cssAuthoredProse";
import { CSS_INTERMEDIATE_PROSE } from "./cssAuthoredProseIntermediate";
import { CSS_INTERMEDIATE_COMPLETION } from "./cssAuthoredProseCompletion";
import { CSS_ADVANCED_PROSE } from "./cssAuthoredProseAdvanced";
import { CSS_ADVANCED_COMPLETION } from "./cssAuthoredProseAdvancedCompletion";
import { CSS_ADVANCED_FINAL, CSS_FINAL_PROSE, CSS_LAST_MILE, CSS_MICRO_COMPLETION } from "./cssAuthoredProseFinal";

export interface CssLesson {
  title: string;
  mechanism: string;
  model: string;
  decision: string;
  boundary: string;
  failure: string;
  experiment: string;
  codeA: string[];
  codeB: string[];
}

export function cssSection(lesson: CssLesson, order: number, chapterTitle: string): ContentSection {
  return { title: lesson.title, order, blocks: [
    prose([
      CSS_CHAPTER_FOUNDATIONS[chapterTitle] ?? "",
      lesson.mechanism,
      lesson.model,
      lesson.decision,
      lesson.boundary,
      lesson.failure,
      lesson.experiment,
      CSS_SECTION_DEEPENING[lesson.title] ?? "",
      CSS_SECTION_OPERATIONS[lesson.title] ?? "",
      CSS_SECTION_ADDITIONS[lesson.title] ?? "",
      CSS_SECTION_FINAL[lesson.title] ?? "",
      CSS_INTERMEDIATE_PROSE[lesson.title] ?? "",
      CSS_INTERMEDIATE_COMPLETION[lesson.title] ?? "",
      CSS_ADVANCED_PROSE[lesson.title] ?? "",
      CSS_ADVANCED_COMPLETION[lesson.title] ?? "",
      CSS_FINAL_PROSE[lesson.title] ?? "",
      CSS_ADVANCED_FINAL[lesson.title] ?? "",
      CSS_LAST_MILE[lesson.title] ?? "",
      CSS_MICRO_COMPLETION[lesson.title] ?? "",
    ]),
    code("css", lesson.codeA, "CSS executável focado no algoritmo."),
    code("css", lesson.codeB, "Variação responsiva, acessível ou de diagnóstico."),
    porque([`${lesson.decision} A escolha controla precedência, constraints e capacidade de extensão do sistema visual.`]),
    quebraria([`${lesson.failure} O sintoma costuma aparecer apenas com conteúdo, container, preferência ou contexto de empilhamento diferente.`]),
  ] };
}

export function cssChapter(title: string, level: ContentChapter["level"], lessons: CssLesson[]): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map((lesson, index) => cssSection(lesson, index, title)) };
}
