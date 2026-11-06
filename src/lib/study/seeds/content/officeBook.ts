// Índice da reescrita autoral do Pacote Office (PLANO.md §R.2). Exemplos
// executados no Excel, Word e PowerPoint instalados por scripts/run-office-snippets.mjs.
import type { BookChapter } from "./postgresqlBook";
import { OFFICE_BOOK_01, OFFICE_BOOK_01_CARDS, OFFICE_BOOK_01_EXERCISES } from "./officeBook01";
import { OFFICE_BOOK_02, OFFICE_BOOK_02_CARDS, OFFICE_BOOK_02_EXERCISES } from "./officeBook02";
import { OFFICE_BOOK_03, OFFICE_BOOK_03_CARDS, OFFICE_BOOK_03_EXERCISES } from "./officeBook03";
import { OFFICE_BOOK_04, OFFICE_BOOK_04_CARDS, OFFICE_BOOK_04_EXERCISES } from "./officeBook04";
import { OFFICE_BOOK_05, OFFICE_BOOK_05_CARDS, OFFICE_BOOK_05_EXERCISES } from "./officeBook05";
import { OFFICE_BOOK_06, OFFICE_BOOK_06_CARDS, OFFICE_BOOK_06_EXERCISES } from "./officeBook06";
import { OFFICE_BOOK_07, OFFICE_BOOK_07_CARDS, OFFICE_BOOK_07_EXERCISES } from "./officeBook07";
import { OFFICE_BOOK_08, OFFICE_BOOK_08_CARDS, OFFICE_BOOK_08_EXERCISES } from "./officeBook08";
import { OFFICE_BOOK_09, OFFICE_BOOK_09_CARDS, OFFICE_BOOK_09_EXERCISES } from "./officeBook09";
import { OFFICE_BOOK_10, OFFICE_BOOK_10_CARDS, OFFICE_BOOK_10_EXERCISES } from "./officeBook10";
import { OFFICE_BOOK_11, OFFICE_BOOK_11_CARDS, OFFICE_BOOK_11_EXERCISES } from "./officeBook11";
import { OFFICE_BOOK_12, OFFICE_BOOK_12_CARDS, OFFICE_BOOK_12_EXERCISES } from "./officeBook12";
import { OFFICE_BOOK_13, OFFICE_BOOK_13_CARDS, OFFICE_BOOK_13_EXERCISES } from "./officeBook13";

export const OFFICE_BOOK: BookChapter[] = [
  { chapter: OFFICE_BOOK_01, exercises: OFFICE_BOOK_01_EXERCISES, cards: OFFICE_BOOK_01_CARDS },
  { chapter: OFFICE_BOOK_02, exercises: OFFICE_BOOK_02_EXERCISES, cards: OFFICE_BOOK_02_CARDS },
  { chapter: OFFICE_BOOK_03, exercises: OFFICE_BOOK_03_EXERCISES, cards: OFFICE_BOOK_03_CARDS },
  { chapter: OFFICE_BOOK_04, exercises: OFFICE_BOOK_04_EXERCISES, cards: OFFICE_BOOK_04_CARDS },
  { chapter: OFFICE_BOOK_05, exercises: OFFICE_BOOK_05_EXERCISES, cards: OFFICE_BOOK_05_CARDS },
  { chapter: OFFICE_BOOK_06, exercises: OFFICE_BOOK_06_EXERCISES, cards: OFFICE_BOOK_06_CARDS },
  { chapter: OFFICE_BOOK_07, exercises: OFFICE_BOOK_07_EXERCISES, cards: OFFICE_BOOK_07_CARDS },
  { chapter: OFFICE_BOOK_08, exercises: OFFICE_BOOK_08_EXERCISES, cards: OFFICE_BOOK_08_CARDS },
  { chapter: OFFICE_BOOK_09, exercises: OFFICE_BOOK_09_EXERCISES, cards: OFFICE_BOOK_09_CARDS },
  { chapter: OFFICE_BOOK_10, exercises: OFFICE_BOOK_10_EXERCISES, cards: OFFICE_BOOK_10_CARDS },
  { chapter: OFFICE_BOOK_11, exercises: OFFICE_BOOK_11_EXERCISES, cards: OFFICE_BOOK_11_CARDS },
  { chapter: OFFICE_BOOK_12, exercises: OFFICE_BOOK_12_EXERCISES, cards: OFFICE_BOOK_12_CARDS },
  { chapter: OFFICE_BOOK_13, exercises: OFFICE_BOOK_13_EXERCISES, cards: OFFICE_BOOK_13_CARDS },
];
