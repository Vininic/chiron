// Every class of every example runs through the real Tailwind 4 engine (v3
// "before" examples of the migration chapter through Tailwind 3), plugins
// included; see scripts/run-tailwind-snippets.cjs.
import { defineBookGates, snippetsWithSectionCss } from "./bookGates";
import { TAILWIND_CSS_CONTENT } from "./tailwindcss";

defineBookGates(TAILWIND_CSS_CONTENT, { runner: "scripts/run-tailwind-snippets.cjs", snippetsOf: snippetsWithSectionCss });
