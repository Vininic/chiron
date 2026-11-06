export type SwaggerLevel = "basico" | "intermediario" | "avancado";
export type SwaggerLesson = readonly [title: string, thesis: string, mechanism: string, incident: string];
export type SwaggerChapter = readonly [title: string, level: SwaggerLevel, primer: string, lessons: readonly SwaggerLesson[]];

/** OpenAPI-first curriculum; tool versions and executable validators are fixed by verification gates. */
export const SWAGGER_CURRICULUM: readonly SwaggerChapter[] = [
  ["Contrato HTTP e ecossistema OpenAPI", "basico", "Swagger é um conjunto de ferramentas; OpenAPI é o contrato versionado que precisa corresponder ao comportamento HTTP.", [
    ["Swagger, OpenAPI e fronteiras", "a especificação descreve a interface observável e não implementa autenticação, transação ou disponibilidade", "OpenAPI Specification, Swagger UI/Editor, generators, linters e runtime", "documentação visual verde foi aceita como prova de autorização e consistência"],
    ["Documento raiz, versões e dialetos", "openapi, info, servers, paths, components, security e tags formam um documento com versão e dialeto explícitos", "OpenAPI 3.0/3.1/3.2, $self, JSON Schema dialect, jsonSchemaDialect e extensions", "keyword de versão nova foi interpretada por ferramenta antiga e validação divergiu"],
    ["YAML, JSON e resolução", "representação, anchors e referências precisam produzir um modelo resolvido determinístico sem valores ambíguos", "YAML scalars, JSON, anchors, aliases, $ref, URI e base document", "boolean/data YAML implícito mudou tipo e cliente gerado quebrou"],
    ["Design-first, code-first e fonte de verdade", "workflow escolhe autoridade e reconcilia spec, implementação, testes e consumers em cada mudança", "design-first, annotations, reflection, generated spec, overlays e drift gates", "spec manual e routes reais evoluíram separadamente"],
  ]],
  ["Paths e operações HTTP", "basico", "Cada operação fecha método, rota, identidade, parâmetros, corpo, respostas e efeitos segundo semântica HTTP.", [
    ["Paths, templates e operationId", "paths não podem ser ambíguos e operationId estável identifica a operação para tooling e clientes", "path templating, concrete paths, operationId, tags e summary", "duas rotas equivalentes geraram métodos conflitantes no SDK"],
    ["Métodos seguros e idempotentes", "GET/HEAD/OPTIONS são seguros e PUT/DELETE idempotentes por contrato, enquanto POST exige idempotência explícita quando repetível", "HTTP semantics, idempotency key, retries, conditional requests e 202", "retry de POST após timeout criou duas reservas"],
    ["Status codes e outcomes", "cada outcome de domínio mapeia para status e body documentados, incluindo erro, conflito, ausência e estado desconhecido", "2xx, 3xx, 4xx, 5xx, default, problem details e response ranges", "API devolveu 200 com erro no body e consumer confirmou operação falha"],
    ["Headers e negociação", "Content-Type, Accept, Location, Retry-After, ETag e headers próprios têm schemas e semântica observável", "request/response headers, media types, content negotiation e links", "cliente ignorou Retry-After e amplificou indisponibilidade"],
  ]],
  ["Parâmetros e serialização", "basico", "Parâmetros são diferenciados por localização, requiredness, estilo e explode; parsing real precisa corresponder ao schema.", [
    ["Path, query, header e cookie", "in e name definem identidade do parâmetro e path parameters são sempre obrigatórios", "Parameter Object, required, deprecated, allowEmptyValue e case", "tenant enviado no query sobrescreveu identidade autenticada"],
    ["style, explode e allowReserved", "serialização de arrays e objetos varia por localização e precisa de fixtures de wire format", "form, simple, matrix, label, spaceDelimited, pipeDelimited e deepObject", "SDK enviou filtro complexo em forma diferente do servidor"],
    ["Coerção, limites e Unicode", "schema de parâmetro define tipo/faixa/formato, mas parser precisa rejeitar coerção ambígua e excesso", "min/max, pattern, format, maxLength, percent encoding e duplicate keys", "string false virou boolean true e paginação sem limite esgotou memória"],
    ["Parâmetros reutilizáveis", "components reduz repetição sem permitir overrides invisíveis ou referências com siblings incompatíveis", "components.parameters, $ref, examples e local override", "header de idempotência divergiu entre operações copiadas"],
  ]],
  ["Corpos, media types e arquivos", "basico", "RequestBody e content descrevem bytes, schema e exemplos por media type, com limites e parsing compatíveis.", [
    ["RequestBody e JSON", "required, content e schema distinguem corpo ausente, null, objeto vazio e campos obrigatórios", "requestBody, application/json, required, nullable/type null e validation", "corpo ausente foi convertido em defaults privilegiados"],
    ["Form URL encoded", "form fields usam encoding e serialização próprias e não são JSON disfarçado", "application/x-www-form-urlencoded, Encoding Object, style e explode", "array de permissões foi interpretado como uma string única"],
    ["Multipart e upload", "multipart descreve partes, content types, nomes, tamanhos e ownership sem embutir arquivos enormes", "multipart/form-data, binary/string, encoding headers e limits", "upload sem limite encheu disco e arquivo cruzou tenant"],
    ["Downloads e streaming", "responses binárias ou streaming declaram media type, headers e limites sem prometer buffering incompatível", "application/octet-stream, content-disposition, ranges, SSE e streaming gaps", "SDK tentou parsear arquivo como JSON e reteve tudo em memória"],
  ]],
  ["JSON Schema no OpenAPI", "intermediario", "Schemas modelam formas e invariantes sintáticas dentro do dialeto, sem substituir regras de domínio ou autorização.", [
    ["Tipos, required e null", "required pertence ao objeto e ausência difere de null, zero e string vazia", "type, properties, required, null, default, readOnly e writeOnly", "campo ausente recebeu null e apagou dado em PATCH"],
    ["Composição", "allOf, anyOf, oneOf e not têm lógica precisa e não representam herança nominal automaticamente", "composition, evaluation, unevaluatedProperties e conflict", "allOf com propriedades fechadas tornou payload impossível"],
    ["Polimorfismo e discriminator", "union precisa ser disjunta ou validada de modo previsível e discriminator não corrige schemas sobrepostos", "oneOf, discriminator, mapping, const e tagged unions", "payload validou em dois branches e generator escolheu tipo errado"],
    ["Restrições e formatos", "constraints e formats só valem quando o validator as implementa e recursos são limitados", "pattern, numeric bounds, arrays, uniqueItems, format assertion e regex safety", "format email foi tratado como verificado embora validator só anotasse"],
  ]],
  ["Referências, modularização e bundles", "intermediario", "Specs modulares precisam resolução URI correta, ciclo controlado e artifact bundle reproduzível.", [
    ["$ref e identidade de URI", "$ref resolve URI e fragmento a partir da base correta; path de filesystem não é regra universal", "$id, anchors, JSON Pointer, relative/absolute refs e base URI", "bundle resolveu schema homônimo do diretório errado"],
    ["Ciclos e grafos", "recursão de dados pode ser válida, mas ciclos de módulos/tooling precisam limite e teste", "recursive schemas, circular refs, dereference e lazy resolution", "generator entrou em recursão infinita ao expandir árvore"],
    ["Split, bundle e dereference", "split melhora ownership e bundle preserva semântica; dereference pode explodir tamanho ou perder identidade", "multi-file layout, bundling, dereferencing e canonical artifact", "spec publicada omitiu arquivo externo não empacotado"],
    ["Vendoring e dependências", "schemas externos são dependências pinadas com licença, integridade e atualização deliberada", "remote refs, registry, checksums, offline build e supply chain", "ref HTTP mutável mudou contrato sem commit"],
  ]],
  ["Responses, erros e callbacks", "intermediario", "Respostas, errors e interações assíncronas precisam contratos completos e correlacionáveis.", [
    ["Response Object e headers", "cada resposta define description, content, headers e links relevantes para o outcome", "responses, content, headers, links e reusable responses", "409 não documentado fez SDK tratar conflito como exceção desconhecida"],
    ["Problem Details e taxonomia", "erro possui type/code/status/detail seguros, correlation e field issues limitados", "RFC problem details, error schemas, trace ID e retryability", "erro ecoou payload e vazou segredo"],
    ["Callbacks", "callback expression liga URL fornecida/derivada a operação reversa e exige SSRF, auth e lifecycle", "Callback Object, runtime expressions, callback paths e security", "servidor chamou URL arbitrária interna fornecida pelo cliente"],
    ["Webhooks", "webhooks publicados têm assinatura, replay defense, versionamento, retry e idempotência próprios", "top-level webhooks, signatures, timestamps, event IDs e delivery attempts", "replay do webhook aplicou o mesmo pagamento duas vezes"],
  ]],
  ["Segurança e identidade", "intermediario", "Security schemes documentam credenciais; enforcement, scopes e tenant isolation precisam implementação e testes reais.", [
    ["API keys, Basic e Bearer", "cada scheme declara transporte e formato sem colocar credencial em exemplo ou query insegura", "securitySchemes, apiKey, http basic/bearer, headers e TLS", "token apareceu em URL, log e cache intermediário"],
    ["OAuth 2.0 e OIDC", "flows, URLs e scopes documentados precisam corresponder ao issuer e audience validados", "authorizationCode, clientCredentials, PKCE, openIdConnectUrl e scopes", "API aceitou token de issuer ou audience errados"],
    ["Security requirements", "listas e objetos expressam OR e AND precisamente em nível global/operação", "Security Requirement Object, overrides, anonymous operation e scope sets", "combinação OR liberou endpoint que exigia dois fatores"],
    ["Autorização, tenancy e dados", "spec revela requirements e respostas, mas policy e filtro tenant são provados por principals reais", "RBAC/ABAC, object ownership, 401/403/404, field filtering e negative tests", "documentação dizia admin-only enquanto handler não verificava role"],
  ]],
  ["Exemplos, documentação e UX", "intermediario", "Documentação é produto testado: examples válidos, navegação acessível e try-it-out seguro sem expor ambientes.", [
    ["Examples e fixtures", "example/examples devem validar contra schema e representar sucesso, limites e erros sem PII/segredos", "Example Object, externalValue, schema examples e fixture generation", "exemplo inválido ensinou campo removido e quebrou onboarding"],
    ["Descriptions e Markdown", "descrições explicam semântica, invariantes, retry e deprecation sem depender de HTML inseguro", "CommonMark, links, code, sanitization e localization", "HTML na descrição executou script na UI de documentação"],
    ["Swagger UI e try-it-out", "UI é consumidor privilegiado configurado com endpoints, CORS, OAuth e persistência de auth seguros", "Swagger UI config, presets, requestInterceptor, OAuth redirect e CSP", "try-it-out de produção ficou aberto com token persistido no browser"],
    ["Portais e descoberta", "catálogo, version selector, search e ownership ajudam consumers a achar o contrato correto", "API portals, tags, x-metadata, changelog, contact e lifecycle", "consumer implementou versão obsoleta porque portal ocultou deprecation"],
  ]],
  ["Lint, validação e qualidade", "avancado", "Validação sintática, lint organizacional e testes comportamentais são gates distintos e complementares.", [
    ["Parsing e validação estrutural", "parser valida documento e referências no dialeto certo, mas não prova servidor", "OpenAPI validators, JSON Schema meta-validation, bundle e diagnostics", "spec válida descrevia rota inexistente"],
    ["Style guides e Spectral", "rulesets codificam convenções versionadas com severidade, exceptions e mutants", "Spectral rules, custom functions, formats, overrides e CI", "warning crítico foi silenciado globalmente para liberar merge"],
    ["Contract tests de requests e responses", "proxy/test harness valida tráfego real contra operação e schema incluindo casos negativos", "request/response validators, media type, status, headers e state/effect", "200 validou schema enquanto banco não confirmou efeito"],
    ["Fuzzing e property-based", "schema gera casos válidos/inválidos sob limites e oráculos de segurança/domínio", "schema fuzzers, seeds, shrinking, rate limits e invariants", "payload recursivo válido derrubou parser sem limite"],
  ]],
  ["Compatibilidade e evolução", "avancado", "Mudança compatível depende de consumers e wire behavior, não apenas de um classificador de diff.", [
    ["Breaking changes", "remoções, requiredness, narrowing, status e security podem quebrar consumidores de formas diferentes", "semantic diff, path/operation/schema changes e severity", "campo opcional virou obrigatório e clientes antigos falharam"],
    ["Mudanças aditivas perigosas", "novo enum/field/status pode quebrar clients exhaustivos ou parsers fechados", "tolerant readers, enum evolution, additionalProperties e unknown outcomes", "enum novo causou crash em switch gerado"],
    ["Versionamento e deprecation", "estratégia de URI/header/media type define coexistência, sunset e migração observável", "SemVer limits, info.version, API versions, Deprecation/Sunset headers e changelog", "versão foi removida antes de consumers migrarem"],
    ["Consumer-driven contracts", "evidência de consumers complementa spec e identifica dependências reais sem congelar evolução", "consumer fixtures, compatibility matrix, telemetry e approval", "diff marcou compatível mas cliente dependia de ordenação não documentada"],
  ]],
  ["Geração de código e SDKs", "avancado", "Generator é compilador versionado: inputs, templates, opções e runtime produzem artifact testável e revisável.", [
    ["Clientes gerados", "SDK gerado precisa naming, auth, serialization, errors, retries e cancellation coerentes com contrato", "OpenAPI Generator, language targets, nullable, dates, oneOf e runtime", "cliente gerado repetiu POST não idempotente automaticamente"],
    ["Server stubs e interfaces", "stub acelera boundary mas não implementa domínio, policy ou transação", "server generators, interfaces, delegates, validation hooks e regeneration", "TODO gerado retornou 200 e foi promovido"],
    ["Templates e customizações", "custom template é código de supply chain versionado, testado e comparado ao upstream", "Mustache templates, config, vendor extensions e generator updates", "template antigo removeu header de segurança em todos os SDKs"],
    ["Regeneração e drift", "generated output é reproduzível e não recebe edições manuais; diff e smoke detectam mudança", "lock/version, clean generation, formatting, compile/test e artifact checksum", "hotfix manual sumiu na próxima geração"],
  ]],
  ["Publicação, operação e governança", "avancado", "O bundle publicado é artifact de release: pipeline, gateway, ownership, observabilidade e recuperação precisam referir o mesmo digest.", [
    ["Pipeline, artifact e registry", "pipeline resolve, valida, lint, diff, testa, gera, assina e promove o mesmo bundle content-addressed", "CI stages, API/OCI registries, checksums, provenance, retention e approvals", "cada stage regenerou uma spec diferente e o portal serviu outra versão"],
    ["Gateways, policy e ownership", "import e mudança de paths/security têm diff, owners e policy com exceptions estreitas e expiráveis", "API gateways, CODEOWNERS, routes, auth, quotas, CORS, waivers e audit", "reimport apagou policy manual e mudança de auth teve revisão insuficiente"],
    ["Observabilidade e métricas", "operationId e outcomes correlacionam telemetry e governança mede drift/adoção/incidentes sem cardinalidade ou gaming", "route templates, RED/SLO, tracing, freshness, consumer success e change failure", "IDs em labels explodiram cardinalidade e specs vazias cumpriram KPI"],
    ["Incidentes e rollback de contrato", "bundle ou SDK comprometido é bloqueado e o artifact correto, gateway, portal e caches são reconciliados", "immutable versions, denylist, signatures, rollback, cache purge, timeline e evidence", "rollback do serviço manteve contrato adulterado no gateway e CDN"],
  ]],
  ["Projeto Quíron com Swagger", "avancado", "A banca integra contrato design-first, implementação real, clients, evolução, publicação e recuperação da API de reservas.", [
    ["Baseline OpenAPI do Quíron", "bundle descreve auth, idempotência, reserva, errors, status e outbox-facing behavior com exemplos válidos", "multi-file OAS, schemas, security, examples, lint e bundle", "clone limpo não resolveu refs e spec omitiu conflito"],
    ["Última vaga por contrato", "duas chamadas concorrentes observam outcomes documentados e estado real sem overbooking", "POST reservation, Idempotency-Key, 201/409/202, callbacks e contract test", "spec verde não detectou serialização do teste concorrente"],
    ["SDK, compatibilidade e release", "SDK gerado e consumer antigo/novo passam contra o mesmo bundle promovido por digest", "generator, compile/smoke, semantic diff, canary e registry", "release regenerou SDK de spec diferente do servidor"],
    ["Banca, incidente e restore OpenAPI", "drift, bundle comprometido e portal/gateway incorretos são contidos e restaurados com cadeia de evidência", "traffic validation, artifact signatures, audit, rollback, cache purge e reconciliation", "serviço voltou mas clients continuaram consumindo contrato adulterado"],
  ]],
];
