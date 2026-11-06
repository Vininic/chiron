// Índice da reescrita autoral de jQuery (PLANO.md §R.2), escrita para o
// jQuery 4.0.0, com capítulo de migração a partir do jQuery 3. Exemplos
// executados no Edge headless por scripts/run-jquery-snippets.mjs.
import type { BookChapter } from "./postgresqlBook";
import { JQUERY_BOOK_01, JQUERY_BOOK_01_CARDS, JQUERY_BOOK_01_EXERCISES } from "./jqueryBook01";
import { JQUERY_BOOK_02, JQUERY_BOOK_02_CARDS, JQUERY_BOOK_02_EXERCISES } from "./jqueryBook02";
import { JQUERY_BOOK_03, JQUERY_BOOK_03_CARDS, JQUERY_BOOK_03_EXERCISES } from "./jqueryBook03";
import { JQUERY_BOOK_04, JQUERY_BOOK_04_CARDS, JQUERY_BOOK_04_EXERCISES } from "./jqueryBook04";
import { JQUERY_BOOK_05, JQUERY_BOOK_05_CARDS, JQUERY_BOOK_05_EXERCISES } from "./jqueryBook05";
import { JQUERY_BOOK_06, JQUERY_BOOK_06_CARDS, JQUERY_BOOK_06_EXERCISES } from "./jqueryBook06";
import { JQUERY_BOOK_07, JQUERY_BOOK_07_CARDS, JQUERY_BOOK_07_EXERCISES } from "./jqueryBook07";
import { JQUERY_BOOK_08, JQUERY_BOOK_08_CARDS, JQUERY_BOOK_08_EXERCISES } from "./jqueryBook08";
import { JQUERY_BOOK_09, JQUERY_BOOK_09_CARDS, JQUERY_BOOK_09_EXERCISES } from "./jqueryBook09";
import { JQUERY_BOOK_10, JQUERY_BOOK_10_CARDS, JQUERY_BOOK_10_EXERCISES } from "./jqueryBook10";
import { JQUERY_BOOK_11, JQUERY_BOOK_11_CARDS, JQUERY_BOOK_11_EXERCISES } from "./jqueryBook11";
import { JQUERY_BOOK_12, JQUERY_BOOK_12_CARDS, JQUERY_BOOK_12_EXERCISES } from "./jqueryBook12";
import { JQUERY_BOOK_13, JQUERY_BOOK_13_CARDS, JQUERY_BOOK_13_EXERCISES } from "./jqueryBook13";

export const JQUERY_BOOK: BookChapter[] = [
  { chapter: JQUERY_BOOK_01, exercises: JQUERY_BOOK_01_EXERCISES, cards: JQUERY_BOOK_01_CARDS },
  { chapter: JQUERY_BOOK_02, exercises: JQUERY_BOOK_02_EXERCISES, cards: JQUERY_BOOK_02_CARDS },
  { chapter: JQUERY_BOOK_03, exercises: JQUERY_BOOK_03_EXERCISES, cards: JQUERY_BOOK_03_CARDS },
  { chapter: JQUERY_BOOK_04, exercises: JQUERY_BOOK_04_EXERCISES, cards: JQUERY_BOOK_04_CARDS },
  { chapter: JQUERY_BOOK_05, exercises: JQUERY_BOOK_05_EXERCISES, cards: JQUERY_BOOK_05_CARDS },
  { chapter: JQUERY_BOOK_06, exercises: JQUERY_BOOK_06_EXERCISES, cards: JQUERY_BOOK_06_CARDS },
  { chapter: JQUERY_BOOK_07, exercises: JQUERY_BOOK_07_EXERCISES, cards: JQUERY_BOOK_07_CARDS },
  { chapter: JQUERY_BOOK_08, exercises: JQUERY_BOOK_08_EXERCISES, cards: JQUERY_BOOK_08_CARDS },
  { chapter: JQUERY_BOOK_09, exercises: JQUERY_BOOK_09_EXERCISES, cards: JQUERY_BOOK_09_CARDS },
  { chapter: JQUERY_BOOK_10, exercises: JQUERY_BOOK_10_EXERCISES, cards: JQUERY_BOOK_10_CARDS },
  { chapter: JQUERY_BOOK_11, exercises: JQUERY_BOOK_11_EXERCISES, cards: JQUERY_BOOK_11_CARDS },
  { chapter: JQUERY_BOOK_12, exercises: JQUERY_BOOK_12_EXERCISES, cards: JQUERY_BOOK_12_CARDS },
  { chapter: JQUERY_BOOK_13, exercises: JQUERY_BOOK_13_EXERCISES, cards: JQUERY_BOOK_13_CARDS },
];
