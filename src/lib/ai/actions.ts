import type { ChironIndex, ChironLib, ExerciseLevel, ExerciseType } from "@/lib/study/types";
import { addCard, addExercise, updateNodeMastery } from "@/lib/study/service";
import { buildLabAuthoringPrompt } from "@/lib/labs/authoring";

export type AetherisAction =
  | { type: "create_cards"; sourceId: string; nodeId: string; cards: { frontMd: string; backMd: string }[] }
  | { type: "add_exercise"; sourceId: string; nodeId: string; promptMd: string; answerKeyMd: string; level: ExerciseLevel; exerciseType: ExerciseType }
  | { type: "adjust_mastery"; nodeId: string; mastery: 0 | 1 | 2 | 3 | 4 }
  | { type: "plan_session"; note: string }
  | { type: "add_source"; url: string; name?: string }
  | { type: "ingest_source"; sourceId: string }
  | { type: "annotate_section"; sourceId: string; sectionId: string; note: string }
  | { type: "generate_lab"; theme: string; conceptId?: string };

const TYPES = new Set<AetherisAction["type"]>(["create_cards", "add_exercise", "adjust_mastery", "plan_session", "add_source", "ingest_source", "annotate_section", "generate_lab"]);
export function parseActions(reply: string): { prose: string; actions: AetherisAction[] } {
  const match = reply.match(/```actions\s*([\s\S]*?)```/); if (!match) return { prose: reply.trim(), actions: [] };
  let raw: unknown; try { raw = JSON.parse(match[1]); } catch { return { prose: reply.replace(match[0], "").trim(), actions: [] }; }
  return { prose: reply.replace(match[0], "").trim(), actions: Array.isArray(raw) ? raw.filter((action): action is AetherisAction => {
    const type = action && typeof action === "object" ? (action as { type?: unknown }).type : undefined;
    return typeof type === "string" && TYPES.has(type as AetherisAction["type"]);
  }) : [] };
}
export function describeAction(index: ChironIndex, action: AetherisAction): string {
  const node = (id: string) => index.nodes.find((item) => item.id === id)?.title ?? id;
  switch (action.type) {
    case "create_cards": return `Criar ${action.cards.length} cards em ${node(action.nodeId)}`;
    case "add_exercise": return `Adicionar exercício em ${node(action.nodeId)}`;
    case "adjust_mastery": return `Ajustar domínio de ${node(action.nodeId)} para ${action.mastery}/4`;
    case "plan_session": return "Propor uma sessão de estudo";
    case "add_source": return `Adicionar fonte ${action.name ?? action.url}`;
    case "ingest_source": return "Ingerir repositório";
    case "annotate_section": return "Anotar uma seção da apostila";
    case "generate_lab": return `Gerar rascunho de lab: ${action.theme}`;
  }
}
export function actionPrompt(): string { return "Quando uma mudança concreta ajudar, proponha-a em um bloco ```actions``` JSON. Tipos permitidos: create_cards, add_exercise, adjust_mastery, plan_session, add_source, ingest_source, annotate_section, generate_lab. Nunca cite esses identificadores técnicos em prosa; descreva a intenção em linguagem humana."; }
export function applyAction(index: ChironIndex, libs: Record<string, ChironLib>, action: AetherisAction): { index: ChironIndex; libs: Record<string, ChironLib>; note?: string } {
  if (action.type === "create_cards") { let next = index; for (const card of action.cards) next = addCard(next, { sourceId: action.sourceId, nodeId: action.nodeId, ...card }).index; return { index: next, libs }; }
  if (action.type === "add_exercise") {
    const lib = libs[action.sourceId];
    if (!lib) return { index, libs, note: "A fonte não possui uma apostila editável." };
    return { index, libs: { ...libs, [action.sourceId]: addExercise(lib, { sourceId: action.sourceId, nodeId: action.nodeId, type: action.exerciseType, level: action.level, promptMd: action.promptMd, answerKeyMd: action.answerKeyMd, points: 10 }).lib } };
  }
  if (action.type === "adjust_mastery") return { index: updateNodeMastery(index, action.nodeId, action.mastery), libs };
  if (action.type === "generate_lab") return { index, libs, note: buildLabAuthoringPrompt(action.theme, action.conceptId) };
  return { index, libs, note: "Esta proposta abre o fluxo correspondente para sua aprovação." };
}
