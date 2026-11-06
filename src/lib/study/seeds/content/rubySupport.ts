import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { RUBY_AUTHORED_PROSE } from "./rubyAuthoredProse";
import { type RubyChapter, type RubyLesson } from "./rubyCurriculum";
import { RUBY_EXAMPLES } from "./rubyExamples";

function section([title, thesis, mechanism, incident]: RubyLesson, order: number): ContentSection {
  const authored = RUBY_AUTHORED_PROSE[title];
  const examples = RUBY_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Ruby: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Ruby: dois exemplos ausentes em "${title}"`);
  return { title, order, blocks: [
    prose(authored),
    code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
    code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
    porque([`${thesis}. Em Ruby, ${mechanism}; o aceite identifica engine, versão, gems, artifact e fronteira realmente exercitada.`]),
    quebraria([`${incident}. O mutante deve divergir em valor, ownership, bytes, estado, efeito, sigilo, desempenho ou recuperação.`]),
  ] };
}

export function rubyChapter([title, level, _primer, lessons]: RubyChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
