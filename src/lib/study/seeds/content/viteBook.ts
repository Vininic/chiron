// Índice da reescrita autoral de Vite (PLANO.md §R.2), escrita para o Vite 8
// (Rolldown e Oxc) com um capítulo de migração a partir do Vite 5, que os apps
// da suíte ainda usam. Exemplos verificados por scripts/run-vite-snippets.mjs.
import type { BookChapter } from "./postgresqlBook";
import { VITE_BOOK_01, VITE_BOOK_01_CARDS, VITE_BOOK_01_EXERCISES } from "./viteBook01";
import { VITE_BOOK_02, VITE_BOOK_02_CARDS, VITE_BOOK_02_EXERCISES } from "./viteBook02";
import { VITE_BOOK_03, VITE_BOOK_03_CARDS, VITE_BOOK_03_EXERCISES } from "./viteBook03";
import { VITE_BOOK_04, VITE_BOOK_04_CARDS, VITE_BOOK_04_EXERCISES } from "./viteBook04";
import { VITE_BOOK_05, VITE_BOOK_05_CARDS, VITE_BOOK_05_EXERCISES } from "./viteBook05";
import { VITE_BOOK_06, VITE_BOOK_06_CARDS, VITE_BOOK_06_EXERCISES } from "./viteBook06";
import { VITE_BOOK_07, VITE_BOOK_07_CARDS, VITE_BOOK_07_EXERCISES } from "./viteBook07";
import { VITE_BOOK_08, VITE_BOOK_08_CARDS, VITE_BOOK_08_EXERCISES } from "./viteBook08";
import { VITE_BOOK_09, VITE_BOOK_09_CARDS, VITE_BOOK_09_EXERCISES } from "./viteBook09";
import { VITE_BOOK_10, VITE_BOOK_10_CARDS, VITE_BOOK_10_EXERCISES } from "./viteBook10";
import { VITE_BOOK_11, VITE_BOOK_11_CARDS, VITE_BOOK_11_EXERCISES } from "./viteBook11";
import { VITE_BOOK_12, VITE_BOOK_12_CARDS, VITE_BOOK_12_EXERCISES } from "./viteBook12";
import { VITE_BOOK_13, VITE_BOOK_13_CARDS, VITE_BOOK_13_EXERCISES } from "./viteBook13";
import { VITE_BOOK_14, VITE_BOOK_14_CARDS, VITE_BOOK_14_EXERCISES } from "./viteBook14";

export const VITE_BOOK: BookChapter[] = [
  { chapter: VITE_BOOK_01, exercises: VITE_BOOK_01_EXERCISES, cards: VITE_BOOK_01_CARDS },
  { chapter: VITE_BOOK_02, exercises: VITE_BOOK_02_EXERCISES, cards: VITE_BOOK_02_CARDS },
  { chapter: VITE_BOOK_03, exercises: VITE_BOOK_03_EXERCISES, cards: VITE_BOOK_03_CARDS },
  { chapter: VITE_BOOK_04, exercises: VITE_BOOK_04_EXERCISES, cards: VITE_BOOK_04_CARDS },
  { chapter: VITE_BOOK_05, exercises: VITE_BOOK_05_EXERCISES, cards: VITE_BOOK_05_CARDS },
  { chapter: VITE_BOOK_06, exercises: VITE_BOOK_06_EXERCISES, cards: VITE_BOOK_06_CARDS },
  { chapter: VITE_BOOK_07, exercises: VITE_BOOK_07_EXERCISES, cards: VITE_BOOK_07_CARDS },
  { chapter: VITE_BOOK_08, exercises: VITE_BOOK_08_EXERCISES, cards: VITE_BOOK_08_CARDS },
  { chapter: VITE_BOOK_09, exercises: VITE_BOOK_09_EXERCISES, cards: VITE_BOOK_09_CARDS },
  { chapter: VITE_BOOK_10, exercises: VITE_BOOK_10_EXERCISES, cards: VITE_BOOK_10_CARDS },
  { chapter: VITE_BOOK_11, exercises: VITE_BOOK_11_EXERCISES, cards: VITE_BOOK_11_CARDS },
  { chapter: VITE_BOOK_14, exercises: VITE_BOOK_14_EXERCISES, cards: VITE_BOOK_14_CARDS }, // armadilhas, antes da migração
  { chapter: VITE_BOOK_12, exercises: VITE_BOOK_12_EXERCISES, cards: VITE_BOOK_12_CARDS },
  { chapter: VITE_BOOK_13, exercises: VITE_BOOK_13_EXERCISES, cards: VITE_BOOK_13_CARDS },
];
