import type { ContentSource } from "./types";
import { VUE_CARDS, VUE_EXERCISES } from "./vueAssessments";
import { VUE_CURRICULUM } from "./vueCurriculum";
import { vueChapter } from "./vueSupport";

const chapters = VUE_CURRICULUM.map(vueChapter);
chapters.at(-1)?.sections.at(-1)?.blocks.push({ kind: "labref", labId: "ophis", layerId: "vue-ultima-vaga" });

/** Draft completo; sem editorial até runtime Vue/browser e gates externos essenciais. */
export const VUE_CONTENT: ContentSource = {
  name: "Vue.js",
  kind: "stack",
  language: "TypeScript",
  chapters,
  exercises: VUE_EXERCISES,
  cards: VUE_CARDS,
};
