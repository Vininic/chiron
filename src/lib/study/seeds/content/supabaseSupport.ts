import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { SUPABASE_AUTHORED_PROSE } from "./supabaseAuthoredProse";
import { SUPABASE_DEPTH_ADDITIONS } from "./supabaseDepthAdditions";
import { SUPABASE_CURRICULUM, type SupabaseChapterSpec, type SupabaseLessonSpec, type SupabaseLevel } from "./supabaseCurriculum";
import { SUPABASE_EXAMPLES } from "./supabaseExamples";

export interface SupabaseLesson { title: string; thesis: string; mechanism: string; incident: string; exampleA: string; exampleB: string; prose: string[]; }
const LEVEL: Record<SupabaseLevel, ContentChapter["level"]> = { basico: "basico", intermediario: "intermediario", avancado: "avancado" };

function materialize(spec: SupabaseLessonSpec): SupabaseLesson {
  const [title, thesis, mechanism, incident] = spec;
  const authored = SUPABASE_AUTHORED_PROSE[title];
  const examples = SUPABASE_EXAMPLES[title];
  if (!authored) throw new Error(`A seção Supabase “${title}” não possui prosa autoral revisada.`);
  if (!examples) throw new Error(`A seção Supabase “${title}” não possui exemplos revisados.`);
  return { title, thesis, mechanism, incident, exampleA: examples[0], exampleB: examples[1], prose: authored };
}

function section(lesson: SupabaseLesson, order: number): ContentSection {
  return { title: lesson.title, order, blocks: [
    prose([...lesson.prose, ...(SUPABASE_DEPTH_ADDITIONS[lesson.title] ?? [])]),
    code("typescript", lesson.exampleA.split("\n"), `Baseline de ${lesson.title} com cliente Supabase e/ou SQL versionado.`),
    code("typescript", lesson.exampleB.split("\n"), `Contraprova observável de ${lesson.title}.`),
    porque([`${lesson.thesis}. Em Supabase, ${lesson.mechanism}; o aceite precisa ligar identidade, policy, serviço e evidência.`]),
    quebraria([`${lesson.incident}. O mutante deve reproduzir esse desvio e provar estado final e cleanup, não apenas uma exceção incidental.`]),
  ] };
}

export function supabaseChapter([title, level, _primer, lessons]: SupabaseChapterSpec): ContentChapter {
  return { title, level: LEVEL[level], nodeTitle: title, nodeKind: "concept", sections: lessons.map((spec, index) => section(materialize(spec), index)) };
}
