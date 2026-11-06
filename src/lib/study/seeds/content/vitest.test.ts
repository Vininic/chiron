// Every example runs on a real Vitest 5 (scripts/vitest5, with Vite 8,
// isolated from the app's Vitest 3): one project per section and, in the
// integrator chapter, one project growing across sections; files marked
// "(falha de propósito)" must fail. See scripts/run-vitest-snippets.mjs.
import { defineBookGates, snippetsBySection } from "./bookGates";
import { VITEST_CONTENT } from "./vitest";

defineBookGates(VITEST_CONTENT, { runner: "scripts/run-vitest-snippets.mjs", snippetsOf: snippetsBySection });
