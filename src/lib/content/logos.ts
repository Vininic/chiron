/** Skill/tech → brand identity, for the dashboard's stack/repo cards
 *  ("importante pros cards na dashboard" — 2026-07-29). Data only: which SVG
 *  actually gets drawn from a slug (the `simple-icons` package, or hand-drawn
 *  monochrome marks) is a rendering decision that belongs to the F4 dashboard
 *  work, not to this model-layer table. `slug` is kept in the `simple-icons`
 *  naming convention on purpose, so whichever renderer F4 picks can resolve
 *  it without a second lookup table.
 *
 *  The name list mirrors `glowportfolio/src/data/portfolio-data.json`'s
 *  `skills[]` (41 entries, 2026-07-29) — Chiron doesn't invent its own stack
 *  list, it mirrors the portfolio's (see PLANO.md §3.4-A). When a skill is
 *  added there, add it here too; a name with no entry falls back to a solid
 *  initial badge rather than failing to render. */

export interface TechIdentity {
  slug: string;
  /** Official brand colour, hex. Used for the badge/chip wash via lib/color.ts's `alpha()`. */
  color: string;
}

export const TECH_IDENTITY: Record<string, TechIdentity> = {
  // frontend
  React: { slug: "react", color: "#61DAFB" },
  JavaScript: { slug: "javascript", color: "#F7DF1E" },
  HTML: { slug: "html5", color: "#E34F26" },
  CSS: { slug: "css3", color: "#1572B6" },
  "Next.js": { slug: "nextdotjs", color: "#000000" },
  TypeScript: { slug: "typescript", color: "#3178C6" },
  "Vue.js": { slug: "vuedotjs", color: "#4FC08D" },
  jQuery: { slug: "jquery", color: "#0769AD" },

  // backend
  Python: { slug: "python", color: "#3776AB" },
  "Node.js": { slug: "nodedotjs", color: "#339933" },
  PostgreSQL: { slug: "postgresql", color: "#4169E1" },
  "Ruby on Rails": { slug: "rubyonrails", color: "#CC0000" },
  Flask: { slug: "flask", color: "#000000" },
  MySQL: { slug: "mysql", color: "#4479A1" },
  MariaDB: { slug: "mariadb", color: "#003545" },
  PHP: { slug: "php", color: "#777BB4" },
  Java: { slug: "openjdk", color: "#437291" },
  "Spring Boot": { slug: "springboot", color: "#6DB33F" },
  C: { slug: "c", color: "#A8B9CC" },
  Ruby: { slug: "ruby", color: "#CC342D" },
  "Microsoft SQL Server": { slug: "microsoftsqlserver", color: "#CC2927" },
  "C#": { slug: "csharp", color: "#68217A" },
  "C++": { slug: "cplusplus", color: "#00599C" },

  // ai
  OpenCode: { slug: "opencode", color: "#000000" },
  "GitHub Copilot": { slug: "githubcopilot", color: "#000000" },
  "Claude Code": { slug: "claude", color: "#D97757" },
  Cursor: { slug: "cursor", color: "#000000" },
  Lovable: { slug: "lovable", color: "#000000" },
  "Google AI Studio": { slug: "googlegemini", color: "#8E75B2" },

  // tools
  Docker: { slug: "docker", color: "#2496ED" },
  "Oracle Cloud": { slug: "oracle", color: "#F80000" },
  Swagger: { slug: "swagger", color: "#85EA2D" },
  "Pacote Office (Excel, Word, PowerPoint)": { slug: "microsoftoffice", color: "#D83B01" },
  Git: { slug: "git", color: "#F05032" },
  GitHub: { slug: "github", color: "#181717" },
  N8N: { slug: "n8n", color: "#EA4B71" },
  Figma: { slug: "figma", color: "#F24E1E" },
  Ubuntu: { slug: "ubuntu", color: "#E95420" },
  Vercel: { slug: "vercel", color: "#000000" },
  Postman: { slug: "postman", color: "#FF6C37" },
  Supabase: { slug: "supabase", color: "#3ECF8E" },
};

/** Fallback for any name not in the table above: a solid badge with the
 *  skill's initial, tinted with the app's own rubric accent rather than a
 *  brand colour that doesn't exist for it. Never throws on an unknown name —
 *  a missing logo is a visual gap, not a broken page. */
export function techIdentity(name: string): TechIdentity {
  return TECH_IDENTITY[name] ?? { slug: "", color: "#D64545" };
}

export function techInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
