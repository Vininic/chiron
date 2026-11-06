import type { ContentCard, ContentExercise } from "./types";

const ex = (nodeTitle: string, type: 1 | 2 | 3, level: ContentExercise["level"], points: number, promptMd: string, answerKeyMd: string): ContentExercise => ({
  nodeTitle, type, level, points,
  promptMd: `${promptMd} Entregue a decisão, as invariantes observáveis e pelo menos um caso adverso reproduzível; uma captura visual isolada não conta como prova.`,
  answerKeyMd,
});
const card = (nodeTitle: string, frontMd: string, backMd: string): ContentCard => ({ nodeTitle, frontMd, backMd });

const parser = "Parser, documento e árvore DOM";
const semantics = "Semântica, headings e landmarks";
const links = "Links, navegação e relações";
const media = "Imagens, áudio e vídeo";
const forms = "Formulários e controles nativos";
const validation = "Validação, erros e submissão";
const tables = "Tabelas e dados estruturados";
const metadata = "Metadata, descoberta e documentos sociais";
const accessibility = "Acessibilidade além do básico";
const security = "Performance, recursos e segurança";
const testing = "Testes, validação e manutenção";
const project = "Projeto integrador: documento de aprendizagem";

export const HTML_EXERCISES: ContentExercise[] = [
  ex(parser, 1, "beginner", 10, "Receba um fragmento com p aninhado, li fora da lista e tabela incompleta. Compare source, tokens e DOM produzido pelo browser, identificando quais elementos foram fechados, inseridos ou reparentados e por que o CSS não prova a árvore.", "A resposta usa parser HTML real, registra DOM final, explica autocorreção/content model e corrige o source em vez de depender da tolerância visual."),
  ex(parser, 2, "intermediate", 20, "Monte documento completo com doctype, lang, charset, title, viewport, head e body. Sirva com Content-Type incompatível de propósito, inclua acentos/emoji e demonstre qual declaração determina decodificação e como o erro aparece no HTML inicial.", "O documento é UTF-8 coerente nos bytes/header/meta, charset aparece cedo, title/lang existem e o teste captura resposta e parse sem depender de hydration."),
  ex(parser, 3, "advanced", 30, "Audite uma página SSR que hidrata com ids e nesting diferentes. Localize a primeira divergência entre source, DOM e árvore do cliente, remova suppressions e crie um gate que impeça reparenting e ids instáveis em duas instâncias.", "A solução torna geração determinística, valida DOM pós-parse e hidratação, cobre componentes repetidos e conserva ids/referências sem esconder warnings."),

  ex(semantics, 1, "beginner", 10, "Reestruture uma página composta somente de divs em header, nav, main, article, sections e footer. Produza outline de headings e lista de landmarks antes/depois, justificando cada elemento pelo papel e não pela aparência.", "Há um main, landmarks necessários e nomeados quando repetidos, headings sem saltos cosméticos e ordem textual compreensível sem CSS."),
  ex(semantics, 2, "intermediate", 20, "Modele cards de cursos, breadcrumb e navegações principal/secundária. Garanta links nomeados, aria-current correto e artigos/sections com headings; teste lista de links e regiões num leitor sem duplicar informação por ARIA.", "Elementos nativos fornecem relações, navs repetidas têm nomes, current representa a página/etapa correta e ações repetidas incluem entidade no nome."),
  ex(semantics, 3, "advanced", 30, "Compare o outline de uma aula com slots, portals e widgets assíncronos em SSR e após hidratação. Corrija headings dependentes de tamanho visual e prove que carregamento/erro não altera a hierarquia ou cria landmarks vazios.", "A hierarquia vem do conteúdo, fallbacks possuem estrutura proporcional, portals não quebram nomes/relações e testes percorrem estados inicial, loading, erro e sucesso."),

  ex(links, 1, "beginner", 10, "Classifique destinos de uma interface entre link, button e form submit. Corrija anchors sem href, divs clicáveis e buttons usados para URL, então percorra por teclado e abra os destinos em nova aba quando fizer sentido.", "Navegação usa href real, comandos usam button/form, nomes descrevem destino e comportamento de teclado/context menu funciona sem handlers paralelos."),
  ex(links, 2, "intermediate", 20, "Implemente filtros GET canônicos e links fragmento para um índice. Preserve parâmetros compatíveis, reinicie paginação quando necessário e prove reload, bookmark, back/forward, foco no fragmento e funcionamento sem JavaScript.", "URL reproduz estado allowlisted, links têm fragments existentes, history é previsível, foco/scroll mostram destino e GET não causa mutation."),
  ex(links, 3, "advanced", 30, "Audite redirects, returnTo e links externos de uma área autenticada. Injete esquemas javascript, Host malicioso, URL protocol-relative e open redirect; modele allowlist de origem/path e referrer/opener adequados.", "URLs são parseadas, esquemas/origens limitados, returnTo interno normalizado, canonical não usa Host bruto e links externos não ganham autoridade indevida."),

  ex(media, 1, "beginner", 10, "Para capa decorativa, certificado informativo e gráfico com valores, escreva alt apropriado e explique quando usar vazio, descrição curta, caption ou tabela alternativa. Teste a leitura sem imagens e sem CSS.", "Cada alternativa reproduz a função, não o filename; decoração tem alt vazio, informação essencial é recuperável e texto próximo não é duplicado."),
  ex(media, 2, "intermediate", 20, "Crie imagem responsiva com width/height, srcset, sizes e art direction. Em três viewports e dois DPRs, registre currentSrc, bytes, dimensões e CLS, removendo candidatos nunca escolhidos.", "Sizes corresponde ao layout, img fallback possui alt/geometria, crops preservam conteúdo e a tabela de medições justifica candidates e prioridade."),
  ex(media, 3, "advanced", 30, "Entregue vídeo de aula com sources, poster, captions, transcript e fallback. Force 404/CORS no track, rede limitada, teclado, reduced motion e bloqueio do fornecedor, demonstrando publicação e monitoramento das alternativas.", "Controls nativos, captions sincronizadas, transcript equivalente, preload proporcional, asset manifest e alerta de track impedem release incompleto."),

  ex(forms, 1, "beginner", 10, "Implemente busca GET e edição POST usando labels, names e buttons tipados. Inspecione URL ou FormData com checkbox ausente, múltiplos valores, Enter e submitters diferentes, explicando successful controls.", "Métodos/intenção concordam, controles têm nomes/relações, payload real cobre cardinalidade e o baseline funciona sem JavaScript."),
  ex(forms, 2, "intermediate", 20, "Projete cadastro com fieldset/legend, helpers, radios, password e autocomplete. Renderize duas instâncias, pseudo-localize e gere tabela controle→name→description→group→constraint, detectando ids duplicados.", "Labels e grupos são programáticos, tokens autocomplete/type seguem domínio, ids são estáveis por instância e instruções precedem erro sem ARIA divergente."),
  ex(forms, 3, "advanced", 30, "Implemente upload de capa com picker, drag opcional, preview e lifecycle de quarentena. Envie MIME/extensão/tamanho falsos, tente acesso por outro tenant e repita upload após resposta perdida.", "Accept é hint, servidor limita/detecta/autoriza, object URL é revogada, estados não prometem publicação e idempotência evita assets duplicados."),

  ex(validation, 1, "beginner", 10, "Aplique constraints a título, slug e datas; mapeie cada ValidityState a uma mensagem e código servidor. Remova atributos e envie HTTP manual, comprovando que a mesma regra autoritativa rejeita.", "Constraints melhoram feedback, customError é limpo após edição, servidor repete regras/códigos e relação entre datas não depende do browser."),
  ex(validation, 2, "intermediate", 20, "Crie resumo de quatro erros com links, mensagens inline e preservação de valores. Teste foco, name/description/invalid, correção incremental, locale longo, zoom e erro global retornado apenas pelo servidor.", "Resumo focável e relações válidas guiam recuperação, alerts não cacofônicos, valores seguros permanecem e conflito global não é atribuído ao campo errado."),
  ex(validation, 3, "advanced", 30, "Modele pending, sucesso, timeout após commit e dialog de exclusão. Repita command por clique, Enter e outra aba; remova o invocador ao concluir e prove idempotência, retorno de foco e página fallback sem JS.", "Command id/constraint garante um efeito, status é anunciado, resultado incerto é consultado, dialog tem foco/escape e fallback reautoriza a ação."),

  ex(tables, 1, "beginner", 10, "Modele horas por curso/período como table com caption, scope e unidades. Inclua zero, ausente e ação por linha; remova CSS e faça cada valor recuperar ambos os eixos e contexto da ação.", "Th/td expressam matriz, ausência difere de zero, links/buttons incluem entidade e caption/cabeçalhos tornam leitura independente de posição visual."),
  ex(tables, 2, "intermediate", 20, "Construa cabeçalho trimestral multinível usando spans/scopes ou ids/headers. Escreva sequência esperada para três células, remova uma coluna por flag e valide automaticamente spans, ids e referências.", "Hierarquia permanece consistente em todas variantes, associações são explícitas e testadas, ids estáveis e decomposição simples é considerada quando superior."),
  ex(tables, 3, "advanced", 30, "Implemente tabela responsiva e ordenável por número, data e texto localizado. Preserve DOM order, aria-sort, foco, URL, paginação e export; force resposta antiga e tentativa de coluna SQL arbitrária.", "Wrapper/overflow preserva semântica, comparadores usam valores brutos/collator, servidor allowlista sort e todas representações concordam sem vazamento."),

  ex(metadata, 1, "beginner", 10, "Produza head completo para catálogo, curso, busca, privado e 404 em dois idiomas. Compare source inicial, headers e abas, procurando duplicatas e qualquer canário privado em title, description ou assets.", "Cada rota tem identidade segura/específica, charset/viewport/lang coerentes, privado usa fallback e o teste não depende de atualização client-side."),
  ex(metadata, 2, "intermediate", 20, "Defina canonical, redirects, robots, hreflang e sitemap para slugs antigos, filtros e pt-BR/en. Construa crawler que valide status, origem configurada, reciprocidade, lastmod e ausência de drafts.", "Redirects/canonicals/alternates/sitemap concordam, Host não é confiado, noindex não substitui auth e datas refletem mudança real."),
  ex(metadata, 3, "advanced", 30, "Gere Open Graph e JSON-LD Course a partir do DTO público. Injete título que fecha script, locale longo e draft; valide imagem, escape, proveniência visível e invalidação após preço/publicação mudar.", "Serialização neutraliza contexto HTML, assets são públicos/versionados, claims correspondem ao DOM, cache é invalidado em conjunto e nenhum dado privado aparece."),

  ex(accessibility, 1, "beginner", 10, "Compare details/summary, button disclosure e div role=button. Liste role, name, state, foco e teclas de cada opção e escolha a menor implementação que satisfaz a tarefa sem ARIA redundante.", "A escolha favorece nativo, custom sincroniza expanded/hidden e teclado, aria-hidden não contém foco e justificativa vem do padrão de interação."),
  ex(accessibility, 2, "intermediate", 20, "Audite três cards com ações repetidas, helpers e estados. Inspecione accessible name/description/state, label-in-name e ids em duas instâncias, depois opere tudo por voz e leitor.", "Ações incluem entidade, texto visível está no nome, descrições não substituem labels, referências resolvem e tradução não altera identidade técnica."),
  ex(accessibility, 3, "advanced", 30, "Trace foco numa SPA por skip, rota, dialog, erro e exclusão do invocador. Teste 400%, forced colors, reduced motion e conteúdo async, modelando destino/fallback sem timeouts ou tabindex positivo.", "DOM order é lógico, foco visível vai ao novo contexto apenas quando necessário, retorna/fallback funciona e hidden/inert nunca contém ativo."),

  ex(security, 1, "beginner", 10, "Capture waterfall mobile frio e classifique CSS, font, hero, script e terceiro. Justifique defer/async, preload e preconnect removendo cada hint para medir reutilização, bytes e LCP.", "HTML expõe recursos cedo, poucos hints comprovados têm as/crossorigin corretos, terceiros aguardam consentimento e budgets incluem CPU e rede."),
  ex(security, 2, "intermediate", 20, "Aplique CSP em report-only e depois enforcement com nonce por resposta, base/object/frame/connect mínimos. Force cache com nonce antigo, inline handler e script injetado, validando reports redigidos.", "Nonce é aleatório/coordenado, policy cobre erros/CDN, unsafe-inline não é usado, violações não vazam queries e rollback é controlado."),
  ex(security, 3, "advanced", 30, "Faça taint map de título, URL, Markdown, JSON-LD, upload e postMessage até sinks. Injete corpus contextual, iframe de origem falsa e URL interna, usando escape, sanitizer, Trusted Types, sandbox e allowlists.", "Cada gramática recebe defesa própria, texto não vira markup, protocolos/origens são limitados, messages validam origin/schema e frame tem capacidades mínimas."),

  ex(testing, 1, "beginner", 10, "Crie checker que parseia snippets e documentos e verifica ids, labels/ARIA, anchors, alt, button type e metadata mínima. Injete um mutante por regra e mostre diagnóstico localizado no capítulo/seção.", "Checker usa parser, não regex; mutantes falham especificamente, fragments/documentos são classificados e exceções permanecem estreitas e justificadas."),
  ex(testing, 2, "intermediate", 20, "Escreva testes por role/name para busca, form, dialog e tabela, distribuindo DOM, integração e E2E. Troque button por div, remova href/label e inverta resposta assíncrona.", "Queries públicas detectam mutantes, payload/foco/URL são observados, browser real cobre defaults e nenhum sleep ou seletor estrutural mascara corrida."),
  ex(testing, 3, "advanced", 30, "Monte matriz de auditoria e evolução para rota/estado/mecanismo, incluindo locale RTL, CMS, asset trocado, slug migrado e canário pós-deploy. Execute dry run e restore/rollback.", "Gates combinam validator, a11y manual/automática e canário; migração é idempotente/reversível, conteúdo/assets/head versionam juntos e issues têm owner."),

  ex(project, 1, "beginner", 10, "Entregue walking skeleton da aula Dédalo com head, landmarks, índice, conteúdo, mídia alternativa, tabela, form e navegação. Demonstre leitura e conclusão com CSS e JavaScript desligados.", "Documento possui estrutura/URLs/protocolo completos, headings e relações válidas, mídia alternativa e POST/redirect funcionam antes de enhancement."),
  ex(project, 2, "intermediate", 20, "Implemente exercício com draft versionado, submit idempotente, resumo de erros e feedback. Force duas abas, sessão expirada, resposta perdida e campos score/actor forjados sem perder o texto.", "Servidor deriva autoridade/pontuação, usa versão/command id, preserva dados e reconcilia resultado; foco/status e baseline no-JS permanecem corretos."),
  ex(project, 3, "advanced", 30, "Execute o Lab `html-dom-accessibility-tree` em build produção com falhas de CDN, track, terceiro, XSS, locale, viewport e timeout. Anexe DOM/AOM, traces, crawler, manifest, CSP, canário e rollback ligados ao commit.", "A banca é reproduzível por terceiro, todos gates críticos passam sem reduzir limiar, limitações têm impacto/owner/prazo e cenários entram no pipeline."),
];

export const HTML_CARDS: ContentCard[] = [
  card(parser, "Por que HTML visualmente correto pode ter DOM errado?", "Porque o parser autocorrige content models, fecha, insere e reparenta elementos; inspecione a árvore produzida."),
  card(parser, "O que o doctype moderno evita?", "O modo quirks; `<!doctype html>` pede o modo de padrões interoperável."),
  card(parser, "Onde charset deve ser coerente?", "Nos bytes gerados, no Content-Type HTTP e na meta precoce do documento."),
  card(parser, "Source e DOM são sempre iguais?", "Não. O DOM é resultado do algoritmo de parsing e pode conter estrutura implícita ou reorganizada."),
  card(semantics, "Quando uma section merece heading?", "Quando representa uma região temática nomeável; caso contrário um container neutro pode ser mais fiel."),
  card(semantics, "Quantos main um documento deve expor?", "Um main ativo representando o conteúdo principal daquela página."),
  card(semantics, "ARIA corrige heading escolhido por tamanho?", "Não. A hierarquia vem do conteúdo; estilo visual é independente."),
  card(semantics, "Por que nomear navs repetidas?", "Para que a lista de landmarks diferencie navegação principal, curso, conta e outras."),
  card(links, "Link ou button para trocar de URL?", "Link com href real; button é para comando no contexto atual."),
  card(links, "Por que filtros GET pertencem à URL?", "Para reload, bookmark, compartilhamento, histórico, cache e no-JS reproduzirem a visão."),
  card(links, "Fragmento válido basta para boa navegação?", "Não; o destino também precisa ser perceptível, não ficar coberto e receber foco quando apropriado."),
  card(links, "Como evitar open redirect em returnTo?", "Parsear e permitir apenas paths/origens explicitamente confiáveis, nunca concatenar o valor recebido."),
  card(media, "Quando uma imagem usa alt vazio?", "Quando é realmente decorativa ou seu conteúdo já é fornecido pelo mesmo controle/texto adjacente."),
  card(media, "O que `sizes` informa?", "A largura CSS esperada nos breakpoints para o browser escolher candidato antes do layout completo."),
  card(media, "Lazy loading cabe no hero LCP?", "Normalmente não; o recurso principal deve ser descoberto cedo e priorizado com medição."),
  card(media, "Transcript substitui captions?", "Não em vídeo: transcript é alternativa pesquisável; captions preservam fala e sons sincronizados."),
  card(forms, "O que torna um controle successful?", "Ter name, pertencer ao form, não estar disabled e satisfazer regras de tipo/estado na submissão."),
  card(forms, "Hidden input é confiável?", "Não. É observável e editável; identidade, preço, tenant e autorização vêm do servidor."),
  card(forms, "Type number serve para CEP?", "Não: CEP é identificador textual com zeros; use text e inputmode numeric como conveniência."),
  card(forms, "Accept valida upload?", "Não. Só sugere filtros ao picker; servidor verifica tamanho, tipo, conteúdo, storage e acesso."),
  card(validation, "checkValidity e reportValidity diferem como?", "Ambos avaliam; reportValidity também solicita a UI de feedback do browser."),
  card(validation, "Como limpar customError?", "Chame setCustomValidity com string vazia quando o valor/regra deixar de falhar."),
  card(validation, "Button disabled impede duplicação real?", "Não. Apenas reduz ativação local; idempotency key e constraint tratam retries, abas e resposta perdida."),
  card(validation, "Confirmação autoriza ação?", "Não. O servidor reautentica, reautoriza e valida versão/command no momento do efeito."),
  card(tables, "Quando table é a estrutura correta?", "Quando a interseção de cabeçalhos de linha e coluna dá significado às células."),
  card(tables, "Bold transforma td em cabeçalho?", "Não. Use th e scope ou associações ids/headers conforme a matriz."),
  card(tables, "Como adaptar tabela estreita?", "Preserve a matriz com overflow descobrível ou ofereça uma visão alternativa deliberada e completa."),
  card(tables, "Onde fica aria-sort?", "No th da coluna atualmente ordenada; um button dentro do cabeçalho aciona a mudança."),
  card(metadata, "Title e h1 precisam ser idênticos?", "Não, mas devem concordar sobre a identidade; title também orienta abas, histórico e resultados."),
  card(metadata, "Canonical é redirect?", "Não. É sinal de URL preferida; mudança de endereço para agentes exige redirect apropriado."),
  card(metadata, "Noindex protege um draft?", "Não. Conteúdo privado exige autenticação/autorização e cache seguro antes da resposta."),
  card(metadata, "JSON-LD pode interpolar JSON cru em script?", "Não sem neutralizar o contexto HTML, inclusive a sequência de fechamento `</script>`."),
  card(accessibility, "O que ARIA não adiciona?", "Comportamento, foco ou aparência; apenas expõe/modifica semântica e estados na árvore acessível."),
  card(accessibility, "aria-label pode piorar um botão?", "Sim, se sobrescrever texto visível específico e quebrar label-in-name ou voice control."),
  card(accessibility, "Por que evitar tabindex positivo?", "Ele cria ordem paralela frágil, divergente do DOM e da leitura visual."),
  card(accessibility, "Menu e disclosure são equivalentes?", "Não. Menu possui modelo de comandos/teclas; navegação dropdown costuma ser disclosure com links normais."),
  card(security, "Preload é sempre melhoria?", "Não. URL/as/crossorigin incorretos duplicam download; preload não usado compete com recursos críticos."),
  card(security, "Nonce CSP pode ser constante?", "Não. Precisa valor imprevisível por resposta e coordenação entre header e elementos autorizados."),
  card(security, "Escape HTML torna qualquer href seguro?", "Não. URL também exige parsing e allowlist de esquema/origem/path conforme o destino."),
  card(security, "sandbox e Permissions Policy resolvem o mesmo risco?", "Não. Sandbox restringe o documento; Permissions Policy controla acesso a capacidades como câmera e fullscreen."),
  card(testing, "Por que validator não basta?", "Ele encontra sintaxe/content models, mas não julga qualidade de nomes, foco, alternativas e tarefas completas."),
  card(testing, "Qual query de teste é mais resiliente?", "Role e accessible name/label observados pelo usuário, não classe ou hierarquia interna."),
  card(testing, "Zero violations automáticas prova acessibilidade?", "Não. Teclado, leitor, zoom, conteúdo e tarefas exigem auditoria manual e julgamento."),
  card(testing, "Migração de conteúdo precisa rollback?", "Sim: dry run, idempotência, amostra, backup testado e plano para URLs, assets e caches."),
  card(project, "Qual é o baseline da aula Dédalo?", "Documento semântico, navegável, legível e submetível por URL direta mesmo sem CSS ou JavaScript."),
  card(project, "O que liga draft concorrente ao servidor?", "Actor, exercise id, expected version, command id e uma resposta de conflito recuperável."),
  card(project, "O que o lab compara?", "Source HTML, DOM produzido pelo parser e accessibility tree consumida por tecnologias assistivas."),
  card(project, "Quando o projeto está entregue?", "Quando a banca reproduz estrutura, conteúdo, a11y, segurança, performance, operação e rollback no build ligado ao commit."),
];
