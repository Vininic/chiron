import type { ContentSource } from "./types";
import { GIT_GITHUB_CARDS, GIT_GITHUB_EXERCISES } from "./gitGithubAssessments";
import { GIT_GITHUB_CURRICULUM } from "./gitGithubCurriculum";
import { gitGithubChapter } from "./gitGithubSupport";

const chapters = GIT_GITHUB_CURRICULUM.map(gitGithubChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "agora", layerId: "reserva-estoque-concorrencia" });

/** Draft completo: exemplos locais verificados; gates GitHub/API/Actions/rulesets externos continuam Pending. */
export const GIT_GITHUB_CONTENT: ContentSource = {
  name: "Git / GitHub",
  kind: "stack",
  language: "Shell",
  chapters,
  exercises: GIT_GITHUB_EXERCISES,
  cards: GIT_GITHUB_CARDS,
};
