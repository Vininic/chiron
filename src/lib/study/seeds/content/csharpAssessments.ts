import type { ContentCard, ContentExercise } from "./types";
import { CSHARP_CURRICULUM } from "./csharpCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

const CHAPTER_EVIDENCE = [
  "Registre SDK, TFM, LangVersion e saída de build/run/publish em diretório distinto do source; não confunda SDK instalado com runtime do destino.",
  "Inclua entradas null/missing/vazio, enum desconhecido e cópia/mutação de valor; compare modelo antes/depois sem usar null-forgiving como correção.",
  "Monte provider DI com ValidateScopes, duas identidades de request e fake de adapter; confirme descarte/lifetime e transição de domínio.",
  "Use dados de dois tenants, query reenumerada e grão de join; meça cardinalidade, SQL/materialização e bytes de buffer pelo count real.",
  "Injete exception, cancelamento e payload hostil no arquivo/JSON; verifique stack/cause, dispose, path final e ausência de sentinel em log.",
  "Controle interleaving com TaskCompletionSource/barreira, cancele antes/depois de efeito e prove limite de fila/slots sem prometer exclusão entre réplicas.",
  "Suba host ASP.NET Core com request real, DTO adversarial, middleware e transporte fake; inspecione status, Location, headers e nenhuma escrita após rejeição.",
  "Execute SQL/EF contra banco relacional descartável, verifique rows affected, constraints, rollback e generated SQL; marque locks de produção como gate separado.",
  "Teste principals A/B, cookie sem antiforgery, origin hostil e sink de telemetria com sentinel; diferencie 401, 403 e ausência de recurso.",
  "Compare build com publish executado, live/ready sob dependência caída, StopAsync com job em voo e digest do artefato; não alegue AOT sem binário AOT.",
  "Compile consumidor da interface pública, inspecione versões/metadata e rode contrato de ownership/SafeHandle; se usar P/Invoke, diga arquitetura testada.",
  "Use matriz de última vaga, replay, tenant cruzado, timeout pós-efeito, lease vencido e restore de key+outbox; cada mutante precisa falhar por estado durável.",
] as const;

export const CSHARP_EXERCISES: ContentExercise[] = CSHARP_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No serviço de reservas Quíron, construa uma experiência para “${title}” que teste a afirmação: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${CHAPTER_EVIDENCE[chapterIndex]} Entregue código/fixture executáveis, estado inicial, ação, resultado esperado, saída real e cleanup; se o cenário depender de banco alvo, proxy, provedor ou publish não disponível, descreva o gate externo em vez de afirmar que o fake o provou. Contexto do capítulo: ${primer}`,
    answerKeyMd: `Uma resposta correta deve demonstrar ${thesis}, localizar o mecanismo ${mechanism} no código e fazer o mutante “${incident}” falhar em resposta, estado persistido, exclusividade, sigilo ou recuperação. Evidência específica: ${CHAPTER_EVIDENCE[chapterIndex]} Compare baseline e mutante sob a mesma fixture, registre versão .NET/TFM e limite do executor; não troque uma key após timeout remoto nem aceite tenant do body. O oráculo precisa apontar a linha/efeito divergente, não apenas a ausência de exception.`,
  })),
);

export const CSHARP_CARDS: ContentCard[] = CSHARP_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, que condição a implementação deve preservar e qual observação reprovaria o incidente ${incident}?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o contraexemplo “${incident}” só é refutado quando resposta, estado/bytes/efeito e limite do teste são observáveis.`,
  })),
);
