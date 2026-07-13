// Seed utility: creates default study content for known repos.
// Used on first-run or when user clicks "Generate from repos".

import { addSource, addNode, addSection, addCard, addExercise } from "./service";
import type { ChironIndex, ChironLib, StudySource } from "./types";
import { freshLib } from "./migrate";

export interface RepoSeed {
  owner: string;
  repo: string;
  name: string;
  language?: string;
}

const SUITE_REPOS: RepoSeed[] = [
  { owner: "Vininic", repo: "chronos-the-art-of-time", name: "Chronos", language: "TypeScript" },
  { owner: "Vininic", repo: "kairos", name: "Kairos", language: "TypeScript" },
  { owner: "Vininic", repo: "pluto", name: "Pluto", language: "TypeScript" },
  { owner: "Vininic", repo: "hermes", name: "Hermes", language: "TypeScript" },
];

export function seedSources(index: ChironIndex): { index: ChironIndex; sources: StudySource[] } {
  let current = index;
  const sources: StudySource[] = [];
  for (const r of SUITE_REPOS) {
    const { index: next, id } = addSource(current, {
      kind: "repo",
      name: r.name,
      repoUrl: `https://github.com/${r.owner}/${r.repo}`,
      language: r.language,
    });
    current = next;
    const src = current.sources.find((s) => s.id === id)!;
    sources.push(src);
  }
  return { index: current, sources };
}

export function seedNodes(index: ChironIndex, sourceId: string, language: string): ChironIndex {
  let current = index;
  const concepts = [
    { title: "Architecture Overview", kind: "module" as const, requires: [] },
    { title: "Project Structure", kind: "module" as const, requires: ["Architecture Overview"] },
    { title: `Core ${language} Patterns`, kind: "concept" as const, requires: ["Project Structure"] },
    { title: "Data Flow", kind: "concept" as const, requires: ["Core Patterns"] },
    { title: "State Management", kind: "concept" as const, requires: ["Data Flow"] },
    { title: "API Layer", kind: "module" as const, requires: ["Data Flow"] },
    { title: "Component Tree", kind: "concept" as const, requires: ["Project Structure", "State Management"] },
    { title: "Routing & Navigation", kind: "function" as const, requires: ["Component Tree"] },
  ];
  for (const c of concepts) {
    const { index: next } = addNode(current, { sourceId, title: c.title, kind: c.kind, requires: [] });
    current = next;
  }
  return current;
}

export function seedApostila(
  lib: ChironLib,
  sourceId: string,
  nodeId: string,
  repoName: string,
): ChironLib {
  let current = lib;
  const { lib: next, id: _id } = addSection(current, {
    sourceId,
    nodeId,
    title: `Introdução ao ${repoName}`,
    bodyMd: `# ${repoName}

Este módulo cobre a arquitetura e os padrões de design do **${repoName}**, parte da Suíte Olympus.

## Visão Geral

${repoName} é construído com React, TypeScript e as bibliotecas da suíte compartilhadas. O código segue os princípios de componentes puros, estado imutável e separação clara de responsabilidades.

## O que você vai aprender

- Estrutura do projeto e organização de diretórios
- Padrões de componentes e composição
- Fluxo de dados e gerenciamento de estado
- Integração com serviços (Supabase, AI)
- Estratégias de teste e qualidade`,
    citations: [],
    order: 1,
  });
  current = next;
  return current;
}

export function seedExercises(
  lib: ChironLib,
  sourceId: string,
  nodeId: string,
): ChironLib {
  let current = lib;
  const { lib: next } = addExercise(current, {
    sourceId,
    nodeId,
    type: 3,
    level: "beginner",
    promptMd: "Quais são as principais camadas arquiteturais deste projeto? Como elas se comunicam entre si?",
    answerKeyMd: "O projeto segue uma arquitetura em camadas: componentes de UI (React), lógica de negócio (hooks/services), acesso a dados (Supabase client/lib) e integração externa (AI providers). A comunicação flui de cima para baixo, com eventos e callbacks subindo.",
    points: 10,
  });
  current = next;
  const { lib: next2 } = addExercise(current, {
    sourceId,
    nodeId,
    type: 1,
    level: "intermediate",
    promptMd: "Dado um componente React que recebe `data` como prop e um `onAction` callback — qual padrão de design está sendo usado e por que ele é preferível a passar funções diretamente?",
    choices: [
      "Inversion of Control — o componente não decide o que fazer, apenas notifica",
      "Singleton — porque só deve existir uma instância do callback",
      "Factory — porque o callback é criado sob demanda",
      "Observer — porque o componente observa mudanças no callback",
    ],
    answerKeyMd: "Inversion of Control — o componente não decide o que fazer, apenas notifica. Isso mantém o componente puro e reutilizável.",
    points: 15,
  });
  current = next2;
  return current;
}

export function seedCards(
  lib: ChironLib,
  index: ChironIndex,
  sourceId: string,
  nodeId: string,
): ChironIndex {
  let current = index;
  const { index: next } = addCard(current, {
    sourceId,
    nodeId,
    frontMd: "O que é Inversion of Control (IoC) em componentes React?",
    backMd: "É o padrão onde o componente recebe callbacks como props em vez de executar ações diretamente. O componente 'vira o controle para o pai' — ele apenas notifica que algo aconteceu, e o pai decide o que fazer. Ex: `<Button onClick={handleClick}>` em vez de `<Button onClick={() => save()}>`.",
  });
  current = next;
  const { index: next2 } = addCard(current, {
    sourceId,
    nodeId,
    frontMd: "Por que estados imutáveis são importantes no React?",
    backMd: "Estados imutáveis permitem que o React detecte mudanças de forma eficiente (referência !== referência antiga), evitando renders desnecessários. Também previnem bugs de mutação acidental e facilitam o debug com time-travel.",
  });
  current = next2;
  return current;
}

export function fullSeed(index: ChironIndex): { index: ChironIndex; libs: Record<string, ChironLib> } {
  const { index: withSources, sources } = seedSources(index);
  let currentIndex = withSources;
  const libs: Record<string, ChironLib> = {};
  for (const src of sources) {
    currentIndex = seedNodes(currentIndex, src.id, src.language ?? "TypeScript");
    let lib = freshLib(src.id);
    const firstNodeId = currentIndex.nodes.find((n) => n.sourceId === src.id)?.id;
    if (firstNodeId) {
      lib = seedApostila(lib, src.id, firstNodeId, src.name);
      lib = seedExercises(lib, src.id, firstNodeId);
      currentIndex = seedCards(lib, currentIndex, src.id, firstNodeId);
    }
    libs[src.id] = lib;
  }
  return { index: currentIndex, libs };
}
