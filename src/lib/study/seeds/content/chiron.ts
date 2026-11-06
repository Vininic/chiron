import type { ContentSource, ContentSection } from './types';
import { CHIRON_CURRICULUM } from './chironCurriculum';
import { CHIRON_AUTHORED_PROSE } from './chironAuthoredProse';
import { CHIRON_EXAMPLES } from './chironExamples';
import { CHIRON_CARDS, CHIRON_EXERCISES, CHIRON_REVIEW } from './chironAssessments';
import { CHIRON_SUPPLEMENT_CITATIONS } from './chironSupplementCitations';
import { CHIRON_SYSTEM_DIAGRAMS } from './chironSystemDiagrams';
const citations = {
  "Índice global, documentos e fronteira da sessão": {
    "file": "src/lib/study/migrate.ts",
    "symbol": "freshIndex",
    "lines": [
      117,
      117
    ]
  },
  "Biblioteca de uma fonte e identidade do conteúdo": {
    "file": "src/lib/study/migrate.ts",
    "symbol": "freshLib",
    "lines": [
      132,
      132
    ]
  },
  "Migração do índice sem descartar estudo existente": {
    "file": "src/lib/study/migrate.ts",
    "symbol": "migrateIndex",
    "lines": [
      17,
      17
    ]
  },
  "Conteúdo legado, capítulos sintetizados e limites da migração": {
    "file": "src/lib/study/migrate.ts",
    "symbol": "migrateLib",
    "lines": [
      106,
      106
    ]
  },
  "Criar fonte, identidade e publicação editorial": {
    "file": "src/lib/study/service.ts",
    "symbol": "addSource",
    "lines": [
      14,
      14
    ]
  },
  "Remover fonte e reconhecer o alcance da cascata": {
    "file": "src/lib/study/service.ts",
    "symbol": "removeSource",
    "lines": [
      28,
      28
    ]
  },
  "Criar conceito no mapa sem fabricar domínio": {
    "file": "src/lib/study/service.ts",
    "symbol": "addNode",
    "lines": [
      40,
      40
    ]
  },
  "Atualização seletiva, ausência e limites de patch": {
    "file": "src/lib/study/service.ts",
    "symbol": "updateNode",
    "lines": [
      54,
      54
    ]
  },
  "Markdown legado e blocos semânticos": {
    "file": "src/lib/content/blocks.ts",
    "symbol": "mdToBlocks",
    "lines": [
      24,
      24
    ]
  },
  "Densidade de explicação e contagem auditável": {
    "file": "src/lib/content/blocks.ts",
    "symbol": "proseWordCount",
    "lines": [
      49,
      49
    ]
  },
  "Cardinalidade de blocos e contrato de exemplos": {
    "file": "src/lib/content/blocks.ts",
    "symbol": "countBlocksOfKind",
    "lines": [
      55,
      55
    ]
  },
  "Presença semântica, referências e publicação integral": {
    "file": "src/lib/content/blocks.ts",
    "symbol": "hasBlockOfKind",
    "lines": [
      59,
      59
    ]
  },
  "Grau de lembrança e contrato do motor SM-2": {
    "file": "src/lib/study/srs.ts",
    "symbol": "gradeMinQuality",
    "lines": [
      29,
      29
    ]
  },
  "Intervalo, facilidade e transição de revisão": {
    "file": "src/lib/study/srs.ts",
    "symbol": "computeSM2",
    "lines": [
      33,
      33
    ]
  },
  "Vencimento inclusivo e representação da data": {
    "file": "src/lib/study/srs.ts",
    "symbol": "isCardDue",
    "lines": [
      76,
      76
    ]
  },
  "Contagem de revisão e conjunto de cards": {
    "file": "src/lib/study/srs.ts",
    "symbol": "cardsDue",
    "lines": [
      81,
      81
    ]
  },
  "Botões de revisão e significado da lembrança": {
    "file": "src/lib/study/review.ts",
    "symbol": "gradeForButton",
    "lines": [
      28,
      28
    ]
  },
  "Prever um intervalo usando o mesmo motor": {
    "file": "src/lib/study/review.ts",
    "symbol": "predictIntervalDays",
    "lines": [
      35,
      35
    ]
  },
  "Apresentação compacta de dias, meses e anos": {
    "file": "src/lib/study/review.ts",
    "symbol": "formatInterval",
    "lines": [
      43,
      43
    ]
  },
  "Retenção observada e alcance da medida": {
    "file": "src/lib/study/review.ts",
    "symbol": "computeRetention",
    "lines": [
      53,
      53
    ]
  },
  "Seleção de exercícios, filtros e acaso": {
    "file": "src/lib/study/practice.ts",
    "symbol": "selectExercises",
    "lines": [
      26,
      26
    ]
  },
  "Correção exata e resposta estruturada": {
    "file": "src/lib/study/practice.ts",
    "symbol": "scoreMultipleChoice",
    "lines": [
      37,
      37
    ]
  },
  "Autoavaliação explícita e arredondamento": {
    "file": "src/lib/study/practice.ts",
    "symbol": "scoreSelfGrade",
    "lines": [
      50,
      50
    ]
  },
  "Fração de rubrica e validação da resposta do tutor": {
    "file": "src/lib/study/practice.ts",
    "symbol": "scoreRubricFraction",
    "lines": [
      59,
      59
    ]
  },
  "Pontos do exercício e multiplicador de nível": {
    "file": "src/lib/study/scoring.ts",
    "symbol": "computePointsForExercise",
    "lines": [
      5,
      5
    ]
  },
  "Domínio agregado e denominador dos conceitos": {
    "file": "src/lib/study/scoring.ts",
    "symbol": "computeMasteryWeight",
    "lines": [
      10,
      10
    ]
  },
  "Sequência diária, data explícita e repetição de chamadas": {
    "file": "src/lib/study/scoring.ts",
    "symbol": "updateStreak",
    "lines": [
      16,
      16
    ]
  },
  "Acumular pontos sem perder a sequência diária": {
    "file": "src/lib/study/scoring.ts",
    "symbol": "addPoints",
    "lines": [
      30,
      30
    ]
  },
  "Conceitos a retomar e vínculo com a fonte": {
    "file": "src/lib/study/dashboard.ts",
    "symbol": "computeWeakestNodes",
    "lines": [
      74,
      74
    ]
  },
  "Distribuição de domínio e integridade da escala": {
    "file": "src/lib/study/dashboard.ts",
    "symbol": "computeMasteryDistribution",
    "lines": [
      165,
      165
    ]
  },
  "Orçamento de sessão e heurística de divisão": {
    "file": "src/lib/study/dashboard.ts",
    "symbol": "planSessionBlocks",
    "lines": [
      178,
      178
    ]
  },
  "Vencimentos futuros e recorte do calendário": {
    "file": "src/lib/study/dashboard.ts",
    "symbol": "computeUpcomingDue",
    "lines": [
      190,
      190
    ]
  },
  "Identidade de uma célula e estruturas de busca": {
    "file": "src/lib/labs/grid.ts",
    "symbol": "cellKey",
    "lines": [
      3,
      3
    ]
  },
  "Vizinhança ortogonal e fronteiras do tabuleiro": {
    "file": "src/lib/labs/grid.ts",
    "symbol": "neighbors",
    "lines": [
      6,
      6
    ]
  },
  "Busca em largura, pais e caminho mínimo": {
    "file": "src/lib/labs/grid.ts",
    "symbol": "bfs",
    "lines": [
      16,
      16
    ]
  },
  "Verificar um caminho e reconhecer o que falta": {
    "file": "src/lib/labs/grid.ts",
    "symbol": "pathIsValid",
    "lines": [
      38,
      38
    ]
  },
  "Contrato de autoria de uma camada de Lab": {
    "file": "src/lib/labs/engine.ts",
    "symbol": "validateLab",
    "lines": [
      9,
      9
    ]
  },
  "Seleção de mutações e ordem de autoria": {
    "file": "src/lib/labs/engine.ts",
    "symbol": "activeMutations",
    "lines": [
      26,
      26
    ]
  },
  "Invariante declarada e evidência de uma quebra": {
    "file": "src/lib/labs/engine.ts",
    "symbol": "invariantIsBroken",
    "lines": [
      31,
      31
    ]
  },
  "Progresso de camadas e significado de conclusão": {
    "file": "src/lib/labs/engine.ts",
    "symbol": "labCompletion",
    "lines": [
      35,
      35
    ]
  },
  "Propostas do tutor e limite do parser de ações": {
    "file": "src/lib/ai/actions.ts",
    "symbol": "parseActions",
    "lines": [
      16,
      16
    ]
  },
  "Descrever uma proposta antes de aplicá-la": {
    "file": "src/lib/ai/actions.ts",
    "symbol": "describeAction",
    "lines": [
      24,
      24
    ]
  },
  "Protocolo textual de propostas do Aetheris": {
    "file": "src/lib/ai/actions.ts",
    "symbol": "actionPrompt",
    "lines": [
      37,
      37
    ]
  },
  "Aplicar uma proposta e distinguir efeitos de notas": {
    "file": "src/lib/ai/actions.ts",
    "symbol": "applyAction",
    "lines": [
      38,
      38
    ]
  },
  "Tentativa, crédito e responsabilidade da gravação": {
    "file": "src/lib/study/service.ts",
    "symbol": "recordAttempt",
    "lines": [
      149,
      149
    ]
  },
  "Refazer uma camada e preservar o histórico pertinente": {
    "file": "src/lib/study/service.ts",
    "symbol": "recordLabLayer",
    "lines": [
      157,
      157
    ]
  },
  "Criar uma sessão a partir de blocos explícitos": {
    "file": "src/lib/study/service.ts",
    "symbol": "createSession",
    "lines": [
      164,
      164
    ]
  },
  "Como estender o Chiron com contratos e persistência": {
    "file": "src/lib/study/service.ts",
    "symbol": "serializeIndex",
    "lines": [
      192,
      192
    ]
  }
} as const;
export const CHIRON_CONTENT: ContentSource = {
 name:'Chiron',kind:'repo',language:'TypeScript / React',
 chapters:CHIRON_CURRICULUM.map(c=>({title:c.title,level:c.level,nodeTitle:c.title,nodeKind:'concept',sections:c.sections.map((title,order): ContentSection=>{
 const prose=CHIRON_AUTHORED_PROSE[title],examples=CHIRON_EXAMPLES[title],review=CHIRON_REVIEW[title];
 if(!prose||!examples||!review)throw Error('Chiron: incomplete section '+title);
 const cite=citations[title];
 return {title,order,blocks:[{kind:'prose',md:prose},...examples.map(e=>({kind:'code' as const,lang:e.lang,code:e.code,caption:'['+e.scope+'] '+e.purpose})),{kind:'porque',md:review[1]},{kind:'quebraria',md:review[2]},{kind:'cite',file:cite.file,symbol:cite.symbol,lines:[cite.lines[0],cite.lines[1]]}]};
 })})),exercises:CHIRON_EXERCISES,cards:CHIRON_CARDS,
 editorial: {"proseReviewed":true,"assessmentsReviewed":true,"examplesVerified":true,"reviewedAt":"2026-10-19"},
};
CHIRON_CONTENT.chapters[0].sections[0].blocks.push({kind:'diagram',caption:'Fluxo do estado: serviço transforma; provider mantém e persiste; páginas derivam visualizações. Conteúdo e rascunhos entram por materializações distintas.',svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 230" role="img" aria-label="Arquitetura do estado de estudo"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor"/></marker></defs><g fill="none" stroke="currentColor"><rect x="10" y="75" width="190" height="70" rx="10"/><rect x="260" y="75" width="190" height="70" rx="10"/><rect x="510" y="75" width="190" height="70" rx="10"/><path d="M200 110H255M450 110H505M700 110H760" marker-end="url(#arrow)"/></g><g fill="currentColor" font-family="sans-serif" font-size="16"><text x="25" y="105">ContentSource / drafts</text><text x="25" y="128">materialização distinta</text><text x="278" y="105">service.ts</text><text x="278" y="128">index + bibliotecas</text><text x="530" y="105">ChironProvider</text><text x="530" y="128">estado / persistência</text><text x="765" y="105">Páginas</text><text x="765" y="128">estudo e métricas</text><text x="260" y="200">Contrato + editorial + exemplos verificáveis antes de integrar conteúdo</text></g></svg>'});
CHIRON_CONTENT.chapters.at(-1)!.sections.at(-1)!.blocks.push({kind:'labref',labId:'agora',layerId:'reserva-estoque-concorrencia'});
for(const supplement of CHIRON_SUPPLEMENT_CITATIONS){
 const title=Object.entries(citations).find(([,citation])=>citation.symbol===supplement.anchor)?.[0];
 const section=CHIRON_CONTENT.chapters.flatMap(c=>c.sections).find(s=>s.title===title);
 if(!section)throw Error('Missing Chiron supplement section '+supplement.anchor);
 section.blocks.push({kind:'cite',file:supplement.file,symbol:supplement.symbol,lines:[supplement.line,supplement.line]});
}
for(const system of CHIRON_SYSTEM_DIAGRAMS){
 const title=Object.entries(citations).find(([,citation])=>citation.symbol===system.anchor)?.[0];
 const section=CHIRON_CONTENT.chapters.flatMap(c=>c.sections).find(s=>s.title===title);
 if(!section)throw Error('Missing system section '+system.system);
 section.blocks.push({kind:'diagram',caption:system.system+': '+system.caption+' Arquivos: '+system.files.join(', '),svg:system.svg});
}

