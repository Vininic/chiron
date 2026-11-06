import { expect, it } from "vitest";
import { proseWordCount } from "@/lib/content/blocks";
import { checkChapter, checkSource } from "@/lib/content/contract";
import { editorialMetrics } from "@/lib/content/editorial";
import { freshIndex } from "@/lib/study/migrate";
import { applyContentSource } from "./materialize";
import { ORACLE_CLOUD_AUTHORED_PROSE } from "./oracleCloudAuthoredProse";
import { ORACLE_CLOUD_CONTENT } from "./oracleCloud";
import { ORACLE_CLOUD_EXAMPLES } from "./oracleCloudExamples";
it("Oracle Cloud — 48 seções, densidade e exemplos", () => {
 const sections=ORACLE_CLOUD_CONTENT.chapters.flatMap(c=>c.sections);
 expect([ORACLE_CLOUD_CONTENT.chapters.length,sections.length,new Set(sections.map(s=>s.title)).size]).toEqual([12,48,48]);
 expect(Object.keys(ORACLE_CLOUD_AUTHORED_PROSE).sort()).toEqual(sections.map(s=>s.title).sort());
 expect(Object.keys(ORACLE_CLOUD_EXAMPLES).sort()).toEqual(sections.map(s=>s.title).sort());
 expect(sections.map(section=>proseWordCount(section.blocks)).filter(words=>words<600)).toEqual([]);
 expect(sections.flatMap(s=>s.blocks).filter(b=>b.kind==="code")).toHaveLength(96);
});
it("Oracle Cloud — materializa contratos e métricas", () => {
 const {index,lib}=applyContentSource(freshIndex(),ORACLE_CLOUD_CONTENT);
 for(const chapter of lib.chapters)expect(checkChapter(chapter,lib,index),chapter.title).toEqual([]);
 expect(checkSource(index.sources[0],lib,index)).toEqual([]);
 const metrics=editorialMetrics(ORACLE_CLOUD_CONTENT);
 expect(metrics.maximumSectionSimilarity).toBeLessThan(0.42);
 expect(metrics.maximumCardSimilarity).toBeLessThan(0.78);
 expect(metrics.detailedExerciseRatio).toBeGreaterThanOrEqual(0.65);
 expect(metrics.duplicatedCodeBlocks).toBe(0);
});

