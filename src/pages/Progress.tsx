import { useMemo } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import type { Mastery } from "@/lib/study/types";
import { MASTERY_LABELS } from "@/lib/study/types";
import { computeMasteryWeight } from "@/lib/study/scoring";

export default function Progress() {
  const t = useT();
  const L = t.chiron.progress;
  const { index } = useChiron();

  const hasSessions = index.sessions.length > 0 || index.score.streak > 0;

  if (!hasSessions) {
    return (
      <EmptyPage
        icon={TrendingUp}
        eyebrow={L.eyebrow}
        title={L.title}
        lead={L.empty}
        milestone="Comece a estudar para ver seu progresso"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{L.eyebrow}</div>
        <h1 className="font-display mt-1.5 text-4xl text-primary">{L.title}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total de pontos</div>
          <div className="mt-1 font-display text-3xl text-card-foreground">{index.score.total}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Sequência de estudos</div>
          <div className="mt-1 font-display text-3xl text-card-foreground">
            {index.score.streak} {index.score.streak === 1 ? "dia" : "dias"}
          </div>
          {index.score.lastStudyDate && (
            <div className="mt-1 text-[11px] text-muted-foreground">
              Último estudo: {index.score.lastStudyDate}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Domínio geral</div>
          <div className="mt-1 font-display text-3xl text-card-foreground">
            {Math.round(computeMasteryWeight(index.nodes) * 100)}%
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl text-primary">Domínio por nível</h2>
        <MasteryDistribution nodes={index.nodes} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-primary">Sessões de estudo</h2>
        {index.sessions.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Nenhuma sessão registrada ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {[...index.sessions].reverse().slice(0, 20).map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <div className="text-sm text-card-foreground">
                    {session.date} · {session.budgetMin}min
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.blocks.filter((b) => b.done).length}/{session.blocks.length} blocos concluídos
                    {session.completedAt && " · Completa"}
                  </div>
                </div>
                <div className={`text-xs ${session.completedAt ? "text-green-400" : "text-amber-400"}`}>
                  {session.completedAt ? "✓" : "○"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-primary">Calendário de estudos</h2>
        <StudyCalendar sessions={index.sessions} />
      </section>
    </div>
  );
}

function MasteryDistribution({ nodes }: { nodes: Array<{ mastery: Mastery }> }) {
  const distribution = useMemo(() => {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const n of nodes) {
      counts[n.mastery]++;
    }
    return counts;
  }, [nodes]);

  const colors: Record<number, string> = {
    0: "bg-muted-foreground/30",
    1: "bg-blue-500",
    2: "bg-amber-500",
    3: "bg-green-500",
    4: "bg-purple-500",
  };

  const total = nodes.length || 1;

  return (
    <div className="space-y-2">
      {([4, 3, 2, 1, 0] as Mastery[]).map((level) => (
        <div key={level} className="flex items-center gap-3">
          <div className="w-16 text-xs text-muted-foreground">{MASTERY_LABELS[level]}</div>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${colors[level]}`}
              style={{ width: `${(distribution[level] / total) * 100}%` }}
            />
          </div>
          <div className="w-8 text-right text-xs text-muted-foreground">{distribution[level]}</div>
        </div>
      ))}
    </div>
  );
}

function StudyCalendar({ sessions }: { sessions: Array<{ date: string; completedAt?: string }> }) {
  const calendar = useMemo(() => {
    const studyDates = new Set(sessions.map((s) => s.date));
    const days: Array<{ date: string; active: boolean }> = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push({ date: key, active: studyDates.has(key) });
    }
    return days;
  }, [sessions]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap gap-1">
        {calendar.map((day) => (
          <div
            key={day.date}
            className={`h-3 w-3 rounded-sm ${
              day.active ? "bg-secondary" : "bg-muted"
            }`}
            title={day.date}
          />
        ))}
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground">
        Últimos 30 dias · {calendar.filter((d) => d.active).length} dias de estudo
      </div>
    </div>
  );
}
