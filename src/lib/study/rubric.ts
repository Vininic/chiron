// AI rubric grading for type-2 exercises ("why this design") — the only
// exercise type whose real seed data ships a `rubricMd` alongside free
// prose, so it's the only type graded by asking Aetheris to check the
// student's answer against real criteria instead of self-report.
import type { ChatMessage } from "@/lib/ai/providers";
import type { Exercise } from "./types";

export function buildRubricGradingMessages(exercise: Exercise, answer: string): ChatMessage[] {
  return [
    {
      role: "system",
      content:
        "Você é um tutor técnico avaliando a resposta de um estudante contra uma rubrica. " +
        "Responda SEMPRE e SOMENTE no formato exato abaixo, sem nada antes ou depois:\n" +
        "NOTA: <número entre 0 e 1, ex: 0.75>\n" +
        "FEEDBACK: <2-4 frases diretas dizendo o que a resposta acertou e o que faltou>",
    },
    {
      role: "user",
      content:
        `Pergunta: ${exercise.promptMd}\n\n` +
        `Rubrica: ${exercise.rubricMd ?? "(nenhuma rubrica específica — avalie comparando com a resposta-modelo abaixo)"}\n\n` +
        `Resposta-modelo de referência: ${exercise.answerKeyMd}\n\n` +
        `Resposta do estudante: ${answer}`,
    },
  ];
}

export interface RubricVerdict {
  fraction: number;
  feedback: string;
}

/** Parses the AI's `NOTA:`/`FEEDBACK:` reply. Falls back to treating the
 *  whole reply as feedback with a zero score if the model didn't follow the
 *  format — an unparsed reply must not silently look like a passing grade. */
export function parseRubricVerdict(raw: string): RubricVerdict {
  const notaMatch = raw.match(/NOTA:\s*([\d.]+)/i);
  const feedbackMatch = raw.match(/FEEDBACK:\s*([\s\S]*)/i);
  const parsed = notaMatch ? parseFloat(notaMatch[1]) : NaN;
  const fraction = Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : 0;
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : raw.trim();
  return { fraction, feedback };
}
