# Chiron — apostila integral do repositório

Concluída e integrada em 2026-10-19, uma única vez após jQuery, kind repo. 12 capítulos, 48 seções, **124.053 palavras**, mínimo **600**, 96 exemplos, 36 exercícios e 48 flashcards. Porque/quebraria em todas as seções e integrador Ágora / reserva-estoque-concorrencia. Olympus não iniciada.

## Cobertura e autoria

48 lições principais independentes em scripts/chiron-lessons-01.mjs a 12.mjs, acrescidas de 358 subseções próprias de funções/componentes e 455 guias de módulo. Cobertura dos 607 arquivos da aplicação, configuração de build e entradas estáticas: zero arquivos sem guia; 406 exports públicos chamáveis, incluindo forwardRef, aliases e re-exports, todos com subseção, assinatura, responsabilidade, motivo, consumidores, quebra e extensão. Arquivos de dados possuem papel, contratos, consumidores, limites e extensão próprios. 40 diagramas de sistemas lógicos, além do diagrama de arquitetura, cobrem domínio, interface, persistência, IA, ingestão e build/PWA. Citações de módulos usam linha inicial e símbolo module para indicar o arquivo, não uma função fictícia.

O limite inclui TS/TSX da aplicação, declaração ambiente, CSS, configs e fontes públicas estáticas. Testes, dependências, dist e scripts históricos de autoria/evidência são ferramentas e artefatos separados. Documentar corpus de outras apostilas explica a composição do aplicativo; não reexecuta nem inicia essas outras fontes. O manifesto manual de revisão e os snapshots guardam o SHA-256 de todas as fontes. Hashes de arquivos gerados ficam externos às citações dos próprios módulos para evitar autorreferência; duas materializações estáveis foram conferidas.

## Execução nativa e contratos

96/96 corpos publicados executados em Node v24.13.0 Windows pelo Vitest existente, usando imports dos módulos reais e deepStrictEqual nativo com oráculos literais independentes. Hashes completos conferidos contra a execução; nenhuma infraestrutura instalada. Fixtures sintéticas exercitam funções concretas, sem fingir serviços. As chamadas não demonstram React/DOM, acessibilidade, GPU, storage real, cloud, provedor IA, GitHub, autorização remota ou transação concorrente de backend. Essas fronteiras são descritas com limites explícitos. Casos vazios de computeUpcomingDue não comprovam comportamento temporal com cards em fusos reais.

Contratos de capítulos/repo e auditoria editorial sem violações. Seções 1.261034% (<42%); cards 0% (<78%); exercícios detalhados 100%; zero pares altamente similares e zero código duplicado. Piso 600, assertions, timeouts e thresholds preservados. Testes focados: 3 arquivos/116 aprovações, incluindo 96 execuções e integração/ordem/unicidade no seed.

## Aplicação e evidência

pnpm typecheck (tsconfig.app.json), tsc --noEmit -p tsconfig.node.json e pnpm build aprovados. O projeto app não está em strict; typecheck não equivale a validação runtime. PWA: 54 entradas / 138.693,02 KiB. assets/index-blGtVDjD.js: 6220618 bytes, presente em sw.js; assets/book-chiron-C-dxORLo.js: 1290473 bytes, presente em sw.js. Teto por arquivo de 6291456 bytes preservado. Assets anteriores retidos, avisos históricos de tamanho e Supabase mantidos. Build local; sem deploy ou commit.

Regressão aplicável: Test Files  114 passed | 5 skipped (119); Tests  1949 passed | 19 skipped (1968); 343.98s (transform 4.13s, setup 0ms, collect 7.58s, tests 308.39s, environment 15ms, prepare 11.62s). Exclusão explícita somente de ubuntuLinux.examples.test.ts (96 casos WSL não executados). Os 5 arquivos/19 skips históricos não representam aprovações. Suíte global completa não declarada verde.

Fonte integrada para seeds novos. O carregador existente não faz backfill universal de Chiron a perfis persistidos; não foi alterado nesta autoria. Alterações alheias preservadas. Catálogo incompleto; automação continua ativa. Próxima fonte: Olympus, somente na execução seguinte.

Evidências atuais: scripts/chiron-coverage-evidence.json, chiron-repository-review.json, chiron-modules-reviewed.json, chiron-supplement-reviewed.json, chiron-example-evidence.json, chiron-source-evidence.json, chiron-editorial-evidence.json e chiron-build-evidence.json. Logs: chiron-integrated-tests-run.log, chiron-typecheck-run.log, chiron-build-run.log e chiron-regression-run.log. Tentativas anteriores são históricas e não substituem estes resultados.

## Reprodução

1. node scripts/build-chiron-content.mjs
2. node scripts/audit-chiron-coverage.mjs
3. CHIRON_WRITE_CHIRON_EVIDENCE=1 no ambiente; pnpm exec vitest run src/lib/study/seeds/content/chiron.test.ts src/lib/study/seeds/content/chiron.examples.test.ts src/lib/study/seeds/index.test.ts --maxWorkers=1
4. node scripts/chiron-verification-tools.mjs
5. pnpm typecheck; pnpm build
6. pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts

Alterar fonte citada invalida revisão e requer nova auditoria; não renove hashes indiscriminadamente para contornar deriva. As citações são fontes locais primárias, sem promessa de efeitos externos não observados.
