import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { VUE_AUTHORED_PROSE } from "./vueAuthoredProse";
import { type VueChapter, type VueLesson } from "./vueCurriculum";
import { VUE_EXAMPLES } from "./vueExamples";

function section([title, thesis, mechanism, incident]: VueLesson, order: number): ContentSection {
  const authored = VUE_AUTHORED_PROSE[title];
  const examples = VUE_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Vue.js: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Vue.js: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em Vue.js, ${mechanism}; o aceite identifica Vue/compiler, browser, adapters, artifact e fronteira realmente exercitada.`]),
      quebraria([`${incident}. O mutante deve divergir em DOM, acessibilidade, tenant, estado, efeito, sigilo, recursos ou recuperação.`]),
    ],
  };
}

export function vueChapter([title, level, _primer, lessons]: VueChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
