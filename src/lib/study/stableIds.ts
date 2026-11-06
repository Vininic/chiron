// Deterministic ids for seeded content. service.ts mints random UUIDs, which
// was harmless while the whole seed lived inside localStorage — but the
// catalog outgrew the browser quota (13M+ chars), so built-in content is now
// regenerated from code on every load and only progress is persisted
// (see persistence.ts). Progress can only point at regenerated content if the
// regenerated ids are the same every time, and if they survive content edits:
// so ids derive from natural keys (source name, chapter/section/node titles,
// a hash of exercise prompts and card fronts), never from creation order.
import type { ChironIndex, ChironLib } from "./types";

export function slug(text: string | undefined): string {
  // Tolerates missing titles: old saved documents are re-keyed too.
  return String(text ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
}

/** FNV-1a 32-bit, base36 — short and stable, not cryptographic. */
export function textHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${h.toString(36)}${text.length.toString(36)}`;
}

interface Doc { index: ChironIndex; libs: Record<string, ChironLib> }

/** Builds old→new id pairs for every entity, keyed by meaning instead of
 *  creation order. Duplicate keys (two sections with the same title in one
 *  chapter) get a `~2`, `~3` suffix in document order. */
export function stableIdMap(doc: Doc): Map<string, string> {
  const map = new Map<string, string>();
  const taken = new Set<string>();
  const claim = (oldId: string, key: string) => {
    let id = key;
    for (let n = 2; taken.has(id); n++) id = `${key}~${n}`;
    taken.add(id);
    map.set(oldId, id);
  };

  for (const source of doc.index.sources) {
    const s = slug(source.name);
    claim(source.id, `s.${s}`);
    for (const node of doc.index.nodes) if (node.sourceId === source.id) claim(node.id, `n.${s}.${slug(node.title)}`);
    for (const card of doc.index.cards) if (card.sourceId === source.id) claim(card.id, `k.${s}.${textHash(card.frontMd ?? "")}`);
    const lib = doc.libs[source.id];
    if (!lib) continue;
    const chapterSlug = new Map<string, string>();
    for (const chapter of lib.chapters) {
      chapterSlug.set(chapter.id, slug(chapter.title));
      claim(chapter.id, `c.${s}.${slug(chapter.title)}`);
    }
    for (const section of lib.sections) claim(section.id, `x.${s}.${chapterSlug.get(section.chapterId) ?? "-"}.${slug(section.title)}`);
    for (const exercise of lib.exercises) claim(exercise.id, `e.${s}.${textHash(exercise.promptMd ?? "")}`);
  }
  return map;
}

/** Rewrites every string equal to a mapped id, anywhere in the value. Ids are
 *  UUIDs or the keys above, so prose/code strings never collide with them. */
export function remapIds<T>(value: T, map: Map<string, string>): T {
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return map.get(v) ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, child] of Object.entries(v as Record<string, unknown>)) out[map.get(k) ?? k] = walk(child);
      return out;
    }
    return v;
  };
  return walk(value) as T;
}

export function stabilizeIds<D extends Doc>(doc: D): D {
  return remapIds(doc, stableIdMap(doc));
}
