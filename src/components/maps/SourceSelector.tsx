import type { SourceKind, StudySource } from "@/lib/study/types";
import OriginBadge from "@/components/OriginBadge";

const CATEGORY_LABEL: Record<SourceKind, string> = { repo: "Repositórios", stack: "Stacks", tool: "Ferramentas", lab: "Laboratórios" };
const CATEGORY_ORDER: SourceKind[] = ["repo", "stack", "tool", "lab"];

export default function SourceSelector({
  sources, selectedId, onSelect,
}: {
  sources: StudySource[]; selectedId: string; onSelect: (id: string) => void;
}) {
  const groups = CATEGORY_ORDER
    .map((kind) => ({ kind, sources: sources.filter((s) => s.kind === kind) }))
    .filter((g) => g.sources.length > 0);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {groups.map(({ kind, sources: groupSources }) => (
        <div key={kind} className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{CATEGORY_LABEL[kind]}</span>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {groupSources.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => onSelect(src.id)}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  selectedId === src.id
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card text-card-foreground hover:bg-accent"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">{src.name}<OriginBadge origin={src.contentOrigin} compact /></span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
