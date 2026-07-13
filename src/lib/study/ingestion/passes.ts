import type { FetchedFile } from "./fetcher";

export interface GenerationOptions {
  language: string;
  framework?: string;
}

export interface PassResult<T> {
  success: boolean;
  data: T[];
  error?: string;
  raw?: string;
}

export interface GeneratedNode {
  title: string;
  kind: "concept" | "module" | "function";
  parentTitle?: string;
  requires: string[];
}

export interface GeneratedSection {
  title: string;
  nodeTitle: string;
  bodyMd: string;
  order: number;
}

export interface GeneratedExercise {
  type: number;
  level: "beginner" | "intermediate" | "advanced";
  promptMd: string;
  choices?: string[];
  answerKeyMd: string;
  points: number;
}

export interface GeneratedCard {
  frontMd: string;
  backMd: string;
  nodeTitle: string;
}

export const MAP_SYSTEM_PROMPT = `You are a code comprehension tutor. Given source files from a codebase, produce a concept map as a JSON array of objects.

Each object has:
- "title": short concept name
- "kind": "concept" | "module" | "function"
- "parentTitle": optional title of parent concept
- "requires": array of prerequisite concept titles (empty if none)

Output ONLY a valid JSON array. No markdown, no backticks, no explanation.`;

export const SECTION_SYSTEM_PROMPT = `You are a code comprehension tutor writing apostila-style lessons. Given source files and a concept, produce a JSON array of lesson sections.

Each object has:
- "title": section title
- "nodeTitle": which concept this section belongs to
- "bodyMd": markdown body of the lesson (include code samples, explanations, insights)
- "order": numeric order

Output ONLY a valid JSON array. No markdown, no backticks.`;

export const EXERCISE_SYSTEM_PROMPT = `You are a code comprehension tutor. Given source files, produce a JSON array of exercises.

Each object has:
- "type": 1 (Read & predict) | 2 (Why this design) | 3 (Spot the risk) | 4 (Refactor critique) | 5 (Trace the flow) | 6 (Flash recall)
- "level": "beginner" | "intermediate" | "advanced"
- "promptMd": prompt in markdown
- "choices": optional array of answer choices for multiple choice
- "answerKeyMd": correct answer in markdown
- "points": number (5-20)

Output ONLY a valid JSON array. No markdown, no backticks.`;

export const CARD_SYSTEM_PROMPT = `You are a code comprehension tutor using SM-2 flashcards. Given source files, produce a JSON array of flashcards.

Each object has:
- "frontMd": the question or prompt
- "backMd": the answer or explanation
- "nodeTitle": which concept this card belongs to

Output ONLY a valid JSON array. No markdown, no backticks.`;

function buildCodeContext(files: FetchedFile[], maxChars = 8000): string {
  let context = "";
  for (const f of files) {
    const header = `// ── ${f.path} ──\n`;
    const available = maxChars - context.length - header.length - 100;
    if (available <= 0) break;
    const snippet = f.content.slice(0, Math.min(f.content.length, available));
    context += `${header}${snippet}\n\n`;
  }
  return context;
}

async function callAI(
  prompt: string,
  systemPrompt: string,
): Promise<{ text: string; finishReason: string }> {
  const provider = localStorage.getItem("chiron.ai.provider") || "gemini-hosted";
  const apiKey = localStorage.getItem("chiron.ai.apiKey") || "";
  const model = localStorage.getItem("chiron.ai.model") || "gemini-3.1-flash-lite";

  if (provider === "gemini-hosted" || provider === "openrouter-hosted") {
    const { getSupabaseClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseClient();
    if (!supabase) return { text: "Cloud account required.", finishReason: "error" };
    const { data, error } = await supabase.functions.invoke("ai-proxy", {
      body: { prompt, systemPrompt, provider: provider === "gemini-hosted" ? "gemini" : "openrouter", model },
    });
    if (error) return { text: `Proxy error: ${error.message}`, finishReason: "error" };
    return { text: data.text || "", finishReason: data.finishReason || "stop" };
  }

  if (provider === "gemini" && apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    });
    if (!res.ok) return { text: `Gemini error ${res.status}`, finishReason: "error" };
    const data = await res.json();
    return {
      text: data.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? "").join("") ?? "",
      finishReason: "stop",
    };
  }

  if (provider === "openai" && apiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return { text: `OpenAI error ${res.status}`, finishReason: "error" };
    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content ?? "", finishReason: "stop" };
  }

  return { text: "AI not configured. Set a provider and API key in Settings.", finishReason: "error" };
}

function parseJSON<T>(raw: string): PassResult<T> {
  const cleaned = raw
    .replace(/```(?:json)?/gi, "")
    .trim();
  try {
    const data = JSON.parse(cleaned) as T[];
    if (!Array.isArray(data)) throw new Error("Not an array");
    return { success: true, data, raw };
  } catch (err) {
    return { success: false, data: [], error: `Parse failed: ${err instanceof Error ? err.message : String(err)}`, raw };
  }
}

export async function generateMap(
  files: FetchedFile[],
  readme: string | null,
  options: GenerationOptions,
): Promise<PassResult<GeneratedNode>> {
  const context = buildCodeContext(files);
  const readmeSection = readme ? `README:\n${readme.slice(0, 1500)}\n\n` : "";
  const prompt = `Language: ${options.language}${options.framework ? ` / Framework: ${options.framework}` : ""}

${readmeSection}Source files:
${context}

Generate a concept map from this codebase. Focus on architecture, key modules, data flow, and design patterns.`;

  const result = await callAI(prompt, MAP_SYSTEM_PROMPT);
  if (result.finishReason === "error") return { success: false, data: [], error: result.text };
  return parseJSON<GeneratedNode>(result.text);
}

export async function generateSections(
  files: FetchedFile[],
  _nodes: GeneratedNode[],
  options: GenerationOptions,
): Promise<PassResult<GeneratedSection>> {
  const context = buildCodeContext(files);
  const prompt = `Language: ${options.language}${options.framework ? ` / Framework: ${options.framework}` : ""}

Source files:
${context}

Generate apostila-style lesson sections that teach how to read and understand this codebase. Each section should explain a concept with code examples.`;

  const result = await callAI(prompt, SECTION_SYSTEM_PROMPT);
  if (result.finishReason === "error") return { success: false, data: [], error: result.text };
  return parseJSON<GeneratedSection>(result.text);
}

export async function generateExercises(
  files: FetchedFile[],
  options: GenerationOptions,
): Promise<PassResult<GeneratedExercise>> {
  const context = buildCodeContext(files);
  const prompt = `Language: ${options.language}${options.framework ? ` / Framework: ${options.framework}` : ""}

Source files:
${context}

Generate code comprehension exercises. Mix types: some "Read & predict", some "Why this design", some "Spot the risk", some "Trace the flow". Include at least one advanced exercise.`;

  const result = await callAI(prompt, EXERCISE_SYSTEM_PROMPT);
  if (result.finishReason === "error") return { success: false, data: [], error: result.text };
  return parseJSON<GeneratedExercise>(result.text);
}

export async function generateCards(
  files: FetchedFile[],
  options: GenerationOptions,
): Promise<PassResult<GeneratedCard>> {
  const context = buildCodeContext(files);
  const prompt = `Language: ${options.language}${options.framework ? ` / Framework: ${options.framework}` : ""}

Source files:
${context}

Generate SM-2 flashcards that test understanding of code patterns, architecture decisions, and key concepts.`;

  const result = await callAI(prompt, CARD_SYSTEM_PROMPT);
  if (result.finishReason === "error") return { success: false, data: [], error: result.text };
  return parseJSON<GeneratedCard>(result.text);
}
