// PostgreSQL — reescrita autoral de 2026-10-23 (PLANO.md §R.2). Catorze
// capítulos, um por arquivo (postgresqlBook01..14, índice em
// postgresqlBook.ts), do modelo de cluster ao projeto integrador ligado ao Lab
// Ágora. Todo SQL é executado num PostgreSQL 18.3 real (PGlite) por
// postgresql.test.ts. Substitui a versão montada por compositor.
import type { ContentSource } from "./types";
import { POSTGRESQL_BOOK } from "./postgresqlBook";

export const POSTGRESQL_CONTENT: ContentSource = {
  name: "PostgreSQL",
  kind: "stack",
  language: "SQL",
  chapters: POSTGRESQL_BOOK.map((c) => c.chapter),
  exercises: POSTGRESQL_BOOK.flatMap((c) => c.exercises),
  cards: POSTGRESQL_BOOK.flatMap((c) => c.cards),
  editorial: { proseReviewed: true, assessmentsReviewed: true, examplesVerified: true, reviewedAt: "2026-10-23" },
};
