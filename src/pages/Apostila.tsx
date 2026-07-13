import { useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import Markdown from "@/components/Markdown";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";

export default function Apostila() {
  const t = useT();
  const L = t.chiron.apostila;
  const { index, lib } = useChiron();
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sourceId = selectedSourceId ?? index.sources[0]?.id;
  const currentLib = sourceId ? lib(sourceId) : null;
  const sections = currentLib?.sections ?? [];

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  );

  const currentSection = sortedSections[currentSectionIdx];

  if (!sourceId || sections.length === 0) {
    return (
      <EmptyPage
        icon={BookOpen}
        eyebrow={L.eyebrow}
        title={L.title}
        lead={L.empty}
        milestone="Peça ao Aetheris para gerar uma apostila"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{L.eyebrow}</div>
          <h1 className="font-display mt-1.5 text-4xl text-primary">{L.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sourceId}
            onChange={(e) => { setSelectedSourceId(e.target.value); setCurrentSectionIdx(0); }}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-card-foreground"
          >
            {index.sources.map((src) => (
              <option key={src.id} value={src.id}>{src.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="grid h-8 w-8 place-items-center rounded-md text-secondary transition-colors hover:bg-secondary/10 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex gap-6">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <nav className={`w-64 shrink-0 space-y-1 ${sidebarOpen ? "fixed left-4 top-24 z-50 rounded-lg border border-border bg-card p-3" : "hidden lg:block"}`}>
          {sortedSections.map((sec, i) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => { setCurrentSectionIdx(i); setSidebarOpen(false); }}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                i === currentSectionIdx
                  ? "bg-secondary/10 text-secondary"
                  : "text-card-foreground hover:bg-accent"
              }`}
            >
              <span className="text-[10px] text-muted-foreground">{i + 1}.</span>{" "}
              {sec.title}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {currentSection && (
            <article className="apostila-content rounded-lg border border-border bg-card p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">
                Seção {currentSectionIdx + 1} de {sortedSections.length}
              </div>
              <h2 className="font-display mt-2 text-2xl text-primary">{currentSection.title}</h2>
              <div className="mt-6 max-w-none text-sm text-card-foreground">
                <Markdown text={currentSection.bodyMd} />
              </div>
            </article>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={currentSectionIdx === 0}
              onClick={() => setCurrentSectionIdx((i) => Math.max(0, i - 1))}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-card-foreground transition-colors hover:bg-accent disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <span className="text-xs text-muted-foreground">
              {currentSectionIdx + 1} / {sortedSections.length}
            </span>
            <button
              type="button"
              disabled={currentSectionIdx === sortedSections.length - 1}
              onClick={() => setCurrentSectionIdx((i) => Math.min(sortedSections.length - 1, i + 1))}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-card-foreground transition-colors hover:bg-accent disabled:opacity-30"
            >
              Próximo <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
