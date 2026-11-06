// Every example runs in the installed Microsoft Office (Excel, Word and
// PowerPoint, driven through COM, pt-BR): each section is a small recipe whose
// result block must match what the program shows; in the integrator chapter one
// workbook, one document and one presentation grow across sections. See
// scripts/run-office-snippets.mjs and scripts/office/driver.ps1.
import { defineBookGates, snippetsBySection } from "./bookGates";
import { OFFICE_CONTENT } from "./office";

defineBookGates(OFFICE_CONTENT, { runner: "scripts/run-office-snippets.mjs", snippetsOf: snippetsBySection });
