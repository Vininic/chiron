// Every example runs in headless Edge with the real jQuery 4.0.0 (and
// jquery-migrate 4.0.2) from scripts/jquery4: one page project per section,
// served over HTTP (by the book's own servidor.mjs when it shows one) and, in
// the integrator chapter, one project growing across sections. Console blocks
// are evaluated in the page; "Saída" blocks must appear in the captured
// console. See scripts/run-jquery-snippets.mjs.
import { defineBookGates, snippetsBySection } from "./bookGates";
import { JQUERY_CONTENT } from "./jquery";

defineBookGates(JQUERY_CONTENT, { runner: "scripts/run-jquery-snippets.mjs", snippetsOf: snippetsBySection });
