import type { ChapterLevel } from "@/lib/study/types";
export interface LlmChapter {title:string;level:ChapterLevel;sections:string[]}
export const LLM_CURRICULUM: LlmChapter[] = [
  {
    "title": "Problema, modelo e contrato",
    "level": "basico",
    "sections": [
      "Tarefas e critérios de sucesso",
      "Geração probabilística e incerteza",
      "Modelo, provedor e capacidades",
      "Tokens, contexto e orçamento"
    ]
  },
  {
    "title": "Prompt e entrada estruturada",
    "level": "basico",
    "sections": [
      "Instruções, dados e confiança",
      "Contexto relevante e delimitação",
      "Exemplos e versões de prompt",
      "Saída estruturada e validação"
    ]
  },
  {
    "title": "Transporte e ciclo da resposta",
    "level": "basico",
    "sections": [
      "Pedidos, identidade e configuração",
      "Streaming e enquadramento",
      "Erros, timeout e cancelamento",
      "Retry, rate limits e orçamento"
    ]
  },
  {
    "title": "Dados e recuperação",
    "level": "intermediario",
    "sections": [
      "Documentos, chunks e procedência",
      "Embeddings e similaridade",
      "Ranking, filtros e isolamento",
      "RAG, citações e abstenção"
    ]
  },
  {
    "title": "Estado e memória",
    "level": "intermediario",
    "sections": [
      "Histórico e projeção de conversa",
      "Resumo, perda e continuidade",
      "Memória, consentimento e retenção",
      "Cache, validade e invalidação"
    ]
  },
  {
    "title": "Ferramentas e efeitos",
    "level": "intermediario",
    "sections": [
      "Tool calling e dispatch",
      "Schema, domínio e autorização",
      "Plano, aprovação e pré-condições",
      "Idempotência e resultado desconhecido"
    ]
  },
  {
    "title": "Workflows e agentes",
    "level": "avancado",
    "sections": [
      "Estados, transições e término",
      "Delegação, escopo e isolamento",
      "Humano no fluxo e retomada",
      "Limites, loops e compensação"
    ]
  },
  {
    "title": "Multimodal e documentos",
    "level": "avancado",
    "sections": [
      "Texto, imagem e representação",
      "Áudio, transcrição e tempo",
      "Arquivos, extração e qualidade",
      "Conteúdo gerado e revisão"
    ]
  },
  {
    "title": "Segurança e privacidade",
    "level": "avancado",
    "sections": [
      "Prompt injection e fronteiras",
      "Privilégio mínimo e recursos",
      "Segredos, dados pessoais e logs",
      "Conteúdo inseguro e triagem"
    ]
  },
  {
    "title": "Avaliação e confiabilidade",
    "level": "avancado",
    "sections": [
      "Dataset, amostragem e splits",
      "Oracles, rubricas e mutantes",
      "Métricas, fatias e incerteza",
      "Mudança de modelo e regressão"
    ]
  },
  {
    "title": "Operação e observabilidade",
    "level": "avancado",
    "sections": [
      "Custo, latência e limites",
      "Traces, correlação e diagnósticos",
      "Disponibilidade e fallback",
      "Release, rollback e monitoramento"
    ]
  },
  {
    "title": "Projeto Quíron: armadilhas e banca",
    "level": "avancado",
    "sections": [
      "Tutor, fatos e responsabilidade",
      "Reserva, ferramentas e autoridade",
      "Aceitação e evidência de integração",
      "Banca, incidentes e manutenção"
    ]
  }
];
