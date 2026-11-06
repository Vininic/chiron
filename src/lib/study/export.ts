// Full-data exports for the profile dialog's "dados" section — separate from
// lib/anki/export.ts, which only ever shapes *cards* for Anki import. These
// two exist because "export my data" (a complete backup) and "export my
// cards to Anki" (a specific external tool's format) are different intents
// that happen to overlap on one field (cards) — conflating them would mean
// every future backup field also has to make sense to Anki.
import type { ChironIndex, ChironLib } from "./types";
import { isPersistedV2, type PersistedV2 } from "./persistence";

/** A backup is the person's own state (persistence.ts): progress plus the
 *  sources they created. The built-in catalog is part of the app, so a backup
 *  stays small and still restores everything that was theirs. Old full
 *  `{index, libs}` backups remain importable — restore() re-keys them. */
export function parseChironBackup(raw: string): { value: unknown } | { error: string } {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown> | null;
    const legacy = !!parsed && typeof parsed.index === "object" && typeof parsed.libs === "object";
    if (!isPersistedV2(parsed) && !legacy) return { error: "Este arquivo não parece um backup do Chiron." };
    return { value: parsed };
  } catch { return { error: "Não foi possível ler o JSON do backup." }; }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadBackupJSON(state: PersistedV2, filename = "chiron-dados.json") {
  const backup = state;
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, filename);
}

export async function downloadIndexXLSX(index: ChironIndex, libs: Record<string, ChironLib>, filename = "chiron-dados.xlsx") {
  // Dynamic import: exceljs is a large dependency only needed for this one
  // rarely-used export action — statically importing it here would drag it
  // into every route that can render ProfileDialog/AppLayout (i.e. all of
  // them), bloating the main bundle for a feature most sessions never touch.
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  const sourceName = (id: string) => index.sources.find((s) => s.id === id)?.name ?? id;

  const sources = wb.addWorksheet("Fontes");
  sources.columns = [
    { header: "Nome", key: "name", width: 28 },
    { header: "Tipo", key: "kind", width: 12 },
    { header: "Linguagem", key: "language", width: 16 },
    { header: "Adicionado em", key: "addedAt", width: 14 },
  ];
  sources.getRow(1).font = { bold: true };
  for (const s of index.sources) {
    sources.addRow({ name: s.name, kind: s.kind, language: s.language ?? "", addedAt: s.addedAt });
  }

  const nodes = wb.addWorksheet("Nós");
  nodes.columns = [
    { header: "Fonte", key: "source", width: 22 },
    { header: "Título", key: "title", width: 40 },
    { header: "Tipo", key: "kind", width: 12 },
    { header: "Maestria (0-4)", key: "mastery", width: 14 },
  ];
  nodes.getRow(1).font = { bold: true };
  for (const n of index.nodes) {
    nodes.addRow({ source: sourceName(n.sourceId), title: n.title, kind: n.kind, mastery: n.mastery });
  }

  const cards = wb.addWorksheet("Cards");
  cards.columns = [
    { header: "Fonte", key: "source", width: 22 },
    { header: "Frente", key: "front", width: 50 },
    { header: "Verso", key: "back", width: 50 },
    { header: "Vencimento", key: "due", width: 14 },
    { header: "Repetições", key: "reps", width: 12 },
  ];
  cards.getRow(1).font = { bold: true };
  for (const c of index.cards) {
    cards.addRow({ source: sourceName(c.sourceId), front: c.frontMd, back: c.backMd, due: c.dueDate, reps: c.reps });
  }

  const chapters = wb.addWorksheet("Capítulos");
  chapters.columns = [
    { header: "Fonte", key: "source", width: 22 },
    { header: "Capítulo", key: "title", width: 44 },
    { header: "Nível", key: "level", width: 14 },
    { header: "Seções", key: "sections", width: 10 },
  ];
  chapters.getRow(1).font = { bold: true };
  for (const lib of Object.values(libs)) {
    for (const chapter of [...lib.chapters].sort((a, b) => a.order - b.order)) {
      chapters.addRow({ source: sourceName(lib.sourceId), title: chapter.title, level: chapter.level, sections: chapter.sectionIds.length });
    }
  }

  const buf = await wb.xlsx.writeBuffer();
  downloadBlob(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), filename);
}
