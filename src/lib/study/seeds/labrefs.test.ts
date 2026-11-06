import { describe, expect, it } from "vitest";
import { LABS } from "@/lib/labs/catalog";
import { PUBLISHED_SOURCES } from "./index";

// The structural contract only checks that an integrator chapter *has* a
// labref block; the 2026-10-23 audit found 14 books pointing at lab layers
// that were never built. Each must either get its layer (F8, PLANO §9/§R.5)
// or point at an existing one. This list may only shrink.
const PENDING_LAB_LAYER = new Set([
  "JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS",
  "MySQL", "MariaDB", "Microsoft SQL Server", "Supabase",
]);

const layers = new Set(LABS.flatMap((lab) => lab.layers.map((layer) => `${lab.id}/${layer.id}`)));

describe("labref blocks point at lab layers that exist", () => {
  for (const source of PUBLISHED_SOURCES) {
    const refs = source.chapters.flatMap((c) => c.sections).flatMap((s) => s.blocks)
      .flatMap((b) => (b.kind === "labref" ? [`${b.labId}/${b.layerId}`] : []));
    if (PENDING_LAB_LAYER.has(source.name)) {
      it.todo(`${source.name} → ${[...new Set(refs)].join(", ")} (camada inexistente)`);
      continue;
    }
    it(source.name, () => {
      expect(refs.filter((ref) => !layers.has(ref))).toEqual([]);
    });
  }
});
