import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Target, XCircle } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import { recordAttempt } from "@/lib/study/service";
import type { Exercise } from "@/lib/study/types";
import { EXERCISE_TYPE_LABELS, EXERCISE_LEVEL_LABELS } from "@/lib/study/types";

export default function Practice() {
  const t = useT();
  const L = t.chiron.practice;
  const { index, lib, replaceIndex } = useChiron();
  const [searchParams] = useSearchParams();
  const selectedNodeId = searchParams.get("node");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const sourceId = index.sources[0]?.id;
  const currentLib = sourceId ? lib(sourceId) : null;
  const exercises = currentLib?.exercises ?? [];

  const filtered = useMemo(
    () => selectedNodeId ? exercises.filter((e) => e.nodeId === selectedNodeId) : exercises,
    [exercises, selectedNodeId],
  );

  if (exercises.length === 0) {
    return (
      <EmptyPage
        icon={Target}
        eyebrow={L.eyebrow}
        title={L.title}
        lead={L.empty}
        milestone="Complete um mapa para gerar exercícios"
      />
    );
  }

  function handleSubmit(exerciseId: string) {
    const { index: next } = recordAttempt(index, {
      exerciseId,
      answer: answers[exerciseId] ?? "",
      scoreAwarded: 0,
    });
    replaceIndex(next);
    setSubmitted((prev) => ({ ...prev, [exerciseId]: true }));
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{L.eyebrow}</div>
        <h1 className="font-display mt-1.5 text-4xl text-primary">{L.title}</h1>
      </header>

      {index.sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {index.sources.map((src) => (
            <span
              key={src.id}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-card-foreground"
            >
              {src.name} · {exercises.filter((e) => e.sourceId === src.id).length} exercícios
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum exercício para este nó.
          </div>
        )}
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            answer={answers[ex.id] ?? ""}
            submitted={submitted[ex.id] ?? false}
            onAnswerChange={(v) => setAnswers((p) => ({ ...p, [ex.id]: v }))}
            onSubmit={() => handleSubmit(ex.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  answer,
  submitted,
  onAnswerChange,
  onSubmit,
}: {
  exercise: Exercise;
  answer: string;
  submitted: boolean;
  onAnswerChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className={`rounded-lg border p-4 ${submitted ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"}`}>
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-secondary">
          {EXERCISE_TYPE_LABELS[exercise.type as keyof typeof EXERCISE_TYPE_LABELS]}
        </span>
        <span>{EXERCISE_LEVEL_LABELS[exercise.level]}</span>
        <span>·</span>
        <span>{exercise.points} pts</span>
      </div>

      <div className="mb-3 text-sm leading-relaxed text-card-foreground">
        {exercise.promptMd}
      </div>

      {exercise.choices && exercise.choices.length > 0 ? (
        <div className="space-y-1.5">
          {exercise.choices.map((c, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                submitted
                  ? c === exercise.answerKeyMd
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-border opacity-50"
                  : answer === c
                    ? "border-secondary bg-secondary/5"
                    : "border-border hover:bg-accent"
              }`}
            >
              <input
                type="radio"
                name={exercise.id}
                value={c}
                checked={answer === c}
                onChange={() => onAnswerChange(c)}
                disabled={submitted}
                className="sr-only"
              />
              {c}
              {submitted && c === exercise.answerKeyMd && (
                <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-400" />
              )}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={submitted}
          placeholder="Sua resposta..."
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
        />
      )}

      {submitted && (
        <div className="mt-3 rounded-md border border-green-500/20 bg-green-500/5 p-3 text-sm">
          <div className="flex items-center gap-1.5 text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            Resposta esperada
          </div>
          <div className="mt-1 text-muted-foreground">{exercise.answerKeyMd}</div>
        </div>
      )}

      {!submitted && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!answer.trim()}
          className="mt-3 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90 disabled:opacity-30"
        >
          Responder
        </button>
      )}
    </div>
  );
}
