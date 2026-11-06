// Every example runs on a real Vite 8 (scripts/vite8, isolated from the app's
// Vite 5): one project per section — dev server and production build — and,
// in the integrator chapter, one project growing across sections; see
// scripts/run-vite-snippets.mjs.
import { defineBookGates, snippetsBySection } from "./bookGates";
import { VITE_CONTENT } from "./vite";

defineBookGates(VITE_CONTENT, { runner: "scripts/run-vite-snippets.mjs", snippetsOf: snippetsBySection });
