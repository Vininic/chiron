import type { ContentCard, ContentExercise } from "./types";
import { GIT_GITHUB_CURRICULUM } from "./gitGithubCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Inspecione objects, refs, HEAD, index, config e attributes no Git real; compare object IDs, trees, stages e origem da configuração.",
  "Materialize exatamente o index, percorra ranges/reflog e preserve trabalho em stash/worktree; cada commit deve passar isoladamente.",
  "Construa grafo divergente, teste merge/rebase/lease/conflitos e faça o mutante divergir por ancestry, tree ou teste integrado.",
  "Use remotes bare concorrentes para provar fetch/refspec/prune, push CAS, tags imutáveis e clones completos/rasos sem credenciais reais.",
  "Modele repo/fork/issues/PR/review e valide a CLI gh; deixe permissions, rulesets e API Pending sem sandbox autorizado.",
  "Audite evento, permissions, runner, matriz, cache, OIDC, environment, check, artifact e provenance no SHA correto.",
  "Derive notes pelo range, produza artifact/checksum/package imutável e faça automação paginada/idempotente reconciliar timeout.",
  "Detecte e revogue segredo sintético, verifique assinaturas SSH reais e modele rules/tokens/SARIF sem tratar scanner como certificado.",
  "Exercite repack/commit-graph/fsck, sparse/monorepo, submodule/vendor e pointer/tamanho LFS preservando o grafo lógico.",
  "Encontre regressão, recupere objetos, restaure bundle/mirror e produza cadeia de custódia antes de qualquer limpeza destrutiva.",
  "Compare estratégia de branches, definição de pronto, merge queue/bots e métricas com SHAs, idempotência e anti-gaming.",
  "Apresente o Quíron completo: clone limpo, PR da última vaga, release por digest e incidente/restore com gates locais e externos separados.",
] as const;

export const GIT_GITHUB_EXERCISES: ContentExercise[] = GIT_GITHUB_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No repositório Quíron, construa um cenário para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue repositório/fixture descartável, comandos, refs e SHAs completos, output, estado antes/depois, cleanup e fronteiras Pending. Nunca use o workspace real como alvo de reset, clean, force ou rewrite. Contexto: ${primer}`,
    answerKeyMd: `A resposta demonstra ${thesis}, localiza ${mechanism} e faz “${incident}” divergir por ref, ancestry, tree, index, status, permission, check, digest, efeito ou recuperação. Evidência específica: ${EVIDENCE[chapterIndex]} Identifique Git/gh/runner/provider e versões, base/head/merge-group, artifact digest e diferença entre Git local, GitHub sandbox, banco/provider e produção. Não aceite interface verde, parser, mock, hash ou assinatura isolada como prova mais ampla.`,
  })),
);

export const GIT_GITHUB_CARDS: ContentCard[] = GIT_GITHUB_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato Git/GitHub precisa sobreviver e que evidência reprova “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado pelo gate correspondente em ref, ancestry, tree, index, permission, check, digest, efeito ou recovery, registrando Git/gh, SHAs, artifact e limites do executor.`,
  })),
);
