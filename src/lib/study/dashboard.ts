// Pure derived-data functions for the F4 dashboard — kept separate from the
// components so every widget's numbers are unit-testable without rendering
// anything, the same split the rest of lib/study/ already uses.
import type { Chapter, ChironIndex, ChironLib, MapNode, SessionBlock, StudySource } from "./types";
import { today } from "./types";

function dateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// ── Activity (theory vs practice, N days) ──────────────────────────────
export interface DayActivity {
  date: string;
  theoryMin: number;
  practiceMin: number;
}

/** "Theory" is time spent reading (the `read` session block); "practice" is
 *  exercises + reviews together — the two things a session actually asks you
 *  to *do* versus the one thing it asks you to absorb. */
export function computeActivitySeries(index: ChironIndex, days = 30): DayActivity[] {
  const byDate = new Map<string, { theory: number; practice: number }>();
  for (const session of index.sessions) {
    const entry = byDate.get(session.date) ?? { theory: 0, practice: 0 };
    for (const block of session.blocks) {
      if (block.kind === "read") entry.theory += block.estMin;
      else entry.practice += block.estMin;
    }
    byDate.set(session.date, entry);
  }

  const out: DayActivity[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dateStr = dateNDaysAgo(i);
    const entry = byDate.get(dateStr);
    out.push({ date: dateStr, theoryMin: entry?.theory ?? 0, practiceMin: entry?.practice ?? 0 });
  }
  return out;
}

// ── Retention (first-try recall vs lapses, by week) ────────────────────
export interface WeekRetention {
  weekStart: string;
  firstTryCorrect: number;
  lapses: number;
  recallRate: number; // 0..1, correct / (correct + lapses); null-safe via 0 when no reviews
}

/** Buckets `reviewLog` into 7-day windows ending today, oldest first — real
 *  history, not a guess: grade >= 3 is SM-2's own threshold for "recalled"
 *  (see srs.ts's GRADES table), so a lapse here is exactly a lapse there. */
export function computeWeeklyRetention(index: ChironIndex, weeks = 8): WeekRetention[] {
  const buckets: WeekRetention[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = dateNDaysAgo(w * 7);
    const start = dateNDaysAgo(w * 7 + 6);
    const entries = index.reviewLog.filter((e) => e.date >= start && e.date <= end);
    const firstTryCorrect = entries.filter((e) => e.grade >= 3).length;
    const lapses = entries.filter((e) => e.grade < 3).length;
    const total = firstTryCorrect + lapses;
    buckets.push({ weekStart: start, firstTryCorrect, lapses, recallRate: total > 0 ? firstTryCorrect / total : 0 });
  }
  return buckets;
}

// ── Weakest nodes ───────────────────────────────────────────────────────
export interface WeakNode {
  node: MapNode;
  sourceName: string;
}

export function computeWeakestNodes(index: ChironIndex, limit = 5): WeakNode[] {
  const sourceName = (id: string) => index.sources.find((s) => s.id === id)?.name ?? id;
  return [...index.nodes]
    .filter((n) => n.mastery < 4)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, limit)
    .map((node) => ({ node, sourceName: sourceName(node.sourceId) }));
}

// ── Next in queue (due review / next unread section) ───────────────────
export type QueueItemKind = "review" | "section";

export interface QueueItem {
  kind: QueueItemKind;
  label: string;
  sourceName: string;
  href: string;
}

/** Mixes the two real "what's next" signals the domain already has: cards
 *  whose `dueDate` has arrived, and the earliest unread section (no
 *  `readAt`) per source, ordered the same way the apostila reader would hit
 *  them. Exercises aren't included — there's no "already attempted" flag on
 *  `Exercise` itself (only a log of `Attempt`s elsewhere), so "next
 *  exercise" isn't a real signal without also diffing against attempts,
 *  which the plan's exercise runner (F7) will actually need to do properly. */
export function computeNextInQueue(index: ChironIndex, libs: Record<string, ChironLib>, limit = 4): QueueItem[] {
  const sourceName = (id: string) => index.sources.find((s) => s.id === id)?.name ?? id;
  const todayStr = today();

  const dueReviews: QueueItem[] = [...index.cards]
    .filter((c) => c.dueDate <= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((c) => ({ kind: "review" as const, label: c.frontMd, sourceName: sourceName(c.sourceId), href: "/review" }));

  const nextSections: QueueItem[] = [];
  for (const source of index.sources) {
    const lib = libs[source.id];
    if (!lib) continue;
    const unread = [...lib.sections].sort((a, b) => a.order - b.order).find((s) => !s.readAt);
    if (unread) {
      nextSections.push({ kind: "section", label: unread.title, sourceName: source.name, href: `/apostila` });
    }
  }

  // Interleave so the queue isn't all reviews before any reading — reviews
  // are more urgent (they have a real due date) but reading shouldn't be
  // buried every time there happen to be several cards due.
  const merged: QueueItem[] = [];
  let ri = 0, si = 0;
  while (merged.length < limit && (ri < dueReviews.length || si < nextSections.length)) {
    if (ri < dueReviews.length) merged.push(dueReviews[ri++]);
    if (merged.length < limit && si < nextSections.length) merged.push(nextSections[si++]);
  }
  return merged.slice(0, limit);
}

// ── Mastery by source ───────────────────────────────────────────────────
export interface SourceMastery {
  source: StudySource;
  pct: number;
}

export function computeMasteryBySource(index: ChironIndex): SourceMastery[] {
  return index.sources
    .map((source) => {
      const nodes = index.nodes.filter((n) => n.sourceId === source.id);
      const pct = nodes.length === 0 ? 0 : nodes.reduce((acc, n) => acc + n.mastery, 0) / (nodes.length * 4);
      return { source, pct };
    })
    .sort((a, b) => b.pct - a.pct);
}

// ── Next chapter for a stack/tool source card ───────────────────────────
/** The lowest-order chapter that isn't fully mastered yet — real progress,
 *  not just "chapter 1 always" — determined by cross-referencing each
 *  chapter's sections back to their nodes' mastery. `null` means every
 *  chapter's nodes are already at mastery 4 (or the source has no chapters
 *  yet at all). */
export function computeNextChapter(lib: ChironLib, index: ChironIndex): Chapter | null {
  const sorted = [...lib.chapters].sort((a, b) => a.order - b.order);
  for (const chapter of sorted) {
    const sectionIds = new Set(chapter.sectionIds);
    const nodeIds = new Set(lib.sections.filter((s) => sectionIds.has(s.id)).map((s) => s.nodeId));
    const nodes = index.nodes.filter((n) => nodeIds.has(n.id));
    if (nodes.length === 0 || nodes.some((n) => n.mastery < 4)) return chapter;
  }
  return null;
}

// ── Mastery distribution (unseen → mastered), for the donut ────────────
export function computeMasteryDistribution(index: ChironIndex): number[] {
  const counts = [0, 0, 0, 0, 0];
  for (const n of index.nodes) counts[n.mastery]++;
  return counts;
}

// ── Session block plan ───────────────────────────────────────────────────

/** Splits a budget into review/read/exercise blocks. Review gets sized to
 *  the real due queue (2min/card is a rough SM-2 flashcard pace, capped so
 *  a huge backlog doesn't eat the whole session), reading gets a fixed
 *  third, and whatever's left goes to exercises — never negative, since
 *  review is capped below the budget before read is subtracted. */
export function planSessionBlocks(budgetMin: number, dueCount: number): SessionBlock[] {
  const reviewMin = Math.min(dueCount * 2, Math.round(budgetMin * 0.4));
  const readMin = Math.round(budgetMin * 0.35);
  const exerciseMin = Math.max(0, budgetMin - reviewMin - readMin);
  const blocks: SessionBlock[] = [];
  if (reviewMin > 0) blocks.push({ kind: "review", refId: "planned", estMin: reviewMin, done: false });
  if (readMin > 0) blocks.push({ kind: "read", refId: "planned", estMin: readMin, done: false });
  if (exerciseMin > 0) blocks.push({ kind: "exercise", refId: "planned", estMin: exerciseMin, done: false });
  return blocks;
}

// ── Queue sparkline: how many cards come due each of the next N days ───
export function computeUpcomingDue(index: ChironIndex, days = 14): number[] {
  const out: number[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    out.push(index.cards.filter((c) => c.dueDate === dateStr).length);
  }
  return out;
}
