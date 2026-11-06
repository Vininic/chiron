export interface ContentBatch {
  id: string;
  title: string;
  rationale: string;
  sources: readonly string[];
  status: "complete" | "in_progress" | "planned";
}

/** Ordered by shared vocabulary and equal authoring effort, not by logo category. */
export const CONTENT_BATCHES: readonly ContentBatch[] = [
  { id: "reference-python", title: "Referência", rationale: "Prova completa do contrato de currículo.", sources: ["Python"], status: "complete" },
  { id: "web-core", title: "Núcleo web", rationale: "Uma escada única: linguagem → tipos → runtime → UI → full stack.", sources: ["JavaScript", "TypeScript", "Node.js", "React", "Next.js"], status: "complete" },
  { id: "web-craft", title: "Interface e ferramentas web", rationale: "Markup, estilo e testes compartilham o mesmo ciclo de entrega visual.", sources: ["HTML", "CSS", "Tailwind CSS", "Vite", "Vitest"], status: "complete" },
  { id: "data-platform", title: "Dados e plataforma", rationale: "Modelagem relacional, autenticação e operação de dados.", sources: ["PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server", "Supabase"], status: "complete" },
  { id: "backend-runtimes", title: "Backends tipados", rationale: "Linguagens compiladas e seus frameworks de serviço.", sources: ["Java", "Spring Boot", "C#", "C", "C++"], status: "in_progress" },
  { id: "web-backends", title: "Backends produtivos", rationale: "Frameworks e linguagens de servidor com ORM, rotas e deploy.", sources: ["Ruby", "Ruby on Rails", "PHP", "Flask", "Vue.js"], status: "planned" },
  { id: "delivery", title: "Entrega de software", rationale: "Versionamento, containers, APIs e publicação trabalham no mesmo fluxo.", sources: ["Git / GitHub", "Docker", "Swagger", "Postman", "Vercel"], status: "complete" },
  { id: "operations-product", title: "Operação e produto", rationale: "Infraestrutura, automação e design de produto com contexto operacional.", sources: ["Oracle Cloud", "Ubuntu / Linux", "N8N", "Figma", "Pacote Office"], status: "complete" },
  { id: "ai-workflow", title: "Ferramentas de IA", rationale: "Ferramentas assistivas compartilham guardrails, contexto e revisão humana.", sources: ["Integração de IA (LLM)", "Cursor", "Claude Code", "GitHub Copilot", "OpenCode"], status: "complete" },
  { id: "ai-product", title: "Criação assistida", rationale: "Ferramentas de prototipação e laboratório que fecham o catálogo.", sources: ["Lovable", "Google AI Studio", "jQuery", "Chiron", "Olympus"], status: "complete" },
];

export function batchForSource(name: string): ContentBatch | undefined { return CONTENT_BATCHES.find((batch) => batch.sources.includes(name)); }
