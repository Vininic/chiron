// Generation drafts live only in this browser until published: a half-written
// book is the person's scratch work, not study data, so it stays out of the
// persisted document (persistence.ts) and the cloud row. A full draft is a few
// hundred KB — far under the quota now that the catalog is not stored.
import type { GenerationDraft } from "./generator";

const KEY = "chiron.generation-drafts.v1";

export function loadDrafts(): GenerationDraft[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? (parsed as GenerationDraft[]) : [];
  } catch {
    return [];
  }
}

function write(drafts: GenerationDraft[]): string | null {
  try {
    localStorage.setItem(KEY, JSON.stringify(drafts));
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Falha ao salvar o rascunho";
  }
}

/** Inserts or replaces by id, newest first. Returns an error message when the
 *  browser refused the write, so the page can say so instead of losing work. */
export function saveDraft(draft: GenerationDraft): { drafts: GenerationDraft[]; error: string | null } {
  const drafts = [draft, ...loadDrafts().filter((d) => d.id !== draft.id)];
  return { drafts, error: write(drafts) };
}

export function deleteDraft(id: string): GenerationDraft[] {
  const drafts = loadDrafts().filter((d) => d.id !== id);
  write(drafts);
  return drafts;
}
