import { useState } from "react";
import { Brain, Download, Repeat } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import { reviewCard } from "@/lib/study/service";
import { cardsDue, gradeLabel, type SM2Grade } from "@/lib/study/srs";
import { today } from "@/lib/study/types";
import { cardsToAnkiCards, downloadTSV } from "@/lib/anki/export";

export default function Review() {
  const t = useT();
  const L = t.chiron.review;
  const { index, replaceIndex } = useChiron();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const todayStr = today();
  const dueCount = cardsDue(index.cards, todayStr);
  const pendingCards = index.cards.filter((c) => c.dueDate <= todayStr && !completedIds.has(c.id));
  const currentCard = pendingCards[currentIdx];

  function handleGrade(grade: SM2Grade) {
    if (!currentCard) return;
    const next = reviewCard(index, currentCard.id, grade);
    replaceIndex(next);
    setCompletedIds((prev) => new Set(prev).add(currentCard.id));
    setFlipped(false);
    if (currentIdx < pendingCards.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  }

  function handleExport() {
    const ankiCards = cardsToAnkiCards(index.cards, "chiron");
    downloadTSV(ankiCards, "chiron-cards.tsv");
  }

  if (index.cards.length === 0) {
    return (
      <EmptyPage
        icon={Repeat}
        eyebrow={L.eyebrow}
        title={L.title}
        lead={L.empty}
        milestone="Nenhuma revisão pendente"
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
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-card-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar para Anki
        </button>
      </header>

      <div className="text-xs text-muted-foreground">
        {completedIds.size} revisados · {pendingCards.length} restantes · {dueCount} pendentes no total · {index.cards.length} cards no total
      </div>

      <div className="mx-auto max-w-2xl">
        {currentCard ? (
          <div className="space-y-4">
            <div
              className="min-h-[200px] cursor-pointer rounded-xl border border-border bg-card p-8 transition-colors hover:bg-accent"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">
                {flipped ? "Resposta" : "Frente"} · toque para virar
              </div>
              <div className="mt-4 text-lg leading-relaxed text-card-foreground">
                {flipped ? currentCard.backMd : currentCard.frontMd}
              </div>
            </div>

            {flipped && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Como foi sua resposta?</div>
                <div className="grid grid-cols-3 gap-2">
                  {([0, 1, 2, 3, 4, 5] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleGrade(grade)}
                      className="rounded-lg border border-border px-3 py-2 text-xs text-card-foreground transition-colors hover:bg-accent"
                    >
                      {grade} — {gradeLabel(grade)}
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
        ) : (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
            <Brain className="mx-auto h-8 w-8 text-green-400" />
            <h3 className="mt-3 font-display text-lg text-green-400">Sessão completa!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Você revisou {completedIds.size} cards. Volte amanhã para a próxima revisão.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
