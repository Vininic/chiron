import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { CSHARP_AUTHORED_PROSE } from "./csharpAuthoredProse";
import { type CSharpChapter, type CSharpLesson } from "./csharpCurriculum";
import { CSHARP_EXAMPLES } from "./csharpExamples";

function section([title, thesis, mechanism, incident]: CSharpLesson, order: number): ContentSection {
  const authored = CSHARP_AUTHORED_PROSE[title];
  const examples = CSHARP_EXAMPLES[title];
  if (!authored?.length) throw new Error(`C#: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`C#: dois exemplos ausentes em "${title}"`);
  return { title, order, blocks: [
    prose(authored),
    code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
    code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
    porque([`${thesis}. Em C#, ${mechanism}; o aceite compara tipo, runtime, efeito local e fronteira externa com o oráculo adequado.`]),
    quebraria([`${incident}. O mutante deve divergir em estado, resposta, bytes, exclusividade, sigilo ou recuperação, não apenas em estilo de código.`]),
  ] };
}

export function csharpChapter([title, level, _primer, lessons]: CSharpChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
