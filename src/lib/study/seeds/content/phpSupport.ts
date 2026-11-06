import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { PHP_AUTHORED_PROSE } from "./phpAuthoredProse";
import { type PhpChapter, type PhpLesson } from "./phpCurriculum";
import { PHP_EXAMPLES } from "./phpExamples";

function section([title, thesis, mechanism, incident]: PhpLesson, order: number): ContentSection {
  const authored = PHP_AUTHORED_PROSE[title];
  const examples = PHP_EXAMPLES[title];
  if (!authored?.length) throw new Error(`PHP: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`PHP: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em PHP, ${mechanism}; o aceite identifica versão, SAPI, extensões, adapters, artifact e fronteira realmente exercitada.`]),
      quebraria([`${incident}. O mutante deve divergir em HTTP, tenant, transaction, estado, efeito, sigilo, recursos ou recuperação.`]),
    ],
  };
}

export function phpChapter([title, level, _primer, lessons]: PhpChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
