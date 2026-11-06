import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Brain, Clock, Download, ExternalLink, Repeat, Target, X } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import { reviewCard } from "@/lib/study/service";
import { cardsDue } from "@/lib/study/srs";
import type { SM2Grade } from "@/lib/study/srs";
import { today } from "@/lib/study/types";
import { cardsToAnkiCards, downloadTSV } from "@/lib/anki/export";
import OriginBadge from "@/components/OriginBadge";
import {
  computeRetention,
  formatInterval,
  gradeForButton,
  predictIntervalDays,
  REVIEW_BUTTON_LABEL,
  REVIEW_BUTTONS,
  type ReviewButton,
} from "@/lib/study/review";

export default function Review() {
  const t = useT();
  const L = t.chiron.review;
  const { index, lib, replaceIndex } = useChiron();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const nodeFilter = searchParams.get("node");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [grades, setGrades] = useState<SM2Grade[]>([]);
  const [startedAt] = useState(() => Date.now());

  const todayStr = today();
  const dueCount = cardsDue(index.cards, todayStr);
  const pendingCards = useMemo(
    () => index.cards.filter((c) =>
      c.dueDate <= todayStr && !completedIds.has(c.id) && (!nodeFilter || c.nodeId === nodeFilter),
    ),
    [index.cards, todayStr, completedIds, nodeFilter],
  );
  const totalInQueue = completedIds.size + pendingCards.length;
  const currentCard = pendingCards[currentIdx];

  const currentSource = currentCard ? index.sources.find((s) => s.id === currentCard.sourceId) : undefined;
  const currentLib = currentCard ? lib(currentCard.sourceId) : null;
  const currentSection = currentCard && currentLib ? currentLib.sections.find((s) => s.nodeId === currentCard.nodeId) : undefined;
  const currentChapter = currentSection && currentLib ? currentLib.chapters.find((c) => c.id === currentSection.chapterId) : undefined;

  function handleGrade(button: ReviewButton) {
    if (!currentCard) return;
    const grade = gradeForButton(button);
    const next = reviewCard(index, currentCard.id, grade);
    replaceIndex(next);
    setGrades((prev) => [...prev, grade]);
    setCompletedIds((prev) => new Set(prev).add(currentCard.id));
    setFlipped(false);
    if (currentIdx < pendingCards.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  }

  // Keyboard: space flips the card, 1-4 grade it (only once flipped, matching
  // Anki's own convention — you shouldn't be able to grade recall you haven't
  // actually attempted yet).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (!currentCard) return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (flipped && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        handleGrade(REVIEW_BUTTONS[Number(e.key) - 1]);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard, flipped]);

  function handleExport() {
    const ankiCards = cardsToAnkiCards(index.cards, "chiron");
    downloadTSV(ankiCards, "chiron-cards.tsv");
  }

  if (index.cards.length === 0) {
    return (
      <EmptyPage
        icon={Repeat}
        lead={L.empty}
        milestone="Nenhuma revisão pendente"
      />
    );
  }

  const sessionDone = totalInQueue > 0 && !currentCard;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{completedIds.size}/{totalInQueue} revisados nesta fila · {dueCount} pendentes no total</span>
            {nodeFilter && (
              <button
                type="button"
                onClick={() => setSearchParams((p) => { p.delete("node"); return p; })}
                className="flex items-center gap-1 rounded-full border border-secondary/40 bg-secondary/10 px-2 py-0.5 text-secondary"
              >
                filtrado por nó <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {totalInQueue > 0 && (
            <div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-secondary transition-[width] duration-300"
                style={{ width: `${(completedIds.size / totalInQueue) * 100}%` }}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-card-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar para Anki
        </button>
      </div>

      <div className="mx-auto max-w-2xl">
        {currentCard ? (
          <div className="space-y-4">
            {(currentSource || currentChapter) && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  {currentSource?.name}
                  <OriginBadge origin={currentSource?.contentOrigin} compact />
                  {currentChapter && <> · {currentChapter.title}</>}
                </span>
                {currentSection && (
                  <button
                    type="button"
                    onClick={() => navigate(`/apostila?source=${currentCard.sourceId}&node=${currentCard.nodeId}`)}
                    className="flex items-center gap-1 text-secondary hover:underline"
                  >
                    Ver na apostila <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            <div className="relative min-h-[200px] cursor-pointer [perspective:1200px]" onClick={() => setFlipped(!flipped)}>
              <div
                className={`relative h-full min-h-[200px] transition-transform duration-300 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
              >
                <div className="absolute inset-0 rounded-xl border border-border bg-card p-8 [backface-visibility:hidden]">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">Frente · espaço ou toque para virar</div>
                  <div className="mt-4 text-lg leading-relaxed text-card-foreground">{currentCard.frontMd}</div>
                </div>
                <div className="absolute inset-0 rounded-xl border border-border bg-card p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">Resposta · espaço ou toque para virar</div>
                  <div className="mt-4 text-lg leading-relaxed text-card-foreground">{currentCard.backMd}</div>
                </div>
              </div>
            </div>

            {flipped && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Como foi sua resposta?</div>
                <div className="grid grid-cols-4 gap-2">
                  {REVIEW_BUTTONS.map((button, i) => (
                    <button
                      key={button}
                      type="button"
                      onClick={() => handleGrade(button)}
                      className="flex flex-col items-center gap-0.5 rounded-lg border border-border px-2 py-2.5 text-xs text-card-foreground transition-colors hover:bg-accent"
                    >
                      <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                      <span className="font-medium">{REVIEW_BUTTON_LABEL[button]}</span>
                      <span className="text-secondary">{formatInterval(predictIntervalDays(currentCard, button, todayStr))}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Ease: {currentCard.ease.toFixed(1)}</span>
              <span>Intervalo: {currentCard.intervalDays}d</span>
              <span>Repetições: {currentCard.reps}</span>
              <span>Lapsos: {currentCard.lapses}</span>
            </div>
          </div>
        ) : sessionDone ? (
          <SessionSummary
            grades={grades}
            elapsedMs={Date.now() - startedAt}
            cards={index.cards}
            todayStr={todayStr}
          />
        ) : (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
            <Brain className="mx-auto h-8 w-8 text-green-400" />
            <h3 className="mt-3 font-display text-lg text-green-400">Nenhuma revisão pendente</h3>
            <p className="mt-1 text-sm text-muted-foreground">Volte amanhã para a próxima revisão.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionSummary({
  grades,
  elapsedMs,
  cards,
  todayStr,
}: {
  grades: SM2Grade[];
  elapsedMs: number;
  cards: { dueDate: string }[];
  todayStr: string;
}) {
  const retention = computeRetention(grades);
  const minutes = Math.max(1, Math.round(elapsedMs / 60000));
  const tomorrow = new Date(todayStr);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(todayStr);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const dueTomorrow = cards.filter((c) => c.dueDate === tomorrow.toISOString().split("T")[0]).length;
  const dueThisWeek = cards.filter((c) => c.dueDate > todayStr && c.dueDate <= nextWeek.toISOString().split("T")[0]).length;

  return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
      <Brain className="mx-auto h-8 w-8 text-green-400" />
      <h3 className="mt-3 font-display text-lg text-green-400">Sessão completa!</h3>
      <p className="mt-1 text-sm text-muted-foreground">Você revisou {grades.length} cards.</p>

      <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 text-left">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Target className="h-3.5 w-3.5" /> Retenção</div>
          <div className="mt-1 font-display text-xl text-card-foreground">{Math.round(retention * 100)}%</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Tempo</div>
          <div className="mt-1 font-display text-xl text-card-foreground">{minutes} min</div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Próximas revisões: {dueTomorrow} amanhã · {dueThisWeek} nos próximos 7 dias
      </p>
    </div>
  );
}
