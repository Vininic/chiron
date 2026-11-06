import type { Lab, LabDraft } from "./types";
import { validateLab, type LabValidationIssue } from "./engine";

export function buildLabAuthoringPrompt(theme: string, concept?: string): string {
  return `Crie um rascunho de laboratório didático para ${theme}${concept ? `, focado em ${concept}` : ""}. Responda SOMENTE JSON válido no formato {"lab": Lab}. Um Lab precisa ter id, kind (snake|market|maze|rush), name, subtitle, description, accent e layers. Cada layer precisa de pergunta antes do código, contrato, código, invariantes executáveis descritas e mutações. Cada mutação deve listar, em breaks, pelo menos um id de invariante DA MESMA camada. Não entregue uma demo pronta: a pessoa deve prever, aplicar uma mutação e observar uma invariante falhar.`;
}

export type DraftParseResult = { draft: LabDraft } | { error: string; issues?: LabValidationIssue[] };

/** Parses an AI proposal but never publishes it: consumers must explicitly approve it. */
export function parseLabDraft(raw: string, theme: string, concept?: string): DraftParseResult {
  try {
    const parsed = JSON.parse(raw) as { lab?: Lab };
    if (!parsed.lab) return { error: "A resposta não contém um objeto lab." };
    const issues = validateLab(parsed.lab);
    if (issues.length) return { error: "O rascunho não passa a validação mecânica.", issues };
    return { draft: { id: crypto.randomUUID(), theme, concept, lab: parsed.lab, status: "draft" } };
  } catch {
    return { error: "A IA não devolveu JSON válido para o rascunho." };
  }
}

