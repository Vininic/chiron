import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { DOCKER_AUTHORED_PROSE } from "./dockerAuthoredProse";
import { type DockerChapter, type DockerLesson } from "./dockerCurriculum";
import { DOCKER_EXAMPLES } from "./dockerExamples";

function section([title, thesis, mechanism, incident]: DockerLesson, order: number): ContentSection {
  const authored = DOCKER_AUTHORED_PROSE[title];
  const examples = DOCKER_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Docker: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Docker: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em Docker, ${mechanism}; o aceite identifica engine, host, plataforma, digests e a fronteira realmente executada.`]),
      quebraria([`${incident}. O mutante precisa divergir em conteúdo, configuração, isolamento, rede, saúde, efeito, policy ou recuperação.`]),
    ],
  };
}

export function dockerChapter([title, level, _primer, lessons]: DockerChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
