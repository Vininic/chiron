import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";

export interface CuratedReactSection {
  title: string;
  prose: string[];
  codeA: string[];
  captionA: string;
  codeB: string[];
  captionB: string;
  why: string;
  breaks: string;
  labref?: { labId: string; layerId: string };
}

export function curatedReactChapter(title: string, level: ContentChapter["level"], sections: CuratedReactSection[]): ContentChapter {
  return {
    title,
    level,
    nodeTitle: title,
    nodeKind: "concept",
    sections: sections.map((section, index): ContentSection => ({
      title: section.title,
      order: index + 1,
      blocks: [
        prose(section.prose),
        code("tsx", section.codeA, section.captionA),
        code("tsx", section.codeB, section.captionB),
        porque([section.why]),
        quebraria([section.breaks]),
        ...(section.labref ? [{ kind: "labref" as const, ...section.labref }] : []),
      ],
    })),
  };
}
