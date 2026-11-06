import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, LayoutGrid } from "lucide-react";
import { useChiron } from "@/lib/study/store";
import { computeNextChapter } from "@/lib/study/dashboard";
import { techIdentity, techInitial } from "@/lib/content/logos";
import { alpha, MASTERY_VARS } from "@/lib/color";
import type { ChapterLevel, StudySource } from "@/lib/study/types";
import { LABS } from "@/lib/labs/catalog";
import { labCompletion } from "@/lib/labs/engine";
import OriginBadge from "@/components/OriginBadge";

const LEVELS: ChapterLevel[] = ["basico", "intermediario", "avancado"];
const LEVEL_LABEL: Record<ChapterLevel, string> = { basico: "Básico", intermediario: "Intermediário", avancado: "Avançado" };

function TechBadge({ name, size = 36 }: { name: string; size?: number }) {
  const identity = techIdentity(name);
  return (
    <div
      className="font-display grid shrink-0 place-items-center rounded-lg text-sm font-semibold"
      style={{ width: size, height: size, background: alpha(identity.color, 0.14), color: identity.color }}
    >
      {techInitial(name)}
    </div>
  );
}

function RepoRow({ source }: { source: StudySource }) {
  const { index, lib } = useChiron();
  const navigate = useNavigate();
  const nodes = index.nodes.filter((n) => n.sourceId === source.id);
  const currentLib = lib(source.id);
  const masteryPct = nodes.length ? nodes.reduce((a, n) => a + n.mastery, 0) / (nodes.length * 4) : 0;

  return (
    <button
      type="button"
      onClick={() => navigate(`/maps?source=${source.id}`)}
      className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-3.5 text-left transition-colors hover:bg-accent"
    >
      <TechBadge name={source.language ?? source.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><span className="truncate font-medium text-card-foreground">{source.name}</span><OriginBadge origin={source.contentOrigin} /></div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {source.language ?? "?"} · {nodes.length} {nodes.length === 1 ? "nó" : "nós"} · {currentLib.sections.length} {currentLib.sections.length === 1 ? "seção" : "seções"}
          {source.ingestedAt && ` · ingerido ${source.ingestedAt.slice(0, 10)}`}
        </div>
      </div>
      <svg width={36} height={36} viewBox="0 0 36 36" className="shrink-0 -rotate-90">
        <circle cx={18} cy={18} r={14} fill="none" stroke="hsl(var(--border))" strokeWidth={4} />
        <circle
          cx={18} cy={18} r={14} fill="none" stroke={MASTERY_VARS[4]} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={`${masteryPct * 2 * Math.PI * 14} ${2 * Math.PI * 14}`}
        />
      </svg>
      {/* Code-grid thumbnail: a quiet stand-in for a real file preview — deliberately abstract, not fabricated file contents */}
      <div className="hidden shrink-0 grid-cols-4 gap-0.5 sm:grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-1.5 w-3 rounded-sm bg-muted" style={{ opacity: 0.4 + ((i * 37) % 60) / 100 }} />
        ))}
      </div>
    </button>
  );
}

function StackCard({ source }: { source: StudySource }) {
  const { index, lib } = useChiron();
  const navigate = useNavigate();
  const currentLib = lib(source.id);
  const nextChapter = computeNextChapter(currentLib, index);
  const levelsPresent = new Set(currentLib.chapters.map((c) => c.level));

  return (
    <button
      type="button"
      onClick={() => navigate(`/apostila`)}
      className="flex flex-col rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <TechBadge name={source.name} size={32} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-card-foreground">{source.name}</div>
          <OriginBadge origin={source.contentOrigin} className="mt-1" />
        </div>
      </div>

      <div className="mt-3 flex gap-1">
        {LEVELS.map((level) => (
          <div key={level} className="flex-1">
            <div className={`h-1.5 rounded-full ${levelsPresent.has(level) ? "bg-secondary" : "bg-muted"}`} />
            <div className="mt-1 text-center text-[9px] uppercase tracking-wide text-muted-foreground">{LEVEL_LABEL[level].slice(0, 4)}</div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground">{currentLib.chapters.length} {currentLib.chapters.length === 1 ? "capítulo" : "capítulos"}</div>
      <div className="mt-1 truncate text-xs text-card-foreground">
        {nextChapter ? `Próximo: ${nextChapter.title}` : "Todos os capítulos dominados"}
      </div>
    </button>
  );
}

function LabCard({ lab }: { lab: typeof LABS[number] }) {
  const { index } = useChiron();
  const navigate = useNavigate();
  const progress = labCompletion(lab, index.labProgress.filter((item) => item.labId === lab.id).map((item) => item.layerId));
  return (
    <button type="button" onClick={() => navigate(`/labs/${lab.id}`)} className="group flex flex-col rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent">
      <div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-lg bg-muted" style={{ color: lab.accent }}>
        <FlaskConical className="h-5 w-5" />
      </div><span className="num text-xs text-muted-foreground">{progress}%</span></div>
      <div className="mt-3 text-sm font-medium text-card-foreground">{lab.name}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{lab.subtitle} · {lab.layers.length} camadas guiadas</p>
    </button>
  );
}

function CategorySection({ title, icon: Icon, children }: { title: string; icon: typeof LayoutGrid; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      {children}
    </section>
  );
}

export default function SourceCards() {
  const { index } = useChiron();
  const repos = useMemo(() => index.sources.filter((s) => s.kind === "repo"), [index.sources]);
  const stacks = useMemo(() => index.sources.filter((s) => s.kind === "stack" || s.kind === "tool"), [index.sources]);

  return (
    <div className="space-y-6">
      {repos.length > 0 && (
        <CategorySection title="Repositórios" icon={LayoutGrid}>
          <div className="space-y-2">
            {repos.map((source) => <RepoRow key={source.id} source={source} />)}
          </div>
        </CategorySection>
      )}

      <CategorySection title="Stacks" icon={LayoutGrid}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stacks.map((source) => <StackCard key={source.id} source={source} />)}
        </div>
      </CategorySection>

      <CategorySection title="Laboratórios" icon={FlaskConical}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LABS.map((lab) => <LabCard key={lab.id} lab={lab} />)}
        </div>
      </CategorySection>
    </div>
  );
}
