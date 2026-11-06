/** TypeScript — apostila curada. Capítulos entram nesta fonte somente após revisão editorial e contrato. */
import { code, porque, prose, quebraria, type ContentCard, type ContentExercise, type ContentSource } from "./types";
import { TYPESCRIPT_REMAINING_CARDS, TYPESCRIPT_REMAINING_CHAPTERS, TYPESCRIPT_REMAINING_EXERCISES } from "./typescriptRemaining";
import { TYPESCRIPT_STRICT_SECTION } from "./typescriptStrictSection";

export const TYPESCRIPT_CHAPTER_1 = "O compilador como modelo, não como guarda de runtime";

const chapterOneExercises: ContentExercise[] = [
  { nodeTitle: TYPESCRIPT_CHAPTER_1, type: 1, level: "beginner", points: 10, promptMd: "Explique por que `response as User` não valida uma resposta e implemente um parser que começa em unknown, rejeita null e campos incorretos e constrói novo objeto. Diferencie a evidência produzida no runtime daquela oferecida pelo compilador.", choices: ["Parser executa prova; assertion apenas instrui o checker", "Assertion converte JSON", "Interface permanece no JavaScript", "Strict valida a rede"], answerKeyMd: "A primeira opção é correta. Tipos e assertions são apagados; o parser examina o valor real, valida forma e invariantes e produz um snapshot confiável para o núcleo." },
  { nodeTitle: TYPESCRIPT_CHAPTER_1, type: 2, level: "intermediate", points: 20, promptMd: "Modele loading, ready e failed como union discriminada e escreva presenter exaustivo. Depois adicione cancelled e mostre como o diagnóstico conduz aos consumidores que precisam de política, sem usar default ou cast para silenciar o impacto.", answerKeyMd: "Espera-se tag literal por variante, acesso aos campos somente após narrowing e verificação com never. A nova variante deve quebrar pontos de decisão até receber comportamento deliberado." },
  { nodeTitle: TYPESCRIPT_CHAPTER_1, type: 3, level: "advanced", points: 30, promptMd: "Audite configurações de app web, backend e testes que hoje compartilham DOM e Node indiscriminadamente. Proponha base estrita e projetos específicos, ative opções de ausência e prove que editor, CI, build limpo e runtime resolvem o mesmo programa.", answerKeyMd: "A solução deve compartilhar strictness, separar libs e types por ambiente, alinhar module resolution ao executor, validar includes com showConfig e executar typecheck, build limpo e artefato sem depender de cache ou globals acidentais." },
];

const chapterOneCards: ContentCard[] = [
  { nodeTitle: TYPESCRIPT_CHAPTER_1, frontMd: "O que acontece com interfaces e aliases no runtime?", backMd: "Eles são apagados na emissão; apenas validações e valores JavaScript permanecem para examinar dados reais." },
  { nodeTitle: TYPESCRIPT_CHAPTER_1, frontMd: "O que é narrowing?", backMd: "Uma prova local no fluxo de controle que reduz as variantes possíveis antes de acessar capacidades específicas." },
  { nodeTitle: TYPESCRIPT_CHAPTER_1, frontMd: "Quando usar brand em tipagem estrutural?", backMd: "Quando valores de mesma representação, como ids string, pertencem a domínios que não podem ser misturados após factories confiáveis." },
  { nodeTitle: TYPESCRIPT_CHAPTER_1, frontMd: "O que `lib` no tsconfig fornece?", backMd: "Declarações de APIs do ambiente; ela não instala implementação, polyfill nem muda o runtime que executa o artefato." },
];

export const TYPESCRIPT_CONTENT: ContentSource = {
  name: "TypeScript",
  kind: "stack",
  language: "TypeScript",
  chapters: [{
    title: TYPESCRIPT_CHAPTER_1,
    level: "basico",
    nodeTitle: TYPESCRIPT_CHAPTER_1,
    nodeKind: "concept",
    sections: [{
      title: "O que o compilador sabe — e o que desaparece ao executar",
      order: 1,
      blocks: [
        prose([
          "TypeScript é uma linguagem de análise estática que gera JavaScript. Essa frase parece simples, mas evita o primeiro erro de arquitetura: um tipo não valida uma mensagem recebida pela rede, não impede um formulário malicioso e não transforma automaticamente uma string em número. O compilador lê arquivos antes da execução, constrói um modelo dos valores possíveis e emite JavaScript sem as anotações. Quando o programa roda, o motor JavaScript só vê objetos, strings, funções e os testes que você escreveu. Por isso uma aplicação séria separa duas perguntas: o que o compilador pode provar sobre o código que controlamos e o que uma fronteira precisa verificar sobre dados que não controlamos.",
          "O benefício real não é decorar `string` e `number`; é tornar estados inválidos difíceis de representar. Se uma função recebe `Order`, a definição desse tipo comunica campos, opcionalidade e relações que o chamador deve satisfazer. Se um campo pode faltar, o tipo precisa dizer isso; se um resultado pode ser erro, a API precisa representar esse ramo. O editor então passa a oferecer navegação, refactor e mensagens antes de o bug chegar ao usuário. Porém isso funciona apenas se as definições acompanham o domínio. Usar `any` para silenciar um erro é remover o alarme, não consertar o circuito.",
          "Considere uma API que entrega JSON. Declarar `const user = response as User` não converte nem valida nada: é uma promessa unilateral ao compilador. Se o servidor devolver `null`, `id: 7` ou uma versão antiga, o código pode falhar depois num ponto distante. A fronteira deve começar em `unknown`, verificar forma, produzir um valor de domínio confiável ou retornar erro explícito. Depois dessa conversão, o núcleo pode usar tipos precisos sem repetir `typeof` em cada função. A regra é útil: dados externos são desconhecidos até serem verificados; dados internos devem carregar o contrato que a verificação estabeleceu.",
          "A configuração também faz parte do modelo. `strict` não é cosmético: ele ativa verificações sobre null, parâmetros implícitos, propriedades não inicializadas e outras lacunas comuns. Ativá-lo num projeto antigo pode revelar muitos erros; a resposta saudável é priorizar fronteiras e módulos modificados, não desligar tudo. Um `tsconfig` separado para testes ou build pode existir, mas todos precisam concordar sobre resolução de módulos e bibliotecas disponíveis. O tipo de `document` vem de uma lib do navegador; o de `process` vem de definições Node. Confundir ambiente com linguagem cria falsos erros ou falsa segurança.",
          "O teste de fogo é conseguir explicar uma falha em duas camadas. Se a compilação recusa acesso a `user.email`, pergunte se o contrato diz que email é opcional e modele o caso ausente. Se a produção recebe objeto malformado, pergunte onde a validação deveria ter ocorrido e qual erro o usuário pode entender. O primeiro problema é de modelo estático; o segundo é de runtime. TypeScript melhora ambos quando a fronteira é explícita, mas não substitui autenticação, schema validation, transação ou teste de integração. Ele reduz a área de incerteza para que essas defesas sejam colocadas no lugar certo.",
          "Ao final deste capítulo, trate cada anotação como uma afirmação verificável sobre um valor e cada assertion como dívida que exige justificativa. A apostila usará unions, generics e tipos condicionais para tornar essas afirmações mais expressivas, mas a disciplina permanece: modele o domínio, valide a entrada e deixe o compilador recusar caminhos que não foram tratados."
        ]),
        prose([
          "Uma prática útil é manter um pequeno teste de fronteira ao lado do parser. Envie um objeto válido, um valor nulo, um objeto com campo ausente e outro com tipo quase correto, como número no lugar de string. O teste não serve apenas para cobertura: ele registra qual evidência autoriza o restante do programa a tratar o resultado como `User`. Se o contrato externo mudar, a falha aparece no ponto de tradução e não numa tela que tentou chamar um método inexistente. Em bibliotecas, complemente isso com exemplos que devem compilar e linhas marcadas com `@ts-expect-error`; assim a superfície estática e o comportamento executado evoluem juntos.",
          "Também observe o JavaScript emitido pelo menos uma vez. Interfaces, aliases, parâmetros de tipo e a maior parte das anotações desaparecem. Já tags discriminantes, testes `typeof`, classes e chamadas de parser permanecem porque são valores ou instruções reais. Essa inspeção desfaz a ideia de que uma anotação tem custo ou proteção automática no runtime e ajuda a decidir onde uma validação precisa existir. O objetivo de `strict` é exigir que o código apresente provas antes de usar uma possibilidade; o objetivo do parser é produzir a prova a partir de bytes que o compilador jamais viu."
        ]),
        code("ts", [
          "type User = { id: string; email: string };",
          "function parseUser(value: unknown): User {",
          "  if (!value || typeof value !== 'object') throw new TypeError('usuário inválido');",
          "  const candidate = value as Record<string, unknown>;",
          "  if (typeof candidate.id !== 'string' || typeof candidate.email !== 'string') throw new TypeError('campos inválidos');",
          "  return { id: candidate.id, email: candidate.email };",
          "}",
        ], "A conversão ocorre depois da validação, não antes."),
        code("ts", [
          "type LoadResult = { ok: true; value: User } | { ok: false; reason: string };",
          "function load(value: unknown): LoadResult {",
          "  try { return { ok: true, value: parseUser(value) }; }",
          "  catch { return { ok: false, reason: 'invalid_payload' }; }",
          "}",
        ]),
        porque(["O compilador é valioso porque transforma contrato de código em feedback imediato; a fronteira continua responsável por transformar dado desconhecido em valor confiável."]),
        quebraria(["Tratar `as User` como validação permite que payload malformado atravesse o sistema e falhe muito depois do ponto onde contexto e causa eram conhecidos."]),
      ],
    }, {
      title: "Narrowing: provar qual variante está presente",
      order: 2,
      blocks: [
        prose([
          "Um union não é um objeto parcialmente conhecido; é uma alternativa completa entre formas. `string | undefined` exige que o programa lide com ausência antes de chamar métodos de string. O narrowing é a prova local que reduz possibilidades: `typeof`, `in`, `instanceof`, igualdade, predicado de tipo e uma tag discriminante. A prova vale no ramo onde foi feita; ao atravessar callback ou chamar código que pode mutar uma referência, o compilador pode conservadoramente voltar ao tipo mais amplo. Essa cautela revela que tipo descreve fluxo de controle, não apenas forma declarada no topo do arquivo.",
          "Prefira union discriminada quando estados têm comportamentos distintos. Uma resposta de rede como `{ kind: 'loading' } | { kind: 'ready'; data: Product[] } | { kind: 'failed'; error: Error }` obriga cada tela a reconhecer pendência e falha antes de ler dados. Uma coleção de booleanos — `loading`, `hasError`, `hasData` — aceita combinações impossíveis, como carregar e mostrar erro e dados ao mesmo tempo. A tag é dado de runtime, portanto serve tanto à interface quanto ao compilador e pode ser validada na fronteira.",
          "Use `never` para verificar exaustividade. Ao adicionar uma nova variante, um `switch` com função `assertNever` deixa de compilar onde a decisão ainda não foi atualizada. Isso transforma uma mudança de domínio em lista confiável de consumidores afetados. Não esconda o caso novo com `default`: ele impede a descoberta justamente quando uma transição precisa de política explícita. A mensagem, a telemetria e o comportamento de retry podem ser diferentes para cada falha; o tipo deve preservar essa diferença.",
          "Predicado personalizado é útil quando a verificação tem nome de domínio, como `isAuthenticatedSession`. Ele deve testar realmente o que promete: escrever `return true as boolean` ou confiar num cast faz o compilador aceitar acesso que runtime não garante. Em APIs públicas, exponha função de parse que devolve union de sucesso/erro em vez de boolean solto; assim quem chama recebe também o valor estreitado ou a razão da recusa. O teste deve enviar objeto quase correto, campos extras e valores nulos, não apenas o exemplo feliz.",
          "Narrowing não substitui imutabilidade nem controle de concorrência. Depois de provar que `result.kind === 'ready'`, outro fluxo pode substituir estado compartilhado antes de um callback executar. Capture o valor que precisa, modele ciclo de vida e cancele operação obsoleta. TypeScript ajuda a tornar o acesso seguro naquele ponto; ownership e tempo continuam decisões do programa."
        ]),
        prose([
          "O compilador acompanha a prova pelo grafo de controle. Um `return` antecipado elimina variantes no restante da função; uma igualdade entre duas unions pode estreitar ambas; uma atribuição pode invalidar conclusão anterior. Esse detalhe explica por que guardar um campo opcional numa constante antes de criar callback costuma ser mais seguro que reler uma propriedade mutável depois. Não lute contra a análise com assertion: reestruture o fluxo para que a evidência e o uso fiquem próximos. Em código assíncrono, capture o snapshot cujo significado está sendo processado e compare tokens ou versões antes de publicar o resultado.",
          "Guards reutilizáveis merecem testes adversos porque o predicado é uma autoridade especial: ao escrever `value is Session`, o autor promete mais do que o corpo retorna como boolean. Verifique cada campo necessário, não aceite arrays quando espera registro e considere se propriedade herdada é válida. Para contratos maiores, um parser que devolve o valor validado e uma lista de problemas é mais auditável do que uma cadeia de guards. A union discriminada resultante deve carregar detalhes suficientes para a decisão seguinte, sem reduzir todas as falhas a uma string genérica ou lançar exceção antes que o chamador escolha a política. Esse cuidado mantém a prova local legível durante futuras mudanças do domínio."
        ]),
        code("ts", ["type Result = { kind: 'ready'; value: number } | { kind: 'failed'; message: string };", "function render(result: Result) {", "  switch (result.kind) {", "    case 'ready': return result.value.toFixed(2);", "    case 'failed': return result.message;", "    default: return assertNever(result);", "  }", "}", "function assertNever(value: never): never { throw new Error(`estado: ${JSON.stringify(value)}`); }" ]),
        code("ts", ["function isRecord(value: unknown): value is Record<string, unknown> {", "  return !!value && typeof value === 'object';", "}", "function parseQuantity(value: unknown): Result {", "  if (!isRecord(value) || typeof value.quantity !== 'number') return { kind: 'failed', message: 'quantity inválida' };", "  return { kind: 'ready', value: value.quantity };", "}" ]),
        porque(["Unions discriminadas reduzem estados impossíveis e fazem toda nova variante aparecer nos pontos de decisão que precisam tratá-la."]),
        quebraria(["Um cast para forçar variante ignora exatamente a evidência que o programa precisa antes de acessar dados que podem não existir."]),
      ],
    }, {
      title: "Atribuição estrutural: compatibilidade não é identidade",
      order: 3,
      blocks: [
        prose([
          "TypeScript usa principalmente tipagem estrutural: um valor é aceito quando possui a forma exigida, mesmo que tenha sido criado por outra interface. Isso torna composição natural, mas exige atenção ao nome das propriedades e à direção da atribuição. Um objeto com campos adicionais pode ser usado onde se pede subconjunto; uma variável com campo opcional não pode ser usada onde o campo obrigatório é exigido. Interface e type alias descrevem contratos; não criam classe nem validam objeto em runtime.",
          "A verificação extra de propriedades em literal é uma proteção deliberada contra erro de digitação. `save({ emali: 'a@b' })` falha quando o contrato pede `email`, enquanto atribuir antes a uma variável ampla pode esconder o mesmo defeito. Não contorne isso com index signature aberta; modele extensibilidade apenas onde o domínio realmente aceita chaves desconhecidas. `Record<string, unknown>` é apropriado na borda, não como substituto para entidade bem definida.",
          "Variância aparece quando funções recebem ou devolvem tipos relacionados. Parâmetro mais restrito não pode substituir callback que promete aceitar valor mais amplo: quem chama pode passar variante que ele não sabe tratar. Retorno mais específico costuma ser seguro porque entrega pelo menos o que o contrato espera. Métodos, callbacks e coleções expõem essa diferença; `strictFunctionTypes` ajuda a revelar caso onde uma função aceita menos do que consumidores legítimos podem fornecer.",
          "Tipos nominais não existem por padrão: dois IDs representados por string são intercambiáveis para o compilador. Quando misturá-los cria bug caro — `UserId` passado como `OrderId` — use branding controlado, factory e validação de fronteira. O objetivo não é decorar string com alias; é impedir que capacidade de um domínio atravesse outro sem conversão explícita."
        ]),
        prose([
          "Compatibilidade estrutural funciona melhor quando contratos são pequenos e orientados a capacidade. Uma função que só precisa registrar texto pode receber `{ log(message: string): void }` em vez de uma classe concreta com transporte, configuração e lifecycle. Produção fornece o adapter real; teste fornece um fake mínimo. Como a relação depende da forma, nenhum dos dois módulos precisa importar a implementação do outro. Essa liberdade desaparece se o contrato expõe detalhes acidentais, campos mutáveis ou uma index signature que admite qualquer coisa.",
          "Branding exige um ponto de criação confiável. Um alias `type UserId = string` apenas documenta; uma interseção com marca impede mistura estática, mas ainda pode ser forjada por assertion. Por isso mantenha o cast dentro de uma factory que valida prefixo, formato ou existência conforme o domínio e exporte o tipo sem exportar a marca. Para callbacks, faça o exercício inverso: identifique todos os valores que o chamador pode enviar. O handler substituto precisa aceitar esse conjunto inteiro, ainda que internamente descarte variantes. Retornos podem ser mais específicos porque o consumidor recebe pelo menos as propriedades prometidas; entradas não podem ser estreitadas unilateralmente."
          ,"Excess-property check merece ser entendido como diagnóstico para literals recém-criados, não como regra de objetos exatos. Se a aplicação precisa rejeitar campos desconhecidos por segurança ou compatibilidade, o parser de runtime deve fazer isso explicitamente. No núcleo, prefira aceitar a capacidade mínima: uma função que lê `id` não precisa proibir que o objeto também possua `email`. Essa abertura estrutural é o que permite passar entidades mais ricas sem adapters vazios. A precisão deve aparecer nas operações de escrita, onde um patch genérico pode alterar campos proibidos. Defina comandos específicos, como `ChangeEmail`, em vez de expor `Partial<User>` indiscriminadamente.",
          "Ao revisar uma incompatibilidade, leia a mensagem de dentro para fora: qual propriedade divergiu, em qual posição de função e em qual direção a atribuição estava ocorrendo. Muitas mensagens longas são apenas a expansão de uma diferença pequena enterrada em um generic. Dê nomes a tipos intermediários e construa uma atribuição mínima para isolar a relação. Depois leve a correção ao contrato correto, evitando assertion no ponto consumidor. Esse método também revela quando duas interfaces com a mesma forma deveriam de fato permanecer intercambiáveis e quando uma marca nominal protege uma distinção crítica do negócio."
        ]),
        code("ts", ["type Brand<T, Name extends string> = T & { readonly __brand: Name };", "type UserId = Brand<string, 'UserId'>;", "type OrderId = Brand<string, 'OrderId'>;", "const userId = 'u_1' as UserId;", "function loadOrder(id: OrderId) { return id; }", "// loadOrder(userId); // erro: domínios não se misturam" ]),
        code("ts", ["type Listener = (event: { kind: string }) => void;", "const logAny: Listener = (event) => console.log(event.kind);", "// callback que só aceita { kind: 'paid' } não pode substituir Listener."]),
        porque(["A forma estrutural reduz acoplamento entre módulos; branding e contratos estreitos recuperam distinções de domínio que a estrutura sozinha não expressa."]),
        quebraria(["Abrir todos os objetos com index signature ou usar casts elimina erros de atribuição que avisariam sobre campos trocados e identificadores de domínios distintos."]),
      ],
    }, TYPESCRIPT_STRICT_SECTION],
  }, ...TYPESCRIPT_REMAINING_CHAPTERS],
  exercises: [...chapterOneExercises, ...TYPESCRIPT_REMAINING_EXERCISES],
  cards: [...chapterOneCards, ...TYPESCRIPT_REMAINING_CARDS],
  editorial: {
    proseReviewed: true,
    assessmentsReviewed: true,
    examplesVerified: true,
    reviewedAt: "2026-08-27",
  },
};
