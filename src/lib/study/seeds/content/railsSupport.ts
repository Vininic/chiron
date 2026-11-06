import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { RAILS_AUTHORED_PROSE } from "./railsAuthoredProse";
import { type RailsChapter, type RailsLesson } from "./railsCurriculum";
import { RAILS_EXAMPLES } from "./railsExamples";

function section([title, thesis, mechanism, incident]: RailsLesson, order: number): ContentSection {
  const authored = RAILS_AUTHORED_PROSE[title]; const examples = RAILS_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Rails: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Rails: dois exemplos ausentes em "${title}"`);
  return { title, order, blocks: [prose(authored),
    code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
    code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
    porque([`${thesis}. Em Rails, ${mechanism}; o aceite identifica runtime, adapters, artifact e fronteira exercitada.`]),
    quebraria([`${incident}. O mutante deve divergir em HTTP, tenant, transaction, state, effect, secrecy, performance ou recovery.`]) ] };
}
export function railsChapter([title, level, _primer, lessons]: RailsChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
