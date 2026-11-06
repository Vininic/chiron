import type { ChapterLevel } from "@/lib/study/types";
export interface GitHubCopilotChapter { title:string;level:ChapterLevel;sections:string[] }
export const GITHUB_COPILOT_CURRICULUM: GitHubCopilotChapter[] = [
  {
    "title": "Superfícies, sessão e resultado esperado",
    "level": "basico",
    "sections": [
      "Sugestão, Chat e agente como operações diferentes",
      "Conta, extensão e matriz de suporte",
      "Workspace e revisão da evidência",
      "Pedido com comportamento e restrições"
    ]
  },
  {
    "title": "Completar código com revisão humana",
    "level": "basico",
    "sections": [
      "Cursor, prefixo e sufixo da sugestão",
      "Aceitação parcial e contexto de edição",
      "Next edit suggestions e consumidores",
      "Referências de código público e procedência"
    ]
  },
  {
    "title": "Chat, contexto e investigação",
    "level": "basico",
    "sections": [
      "Perguntas com casos e unidades explícitas",
      "Seleção de arquivos e orçamento de contexto",
      "Explicação confrontada com fluxo de chamadas",
      "Histórico relevante e hipótese revogada"
    ]
  },
  {
    "title": "Instruções, prompts e skills",
    "level": "intermediario",
    "sections": [
      "copilot-instructions.md e contrato do repositório",
      "applyTo e suporte por superfície",
      "Prompt reutilizável e parâmetros da tarefa",
      "Skill, recursos e avaliação de procedimento"
    ]
  },
  {
    "title": "Planejar e editar no IDE",
    "level": "intermediario",
    "sections": [
      "Plano com dependências e critérios de término",
      "Mudança entre arquivos e base do patch",
      "Ferramenta, shell e efeito autorizado",
      "Recuperação de edição e trabalho alheio"
    ]
  },
  {
    "title": "Testes e refatoração assistidos",
    "level": "intermediario",
    "sections": [
      "Teste independente da resposta gerada",
      "Casos de fronteira e propriedade de domínio",
      "Refatoração que preserva consumidores",
      "Seleção de gates e revisão final"
    ]
  },
  {
    "title": "MCP e capacidades externas",
    "level": "intermediario",
    "sections": [
      "Servidor MCP e identidade da ferramenta",
      "Capacidade mínima e autorização de operação",
      "Retorno remoto como dado não confiável",
      "Idempotência e resultado remoto incerto"
    ]
  },
  {
    "title": "Agente cloud e trabalho em branch",
    "level": "avancado",
    "sections": [
      "Tarefa delegada e repositório escolhido",
      "Ambiente efêmero e setup reprodutível",
      "Branch, logs e pull request revisável",
      "Firewall e dependências do ambiente"
    ]
  },
  {
    "title": "Code review e decisão de integração",
    "level": "avancado",
    "sections": [
      "Comentário localizado e defeito reproduzível",
      "Revisão da base e instruções pertinentes",
      "Cobertura de diff e arquivos excluídos",
      "Checks, aprovação e autoridade de merge"
    ]
  },
  {
    "title": "CLI, agentes personalizados e automação",
    "level": "avancado",
    "sections": [
      "CLI e limites da invocação no terminal",
      "Agente personalizado e conjunto de ferramentas",
      "Hooks e contrato de evento observado",
      "Automação, timeout e replay controlado"
    ]
  },
  {
    "title": "Armadilhas, governança e avaliação",
    "level": "avancado",
    "sections": [
      "Exclusão de conteúdo e limites por modo",
      "Segredos e contexto mínimo necessário",
      "Prompt injection e origem da autoridade",
      "Métricas de qualidade e custo observado"
    ]
  },
  {
    "title": "Projeto Quíron com GitHub Copilot",
    "level": "avancado",
    "sections": [
      "Reserva por tenant e contrato do endpoint",
      "Replay com payload canônico declarado",
      "Interleaving e prova de estoque",
      "Handoff, limites e ensaio do Lab Ágora"
    ]
  }
];
