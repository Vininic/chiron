import type { ContentCard, ContentExercise } from "./types";
import { RUBY_CURRICULUM } from "./rubyCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

const EVIDENCE = [
  "Registre Ruby engine, version, platform, Bundler lock, warnings e artifact hash; execute cada exemplo em processo limpo.",
  "Prove invariantes de construção, keyword contracts, visibilidade e igualdade com mutantes que publiquem estado inválido.",
  "Cubra collections, lazy ownership, encoding, Unicode, regex adversarial e schemas com limites explícitos.",
  "Injete exceções em cada etapa, preserve outcome e ownership de closures e limite toda metaprogramação por allowlist.",
  "Controle interleavings com barriers, filas limitadas e shutdown; processo Ruby não substitui o gate distribuído.",
  "Execute contratos compartilhados nos adapters, valide SQL binds, bytes fragmentados, timeout e idempotency key estável.",
  "Construa gem/pacote em checkout limpo, instale em consumidor vazio e confira lock, load path, assets e proveniência.",
  "Combine unit, property, mutation e fuzz com oráculos completos, preservando seeds, corpus e versão da engine.",
  "Use duas sessões reais, constraints e outbox; leia capacidade, registros, filas e efeito externo após concorrência.",
  "Teste allowlists, tenant scope, parser budgets, redaction, least privilege, overload e resposta a incidente.",
  "Exercite production graph, sinais, deploy gradual, rollback e restore mantendo tenant, key e eventId.",
  "Apresente matriz reproduzível de replay, última vaga, carga, kill points, reconciliação e efeito final único.",
] as const;

export const RUBY_EXERCISES: ContentExercise[] = RUBY_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No serviço Ruby do Quíron, construa uma experiência para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue fonte, fixture, estado inicial, comandos, saída, readback e cleanup. Se runtime, banco, TLS, provider ou storage não estiver disponível, mantenha o gate Pending em vez de atribuí-lo a um fake. Contexto: ${primer}`,
    answerKeyMd: `A resposta correta demonstra ${thesis}, localiza ${mechanism} e faz o mutante “${incident}” divergir em valor, ownership, bytes, estado, efeito, sigilo, desempenho ou recuperação. Evidência específica: ${EVIDENCE[chapterIndex]} O relatório identifica engine/version, gems, configuração, artifact/source hash e separa modelo local de integração real. Não aceite só ausência de exception ou status HTTP: faça readback e preserve tenant, idempotency key e eventId depois da falha.`,
  })),
);

export const RUBY_CARDS: ContentCard[] = RUBY_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato Ruby precisa sobreviver e que evidência reprova “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado no gate correspondente por valor, ownership, bytes, estado, efeito, sigilo ou recuperação, com engine, artefato e limitações declarados.`,
  })),
);
