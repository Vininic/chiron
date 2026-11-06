import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityAreaChart, RetentionChart } from "./charts";
import { computeActivitySeries, computeWeeklyRetention, computeWeakestNodes } from "@/lib/study/dashboard";
import { useChiron } from "@/lib/study/store";
import { MASTERY_LABELS } from "@/lib/study/types";
import { MASTERY_VARS } from "@/lib/color";

function ActivityCard() {
  const { index } = useChiron();
  const [range, setRange] = useState<7 | 30>(30);
  const series = useMemo(() => computeActivitySeries(index, 30), [index]);
  const shown = range === 7 ? series.slice(-7) : series;

  return (
    <div className="chiron-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-card-foreground">Atividade de estudo</div>
        <div className="flex gap-1">
          {([7, 30] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-2 py-1 text-[11px] transition-colors ${range === r ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {r === 7 ? "Semana" : "Mês"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <ActivityAreaChart data={shown} />
      </div>
    </div>
  );
}

function RetentionCard() {
  const { index } = useChiron();
  const weeks = useMemo(() => computeWeeklyRetention(index, 8), [index]);

  return (
    <div className="chiron-card p-4">
      <div className="text-sm font-medium text-card-foreground">Retenção</div>
      <div className="mt-3 overflow-x-auto">
        <RetentionChart data={weeks} />
      </div>
    </div>
  );
}

function WeakNodesCard() {
  const { index } = useChiron();
  const navigate = useNavigate();
  const weakest = useMemo(() => computeWeakestNodes(index, 5), [index]);

  if (weakest.length === 0) return null;

  return (
    <div className="chiron-card p-4">
      <div className="text-sm font-medium text-card-foreground">Nós mais fracos</div>
      <div className="mt-3 space-y-1.5">
        {weakest.map(({ node, sourceName }) => (
          <button
            key={node.id}
            type="button"
            onClick={() => navigate(`/practice?node=${node.id}`)}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-left transition-colors hover:bg-accent"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-card-foreground">{node.title}</div>
              <div className="text-[11px] text-muted-foreground">{sourceName} · {MASTERY_LABELS[node.mastery]}</div>
            </div>
            <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${(node.mastery / 4) * 100}%`, background: MASTERY_VARS[node.mastery] }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MainColumn() {
  return (
    <div className="space-y-4">
      <ActivityCard />
      <RetentionCard />
      <WeakNodesCard />
    </div>
  );
}
