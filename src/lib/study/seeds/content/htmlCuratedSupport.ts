import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { HTML_SECTION_DEEPENING, HTML_SECTION_FINAL_NOTES } from "./htmlSectionDeepening";

export interface CuratedHtmlSection {
  title: string;
  prose: string[];
  audit?: string;
  closing?: string;
  codeA: string[];
  captionA: string;
  codeB: string[];
  captionB: string;
  why: string;
  breaks: string;
  labref?: { labId: string; layerId: string };
}

export function curatedHtmlChapter(title: string, level: ContentChapter["level"], sections: CuratedHtmlSection[]): ContentChapter {
  return {
    title,
    level,
    nodeTitle: title,
    nodeKind: "concept",
    sections: sections.map((section, index): ContentSection => ({
      title: section.title,
      order: index + 1,
      blocks: [
        prose([
          ...section.prose,
          ...(section.audit ? [section.audit] : []),
          ...(section.closing ? [section.closing] : []),
          ...(HTML_SECTION_DEEPENING[section.title] ? [HTML_SECTION_DEEPENING[section.title]] : []),
          ...(HTML_SECTION_FINAL_NOTES[section.title] ? [HTML_SECTION_FINAL_NOTES[section.title]] : []),
        ]),
        code("html", section.codeA, section.captionA),
        code("html", section.codeB, section.captionB),
        porque([section.why]),
        quebraria([section.breaks]),
        ...(section.labref ? [{ kind: "labref" as const, ...section.labref }] : []),
      ],
    })),
  };
}
