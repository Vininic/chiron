import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { FLASK_AUTHORED_PROSE } from "./flaskAuthoredProse";
import { type FlaskChapter, type FlaskLesson } from "./flaskCurriculum";
import { FLASK_EXAMPLES } from "./flaskExamples";

function section([title, thesis, mechanism, incident]: FlaskLesson, order: number): ContentSection {
  const authored = FLASK_AUTHORED_PROSE[title];
  const examples = FLASK_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Flask: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Flask: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em Flask, ${mechanism}; o aceite identifica Python, Flask, servidor, adapters, artifact e fronteira realmente exercitada.`]),
      quebraria([`${incident}. O mutante deve divergir em HTTP, tenant, transaction, estado, efeito, sigilo, recursos ou recuperação.`]),
    ],
  };
}

export function flaskChapter([title, level, _primer, lessons]: FlaskChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
