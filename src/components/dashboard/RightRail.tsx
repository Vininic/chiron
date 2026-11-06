import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Repeat } from "lucide-react";
import { computeNextInQueue, computeMasteryBySource } from "@/lib/study/dashboard";
import { useChiron } from "@/lib/study/store";
import { CHART_VARS } from "@/lib/color";

function NextInQueueCard() {
  const { index, libs } = useChiron();
  const navigate = useNavigate();
  const queue = useMemo(() => computeNextInQueue(index, libs, 4), [index, libs]);

  if (queue.length === 0) return null;

  return (
    <div className="chiron-card p-4">
      <div className="text-sm font-medium text-card-foreground">Próximo na fila</div>
      <div className="mt-3 space-y-1.5">
        {queue.map((item, i) => {
          const Icon = item.kind === "review" ? Repeat : BookOpen;
          return (
            <button
              key={i}
              type="button"
              onClick={() => navigate(item.href)}
              className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 text-left transition-colors hover:bg-accent"
            >
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md" style={{ background: `hsl(var(--chart-${item.kind === "review" ? 1 : 2}) / 0.1)` }}>
                <Icon className="h-3.5 w-3.5" style={{ color: item.kind === "review" ? CHART_VARS[0] : CHART_VARS[1] }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-card-foreground">{item.label}</div>
                <div className="text-[11px] text-muted-foreground">{item.sourceName}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MasteryBySourceCard() {
  const { index } = useChiron();
  const bySource = useMemo(() => computeMasteryBySource(index).slice(0, 6), [index]);

  if (bySource.length === 0) return null;

  return (
    <div className="chiron-card p-4">
      <div className="text-sm font-medium text-card-foreground">Domínio por fonte</div>
      <div className="mt-3 space-y-2.5">
        {bySource.map(({ source, pct }) => (
          <div key={source.id}>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="truncate text-muted-foreground">{source.name}</span>
              <span className="num text-card-foreground">{Math.round(pct * 100)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: CHART_VARS[2] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RightRail() {
  return (
    <div className="space-y-4">
      <NextInQueueCard />
      <MasteryBySourceCard />
    </div>
  );
}
