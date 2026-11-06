import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, Sparkles, Target, XCircle } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import Markdown from "@/components/Markdown";
import { useChiron } from "@/lib/study/store";
import { useT } from "@/lib/i18n/I18nProvider";
import { addCard, recordAttempt } from "@/lib/study/service";
import type { Exercise, ExerciseLevel, ExerciseType, StudySource } from "@/lib/study/types";
import { EXERCISE_LEVEL_LABELS, EXERCISE_TYPE_LABELS } from "@/lib/study/types";
import {
  computeSessionStats,
  missedExercises,
  scoreMultipleChoice,
  scoreRubricFraction,
  scoreSelfGrade,
  selectExercises,
  type PracticeResult,
  type SelfGrade,
} from "@/lib/study/practice";
import { buildRubricGradingMessages, parseRubricVerdict, type RubricVerdict } from "@/lib/study/rubric";
import { streamChat } from "@/lib/ai/providers";
import { loadAiSettings } from "@/lib/ai/settings";
import OriginBadge, { originLabel } from "@/components/OriginBadge";

const SELF_GRADE_LABEL: Record<SelfGrade, string> = { incorrect: "Errei", partial: "Quase", correct: "Acertei" };
const COUNT_OPTIONS = [5, 10, 15, 20];

type Phase = "setup" | "running" | "results";

export default function Practice() {
  const t = useT();
  const L = t.chiron.practice;
  const { index, lib, replaceIndex } = useChiron();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlNodeId = searchParams.get("node");
  const nodeFromUrl = urlNodeId ? index.nodes.find((n) => n.id === urlNodeId) : undefined;

  const sourcesWithExercises = useMemo(
    () => index.sources.map((src) => ({ source: src, count: lib(src.id).exercises.length })).filter((s) => s.count > 0),
    [index.sources, lib],
  );

  const [phase, setPhase] = useState<Phase>("setup");
  const [sourceId, setSourceId] = useState(() => nodeFromUrl?.sourceId ?? sourcesWithExercises[0]?.source.id ?? "");
  const [nodeFilter, setNodeFilter] = useState(urlNodeId ?? "");
  const [level, setLevel] = useState<ExerciseLevel | "">("");
  const [count, setCount] = useState(10);
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
  const [runnerIdx, setRunnerIdx] = useState(0);
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [graded, setGraded] = useState(false);

  const currentLib = sourceId ? lib(sourceId) : null;
  const pool = useMemo(
    () => (currentLib ? selectExercises(currentLib.exercises, { nodeId: nodeFilter || undefined, level: level || undefined, count: Infinity }) : []),
    [currentLib, nodeFilter, level],
  );
  const nodesForSource = useMemo(() => index.nodes.filter((n) => n.sourceId === sourceId), [index.nodes, sourceId]);

  if (sourcesWithExercises.length === 0) {
    return (
      <EmptyPage
        icon={Target}
        lead={L.empty}
        milestone="Complete um mapa para gerar exercícios"
      />
    );
  }

  function startSession() {
    if (!currentLib) return;
    const chosen = selectExercises(currentLib.exercises, { nodeId: nodeFilter || undefined, level: level || undefined, count });
    setSessionExercises(chosen);
    setResults([]);
    setRunnerIdx(0);
    setGraded(false);
    setPhase("running");
  }

  function handleGraded(answer: string, scoreAwarded: number) {
    const exercise = sessionExercises[runnerIdx];
    const { index: next } = recordAttempt(index, { exerciseId: exercise.id, answer, scoreAwarded });
    replaceIndex(next);
    setResults((prev) => [...prev, { exercise, scoreAwarded }]);
    setGraded(true);
  }

  function advance() {
    if (runnerIdx < sessionExercises.length - 1) {
      setRunnerIdx((i) => i + 1);
      setGraded(false);
    } else {
      setPhase("results");
    }
  }

  function restart() {
    setPhase("setup");
  }

  if (phase === "setup") {
    return (
      <SessionSetup
        sourcesWithExercises={sourcesWithExercises}
        sourceId={sourceId}
        onSourceChange={(id) => { setSourceId(id); setNodeFilter(""); }}
        nodesForSource={nodesForSource}
        nodeFilter={nodeFilter}
        onNodeFilterChange={setNodeFilter}
        level={level}
        onLevelChange={setLevel}
        count={count}
        onCountChange={setCount}
        poolSize={pool.length}
        onStart={startSession}
      />
    );
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        results={results}
        index={index}
        onGenerateCards={() => {
          const missed = missedExercises(results);
          let next = index;
          for (const ex of missed) {
            next = addCard(next, { sourceId: ex.sourceId, nodeId: ex.nodeId, frontMd: ex.promptMd, backMd: ex.answerKeyMd }).index;
          }
          replaceIndex(next);
        }}
        onReviewSection={(nodeId, srcId) => navigate(`/apostila?source=${srcId}&node=${nodeId}`)}
        onRestart={restart}
      />
    );
  }

  const exercise = sessionExercises[runnerIdx];
  const attempts = index.attempts.filter((a) => a.exerciseId === exercise.id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Exercício {runnerIdx + 1} de {sessionExercises.length}</span>
          {attempts.length > 0 && <span>tentado {attempts.length}x antes</span>}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-secondary transition-[width] duration-300"
            style={{ width: `${(runnerIdx / sessionExercises.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-secondary">
            {EXERCISE_TYPE_LABELS[exercise.type]}
          </span>
          <span>{EXERCISE_LEVEL_LABELS[exercise.level]}</span>
          <span>·</span>
          <span>{exercise.points} pts</span>
        </div>

        <ExerciseRunner key={exercise.id} exercise={exercise} onGraded={handleGraded} />
      </div>

      {graded && (
        <button
          type="button"
          onClick={advance}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
        >
          {runnerIdx < sessionExercises.length - 1 ? "Próximo exercício" : "Ver resultado"}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ExerciseRunner({ exercise, onGraded }: { exercise: Exercise; onGraded: (answer: string, score: number) => void }) {
  if (exercise.type === 1) return <MultipleChoiceRunner exercise={exercise} onGraded={onGraded} />;
  if (exercise.type === 2) return <RubricRunner exercise={exercise} onGraded={onGraded} />;
  return <SelfGradeRunner exercise={exercise} onGraded={onGraded} />;
}

function MultipleChoiceRunner({ exercise, onGraded }: { exercise: Exercise; onGraded: (answer: string, score: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!selected) return;
    setSubmitted(true);
    onGraded(selected, scoreMultipleChoice(exercise, selected));
  }

  return (
    <div className="space-y-3">
      <div className="text-sm leading-relaxed text-card-foreground"><Markdown text={exercise.promptMd} /></div>

      <div className="space-y-1.5">
        {(exercise.choices ?? []).map((c) => (
          <label
            key={c}
            className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
              submitted
                ? c === exercise.answerKeyMd
                  ? "border-green-500/50 bg-green-500/10"
                  : c === selected
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border opacity-50"
                : selected === c
                  ? "border-secondary bg-secondary/5"
                  : "border-border hover:bg-accent"
            }`}
          >
            <input
              type="radio"
              name={exercise.id}
              checked={selected === c}
              onChange={() => setSelected(c)}
              disabled={submitted}
              className="sr-only"
            />
            <span className="flex-1">{c}</span>
            {submitted && c === exercise.answerKeyMd && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />}
            {submitted && c === selected && c !== exercise.answerKeyMd && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
          </label>
        ))}
      </div>

      {!submitted && (
        <button
          type="button"
          onClick={submit}
          disabled={!selected}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90 disabled:opacity-30"
        >
          Responder
        </button>
      )}
      {submitted && (
        <div className={`text-sm font-medium ${selected === exercise.answerKeyMd ? "text-green-400" : "text-destructive"}`}>
          {selected === exercise.answerKeyMd ? `Certo! +${exercise.points} pts` : "Não foi dessa vez — resposta certa em verde."}
        </div>
      )}
    </div>
  );
}

function RubricRunner({ exercise, onGraded }: { exercise: Exercise; onGraded: (answer: string, score: number) => void }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "grading" | "done" | "error">("idle");
  const [verdict, setVerdict] = useState<RubricVerdict | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function submit() {
    if (!answer.trim()) return;
    setStatus("grading");
    try {
      const settings = loadAiSettings();
      const raw = await streamChat(settings, buildRubricGradingMessages(exercise, answer), () => {});
      const v = parseRubricVerdict(raw);
      setVerdict(v);
      setStatus("done");
      onGraded(answer, scoreRubricFraction(exercise, v.fraction));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao avaliar por IA");
      setStatus("error");
    }
  }

  function selfGradeInstead(grade: SelfGrade) {
    setStatus("done");
    onGraded(answer, scoreSelfGrade(exercise, grade));
  }

  const locked = status === "grading" || status === "done";

  return (
    <div className="space-y-3">
      <div className="text-sm leading-relaxed text-card-foreground"><Markdown text={exercise.promptMd} /></div>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={locked}
        placeholder="Sua resposta..."
        rows={5}
        className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
      />

      {status === "idle" && (
        <button
          type="button"
          onClick={submit}
          disabled={!answer.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90 disabled:opacity-30"
        >
          <Sparkles className="h-3.5 w-3.5" /> Responder (avaliação por IA)
        </button>
      )}
      {status === "grading" && <div className="text-xs text-muted-foreground">Aetheris está avaliando sua resposta...</div>}
      {status === "error" && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs">
          <div className="text-destructive">{errorMsg} — não foi possível avaliar por IA. Classifique você mesmo:</div>
          <div className="mt-2 text-muted-foreground">Resposta esperada: {exercise.answerKeyMd}</div>
          <div className="mt-2 flex gap-2">
            {(["incorrect", "partial", "correct"] as SelfGrade[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => selfGradeInstead(g)}
                className="rounded-md border border-border px-3 py-1.5 text-card-foreground transition-colors hover:bg-accent"
              >
                {SELF_GRADE_LABEL[g]}
              </button>
            ))}
          </div>
        </div>
      )}
      {status === "done" && verdict && (
        <div className="rounded-md border border-green-500/20 bg-green-500/5 p-3 text-sm">
          <div className="flex items-center gap-1.5 text-green-400">
            <CheckCircle2 className="h-4 w-4" /> Nota: {Math.round(verdict.fraction * 100)}%
          </div>
          <div className="mt-1 text-muted-foreground">{verdict.feedback}</div>
        </div>
      )}
    </div>
  );
}

function SelfGradeRunner({ exercise, onGraded }: { exercise: Exercise; onGraded: (answer: string, score: number) => void }) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(false);

  function grade(g: SelfGrade) {
    setGraded(true);
    onGraded(answer, scoreSelfGrade(exercise, g));
  }

  return (
    <div className="space-y-3">
      <div className="text-sm leading-relaxed text-card-foreground"><Markdown text={exercise.promptMd} /></div>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={revealed}
        placeholder="Sua resposta..."
        rows={5}
        className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
      />

      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={!answer.trim()}
          className="rounded-lg border border-border px-4 py-2 text-sm text-card-foreground transition-colors hover:bg-accent disabled:opacity-30"
        >
          Revelar resposta
        </button>
      )}

      {revealed && (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">
          <div className="text-[11px] font-medium uppercase tracking-wide text-secondary">Resposta esperada</div>
          <div className="mt-1 text-card-foreground"><Markdown text={exercise.answerKeyMd} /></div>
        </div>
      )}

      {revealed && !graded && (
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">Como você se saiu?</div>
          <div className="flex gap-2">
            {(["incorrect", "partial", "correct"] as SelfGrade[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => grade(g)}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-card-foreground transition-colors hover:bg-accent"
              >
                {SELF_GRADE_LABEL[g]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionSetup({
  sourcesWithExercises,
  sourceId,
  onSourceChange,
  nodesForSource,
  nodeFilter,
  onNodeFilterChange,
  level,
  onLevelChange,
  count,
  onCountChange,
  poolSize,
  onStart,
}: {
  sourcesWithExercises: { source: Pick<StudySource, "id" | "name" | "contentOrigin">; count: number }[];
  sourceId: string;
  onSourceChange: (id: string) => void;
  nodesForSource: { id: string; title: string }[];
  nodeFilter: string;
  onNodeFilterChange: (id: string) => void;
  level: ExerciseLevel | "";
  onLevelChange: (level: ExerciseLevel | "") => void;
  count: number;
  onCountChange: (n: number) => void;
  poolSize: number;
  onStart: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex flex-wrap gap-2">
        {sourcesWithExercises.map(({ source, count: c }) => (
          <span key={source.id} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-card-foreground">
            {source.name} · {c} exercícios <OriginBadge origin={source.contentOrigin} compact />
          </span>
        ))}
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Fonte</label>
          <select
            value={sourceId}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            {sourcesWithExercises.map(({ source }) => (
              <option key={source.id} value={source.id}>{source.name} · {originLabel(source.contentOrigin) ?? ""}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Nó (opcional)</label>
          <select
            value={nodeFilter}
            onChange={(e) => onNodeFilterChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">Todos os nós</option>
            {nodesForSource.map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Nível (opcional)</label>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as ExerciseLevel | "")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">Todos os níveis</option>
            {(Object.keys(EXERCISE_LEVEL_LABELS) as ExerciseLevel[]).map((lvl) => (
              <option key={lvl} value={lvl}>{EXERCISE_LEVEL_LABELS[lvl]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Quantidade de exercícios</label>
          <div className="flex gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onCountChange(n)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  count === n ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-card-foreground hover:bg-accent"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">{poolSize} exercício{poolSize === 1 ? "" : "s"} disponíve{poolSize === 1 ? "l" : "is"} com esses filtros</div>

        <button
          type="button"
          onClick={onStart}
          disabled={poolSize === 0}
          className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90 disabled:opacity-30"
        >
          Iniciar sessão ({Math.min(count, poolSize)} exercícios)
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({
  results,
  index,
  onGenerateCards,
  onReviewSection,
  onRestart,
}: {
  results: PracticeResult[];
  index: { nodes: { id: string; title: string; sourceId: string }[] };
  onGenerateCards: () => void;
  onReviewSection: (nodeId: string, sourceId: string) => void;
  onRestart: () => void;
}) {
  const [cardsGenerated, setCardsGenerated] = useState(false);
  const stats = computeSessionStats(results);
  const weakestNode = stats.weakestNodeId ? index.nodes.find((n) => n.id === stats.weakestNodeId) : undefined;
  const missed = missedExercises(results);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Target className="mx-auto h-8 w-8 text-secondary" />
        <h3 className="mt-3 font-display text-lg text-card-foreground">Sessão completa!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.totalPoints} de {stats.maxPoints} pontos · {Math.round(stats.accuracy * 100)}% de acerto
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Acerto por tipo</div>
        <div className="space-y-1.5">
          {(Object.entries(stats.accuracyByType) as [string, number][]).map(([type, acc]) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <span className="text-card-foreground">{EXERCISE_TYPE_LABELS[Number(type) as ExerciseType]}</span>
              <span className="text-muted-foreground">{Math.round(acc * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {weakestNode && (
        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-secondary">Conceito mais fraco</div>
          <div className="mt-1 text-sm text-card-foreground">{weakestNode.title}</div>
          <button
            type="button"
            onClick={() => onReviewSection(weakestNode.id, weakestNode.sourceId)}
            className="mt-2 text-xs text-secondary hover:underline"
          >
            Revisar a seção
          </button>
        </div>
      )}

      {missed.length > 0 && (
        <button
          type="button"
          onClick={() => { onGenerateCards(); setCardsGenerated(true); }}
          disabled={cardsGenerated}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {cardsGenerated ? `${missed.length} cards gerados` : `Gerar ${missed.length} cards dos erros`}
        </button>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
      >
        Nova sessão
      </button>
    </div>
  );
}
