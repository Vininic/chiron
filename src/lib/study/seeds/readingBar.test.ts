import { describe, expect, it } from "vitest";
import { readingBarViolations } from "@/lib/content/readingBar";
import { PUBLISHED_SOURCES } from "./index";

// Books the 2026-10-23 audit sent back for rewriting (PLANO.md §R.2). This
// list may only shrink: a source leaves it when its rewrite lands, and from
// then on the check below holds it to the reference.
const PENDING_REWRITE = new Set([
  "HTML", "CSS",
  "MySQL", "MariaDB", "Microsoft SQL Server", "Supabase", "Java", "C#",
  "Oracle Cloud", "Ubuntu / Linux", "N8N", "Figma", "Integração de IA (LLM)",
  "Cursor", "Claude Code", "GitHub Copilot", "Lovable", "Google AI Studio",
  "Chiron", "Olympus",
]);

describe("reading bar — no verification narration in published prose", () => {
  for (const source of PUBLISHED_SOURCES) {
    if (PENDING_REWRITE.has(source.name)) {
      it.todo(`${source.name} (reescrita pendente — PLANO §R.2)`);
      continue;
    }
    it(source.name, () => {
      expect(readingBarViolations(source)).toEqual([]);
    });
  }

  it("the pending list names only published sources", () => {
    const names = new Set(PUBLISHED_SOURCES.map((s) => s.name));
    for (const name of PENDING_REWRITE) expect(names.has(name)).toBe(true);
  });
});
