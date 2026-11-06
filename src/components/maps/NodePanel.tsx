import { useNavigate } from "react-router-dom";
import { BookOpen, Repeat, Target, X } from "lucide-react";
import { useChiron } from "@/lib/study/store";
import { MASTERY_LABELS } from "@/lib/study/types";
import { MASTERY_VARS } from "@/lib/color";
import type { MapNode } from "@/lib/study/types";

export default function NodePanel({ node, onClose }: { node: MapNode; onClose: () => void }) {
  const { index, lib } = useChiron();
  const navigate = useNavigate();
  const currentLib = lib(node.sourceId);

  const sections = currentLib.sections.filter((s) => s.nodeId === node.id).sort((a, b) => a.order - b.order);
  const exercises = currentLib.exercises.filter((e) => e.nodeId === node.id);
  const cards = index.cards.filter((c) => c.nodeId === node.id);
  const summary = sections[0]?.blocks.find((b) => b.kind === "prose")?.md;

  return (
    <div className="chiron-card flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-card-foreground">{node.title}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: MASTERY_VARS[node.mastery] }} />
            {MASTERY_LABELS[node.mastery]} · {node.kind}
          </div>
        </div>
        <button type="button" onClick={onClose} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {summary && (
        <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-muted-foreground">{summary}</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-border bg-card p-2">
          <div className="font-display num text-base text-card-foreground">{sections.length}</div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Seções</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-2">
          <div className="font-display num text-base text-card-foreground">{exercises.length}</div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Exercícios</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-2">
          <div className="font-display num text-base text-card-foreground">{cards.length}</div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Cards</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          disabled={sections.length === 0}
          onClick={() => navigate(`/apostila?source=${node.sourceId}&node=${node.id}`)}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <BookOpen className="h-4 w-4 text-secondary" /> Ler
        </button>
        <button
          type="button"
          disabled={exercises.length === 0}
          onClick={() => navigate(`/practice?node=${node.id}`)}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Target className="h-4 w-4 text-secondary" /> Praticar
        </button>
        <button
          type="button"
          disabled={cards.length === 0}
          onClick={() => navigate(`/review?node=${node.id}`)}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Repeat className="h-4 w-4 text-secondary" /> Revisar
        </button>
      </div>
    </div>
  );
}
