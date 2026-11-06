import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { C_AUTHORED_PROSE } from "./cAuthoredProse";
import { type CChapter, type CLesson } from "./cCurriculum";
import { C_EXAMPLES } from "./cExamples";

function section([title, thesis, mechanism, incident]: CLesson, order: number): ContentSection {
  const authored = C_AUTHORED_PROSE[title];
  const examples = C_EXAMPLES[title];
  if (!authored?.length) throw new Error(`C: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`C: dois exemplos ausentes em "${title}"`);
  return { title, order, blocks: [
    prose(authored),
    code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
    code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
    porque([`${thesis}. Em C, ${mechanism}; o aceite precisa nomear compilador, target e fronteira realmente exercitada.`]),
    quebraria([`${incident}. O mutante deve divergir em memória, bytes, estado, efeito, sigilo ou recuperação, não apenas em estilo.`]),
  ] };
}

export function cChapter([title, level, _primer, lessons]: CChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
