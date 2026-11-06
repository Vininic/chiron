import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { CPP_AUTHORED_PROSE } from "./cppAuthoredProse";
import { type CppChapter, type CppLesson } from "./cppCurriculum";
import { CPP_EXAMPLES } from "./cppExamples";

function section([title, thesis, mechanism, incident]: CppLesson, order: number): ContentSection {
  const authored = CPP_AUTHORED_PROSE[title];
  const examples = CPP_EXAMPLES[title];
  if (!authored?.length) throw new Error(`C++: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`C++: dois exemplos ausentes em "${title}"`);
  return { title, order, blocks: [
    prose(authored),
    code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
    code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
    porque([`${thesis}. Em C++, ${mechanism}; o aceite identifica standard, compiler, target, artifact e fronteira realmente exercitada.`]),
    quebraria([`${incident}. O mutante deve divergir em compile/link, lifetime, bytes, estado, efeito, sigilo, desempenho ou recuperação.`]),
  ] };
}

export function cppChapter([title, level, _primer, lessons]: CppChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
