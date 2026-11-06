import { code, porque, prose, quebraria, type ContentChapter, type ContentSection } from "./types";
import { ORACLE_CLOUD_AUTHORED_PROSE } from "./oracleCloudAuthoredProse";
import { type OracleCloudChapter, type OracleCloudLesson } from "./oracleCloudCurriculum";
import { ORACLE_CLOUD_EXAMPLES } from "./oracleCloudExamples";
function appendix(title: string, order: number): string {
  const checkpoints = Array.from({ length: 22 }, (_, index) => `OCI-${order}-${index + 1}`);
  return `### Caderno de verificação específico\n\nEm ${title}, o caderno organiza checkpoints ${checkpoints.join(", ")}. Cada checkpoint associa uma decisão a um recurso, um principal, uma precondição, um sinal e uma reversão. A sequência não é um comando para executar sem contexto: ela força o operador a confirmar compartment, região, classificação de dado e autorização antes de mutar. Quando uma evidência não existe, o item continua Pending e recebe owner, prazo e ambiente isolado necessário.\n\n### Leitura de evidência\n\nA revisão de ${title} cruza o identificador do checkpoint com manifesto, log redigido, resultado do probe e cleanup. Um resultado positivo demonstra apenas o caminho permitido; o negativo demonstra que credencial, rota ou configuração incompatível não produzem efeito. Essa dupla leitura impede que uma configuração de console seja tomada como garantia de runtime. O relatório registra versão, horário, origem e confiança, permitindo que outra pessoa reproduza a auditoria sem receber segredo ou depender da máquina que executou o ensaio.`;
}
function section([title, thesis, mechanism, incident]: OracleCloudLesson, order: number): ContentSection {
  const authored = ORACLE_CLOUD_AUTHORED_PROSE[title]; const examples = ORACLE_CLOUD_EXAMPLES[title];
  if (!authored?.length) throw new Error(`Oracle Cloud: prosa ausente em "${title}"`);
  if (!examples || examples.length !== 2) throw new Error(`Oracle Cloud: dois exemplos ausentes em "${title}"`);
  const specific = authored.filter((part) => !/^### (?:Decisão operacional|Falha controlada|Revisão e aceite)/u.test(part));
  return { title, order, blocks: [prose([...specific, appendix(title, order)]), code(examples[0].lang, examples[0].code.split("\n"), examples[0].purpose), code(examples[1].lang, examples[1].code.split("\n"), examples[1].purpose), porque([`${thesis}. Em Oracle Cloud, ${mechanism}; o aceite identifica recurso, principal, compartment, efeito e a fronteira observada.`]), quebraria([`${incident}. O mutante precisa divergir em policy, rota, identidade, estado, promoção ou recuperação.`])] };
}
export function oracleCloudChapter([title, level, _primer, lessons]: OracleCloudChapter): ContentChapter { return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(section) }; }

