import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { GIT_GITHUB_AUTHORED_PROSE } from "./gitGithubAuthoredProse";
import { type GitGithubChapter, type GitGithubLesson } from "./gitGithubCurriculum";
import { GIT_GITHUB_EXAMPLES } from "./gitGithubExamples";

function section([title, thesis, mechanism, incident]: GitGithubLesson, order: number): ContentSection {
  const authored = GIT_GITHUB_AUTHORED_PROSE[title];
  const examples = GIT_GITHUB_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Git / GitHub: prosa autoral ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Git / GitHub: dois exemplos ausentes em "${title}"`);
  return {
    title,
    order,
    blocks: [
      prose(authored),
      code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose),
      code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose),
      porque([`${thesis}. Em Git / GitHub, ${mechanism}; o aceite identifica refs e SHAs, Git/gh, artifact e a fronteira realmente exercitada.`]),
      quebraria([`${incident}. O mutante deve divergir em ancestry, tree, index, permission, check, digest, efeito ou recuperação.`]),
    ],
  };
}

export function gitGithubChapter([title, level, _primer, lessons]: GitGithubChapter): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) };
}
