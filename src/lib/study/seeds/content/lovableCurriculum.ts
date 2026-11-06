import type { ChapterLevel } from "@/lib/study/types";
export interface LovableChapter { title:string;level:ChapterLevel;sections:string[] }
export const LOVABLE_CURRICULUM: LovableChapter[] = [
  {
    "title": "Produto, projeto e primeiro contrato Lovable",
    "level": "basico",
    "sections": [
      "Brief com usuário, tarefa e resultado",
      "Projeto, workspace e versão observada",
      "Chat, Plan e Build como decisões distintas",
      "Preview e publicação com revisões separadas"
    ]
  },
  {
    "title": "Conhecimento e continuidade da construção",
    "level": "basico",
    "sections": [
      "Knowledge de workspace e contexto do projeto",
      "Skill pertinente e instrução sob demanda",
      "Prompt incremental e critérios de aceitação",
      "Contexto externo e autoridade da informação"
    ]
  },
  {
    "title": "Interface, design e acessibilidade",
    "level": "basico",
    "sections": [
      "Token de design e contraste verificável",
      "Seleção visual e componente compartilhado",
      "Layout responsivo e ordem de leitura",
      "Formulário acessível e erros por campo"
    ]
  },
  {
    "title": "Código gerado, rotas e estado",
    "level": "intermediario",
    "sections": [
      "Stack atual e código dependente do browser",
      "Rota protegida e retorno após login",
      "Estado de recurso e resposta atrasada",
      "Filtro, paginação e identidade da consulta"
    ]
  },
  {
    "title": "Cloud, modelagem e autorização dos dados",
    "level": "intermediario",
    "sections": [
      "Entidade de domínio e migração aditiva",
      "Identidade autenticada e isolamento de tenant",
      "RLS e operação autorizada por linha",
      "Paginação estável e minimização de resposta"
    ]
  },
  {
    "title": "Autenticação, arquivos e secrets",
    "level": "intermediario",
    "sections": [
      "Sessão expirada e ação de recuperação",
      "Bucket privado e referência de objeto",
      "Validação de upload e limite conhecido",
      "Secret de backend e variável pública"
    ]
  },
  {
    "title": "Edge Functions e integrações",
    "level": "intermediario",
    "sections": [
      "Entrada validada antes do efeito externo",
      "Connector de workspace e conta do usuário",
      "Assinatura de webhook e corpo original",
      "Idempotência e evento já processado"
    ]
  },
  {
    "title": "Testes, segurança e investigação",
    "level": "avancado",
    "sections": [
      "Frontend test e expectativa independente",
      "Browser testing e observação do fluxo",
      "Scan de segurança e cobertura declarada",
      "Logs úteis sem credencial nem conteúdo privado"
    ]
  },
  {
    "title": "Git, histórico e trabalho colaborativo",
    "level": "avancado",
    "sections": [
      "Sincronização e identidade da branch ativa",
      "Histórico de código e estado dos dados",
      "Draft, remix e dependências não copiadas",
      "Revisão com conflito e base preservada"
    ]
  },
  {
    "title": "Publicação, domínio e operação",
    "level": "avancado",
    "sections": [
      "Release com revisão e gates pertinentes",
      "Domínio customizado e estado DNS observado",
      "SEO, metadados e conteúdo entregue",
      "Uso, custo e limite por operação"
    ]
  },
  {
    "title": "Armadilhas de produto e recuperação",
    "level": "avancado",
    "sections": [
      "Protótipo visual e função realmente disponível",
      "Resultado desconhecido e retry controlado",
      "Migração de stack e biblioteca incompatível",
      "Rollback de versão e compatibilidade de schema"
    ]
  },
  {
    "title": "Projeto Quíron com Lovable e Lab Ágora",
    "level": "avancado",
    "sections": [
      "Reserva com intenção e identidade do ator",
      "Total monetário e quantidade inteira",
      "Conservação de estoque em atualização condicional",
      "Entrega completa e fronteira da evidência"
    ]
  }
];
