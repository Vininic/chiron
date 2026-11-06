import type { ChapterLevel } from "@/lib/study/types";
export interface CursorChapter { title:string;level:ChapterLevel;sections:string[] }
export const CURSOR_CURRICULUM: CursorChapter[] = [
  {
    "title": "Ambiente, tarefa e responsabilidade",
    "level": "basico",
    "sections": [
      "Workspace e inventário inicial",
      "Pedido observável e limites de mudança",
      "Assistência inline e edição delimitada",
      "Plano, agente e evidência de execução"
    ]
  },
  {
    "title": "Contexto e navegação do código",
    "level": "basico",
    "sections": [
      "Referências explícitas e contexto mínimo",
      "Busca lexical e recuperação semântica",
      "Indexação, validade e arquivos omitidos",
      "Orçamento de contexto e continuidade"
    ]
  },
  {
    "title": "Instruções persistentes e documentação",
    "level": "basico",
    "sections": [
      "Regras de projeto e frontmatter MDC",
      "Escopo de regras e conflitos de orientação",
      "AGENTS.md e instruções próximas do código",
      "Documentação externa e procedência"
    ]
  },
  {
    "title": "Especificação e alteração controlada",
    "level": "intermediario",
    "sections": [
      "Critérios de aceitação antes do patch",
      "Diferença textual e revisão de intenção",
      "Edição em vários arquivos e consumidores",
      "Refatoração com invariantes observáveis"
    ]
  },
  {
    "title": "Terminal e fronteiras de confiança",
    "level": "intermediario",
    "sections": [
      "Comandos, diretório e argumentos",
      "Aprovação de efeitos e escopo autorizado",
      "Sandbox, rede e caminhos protegidos",
      "Ignore, segredos e conteúdo não confiável"
    ]
  },
  {
    "title": "Testes e diagnóstico orientado a evidência",
    "level": "intermediario",
    "sections": [
      "Regressão mínima que reproduz o defeito",
      "Oracles, mutantes e testes que contradizem",
      "Typecheck, build e execução separadas",
      "Falhas, logs e redução do problema"
    ]
  },
  {
    "title": "Git, checkpoints e colaboração",
    "level": "intermediario",
    "sections": [
      "Alterações preexistentes e autoria",
      "Checkpoint e histórico versionado",
      "Branches, worktrees e base de revisão",
      "Pull request, revisão humana e entrega"
    ]
  },
  {
    "title": "Ferramentas externas e extensibilidade",
    "level": "avancado",
    "sections": [
      "MCP, ferramentas e capacidade concedida",
      "Schemas, argumentos e validação de retorno",
      "Hooks e observação de eventos",
      "CLI, execução automatizada e contratos"
    ]
  },
  {
    "title": "Agentes remotos e trabalho prolongado",
    "level": "avancado",
    "sections": [
      "Ambiente remoto e reprodução local",
      "Concorrência, divisão e conflitos de integração",
      "Cancelamento, retomada e efeitos repetidos",
      "Artefatos, evidência e gate de publicação"
    ]
  },
  {
    "title": "Privacidade, qualidade e custos",
    "level": "avancado",
    "sections": [
      "Fluxo de dados e classificação do contexto",
      "Configuração, políticas e governança",
      "Modelos, avaliação e incerteza",
      "Orçamento, latência e limite de tentativas"
    ]
  },
  {
    "title": "Armadilhas de operação e acessibilidade",
    "level": "avancado",
    "sections": [
      "Observabilidade de ações e resultados",
      "Dependências, ambiente e supply chain",
      "Acessibilidade e revisão da interface",
      "Incidente, reversão e passagem de contexto"
    ]
  },
  {
    "title": "Projeto Quíron com Cursor",
    "level": "avancado",
    "sections": [
      "Contrato da última vaga e plano de edição",
      "Reserva, idempotência e autorização",
      "Integração, revisão e evidências do laboratório",
      "Handoff, limites nativos e fechamento"
    ]
  }
];
