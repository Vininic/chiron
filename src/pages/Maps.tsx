import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, CheckCircle2, Circle, Compass, Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyPage from "@/components/EmptyPage";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MapNode, Mastery } from "@/lib/study/types";
import { MASTERY_LABELS } from "@/lib/study/types";

export default function Maps() {
  const t = useT();
  const L = t.chiron.maps;
  const { index } = useChiron();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedSourceId = searchParams.get("source");

  const hasData = index.sources.length > 0;

  if (!hasData) {
    return (
      <EmptyPage
        icon={Compass}
        eyebrow={L.eyebrow}
        title={L.title}
        lead={L.empty}
        milestone="Adicione um repositório para gerar o mapa"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{L.eyebrow}</div>
        <h1 className="font-display mt-1.5 text-4xl text-primary">{L.title}</h1>
      </header>

      <div className="flex flex-wrap gap-2">
        {index.sources.map((src) => (
          <button
            key={src.id}
            type="button"
            onClick={() => navigate(`/maps?source=${src.id}`)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
              selectedSourceId === src.id
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border bg-card text-card-foreground hover:bg-accent"
            }`}
          >
            {src.name}
          </button>
        ))}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          {L.addRepo}
        </button>
      </div>

      <NodeTree sourceId={selectedSourceId ?? index.sources[0]?.id} />
    </div>
  );
}

function NodeTree({ sourceId }: { sourceId: string }) {
  const { index } = useChiron();
  const nodes = index.nodes.filter((n) => n.sourceId === sourceId);
  const navigate = useNavigate();

  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhum nó neste mapa ainda. Use o Aetheris para gerar o mapa conceitual.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} onPractice={() => navigate(`/practice?node=${node.id}`)} />
      ))}
    </div>
  );
}

function NodeCard({ node, onPractice }: { node: MapNode; onPractice: () => void }) {
  const masteryColor: Record<Mastery, string> = {
    0: "text-muted-foreground",
    1: "text-blue-400",
    2: "text-amber-400",
    3: "text-green-400",
    4: "text-purple-400",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className={masteryColor[node.mastery]}>
        {node.mastery >= 3 ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-card-foreground">{node.title}</div>
        <div className="flex gap-2 text-[11px] text-muted-foreground">
          <span>{node.kind}</span>
          <span>·</span>
          <span>{MASTERY_LABELS[node.mastery]}</span>
          {node.requires.length > 0 && (
            <>
              <span>·</span>
              <span>requer: {node.requires.join(", ")}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onPractice}
          className="grid h-8 w-8 place-items-center rounded-md text-secondary transition-colors hover:bg-secondary/10"
          title="Praticar"
        >
          <Target className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-md text-secondary transition-colors hover:bg-secondary/10"
          title="Apostila"
        >
          <BookOpen className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
