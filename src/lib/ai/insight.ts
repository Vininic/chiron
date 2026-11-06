import { streamChat, type ChatMessage } from "./providers";
import { loadAiSettings } from "./settings";
import type { ChironIndex } from "@/lib/study/types";

export interface DigestCard { title: string; body: string; severity: "warning" | "positive" | "insight"; source: "IA" | "Estrutural"; }
export function heuristicDigest(index: ChironIndex): DigestCard[] {
  const cards: DigestCard[] = [];
  const weak = index.nodes.filter((node) => node.mastery <= 1); if (weak.length) cards.push({ title: "Nós para retomar", body: `${weak.slice(0, 3).map((node) => node.title).join(", ")}${weak.length > 3 ? "…" : ""} ainda precisam de prática deliberada.`, severity: "warning", source: "Estrutural" });
  const due = index.cards.filter((card) => card.dueDate <= new Date().toISOString().slice(0, 10)).length; if (due) cards.push({ title: "Fila de revisão", body: `${due} card${due === 1 ? "" : "s"} aguardam revisão; uma sessão curta protege a sequência.`, severity: "warning", source: "Estrutural" });
  const locked = index.nodes.filter((node) => node.requires.some((id) => (index.nodes.find((item) => item.id === id)?.mastery ?? 0) < 2)); if (locked.length) cards.push({ title: "Sequência bloqueada", body: `${locked.length} nó(s) dependem de fundamentos ainda não consolidados.`, severity: "insight", source: "Estrutural" });
  if (!cards.length) cards.push({ title: "Próximo movimento", body: "Conclua uma camada de laboratório ou uma seção para o digest ter sinais reais para analisar.", severity: "positive", source: "Estrutural" });
  return cards;
}
export async function aiDigest(index: ChironIndex, locale: string): Promise<DigestCard[] | null> { try { const messages: ChatMessage[] = [{ role: "system", content: `Você analisa progresso de estudo. Responda em ${locale}. Retorne somente um bloco \`\`\`digest com JSON de até 4 itens {title,body,severity}, onde severity é warning, positive ou insight.` }, { role: "user", content: JSON.stringify({ nodes: index.nodes.map((node) => ({ title: node.title, mastery: node.mastery })), dueCards: index.cards.filter((card) => card.dueDate <= new Date().toISOString().slice(0, 10)).length, streak: index.score.streak }) }]; const raw = await streamChat(loadAiSettings(), messages, () => {}); const match = raw.match(/```digest\s*([\s\S]*?)```/); const parsed = match && JSON.parse(match[1]); return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.title === "string" && typeof item.body === "string" && ["warning", "positive", "insight"].includes(item.severity)).map((item) => ({ ...item, source: "IA" as const })) : null; } catch { return null; } }

