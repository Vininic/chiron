import { REPO_SEEDS, SKILL_SEEDS } from "./data";
import type { SeedSource } from "./data";
import { addSource, addNode, updateNode, addSection, addCard, addExercise } from "../service";
import type { ChironIndex, ChironLib } from "../types";
import { makeId } from "../types";
import { freshIndex, freshLib } from "../migrate";
import { mdToBlocks } from "@/lib/content/blocks";
import { stabilizeIds } from "../stableIds";
import { PYTHON_CONTENT } from "./content/python";
import { JAVASCRIPT_CONTENT } from "./content/javascript";
import { TYPESCRIPT_CONTENT } from "./content/typescript";
import { NODEJS_CONTENT } from "./content/nodejs";
import { REACT_CONTENT } from "./content/react";
import { NEXTJS_CONTENT } from "./content/nextjs";
import { HTML_CONTENT } from "./content/html";
import { CSS_CONTENT } from "./content/css";
import { TAILWIND_CSS_CONTENT } from "./content/tailwindcss";
import { VITE_CONTENT } from "./content/vite";
import { VITEST_CONTENT } from "./content/vitest";
import { POSTGRESQL_CONTENT } from "./content/postgresql";
import { MYSQL_CONTENT } from "./content/mysql";
import { MARIADB_CONTENT } from "./content/mariadb";
import { SQLSERVER_CONTENT } from "./content/sqlserver";
import { SUPABASE_CONTENT } from "./content/supabase";
import { JAVA_CONTENT } from "./content/java";
import { CSHARP_CONTENT } from "./content/csharp";
import { ORACLE_CLOUD_CONTENT } from "./content/oracleCloud";
import { UBUNTU_LINUX_CONTENT } from "./content/ubuntuLinux";
import { N8N_CONTENT } from "./content/n8n";
import { FIGMA_CONTENT } from "./content/figma";
import { OFFICE_CONTENT } from "./content/office";
import { LLM_CONTENT } from "./content/llm";
import { CURSOR_CONTENT } from "./content/cursor";
import { CLAUDE_CODE_CONTENT } from "./content/claudeCode";
import { GITHUB_COPILOT_CONTENT } from "./content/githubCopilot";
import { OPENCODE_CONTENT } from "./content/opencode";
import { LOVABLE_CONTENT } from "./content/lovable";
import { GOOGLE_AI_STUDIO_CONTENT } from "./content/googleAiStudio";
import { JQUERY_CONTENT } from "./content/jquery";
import { CHIRON_CONTENT } from "./content/chiron";
import { OLYMPUS_CONTENT } from "./content/olympus";
import { applyContentSource } from "./content/materialize";
import type { ContentSource } from "./content/types";

/** Every built-in book, in the order the catalog lists them. */
export const PUBLISHED_SOURCES: readonly ContentSource[] = [
  PYTHON_CONTENT,
  JAVASCRIPT_CONTENT,
  TYPESCRIPT_CONTENT,
  NODEJS_CONTENT,
  REACT_CONTENT,
  NEXTJS_CONTENT,
  HTML_CONTENT,
  CSS_CONTENT,
  TAILWIND_CSS_CONTENT,
  VITE_CONTENT,
  VITEST_CONTENT,
  POSTGRESQL_CONTENT,
  MYSQL_CONTENT,
  MARIADB_CONTENT,
  SQLSERVER_CONTENT,
  SUPABASE_CONTENT,
  JAVA_CONTENT,
  CSHARP_CONTENT,
  ORACLE_CLOUD_CONTENT,
  UBUNTU_LINUX_CONTENT,
  N8N_CONTENT,
  FIGMA_CONTENT,
  OFFICE_CONTENT,
  LLM_CONTENT,
  CURSOR_CONTENT,
  CLAUDE_CODE_CONTENT,
  GITHUB_COPILOT_CONTENT,
  OPENCODE_CONTENT,
  LOVABLE_CONTENT,
  GOOGLE_AI_STUDIO_CONTENT,
  JQUERY_CONTENT,
  CHIRON_CONTENT,
  OLYMPUS_CONTENT,
];

export interface SeedResult {
  index: ChironIndex;
  libs: Record<string, ChironLib>;
}

function applySeed(index: ChironIndex, seed: SeedSource): { index: ChironIndex; libs: Record<string, ChironLib> } {
  const { index: withSource, id: sourceId } = addSource(index, {
    kind: seed.kind,
    name: seed.name,
    repoUrl: seed.repoUrl,
    language: seed.language,
    // Legacy flat seed data exists so the prototype is navigable, but it does
    // not meet the curated-book editorial bar. Never show it as ready.
    contentOrigin: "legacy_seed",
  });
  let currentIndex = withSource;
  let currentLib = freshLib(sourceId);

  // Track node titles → IDs for section/exercise/card mapping
  const nodeMap = new Map<string, string>();

  for (const n of seed.nodes) {
    const { index: next, id } = addNode(currentIndex, {
      sourceId,
      title: n.title,
      kind: n.kind,
      requires: [],
    });
    currentIndex = next;
    nodeMap.set(n.title, id);
  }

  // This flat seed format has no real prerequisite data (unlike the
  // Chapter/Block content in lib/study/seeds/content/, where materialize.ts
  // chains chapter order into `requires` for a genuine reason). Chaining
  // these nodes in their listed order too is honestly just so /maps has a
  // real multi-layer DAG to lay out and lock/unlock in the demo, rather than
  // every seeded source rendering as one flat unconnected layer forever —
  // it is not a claim that node N actually depends on node N-1 conceptually.
  const nodeIds = seed.nodes.map((n) => nodeMap.get(n.title)!);
  for (let i = 1; i < nodeIds.length; i++) {
    currentIndex = updateNode(currentIndex, nodeIds[i], { requires: [nodeIds[i - 1]] });
  }

  // F1 note (2026-07-29): seeds are still authored as flat `bodyMd` in
  // data.ts — F2 replaces this file's content with real Chapter/Block-
  // authored apostilas per PLANO.md §3.4, at which point this synthetic
  // single-chapter wrapper goes away along with the flat strings. Until
  // then every seed source gets one chapter holding all its sections, the
  // same shape migrate.ts synthesizes for pre-existing v1 data — so seed
  // content correctly reads as incomplete against lib/content/contract.ts
  // rather than silently appearing to satisfy it.
  const chapterId = makeId();
  const sectionIds: string[] = [];
  for (const s of seed.sections) {
    const nodeId = nodeMap.get(s.nodeTitle);
    if (!nodeId) continue;
    const { lib: next, id: sectionId } = addSection(currentLib, {
      sourceId,
      chapterId,
      nodeId,
      title: s.title,
      blocks: mdToBlocks(s.bodyMd),
      order: s.order,
    });
    currentLib = next;
    sectionIds.push(sectionId);
  }
  if (sectionIds.length > 0) {
    currentLib = {
      ...currentLib,
      chapters: [
        ...currentLib.chapters,
        { id: chapterId, sourceId, title: "Conteúdo semeado", level: "basico" as const, order: 1, sectionIds },
      ],
    };
  }

  for (const e of seed.exercises) {
    const nodeId = nodeMap.get(e.nodeTitle);
    if (!nodeId) continue;
    const { lib: next } = addExercise(currentLib, {
      sourceId,
      nodeId,
      type: e.type as any,
      level: e.level,
      promptMd: e.promptMd,
      choices: e.choices,
      answerKeyMd: e.answerKeyMd,
      points: e.points,
    });
    currentLib = next;
  }

  for (const c of seed.cards) {
    const nodeId = nodeMap.get(c.nodeTitle);
    if (!nodeId) continue;
    const { index: next } = addCard(currentIndex, {
      sourceId,
      nodeId,
      frontMd: c.frontMd,
      backMd: c.backMd,
    });
    currentIndex = next;
  }

  return { index: currentIndex, libs: { [sourceId]: currentLib } };
}

export function runSeed(): SeedResult {
  let index: ChironIndex = freshIndex();
  const libs: Record<string, ChironLib> = {};

  for (const seed of [...REPO_SEEDS, ...SKILL_SEEDS].filter((candidate) => !["PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server", "Supabase", "Java", "OpenCode", "Lovable", "Google AI Studio", "jQuery", "Olympus", "Chronos", "Kairos", "Pluto", "Hermes"].includes(candidate.name))) {
    const result = applySeed(index, seed);
    index = result.index;
    Object.assign(libs, result.libs);
  }

  // Curated books, in catalog order. The editorial gate (contract, unique
  // prose, verified examples) runs in seeds/published.test.ts — not here,
  // where it would cost every page load its n-gram comparison.
  for (const content of PUBLISHED_SOURCES) {
    const applied = applyContentSource(index, content);
    index = applied.index;
    libs[applied.lib.sourceId] = applied.lib;
  }

  // Every remaining draft source stays outside this path until it passes both
  // the structural contract and the editorial audit (unique prose,
  // chapter-specific assessments and verified examples). The previous
  // shared-prose books passed only the structural floor and were removed from
  // publication after the 2026-08-25 audit.

  // Ids derive from natural keys (stableIds.ts), so progress persisted
  // against this content still lines up after the next load regenerates it.
  // No synthetic study history here: this is the real starting document of
  // every new learner, and fabricated sessions would show a streak they never
  // built.
  return stabilizeIds({ index, libs });
}
