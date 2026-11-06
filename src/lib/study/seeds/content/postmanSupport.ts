import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { POSTMAN_AUTHORED_PROSE } from "./postmanAuthoredProse";
import { type PostmanChapter, type PostmanLesson } from "./postmanCurriculum";
import { POSTMAN_EXAMPLES } from "./postmanExamples";

function section([title, thesis, mechanism, incident]: PostmanLesson, order: number): ContentSection {
  const authored = POSTMAN_AUTHORED_PROSE[title];
  const examples = POSTMAN_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Postman: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Postman: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em Postman, ${mechanism}; o aceite identifica artifact, scope, executor, principal e a fronteira realmente verificada.`]),
      quebraria([`${incident}. O mutante precisa divergir em wire, assertion, workflow, permissão, efeito, promoção ou recuperação.`]),
    ],
  };
}

export function postmanChapter([title, level, _primer, lessons]: PostmanChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
