import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { SPRING_BOOT_AUTHORED_PROSE } from "./springbootAuthoredProse";
import { type SpringBootChapter, type SpringBootLesson } from "./springbootCurriculum";
import { SPRING_BOOT_EXAMPLES } from "./springbootExamples";

function section([title, thesis, mechanism, incident]: SpringBootLesson, order: number): ContentSection {
  const authored = SPRING_BOOT_AUTHORED_PROSE[title];
  const examples = SPRING_BOOT_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Spring Boot: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Spring Boot: dois exemplos ausentes em "${title}"`);
  return { title, order, blocks: [
    prose(authored),
    code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
    code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
    porque([`${thesis}. Em Spring Boot, ${mechanism}; o aceite exige distinguir composição do contexto, efeito local e efeito externo.`]),
    quebraria([`${incident}. O mutante precisa falhar em resposta, estado, exclusividade, sigilo ou recuperação observáveis — não apenas na opinião do revisor.`]),
  ] };
}

export function springBootChapter([title, level, _primer, lessons]: SpringBootChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
