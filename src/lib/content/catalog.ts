import type { ChapterLevel, SourceKind } from "@/lib/study/types";
import type { SourceBlueprint } from "./webCore";
export interface EditorialLens {
  question: string;
  failure: string;
  test: string;
  extension: string;
}

export interface CatalogProfile {
  name: string;
  language: string;
  kind: SourceKind;
  topics: readonly [string, string, string, string];
  question: string;
  failure: string;
  test: string;
  extension: string;
  labId: "ophis" | "agora" | "dedalo" | "micenas";
}

const levels: readonly ChapterLevel[] = ["basico", "basico", "basico", "basico", "intermediario", "intermediario", "intermediario", "intermediario", "avancado", "avancado", "avancado", "avancado"];
const phases = [
  "Fundamentos e modelo mental", "Valores, estruturas e representação", "Fluxo, composição e interfaces", "Módulos, organização e dependências",
  "Erros, validação e fronteiras", "Assincronia, eventos e coordenação", "Persistência, estado e consistência", "Segurança, permissões e colaboração",
  "Escala, desempenho e custos", "Observabilidade e diagnóstico", "Testes, automação e entrega", "Projeto integrador: sistema explicável",
] as const;

export function blueprintForProfile(profile: CatalogProfile): SourceBlueprint {
  const titles = profile.kind === "tool"
    ? phases.map((phase, index) => index === 9 ? "Armadilhas, recuperação e operação" : phase)
    : phases;
  return {
    name: profile.name,
    language: profile.language,
    chapters: titles.map((phase, index) => ({
      title: `${phase} em ${profile.name}`,
      level: levels[index],
      concepts: [profile.topics[index % profile.topics.length], profile.topics[(index + 1) % profile.topics.length], phase.toLowerCase()],
      ...(index === phases.length - 1 ? { labId: profile.labId } : {}),
    })),
  };
}

export function lensForProfile(profile: CatalogProfile): EditorialLens {
  return { question: profile.question, failure: profile.failure, test: profile.test, extension: profile.extension };
}

const profile = (name: string, language: string, kind: SourceKind, topics: CatalogProfile["topics"], question: string, failure: string, test: string, extension: string, labId: CatalogProfile["labId"]): CatalogProfile => ({ name, language, kind, topics, question, failure, test, extension, labId });

/**
 * Curricula restantes do catálogo. Cada perfil fixa o vocabulário técnico,
 * os riscos e o tipo de evidência daquele domínio; `blueprintForProfile`
 * converte isso em doze capítulos progressivos, sem esconder uma fonte
 * vazia atrás de um cartão de dashboard.
 */
export const CATALOG_PROFILES: readonly CatalogProfile[] = [
  profile("HTML", "HTML", "stack", ["semântica", "documento", "formulários", "acessibilidade"], "qual significado o navegador e uma tecnologia assistiva conseguem inferir da estrutura", "uma árvore visualmente correta não oferece navegação, rótulos ou hierarquia para outros agentes", "uma página navegada só por teclado, com leitor de tela e formulário inválido", "separar conteúdo semântico, estilo e comportamento", "dedalo"),
  profile("CSS", "CSS", "stack", ["cascade", "layout", "responsividade", "tokens"], "qual regra vence na cascade e em qual contexto de layout ela é calculada", "um ajuste local depende de especificidade acidental e quebra em outra largura ou tema", "um componente em viewport estreito, largo, com zoom e em tema alternativo", "usar camadas, tokens e componentes com limites de responsabilidade", "dedalo"),
  profile("Tailwind CSS", "CSS", "tool", ["utility", "tokens", "variantes", "responsividade"], "qual decisão de design é expressa por uma utility e qual deve virar componente", "classes repetidas escondem um padrão de produto sem contrato visual", "um estado hover/focus/disabled e breakpoints em um componente reutilizado", "extrair padrões para primitives e manter os tokens no tema", "dedalo"),
  profile("Vite", "JavaScript", "tool", ["bundling", "módulos", "HMR", "ambientes"], "qual módulo será servido, transformado e empacotado em cada ambiente", "uma variável de ambiente ou dependência dinâmica entra no bundle errado e falha só no deploy", "build de produção, preview local, import dinâmico e variável pública/privada", "separar configuração do aplicativo e medir o artefato final", "dedalo"),
  profile("Vitest", "TypeScript", "tool", ["assertions", "mocks", "isolamento", "cobertura"], "qual comportamento observável o teste protege e qual dependência deve ser falsa", "um mock testa a própria implementação ou mascara uma integração quebrada", "unidade pura, integração curta, caso de borda e regressão reproduzida", "organizar fixtures por fronteira e usar contrato antes de snapshot", "ophis"),
  profile("PostgreSQL", "SQL", "stack", ["relacional", "transações", "índices", "queries"], "qual invariante precisa sobreviver a duas transações concorrentes", "uma consulta lenta ou atualização sem isolamento produz dados duplicados ou perdidos", "transação concorrente, constraint violada, plano de execução e rollback", "modelar chaves e constraints antes do ORM", "agora"),
  profile("MySQL", "SQL", "stack", ["InnoDB", "índices", "locking", "replicação"], "qual nível de isolamento e índice correspondem ao padrão de leitura e escrita", "um lock longo, collation ou índice ausente altera a consistência ou a latência", "consulta explicada, deadlock reproduzido, backup e restauração", "documentar transações no repositório e medir queries críticas", "agora"),
  profile("MariaDB", "SQL", "stack", ["SQL", "replicação", "procedures", "operação"], "como schema, engine e replicação preservam a mesma verdade entre nós", "uma diferença de versão ou configuração deixa réplica e primário divergirem", "migração reversível, failover ensaiado e verificação de checksum", "manter SQL portável e decisões de operação versionadas", "agora"),
  profile("Microsoft SQL Server", "SQL", "stack", ["T-SQL", "locking", "planos", "segurança"], "qual plano de consulta, permissão e transação materializam o contrato de negócio", "um plano instável ou privilégio excessivo torna desempenho e dados imprevisíveis", "execução parametrizada, role limitada, deadlock e auditoria", "encapsular acesso em procedimentos e monitorar regressões de plano", "agora"),
  profile("Supabase", "TypeScript", "tool", ["Postgres", "RLS", "auth", "realtime"], "qual política permite a ação certa sem expor uma linha de outro usuário", "uma regra de RLS ausente ou chave de serviço no cliente vaza dados", "usuário anônimo, usuário dono, usuário estranho e evento realtime", "centralizar políticas no banco e tratar o cliente como não confiável", "agora"),
  profile("Java", "Java", "stack", ["JVM", "tipos", "coleções", "concorrência"], "qual objeto possui o estado e qual thread tem permissão para alterá-lo", "mutabilidade compartilhada e exceções mal modeladas tornam o serviço impossível de evoluir", "testes de domínio, exceção esperada, coleção imutável e tarefa concorrente", "preferir composição, contratos pequenos e limites claros de infraestrutura", "agora"),
  profile("Spring Boot", "Java", "tool", ["DI", "HTTP", "JPA", "configuração"], "qual camada traduz uma requisição em regra de domínio sem vazar framework", "um controller vira lugar de regra, transação ou segredo e impede teste confiável", "endpoint válido/inválido, banco isolado, perfil de configuração e rollback", "usar portas/adaptadores e configuração externa tipada", "agora"),
  profile("C#", "C#", "stack", ["CLR", "tipos", "async", "LINQ"], "onde o recurso assíncrono é criado, aguardado e descartado", "uma tarefa não aguardada ou objeto descartável vaza trabalho e memória", "async cancelável, exceção agregada, disposição e consulta LINQ", "modelar serviços por interfaces e propagação explícita de cancelamento", "agora"),
  profile("C", "C", "stack", ["memória", "ponteiros", "ABI", "sistemas"], "quem aloca, quem possui e quem libera cada byte", "um limite de buffer ou ponteiro inválido corrompe memória antes de sinalizar a causa", "sanitizer, caso de borda de buffer, erro de alocação e código de retorno", "definir ownership no cabeçalho e reduzir superfícies mutáveis", "micenas"),
  profile("C++", "C++", "stack", ["RAII", "templates", "ownership", "concorrência"], "qual objeto controla a vida do recurso e qual garantia de exceção é oferecida", "ownership ambígua ou thread sem sincronização produz vazamento e data race", "destruição automática, exceção, move e teste sob sanitizer", "usar RAII, tipos de valor e interfaces de ownership explícitas", "micenas"),
  profile("Ruby", "Ruby", "stack", ["objetos", "blocos", "enumerables", "metaprogramação"], "qual mensagem é enviada e qual convenção de objeto a recebe", "uma abstração dinâmica oculta contrato e falha só com dado de produção", "objeto nulo, bloco sem retorno, exceção e teste de contrato", "manter metaprogramação nas bordas e objetos pequenos no núcleo", "agora"),
  profile("Ruby on Rails", "Ruby", "tool", ["MVC", "Active Record", "migrations", "jobs"], "qual regra pertence ao modelo, à transação ou ao fluxo HTTP", "callback implícito e query N+1 tornam a ação difícil de prever", "request, modelo, job, migração e autorização", "fazer regras explícitas em serviços e consultar com evidência", "agora"),
  profile("PHP", "PHP", "stack", ["HTTP", "tipos", "composer", "segurança"], "onde uma entrada HTTP deixa de ser texto não confiável e vira dado de domínio", "coerção frouxa, include ou saída sem escape tornam falha e ataque prováveis", "validação, encoding de saída, sessão e erro controlado", "usar strict types, autoload e limites de entrada/saída", "agora"),
  profile("Flask", "Python", "tool", ["rotas", "request", "contexto", "extensões"], "qual parte da requisição é validada antes de tocar a regra de negócio", "estado global de request ou configuração misturada com domínio falha sob concorrência", "cliente de teste, erro JSON, configuração por ambiente e transação", "usar application factory e serviços independentes do Flask", "agora"),
  profile("Vue.js", "TypeScript", "tool", ["reatividade", "componentes", "composables", "roteamento"], "qual dependência reativa recalcula o estado e qual é apenas derivada", "estado duplicado e efeito implícito deixam a tela fora de sincronia", "interação do usuário, prop emitida, composable isolado e rota", "compor por composables e manter uma fonte de verdade", "ophis"),
  profile("Git / GitHub", "Shell", "tool", ["histórico", "branches", "merge", "CI"], "qual mudança é atômica, revisável e reversível no histórico", "um merge sem base comum ou segredo versionado torna a correção cara", "branch curta, conflito resolvido, PR revisado e pipeline falhando", "usar commits como decisões documentadas e automação como portão", "dedalo"),
  profile("Docker", "Dockerfile", "tool", ["imagem", "containers", "redes", "volumes"], "qual processo, arquivo e porta realmente existem dentro do container", "imagem grande, segredo embutido ou volume mal definido diverge do ambiente esperado", "build limpo, container sem root, variável ausente e persistência reiniciada", "fixar imagens, separar build/runtime e declarar interfaces", "agora"),
  profile("Swagger", "OpenAPI", "tool", ["OpenAPI", "contratos", "schemas", "versionamento"], "qual consumidor depende do contrato e como uma mudança quebra compatibilidade", "documentação manual diverge da implementação e clientes aceitam dados inválidos", "schema válido, exemplo de erro, cliente gerado e mudança versionada", "tratar especificação como artefato de teste e revisão", "agora"),
  profile("Postman", "HTTP", "tool", ["coleções", "ambientes", "assertions", "automação"], "qual cenário de API a coleção prova e quais dados ela pressupõe", "token, ambiente ou estado compartilhado faz um teste passar localmente e falhar no CI", "coleção limpa, variável ausente, resposta de erro e execução no pipeline", "versionar coleções e separar dados de credenciais", "agora"),
  profile("Vercel", "TypeScript", "tool", ["deploy", "edge", "env", "observabilidade"], "onde a função roda, qual variável recebe e como cacheia uma resposta", "diferença entre preview e produção deixa rota, segredo ou cache inesperado", "preview isolado, rollback, log de função e variável de ambiente", "configurar entrega como código e manter domínio fora do provedor", "dedalo"),
  profile("Oracle Cloud", "Shell", "tool", ["IAM", "rede", "compute", "custos"], "qual identidade, rede e política autorizam o recurso solicitado", "uma regra de rede ampla ou credencial longa expõe infraestrutura e orçamento", "usuário sem privilégio, subnet isolada, alarme de custo e recuperação", "aplicar menor privilégio e infraestrutura declarativa", "agora"),
  profile("Ubuntu / Linux", "Shell", "stack", ["processos", "filesystem", "permissões", "rede"], "qual processo, arquivo, usuário e socket explicam o comportamento do sistema", "permissão ampla, serviço sem supervisão ou log perdido bloqueia o diagnóstico", "usuário limitado, processo reiniciado, porta ocupada e log filtrado", "tratar shell como código reproduzível e documentar operações", "micenas"),
  profile("N8N", "JavaScript", "tool", ["workflows", "webhooks", "credenciais", "idempotência"], "qual evento inicia o fluxo e como uma repetição deixa o mesmo resultado", "webhook repetido ou credencial exposta dispara uma ação duas vezes", "evento duplicado, falha parcial, retry e credencial rotacionada", "modelar fluxo como estados persistidos e ações idempotentes", "agora"),
  profile("Figma", "Design", "tool", ["componentes", "tokens", "prototipagem", "handoff"], "qual decisão visual é um token reutilizável e qual é específica da tela", "um componente sem variante e documentação cria divergência entre design e código", "contraste, variante, protótipo por teclado e inspeção de handoff", "manter biblioteca de componentes e critérios de aceitação junto ao design", "dedalo"),
  profile("Pacote Office", "Office", "tool", ["planilhas", "documentos", "apresentações", "automação"], "qual dado é fonte de verdade e como uma transformação continua auditável", "cópia manual e fórmula opaca produzem relatório inconsistente", "entrada errada, fórmula protegida, atualização de tabela e exportação", "usar tabelas estruturadas, validação e versão dos artefatos", "agora"),
  profile("Integração de IA (LLM)", "TypeScript", "tool", ["prompts", "contexto", "avaliação", "guardrails"], "qual decisão continua humana, qual evidência entra no contexto e como a saída é verificada", "alucinação, vazamento de dado ou ação irreversível é aceita como fato", "entrada adversarial, resposta citada, fallback e revisão humana", "tratar modelo como dependência probabilística com contratos e auditoria", "dedalo"),
  profile("Cursor", "TypeScript", "tool", ["contexto", "edição", "diff", "revisão"], "qual contexto mínimo permite uma mudança verificável sem delegar a decisão", "uma edição ampla aceita sem diff ou testes cria regressão silenciosa", "pedido pequeno, diff revisado, testes falhando e reversão", "usar a ferramenta para acelerar ciclos, nunca para substituir especificação", "dedalo"),
  profile("Claude Code", "Shell", "tool", ["agentes", "ferramentas", "planos", "verificação"], "qual objetivo, limitação e evidência definem que uma tarefa está realmente pronta", "um agente muda escopo, escreve sem testar ou conclui baseado em aparência", "plano, alteração mínima, teste de regressão e status honesto", "dividir trabalho em unidades verificáveis e preservar aprovação humana", "dedalo"),
  profile("GitHub Copilot", "TypeScript", "tool", ["sugestões", "contexto", "testes", "licenças"], "qual sugestão é sustentada pelo contrato do projeto e não apenas plausível", "código aceito por autocompletar viola segurança, estilo ou licença", "caso de borda, lint, teste de integração e revisão de dependência", "usar sugestões como hipótese a ser provada no repositório", "dedalo"),
  profile("OpenCode", "Shell", "tool", ["agentes", "contexto", "execução", "revisão"], "qual ferramenta pode alterar estado e qual evidência deve retornar para a pessoa", "automação sem escopo toca arquivos ou serviços fora do pedido", "sandbox, diff delimitado, teste e registro de decisão", "dar a cada agente autoridade mínima e critérios objetivos", "dedalo"),
  profile("Lovable", "TypeScript", "tool", ["prototipagem", "UI", "dados", "iterações"], "qual requisito do produto ainda precisa de modelo de dados e teste além da tela", "um protótipo convincente não preserva invariantes, permissão ou estados de erro", "fluxo feliz, vazio, erro, autorização e responsividade", "usar protótipo como hipótese e consolidar decisões no código", "dedalo"),
  profile("Google AI Studio", "TypeScript", "tool", ["modelos", "prompts", "safety", "evals"], "como o comportamento do modelo é medido com exemplos representativos", "prompt de demonstração passa, mas casos reais falham, vazam ou custam demais", "conjunto de avaliação, entrada hostil, latência e fallback", "versionar prompt, avaliação e política de segurança", "dedalo"),
  profile("jQuery", "JavaScript", "stack", ["seletores", "eventos", "DOM", "legado"], "qual nó do DOM representa o estado e como evitar múltiplas fontes de verdade", "manipulação incremental conflita com outro renderizador ou listener duplicado", "evento delegado, elemento ausente, formulário e teardown", "isolar código legado e migrar por fronteiras observáveis", "ophis"),
  profile("Chiron", "TypeScript", "tool", ["apostilas", "SRS", "mapas", "labs"], "qual dado de estudo, invariante e progresso precisam sobreviver entre páginas", "conteúdo raso ou estado duplicado faz dashboard, mapa e revisão discordarem", "seed completo, migração de schema, card vencido e lab integrado", "tratar cada fonte como currículo versionado e cada mudança como migração", "dedalo"),
  profile("Olympus", "TypeScript", "tool", ["suite", "design system", "auth", "integração"], "qual contrato é comum à suíte e qual particularidade deve continuar isolada no app", "um atalho entre apps replica estado, tema ou autenticação de modo inconsistente", "tema, sessão, navegação, falha de backend e compatibilidade entre apps", "compartilhar contratos estáveis e deixar domínios proprietários locais", "dedalo"),
];
