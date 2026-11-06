import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { Sparkline, StreakRing, MasteryDonut } from "./charts";
import { planSessionBlocks, computeUpcomingDue, computeMasteryDistribution } from "@/lib/study/dashboard";
import { useChiron } from "@/lib/study/store";
import { createSession } from "@/lib/study/service";
import { cardsDue } from "@/lib/study/srs";
import { today, SESSION_BUDGETS } from "@/lib/study/types";
import { toast } from "@/components/ui/sonner";
import { CHART_VARS } from "@/lib/color";

const BLOCK_LABEL: Record<string, string> = { review: "Revisão", read: "Leitura", exercise: "Exercício" };
const BLOCK_COLOR: Record<string, string> = { review: CHART_VARS[0], read: CHART_VARS[1], exercise: CHART_VARS[3] };

function SessionCard() {
  const { index, replaceIndex } = useChiron();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<number>(60);
  const dueCount = cardsDue(index.cards, today());
  const blocks = useMemo(() => planSessionBlocks(budget, dueCount), [budget, dueCount]);
  const todaysSession = index.sessions.find((s) => s.date === today() && !s.completedAt);

  function start() {
    const { index: next } = createSession(index, budget, blocks);
    replaceIndex(next);
    toast(`Sessão de ${budget}min iniciada`);
    navigate(dueCount > 0 ? "/review" : "/practice");
  }

  return (
    <div className="chiron-card p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Sessão do dia</div>
      <div className="mt-2 flex gap-1.5">
        {SESSION_BUDGETS.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBudget(b)}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${budget === b ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {b}min
          </button>
        ))}
      </div>

      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {blocks.map((b, i) => (
          <div
            key={i}
            style={{ width: `${(b.estMin / budget) * 100}%`, background: BLOCK_COLOR[b.kind] }}
            title={`${BLOCK_LABEL[b.kind]}: ${b.estMin}min`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
        {blocks.map((b, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLOCK_COLOR[b.kind] }} />
            {BLOCK_LABEL[b.kind]} · {b.estMin}min
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={start}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-deep"
      >
        <Play className="h-3.5 w-3.5" /> {todaysSession ? "Retomar" : "Iniciar"}
      </button>
    </div>
  );
}

function StreakCard() {
  const { index } = useChiron();
  const studyDates = useMemo(() => new Set(index.sessions.map((s) => s.date)), [index.sessions]);
  const last7 = useMemo(() => {
    const days: boolean[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(studyDates.has(d.toISOString().split("T")[0]));
    }
    return days;
  }, [studyDates]);

  return (
    <div className="chiron-card flex flex-col items-center justify-center p-4">
      <div className="self-start text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Sequência</div>
      <div className="mt-2">
        <StreakRing days={last7} label={String(index.score.streak)} />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{index.score.streak === 1 ? "dia seguido" : "dias seguidos"}</div>
    </div>
  );
}

function QueueCard() {
  const { index } = useChiron();
  const upcoming = useMemo(() => computeUpcomingDue(index, 14), [index]);
  const dueToday = cardsDue(index.cards, today());

  return (
    <div className="chiron-card p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Fila de revisão</div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="font-display num text-2xl text-card-foreground">{dueToday}</div>
          <div className="text-[11px] text-muted-foreground">pendentes hoje</div>
        </div>
        <Sparkline values={upcoming} color={CHART_VARS[1]} />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">próximos 14 dias</div>
    </div>
  );
}

function MasteryCard() {
  const { index } = useChiron();
  const distribution = useMemo(() => computeMasteryDistribution(index), [index]);

  return (
    <div className="chiron-card flex flex-col items-center justify-center p-4">
      <div className="self-start text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Domínio geral</div>
      <div className="mt-2">
        <MasteryDonut counts={distribution} />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{index.nodes.length} nós no total</div>
    </div>
  );
}

export default function TodayStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SessionCard />
      <StreakCard />
      <QueueCard />
      <MasteryCard />
    </div>
  );
}
