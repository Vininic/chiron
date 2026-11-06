import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Menu, Sparkles } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import BlockRenderer from "@/components/BlockRenderer";
import ChapterTree from "@/components/reader/ChapterTree";
import MarginRail from "@/components/reader/MarginRail";
import { useChiron } from "@/lib/study/store";
import { updateSection } from "@/lib/study/service";
import { today } from "@/lib/study/types";
import { useT } from "@/lib/i18n/I18nProvider";
import type { ApostilaSection, Chapter } from "@/lib/study/types";
import OriginBadge, { originLabel } from "@/components/OriginBadge";

/** Flattens chapters → sections into the single reading order the
 *  continuous-scroll column and keyboard nav both walk: chapter order, then
 *  section order within it. Sections that don't belong to any real chapter
 *  (shouldn't happen post-migration, but defensive) are appended at the end
 *  by their own order, rather than silently dropped from the reader. */
function flattenReadingOrder(chapters: Chapter[], sections: ApostilaSection[]): ApostilaSection[] {
  const byId = new Map(sections.map((s) => [s.id, s]));
  const used = new Set<string>();
  const ordered: ApostilaSection[] = [];

  for (const chapter of [...chapters].sort((a, b) => a.order - b.order)) {
    for (const id of chapter.sectionIds) {
      const s = byId.get(id);
      if (s && !used.has(id)) { ordered.push(s); used.add(id); }
    }
  }
  for (const s of [...sections].sort((a, b) => a.order - b.order)) {
    if (!used.has(s.id)) ordered.push(s);
  }
  return ordered;
}

export default function Apostila() {
  const t = useT();
  const L = t.chiron.apostila;
  const { index, lib, replaceLib } = useChiron();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  const sourceId = selectedSourceId ?? searchParams.get("source") ?? index.sources[0]?.id;
  const currentLib = sourceId ? lib(sourceId) : null;
  const sections = currentLib?.sections ?? [];
  const chapters = currentLib?.chapters ?? [];

  const orderedSections = useMemo(
    () => flattenReadingOrder(chapters, sections),
    [chapters, sections],
  );

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const markedReadRef = useRef<Set<string>>(new Set());

  // Deep-link from the map's node panel: /apostila?source=..&node=..  jumps
  // to that node's first section instead of always the top of the reader.
  useEffect(() => {
    const nodeId = searchParams.get("node");
    if (!nodeId) return;
    const target = orderedSections.find((s) => s.nodeId === nodeId);
    if (target) {
      setCurrentSectionId(target.id);
      requestAnimationFrame(() => sectionRefs.current.get(target.id)?.scrollIntoView({ block: "start" }));
    }
    // Only react to the deep-link params changing, not to orderedSections
    // re-deriving as a new array on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Scroll-spy: whichever section's top has crossed a "reading line" near
  // the top of the viewport (last section to do so, among those already
  // past it) drives the tree highlight + margin rail, and gets readAt
  // stamped the first time it's actually seen. Deliberately a scroll-
  // position calculation (rAF-throttled) rather than IntersectionObserver —
  // this environment's preview pane doesn't composite frames (the same
  // known limitation documented for the Armillary 3D work), so IO's
  // callback never fires here at all, confirmed live with an isolated
  // IntersectionObserver test that never invoked its callback even once.
  // getBoundingClientRect()-on-scroll doesn't depend on compositing, so it
  // actually works — and it's an equally legitimate technique in a normal
  // browser, not a workaround specific to this environment.
  useEffect(() => {
    if (orderedSections.length === 0) return;
    const scrollParent = sectionRefs.current.values().next().value?.closest("main") ?? window;
    const READING_LINE = 160; // px from the top of the scroll container

    function onScroll() {
      let current: string | null = null;
      for (const section of orderedSections) {
        const el = sectionRefs.current.get(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= READING_LINE) current = section.id;
        else break; // sections render in order, so the first one below the line ends the search
      }
      const id = current ?? orderedSections[0].id;
      setCurrentSectionId((prev) => (prev === id ? prev : id));
      if (!markedReadRef.current.has(id) && sourceId) {
        markedReadRef.current.add(id);
        const section = sections.find((s) => s.id === id);
        if (section && !section.readAt) {
          replaceLib(sourceId, updateSection(currentLib!, id, { readAt: today() }));
        }
      }
    }

    let ticking = false;
    function onScrollThrottled() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onScroll(); ticking = false; });
    }

    scrollParent.addEventListener("scroll", onScrollThrottled, { passive: true });
    onScroll(); // mark/highlight whatever's already at the top on mount, don't wait for the first scroll
    return () => scrollParent.removeEventListener("scroll", onScrollThrottled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedSections, sourceId]);

  // Keyboard nav: j/k or arrows move to the next/previous section in
  // reading order — sequential across the flattened chapter list already
  // respects chapter boundaries, since chapters are walked in order too.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const idx = orderedSections.findIndex((s) => s.id === currentSectionId);
      if (e.key === "j" || e.key === "ArrowDown") {
        const next = orderedSections[Math.min(orderedSections.length - 1, idx + 1)];
        if (next) sectionRefs.current.get(next.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.key === "k" || e.key === "ArrowUp") {
        const prev = orderedSections[Math.max(0, idx - 1)];
        if (prev) sectionRefs.current.get(prev.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [orderedSections, currentSectionId]);

  if (!sourceId || sections.length === 0) {
    return (
      <EmptyPage
        icon={BookOpen}
        lead={L.empty}
        milestone="Peça ao Aetheris para gerar uma apostila"
      />
    );
  }

  const currentSection = orderedSections.find((s) => s.id === currentSectionId) ?? orderedSections[0];

  function selectSection(id: string) {
    setCurrentSectionId(id);
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Link to="/apostila/nova" className="mr-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-card-foreground transition-colors hover:bg-accent">
          <Sparkles className="h-3.5 w-3.5 text-secondary" /> Nova apostila com IA
        </Link>
        <OriginBadge origin={index.sources.find((s) => s.id === sourceId)?.contentOrigin} />
        <select
          value={sourceId}
          onChange={(e) => { setSelectedSourceId(e.target.value); setSearchParams({ source: e.target.value }); }}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-card-foreground"
        >
          {index.sources.map((src) => (
            <option key={src.id} value={src.id}>{src.name} · {originLabel(src.contentOrigin) ?? ""}</option>
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

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={sidebarOpen ? "fixed left-4 top-24 z-50 max-h-[70vh] w-72 overflow-y-auto rounded-lg border border-border bg-card p-3" : "hidden lg:block"}>
          <ChapterTree chapters={chapters} sections={sections} currentSectionId={currentSectionId} onSelect={selectSection} />
        </div>

        <div className="min-w-0 space-y-10" style={{ maxWidth: "68ch" }}>
          {orderedSections.map((section, i) => (
            <article
              key={section.id}
              id={`section-${section.id}`}
              data-section-id={section.id}
              ref={(el) => { if (el) sectionRefs.current.set(section.id, el); else sectionRefs.current.delete(section.id); }}
              className="scroll-mt-20 rounded-lg border border-border bg-card p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">Seção {i + 1} de {orderedSections.length}</div>
              <h2 className="font-display mt-2 text-2xl text-primary">{section.title}</h2>
              <div className="apostila-content mt-6 text-sm leading-relaxed text-card-foreground">
                <BlockRenderer blocks={section.blocks.filter((b) => b.kind !== "cite" && b.kind !== "labref")} />
              </div>
            </article>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            {currentSection && <MarginRail section={currentSection} />}
          </div>
        </div>
      </div>
    </div>
  );
}
