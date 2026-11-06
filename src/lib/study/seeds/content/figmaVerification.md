# Figma — verificação integral

Revisão: 2026-10-01. `figma.ts` é fonte `tool`, integrada inteira em `runSeed()` imediatamente depois de N8N, após corpus e auditoria aprovados. Somente Figma foi concluída nesta solicitação; Pacote Office não foi iniciada. O batch `operations-product` permanece em andamento.

## Fonte e gates editoriais

12 capítulos, 48 seções autorais, 29.765 palavras de prosa, mínimo 601 por seção (piso vigente 600), 96 exemplos, 36 exercícios específicos dos tipos 2/3/5 e 48 flashcards. Cada seção contém dois códigos e blocos `porque`/`quebraria`. O capítulo final explicita armadilhas e banca, atendendo o contrato de ferramentas, e referencia o Lab Ágora / `reserva-estoque-concorrencia`.

O currículo está em `figmaCurriculum.ts`; a prosa em `figmaProse01.ts` a `12.ts`, reunida por `figmaAuthoredProse.ts`. `figmaExamples.ts` guarda os textos finais dos snippets. `figmaAssessments.ts` contém perguntas/respostas/falhas e cenários próprios. Não há compositor genérico ou appendix para atingir o piso. A fonte cobre documento, layout, tipografia, cor/assets, componentes, variables, protótipos, acessibilidade, governança, Dev Mode, export/APIs e projeto de reserva.

Contratos por capítulo e fonte, chaves exatas e auditoria passaram com zero violações. Similaridade máxima das seções: 0,640512% (<42%); cards: 0% (<78%); exercícios detalhados: 100% (≥65%); código duplicado: zero. Nenhum threshold editorial foi reduzido ou alterado. O primeiro gate identificou falta do título de armadilhas no contrato de ferramentas; o capítulo final já cobre esses riscos e foi nomeado explicitamente, sem reduzir a exigência ou adicionar conteúdo parcial ao seed.

## Corpus executado

96/96 exemplos JavaScript passaram no Node v24.13.0, Windows x64, com contexto VM novo por snippet. São 51 `local-rule`, 10 `local-transform`, 21 `local-geometry` e 14 `model`. Assertions positivas e negativas verificam propriedades específicas: IDs, árvores/ciclos, transformações, layout simplificado, contraste/alpha, tipos, aliases, modes, estados, migração, digests e gates.

Os mecanismos locais são reais: aritmética, estruturas de dados, Intl, Buffer e SHA-256. Modelos de instâncias, herança, eventos, merge e reserva são sequenciais em memória. Quebra por caracteres não mede fontes; booleano discreto não processa curvas arbitrárias; serializer SVG restrito não sanitiza uploads; arrays de pixels não são screenshots reais. Os captions e capítulos explicitam essas fronteiras.

O harness usa `node:assert/strict` e `node:crypto`, com timeout e texto final `example.code`. Não injeta objeto `figma` falso, helpers, API ou renderer apresentados como reais. VM executa conteúdo autoral confiável e não é sandbox adversarial. Snippets não fazem rede, mutation do host ou acesso a documentos do usuário. Nenhum plugin, pacote, fonte, serviço ou infraestrutura foi instalado para aparentar validação.

`scripts/figma-evidence.json` registra ID, digest SHA-256 do texto final, escopo, status, duração e ambiente. `scripts/figma-editorial-evidence.json` registra cada contagem, métricas e violações. A attestation `examplesVerified` cobre esses escopos; não certifica execução nativa Figma. O teste do seed exige fonte única `built_in`, de tipo `tool`, imediatamente após N8N, com 12/48/96/36/48.

## Reprodução e resultados

```powershell
$env:CHIRON_WRITE_FIGMA_EVIDENCE = '1'
pnpm exec vitest run src/lib/study/seeds/content/figma.test.ts src/lib/study/seeds/content/figma.examples.test.ts src/lib/study/seeds/index.test.ts src/lib/content/editorial.test.ts --maxWorkers=2 --reporter=dot
pnpm typecheck
pnpm build
pnpm exec vitest run --maxWorkers=2 --reporter=dot
```

Corpus/contratos: 98/98. Com integração/editorial: 109/109. Typecheck aprovado. Build/PWA aprovado: principal 6.085,20 kB, book-figma 294,03 kB, precache 31 entradas/61.247,69 KiB. Suíte global: 95 arquivos/1.055 testes passed, 5 arquivos/19 testes skipped preexistentes, 154,85 s; nenhum skip de Figma.

O primeiro build integrado excedeu o teto existente de precache, com principal de 6.379,23 kB. `vite.config.ts` passou a separar a fonte completa em `book-figma`, conservando o teto de 6 MiB por arquivo e o conteúdo offline. O build seguinte já gerou principal de 6.085,20 kB e chunk Figma de 294,03 kB, mas encontrou o arquivo grande residual do build falho. Somente esse artefato gerado nesta solicitação (`dist/assets/index-61_z4zHV.js`) foi removido com caminho verificado; configurações e arquivos preexistentes foram preservados. A solução não aumenta limite nem esconde falha. Warnings conhecidos de chunks grandes e import estático/dinâmico Supabase continuam explícitos.

## Evidência ainda necessária

| Superfície | Estado e método necessário |
|---|---|
| Editor e documento nativos | Pending: arquivo autorizado, IDs/revisão reais, hierarquia e navegação observados |
| Auto layout, fontes, components, variables e protótipo | Pending: fixtures criadas no editor e alterações nativas observadas |
| Libraries, updates, versions/branches/merge | Pending: recurso disponível, origem e consumidores reais ensaiados |
| Dev Mode, ready for dev e Code Connect | Pending: plano/seat e configuração confirmados, inspeção e publicação observadas |
| Export SVG/raster e QA visual | Pending: export real e renderer alvo comparados; cálculo local não substitui imagem |
| Plugin API, REST e assistência de IA | Pending: integração autorizada, calls ou mutation e resultados reais registrados |
| Sharing e permissões | Pending: principals e recursos reais com ações permitidas/negadas observadas |
| Runtime, teclado, foco, hit testing e tecnologia assistiva | Pending: produto implementado e ensaios pertinentes; desenho só especifica intenção |
| Pesquisa com pessoas e aceite operacional | Pending: método e observações reais, sem entrevistas ou estudos fabricados |
| Reserva concorrente | Pending: autoridade de domínio e ledger do laboratório real; modelo serial não prova banco |

## Referências primárias consultadas

Documentação verificada em 2026-10-01. Capacidades, planos, seats e APIs devem ser confirmados na instância alvo; não há claim de patch ou ambiente Figma instalado. Um caminho tentado para método de fonte não retornou conteúdo; a documentação oficial de introdução confirmou a dependência, sem tratar a tentativa falha como prova.

- [Auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) e [grid auto layout](https://help.figma.com/hc/en-us/articles/31289469907863-Use-the-grid-auto-layout-flow): distinção de fluxos, wrap e guias.
- [Variants](https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants), [component properties](https://developers.figma.com/docs/plugins/working-with-component-properties/) e [swap de instâncias](https://help.figma.com/hc/en-us/articles/360039150413-Swap-components-and-instances): mecanismos nativos e necessidade de ensaio de overrides.
- [Variables/collections](https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes), [criação de variables](https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables-and-collections) e [modes](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables): identidade, tipos, aliases e contexto.
- [Protótipos](https://help.figma.com/hc/en-us/sections/360006534454-Create-prototypes), [overlays](https://help.figma.com/hc/en-us/articles/360039818254-Create-Overlays-in-your-Prototypes) e [Smart animate](https://help.figma.com/hc/en-us/articles/360039818874-Smart-animate-layers-between-frames): referências para ensaios nativos de interação.
- [Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode), [Code Connect](https://developers.figma.com/docs/code-connect/) e [branching](https://www.figma.com/best-practices/branching-in-figma/): disponibilidade, contexto e entrega.
- [Strokes](https://help.figma.com/hc/en-us/articles/360049283914-Apply-and-adjust-stroke-properties), [Plugin API](https://developers.figma.com/docs/plugins/) e [REST rate limits](https://developers.figma.com/docs/rest-api/rate-limits/): export, fontes/capacidades e limites de integração.
- W3C: [contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [foco não oculto](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) e [dialog APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Policies geométricas locais não são certificação de conformidade.
