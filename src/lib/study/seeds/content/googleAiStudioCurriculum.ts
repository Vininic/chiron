import type { ChapterLevel } from "@/lib/study/types";
export interface GoogleAiStudioChapter { title:string;level:ChapterLevel;sections:string[] }
export const GOOGLE_AI_STUDIO_CURRICULUM: GoogleAiStudioChapter[] = [
  {
    "title": "Google AI Studio e contrato do experimento",
    "level": "basico",
    "sections": [
      "Playground, Build e produto da experiência",
      "Projeto, chave e identidade da execução",
      "Critério de resposta e conjunto de casos",
      "Exportação Get code e configuração preservada"
    ]
  },
  {
    "title": "Instruções, exemplos e conversa",
    "level": "basico",
    "sections": [
      "System instruction e dado do usuário",
      "Few-shot e rótulo fora do exemplo",
      "Histórico com ordem e papéis conservados",
      "Parâmetros do ensaio e comparação justa"
    ]
  },
  {
    "title": "Modelos, tokens e orçamento",
    "level": "basico",
    "sections": [
      "Capacidade do modelo e tarefa elegível",
      "Reserva de saída e janela de contexto",
      "Contagem de tokens e estimativa de texto",
      "Cache de contexto e validade da base"
    ]
  },
  {
    "title": "Saída estruturada e contrato de domínio",
    "level": "intermediario",
    "sections": [
      "JSON válido e semântica ainda inválida",
      "Enum, campo ausente e valor desconhecido",
      "Relação entre item, quantidade e fonte",
      "Fragmento de saída e documento completo"
    ]
  },
  {
    "title": "Entradas multimodais e arquivos",
    "level": "intermediario",
    "sections": [
      "MIME, bytes e representação base64",
      "Arquivo pronto e referência ainda processando",
      "Trecho de áudio e unidade temporal",
      "Quadros de vídeo e cobertura do intervalo"
    ]
  },
  {
    "title": "Function calling e execução de ferramentas",
    "level": "intermediario",
    "sections": [
      "Declaração de função e argumento validado",
      "Identidade de chamada e retorno correspondente",
      "Chamadas paralelas e efeitos dependentes",
      "Assinaturas opacas e continuidade do turno"
    ]
  },
  {
    "title": "Grounding, busca e execução de código",
    "level": "intermediario",
    "sections": [
      "Fonte citada e suporte da afirmação",
      "URL Context e endereço permitido",
      "File Search e identidade do documento",
      "Code execution e efeito fora do cálculo"
    ]
  },
  {
    "title": "Safety, privacidade e confiança",
    "level": "avancado",
    "sections": [
      "Bloqueio de prompt e ausência de candidato",
      "Finish reason e resposta não concluída",
      "Dados mínimos e projeção do log",
      "Prompt injection e autorização do ator"
    ]
  },
  {
    "title": "SDK, transporte e experiência em tempo real",
    "level": "avancado",
    "sections": [
      "API e versão do envelope observado",
      "Stream por partes e UTF-8 dividido",
      "Rate limit e janela de retry",
      "Live API e sessão com geração distinta"
    ]
  },
  {
    "title": "Build, backend e entrega da aplicação",
    "level": "avancado",
    "sections": [
      "Runtime server e segredo fora do client",
      "Firebase e recurso ligado à identidade",
      "GitHub, ZIP e base realmente sincronizada",
      "Publicação Cloud Run e estado do destino"
    ]
  },
  {
    "title": "Avaliação, armadilhas e recuperação",
    "level": "avancado",
    "sections": [
      "Dataset e divisão sem vazamento",
      "Métrica por grupo e erro escondido na média",
      "Resultado unknown e reconciliação de efeito",
      "Mudança de modelo e regressão do contrato"
    ]
  },
  {
    "title": "Projeto Quíron com Google AI Studio",
    "level": "avancado",
    "sections": [
      "Proposta de reserva e decisão autorizada",
      "Intenção repetida com conteúdo divergente",
      "Quantidade confirmada e estoque preservado",
      "Handoff de evidência e Lab Ágora"
    ]
  }
];
