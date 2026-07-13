import { BookOpen, Calendar, Compass, Repeat, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyPage from "@/components/EmptyPage";
import { useChiron } from "@/lib/study/store";
import { cardsDue } from "@/lib/study/srs";
import { today } from "@/lib/study/types";
import { useT } from "@/lib/i18n/I18nProvider";

export default function Dashboard() {
  const t = useT();
  const D = t.chiron.dashboard;
  const { index } = useChiron();
  const navigate = useNavigate();

  const hasData = index.sources.length > 0;
  const dueCount = cardsDue(index.cards, today());

  if (!hasData) {
    return (
      <EmptyPage
        icon={TrendingUp}
        eyebrow={D.eyebrow}
        title={D.title}
        lead={D.noData}
        milestone="Adicione um repositório para começar"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{D.eyebrow}</div>
        <h1 className="font-display mt-1.5 text-4xl text-primary">{D.title}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label={D.studyStreak} value={`${index.score.streak} dias`} />
        <StatCard icon={Compass} label={D.mapsCount} value={`${index.nodes.length}`} />
        <StatCard icon={BookOpen} label={D.apostilasCount} value={`${index.sources.length}`} />
        <StatCard icon={Repeat} label={D.nextReview} value={`${dueCount} cards`} />
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl text-primary">Fontes de estudo</h2>
        <div className="space-y-2">
          {index.sources.map((src) => (
            <button
              key={src.id}
              type="button"
              onClick={() => navigate(`/maps?source=${src.id}`)}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                <Compass className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-card-foreground">{src.name}</div>
                <div className="text-xs text-muted-foreground">
                  {src.kind} · {src.language ?? "?"} · {index.nodes.filter((n) => n.sourceId === src.id).length} nodes
                </div>
              </div>
              <TrendingUp className="h-4 w-4 shrink-0 text-secondary" />
            </button>
          ))}
        </div>
      </section>

      <section className="flex gap-3">
        <ActionButton icon={Compass} label="Ver mapas" onClick={() => navigate("/maps")} />
        <ActionButton icon={Target} label="Praticar" onClick={() => navigate("/practice")} />
        {dueCount > 0 && (
          <ActionButton icon={Repeat} label={`Revisar (${dueCount})`} onClick={() => navigate("/review")} />
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 font-display text-2xl text-card-foreground">{value}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof Compass; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-card-foreground transition-colors hover:bg-accent"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
