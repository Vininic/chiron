import type { ContentCard, ContentExercise } from "./types";
import { DOCKER_CURRICULUM } from "./dockerCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;
const EVIDENCE = [
  "Registre engine, runtime, kernel, context, image/index digests e inspect; contraste processo, namespace, layer e lifecycle sem chamar container de VM.",
  "Construa no BuildKit real com contexto inventariado, cache controlado e secret mount; inspecione layers, config, history e artifacts do runtime mínimo.",
  "Resolva index e manifests por plataforma, verifique base, SBOM, provenance, assinatura, registry identity e promoção do mesmo digest.",
  "Demonstre argv/PID 1, configuração e segredo separados, non-root/caps/rootfs e health/sinais; inclua uma negação operacional observável.",
  "Recrie containers e restaure dados em destino novo; evidencie mounts, UID/GID, consistência, migration, checksums, RPO e RTO.",
  "Exercite redes e clientes reais: DNS/recreate, reachability positiva e negativa, TLS/headers e falha ambígua com deadline/idempotência.",
  "Renderize o Compose final em JSON, use projects paralelos e prove dependências, health, interpolation, secrets, profiles e cleanup isolado.",
  "Execute dependências por digest com portas dinâmicas, readiness e cleanup; preserve logs/inspect/events e meça recursos sob carga e falha.",
  "Ataque contexto, cache, daemon boundary e runtime; verifique rootless/sandbox/policy, scanning, patch e resposta a segredo sem confundir scan com garantia.",
  "Mapeie cada garantia à plataforma, teste limits/probes/drain, correlação de telemetry e canary/rollback do mesmo subject sob carga.",
  "Inventarie disco/owners antes de cleanup, atualize host/builder por canary e realize DR/forensics com originals, hashes e cadeia de custódia.",
  "Apresente o Quíron de ponta a ponta: build atestado, stack isolada, última vaga concorrente, release por digest, incidente e restore em host limpo.",
] as const;

export const DOCKER_EXERCISES: ContentExercise[] = DOCKER_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `Em um daemon e registry descartáveis, construa um ensaio para “${title}” que demonstre: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue configuração efetiva redigida, comandos, IDs e digests completos, estado antes/depois, invariantes, cleanup por ownership e a fronteira exata entre o que foi executado e o que continua Pending. Contexto: ${primer}`,
    answerKeyMd: `A resposta prova ${thesis}, localiza ${mechanism} no artifact/runtime e faz “${incident}” divergir por digest, config, reachability, health, exit, policy, efeito ou recuperação. Evidência obrigatória: ${EVIDENCE[chapterIndex]} Identifique engine/BuildKit/Compose/registry/host e versões, subject e plataforma, dado durável e resultado do mutante. Não aceite YAML renderizado, scanner verde, tag, arquivo existente ou mock como prova de comportamento mais amplo.`,
  })),
);

export const DOCKER_CARDS: ContentCard[] = DOCKER_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato Docker precisa sobreviver e qual evidência reprova “${incident}”?`,
    backMd: `${thesis}. Observe ${mechanism}; o mutante deve falhar por digest, config efetiva, isolamento, reachability, health, exit, policy, efeito ou restore, registrando engine/host/plataforma e sem ampliar a alegação além do executor real.`,
  })),
);
