# Cursor — verificação do corpus local

Fonte integral 12/48/96/36/48, revisada em 2026-10-03 e integrada depois de Integração de IA (LLM), após aprovar seus contratos e corpus. Prosa final: 34.411 palavras, mínimo individual 689, piso vigente 600 preservado. Currículo: ambiente e responsabilidade; contexto; instruções persistentes; edição; terminal e confiança; testes; Git e colaboração; MCP/hooks/CLI; agentes remotos; privacidade e avaliação; armadilhas operacionais e acessibilidade; projeto Quíron. A última seção referencia Lab Ágora / reserva-estoque-concorrencia.

## Método e alcance

São 96 snippets JavaScript autônomos, dois por seção: uma fixture positiva e uma contraprova com mutant específico. O resultado esperado é um literal independente, ou um valor derivado manualmente de regra declarada; não é calculado chamando a implementação avaliada. O segundo snippet também confere a implementação correta e exige que o mutant seja recusado por `assert.AssertionError`, não por módulo ausente ou falha de sintaxe.

Execução real em Node v24.13.0, Windows x64. VM nova por snippet autoral confiável, timeout vigente de 2 s, `require` limitado a assert/crypto, com Buffer, URL e Intl disponíveis. A VM é contexto de execução de conteúdo confiável, **não sandbox para código adversarial**. Não há helpers ou objetos fictícios do aplicativo Cursor.

Escopos: **58 local-rule, 22 local-transform, 16 model**. Predicados, seleção e projeção de registros, ordenação, propagação de grafo, aritmética e SHA-256 são operações locais reais. Históricos, recuperação seletiva, replay e reserva são modelos seriais em memória. As fixtures usam caminhos relativos, domínios de schema e políticas explicitamente restritos; não são glob/parser MDC universal, resolvedor de filesystem, detector de PII, tokenizer, esquema de preço ou protocolo MCP/CLI do produto.

O caso de SHA-256 calcula bytes reais da proposta contra referência conhecida; igualdade de digest não demonstra qualidade, assinatura de origem ou autorização. O caso de orçamento usa unidades fictícias. O caso de busca possui ranking lexical declarado, não algoritmo interno de Cursor. O caso de acessibilidade examina uma restrição estrutural declarada, não a árvore acessível do navegador nem conformidade da interface.

## Auditoria e revisão semântica

Corpus/contratos: **98/98 passed**. Auditoria sem violações: similaridade máxima de seções **34,230504%**, abaixo de 42%; cards **8,510638%**, abaixo de 78%; exercícios detalhados **100%**, mínimo 65%; snippets duplicados **zero**. Nenhum threshold, assertion ou timeout foi reduzido. Cada capítulo contém quatro seções, três exercícios de tipos 2/3/5 e quatro cards; níveis básico, intermediário e avançado presentes.

A revisão confrontou as previsões com os literais de entrada e resultado e as contraprovas com a falha descrita. Entre as fronteiras: diretório semelhante fora da raiz; edição semiaberta; prova de revisão antiga; relevância sem permissão de dados; digest desatualizado; metadado booleano falso; consumidor transitivo; efeito em ambiente não autorizado; ID de outro tenant; replay serial; base de reversão desatualizada; gate obrigatório não executado. Os exemplos explicam o que faltaria para comprovar a superfície nativa pertinente.

Primeira execução: um escape inválido no JavaScript de uma contraprova e título de capítulo sem a expressão de armadilhas exigida pelo contrato de ferramenta. O escape foi substituído por operação de string equivalente ao mutant pretendido; o capítulo operacional passou a se chamar Armadilhas de operação e acessibilidade. Nenhum limite ou teste foi relaxado. Uma revisão também alinhou a descrição da fixture de hash com seus bytes finais. O corpus final foi reexecutado integralmente após essas correções e inclusão das referências primárias.

## Evidência e reprodução

- `scripts/cursor-evidence.json`: identidade, digest SHA-256 do código final, escopo, resultado, duração, ambiente e gates nativos pendentes.
- `scripts/cursor-editorial-evidence.json`: contagens, palavras por seção, métricas e violações.
- `scripts/cursor-focused-final.log`: contratos e 96 snippets aprovados.
- `scripts/cursor-typecheck-run.log`, `scripts/cursor-build-run.log`, `scripts/cursor-local-suite-run.log`: gates de integração.
- `scripts/build-cursor-content.mjs`: materialização de registros específicos em `cursor-lessons-01.mjs` a `12.mjs`; não utiliza uma fonte de prosa compartilhada entre ferramentas.

```powershell
$env:CHIRON_WRITE_CURSOR_EVIDENCE='1'
pnpm exec vitest run src/lib/study/seeds/content/cursor.test.ts src/lib/study/seeds/content/cursor.examples.test.ts --maxWorkers=1 --reporter=dot
pnpm run typecheck
pnpm run build
pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts
```

Typecheck aprovado. Build/PWA aprovado: principal **6.085,52 kB**, book-cursor **351,46 kB** (gzip 75,18), precache **37 entradas / 80.452,96 KiB**. O chunk Cursor consta em `dist/sw.js`; o teto de 6 MiB por arquivo permanece. Warnings preexistentes de chunks grandes e importação Supabase estática/dinâmica continuam explícitos. Build é geração local de artefato, não deploy externo.

Regressão local final aprovada: **100 arquivos / 1256 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 224.19 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não são contabilizados como aprovados ou novos skips. Nenhum teste, assertion, timeout ou threshold foi alterado para contornar essa indisponibilidade. A suíte global completa permanece com limitação independente de WSL e não é chamada de verde. Todos os 96 digests finais de Cursor foram reconferidos contra a execução aprovada.

## Gates nativos e remotos não exercitados

Não foram executados editor Cursor, sugestões inline, seleção e aplicação nativas, descoberta/indexação do aplicativo, inclusão de MDC/AGENTS.md, comandos do agente, UI de aprovação, run modes ou enforcement de sandbox/ignore. Também não foram exercitados checkpoint, CLI Cursor, servidor/protocolo MCP, hooks instalados, Cloud Agents, configuração de conta/tenant, requests de modelo, retenção ou exclusão de dados, métricas de custo real, acessibilidade da interface, publicação remota ou rollback operacional. Nenhum runtime, SDK, provider, credencial, VM, servidor ou infraestrutura foi instalado para simular essas provas.

O Lab é uma referência curricular; não houve disputa concorrente de backend, transação, durable replay, restore ou ensaio operacional dessa camada nesta execução. Modelos de reserva e idempotência em memória não atestam essas propriedades. Procedimentos nativos completos como instrução permanecem **Pending como execução** até ensaio real apropriado.

O executor Ubuntu/WSL permanece gate independente indisponível, conforme Office/LLM. Não houve reinício de distribuição nem encerramento de processos alheios. A regressão local exclui explicitamente somente seu arquivo; os 96 casos Ubuntu não executados não são contabilizados como aprovações ou novos skips. Windows/Node não é promovido a Ubuntu. A suíte global completa não é declarada verde.

## Referências primárias consultadas

Consultadas em 2026-10-03; referências indicam mecanismos do produto, não substituem ensaio. Não fixamos catálogo de modelos, tarifas, quotas, atalhos universais nem garantia retroativa de política.

- [Agent overview](https://cursor.com/docs/agent/overview): componentes e ferramentas do agente.
- [Search](https://cursor.com/docs/agent/tools/search): página atual descreve Instant Grep e índice local. O endereço antigo de codebase-indexing redirecionou para esta página; descrição histórica de embeddings remotos não foi tratada como comportamento atual.
- [Rules](https://cursor.com/docs/rules): MDC, metadados, AGENTS.md e alcance de orientação. O endereço context/rules redirecionou.
- [Ignore file](https://cursor.com/docs/reference/ignore-file): exclusão de contexto e diferença para acesso por terminal/MCP.
- [Agent security](https://cursor.com/docs/agent/security): controles e fronteiras de ferramentas.
- [Run modes](https://cursor.com/docs/agent/security/run-modes): diferença entre aprovação, configuração e sandbox.
- [Reviewing and testing](https://cursor.com/learn/reviewing-testing): revisão e verificação da proposta; endereço agent/review redirecionou.
- [MCP](https://cursor.com/docs/mcp): conexão e capacidades externas.
- [Hooks](https://cursor.com/docs/hooks): scripts, JSON por stdio e etapas do agente.
- [CLI](https://cursor.com/docs/cli/overview): interface interativa e automatizada; não foi instalado nem executado o agente CLI.
- [Cloud agents](https://cursor.com/docs/cloud-agent): ambiente remoto próprio e necessidade de configuração.
- [Security](https://cursor.com/security): políticas e informações de segurança vigentes da fonte.

As demais decisões de preservação, orçamento e relato são contratos didáticos explícitos desta apostila, não precedência universal ou formato interno prometido de Cursor.
