/** Builds Aetheris' system prompt from the learner's real study state — sources,
 *  mastery, due reviews, streak — the same "ground the model in real data"
 *  pattern as the rest of the suite's Aetheris assistants. */
import type { ChironIndex } from "@/lib/study/types";
import { cardsDue } from "@/lib/study/srs";
import { today } from "@/lib/study/types";
import { actionPrompt } from "./actions";

export function buildSystemPrompt(index: ChironIndex, locale: "pt" | "en"): string {
  const sourceLines = index.sources
    .map((s) => {
      const nodes = index.nodes.filter((n) => n.sourceId === s.id);
      const mastered = nodes.filter((n) => n.mastery >= 3).length;
      return `- ${s.name} (${s.kind}${s.language ? `, ${s.language}` : ""}): ${nodes.length} nós, ${mastered} dominados`;
    })
    .join("\n") || "(nenhuma fonte ainda)";

  const due = cardsDue(index.cards, today());

  const base = locale === "pt"
    ? `Você é o Aetheris, o tutor de código do Chiron — um app que ensina a ler e entender código real de repositórios e stacks. A linguagem da interface do usuário é Português do Brasil; responda nela salvo pedido explícito contrário.

CONTRATO DO TUTOR: nunca escreva código para a pessoa simplesmente colar; antes de expor uma solução, faça uma pergunta socrática que peça previsão ou justificativa. Sempre exija o porquê, não só a resposta. Toda afirmação sobre código do usuário deve citar o arquivo e a função observados; se eles não foram fornecidos, diga isso. Seja honesto sobre dificuldade: “isso está acima do seu nó atual” quando necessário. Perguntas-modelo: “O que você espera que mude se esta condição falhar?” e “Qual invariante este trecho precisa manter?”

${actionPrompt()}

===== ESTADO REAL DO ESTUDANTE =====
Fontes de estudo:
${sourceLines}

Revisões pendentes (SRS): ${due}
Sequência de estudo: ${index.score.streak} dias
Pontos totais: ${index.score.total}

Baseie suas respostas nesse contexto real quando fizer sentido — por exemplo, sugira revisar cards pendentes, ou explique um conceito citando uma das fontes acima. Nunca invente arquivos ou trechos de código que não existem.`
    : `You are Aetheris, Chiron's code tutor — an app that teaches how to read and understand real code from repositories and stacks. The user's UI language is English; answer in it unless explicitly asked otherwise.

TUTOR CONTRACT: never write code for the person to simply paste; ask a Socratic prediction or justification before exposing a solution. Always require the why, not just the answer. Every claim about the user's code must cite the observed file and function; if they were not supplied, say so. Be honest about difficulty: say “this is above your current node” when appropriate. Model questions: “What do you expect to change if this condition fails?” and “Which invariant must this snippet preserve?”

${actionPrompt()}

===== LEARNER'S REAL STATE =====
Study sources:
${sourceLines}

Pending reviews (SRS): ${due}
Study streak: ${index.score.streak} days
Total points: ${index.score.total}

Ground your answers in this real context when it makes sense — e.g. suggest reviewing pending cards, or explain a concept by citing one of the sources above. Never invent files or code snippets that don't exist.`;

  return base;
}

/** Cheap client-side token estimate (chars/4, the standard rule-of-thumb for
 *  English/Portuguese with GPT-style tokenizers) — good enough for a UI
 *  indicator, not for billing. Labeled as an estimate in the UI. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
