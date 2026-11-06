// Índice da reescrita autoral de Vitest (PLANO.md §R.2), escrita para o
// Vitest 5 (com Vite 8), com capítulo de migração a partir do Vitest 3, que os
// apps da suíte usam. Exemplos executados por scripts/run-vitest-snippets.mjs.
import type { BookChapter } from "./postgresqlBook";
import { VITEST_BOOK_01, VITEST_BOOK_01_CARDS, VITEST_BOOK_01_EXERCISES } from "./vitestBook01";
import { VITEST_BOOK_02, VITEST_BOOK_02_CARDS, VITEST_BOOK_02_EXERCISES } from "./vitestBook02";
import { VITEST_BOOK_03, VITEST_BOOK_03_CARDS, VITEST_BOOK_03_EXERCISES } from "./vitestBook03";
import { VITEST_BOOK_04, VITEST_BOOK_04_CARDS, VITEST_BOOK_04_EXERCISES } from "./vitestBook04";
import { VITEST_BOOK_05, VITEST_BOOK_05_CARDS, VITEST_BOOK_05_EXERCISES } from "./vitestBook05";
import { VITEST_BOOK_06, VITEST_BOOK_06_CARDS, VITEST_BOOK_06_EXERCISES } from "./vitestBook06";
import { VITEST_BOOK_07, VITEST_BOOK_07_CARDS, VITEST_BOOK_07_EXERCISES } from "./vitestBook07";
import { VITEST_BOOK_08, VITEST_BOOK_08_CARDS, VITEST_BOOK_08_EXERCISES } from "./vitestBook08";
import { VITEST_BOOK_09, VITEST_BOOK_09_CARDS, VITEST_BOOK_09_EXERCISES } from "./vitestBook09";
import { VITEST_BOOK_10, VITEST_BOOK_10_CARDS, VITEST_BOOK_10_EXERCISES } from "./vitestBook10";
import { VITEST_BOOK_11, VITEST_BOOK_11_CARDS, VITEST_BOOK_11_EXERCISES } from "./vitestBook11";
import { VITEST_BOOK_12, VITEST_BOOK_12_CARDS, VITEST_BOOK_12_EXERCISES } from "./vitestBook12";
import { VITEST_BOOK_13, VITEST_BOOK_13_CARDS, VITEST_BOOK_13_EXERCISES } from "./vitestBook13";
import { VITEST_BOOK_14, VITEST_BOOK_14_CARDS, VITEST_BOOK_14_EXERCISES } from "./vitestBook14";

export const VITEST_BOOK: BookChapter[] = [
  { chapter: VITEST_BOOK_01, exercises: VITEST_BOOK_01_EXERCISES, cards: VITEST_BOOK_01_CARDS },
  { chapter: VITEST_BOOK_02, exercises: VITEST_BOOK_02_EXERCISES, cards: VITEST_BOOK_02_CARDS },
  { chapter: VITEST_BOOK_03, exercises: VITEST_BOOK_03_EXERCISES, cards: VITEST_BOOK_03_CARDS },
  { chapter: VITEST_BOOK_04, exercises: VITEST_BOOK_04_EXERCISES, cards: VITEST_BOOK_04_CARDS },
  { chapter: VITEST_BOOK_05, exercises: VITEST_BOOK_05_EXERCISES, cards: VITEST_BOOK_05_CARDS },
  { chapter: VITEST_BOOK_06, exercises: VITEST_BOOK_06_EXERCISES, cards: VITEST_BOOK_06_CARDS },
  { chapter: VITEST_BOOK_07, exercises: VITEST_BOOK_07_EXERCISES, cards: VITEST_BOOK_07_CARDS },
  { chapter: VITEST_BOOK_08, exercises: VITEST_BOOK_08_EXERCISES, cards: VITEST_BOOK_08_CARDS },
  { chapter: VITEST_BOOK_09, exercises: VITEST_BOOK_09_EXERCISES, cards: VITEST_BOOK_09_CARDS },
  { chapter: VITEST_BOOK_10, exercises: VITEST_BOOK_10_EXERCISES, cards: VITEST_BOOK_10_CARDS },
  { chapter: VITEST_BOOK_11, exercises: VITEST_BOOK_11_EXERCISES, cards: VITEST_BOOK_11_CARDS },
  { chapter: VITEST_BOOK_12, exercises: VITEST_BOOK_12_EXERCISES, cards: VITEST_BOOK_12_CARDS },
  { chapter: VITEST_BOOK_13, exercises: VITEST_BOOK_13_EXERCISES, cards: VITEST_BOOK_13_CARDS },
  { chapter: VITEST_BOOK_14, exercises: VITEST_BOOK_14_EXERCISES, cards: VITEST_BOOK_14_CARDS },
];
