import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";

export interface CuratedNodeSection {
  title: string;
  prose: string[];
  supplement?: string[];
  codeA: string[];
  captionA: string;
  codeB: string[];
  captionB: string;
  why: string;
  breaks: string;
  labref?: { labId: string; layerId: string };
}

export function curatedNodeChapter(title: string, level: ContentChapter["level"], entries: CuratedNodeSection[]): ContentChapter {
  return {
    title,
    level,
    nodeTitle: title,
    nodeKind: "concept",
    sections: entries.map((entry, index): ContentSection => ({
      title: entry.title,
      order: index + 1,
      blocks: [
        prose(entry.prose),
        ...(entry.supplement ? [prose(entry.supplement)] : []),
        code("js", entry.codeA, entry.captionA),
        code("js", entry.codeB, entry.captionB),
        porque([entry.why]),
        quebraria([entry.breaks]),
        ...(entry.labref ? [{ kind: "labref" as const, ...entry.labref }] : []),
      ],
    })),
  };
}
