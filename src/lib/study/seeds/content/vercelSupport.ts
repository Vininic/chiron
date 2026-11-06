import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { VERCEL_AUTHORED_PROSE } from "./vercelAuthoredProse";
import { type VercelChapter, type VercelLesson } from "./vercelCurriculum";
import { VERCEL_EXAMPLES } from "./vercelExamples";

function section([title, thesis, mechanism, incident]: VercelLesson, order: number): ContentSection {
  const authored = VERCEL_AUTHORED_PROSE[title];
  const examples = VERCEL_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Vercel: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Vercel: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em Vercel, ${mechanism}; o aceite identifica artifact, ambiente, principal, efeito e a fronteira realmente observada.`]),
      quebraria([`${incident}. O mutante precisa divergir em deployment, cache, permissão, wire, estado, promoção ou recuperação.`]),
    ],
  };
}

export function vercelChapter([title, level, _primer, lessons]: VercelChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
