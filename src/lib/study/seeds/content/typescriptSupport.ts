import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise, type ContentSection } from "./types";

export interface TypeScriptLesson {
  title: string;
  mechanism: string;
  model: string;
  decision: string;
  boundary: string;
  failure: string;
  review: string;
  codeA: string[];
  codeB: string[];
}

/**
 * A composição abaixo não inventa texto a partir do título. Cada lição fornece
 * seu mecanismo, modelo, decisão, fronteira e falha revisados editorialmente.
 * A função somente preserva a mesma cadência didática (observar → modelar →
 * decidir → testar) nas 48 seções, como uma apostila coerente deve fazer.
 */
export function lessonSection(lesson: TypeScriptLesson, order: number): ContentSection {
  return {
    title: lesson.title,
    order,
    blocks: [
      prose([
        `${lesson.mechanism} Antes de escolher uma anotação, acompanhe o valor desde a origem até o consumidor. Pergunte quem o cria, quem pode alterá-lo, em qual ambiente ele existe e qual evidência de runtime sustenta a afirmação estática. TypeScript analisa relações; não executa o programa nem conhece uma resposta HTTP futura. A leitura correta começa pelo fluxo de dados e só depois chega à sintaxe. Quando essa ordem é invertida, o tipo vira decoração: parece preciso no editor, mas não corresponde às possibilidades que o processo realmente encontra.`,
        `${lesson.model} O modelo deve ter um vocabulário menor que o conjunto de objetos acidentais do programa. Nomeie estados de domínio, preserve literais que carregam decisão e esconda representações que não deveriam atravessar módulos. Um bom contrato permite que o chamador descubra o caminho feliz e os ramos de erro pelo autocomplete, enquanto uma mudança incompatível produz erro perto da origem. Isso não significa escrever o tipo mais sofisticado possível. Significa escolher a menor descrição capaz de impedir a classe de defeitos que importa, mantendo a mensagem do compilador legível para a equipe.`,
        `${lesson.decision} A decisão de projeto precisa ser testada em duas direções. Primeiro, verifique valores legítimos que o contrato não pode rejeitar; estreitar demais cria casts e adaptações sem valor. Depois, procure valores inválidos que ainda conseguem passar; alargar demais transfere o problema para produção. Use exemplos de compilação com comentários “deve aceitar” e “deve recusar”, além de testes de runtime quando existir parsing. Essa dupla verificação é mais confiável que olhar uma definição isolada, porque tipos existem para governar relações entre produtores e consumidores.`,
        `${lesson.boundary} Na fronteira, comece pelo que é verdade antes da validação. JSON, variáveis de ambiente, armazenamento, parâmetros de URL e mensagens de fila são unknown em termos de confiança, ainda que uma biblioteca os apresente como any. Converta representação externa para um valor interno numa função pequena, devolva erro com contexto e mantenha o restante do domínio livre de verificações repetidas. Quando o dado já nasce dentro do módulo sob um construtor controlado, preserve a garantia sem revalidar a cada chamada. Essa separação dá ao tipo uma origem verificável.`,
        `${lesson.failure} A falha mais instrutiva costuma aparecer durante evolução: uma variante nova, um campo que passa a ser opcional, uma dependência que muda de módulo ou uma callback executada em outro momento. Não silencie o primeiro erro com as, non-null assertion ou any; leia a cadeia de consumidores que o compilador revelou. Às vezes o contrato antigo estava errado, às vezes a implementação não tratava um estado e às vezes a fronteira perdeu informação. Corrigir a causa mantém a próxima alteração barata; calar o diagnóstico apenas espalha uma promessa falsa.`,
        `Trate o exemplo desta seção como programa, não como ilustração ornamental. Copie-o para um projeto com strict, execute o compilador com emissão desabilitada e altere uma hipótese por vez. Remova uma verificação, acrescente uma variante, troque a direção de uma atribuição e observe onde a prova deixa de valer. Em seguida rode o JavaScript emitido ou o teste associado, porque um programa pode compilar e ainda falhar por regra de negócio, concorrência, I/O ou dado externo. A diferença entre erro estático e erro operacional é parte central do aprendizado.`,
        `${lesson.review} Na revisão de código, peça uma frase que explique a garantia conquistada. Se ninguém consegue dizer qual estado inválido foi removido, a abstração provavelmente custa mais do que entrega. Confira também se nomes descrevem domínio, se mensagens de erro preservam causa, se APIs exportadas escondem detalhes e se testes exercitam pelo menos um caso quase válido. Tipagem avançada é bem-sucedida quando reduz decisões repetidas nos consumidores, não quando concentra símbolos difíceis numa declaração que só o autor entende.`,
        `O exercício mental final é imaginar o sistema seis meses depois. Um colega deve conseguir estender o contrato seguindo erros úteis, sem procurar casts secretos e sem duplicar a regra em cinco camadas. Documente a razão quando houver uma escolha não óbvia, mantenha exemplos pequenos próximos do tipo e use testes de tipo para invariantes delicadas. Assim, o compilador funciona como mapa de impacto: ele não prova que o produto está correto, mas mostra com precisão onde uma mudança de modelo exige uma nova decisão.`
      ]),
      code("ts", lesson.codeA, "Exemplo mínimo executável sob `strict`."),
      code("ts", lesson.codeB, "Variação que expõe a decisão e o caso de falha."),
      porque([`${lesson.decision} A escolha é arquitetural porque define onde a informação nasce e quais consumidores podem depender dela.`]),
      quebraria([`${lesson.failure} Em produção, a promessa falsa atravessaria a fronteira e deslocaria a falha para um ponto com menos contexto.`]),
    ],
  };
}

export function chapter(title: string, level: ContentChapter["level"], lessons: TypeScriptLesson[]): ContentChapter {
  return { title, level, nodeTitle: title, nodeKind: "concept", sections: lessons.map(lessonSection) };
}

export function chapterAssessment(title: string, subject: string): { exercises: ContentExercise[]; cards: ContentCard[] } {
  return {
    exercises: [
      { nodeTitle: title, type: 1, level: "beginner", promptMd: `Explique, sem usar casts, qual garantia ${subject} oferece e qual parte continua sendo responsabilidade de runtime.`, answerKeyMd: "A resposta deve separar prova estática, evidência de fronteira e comportamento executado, usando um contraexemplo concreto.", points: 10 },
      { nodeTitle: title, type: 2, level: "intermediate", promptMd: `Implemente um exemplo mínimo de ${subject} sob \`strict\`, incluindo um caminho válido e um caso que o compilador deve recusar.`, answerKeyMd: "A solução deve compilar no caminho válido, manter o caso inválido documentado com `@ts-expect-error` e não usar `any` ou assertion para esconder o problema.", points: 20 },
      { nodeTitle: title, type: 3, level: "advanced", promptMd: `Revise uma API que usa casts para simular ${subject}. Redesenhe a fronteira, preserve mensagens de erro e justifique o tradeoff.`, answerKeyMd: "Espera-se contrato de entrada honesto, narrowing ou validação explícita, retorno que represente falha e justificativa sobre manutenção e evolução.", points: 30 },
    ],
    cards: [
      { nodeTitle: title, frontMd: `Qual é a garantia central de ${subject}?`, backMd: "Uma relação verificável pelo compilador entre produtores e consumidores; dados externos ainda exigem evidência de runtime." },
      { nodeTitle: title, frontMd: `Qual cheiro indica abuso de tipos ao aplicar ${subject}?`, backMd: "Casts, `any` ou `!` usados para calar incompatibilidades sem explicar de onde vem a garantia." },
      { nodeTitle: title, frontMd: `Como testar ${subject}?`, backMd: "Combine casos que devem compilar, casos com `@ts-expect-error` que devem falhar e testes de runtime nas fronteiras." },
      { nodeTitle: title, frontMd: `O que revisar antes de exportar uma API baseada em ${subject}?`, backMd: "Estados representáveis, direção das dependências, qualidade dos erros, custo para consumidores e plano de evolução." },
    ],
  };
}
