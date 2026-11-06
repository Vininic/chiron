import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Compass, Lock, Plus } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import AddSourceDialog from "@/components/AddSourceDialog";
import MapCanvas from "@/components/maps/MapCanvas";
import NodePanel from "@/components/maps/NodePanel";
import SourceSelector from "@/components/maps/SourceSelector";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import { MASTERY_LABELS } from "@/lib/study/types";
import { MASTERY_VARS } from "@/lib/color";

const LEGEND_ITEMS: { mastery: 0 | 1 | 2 | 3 | 4 }[] = [
  { mastery: 0 }, { mastery: 1 }, { mastery: 2 }, { mastery: 3 }, { mastery: 4 },
];

export default function Maps() {
  const t = useT();
  const L = t.chiron.maps;
  const { index } = useChiron();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const hasData = index.sources.length > 0;
  const sourceId = searchParams.get("source") ?? index.sources[0]?.id;

  useEffect(() => {
    // A different source was picked (or a deep-link landed here) — the
    // previously selected node almost certainly doesn't belong to it.
    setSelectedNodeId(searchParams.get("node"));
  }, [sourceId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasData) {
    return (
      <EmptyPage
        icon={Compass}
        lead={L.empty}
        milestone="Adicione um repositório para gerar o mapa"
      />
    );
  }

  const nodes = index.nodes.filter((n) => n.sourceId === sourceId);
  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null;

  function selectSource(id: string) {
    setSearchParams({ source: id });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SourceSelector sources={index.sources} selectedId={sourceId} onSelect={selectSource} />
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-3.5 w-3.5" />
          {L.addRepo}
        </button>
      </div>

      {nodes.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum nó neste mapa ainda. Use o Aetheris para gerar o mapa conceitual.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-2">
            <MapCanvas nodes={nodes} selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground">
              {LEGEND_ITEMS.map(({ mastery }) => (
                <span key={mastery} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: MASTERY_VARS[mastery] }} />
                  {MASTERY_LABELS[mastery]}
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Trancado
              </span>
            </div>
          </div>

          <div className="lg:h-[520px]">
            {selectedNode ? (
              <NodePanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
            ) : (
              <div className="chiron-card flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
                Clique num nó destrancado para ver detalhes, ler a apostila, praticar ou revisar.
              </div>
            )}
          </div>
        </div>
      )}

      <AddSourceDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
