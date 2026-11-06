/** Orchestrates one ingestion run: GitHub fetch → AI drafting passes →
 *  DraftDocument the user reviews before anything touches the real domain.
 *  This is the piece PLANO.md §F1.5 calls out as "confirmed in scope this
 *  round" — the pipeline already existed (fetcher.ts/passes.ts/drafts.ts) but
 *  no page ever called it end to end. This does.
 *
 *  Split from `materialize.ts` on purpose: fetching + AI drafting is
 *  network/AI-dependent and cannot be unit tested without a live key, while
 *  turning approved drafts into real domain documents is a pure transform
 *  and is (see materialize.test.ts). Keeping them in separate files means the
 *  half that *can* be tested actually gets tested. */
import { parseRepoUrl, fetchDefaultBranch, fetchRepoTree, fetchReadme } from "./fetcher";
import { generateMap, generateSections, generateExercises, generateCards } from "./passes";
import {
  freshDrafts, addDraftFromNode, addDraftFromSection, addDraftFromExercise, addDraftFromCard,
  type DraftDocument,
} from "./drafts";

export interface IngestionProgress {
  stage: "fetching" | "map" | "sections" | "exercises" | "cards" | "done";
  detail?: string;
}

export interface IngestionResult {
  ok: boolean;
  drafts: DraftDocument;
  filesFetched: number;
  hadReadme: boolean;
  error?: string;
}

/** Fetches a public GitHub repo and runs all four AI drafting passes against
 *  it, folding every proposal into one DraftDocument. Nothing here writes to
 *  the real ChironIndex/ChironLib — that only happens once the user approves
 *  drafts and `materializeDrafts` (materialize.ts) runs.
 *
 *  Each AI pass is independent: a failure in one (e.g. `generateExercises`
 *  erroring) doesn't abort the run — the failed pass just contributes zero
 *  drafts of its kind, and the caller sees it via IngestionResult.error being
 *  set to the *first* failure while everything that did succeed still lands
 *  as reviewable drafts. Losing all exercises because cards happened to fail
 *  would be a worse experience than a partial result. */
export async function runIngestion(
  sourceId: string,
  repoUrl: string,
  language: string,
  onProgress?: (p: IngestionProgress) => void,
  githubToken?: string,
): Promise<IngestionResult> {
  const info = parseRepoUrl(repoUrl);
  if (!info) {
    return { ok: false, drafts: freshDrafts(sourceId), filesFetched: 0, hadReadme: false, error: "URL do GitHub inválida" };
  }

  onProgress?.({ stage: "fetching", detail: `${info.owner}/${info.repo}` });

  let branch: string;
  try {
    branch = await fetchDefaultBranch(info.owner, info.repo, githubToken);
  } catch (err) {
    return {
      ok: false, drafts: freshDrafts(sourceId), filesFetched: 0, hadReadme: false,
      error: err instanceof Error ? err.message : "Falha ao acessar o repositório",
    };
  }

  const [files, readme] = await Promise.all([
    fetchRepoTree(info.owner, info.repo, branch, githubToken),
    fetchReadme(info.owner, info.repo, branch, githubToken),
  ]);

  if (files.length === 0) {
    return {
      ok: false, drafts: freshDrafts(sourceId), filesFetched: 0, hadReadme: !!readme,
      error: "Nenhum arquivo-fonte reconhecido neste repositório",
    };
  }

  let doc = freshDrafts(sourceId);
  let firstError: string | undefined;

  onProgress?.({ stage: "map" });
  const mapResult = await generateMap(files, readme, { language });
  if (mapResult.success) {
    for (const node of mapResult.data) doc = addDraftFromNode(doc, sourceId, node);
  } else {
    firstError ??= mapResult.error;
  }

  onProgress?.({ stage: "sections" });
  const sectionsResult = await generateSections(files, mapResult.data, { language });
  if (sectionsResult.success) {
    for (const section of sectionsResult.data) doc = addDraftFromSection(doc, sourceId, section);
  } else {
    firstError ??= sectionsResult.error;
  }

  onProgress?.({ stage: "exercises" });
  const exercisesResult = await generateExercises(files, mapResult.data, { language });
  if (exercisesResult.success) {
    for (const exercise of exercisesResult.data) doc = addDraftFromExercise(doc, sourceId, exercise);
  } else {
    firstError ??= exercisesResult.error;
  }

  onProgress?.({ stage: "cards" });
  const cardsResult = await generateCards(files, mapResult.data, { language });
  if (cardsResult.success) {
    for (const card of cardsResult.data) doc = addDraftFromCard(doc, sourceId, card);
  } else {
    firstError ??= cardsResult.error;
  }

  onProgress?.({ stage: "done" });

  return {
    ok: doc.drafts.length > 0,
    drafts: doc,
    filesFetched: files.length,
    hadReadme: !!readme,
    error: doc.drafts.length === 0 ? firstError : undefined,
  };
}
