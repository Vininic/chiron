import { describe, expect, it } from "vitest";
import { checkEditorialSource, editorialMetrics } from "./editorial";
import { PYTHON_CONTENT } from "@/lib/study/seeds/content/python";
import { JAVASCRIPT_CONTENT } from "@/lib/study/seeds/content/javascript";
import { TYPESCRIPT_CONTENT } from "@/lib/study/seeds/content/typescript";
import { NODEJS_CONTENT } from "@/lib/study/seeds/content/nodejs";
import { REACT_CONTENT } from "@/lib/study/seeds/content/react";
import { NEXTJS_CONTENT } from "@/lib/study/seeds/content/nextjs";
import { HTML_CONTENT } from "@/lib/study/seeds/content/html";
import { CSS_CONTENT } from "@/lib/study/seeds/content/css";
import { TAILWIND_CSS_CONTENT } from "@/lib/study/seeds/content/tailwindcss";
import { VITE_CONTENT } from "@/lib/study/seeds/content/vite";
import { VITEST_CONTENT } from "@/lib/study/seeds/content/vitest";
import { POSTGRESQL_CONTENT } from "@/lib/study/seeds/content/postgresql";
import { MYSQL_CONTENT } from "@/lib/study/seeds/content/mysql";
import { MARIADB_CONTENT } from "@/lib/study/seeds/content/mariadb";
import { SQLSERVER_CONTENT } from "@/lib/study/seeds/content/sqlserver";
import { SUPABASE_CONTENT } from "@/lib/study/seeds/content/supabase";

describe("editorial publication gate", () => {
  it("accepts the independently authored and reviewed books", () => {
    expect(checkEditorialSource(PYTHON_CONTENT)).toEqual([]);
    expect(checkEditorialSource(JAVASCRIPT_CONTENT)).toEqual([]);
    expect(checkEditorialSource(TYPESCRIPT_CONTENT)).toEqual([]);
    expect(checkEditorialSource(NODEJS_CONTENT)).toEqual([]);
    expect(checkEditorialSource(REACT_CONTENT)).toEqual([]);
    expect(checkEditorialSource(NEXTJS_CONTENT)).toEqual([]);
    expect(checkEditorialSource(HTML_CONTENT)).toEqual([]);
    expect(checkEditorialSource(CSS_CONTENT)).toEqual([]);
    expect(checkEditorialSource(TAILWIND_CSS_CONTENT)).toEqual([]);
    expect(checkEditorialSource(VITE_CONTENT)).toEqual([]);
    expect(checkEditorialSource(VITEST_CONTENT)).toEqual([]);
    expect(checkEditorialSource(POSTGRESQL_CONTENT)).toEqual([]);
    expect(checkEditorialSource(MYSQL_CONTENT)).toEqual([]);
    expect(checkEditorialSource(MARIADB_CONTENT)).toEqual([]);
    expect(checkEditorialSource(SQLSERVER_CONTENT)).toEqual([]);
    expect(checkEditorialSource(SUPABASE_CONTENT)).toEqual([]);
  }, 30_000);

  it("reports metrics that keep independently authored books below the similarity ceiling", () => {
    const python = editorialMetrics(PYTHON_CONTENT);
    const react = editorialMetrics(REACT_CONTENT);
    const nextjs = editorialMetrics(NEXTJS_CONTENT);
    const html = editorialMetrics(HTML_CONTENT);
    const css = editorialMetrics(CSS_CONTENT);
    const tailwind = editorialMetrics(TAILWIND_CSS_CONTENT);
    const vite = editorialMetrics(VITE_CONTENT);
    const vitest = editorialMetrics(VITEST_CONTENT);
    const postgresql = editorialMetrics(POSTGRESQL_CONTENT);
    const mysql = editorialMetrics(MYSQL_CONTENT);
    const mariadb = editorialMetrics(MARIADB_CONTENT);
    const sqlserver = editorialMetrics(SQLSERVER_CONTENT);
    const supabase = editorialMetrics(SUPABASE_CONTENT);
    expect(python.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(react.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(nextjs.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(html.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(css.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(tailwind.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(vite.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(vitest.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(postgresql.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(mysql.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(mariadb.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(sqlserver.maximumSectionSimilarity).toBeLessThan(0.42);
    expect(supabase.maximumSectionSimilarity).toBeLessThan(0.42);
  }, 30_000);

  it("rejects copied prose even when the copy stays inside one chapter", () => {
    const copied = structuredClone(PYTHON_CONTENT);
    const [first, second] = copied.chapters[0].sections;
    const sourceProse = first.blocks.find((block) => block.kind === "prose");
    const targetIndex = second.blocks.findIndex((block) => block.kind === "prose");
    if (!sourceProse || targetIndex < 0) throw new Error("Python fixture needs prose in its first two sections");
    second.blocks[targetIndex] = structuredClone(sourceProse);

    const metrics = editorialMetrics(copied);
    expect(metrics.highlySimilarSectionPairs).toBeGreaterThan(0);
    expect(checkEditorialSource(copied).map((violation) => violation.rule)).toContain("editorial.proseSimilarity");
  });
});
