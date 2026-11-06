import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { JAVA_AUTHORED_PROSE } from "./javaAuthoredProse";
import { type JavaChapterSpec, type JavaLessonSpec } from "./javaCurriculum";
import { JAVA_EXAMPLES } from "./javaExamples";

function materialize([title, thesis, mechanism, incident]: JavaLessonSpec) {
  const authored = JAVA_AUTHORED_PROSE[title];
  const examples = JAVA_EXAMPLES[title];
  if (!authored || authored.length === 0) throw new Error(`Java: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Java: dois exemplos ausentes em "${title}"`);
  return { title, thesis, mechanism, incident, prose: authored, exampleA: examples[0], exampleB: examples[1] };
}

function section(lesson: ReturnType<typeof materialize>, order: number): ContentSection {
  return { title: lesson.title, order, blocks: [
    prose(lesson.prose),
    code("java", lesson.exampleA.split("\n"), `Baseline compilável e executável de ${lesson.title}.`),
    code("java", lesson.exampleB.split("\n"), `Contraprova observável de ${lesson.title}.`),
    porque([`${lesson.thesis}. Em Java, ${lesson.mechanism}; o aceite liga regra da linguagem, biblioteca, JVM e efeito observável.`]),
    quebraria([`${lesson.incident}. O mutante precisa reproduzir o desvio e provar saída, estado e cleanup, não depender de timing acidental.`]),
  ] };
}

export function javaChapter([title, level, _primer, lessons]: JavaChapterSpec): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map((spec, index) => section(materialize(spec), index)) };
}
