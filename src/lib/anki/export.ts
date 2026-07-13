// Anki-compatible export utilities
// Anki supports tab-separated (TSV) import with "Front", "Back" columns.
// We also provide a JSON export for use within the suite.

import type { Card } from "@/lib/study/types";

export interface AnkiCard {
  frontMd: string;
  backMd: string;
  tags?: string[];
}

export function cardsToAnkiCards(cards: Card[], sourceName?: string): AnkiCard[] {
  return cards.map((c) => ({
    frontMd: c.frontMd,
    backMd: c.backMd,
    tags: sourceName ? [sourceName.replace(/\s+/g, "_")] : undefined,
  }));
}

export function exportAnkiTSV(cards: AnkiCard[]): string {
  const header = "#separator:tab\n#html:true\nFront\tBack\n";
  const rows = cards.map((c) => {
    const front = c.frontMd.replace(/\t/g, " ").replace(/\n/g, "<br>");
    const back = c.backMd.replace(/\t/g, " ").replace(/\n/g, "<br>");
    const tags = c.tags?.length ? ` ${c.tags.map((t) => `#${t}`).join(" ")}` : "";
    return `${front}\t${back}${tags}`;
  });
  return header + rows.join("\n");
}

export function downloadTSV(cards: AnkiCard[], filename = "chiron-cards.tsv") {
  const content = exportAnkiTSV(cards);
  const blob = new Blob([content], { type: "text/tab-separated-values;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAnkiJSON(cards: AnkiCard[]): string {
  return JSON.stringify(cards, null, 2);
}

export function downloadJSON(cards: AnkiCard[], filename = "chiron-cards.json") {
  const content = exportAnkiJSON(cards);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
