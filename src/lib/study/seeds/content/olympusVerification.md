# Olympus — apostila guarda-chuva integral

Concluída em 2026-10-20, integrada uma vez após Chiron, kind repo. 12 capítulos, 48 seções, **36.829 palavras** (30.568 de narrativa principal independente), mínimo **602**, 96 exemplos verificáveis, 36 exercícios próprios e 48 flashcards. Porque/quebraria, citações de fonte e Como estender; integrador Ágora/reserva-estoque-concorrencia sem promessa de backend concorrente.

## Escopo de engenharia

Fonte principal: olympus-plan, 13 documentos Markdown. Todos possuem guia próprio com responsabilidade, precedência, limite e extensão. Não existem exports executáveis nesse repositório documental. Código dos irmãos é fonte de confronto e execução selecionada; esta fonte não promete documentar novamente cada função dos seis aplicativos. Conforme PLANO 3.4-C, oito capítulos ensinam o comum e quatro tratam particularidades de Chronos, Kairos, Pluto, Hermes, Chiron e hub. 21 diagramas de sistemas, citações de arquivo/símbolo/linha, assinaturas reais nas subseções das funções chamadas e extensão por área.

Autoria própria: scripts/olympus-lessons-01.mjs a 12.mjs. Guias e diagramas em olympus-document-guides.mjs e olympus-system-diagrams.mjs. Materialização em olympusChapter01..12.ts, olympusAssessments.ts e olympus.ts. Snapshots dos documentos e fontes primárias são auditados em olympus-coverage-evidence.json e revisão vinculada por contentDigest.

## Programas executados e limites

96/96 programas publicados executados inteiros em processos reais Node v24.13.0 Windows, com deepStrictEqual nativo, oráculos literais e SHA-256: 68 chamadas a módulos reais da família e 28 inspeções nativas de fontes locais. O loader só resolve extensões relativas para o type stripping nativo do Node; não troca implementações, cria SDK falso, simula servidor ou instala dependência. O harness, casos, corpos e arquivos citados têm hashes registrados. Artefatos temporários próprios foram removidos.

Inspeção de código não equivale a executar auth, sync, proxy ou deploy. Chamadas puras com fixtures sintéticas não certificam React/DOM, acessibilidade, storage real, GPU, PWA instalada, Tauri compilado, Supabase/RLS, IA, providers, canais de entrega ou operação entre dispositivos. Esses efeitos permanecem não ensaiados; seus limites estão nas seções e captions. Nenhum serviço foi simulado para produzir aprovação.

Drift explicitamente documentado:

- Chiron writer chiron-data vs hub chiron-index and direct index envelope
- Chiron doc deep link /library vs current owner routes
- UTC today vs local weekday/month/hours
- Kairos sync snapshot advances before ack and no demonstrated retry/merge
- Rate limit fail-open and CORS fallback wildcard
- Oracle readonly actions/history vs action-capable sibling pattern
- Topbar optional command palette vs historical three-item rule
- Initial SQL integer version vs Date.now writers; remote applied type unverified

Além disso, o painel Chiron soma dueTotal dos seis grupos selecionados; foco restante do Chronos é faixa de jornada, não solver de tempo livre; recência e recorte variam por domínio; o catálogo não prova saúde. A fonte documenta o estado local e os marcos históricos, sem corrigir silenciosamente outros aplicativos ou prometer catálogo atual de modelos/preços.

## Gates finais

Contratos de capítulo/repo e auditoria editorial sem violações. Piso 600 preservado. Similaridade máxima de seções 7.845745%, cards 3.636364%, exercícios detalhados 100%, pares altamente similares e código duplicado zero. Testes focados finais: 4 arquivos/158 aprovações (contratos, editorial, 98 corpus/integridade e 19 seed); as 96 execuções reais estão no log nativo separado.

Typecheck da aplicação e da configuração Vite aprovados. Build/PWA local: 58 entradas / 157.371,27 KiB; assets/index-HIWhjQrc.js = 6220794 bytes, precached; assets/book-olympus-B670nNrH.js = 464130 bytes, precached. Teto 6 MiB intacto, assets anteriores preservados, warnings históricos de chunks e Supabase mantidos. Nenhum deploy, commit ou instalação.

O gate de contratos excedeu 30 s inclusive isolado: a auditoria recriava os mesmos n-gramas em cada par. editorialMetrics agora calcula cada conjunto uma vez por entrada e por invocação, mantendo todos os pares, fórmulas, limites e validação fresca. Equivalência exata contra a implementação anterior em Olympus, Chiron, fonte vazia e duplicação; provas em olympus-editorial-equivalence-evidence.json. Depois da correção, contrato/seed/editorial/corpus passaram 158/158, sem mudar assertions ou timeouts. Logs anteriores de timeout estão preservados.

Regressão aplicável: Test Files  115 passed | 5 skipped (120); Tests  2048 passed | 19 skipped (2067); 337.14s (transform 8.04s, setup 0ms, collect 13.42s, tests 268.60s, environment 21ms, prepare 24.57s). Exclusão explícita somente de ubuntuLinux.examples.test.ts: 96 casos WSL não executados. Os 5 arquivos/19 skips históricos não contam como aprovações. Suíte global completa não declarada verde.

runSeed filtra o placeholder legado de Olympus e os quatro placeholders Chronos/Kairos/Pluto/Hermes, agora seções do guarda-chuva; a apostila de engenharia própria de Chiron permanece. Publica Olympus uma vez depois de Chiron; teste de unicidade/ordem/cardinalidade aprovado. Batch ai-product completo. Conteúdo para seeds novos; não há promessa de backfill universal de perfis persistidos. São 33/46 fontes curadas: Spring Boot, C, C++, Ruby, Ruby on Rails, PHP, Flask, Vue.js, Git / GitHub, Docker, Swagger, Postman, Vercel ainda não estão publicadas como curadas. Automação permanece ativa; nenhuma segunda fonte foi iniciada nesta execução.

## Reprodução

1. node scripts/olympus-native-examples.mjs — executa os 96 corpos e registra prova; não certifica publicação.
2. node scripts/build-olympus-content.mjs — exige fontes/harness íntegros; atestação só aparece com revisão vinculada ao conteúdo.
3. pnpm exec vitest run src/lib/study/seeds/content/olympus.test.ts src/lib/study/seeds/index.test.ts --maxWorkers=1
4. pnpm typecheck e pnpm exec tsc --noEmit -p tsconfig.node.json
5. pnpm build
6. pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts

Evidências scripts/olympus-{authoring-plan,repository-review,coverage-evidence,native-examples,example-evidence,editorial-evidence,build-evidence}.json e logs native/integrated-tests/typecheck/config-typecheck/build/regression. Alterações de fonte invalidam digests e exigem revisão direcionada, não renovação indiscriminada de hashes.
