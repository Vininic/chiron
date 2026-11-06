import type { ChapterLevel } from "@/lib/study/types";
export interface ClaudeCodeChapter { title:string;level:ChapterLevel;sections:string[] }
export const CLAUDE_CODE_CURRICULUM: ClaudeCodeChapter[] = [
  {
    "title": "Sessão, ambiente e contrato de trabalho",
    "level": "basico",
    "sections": [
      "CLI, IDE e identidade do ambiente",
      "Raiz, shell e configuração inicial",
      "Pedido, critérios e ações observáveis",
      "Loop de ferramentas e responsabilidade humana"
    ]
  },
  {
    "title": "Exploração e aquisição de contexto",
    "level": "basico",
    "sections": [
      "Leitura orientada por símbolos e consumidores",
      "Busca, redução e referências de código",
      "Logs como dados e procedência da hipótese",
      "Contexto suficiente e evidência independente"
    ]
  },
  {
    "title": "CLAUDE.md, regras e memória",
    "level": "basico",
    "sections": [
      "Instruções do projeto e imports de memória",
      "Regras por caminho e aplicabilidade",
      "Memória automática e informação perecível",
      "Compactação e recuperação de decisões"
    ]
  },
  {
    "title": "Planejamento, edição e verificação",
    "level": "intermediario",
    "sections": [
      "Plano com precondições e dependências",
      "Patch mínimo e base de aplicação",
      "Interfaces, unidades e consumidores",
      "Regressões, typecheck e build da revisão final"
    ]
  },
  {
    "title": "Permissões e isolamento de execução",
    "level": "intermediario",
    "sections": [
      "Allow, ask e deny como decisões distintas",
      "Modo de permissão e efeito autorizado",
      "Sandbox de filesystem e rede",
      "Configuração gerenciada e limites locais"
    ]
  },
  {
    "title": "Ferramentas, terminal e MCP",
    "level": "intermediario",
    "sections": [
      "Bash, PowerShell e fronteiras de argumentos",
      "Entrada padrão, saída e status do processo",
      "MCP, identidade e menor capacidade",
      "Retornos de ferramentas e validação de domínio"
    ]
  },
  {
    "title": "Skills e procedimentos reutilizáveis",
    "level": "intermediario",
    "sections": [
      "SKILL.md, descrição e descoberta",
      "Invocação explícita e efeitos do procedimento",
      "Referências, scripts e caminhos relativos",
      "Versionamento e avaliação de uma skill"
    ]
  },
  {
    "title": "Hooks e controles determinísticos",
    "level": "avancado",
    "sections": [
      "Evento, matcher e condição de disparo",
      "JSON por stdin e saída de protocolo",
      "PreToolUse e controle antes do efeito",
      "PostToolUse, Stop e verificação de consequência"
    ]
  },
  {
    "title": "Subagentes e composição de resultados",
    "level": "avancado",
    "sections": [
      "Delegação com objetivo e contrato de retorno",
      "Contexto isolado e capacidade do subagente",
      "Ownership, worktrees e conflito de patches",
      "Integração e prova entre fronteiras"
    ]
  },
  {
    "title": "Automação, sessões e recuperação",
    "level": "avancado",
    "sections": [
      "Print mode e saída estruturada",
      "JSONL, streaming e conclusão terminal",
      "Retomada de sessão e checkpoint",
      "Limites de execução e replay de efeitos"
    ]
  },
  {
    "title": "Armadilhas de segurança e avaliação",
    "level": "avancado",
    "sections": [
      "Prompt injection e autoridade dos dados",
      "Privacidade, retenção e transmissão mínima",
      "Avaliação de respostas e cobertura de casos",
      "Custos, latência e diagnóstico de falhas"
    ]
  },
  {
    "title": "Projeto Quíron com Claude Code",
    "level": "avancado",
    "sections": [
      "Especificação da reserva e estratégia de prova",
      "Chave de replay e payload conflitante",
      "Concorrência real e limites do modelo serial",
      "Handoff verificável e fechamento do escopo"
    ]
  }
];
