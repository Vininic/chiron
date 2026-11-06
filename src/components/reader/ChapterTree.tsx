import { Check } from "lucide-react";
import type { ApostilaSection, Chapter, ChapterLevel } from "@/lib/study/types";

const LEVEL_LABEL: Record<ChapterLevel, string> = { basico: "Básico", intermediario: "Intermediário", avancado: "Avançado" };

export default function ChapterTree({
  chapters, sections, currentSectionId, onSelect,
}: {
  chapters: Chapter[];
  sections: ApostilaSection[];
  currentSectionId: string | null;
  onSelect: (id: string) => void;
}) {
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
  const sectionById = new Map(sections.map((s) => [s.id, s]));

  return (
    <nav className="space-y-3">
      {sortedChapters.map((chapter) => {
        const chapterSections = chapter.sectionIds
          .map((id) => sectionById.get(id))
          .filter((s): s is ApostilaSection => !!s)
          .sort((a, b) => a.order - b.order);
        const readCount = chapterSections.filter((s) => s.readAt).length;

        return (
          <div key={chapter.id}>
            <div className="flex items-center justify-between px-1">
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-card-foreground">{chapter.title}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{LEVEL_LABEL[chapter.level]}</div>
              </div>
              <span className="num shrink-0 text-[10px] text-muted-foreground">{readCount}/{chapterSections.length}</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {chapterSections.map((section, i) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSelect(section.id)}
                  className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                    currentSectionId === section.id
                      ? "bg-secondary/10 text-secondary"
                      : "text-card-foreground hover:bg-accent"
                  }`}
                >
                  <span className="w-4 shrink-0 text-[10px] text-muted-foreground">{chapter.order}.{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{section.title}</span>
                  {section.readAt && <Check className="h-3 w-3 shrink-0 text-secondary" />}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
