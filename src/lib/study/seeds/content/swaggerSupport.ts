import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { SWAGGER_AUTHORED_PROSE } from "./swaggerAuthoredProse";
import { type SwaggerChapter, type SwaggerLesson } from "./swaggerCurriculum";
import { SWAGGER_EXAMPLES } from "./swaggerExamples";

function section([title, thesis, mechanism, incident]: SwaggerLesson, order: number): ContentSection {
  const authored = SWAGGER_AUTHORED_PROSE[title];
  const examples = SWAGGER_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Swagger: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Swagger: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em OpenAPI, ${mechanism}; o aceite identifica Specification/dialeto, artifact resolvido, toolchain e a fronteira realmente executada.`]),
      quebraria([`${incident}. O mutante precisa divergir em parse, validação, wire, segurança, compatibilidade, efeito, promoção ou recuperação.`]),
    ],
  };
}

export function swaggerChapter([title, level, _primer, lessons]: SwaggerChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
