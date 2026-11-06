import type { ChapterLevel } from "@/lib/study/types";
export interface N8nChapter { title: string; level: ChapterLevel; sections: string[] }
export const N8N_CURRICULUM: N8nChapter[] = [
 {title:"Modelo de automação e workflow",level:"basico",sections:["Nós, conexões e execução", "Editor, testes e publicação", "Items, JSON e binary", "Expressões e contexto"]},
 {title:"Transformação e fluxo de dados",level:"basico",sections:["Edit Fields e contratos", "Code node e modos", "Item linking e pairedItem", "IF, Switch e Merge"]},
 {title:"Triggers e entrada confiável",level:"basico",sections:["Manual, Schedule e timezone", "Webhook de teste e produção", "Validação, autenticação e assinatura", "Resposta HTTP e idempotência"]},
 {title:"HTTP e integrações externas",level:"intermediario",sections:["HTTP Request e credenciais", "Paginação e limites de API", "Retries, timeout e backoff", "Arquivos, binary e streaming"]},
 {title:"Persistência e consistência",level:"intermediario",sections:["Banco, queries e parâmetros", "Transações e reserva concorrente", "Outbox e deduplicação", "Data tables, cache e estado"]},
 {title:"Loops, composição e resiliência",level:"intermediario",sections:["Loop Over Items e batches", "Sub-workflows e contratos", "Wait e retomada", "Error workflows e quarentena"]},
 {title:"Testes e evidência",level:"avancado",sections:["Fixtures, pinning e dados reais", "Assertions, contratos e mutantes", "HTTP sandbox e efeitos", "Regressão e pacote de evidência"]},
 {title:"Segurança e governança",level:"avancado",sections:["Projects, RBAC e sharing", "Secrets, encryption key e rotação", "Nodes, runners e supply chain", "PII, SSRF e auditoria"]},
 {title:"Operação e escala",level:"avancado",sections:["Cloud e self-hosted", "Queue mode e workers", "Concorrência, quotas e backpressure", "Execuções, logs e SLO"]},
 {title:"Entrega e recuperação",level:"avancado",sections:["Export, import e versionamento", "Source control e environments", "Publish, canary e rollback", "Backup, restore e upgrades"]},
 {title:"IA em workflows",level:"avancado",sections:["Modelos, prompts e saída estruturada", "Tools, agents e aprovação", "RAG, memória e isolamento", "Evals, custo e fallback"]},
 {title:"Projeto Quíron com n8n",level:"avancado",sections:["Contrato do workflow integrador", "Última vaga, replay e eventos", "Release e operação observável", "Banca de incidente e restore"]},
];
