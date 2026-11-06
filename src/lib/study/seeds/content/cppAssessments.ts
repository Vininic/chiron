import type { ContentCard, ContentExercise } from "./types";
import { CPP_CURRICULUM } from "./cppCurriculum";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TYPES = [1, 2, 3] as const;

const EVIDENCE = [
  "Registre compiler, standard mode, library, target, flags, clean build e artifact hash; execute Debug e Release.",
  "Prove invariantes e ownership com exception/failure injection, destruição em ordens diferentes e sanitizer real.",
  "Force reallocação, invalidação, Unicode e lifetimes de views; materialize antes de escapar do owner.",
  "Mate mutantes de exception guarantee, outcome apagado, constraint superficial e callback tardio.",
  "Controle interleavings com barriers, stop e completion concorrentes; processo/banco continuam gates distintos.",
  "Fragment bytes, valide schemas e simule timeout após efeito; TLS/provider exigem endpoint e readback reais.",
  "Faça clean multi-TU/package consumer, confira ODR, symbols, ABI, loader path e cache de BMI por toolchain.",
  "Combine property/mutation, ASan/UBSan/TSan/analyzer e benchmark com oráculo, sem confundir alcance com certificação.",
  "Execute driver e banco com duas sessões, constraints, rollback e outbox; preserve key/eventId em replay.",
  "Teste production graph, redaction/cardinalidade, secret rotation, least privilege e overload bounded.",
  "Instale o pacote, interrompa deploy/shutdown, rode mixed versions e restaure backup mantendo identidades.",
  "Apresente matriz da última vaga, replay divergente, fuzz, carga, kill points e restore com efeito final único.",
] as const;

export const CPP_EXERCISES: ContentExercise[] = CPP_CURRICULUM.flatMap(([chapter, , primer, lessons], chapterIndex) =>
  lessons.slice(0, 3).map(([title, thesis, mechanism, incident], index) => ({
    nodeTitle: chapter,
    type: TYPES[index],
    level: LEVELS[index],
    points: (index + 1) * 10,
    promptMd: `No serviço C++ do Quíron, construa uma experiência para “${title}” que teste: ${thesis}. Implemente ${mechanism} no baseline e um mutante que reproduza “${incident}”. ${EVIDENCE[chapterIndex]} Entregue fonte, fixture, estado inicial, comandos, saída, readback e cleanup. Se compiler, banco, TLS, provider, loader ou storage não estiver disponível, mantenha o gate pendente em vez de atribuí-lo a fake ou parser. Contexto: ${primer}`,
    answerKeyMd: `A resposta correta demonstra ${thesis}, localiza ${mechanism} e faz o mutante “${incident}” divergir em compile/link, lifetime, bytes, estado, efeito, sigilo, desempenho ou recuperação. Evidência específica: ${EVIDENCE[chapterIndex]} O relatório identifica C++ standard, compiler/library, flags, target, artifact/source hash e separa revisão, execução local e integração externa. Não aceite apenas retorno zero, ausência de crash ou status HTTP; preserve eventId e faça readback após falha.`,
  })),
);

export const CPP_CARDS: ContentCard[] = CPP_CURRICULUM.flatMap(([chapter, , , lessons]) =>
  lessons.map(([title, thesis, mechanism, incident]) => ({
    nodeTitle: chapter,
    frontMd: `Em “${title}”, qual contrato C++ precisa sobreviver e que evidência reprova “${incident}”?`,
    backMd: `${thesis}. Inspecione ${mechanism}; o mutante só é refutado no gate correspondente por compile/link, lifetime, bytes, estado, efeito, sigilo ou recuperação, com toolchain e limitações declarados.`,
  })),
);
