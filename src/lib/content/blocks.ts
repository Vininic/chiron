/** Bridges flat markdown into the typed `Block` model (types.ts).
 *
 *  Two producers still speak plain markdown and are not being rewritten in
 *  this pass: v1 library documents being migrated (migrate.ts) and the AI
 *  ingestion pipeline (`lib/study/ingestion/passes.ts`'s `SECTION_SYSTEM_PROMPT`,
 *  which asks the model for a single `bodyMd` string — teaching it to emit a
 *  typed block tree directly is real prompt-engineering work, deferred rather
 *  than gambled on untested here). `mdToBlocks` is the seam between them and
 *  the block-based domain: fenced code becomes its own `code` block, whatever
 *  is around it stays a single `prose` block per gap. Content authored
 *  directly as TypeScript (F2's seed data) should build `Block[]` literals by
 *  hand instead of round-tripping through this — that's how `porque`/
 *  `quebraria`/`compare`/`algo`/`diagram` blocks get created; this parser only
 *  ever produces `prose`, `code` and `cite`. */
import type { Block } from "@/lib/study/types";

interface LegacyCitation {
  file: string;
  symbol: string;
}

const FENCE_RE = /```(\w*)\n([\s\S]*?)```/g;

export function mdToBlocks(md: string, citations: LegacyCitation[] = []): Block[] {
  const blocks: Block[] = [];
  let lastIndex = 0;

  for (const match of md.matchAll(FENCE_RE)) {
    const start = match.index ?? 0;
    const before = md.slice(lastIndex, start).trim();
    if (before) blocks.push({ kind: "prose", md: before });
    blocks.push({ kind: "code", lang: match[1] || "text", code: match[2].replace(/\n$/, "") });
    lastIndex = start + match[0].length;
  }

  const rest = md.slice(lastIndex).trim();
  if (rest) blocks.push({ kind: "prose", md: rest });

  for (const c of citations) {
    blocks.push({ kind: "cite", file: c.file, symbol: c.symbol });
  }

  return blocks;
}

/** Prose word count only — code, citations and structural blocks don't count
 *  toward the completeness contract's reading-material thresholds (a 600-word
 *  minimum padded with a pasted file would defeat the point of the minimum). */
export function proseWordCount(blocks: Block[]): number {
  return blocks
    .filter((b): b is Extract<Block, { kind: "prose" }> => b.kind === "prose")
    .reduce((sum, b) => sum + (b.md.trim() === "" ? 0 : b.md.trim().split(/\s+/).length), 0);
}

export function countBlocksOfKind(blocks: Block[], kind: Block["kind"]): number {
  return blocks.filter((b) => b.kind === kind).length;
}

export function hasBlockOfKind(blocks: Block[], kind: Block["kind"]): boolean {
  return blocks.some((b) => b.kind === kind);
}
