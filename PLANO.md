# Chiron — Plano de Reconstrução (review de 2026-07-29)

> Protótipo completo em revisão. Escopo original: `olympus-plan/CHIRON.md`.
> Este documento é a fonte da verdade da reconstrução. **Marque os checkboxes junto com o código.**

---

## 0. Veredito da review — o que fica, o que sai, o que nasce

| Arquivo / área | Veredito | Motivo |
|---|---|---|
| `index.css` (tokens sépia+carmim) | **REESCREVER** | Marrom lamacento; contraste baixo; identidade fraca |
| `components/ChironLogo.tsx` | **REFAZER DO ZERO** | Livro+pena+setas: ilegível a 16px, 3 metáforas empilhadas |
| `public/favicon.svg` | **REFAZER DO ZERO** | Mesmo problema, sem fill, some em aba clara |
| `components/three/Tome.tsx` | **DELETAR** | Livro de caixas planas; papelão. Vira armilar |
| `pages/Login.tsx` | **CORRIGIR** | Painel esquerdo usa `ChironMark` 2D gigante como fallback sem necessidade — o 3D deve rodar ali |
| `pages/Dashboard.tsx` (103 linhas) | **REESCREVER** | 4 stat cards genéricos sem visual + lista empilhada sem diferenciação |
| `pages/Progress.tsx` (170 linhas) | **DELETAR** | Duplica o Dashboard. Conteúdo migra integrado, não colado |
| `pages/Maps.tsx` (138 linhas) | **REESCREVER** | Não é mapa: é lista. Botão "Apostila" não faz nada. Sem progressão |
| `pages/Apostila.tsx` (126 linhas) | **REESCREVER** | Reader sem margem, sem código, sem citações, sem progresso |
| `pages/Practice.tsx` (184 linhas) | **REESCREVER** | Scroll de todos os exercícios de uma vez; 1 UI só para 6 tipos; score sempre 0 |
| `pages/Review.tsx` (125 linhas) | **REESCREVER** | Expõe grades SM-2 de 0 a 5 crus na UI (detalhe interno vazando); sem teclado, sem resumo |
| `pages/Settings.tsx` (108 linhas) | **REESCREVER** | 2 seções; dark mode duplica a topbar; só o bloco de IA tem utilidade |
| `pages/Aetheris.tsx` (329 linhas) | **REESCREVER** | Longe do padrão ouro documentado na §3a do SUITE-ARCHITECTURE (ver §10) |
| `components/ProfileDialog.tsx` (87 linhas) | **REESCREVER** | vs. 528 do Chronos. Só tem sair |
| `AppLayout.tsx` UserBlock | **REESCREVER** | Card inútil no rodapé da sidebar |
| `lib/study/seeds/data.ts` (1883 linhas) | **JOGAR FORA E REFAZER** | Ver §3 — reprova no teste "dá pra aprender só com isso?" |
| `lib/study/types.ts` | **EVOLUIR** | Falta Chapter, blocos tipados, Lab/LabLayer |
| `lib/study/srs.ts` + testes | **MANTER** | SM-2 puro e testado. Só a UI vaza |
| `lib/study/scoring.ts`, `service.ts`, `migrate.ts`, `store.tsx` | **MANTER + ESTENDER** | Base sólida |
| `lib/study/ingestion/*` | **MANTER + LIGAR** | Pipeline existe mas nenhuma página a usa |
| `lib/ai/context.ts` | **REESCREVER** | Sem o contrato do tutor; sem linha de locale (bug conhecido da suíte) |
| `lib/anki/export.ts`, `lib/auth.tsx`, `lib/i18n/*`, `components/ui/*` | **MANTER** | Ok |

**Nasce:** `lib/labs/` (motor de camadas guiadas + 4 labs), `lib/content/` (contrato de completude + testes), `lib/color.ts` (helper `alpha()` central que a suíte manda ter desde o dia 1), `lib/ai/actions.ts` + `actionHistory.ts` + `chatSessions.ts` + `insight.ts`, `lib/maps/layout.ts` (layout de DAG puro e testado), `components/charts/`.

---

## R. Reformulação pós-auditoria (2026-10-23) — fonte da verdade das lacunas

> A auditoria de 2026-10-23 mostrou que "passa no contrato" virou o critério de conclusão, e que o contrato mede contagem, não ensino. **Esta seção prevalece** sobre os registros de "concluída" das apostilas abaixo: eles atestam contrato estrutural e gates locais, não a régua Python. Decisões do Vinícius nesta data: corrigir o bug de persistência; refazer o que for preciso; gerador de apostilas **in-app** (uma apostila de exemplo gerada pela IA no app, todo o resto escrito aqui) com badges de origem; Chronos/Kairos/Pluto/Hermes viram **categorias do Olympus**; seguir o plano, reformulando as lacunas.

### R.1 Persistência — o app abria vazio fora deste ambiente

- [x] **Bug**: o seed tem 13,4 milhões de caracteres e `loadLocal` gravava tudo no localStorage (cota ~5–10 MB em Chrome/Firefox/Safari). O `setItem` estourava e o store caía em `emptyData()`. O painel de browser deste ambiente tem cota ilimitada e escondia o problema.
- [x] Conteúdo do sistema regenerado do código a cada carga, com IDs estáveis por chave natural (`lib/study/stableIds.ts`: fonte, títulos, hash de enunciado/frente), não pela ordem de criação — editar uma apostila não desalinha o progresso.
- [x] Persistido só o estado da pessoa (`lib/study/persistence.ts`): domínio dos nós, estado SM-2 dos cards, seções lidas, exercícios/cards próprios, fontes criadas no app ou ingeridas, tentativas/sessões/log/labs. Seed limpo = 304 caracteres. Backup JSON e linha `user_data` usam o mesmo formato; documentos antigos (IDs aleatórios) são reconvertidos sem perder progresso. Falha de gravação agora aparece como erro, não some.
- [x] Auditoria editorial saiu do carregamento (custava ~1,3 s por abertura) para `seeds/published.test.ts`; `runSeed` caiu para ~44 ms.
- [x] Histórico sintético de 30 dias (`seedActivity`) removido: o seed é o documento inicial real de cada pessoa, e mostrava uma sequência de estudo que ela nunca fez.

### R.2 Régua editorial — o contrato vira piso, a régua é leitura

O contrato de §3.2 continua sendo o **piso mecânico**. Ele não decide conclusão. Uma apostila só é "do sistema" quando também passa nesta régua, verificada lendo, tendo o Python como referência:

1. **Ensina o mecanismo** com o artefato real do assunto: fórmula de Excel, arquivo `.mdc` do Cursor, workflow JSON do n8n, SQL do próprio banco, config do Vite. **Proibido** simular a ferramenta em JavaScript e chamar isso de exemplo.
2. **Sem narração da verificação dentro da prosa.** Fixture, oráculo, contraprova, "ensaio nativo", limites do gate: tudo isso vive em `*Verification.md` e nos testes, nunca no texto que o aprendiz lê.
3. **Sem compositor**: nenhuma frase sorteada de lista, nenhuma "ficha" que repete a seção para inflar contagem.
4. **Estrutura não-uniforme.** Número de capítulos e seções segue o assunto, não 12/48/36/48. Pisos de §3.2 valem (stack ≥ 12 capítulos, ferramenta ≥ 8, ≥ 4 seções por capítulo), teto não existe.

Estado de cada fonte contra a régua — leitura de amostras **mais** a checagem mecânica de vazamento (`lib/content/readingBar.ts`: "contraprova", "ensaio nativo", "oráculo", "ficha de banca", "estudo dirigido", "mutante", "a fixture usa…", "não atesta"). Contagem de seções com vazamento entre parênteses, de 48:

| Situação | Fontes | Ação |
|---|---|---|
| **Na régua** (0 vazamentos) | Python, JavaScript, TypeScript, Node.js, React, Next.js | manter (as ocorrências de JS/Next eram "oráculo de teste" ensinado em capítulos de testes — falso positivo, padrão estreitado) |
| **Jargão de teste na prosa** | HTML, CSS, MySQL (44), MariaDB (47), SQL Server (46), Supabase (48), Java (48), C# (48 — telegráfico: "Mutante usa `double`…"), Oracle Cloud ("mutante" em todo porquê/o que quebra), Ubuntu / Linux (36) | reescrever a prosa no tom do Python; conteúdo técnico aproveitável |
| **Compositor — reescrever** | PostgreSQL, Tailwind CSS, Vite, Vitest (48/48: "Ficha de banca" repete a seção) | reescrita integral |
| **Narração de verificação / exemplos simulados — reescrever** | Pacote Office, LLM, Cursor, Claude Code, GitHub Copilot, OpenCode, Lovable, Google AI Studio, jQuery, N8N, Figma (39–48) | reescrever prosa e exemplos com artefatos reais |
| **Repositório** | Chiron (43), Olympus (38) | Chiron: tirar a narração; Olympus: reestruturar (R.3) |

`seeds/readingBar.test.ts` mantém a lista de pendentes, que só pode encolher: quando uma fonte sai dela, a checagem passa a valer para sempre.
| **Rascunhos (fora do seed)** | Spring Boot, C, C++, Ruby, Ruby on Rails, PHP, Flask, Vue.js, Git / GitHub, Docker, Swagger, Postman, Vercel | escrever na régua; só entram no seed aprovadas |
| Placeholders de demonstração | ZenMoney, Pokedex, Zonai Codex e versões antigas de Vue/Rails/Docker/Git/Flask/C/PHP | saem do seed quando a versão curada entrar; repos fora da suíte seguem §3.4-B |

- [x] JavaScript, React, Next.js conferidas: passam na checagem
- [ ] Reescrever a prosa das 10 de jargão de teste
- [x] Reescrever as 4 fontes de compositor — **PostgreSQL publicado (2026-10-23)**: 14 capítulos autorais (`postgresqlBook01..14.ts`), todo SQL executado no PostgreSQL 18.3, integrador ligado à camada real `agora/reserva-estoque-concorrencia`; compositor apagado; saiu das listas de pendentes da régua e dos labs. **Tailwind CSS publicado (2026-10-23)**: 14 capítulos autorais sobre a v4 (`tailwindBook01..14.ts`, 56 seções ≥600 palavras, 42 exercícios, 56 cards), integrador = interface do labirinto ligado à camada real `dedalo/grade-vizinhos` (a interface desenha o estado impossível parede+caminho em vermelho). Cada classe de cada exemplo passa pelo motor real do Tailwind 4.3.3 (`scripts/run-tailwind-snippets.cjs`: classes desconhecidas, avisos do motor, sintaxe TS/TSX, `@plugin` real — `@tailwindcss/typography` virou devDependency só para isso —, temas importados entre exemplos, e os exemplos "antes" do capítulo de migração contra o Tailwind 3.4 do próprio app). Afirmações sobre o CSS gerado conferidas uma a uma no motor (isso pegou 4 erros meus: sublinhado escapado, `--modifier()` com padrão, `transition-discrete` sem `transition`, e ordem alfabética das variantes `data-*` no integrador); comportamento de `tailwind-merge` 2.6/3.7, `cva` e `prettier-plugin-tailwindcss` 0.8 rodado de verdade; capítulo de migração com a saída real do `@tailwindcss/upgrade` num projeto v3 e numa cópia da config do Chiron (achado: as regras do Prism viram `@utility` e somem do CSS — anotado para a migração real dos apps). `defineBookGates` em `bookGates.ts` é o portão compartilhado dos livros reescritos. **Vite publicado (2026-10-25)**: 14 capítulos autorais sobre o Vite 8.3 (Rolldown/Oxc), `viteBook01..14.ts` — inclui capítulo de armadilhas (exigido pelo contrato de ferramentas), migração 5→8 e integrador = gerador de Micenas num worker → `micenas/geracao-reversa`. Vite 8 isolado em `scripts/vite8/` (o app segue no 5.4); `scripts/run-vite-snippets.mjs` monta um projeto por seção (no integrador, um projeto que cresce entre seções) no Temp do sistema, com junção para o node_modules isolado, e roda servidor de desenvolvimento + build reais; scripts na raiz do projeto são só analisados. Achados reais registrados no texto: `manualChunks` em objeto quebra o build no Vite 8; `--debug config`; plugin duplicado sem aviso; `process.env.X` vira `undefined` em silêncio; `import()` sem extensão fica intacto; `NODE_ENV=development` vaza do servidor para um build no mesmo processo; `public/` é copiado no modo biblioteca; `import()` em worker `iife` é embutido sem aviso. **Migração real do Chiron testada numa configuração à parte**: só subir a versão falha (`manualChunks is not a function` + aviso do plugin-react-swc 3.11); com plugin-react 6 + `rolldownOptions.codeSplitting` o build passa em 3,8 s (Vite 5: 10,2 s), principal 5.987.521 bytes (Vite 5: 6.021.406), 34 entradas de precache; falta conferir servidor/PWA e o Vitest 3.2 não aceita Vite 8 (precisa ir para o 5.0). Gerador de Micenas executado: caminhada aleatória reversa gera tabuleiros solucionáveis porém triviais (1 movimento); exploração completa + BFS multi-origem dá 5–9 movimentos (semente 7: 68.247 estados, ~3 s); sorteio direto: 88/200 sem solução. Compositor apagado; saiu das listas pendentes. Build: chunk `book-vite` acrescentado. **Vitest publicado (2026-10-25)**: 14 capítulos autorais sobre o Vitest 5.0.5 (`vitestBook01..14.ts`, 56 seções ≥600 palavras, 42 exercícios, 56 cards) — asserções, organização/hooks/tabelas, assíncrono e temporizadores falsos, `vi.fn`/`spyOn`, `vi.mock`/`hoisted`/estado de módulo, fixtures (`test.extend` builder, escopos, `override`, `aroundEach`), snapshots, DOM (happy-dom + Testing Library; browser mode só em fragmentos, API conferida nos tipos publicados), configuração/projetos/pools, cobertura v8, armadilhas (fuso, tipos não conferidos, BOM/caminhos no Windows, instabilidade), CI/relatores/shard e migração 3→5, integrador = suíte do labirinto → `dedalo/bfs-visitados`. Vitest 5 isolado em `scripts/vitest5/` (ganhou React 19.2, Testing Library e plugin-react); `scripts/run-vitest-snippets.mjs` roda cada seção num projeto real, exige falha nos arquivos "(falha de propósito)" (falha de teste, de arquivo ou erro não tratado) e reprova erros não tratados no resto; `.snap`/`.html`/`.txt` entram pela legenda e são conferidos de verdade. Achados reais registrados no texto: `clearMocks` padrão não zera retornos programados; `mockRestore` apaga o histórico; `Matchers<T = any>` dá TS2428 no v5; sem `globals` a Testing Library não limpa entre testes; `poolOptions` só avisa e `coverage.all` é ignorado em silêncio; `github-actions` só entra sozinho sem `reporters`; `--retry` da linha de comando não sobrepõe o `retry` do teste; `--typecheck` só confere `.test-d.ts`; BOM no `package.json` vira `MISSING DEPENDENCY` e BOM no teste faz snapshot inline "written" sem escrever; linhas do `node:sqlite` têm protótipo nulo (`toStrictEqual` sem diferença visível); marcar visitado ao retirar não quebra a BFS em grade (bipartida), só repete trabalho (salão: 70 × 44). Compositor e `check-vitest-snippets.cjs` apagados; saiu das listas pendentes; chunk `book-vitest` (469 kB). As 4 fontes de compositor estão reescritas.
- [ ] Reescrever as 11 fontes de narração/exemplos simulados — **jQuery publicado (2026-10-26)**: 13 capítulos autorais sobre o jQuery 4.0.0 (`jqueryBook01..13.ts`, 52 seções ≥600 palavras, 39 exercícios, 55 cards), kind `stack` como no catálogo (básico 1–4, intermediário 5–11, avançado 12–13) — documento e coleção, seleção/travessia, manipulação e XSS, atributos/propriedades/dados, estilos/medidas, eventos e delegação, formulários (servidor com 422 por campo), Ajax (servidores reais, abort/timeout, Deferreds), efeitos e fila, plugins (`$.fn`, `$.extend` raso/fundo, instância por elemento, destroy, ESM), armadilhas, migração 3→4 com o jQuery Migrate 4.0.2 e convivência com o nativo, integrador = carrinho da Ágora (servidor Node, catálogo, plugin de quantidade, 409 de estoque, eventos globais de Ajax) → `agora/produto-carrinho`. `scripts/run-jquery-snippets.mjs` roda cada seção no Edge headless (CDP) com o jQuery 4.0.0/Migrate de `scripts/jquery4/`: projeto servido por HTTP (pelo `servidor.mjs` do livro quando há), `code.jquery.com` respondido com os arquivos do npm, blocos "Console…" avaliados na página e blocos "Saída…" conferidos linha a linha no console capturado; erro não tratado ou script/CSS/documento ≥400 reprova a seção. Achados reais registrados no texto: `toggleClass(false)` virou no-op; `attr(nome, false)` remove (ARIA não); ordem de foco blur>focusout>focus>focusin; `$.get` de `.js` não executa sem `dataType`; slim sem Deferred; `$.fx.off` e easing inexistente (lança a cada quadro); `trigger` não alcança `addEventListener` (exceto click/focus); `empty`/`html` limpam eventos de elementos reinseridos; módulo ES não cria global e roda depois de scripts clássicos; Migrate 4 duplica cada aviso com o rastro (`migrateTrace`), relatório em `$.migrateMessages`. `bookGates.ts` passou a chamar o runner com `spawn` assíncrono (o `spawnSync` travava o worker: "Timeout calling onTaskUpdate"). Livro antigo (`jqueryAuthoredProse/Examples/Assessments/Curriculum/Prose01..12`, `jquery.examples.test.ts`, `jqueryVerification.md`) apagado; saiu da lista pendente da régua. Ficaram em `scripts/` os artefatos não versionados do pipeline antigo (`jquery-lessons-*.mjs`, logs, `jquery-docs/`, `jquery-runtime/` ~36 MB) — sem uso, a apagar só com aprovação. Verificação: gates do jQuery 54/54, `tsc` limpo, build OK (`book-jquery` 419 kB). Suíte inteira: só restam 2 falhas alheias ao jQuery — `olympus.test.ts` (o livro fixa o SHA-256 de `src/lib/study/store.tsx`, alterado pela persistência da R.1; resolver na reestruturação do Olympus) e `typescript.test.ts` estourando 5 s sob a carga da suíte completa (passa isolado).  **Pacote Office publicado (2026-10-31)**: 13 capítulos autorais sobre o Microsoft 365 em português (`officeBook01..13.ts`, 52 seções ≥600 palavras, 39 exercícios, 65 cards, 295 blocos de código), kind `tool` — recorte aprovado: Excel como eixo (caps 2–8), Word (9–10), PowerPoint (11), sem Outlook/OneNote/Access. Cobre anatomia dos arquivos (pacote ZIP/Open XML, formatos, metadados), tipos e digitação em português (`12.5` é texto, `1.234` é 1234, `1/2` é data), datas/horas/precisão, referências/Tabelas/nomes/validação, fórmulas de decisão e critérios, buscas (PROCV×PROCX×ÍNDICE/CORRESP e chaves sujas, inclusive o espaço inseparável), matrizes dinâmicas/LET/LAMBDA, Power Query (cultura, limpeza, mesclar, desdinamizar), tabelas dinâmicas e gráficos (eixo que não começa em zero), Word (estilos, sumário, página, tabelas/legendas, campos, mala direta, revisão, acessibilidade), PowerPoint (mestre/layouts, estrutura, acessibilidade, o que viaja no arquivo), armadilhas (cálculo manual, circular, INDIRETO, mescladas, proteção × criptografia, vínculos) e integrador = controle de estoque e reservas da Ágora (Excel → mala direta no Word → slide) ligado a `agora/reserva-estoque-concorrencia`. Todo exemplo roda no Office instalado (16, pt-BR) por COM: `scripts/run-office-snippets.mjs` + `scripts/office/driver.ps1`; cada bloco é uma receita declarativa (gramática no cabeçalho do runner) cujo bloco `Resultado:` precisa bater com o que o programa mostra (`Range.Text`, estilos, partes XML dos pacotes). Achados reais no texto: `Value2` por COM interpreta como en-US (o runner usa `Formula2Local`); a mala direta com Excel entrega data em ordem americana e `45,899999999999999`; `Text.Trim` do Power Query remove o espaço inseparável e o `ARRUMAR` não; cultura errada no Power Query dá 45,90→4590 e células vazias; fórmula `[1]Planilha1!B2` grava o caminho do arquivo vinculado; notas e slides ocultos seguem no .pptx; arquivo criptografado deixa de ser ZIP. Livro antigo (`officeAuthoredProse/Examples/Assessments/Curriculum/Prose01..12`, `office.examples.test.ts`, `officeVerification.md`) apagado; saiu da lista pendente da régua. Auditoria editorial exige que nenhum bloco de código se repita no livro inteiro (variar rótulo de coluna entre seções que reutilizam dados). Artefatos do pipeline antigo em `scripts/` apagados com aprovação (2026-11-03). Faltam: LLM, Cursor, Claude Code, Copilot, OpenCode, Lovable, AI Studio, N8N, Figma. **OpenCode publicado (2026-11-03)**: 12 capítulos autorais sobre o OpenCode 1.18.5 (`opencodeBook01..12.ts`, 48 seções ≥600 palavras, 36 exercícios, 60 cards, 308 blocos), kind `tool` (básico 1–4, intermediário 5–8, avançado 9–12): CLI e raiz do projeto, configuração em camadas, instruções, agentes e subagentes, permissões, comandos, habilidades, MCP, ferramentas próprias e plugins, sessões/servidor/automação, armadilhas e integrador ligado à camada real `agora/reserva-estoque-concorrencia` (correção da reserva por um agente sob lista de permissão, conferida por teste e pelo banco de sessões). Todo exemplo roda no `opencode` real (`scripts/run-opencode-snippets.mjs`: casa, configuração e dados isolados, saídas conferidas linha a linha); o *modelo falso* (`scripts/opencode/modelo-falso.mjs` + `ver-pedido.mjs`, um provedor local compatível com a OpenAI que grava os pedidos) torna verificável offline o que o OpenCode envia ao modelo — instruções, agentes, ferramentas, comandos, habilidades, MCP, permissões e plugins, por roteiro de chamadas. Apostila e scripts antigos apagados; "OpenCode" saiu de PENDING_REWRITE. Restam nesta lista: LLM, Cursor, Claude Code, GitHub Copilot, Lovable, Google AI Studio, N8N, Figma.
- [ ] Escrever as 13 em rascunho
- [x] Teste anti-regressão da régua (`seeds/readingBar.test.ts`), com lista de pendentes que só encolhe

### R.3 Olympus — framework comum + uma categoria por app

Substitui §3.4-B para os apps da suíte e concretiza §3.4-C. Chronos, Kairos, Pluto e Hermes **não são fontes de topo**: são **categorias** dentro do Olympus. O framework (auth, `user_data`, sync, `ai-proxy`, padrão Aetheris, design system, i18n, PWA) é explicado **uma vez**, na parte comum; cada categoria explica só o que é próprio daquele app, no mesmo nível de profundidade de engenharia de §3.2 (algoritmo + código real + diagrama + como estender).

- [ ] Modelo: `Chapter.part` (categoria). O reader agrupa a árvore por parte e o mapa filtra por ela. Número de capítulos por categoria segue o app (Chronos tem muito mais sistema que Hermes).
- [ ] **Parte comum** — o framework da suíte
- [ ] **Chronos** — planners e grade de 168 células, motor de colisão em cascata, janelas de sono e partição noturna, ledger de composição, ferramentas de IA com guardrail, migrações versionadas
- [ ] **Kairos** — quadro kanban, ponte Chronos↔Kairos, proxy de IA sem chave no cliente, PWA/offline, markdown round-trip
- [ ] **Pluto** — fluxo vs. saldo, árvore de categorias, orçamento/metas, import de extrato
- [ ] **Hermes** — outbox, flows, entrega multicanal
- [ ] **Olympus (hub)** — o painel central e o que ele agrega
- [ ] Chiron continua com apostila própria (já cobre cada arquivo); a categoria Chiron dentro do Olympus é curta e remete a ela

**Proposta de sumário (aguarda aprovação do Vinícius antes da escrita)** — 21 capítulos em 7 partes, seções por capítulo conforme o sistema (não 4 fixas). A versão atual tem 12 capítulos e espreme Pluto+Hermes num só e Chiron+Olympus noutro.

| Parte | Capítulos |
|---|---|
| **I · O comum** | 1 Família, conta única e sessões · 2 `user_data` como backend inteiro · 3 Motor de sync (pull → reidratação → push → realtime com guarda de eco) · 4 `ai-proxy`: contrato, CORS, rate limit · 5 Padrão Aetheris: sessões, ações, histórico, digest · 6 Design system da família · 7 i18n, extensões e índice documental · 8 PWA, deploy e checklist de irmão novo |
| **II · Chronos** | 9 O modelo do horário: `ScheduleData`, templates e categorias, serviço/porta/repositório e migrador · 10 Os planners: agenda do dia, arraste (`planner-drag-math`), `workspace-engine` (runtime, progresso, tracking) · 11 Sono e tempo: janelas por dia da semana, partição noturna, UTC × calendário local · 12 Ledger de metas, digest, sugestões, timer de foco, notificações e a ponte com o Kairos |
| **III · Kairos** | 13 O quadro: tarefas, projetos, prioridade, vencimento, arquivo e a visão Agora · 14 Round-trip Markdown/XLSX e o lado Kairos da ponte |
| **IV · Pluto** | 15 O ledger: centavos, contas × categorias, saldo × fluxo, orçamento e metas, insights · 16 Relatórios: geração, narrativa, outbox de e-mail, XLSX |
| **V · Hermes** | 17 A outbox: estados, ordenação por falha, tentativas · 18 Flows e canais: catálogo, envio de teste, confirmação de entrega |
| **VI · Olympus (hub)** | 19 Painéis: como o hub lê cada app sem virar autoridade · 20 Desktop, extensões, voz, uso e documentos |
| **VII · Chiron** | 21 O Chiron na suíte (remete à apostila própria) |

### R.4 Autoria in-app (nova fase, entre F2 e F3 na ordem de execução)

O sistema de geração tem de existir dentro do app. **Uma** apostila de exemplo é gerada nele com a key do sistema; todo o conteúdo do catálogo é escrito aqui.

Restrição real medida: o `ai-proxy` limita a resposta a 2048 tokens. Uma seção de ~600 palavras com código cabe; um capítulo inteiro, não. O `lib/content/batch.ts` atual pede um capítulo por chamada e nunca funcionaria. Teste de 2026-10-23 (gemini-3.1-flash-lite, hospedado): sumário de 12 capítulos válido; seção com 423 palavras (abaixo do piso), clara, genérica, com um erro técnico.

- [x] Fluxo: tema → **sumário** gerado → pessoa edita/aprova → **uma chamada por seção** (com sumário e vizinhas como contexto) → passe de expansão se ficar abaixo do piso → exercícios e cards **por capítulo** → contrato → publicar. `lib/content/generator.ts` (puro, 12 testes) + `pages/Authoring.tsx` em `/apostila/nova`, com botão "Nova apostila com IA" no reader. O `batch.ts` antigo (capítulo por chamada) foi removido
- [x] Rascunho persistido e retomável (`generatorDrafts.ts`, só neste navegador até publicar); regenerar uma seção isolada; ver estado e palavras de cada seção; nova tentativa automática para erros transitórios (503 "high demand", 546 de limite da Edge Function, rede)
- [x] Publicação como `ai_generated`, exigindo o contrato estrutural; abaixo dele continua rascunho, com as violações listadas
- [x] **Badges de origem** (`components/OriginBadge.tsx`, ícone + contorno, não só cor) no dashboard, seletor do mapa (versão compacta), cabeçalho do reader, prática e revisão; os `<select>` nativos ganham o rótulo em texto
- [x] **Apostila de exemplo gerada no app** com a key do sistema (Gemini hospedado, `gemini-3.1-flash-lite`), pela própria tela: "Domínio de Expressões Regulares: Da Validação à Segurança" — 8 capítulos, 32 seções (740–790 palavras cada, quase todas com um passe de expansão), 24 exercícios, 32 cards, publicada sem violações e persistida (sobrevive a reload; o documento salvo inteiro, com ela, tem 263 mil caracteres). A revisão humana acrescentou 1 seção que o sumário da IA deixou faltando. Qualidade: clara e correta no geral, um degrau abaixo do Python. Levou ~1h30 por causa de 503/546 do modelo gratuito
- [x] CORS: o `ai-proxy` não lista `localhost:8120` no `ALLOWED_ORIGIN` (e o Chiron ainda não tem domínio de produção). Em vez de mexer no secret compartilhado, o `vite dev` encaminha `/__ai-proxy` pelo servidor (vite.config.ts + providers.ts). **No deploy, o domínio do Chiron entra no `ALLOWED_ORIGIN`** (tarefa recorrente do ROADMAP da suíte)

### R.5 Lacunas fora do conteúdo (reformuladas)

- [ ] **Revisão no dia 1**: o seed põe ~1.600 cards vencendo hoje; o teto `newCardsPerDay` existe nas Configurações mas não é aplicado na fila
- [ ] **Labs (F8)**: o painel "invariantes ao vivo" pinta vermelho porque a mutação *declara* que quebra — tem de rodar `snakeInvariants`/`marketInvariants` sobre o estado simulado; camadas de §9.2 completas; código real em vez de pseudocódigo; conclusão corrigida por rubrica; ponte camada ↔ seção da apostila; fluxo de aprovação de lab gerado
- [ ] **Pontes apostila → lab quebradas**: 14 fontes (JavaScript, TypeScript, React, Next.js, HTML, CSS, Tailwind, Vite, Vitest, PostgreSQL, MySQL, MariaDB, SQL Server, Supabase) têm `labref` para camadas que nunca foram construídas (ex.: `agora/postgresql-transaction-query-plan`). O contrato só checa que o bloco existe. `seeds/labrefs.test.ts` mantém a lista de pendentes; cada uma ganha a camada no F8 ou aponta para uma existente. PostgreSQL, Tailwind CSS, Vite e Vitest já apontam para camadas reais (saíram da lista). **O livro Chiron cita os arquivos de compositor apagados de PostgreSQL, Tailwind, Vite e Vitest** (`chironProse03.ts`, `chironSupplementCitations.ts`, `scripts/chiron-*.json`): corrigir na reescrita do Chiron
- [ ] **Aetheris (F9)**: histórico de ações guarda snapshot do documento inteiro no localStorage — guardar só o diff da ação
- [ ] **Ship (F11)**: bundle principal de 6,2 MB com todas as apostilas dentro e precache de 157 MB — carregar cada livro sob demanda e precachear só o shell. *2026-10-23*: com os livros reescritos o principal passou do teto de 6 MiB (6,82 MB) e o build quebrou; paliativo no padrão existente — chunks `book-postgresql` e `book-tailwind` — devolveu o principal a 5,89 MB. A solução real (carregar sob demanda) continua pendente, e cada livro reescrito vai pressionar o teto de novo
- [ ] **Ambiente de verificação (2026-10-23)**: o disco C: está com ~1,1 GB livre. O teste do MySQL baixa o MySQL 8.4.11 e falha ao extrair o zip no Temp ("Unable to write file"), estourando os 300 s; o do Ubuntu falha ao iniciar o WSL. Não é regressão de código — liberar espaço antes de confiar na suíte inteira
- [ ] Texto do modo visitante ("o progresso não será salvo") está errado: o progresso é salvo neste navegador
- [ ] Passe visual e de acessibilidade (§12) continua pendente
- [ ] Sincronizar os checkboxes de §9–§12 com o código real

---

### Apostila Oracle Cloud — concluída e publicada (2026-09-30)

- [x] Oracle Cloud: 12 capítulos, 48 seções ≥600 palavras, 96 exemplos JSON/JavaScript verificados localmente, 36 exercícios e 48 cards; materializada em `runSeed()`.
- [x] Contratos e auditoria editorial local: densidade, 12/48/36/48, 96 códigos, similaridade de seções <42%, cards <78%, exercícios detalhados e zero snippets duplicados.
- [x] `npx vitest run src/lib/study/seeds/content/oracleCloud.test.ts --maxWorkers=1 --reporter=verbose`, `npm run typecheck` e `npm run build` verdes.
- [ ] OCI tenancy/IAM/data plane, DNS/edge e providers reais: requerem sandbox isolado; permanecem Pending, sem simulação por instalação de infraestrutura.

## 1. Decisões ratificadas nesta review

### Apostila Olympus — concluída e integrada (2026-10-20)

- [x] Fonte guarda-chuva inteira após Chiron: 12 capítulos, 48 seções, **36.829 palavras** (30.568 de narrativa principal independente), mínimo **602**, 96 exemplos verificáveis, 36 exercícios próprios e 48 flashcards; oito capítulos comuns e quatro de particularidades, 21 diagramas, guias dos 13 documentos do olympus-plan, citações e extensão. Scope documental explícito, sem prometer nova cobertura integral de cada export dos seis apps.
- [x] 96/96 programas reais Node v24.13.0: 68 chamadas de módulos e 28 inspeções de fonte, todos com assert nativo, oráculo literal e hashes de corpo/fonte/harness. Sem infraestrutura ou serviço simulado; efeitos remotos/UI não ensaiados permanecem limitados nas legendas.
- [x] Contratos/editorial sem violações; mínimo 602, similaridade de seções 7.845745%, cards 3.636364%, exercícios detalhados 100%, código duplicado zero. Testes focados finais 158/158.
- [x] Typecheck app/config e build/PWA aprovados: 58 entradas / 157.371,27 KiB, principal 6220794 bytes e livro 464130 bytes precached abaixo de 6 MiB; sem deploy ou alteração de limite.
- [x] Regressão aplicável: Test Files  115 passed | 5 skipped (120); Tests  2048 passed | 19 skipped (2067); 337.14s (transform 8.04s, setup 0ms, collect 13.42s, tests 268.60s, environment 21ms, prepare 24.57s). Exclusão explícita somente de ubuntuLinux.examples.test.ts: 96 casos WSL não executados. Os 5 arquivos/19 skips históricos não contam como aprovações. Suíte global completa não declarada verde.
- [x] Placeholders legados Olympus/Chronos/Kairos/Pluto/Hermes filtrados conforme o guarda-chuva; Chiron curada própria preservada. Integração única e ordem testadas. Batch ai-product completo; 33/46 fontes curadas, catálogo ainda incompleto. Não iniciar outra nesta rodada; na próxima, reavaliar pendências em ordem do rollout, começando por Spring Boot. Automação continua ativa.
- [ ] Integração nativa de browser/cloud/desktop/entrega não ensaiada não é aprovada por esta apostila. Drift de chaves Chiron, deep links, calendário, ack/retry, CORS/rate limit e versões está explícito em olympusVerification.md.

### Apostila Chiron — concluída e integrada (2026-10-19)

- [x] Fonte repo inteira após jQuery: 12 capítulos, 48 seções, **124.053 palavras**, mínimo **600**, 96 exemplos, 36 exercícios e 48 flashcards; porque/quebraria e Lab Ágora. 607 arquivos documentados, 406 funções/componentes públicos com subseções próprias (48 principais + 358 complementares), 455 guias de módulo e 41 diagramas (40 sistemas + arquitetura). Extensão por área e referências reais, revisão integral por hashes.
- [x] 96/96 exemplos publicados executados com imports reais e assert nativo em Node v24.13.0 Windows; oráculos literais e SHA-256 conferidos. Sem infraestrutura instalada; efeitos de browser/GPU/serviços remotos não são atestados por esses programas.
- [x] Contratos/editorial sem violações; piso 600 preservado. Similaridade máxima 1.261034%, cards 0%, exercícios detalhados 100%, duplicação zero. Testes focados 3 arquivos/116 aprovações.
- [x] Typecheck e build/PWA aprovados: 54 entradas / 138.693,02 KiB; ambos os chunks finais offline abaixo de 6 MiB. Sem deploy, commit ou mudança de limites.
- [x] Regressão local aplicável: Test Files  114 passed | 5 skipped (119); Tests  1949 passed | 19 skipped (1968); 343.98s (transform 4.13s, setup 0ms, collect 7.58s, tests 308.39s, environment 15ms, prepare 11.62s). Exclusão explícita somente de ubuntuLinux.examples.test.ts (96 casos WSL não executados). Os 5 arquivos/19 skips históricos não representam aprovações. Suíte global completa não declarada verde.
- [x] Integração única em runSeed, ordem após jQuery e kind repo testados. 32 fontes curadas; ai-product segue em andamento. Naquele marco Olympus não estava iniciada; sua conclusão posterior consta no registro acima. Automação permanece ativa porque o catálogo não terminou. Ver chironVerification.md e scripts/chiron-* para evidência e limites.

### Apostila jQuery — concluída e integrada (2026-10-06)

- [x] Fonte inteira após Google AI Studio: 12 capítulos, 48 seções, **31.527 palavras**, mínimo **625**, 96 exemplos, 36 exercícios próprios e 48 flashcards; porque/quebraria e Lab Ágora / reserva-estoque-concorrencia. Autoria específica sem importar prosa de outra fonte.
- [x] 96/96 programas reais em Edge headless **154.0.4258.53**, jQuery completo **4.0.0**, Node v24.13.0 Windows x64. DOM, eventos programáticos, layout, serialização, Deferred/Callbacks/queue, plugin authored e Ajax HTTP de loopback executados. Oracles independentes, mutants e 96 SHA-256 finais reconferidos. Artefato oficial e licença preservados; nenhuma dependência ou infraestrutura instalada, perfil do usuário não utilizado.
- [x] Contratos/auditoria e integridade de evidência 98/98. Seções 41,247002% (<42%), cards 4,545455% (<78%), exercícios detalhados 100%, pares similares e snippets duplicados zero. Primeira auditoria 44,611907% corrigida por remoção de orientação comum redundante; prosa específica, piso 600 e thresholds preservados, log inicial retido.
- [x] 40 páginas oficiais atuais consultadas e salvas em scripts/jquery-docs. Revisão semântica distingue coleção/nó, traversal, text/html, remove/detach/clone, attr/prop/data, classes/unidades/caixas, delegação/namespace/one, controles bem-sucedidos, conversão JSON/status, resposta obsoleta, liquidação/fila, ownership e migração quatro.
- [x] Typecheck da aplicação (`pnpm typecheck`, tsconfig.app.json) e build/PWA aprovados. Principal **6.086,24 kB** (gzip 2.048,71), book-jquery **314,50 kB** (gzip 58,08), precache **52 entradas / 131.357,89 KiB**; chunks finais presentes offline, teto **6 MiB** preservado. Assets anteriores retidos; sem deploy externo. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem.
- [x] Regressão local aplicável aprovada: **112 arquivos / 1850 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 330.91 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts; seus 96 casos WSL não executados não contam como aprovações ou novos skips. WSL permanece gate independente, suíte global completa não anunciada como verde. Assertions, timeouts e thresholds preservados. Os 96 digests finais jQuery foram reconferidos contra a execução nativa Edge aprovada; testes de integridade do corpus não são apresentados como nova execução de browser.
- [ ] Browsers adicionais, interação confiável/teclado/leitor de tela, CSP/Trusted Types do produto, variantes slim/Migrate/noConflict completo, plugins terceiros, integração React efetiva, auth/CORS remoto e backend/Lab concorrente durável permanecem Pending onde não executados. Predicados comerciais são modelos seriais, não prova de autorização ou estoque remoto. Ver src/lib/study/seeds/content/jqueryVerification.md e scripts/jquery-*.
- [x] Integrada uma única vez em runSeed() imediatamente após Google AI Studio, kind stack, placeholder legado filtrado e unicidade/ordem testadas. Batch ai-product em andamento. Naquele marco Chiron e Olympus ainda não iniciadas; Chiron foi concluída posteriormente no registro acima. Catálogo incompleto, automação permanece ativa.

### Apostila Google AI Studio — concluída e integrada (2026-10-05)

- [x] Fonte inteira após Lovable: 12 capítulos, 48 seções, **31.078 palavras**, mínimo **624**, 96 exemplos, 36 exercícios próprios, 48 flashcards, porque/quebraria e Lab Ágora / reserva-estoque-concorrencia; prosa específica sem importar outra fonte.
- [x] 96/96 JavaScript reais Node v24.13.0 Windows x64: 30 local-rule, 32 local-transform, 34 model; oracles independentes, mutants e 96 SHA-256 finais reconferidos. VM para fixtures confiáveis, não sandbox adversarial; nenhum runtime/SDK/provider fingido ou infraestrutura instalada.
- [x] Contratos/corpus 98/98; piso 600 inalterado, seções 35,158057% (<42%), cards 7,692308% (<78%), exercícios detalhados 100%, pares altamente similares e snippets duplicados zero.
- [x] Documentação oficial atual: 28 páginas primárias com snapshots HTML. Revisão distingue GenerateContent/Interactions, signatures, JSON/schema/domínio, bytes de multimodal, grounding, Python nativo versus JavaScript local, Live/tokens efêmeros, Build server/Firebase/Cloud Run e concorrência. Retry corrigido para defer quando janela excede teto antes da execução final.
- [x] Typecheck da aplicação (`pnpm typecheck`, tsconfig.app.json) e build/PWA aprovados. Principal **6.086,12 kB** (gzip 2.048,66), book-google-ai-studio **320,47 kB** (gzip 64,09), precache **50 entradas / 124.967,12 KiB**; chunks finais presentes offline e teto **6 MiB** preservado. Assets anteriores retidos; build local, sem deploy externo. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem.
- [x] Regressão local aplicável aprovada: **110 arquivos / 1751 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 288.74 s, maxWorkers=1. Somente ubuntuLinux.examples.test.ts excluído explicitamente; seus 96 casos WSL não foram executados, não são aprovações nem novos skips. WSL é gate independente; suíte global completa não anunciada como verde. Assertions, timeouts e thresholds preservados; 96 digests finais reconferidos.
- [ ] Playground/Build/agente, modelos/conta, inferência/avaliação, tokens/cache, multimodal, ferramentas/signatures/grounding/Python, SDK/Live, segurança nativa, Firebase/OAuth/Git sync/Cloud Run/billing/acessibilidade e backend/Lab concorrente durável permanecem Pending operacionalmente. Ver src/lib/study/seeds/content/googleAiStudioVerification.md e evidências/logs scripts/ai-studio-*.
- [x] Integrada uma única vez em runSeed() imediatamente após Lovable, com exclusão do placeholder legado e teste de unicidade/ordem; ai-product continua em andamento. Escopo encerrado somente nesta fonte. Naquele marco jQuery ainda não iniciada; sua conclusão posterior está registrada acima; catálogo incompleto, automação permanece ativa.

### Apostila Lovable — concluída e integrada (2026-10-05)

- [x] Fonte inteira após OpenCode: 12 capítulos, 48 seções, **33.962 palavras**, mínimo **690**, 96 exemplos, 36 exercícios próprios e 48 flashcards; porque/quebraria e Lab Ágora / reserva-estoque-concorrencia. Autoria específica, sem importar prosa de outra fonte.
- [x] 96/96 JavaScript reais Node v24.13.0 Windows x64: 36 local-rule, 28 local-transform, 32 model; oracles independentes, mutants específicos e 96 SHA-256 finais reconferidos. VM para fixtures confiáveis, não sandbox adversarial. Nenhuma infraestrutura ou helper Lovable fingido.
- [x] Contratos/corpus 98/98; piso 600 inalterado, seções 39,913855% (<42%), cards 4,081633% (<78%), exercícios detalhados 100%, pares altamente similares e snippets duplicados zero. Primeira auditoria 43,779528% corrigida por 48 análises específicas, com log inicial preservado e sem diminuir limites.
- [x] Documentação oficial atual consultada: Chat/Plan/Build, Knowledge/skills, preview/design, React/Vite antigo versus TanStack Start, Cloud/RLS/auth/storage/secrets/functions, connectors, testing/scans/logs, Git sync, histórico/draft/remix, publicação/domínio/custo. Draft compartilha dados reais; histórico de código não reverte dados; HMAC, URL, contraste, custo e estoque locais têm limites explícitos.
- [x] Typecheck da aplicação (`pnpm typecheck`, tsconfig.app.json) e build/PWA aprovados. Principal **6.085,98 kB** (gzip 2.048,60), book-lovable **333,03 kB** (gzip 65,80), precache **48 entradas / 118.570,95 KiB**; chunk Lovable e principal finais presentes offline, teto **6 MiB** preservado. Assets anteriores retidos; build local, sem deploy externo. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem.
- [x] Regressão local aplicável aprovada: **108 arquivos / 1652 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 359.81 s, maxWorkers=1. Somente ubuntuLinux.examples.test.ts excluído explicitamente: seus 96 casos WSL não foram executados, não são aprovações nem novos skips. WSL é gate independente; a suíte global completa não é anunciada como verde. Thresholds, assertions e timeouts preservados. Os 96 digests finais Lovable foram reconferidos contra a execução aprovada.
- [ ] Editor/agente/preview Lovable, Cloud/RLS/contas/storage/secrets/functions, connector/OAuth/webhook, sync/draft/remix/restore, SSR/acessibilidade, scan nativo, publicação/domínio/billing e Lab durável concorrente permanecem Pending operacionalmente. Ver src/lib/study/seeds/content/lovableVerification.md, evidências e logs em scripts.
- [x] Fonte inteira integrada em runSeed() uma única vez imediatamente após OpenCode; placeholder legado Lovable excluído e teste de unicidade/ordem preservado. Batch ai-product em andamento. Naquele marco, escopo encerrado em Lovable e Google AI Studio não iniciada; sua conclusão posterior está registrada acima. Catálogo incompleto, automação permanece ativa.

### Apostila OpenCode — concluída e integrada (2026-10-05)

- [x] Fonte inteira após GitHub Copilot: 12 capítulos, 48 seções, 31.418 palavras de prosa, mínimo individual 635, 96 exemplos, 36 exercícios próprios e 48 flashcards; porque/quebraria e Lab Ágora / reserva-estoque-concorrencia.
- [x] Corpus 96/96 Node v24.13.0 Windows x64: 48 regras locais, 30 transformações, 18 modelos; oracles independentes, mutants específicos e SHA-256 dos códigos finais reconferidos. Nenhum helper, SDK, provider ou infraestrutura fingidos.
- [x] Contratos/corpus 98/98 e auditoria sem violações: seções 38,764479% (<42%), cards 4,166667% (<78%), exercícios detalhados 100%, pares altamente similares e snippets duplicados zero. Piso 600, assertions, timeouts e thresholds preservados. Erros de escape newline corrigidos na autoria e corpus inteiro reexecutado.
- [x] Typecheck e build/PWA aprovados: principal **6.085,87 kB**, book-opencode **325,07 kB** (gzip 62,73), precache **44 entradas / 105.754,72 KiB**, chunk OpenCode offline e teto **6 MiB** preservado. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem. Build gera artefatos locais, sem deploy externo.
- [x] Regressão local final aprovada: **106 arquivos / 1553 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 326.94 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não contam como aprovações nem novos skips. Nenhum teste, assertion, timeout ou threshold foi reduzido. A suíte global completa não é chamada de verde. Todos os 96 digests finais OpenCode foram reconferidos contra a execução aprovada.
- [x] CLI disponível: opencode --version observou 1.18.5 e opencode run --help retornou ajuda nativa com exit code zero. Apenas metadados; nenhuma sessão de modelo, provider ou servidor iniciados.
- [ ] TUI/CLI/web/IDE em tarefa real, config/regras/agents/skills/permissions nativos, MCP/plugins/custom tools, servidor/SDK/GitHub, undo/share/cancelamento, privacidade/custo/acessibilidade e backend/Lab durável concorrente permanecem Pending como execução. Ver src/lib/study/seeds/content/opencodeVerification.md, scripts/opencode-evidence.json, opencode-editorial-evidence.json e logs.
- [x] Batch Ferramentas de IA completo editorialmente no rollout. Aquele marco encerrou somente OpenCode; Lovable ainda não estava iniciada. Sua conclusão posterior está registrada acima. Catálogo ainda incompleto, automação permanece ativa.

### Apostila GitHub Copilot — concluída e integrada (2026-10-05)

- [x] Fonte inteira após Claude Code: 12 capítulos, 48 seções, 31.443 palavras de prosa, mínimo individual 623, 96 exemplos, 36 exercícios próprios e 48 flashcards; porque/quebraria e Lab Ágora / reserva-estoque-concorrencia.
- [x] Corpus 96/96 Node v24.13.0 Windows x64: 50 regras locais, 28 transformações e 18 modelos, oracles independentes e mutants específicos. SHA-256 dos códigos finais reconferidos; nenhum helper, runtime/provider ou infraestrutura fictícia.
- [x] Contratos/corpus 98/98; auditoria sem violações: seções 37,406855% (<42%), cards 4,166667% (<78%), exercícios detalhados 100%, pares altamente similares e código duplicado zero. Piso 600 e thresholds preservados. Frame redundante removido após primeira auditoria, sem reduzir prosa específica ou limiar.
- [x] Typecheck e build/PWA aprovados: principal **6.085,74 kB**, book-github-copilot **324,95 kB** (gzip 65,45), precache **41 entradas / 93.280,08 KiB**, chunk Copilot offline e teto **6 MiB** preservado. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem. Build gera artefatos locais, sem deploy externo.
- [x] Regressão local final aprovada: **104 arquivos / 1454 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 349.43 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não contam como aprovações nem novos skips. Nenhum teste, assertion, timeout ou threshold foi reduzido. A suíte global completa não é chamada de verde. Todos os 96 digests finais de GitHub Copilot foram reconferidos contra a execução aprovada.
- [ ] Superfícies Copilot nativas/remotas (IDE, conta/modelo, instruções, inline/next edit, Chat, skills, cloud/setup/PR/review, CLI/permissões, MCP/hooks/firewall, acessibilidade/custo/privacidade) e backend/Lab durável concorrente permanecem Pending como execução. Corpus local não atesta enforcement ou chamadas remotas. Reprodução e revisão semântica em src/lib/study/seeds/content/githubCopilotVerification.md; evidências scripts/githubCopilot-evidence.json e githubCopilot-editorial-evidence.json.
- [x] Aquele marco concluiu somente GitHub Copilot; OpenCode ainda não estava iniciada. Sua conclusão posterior está registrada acima.

### Apostila Claude Code — concluída e integrada (2026-10-03)

- [x] Fonte inteira após Cursor: 12 capítulos, 48 seções, 34.758 palavras de prosa, mínimo individual 692, 96 exemplos, 36 exercícios e 48 flashcards, porque/quebraria e Lab Ágora / reserva-estoque-concorrencia.
- [x] Corpus 96/96 Node v24.13.0 Windows x64: 62 regras locais, 22 transformações, 12 modelos seriais; digests SHA-256 dos códigos finais reconferidos. Nenhum helper de agente, runtime, provider ou infraestrutura instalado/fingido.
- [x] Contratos/corpus 98/98; auditoria sem violações: seções 37,415882% (<42%), cards 3,921569% (<78%), exercícios detalhados 100%, duplicação de snippets zero. Piso 600, assertions, timeouts e thresholds preservados.
- [x] Typecheck e build/PWA aprovados: principal 6.085,63 kB, book-claude-code 350,57 kB (gzip 71,75), precache 39 entradas/86.879,66 KiB, chunk offline e teto 6 MiB mantido; warnings históricos de chunks/Supabase.
- [x] Regressão local final aprovada: **102 arquivos / 1355 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 230.87 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não são contabilizados como aprovações ou novos skips. Nenhum teste, assertion, timeout ou threshold foi reduzido para contornar a indisponibilidade. A suíte global completa não é chamada de verde. Todos os 96 digests finais de Claude Code foram reconferidos contra a execução aprovada.
- [ ] CLI/IDE/web/provider e conta reais, CLAUDE.md/auto memory/regras/skills/subagentes/hooks nativos, permissões/sandbox/MCP, checkpoint/print/stream e recuperação reais, privacidade/custo/acessibilidade e backend/Lab concorrente/durável/publicação operacional: Pending como execução. Predicados, parsers e modelos locais não atestam essas superfícies. Reprodução em src/lib/study/seeds/content/claudeCodeVerification.md e evidências scripts/claudeCode-evidence.json e scripts/claudeCode-editorial-evidence.json.
- [x] A autorização daquele marco encerrou somente Claude Code integral. GitHub Copilot ainda não havia sido iniciada; sua conclusão posterior está registrada acima.

### Apostila Cursor — concluída e integrada (2026-10-03)

- [x] Fonte inteira após Integração de IA (LLM): 12 capítulos, 48 seções, 34.411 palavras, mínimo 689, 96 exemplos, 36 exercícios, 48 flashcards, porque/quebraria e referência Lab Ágora / reserva-estoque-concorrencia.
- [x] Corpus 96/96 Node v24.13.0 Windows x64: 58 regras locais, 22 transformações, 16 modelos seriais. SHA-256 dos códigos finais reconferidos; nenhum helper Cursor, runtime, provider ou infraestrutura instalado/fingido.
- [x] Corpus/contratos 98/98; auditoria sem violações: similaridade de seções 34,230504% (<42%), cards 8,510638% (<78%), exercícios detalhados 100%, snippets duplicados zero. Piso 600, assertions e thresholds preservados.
- [x] Typecheck e build/PWA aprovados: principal 6.085,52 kB, book-cursor 351,46 kB (gzip 75,18), precache 37 entradas/80.452,96 KiB, chunk Cursor offline, teto de 6 MiB preservado; warnings históricos de chunks e Supabase.
- [x] Regressão local final aprovada: **100 arquivos / 1256 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 224.19 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não são contabilizados como aprovados ou novos skips. Nenhum teste, assertion, timeout ou threshold foi alterado para contornar essa indisponibilidade. A suíte global completa permanece com limitação independente de WSL e não é chamada de verde. Todos os 96 digests finais de Cursor foram reconferidos contra a execução aprovada.
- [ ] Editor/inline/regras/indexação nativos, checkpoint, comandos/aprovação/sandbox/ignore efetivos, CLI/hooks/MCP/Cloud Agents, modelos/conta/políticas/transmissão, acessibilidade, backend concorrente/durável/Lab real e publicação operacional: Pending como execução; corpus local não atesta essas superfícies. Reprodução e referências em src/lib/study/seeds/content/cursorVerification.md.
- [x] A solicitação daquele marco autorizou somente Cursor. Claude Code ainda não havia sido iniciada; sua conclusão posterior está registrada acima. Autorização de Office/LLM registrada abaixo é histórica.

### Apostila Integração de IA (LLM) — concluída e integrada (2026-10-03)

- [x] Fonte inteira após Pacote Office: 12 capítulos, 48 seções, 30.796 palavras (mínimo 605), 96 exemplos JavaScript, 36 exercícios e 48 flashcards, porque/quebraria e Lab Ágora.
- [x] Corpus 96/96 Node v24.13.0 Windows x64: 68 regras, 16 transformações e 12 modelos seriais. Digests dos textos finais reconferidos; nenhum modelo, provider, SDK, tokenizer ou infraestrutura instalado/fingido.
- [x] Contratos/corpus 98/98; auditoria sem violações: similaridade 31,114809% (<42%), cards 6,666667% (<78%), exercícios detalhados 100%, código duplicado zero. Piso 600 e thresholds preservados.
- [x] Typecheck e build/PWA aprovados: principal 6.085,41 kB, book-llm 302,67 kB, book-office 322,64 kB, precache 35 entradas/74.026,11 KiB; chunks offline e teto 6 MiB preservados.
- [x] Regressão local final aprovada: 98 arquivos/1157 testes passed, 5 arquivos/19 testes skipped preexistentes, 223.17 s, maxWorkers=1. Exclusão explícita somente de ubuntuLinux.examples.test.ts: seus 96 casos WSL não foram executados, não são contabilizados como aprovados ou novos skips. A suíte global completa permanece com falha independente de WSL, não é chamada de verde. Office/LLM e demais casos Windows foram exercitados sem mudar timeouts, assertions ou thresholds.
- [ ] Providers/respostas reais, embeddings/índice/RAG, stream/rate limit, UI/tutor, tools/autorização reais, persistência/concorrência/restore, dataset de respostas reais, pesquisa e release operacional: Pending. Reprodução/referências/escopos em src/lib/study/seeds/content/llmVerification.md, scripts/llm-evidence.json e scripts/llm-editorial-evidence.json.
- [x] Solicitação anterior encerrada nas duas fontes então autorizadas: Office e LLM integrais. Cursor ainda não havia sido iniciada naquele marco; sua conclusão posterior está registrada acima.

### Apostila Pacote Office — concluída e integrada (2026-10-03)

- [x] Fonte inteira após Figma: 12 capítulos, 48 seções, 33.291 palavras (mínimo 659), 96 exemplos, 36 exercícios e 48 flashcards; Lab Ágora.
- [x] 96 exemplos JavaScript locais: 44 regras, 30 transformações, 4 geometrias e 18 modelos seriais. Digests finais reconferidos; nenhum Office/API falso ou infraestrutura instalada.
- [x] Auditoria sem violações: similaridade 28,441755% (<42%), cards 0% (<78%), exercícios detalhados 100%, código duplicado zero; piso 600 e thresholds preservados.
- [x] Corpus/contratos 98/98, focados com integração/editorial 110/110, typecheck e build/PWA aprovados. Regressão local Windows: 96 arquivos/1.058 testes passed, 5 arquivos/19 testes skipped preexistentes, 222,30 s, maxWorkers=1. Comando exclui explicitamente somente ubuntuLinux.examples.test.ts, cujo executor WSL travou; 96 casos Ubuntu não foram executados nesta regressão. A suíte global completa anterior permanece Failed, não foi reclassificada como aprovada. Nenhum teste, timeout ou threshold foi alterado. Principal 6.085,31 kB, book-office 322,64 kB, precache 33 entradas/67.647,14 KiB; ambos os chunks offline.
- [ ] Editores, fórmulas, refresh, rendering, acessibilidade, VBA/Office Scripts, ACE, tenant, mensagens e sincronização reais permanecem Pending. Evidências/reprodução em scripts/office-evidence.json, scripts/office-editorial-evidence.json e src/lib/study/seeds/content/officeVerification.md.
- [x] Autorização daquele marco: concluir Office e depois somente Integração de IA (LLM). A nova solicitação posterior autorizou Cursor, concluída conforme registro acima.

### Apostila Figma — concluída e integrada (2026-10-01)

- [x] Fonte inteira integrada ao runSeed() imediatamente após N8N, somente ao finalizar o corpus: 12 capítulos, 48 seções autorais, 29.765 palavras (mínimo 601; piso 600), 96 exemplos JavaScript, 36 exercícios e 48 flashcards; Lab Ágora / reserva-estoque-concorrencia.
- [x] Corpus 96/96 no Node v24.13.0, Windows x64: 51 regras locais, 10 transformações, 21 geometrias e 14 modelos sequenciais. Assertions e mutantes específicos; nenhum editor/helper/provider Figma fingido ou infraestrutura instalada.
- [x] Contratos e auditoria sem violações: similaridade máxima de seções 0,640512% (<42%), cards 0% (<78%), exercícios detalhados 100% (≥65%), código duplicado zero. Thresholds preservados.
- [x] Corpus/contratos 98/98; integração/editorial 109/109; typecheck e build/PWA aprovados. Chunk book-figma mantém a fonte offline e o teto de 6 MiB por arquivo. Build/PWA aprovado: principal 6.085,20 kB, book-figma 294,03 kB, precache 31 entradas/61.247,69 KiB. Suíte global: 95 arquivos/1.055 testes passed, 5 arquivos/19 testes skipped preexistentes, 154,85 s; nenhum skip de Figma.
- [x] Digests do código final em scripts/figma-evidence.json; métricas em scripts/figma-editorial-evidence.json; reprodução, referências e limites em src/lib/study/seeds/content/figmaVerification.md.
- [ ] Editor/layout/fontes/components/variables/protótipos nativos, libraries/branches, Dev Mode/Code Connect, export/rendering, Plugin/REST/IA, sharing, teclado/tecnologia assistiva, pesquisa e backend concorrente: Pending sem ensaio real autorizado. Evidência local não atesta essas superfícies.
- [x] Solicitação concluída somente em Figma integral; Pacote Office não iniciada. Registros de solicitações anteriores abaixo são históricos.

### Apostila N8N — concluída e integrada (2026-10-01)

- [x] Fonte inteira em runSeed(), imediatamente após Ubuntu / Linux: 12 capítulos, 48 seções autorais, 35.011 palavras de prosa (mínimo 707; piso vigente 600), 96 exemplos JavaScript, 36 exercícios específicos, 48 flashcards e Lab Ágora / reserva-estoque-concorrencia.
- [x] Corpus 96/96 executado no Node v24.13.0, Windows x64: 45 regras locais, 17 transformações locais e 34 modelos sequenciais. Assertions e mutantes detectam falhas específicas. Sem helpers, motor ou providers n8n; nenhum runtime ou dependência instalado.
- [x] Contratos/editorial sem violações: similaridade máxima de seções 1,231527% (<42%), cards 5,405405% (<78%), exercícios detalhados 100% (≥65%) e código duplicado zero. Thresholds preservados.
- [x] Gates focados 108/108 e corpus/contratos 98/98; typecheck e build/PWA aprovados. Evidência com digest do texto final em scripts/n8n-evidence.json; métricas em scripts/n8n-editorial-evidence.json; reprodução, referências primárias e matriz de escopo em src/lib/study/seeds/content/n8nVerification.md.
- [x] Suíte global pnpm exec vitest run --maxWorkers=2 --reporter=dot aprovada: 93 arquivos/956 testes passed, 5 arquivos/19 testes skipped preexistentes, 148,71 s; nenhum skip introduzido para N8N.
- [ ] Motor/editor/import/helpers nativos, publicação/triggers/Wait/aprovação, HTTP/credentials/IA reais, banco/outbox/broker/concorrência, RBAC/SSRF/runners, queue/carga/observabilidade/paging e restore/upgrades/RPO/RTO permanecem Pending sem ensaio real isolado. Attestation cobre somente os exemplos nos escopos dos captions.
- [x] Escopo desta solicitação encerrado em N8N integral; Figma e Pacote Office não foram iniciadas. Registros anteriores abaixo são históricos.

### Apostila Ubuntu / Linux — concluída e integrada (2026-10-01)

- [x] Fonte inteira integrada ao `runSeed()` após Oracle Cloud: 12 capítulos, 48 seções, 33.743 palavras de prosa (mínimo observado 676; piso vigente 600), 96 exemplos, 36 exercícios, 48 flashcards e Lab Ágora. Rascunhos anteriores preservados e fora dos imports.
- [x] Contratos e auditoria editorial: zero violações; similaridade máxima de seções 0,430416% (<42%), cards 0% (<78%), exercícios detalhados 100% (≥65%), código duplicado zero. Nenhum threshold alterado.
- [x] 96/96 exemplos analisados e executados em Ubuntu 24.04.4 WSL2 existente: 40 operações locais reais, 53 modelos identificados, 3 parsers nativos. Corpus/editorial 98/98; seed/editorial 8/8; typecheck e build/PWA verdes. Evidências em `scripts/ubuntu-linux-evidence.json`, `scripts/ubuntu-linux-editorial-evidence.json` e `src/lib/study/seeds/content/ubuntuLinuxVerification.md`.
- [x] Build com principal 5.766,32 kB e precache 27 entradas/42.736,07 KiB; somente warnings conhecidos de chunks e Supabase. Nenhuma infraestrutura ou dependência instalada.
- [x] Suíte global `pnpm exec vitest run --maxWorkers=2 --reporter=dot`: 91 arquivos/857 testes aprovados, 5 arquivos/19 testes skipped preexistentes, 208,42 s. Ubuntu/Linux sem skips; nenhum gate relaxado.
- [ ] Boot convencional/console, runtime systemd/timers, enforcement de rede/segurança, block devices, containers, HA/broker/banco/outbox duráveis, cloud/Ansible/CI e restore/RPO/RTO de serviço: Pending sem ensaio isolado real. A attestation cobre o corpus no escopo de cada caption, nunca esses gates não executados.
- [x] Escopo mantido somente em Ubuntu/Linux; nenhuma outra apostila iniciada.

- [x] **Paleta: Iron Gall.** Tinta azul-preta `#141C26` + rubrica `#D64545`. Sépia+carmim sai.
- [x] **Âncora 3D: armilar do arco de Quíron.** Livro 3D sai; o token 2D deriva da armilar.
- [x] **Labs são primeira classe E casados com as apostilas.** Rota própria `/labs` + `/labs/:id`, terceira categoria no dashboard, e deep-link bidirecional com os capítulos de apostila.
- [x] **`/progress` morre.** Estatísticas viram parte real do dashboard, não uma aba separada.
- [x] **Fim da redundância de títulos.** Eyebrow + H1 + subtítulo épico → um H1 funcional.
- [ ] Refletir tudo isso em `olympus-plan/CHIRON.md` (decisão #3) e na tabela de identidade do `SUITE-ARCHITECTURE.md` §5.
- [ ] Corrigir `SUITE-ARCHITECTURE.md` §3a: a frase *"Chiron has no equivalent gap to close — its Aetheris is read-only"* deixa de valer quando o Chiron ganhar vocabulário de ações.

---

## 2. F0 — Identidade visual

### 2.1 Tokens (`index.css`)

```
                      CLARO                    ESCURO ("Scriptorium Atelier")
background        #F7F4EE pergaminho       hsl(215 28% 6%)  azul-preto
foreground        #141C26 tinta            hsl(210 16% 90%)
primary           #141C26                  rubrica (assume a liderança no escuro)
primary-deep      #0B1017                  —
secondary/accent  #D64545 rubrica          #E05555
secondary-soft    #E8756F                  #F08A84
sidebar-bg        #0B1017                  hsl(215 30% 5%)
destructive       #B23A2E (compartilhado da suíte — INALTERADO)
```

**Regra de colisão rubrica × destructive.** Sendo honesto sobre o tamanho do problema: rubrica `#D64545` é hue 0 e destructive `#B23A2E` é hue 8 — **8° de distância, praticamente o mesmo matiz**. A separação real vem de luminosidade e saturação (L 56% vivo × L 44% tijolo dessaturado) e, principalmente, de contexto mutuamente exclusivo:

- rubrica **nunca** em botão/texto de excluir
- destructive **nunca** em título, eyebrow, série de gráfico ou estado de maestria
- os dois **nunca** adjacentes no mesmo componente

`destructive` fica em `#B23A2E` porque é compartilhado pela suíte inteira — não é nosso para mudar. Se na prática confundir, a saída é escurecer/dessaturar mais o destructive **só no Chiron**, não mexer na rubrica.

- [x] Reescrever o bloco `:root` e `.dark`
- [x] Renomear `--gradient-crimson`/`--shadow-crimson` → `--gradient-rubric`/`--shadow-rubric`
- [x] `lib/color.ts` com `alpha(hex, n)` central (a suíte manda: nada de sufixo hex inline copiado) + `chipStyle()` + rampa ordenada de maestria
- [x] Escala categórica de gráficos (`--chart-1..6` + `CHART_SERIES`, independente do accent de marca) — **ainda assim, carregar a skill `dataviz` antes de escrever a primeira linha de gráfico na F4**
- [x] Corrigir `bg-cyan` órfão em `AppLayout`/`ProfileDialog` (herança de copy-paste do Hermes: não existe token `cyan` no Tailwind daqui, então o avatar não tinha fundo nenhum) e trocar `text-primary-deep` por `text-secondary-foreground`, que no escuro era vermelho sobre vermelho

### 2.2 Marca e token

- [x] `ChironMark`: anel meridiano + anel equatorial inclinado + eixo polar que é a própria flecha + empenagem. Silhueta de círculo cortado, legível a 16px
- [x] `public/favicon.svg` sobre ladrilho de tinta sólido (o antigo era só stroke, sumia em aba clara)
- [x] `theme-color` do `index.html` → `#0B1017`
- [ ] Ícones PWA / `apple-touch-icon` / `og:image` regenerados (`sharp` já está no projeto)

### 2.3 Armilar 3D (`components/three/Armillary.tsx`)

- [x] 3 torus em eixos X/Y/Z com rotações desacopladas e velocidades sem múltiplo comum pequeno (nunca "batem" o loop)
- [x] Haste-flecha atravessando o centro (cilindro + cone rubrica emissivo + 3 empenas)
- [x] Nós de luz emissivos pulsando nos cruzamentos dos anéis
- [x] Material: metal escovado frio nos anéis, rubrica emissiva nos nós
- [x] `ResizeFix` preservado com o comentário original (documenta um bug real do r3f) + nota nova explicando por que **não** endurecê-lo
- [x] Fallback 2D **só** com `prefers-reduced-motion` ou falha de WebGL (`components/three/Anchor.tsx`)
- [x] Deletar `Tome.tsx`

### 2.4 Login

- [x] Painel esquerdo roda a armilar 3D (mostrava a marca 2D a 160px sem motivo)
- [x] Fallback 2D só nas condições acima, via o mesmo `Anchor`

**Estado da F0:** typecheck limpo, 44 testes passando, build de produção OK, console sem erros. **Não verificado visualmente** — o painel do browser não está sendo exibido nesta sessão, então não consegui tirar screenshot nem ver a armilar girando. Precisa de um olhar seu em `pnpm dev` antes de dar a F0 por fechada.

---

## 3. F1 — O conteúdo (a parte que reprova hoje)

### 3.1 O diagnóstico, medido

| Fonte | Nós | Seções | Veredito |
|---|---|---|---|
| Python | 11 | 11 (1 por nó) | Reprova. Uma seção por tópico não leva ninguém do básico ao avançado |
| React | 8 | 5 | Reprova |
| TypeScript | 6 | 3 | Reprova |
| JavaScript | 6 | 2 | Reprova |
| Chronos | 5 | 2 | Reprova — e é *meu repositório*, o caso de uso central |
| Kairos / Pluto / Hermes / Olympus / outros | 2–4 | 1–2 | Reprova |

**Resposta à sua pergunta:** não, ninguém aprende Python do básico ao avançado com isso. → jogar fora e refazer.

### 3.2 Contrato de completude (torna "dá pra aprender só com isso?" um teste vermelho/verde)

`lib/content/contract.ts` + `lib/content/contract.test.ts`. Toda apostila semeada é verificada mecanicamente:

**Por capítulo:**
- [ ] ≥ 4 seções
- [ ] cada seção ≥ 600 palavras de prosa (sem contar código)
- [ ] ≥ 2 blocos de código reais (executáveis, não pseudo)
- [ ] ≥ 1 bloco `porque` (critério arquitetural / tradeoff)
- [ ] ≥ 1 bloco `quebraria` (o que faz isso falhar em produção)
- [ ] ≥ 3 exercícios cobrindo ≥ 2 tipos distintos
- [ ] ≥ 4 cards SRS

**Por apostila de stack:**
- [ ] ≥ 12 capítulos, cada um marcado `basico | intermediario | avancado`, cobrindo a escada inteira
- [ ] capítulo final de projeto integrador, ligado a um Lab

**Por apostila de repositório** (barra elevada em 2026-07-29: *"quem lê tem que sair entendedor do sistema e conseguir modificar onde quiser com conhecimento"* — isso é mais alto que "toda página tem uma seção"):
- [ ] **todo arquivo-fonte do repo tem cobertura** — não só toda página, toda página *e* todo módulo de suporte (services, hooks, lib)
- [ ] **toda função/componente exportado tem subseção própria**: assinatura, o que faz, por que existe, quem chama, o que quebra se mudar o contrato dela
- [ ] todo sistema lógico tem seção com o algoritmo *e* o código real citado (arquivo/linhas)
- [ ] ≥ 1 diagrama por sistema lógico
- [ ] seção explícita "como estender" por área do app — o teste de fogo do contrato: dado um pedido de mudança plausível, a apostila diz onde mexer

O teste falha o build se qualquer fonte semeada estiver abaixo do contrato. Sem isso, "apostila completa" é opinião.

**Por apostila de ferramenta** (Git, Docker, Figma, Vercel, Postman, N8N, Supabase, Oracle Cloud, Ubuntu, e as ferramentas de IA — ver §3.4-A): o contrato de "básico → avançado" de linguagem não se aplica igual — ninguém aprende Docker "do zero ao avançado" como aprende Python. Contrato próprio:
- [ ] ≥ 8 capítulos cobrindo fluxo de trabalho real (não teoria solta), cada um com um cenário concreto do dia a dia
- [ ] ≥ 1 capítulo de "armadilhas comuns e como diagnosticar"
- [ ] ≥ 1 capítulo ligando a ferramenta a um dos repositórios reais (como o Chronos usa X)

**F1 entregue (2026-07-29):** `Block`/`Chapter`/`ChapterLevel` em types.ts · `lib/content/blocks.ts` (`mdToBlocks`, contagem de palavras/blocos) · `lib/content/contract.ts` + 23 testes · `lib/content/logos.ts` com as 40 skills reais do glow-portfolio (conferido por diff, não por contagem) · migração v1→v2 sintetizando capítulo · `BlockRenderer.tsx` como ponte mínima até o F6 reescrever o reader de verdade.

**Bug real encontrado e corrigido no caminho:** `ChironIndex.version`/`ChironLib.version` sempre foram um **contador de mutação** (incrementado a cada `addSection`/`addNode`/etc em `service.ts`), não uma versão de schema — mas `migrate.ts` sempre leu esse mesmo campo como se fosse versão de schema. Depois de poucas mutações o contador passa de 2, e a checagem `version < 2` nunca mais dispara. Confirmado ao vivo: dados semeados chegam em `version: 5`, e a página Apostila quebrava com `section.blocks: undefined` porque a migração v1→v2 nunca rodava. Corrigido separando os dois conceitos: `schemaVersion` (novo campo, só migrate.ts escreve) e `version` (mutação, como sempre foi). `store.tsx` também tinha o mesmo gate errado duplicado — corrigido para sempre chamar a migração (ela já é idempotente).

Verificado ao vivo: `/apostila`, `/maps`, `/practice`, `/review`, `/dashboard` sem erros de console após limpar o localStorage corrompido; typecheck limpo; 67 testes passando; build de produção OK.

### 3.3 Modelo de conteúdo (blocos tipados, não markdown solto)

Hoje `bodyMd` é uma string. Vira uma lista de blocos tipados — é o que permite o reader ter margem, o mapa contar progresso e o contrato ser testável:

```ts
type Block =
  | { kind: "prose";     md: string }
  | { kind: "code";      lang: string; code: string; caption?: string; highlight?: number[] }
  | { kind: "porque";    md: string }                       // critério arquitetural / tradeoff
  | { kind: "quebraria"; md: string }                       // o que falha em produção
  | { kind: "compare";   left: CodeSide; right: CodeSide; verdictMd: string }
  | { kind: "algo";      steps: { title: string; md: string; code?: string }[] }
  | { kind: "diagram";   svg: string; caption: string }     // SVG próprio, nada de dependência nova
  | { kind: "cite";      file: string; symbol?: string; lines?: [number, number]; url?: string }
  | { kind: "labref";    labId: string; layerId: string }   // ponte apostila → lab
  | { kind: "exref";     exerciseId: string };

interface Chapter { id; sourceId; title; level: "basico"|"intermediario"|"avancado"; order; sectionIds: string[] }
interface ApostilaSection { id; sourceId; chapterId; nodeId; title; blocks: Block[]; order; readAt?: string }
```

- [x] Evoluir `types.ts` + `migrate.ts` (v2: `bodyMd` string → `blocks[]`, migração automática dos dados existentes)

### 3.4 As três famílias de apostila

#### A) Stacks — currículo real, básico → avançado, a partir das skills do portfólio

**Fonte da verdade da lista** (2026-07-29): `glowportfolio/src/data/portfolio-data.json` → `skills[]`, 41 entradas com `category` (frontend/backend/ai/tools) e `tier` (basic/intermediate/advanced/master). Chiron não inventa uma lista própria — lê/espelha essa. Quando o portfólio ganhar uma skill nova, ela aparece aqui como candidata, não como decisão unilateral do Chiron.

Nem toda skill vira o mesmo tipo de apostila — duas famílias de currículo:

**A1) Linguagem/framework** — currículo completo básico→avançado como o Python abaixo, cobrindo **a linguagem inteira**, não só os pontos usados nos meus repos:

*Python (14 capítulos, a espinha de referência):*
1. Modelo mental e execução (bytecode, GIL de longe, REPL) · 2. Tipos, mutabilidade e identidade (`is` vs `==`, o furo dos defaults mutáveis) · 3. Coleções e a escolha certa (list/tuple/dict/set, custo de cada operação) · 4. Fluxo, funções e escopo (LEGB, closures, `*args`/`**kwargs`) · 5. Erros e o contrato de exceções (EAFP vs LBYL) · 6. POO pythônica (duck typing, `__dunder__`, properties, dataclasses) · 7. Iteradores, generators e lazy evaluation · 8. Decorators e context managers · 9. Módulos, pacotes e ambientes (import system de verdade) · 10. Tipagem gradual (type hints, mypy, `Protocol`) · 11. Testes (pytest, fixtures, parametrize, o que *não* testar) · 12. Concorrência (threading vs asyncio vs multiprocessing) · 13. Performance e perfilamento · 14. Projeto integrador → **Lab da Ágora**

Rollout por tier do portfólio (advanced/master primeiro — é onde o portfólio já afirma profundidade, então é onde a apostila tem mais a provar):

- [ ] **Advanced/master** — React, JavaScript, HTML, CSS · Python, Node.js, PostgreSQL · Oracle Cloud, Swagger (14 cap. cada, currículo completo da linguagem)
- [ ] **Intermediate** — Next.js, TypeScript, Vue.js · Ruby on Rails, Flask, MySQL, MariaDB, PHP, Java, C · Docker, Pacote Office, Git, GitHub, N8N, Figma, Ubuntu, Vercel, Postman
- [ ] **Basic** — jQuery curada e integrada (2026-10-06) · Spring Boot, Ruby, MS SQL Server, C#, C++ · Supabase — apostilas menores (o contrato de completude ainda vale, mas o rollout é o último em prioridade)
- [ ] Inglês (categoria `language`) **fica de fora** — não é código, não serve ao produto

**Rollout de autoria em batches (decidido 2026-08-19):** o agrupamento é por vocabulário e esforço de currículo, não por uma ordem arbitrária de logos. Cada batch tem cinco fontes; Python é a referência já concluída. `src/lib/content/rollout.ts` é a lista executável desta ordem.

| Batch | Fontes | Estado |
|---|---|---|
| Referência | Python | concluído |
| 1 · Núcleo web | JavaScript · TypeScript · Node.js · React · Next.js | JavaScript, TypeScript, Node.js, React e Next.js curadas e semeadas |
| 2 · Interface web | HTML · CSS · Tailwind CSS · Vite · Vitest | concluído: cinco fontes curadas e semeadas |
| 3 · Dados e plataforma | PostgreSQL · MySQL · MariaDB · Microsoft SQL Server · Supabase | concluído: cinco fontes curadas e semeadas |
| 4 · Backends tipados | Java · Spring Boot · C# · C · C++ | em andamento: Java e C# publicadas; Spring Boot, C e C++ integralmente redigidas/materializadas, ainda em gates semânticos/execução |
| 5 · Backends produtivos | Ruby · Ruby on Rails · PHP · Flask · Vue.js | completo como drafts: Ruby, Rails, PHP, Flask e Vue.js em 12/48/96/36/48; gates externos/editorial/seed ainda pendentes |
| 6 · Entrega | Git / GitHub · Docker · Swagger · Postman · Vercel | Git/GitHub completo como draft 12/48/96/36/48, com 96 exemplos locais executados; gates GitHub remotos pendentes. Docker completo como draft 12/48/96/36/48, com contratos/editorial/typecheck/build aprovados; exemplos aguardam engine real. Swagger completo como draft 14/56/112/42/56; 75 exemplos JSON/TypeScript/Bash passaram parsers reais e 37 YAML/OpenAPI aguardam parser/validator apropriado. Postman completo como draft 12/48/96/36/48; contratos/editorial local/typecheck e 96 gates JSON/JavaScript/Bash passam, enquanto Newman/Postman cloud e observers externos permanecem Pending. Vercel completo como draft 12/48/96/36/48; contratos/editorial local/typecheck e 96 gates JSON/JavaScript/Bash passam, enquanto CLI, account/project, deployment, edge, DNS, storage e providers reais permanecem Pending. |
| 7 · Operação e produto | Oracle Cloud · Ubuntu / Linux · N8N · Figma · Pacote Office | Oracle Cloud, Ubuntu/Linux, N8N, Figma e Pacote Office integrais e integradas. Office 12/48/96/36/48, gates locais aprovados e nativos Pending; executor WSL da regressão global indisponível, sem reinício. |
| 8 · Fluxo de IA | Integração de IA (LLM) · Cursor · Claude Code · GitHub Copilot · OpenCode | Batch completo: LLM, Cursor, Claude Code, GitHub Copilot e OpenCode integrais e integradas 12/48/96/36/48, gates locais aprovados; superfícies nativas/remotas não exercitadas Pending. Lovable posteriormente concluída no batch Criação assistida; Google AI Studio posteriormente concluída; jQuery posteriormente concluída; Chiron posteriormente concluída; Olympus posteriormente concluída; reavaliar pendências na ordem do rollout em execução seguinte. |
| 9 · Fechamento | Lovable · Google AI Studio · jQuery · Chiron · Olympus | completo: as cinco fontes estão integralmente redigidas, auditadas e integradas, com gates locais aplicáveis aprovados e limites remotos explícitos. Olympus concluída em 2026-10-20; pendências dos lotes anteriores seguem na ordem do rollout. |

**Motor de autoria (2026-08-19):** `lib/content/authoring.ts` gera o prompt de uma apostila inteira e aceita JSON apenas como *draft*. Antes de publicar, ele materializa a fonte temporariamente e roda `checkSource()` — a mesma barra que Python passa. Assim a IA pode escrever capítulo a capítulo ou fonte a fonte, mas nunca “aprova” por texto persuasivo; conteúdo aquém de palavras, código, exercícios, cards ou escada de nível volta como violações editáveis.

**Auditoria editorial de 2026-08-25, atualizada em 2026-09-12:** Python, JavaScript, TypeScript, Node.js, React, Next.js, HTML, CSS, Tailwind CSS, Vite, Vitest, PostgreSQL, MySQL, MariaDB, Microsoft SQL Server, Supabase e Java são as fontes curadas/publicadas. As dezessete passam contrato estrutural, baixa repetição, avaliações específicas e exemplos verificados; nenhum draft reprovado entra no seed.

**JavaScript — curada e semeada (2026-08-24):** `seeds/content/javascript.ts` materializa doze capítulos em ordem curricular, todos com quatro seções, texto editorial obrigatório por seção, mecanismos/incidentes/experimentos e exemplos de código específicos, `porque`/`quebraria`, três exercícios e quatro cards. `javascript.test.ts` prova capítulo a capítulo e por fonte que `checkSource() === []`; a fonte está integrada ao seed como `built_in`. Verificação final: 180 testes, typecheck e build verdes.

**TypeScript — curada e semeada (2026-08-27):** doze capítulos e 48 seções autorais cobrem compilador/runtime, narrowing, configuração estrita, inferência, funções, generics, tipos derivados, módulos, classes, async/cancelamento, schemas/APIs, testes, performance/monorepos e projeto integrador ligado ao Lab Ophis. São 36 exercícios específicos, 48 cards e 96 snippets compilados isoladamente sob `strict`. A fonte passa os gates estrutural e editorial, está atestada e integrada ao seed. Verificação final: 224 testes, typecheck e build verdes.

**Node.js — curada e semeada (2026-08-28):** treze capítulos e 52 seções autorais cobrem runtime/lifecycle, módulos/pacotes, filesystem/configuração, HTTP, event loop, streams/backpressure, eventos/filas, persistência/transações, segurança, workers/processos, observabilidade/performance/memória, testes/entrega e serviço de reservas ligado ao Lab Ágora. São 39 exercícios detalhados, 52 cards e 104 exemplos executados em processos Node e diretórios temporários isolados. A fonte passa os gates estrutural e editorial, recebeu atestação e entrou no seed depois de TypeScript; o placeholder legado homônimo foi removido. Verificação final: 32 arquivos/225 testes, typecheck e build verdes.

**React — curada e semeada (2026-08-28):** doze capítulos e 48 seções autorais cobrem renderização/identidade, props/state/eventos, listas/forms/composição, effects, reducers, context, hooks/APIs headless, concorrência/Suspense/SSR, performance/memória, acessibilidade, testes/arquitetura e o projeto Serpe de Estado ligado ao Lab Ophis. São 36 exercícios específicos, 48 cards e 96 exemplos TSX compilados isoladamente sob TypeScript `strict`. A fonte passa os gates estrutural e editorial, recebeu atestação e entrou no seed depois de Node.js; o renderer antigo de prosa compartilhada foi removido. Verificação final: 32 arquivos/238 testes, typecheck e build verdes.

**Next.js — curada e semeada (2026-08-29):** doze capítulos e 48 seções autorais cobrem App Router, Server/Client Components, Cache Components do Next.js 16, Server Actions, streaming, erros, autenticação/Proxy, Route Handlers/webhooks, metadata/SEO, performance/observabilidade, testes/deploy e o projeto Dédalo ligado ao Lab `app-router-cache-graph`. São 36 exercícios específicos, 48 cards e 96 exemplos TSX compilados como módulos isolados sob TypeScript `strict`. A fonte passa os gates estrutural/editorial, substitui o placeholder legado homônimo e entra no seed depois de React; o antigo renderer de prosa compartilhada foi removido. Verificação final: 32 arquivos/251 testes, typecheck e build verdes; permanecem somente os avisos conhecidos de chunks grandes e import misto do Supabase.

**HTML — curada e semeada (2026-08-30):** doze capítulos e 48 seções autorais cobrem parser/DOM, semântica, links, mídia, formulários, validação/submissão, tabelas, metadata/SEO social, acessibilidade avançada, performance/segurança, testes/manutenção e o documento Dédalo ligado ao Lab `html-dom-accessibility-tree`. São 36 exercícios específicos, 48 cards e 96 exemplos validados por parser HTML e regras de ids, labels/ARIA, links, alternativas e metadata mínima. A fonte passa os gates estrutural/editorial, está atestada e entra no seed depois de Next.js; o antigo renderer de prosa compartilhada foi removido. Verificação final daquela etapa: 32 arquivos/264 testes, typecheck e build/PWA verdes; apenas os avisos conhecidos de chunks grandes e import misto do Supabase.

**CSS — curada e semeada (2026-08-30):** doze capítulos e 48 seções autorais cobrem cascata/herança/valores, seletores/especificidade/escopo, box model/sizing, fluxo/position/stacking, Flexbox, Grid, responsividade/container queries, tipografia/cores/temas, transforms/motion, arquitetura/tokens/componentes, debugging/performance/compatibilidade e o sistema visual Dédalo ligado ao Lab `css-cascade-layout-debug`. Cada seção possui no mínimo 600 palavras de prosa, dois exemplos, `porque` e `quebraria`; são 36 exercícios específicos, 48 cards e 96 snippets validados pelo parser PostCSS. O renderer genérico e as avaliações templadas foram removidos, a atestação editorial está ativa e a fonte entra no seed depois de HTML. Verificação final: 32 arquivos/277 testes, typecheck e build/PWA verdes; permanecem somente os avisos conhecidos de chunks grandes e import misto do Supabase.

**Tailwind CSS — curada e semeada (2026-08-30):** doze capítulos e 48 seções densas cobrem modelo utility-first/pipeline/Preflight, utilities e arbitrary values, theme/tokens/presets, variants/ARIA/data/cascata, responsividade/container queries, Flex/Grid/stacking/overflow, tipografia/cor/dark/mídia, components/@apply/CMS, React/clsx/tailwind-merge/variants/SSR, acessibilidade/forms/motion, scanning/budget/plugins/monorepos/migração e o projeto Dédalo ligado ao Lab `tailwind-candidate-cascade-layout`. São 36 exercícios próprios, 48 cards e 96 exemplos processados pelo Tailwind 3.4 real; o plugin oficial `@tailwindcss/container-queries` foi instalado e conectado porque essa versão não traz a feature no core. A primeira materialização foi rejeitada por 58,9% de similaridade; a reautoria caiu abaixo do teto de 42% sem reduzir o piso de 600 palavras. A fonte está atestada e entra no seed depois de CSS. Verificação final: 33 arquivos/292 testes, typecheck e build/PWA verdes; permanecem somente os avisos conhecidos de chunks grandes e import misto do Supabase.

**Vite — curada e semeada (2026-08-30):** doze capítulos e 48 seções densas cobrem dev server/grafo ESM/build, root e HTML de entrada, transformações/CSS/assets, resolução/dependency optimization, HMR, env/modes/segurança, configuração/dev server, chunks/manifest, Plugin API, library mode/multi-page/backends, SSR/middleware/externalização e observabilidade/testes/projeto Dédalo ligado ao Lab `vite-module-graph-build`. São 36 exercícios próprios, 48 cards e 96 exemplos transformados pelo Vite 5.4.21 real; uma fixture temporária também executa build com plugin virtual, CSS, import dinâmico, sourcemaps e manifest. A fonte zerou os contratos estrutural e editorial, ficou abaixo do teto de similaridade e entra no seed depois de Tailwind CSS. Verificação final: 34 arquivos/307 testes e typecheck verdes; o build/PWA passou após elevar o limite explícito de precache a 4 MiB para acomodar o bundle principal de 3.161,60 kB, mantendo os avisos conhecidos de chunks grandes e import misto do Supabase.

**Vitest — curada e semeada (2026-08-30):** doze capítulos e 48 seções densas cobrem arquitetura/coleta/watch, desenho de testes e oracles, assertions/erros/tipos, hooks/fixtures/tabelas, async/timers/concorrência, spies/mocks/HTTP, snapshots/DOM/Browser Mode, configuração/projects/pools, cobertura V8/Istanbul/mutação, debugging/reporters/performance/flakiness, CI/segurança/migração Jest e armadilhas/governança/projeto Dédalo ligado ao Lab `vitest-reliability-gate`. São 36 exercícios próprios, 48 cards e 96 exemplos escritos como arquivos TypeScript e executados pelo Vitest 3.2.7 real em fixture temporária. O gate rejeitou inicialmente duas falhas reais nos snippets e enunciados pouco densos; ambos foram corrigidos sem reduzir thresholds. A fonte zerou contratos estrutural/editorial, entra no seed depois de Vite e fecha o batch Interface web. Verificação final: 35 arquivos/322 testes, typecheck e build/PWA verdes; bundle principal 3.272,35 kB e precache de 19 entradas/5.529,43 KiB, mantendo apenas os avisos conhecidos de chunks grandes e import misto do Supabase.

**PostgreSQL — curada e semeada (2026-09-01):** doze capítulos e 48 seções densas cobrem arquitetura/sessões/catálogos, modelagem/tipos/constraints, DML/joins, agregações/windows/CTEs, índices/planner/estatísticas, MVCC/isolation/locks, JSONB/arrays/ranges/full-text, views/functions/triggers, roles/RLS/segurança, migrations/particionamento/extensões, vacuum/WAL/backup/replicação/monitoramento e performance/incidentes/projeto Ágora ligado ao Lab `postgresql-transaction-query-plan`. São 36 exercícios próprios, 48 cards e 96 exemplos SQL executados em transações descartáveis pelo PostgreSQL 18.3 real via PGlite 0.5.8. O checker revelou e corrigiu materialized views sobre temp tables, prefixo reservado de role e a migração das métricas de checkpoint para `pg_stat_checkpointer`; o placeholder legado homônimo foi excluído do seed. A fonte zerou contratos estrutural/editorial e abre o batch Dados e plataforma. Verificação final combinada das duas entregas: 36 arquivos/337 testes, typecheck e build/PWA verdes; bundle principal 3.382,78 kB, CSS 52,73 kB e precache 19 entradas/5.639,35 KiB. Permanecem somente os warnings conhecidos de chunks grandes e import misto do Supabase.

**MariaDB — curada e semeada (2026-09-09):** doze capítulos e 48 seções densas cobrem divergência de MySQL/protocolo/sessões, tipos/Unicode/tempo/JSON textual, constraints/DDL expand-contract, DML/concorrência, SQL analítico e temporal, optimizer/estatísticas, InnoDB/Aria/engines especializadas, MVCC/locks/retries, segurança/auditoria, GTID/replication/Galera/MaxScale, backup/PITR/upgrade 11.8 e o ledger Quíron ligado ao Lab `mariadb-ledger-recovery-gate`. São 36 exercícios próprios, 48 cards e 96 exemplos executados no MariaDB Community 11.8.9 real, obtido do ZIP oficial com SHA-256 validado e datadir descartável. O checker revelou e corrigiu diferenças reais de CHECK, `WITHOUT OVERLAPS`, catálogo de contas, metadata de variáveis e a ausência honesta de Galera no build Windows. A auditoria rejeitou 44 seções abaixo do piso inicial e elas foram ampliadas individualmente sem reduzir 600 palavras ou o teto de 42% de similaridade. A fonte substitui o placeholder legado e entra no seed depois de MySQL. Verificação final: 38 arquivos/368 testes, typecheck e build/PWA verdes; bundle principal 3.885,43 kB e precache 21 entradas/13.129,40 KiB, mantendo apenas os warnings conhecidos de chunks grandes e import misto do Supabase.

**Microsoft SQL Server — curada e semeada (2026-09-11):** doze capítulos e 48 seções densas cobrem instância/edição/sessões, tipos/Unicode/tempo/identidade, constraints e expand-contract, DML/procedures, SQL analítico, índices/planos/estatísticas/PSP/OPPO, transações/row versioning/locks/deadlocks, JSON/temporal/columnstore/vetores, segurança/criptografia/RLS/audit, Query Store/DMVs/tempdb/governança, backup/restore/HA/upgrade 2025 e o projeto Quíron ligado ao Lab `sqlserver-ledger-query-store-recovery-gate`. São 36 exercícios, 48 cards e 96 exemplos executados no SQL Server 2025 Developer 17.0.4085.5 real por database descartável e cliente .NET já presente, sem nova instalação. O checker encontrou e corrigiu divergências reais de CTE recursiva, DMVs, personificação, CHECKDB, Query Store e sintaxe TOP. A auditoria recusou inicialmente 40 seções abaixo de 600 palavras; todas foram ampliadas individualmente, mantendo o teto de similaridade abaixo de 42%. A fonte entra no seed depois de MariaDB. Verificação final: gates focados 55/55, suíte global 39 arquivos/384 testes, typecheck e build/PWA verdes; bundle principal 4.148,01 kB, 22 entradas e 17.267,55 KiB de precache. O teto operacional explícito passou de 4 para 6 MiB sem alterar thresholds editoriais.

**Supabase — curada e semeada (2026-09-11):** doze capítulos e 48 seções densas cobrem arquitetura e Data API, Auth/sessões, RLS, Storage, Broadcast/Presence/Postgres Changes, Edge Functions, CLI/migrations, observabilidade/limites/restore, tipos/SSR/queues/extensões, keys/JWT/privacidade/incidentes e o gate multi-tenant Quíron ligado ao Lab `supabase-rls-storage-realtime-recovery-gate`. São 36 exercícios próprios, 48 cards e 96 exemplos TypeScript validados pelo parser TypeScript real; os cenários cloud que exigem projeto remoto são explicitamente tratados como rehearsals, sem fingir execução local. A auditoria ampliou individualmente todas as seções abaixo do piso sem reduzir 600 palavras nem o teto de 42% de similaridade. A fonte substitui o placeholder legado, entra depois de SQL Server e fecha o batch Dados e plataforma. O verificador Vite também foi corrigido para aceitar a chave absoluta normalizada que o manifest gera em diretórios temporários Windows. Verificação final: 40 arquivos/401 testes verdes, um gate SQL Server externo opcional skipped sem credencial, typecheck e build/PWA verdes. Próxima fonte: Java.

**Java — curada e semeada (2026-09-12):** 12 capítulos/48 seções autorais com pelo menos 600 palavras cada, 36 exercícios, 48 cards e 96 programas Java completos compilados por `javac --release 21` e executados no JDK 23 real. A apostila cobre da toolchain ao projeto Quíron (JVM/GC/JIT, JPMS, build, testes, segurança, HTTP/JDBC, observabilidade, idempotência, outbox, backpressure e recovery). O último capítulo referencia a camada existente `agora/reserva-estoque-concorrencia`. O placeholder legado é filtrado, Java entra após Supabase, e `java.test.ts` aprova densidade, contrato, cardinalidades e similaridade <42%. O gate JDK real é isolado por `CHIRON_VERIFY_JAVA_SNIPPETS=1` para não saturar RPC do Vitest na suíte paralela; passou 14/14 em execução dedicada. Suíte global com `--maxWorkers=2`: 43 arquivos, 419 testes verdes, 13 skipped (12 de compilação Java isolada e 1 SQL Server externo sem credencial). Não confundir os fakes JDBC usados em exemplos com um teste de integração em banco. Typecheck e build/PWA passaram; próxima fonte: Spring Boot. `springbootCurriculum.ts` já define 12 capítulos/48 seções.

**Spring Boot — redação integral, gate semântico pendente (2026-09-13):** 12 capítulos/48 seções autorais com pelo menos 600 palavras, 96 exemplos Java/XML/YAML/SQL, 36 exercícios, 48 cards e projeto integrador Quíron. `springboot.test.ts` materializa a fonte e aprova contrato, densidade e baixa similaridade; `springboot.draft.test.ts` analisa a sintaxe dos exemplos Java com o parser do JDK 21. Os testes focados passaram 18/18. Isso **não** compila Spring nem executa seus exemplos SQL ou o serviço completo; sem Maven/Gradle no host, não houve instalação de infraestrutura só para documentação. Por isso `springboot.ts` ainda não tem atestação editorial de exemplos e não entra em `runSeed()`. Próximos passos: revisão semântica/gate de build real, integração só após aprovação, e prosseguir C# sem esperar resposta entre capítulos.

**A2) Ferramenta/workflow** (contrato próprio, §3.2) — a categoria `tools` inteira, mais a categoria `ai` (OpenCode, GitHub Copilot, Claude Code, Cursor, Lovable, Google AI Studio): não é "aprenda Docker do zero ao avançado", é fluxo de trabalho real + armadilhas + onde aparece nos meus repos de verdade.

**Ícones/logos** (pedido explícito — "importante pros cards"): `lib/content/logos.ts` mapeia nome-de-skill/tech → slug de ícone (biblioteca `simple-icons`, já que cobre toda a lista de 41 sem precisar desenhar nada à mão) + cor de marca oficial daquela tech. Usado nos cards de STACK do dashboard, no chip de linguagem dos cards de REPOSITÓRIO, e na legenda de tech de cada capítulo. Fallback: inicial da skill num badge sólido, para qualquer nome sem slug correspondente (ex.: "Pacote Office").

- [ ] `lib/content/logos.ts` — tabela nome→slug, com o fallback de badge
- [ ] Ler `skills[]` do glow-portfolio (cópia local do JSON relevante, ou fetch em build-time — decidir no F1) para gerar a lista de `Source` candidatas automaticamente, em vez de hardcoded

#### B) Repositórios — cada arquivo, cada função, cada página documentados

Espinha fixa por repo: **Visão geral e propósito · Modelo de domínio (entidades, invariantes) · Arquitetura de dados (persistência, versionamento, migração) · Uma seção por página · Uma subseção por função/componente exportado dentro da seção da página/módulo dele · Uma seção por sistema lógico (com algoritmo + código real + diagrama) · Camada de IA · Decisões e tradeoffs · O que quebraria · Como estender**

A barra (2026-07-29): quem lê tem que **entender o sistema conceitualmente e conseguir modificar onde quiser com conhecimento** — não é uma visão geral, é documentação de engenharia real. Ver o contrato de repositório em §3.2.

- [ ] Chronos (hoje: 2 seções → alvo ~18 seções + subseção por função exportada) — grid 168, colisão em cascata, janelas de sono, ledger de composição, camada de ferramentas de IA, migrações versionadas
- [ ] Kairos — quadro kanban, ponte Chronos↔Kairos, proxy de IA, PWA/offline, markdown round-trip
- [ ] Pluto — fluxo vs saldo, árvore de categorias, orçamento/metas, import de extrato
- [ ] Hermes — outbox, flows, entrega multicanal
- [ ] Outros repositórios do portfólio fora da suíte (Pokédex, Zignani Motors API, ZenMoney, LibPicker, Zonai Codex, servidor Oracle Cloud) — mesma espinha, prioridade depois da suíte
- [x] Chiron (o próprio) — apostila integral do repositório concluída e integrada em 2026-10-19; ver registro e evidências acima

#### C) Olympus — a apostila guarda-chuva

O Olympus documenta **o que é comum a todos**, e cada app é uma *seção dentro dela* cobrindo só suas particularidades. Os apps deixam de ser fontes de topo separadas.

- [x] Cap. 1–8 (o comum), apostila integral integrada em 2026-10-20: conta única e auth · o KV `user_data` como backend inteiro · o motor de sync (pull → rehydrate → push debounced → realtime com guarda de eco) · a Edge Function `ai-proxy` · o padrão Aetheris (§3a) · o design system da família · i18n · PWA e deploy
- [x] Cap. 9–12: particularidades dos cinco irmãos e do hub, só com o que é particular dele (remissiva para o comum, sem repetir)

#### D) Labs — a terceira categoria (ver §9)

**F2 — estado real (atualizado 2026-08-07, sétima rodada — Python fechado):**

- [x] `lib/study/seeds/content/types.ts` — formato de autoria Chapter/Block nativo (`ContentSource`/`ContentChapter`/`ContentSection`), sem a ponte `mdToBlocks`: o que o autor escreve é exatamente o que o contrato mede
- [x] `lib/study/seeds/content/materialize.ts` — materializador próprio (`applyContentSource`), usando `addChapter`/`updateChapter` novos em `service.ts` (faltavam desde o F1 — Chapter tinha tipo mas nenhuma função para criar um de verdade)
- [x] `lib/study/seeds/content/python.ts` — **13 capítulos completos do Python — a stack inteira fecha o contrato mecânico de completude**:
  1. Modelo mental e execução (bytecode/dis, REPL vs `import` vs `python -m`, cache em `sys.modules`, GIL — o que ele trava e o que não trava, `threading`/`multiprocessing`/`asyncio`, variáveis como nomes vinculados a objetos, `is` vs `==`, cópia rasa vs profunda)
  2. Coleções e a escolha certa (lista vs tupla como intenção não só mutabilidade, `namedtuple`/`dataclass`, dict como tabela hash, ordem de inserção garantida desde 3.7, `setdefault`, views vivas vs `list()`, set como pertencimento O(1), álgebra de conjuntos, operador vs método, comprehensions vs laço explícito, escopo isolado, expressões geradoras)
  3. Fluxo, funções e escopo (regra LEGB, `global`/`nonlocal`, `UnboundLocalError` explicado pela compilação do cap. 1, closures por referência não por cópia, a armadilha do binding tardio em loops + a correção via argumento-padrão, memoização por closure, `*args`/`**kwargs`, desempacotamento na chamada, marcadores `/` e `*` de PEP 570, funções como objetos de primeira classe, tabela de despacho como alternativa a `if/elif`, `functools.wraps`)
  4. Erros e o contrato de exceções (try/except/else/finally com papéis distintos, ordem de except importa, `assert` vs `raise` e a flag `-O`, EAFP vs LBYL e a condição de corrida TOCTOU, duck typing com `Decimal` como exemplo real, hierarquia `BaseException`/`Exception` e por que `KeyboardInterrupt`/`SystemExit` ficam de fora, `except:` nu = `except BaseException:`, `logging.exception()` vs `print(e)`, hierarquia de exceções customizadas como parte do contrato de API, `raise ... from` e a diferença entre `__cause__` e `__context__`)
  5. POO pythônica (classe como instância de `type`, `self`/método vinculado via protocolo de descritor, MRO como LEGB de atributos, `__repr__`/`__str__`/`__eq__`/`__add__` e o mecanismo real de duck typing, `__hash__` precisa acompanhar `__eq__`, `functools.total_ordering`, `@property` e migração sem quebrar API, `cached_property`, composição vs herança e o fragile base class problem, `ABC`/`abstractmethod` como contrato vs mixins como comportamento combinável)
  6. Iteradores, generators e lazy evaluation (protocolo `__iter__`/`__next__` explicado com iterador manual, iterável vs iterador, fallback via `__getitem__`, `yield` suspendendo/retomando execução real, `return` dentro de gerador vira `StopIteration.value`, generators de uso único e o bug de reiterar um gerador esgotado, `itertools` — `islice`/`chain`/`takewhile`/`groupby`/`tee`, `yield from` propagando valores/exceções/retorno, `.send()`/`.throw()`/`.close()` como base histórica de `async`/`await`)
  7. Decorators e context managers (decorator parametrizável = fábrica de decorators com 3 níveis de aninhamento, `functools.partial` vs decorator, decorators empilhados — ordem de aplicação vs execução e o risco real de segurança com auth+cache na ordem errada, protocolo `__enter__`/`__exit__` por trás do `with`, o significado exato do retorno de `__exit__`, múltiplos context managers numa linha e ordem LIFO de fechamento, `@contextmanager` dividindo uma função geradora em setup/teardown, `contextlib.suppress`/`ExitStack`)
  8. Módulos, pacotes e ambientes (pacote como extensão de módulo — `__init__.py` executa como qualquer módulo com o mesmo cache em `sys.modules`, reexportação seletiva e `__all__`, pacotes de namespace sem `__init__.py`, `__file__` como ferramenta de diagnóstico, imports absolutos vs relativos e por que relativos exigem contexto de pacote — `__package__`, o erro clássico de rodar um submódulo como script direto, `sys.path` como lista ordenada e inspecionável, shadowing de módulos da biblioteca padrão por arquivos locais mal nomeados, `venv`/`requirements.txt`/`pip freeze` e o trade-off real entre versão exata e faixa compatível)
  9. Tipagem gradual (type hints como camada opcional não verificada em runtime — PEP 484, `__annotations__` acessível para introspecção real por `dataclasses`/`pydantic`/FastAPI, forward references e `from __future__ import annotations`, `Optional`/`Union` e a sintaxe `X | None` do PEP 604, `Any` como escotilha de escape com contágio real por expressões vs `object` como tipo raiz seguro, `Protocol` como tipagem estrutural formalizando duck typing do cap. 5, `@runtime_checkable` e seus limites, `TypedDict` para forma de dict sem criar classe, `Generic`/`TypeVar` com `bound`, `mypy`/`pyright` e configuração de rigor por módulo, `@overload` para retorno dependente do tipo de entrada, tipagem gradual — PEP 483 — como filosofia de adoção incremental, não recurso isolado)
  10. Testes (pytest vs `unittest` — assert simples reescrito na coleta vs `assertEqual`, descoberta de testes por convenção de nome, fixtures como injeção de dependência com `yield`/escopo/`conftest.py`, `parametrize` gerando testes independentes por tupla, `unittest.mock`/`patch`/`MagicMock` e o erro clássico de mirar o import errado, o limite real de quando mockar faz sentido, cobertura de linha vs branch e por que ela nunca mede qualidade de asserção, `hypothesis`/property-based testing para casos de borda não antecipados, taxonomia dummy/stub/fake/mock/spy, pirâmide de testes unitário/integração/end-to-end, TDD vs test-after, CI como portão automático real)
  11. Concorrência em profundidade (`threading` real: GIL não impede race condition porque `+=` não é atômico, `Lock`/`RLock`/deadlock por ordem de aquisição, `Queue` como padrão produtor-consumidor autorregulado; `multiprocessing`: contorna o GIL de verdade via processos isolados, custo de pickling entre processos, `Value`/`Array`/`Manager` para memória compartilhada real, guard `if __name__ == \"__main__\"` no Windows/spawn; `asyncio`: `async`/`await` como continuação direta de `yield from` do cap. 6, event loop cooperativo numa única thread, por que não ajuda CPU-bound, `Task`/`create_task` vs `await` direto; `concurrent.futures` unificando `ThreadPoolExecutor`/`ProcessPoolExecutor`, `run_in_executor` como ponte oficial, risco real de misturar `threading.Lock` dentro de `asyncio`)
  12. Performance (`cProfile`/`timeit`/`py-spy` — medir antes de otimizar, nunca supor o gargalo; complexidade e a escolha de estrutura de dados do cap. 2 revisitada em escala — O(n²) de busca linear em loop e de concatenação de string com `+=`; `functools.lru_cache`/`cache_info()` — memoização real e o risco de cache obsoleto sobre função não-pura; vetorização com `numpy` como ordem de magnitude, não incremento, e quando Cython/PyPy entram como último recurso)
  13. Projeto integrador (um gerenciador de tarefas real combinando deliberadamente os 12 capítulos anteriores: `dataclass`+`default_factory` do cap. 1/5, índice dict por ID do cap. 2/12, hierarquia de exceções do domínio do cap. 4, tipos do cap. 9, TDD leve com `pytest.raises`/`parametrize` do cap. 10, notificações via `asyncio`+`run_in_executor` do cap. 11 com o bug de bloquear o event loop demonstrado ao lado do fix, profiling final do cap. 12 — e um bloco `labref` real apontando pro laboratório Ágora, satisfazendo `stack.integratorChapter`)
  
  52 seções, cada uma ≥600 palavras de prosa própria (não em código), 2+ blocos de código reais por seção, bloco `porque` e `quebraria` em cada; 39 exercícios cobrindo múltiplos tipos distintos; 52 cards. **Todo capítulo passa `checkChapter` com zero violações** — testado em `python.test.ts` com asserção real por capítulo (não `test.fails`), 4 testes verdes; suíte inteira do projeto (83 testes), `tsc --noEmit` e `vite build` verificados de ponta a ponta depois de cada capítulo de 8 a 13. **`checkStackSource` agora devolve `[]` para a fonte Python — zero violações**: 13 capítulos ≥ 12 mínimos, os três níveis (`basico`/`intermediario`/`avancado`) representados desde o capítulo 11, e o bloco `labref` do capítulo 13 satisfaz `stack.integratorChapter`. `python.test.ts` foi atualizado para afirmar isso diretamente (`expect(violations).toEqual([])`), a confirmação mecânica da barra de qualidade original do Vinícius — **só para a stack Python**, isoladamente
- [x] **Ajuste de escopo descoberto escrevendo, não decidido de antemão**: o capítulo 2 original do plano ("Tipos, mutabilidade e identidade") ficou absorvido dentro do capítulo 1, porque identidade/referência e modelo de execução se mostraram fortemente entrelaçados na hora de escrever de verdade. A contagem cai de 14 para 13 capítulos reais — documentado no cabeçalho de `python.ts`
- [ ] **Ainda não conectado ao `runSeed()`** — por instrução explícita (2026-07-29): ignorar consistência da demo ao vivo enquanto o conteúdo é escrito, integrar tudo de uma vez no final, não capítulo a capítulo. Isso ainda vale mesmo com o Python fechado — a integração ao vivo é uma tarefa separada, deliberadamente adiada
- [ ] **A stack Python é 1 de ~40 fontes previstas para F2.** Restam as outras ~39 stacks/ferramentas de §3.4-A (nenhuma iniciada) e todos os repositórios de §3.4-B (nenhum iniciado, incluindo o Chronos, citado como primeiro candidato). F2 continua sendo, honestamente, um projeto de conteúdo de várias sessões — fechar uma stack não fecha a fase

**Como continuar:** usar `python.ts` como molde direto — mesma estrutura de arquivo, um nó por capítulo, 4 seções por capítulo, rodar `python.test.ts`-style contra `checkChapter` a cada capítulo novo antes de seguir pro próximo. Prioridade: fechar o Python inteiro antes de espalhar para outras stacks. Padrão que se repete em todo capítulo: o primeiro rascunho de cada seção quase sempre fica 300-400 palavras abaixo do mínimo — escrever a seção já mirando ~900-1000 palavras de prosa (não 600) desde o primeiro rascunho reduziria bastante as rodadas de expansão; reservar múltiplas rodadas pequenas de expansão real (não enchimento), verificando com o teste a cada rodada. **Cuidado ao expandir**: só texto dentro de `prose([...])` conta para o contrato — expandir um bloco `porque`/`quebraria` por engano não move o contador de palavras (já aconteceu algumas vezes; sempre confirmar com grep a que bloco a string pertence antes de editar).

---

## 4. F3 — Chrome, títulos e perfil

**Fechada (2026-08-07).** Ver notas de estado ao fim da seção — o número do
título ficou desalinhado com a ordem real de execução (§13) desde que
"Conteúdo" virou F2; o conteúdo desta seção é a F3 de fato, não a F2.

### 4.1 Títulos (fim da redundância tripla)

Hoje: sidebar diz "Painel" → header diz "PAINEL" → H1 diz "O painel de estudos". Três vezes a mesma informação, ocupando a primeira dobra.

| Rota | Antes | Depois |
|---|---|---|
| `/dashboard` | Dashboard / Dashboard / The study dashboard | **Painel** |
| `/maps` | Maps / Maps / Code maps | **Mapas** |
| `/apostila` | Apostila / Apostila / Apostilas | **Apostilas** |
| `/practice` | Practice / Practice / Guided practice | **Prática** |
| `/review` | Review / Review / Spaced review | **Revisão** |
| `/labs` | — | **Laboratórios** |
| `/aetheris` | Aetheris / Aetheris / The code tutor | **Aetheris** |
| `/settings` | Settings / Settings / Settings | **Configurações** |
| `/progress` | Progress / Progress / Your progress | *(rota deletada)* |

- [x] Remover o eyebrow tracked de todas as páginas de app (fica só na landing, onde é retórica de marca e faz sentido)
- [x] Zero subtítulo épico ("o tutor de código", "revisão espaçada") — a função já está no nome
- [x] Subtítulo só quando **carrega dado**: `4 fontes · 62 nós · 12 revisões hoje` como meta-linha, não como segundo heading — implementado no Dashboard (única página com dado agregado pronto sem esperar o F4); Review/Practice já tinham linhas de dado reais, mantidas
- [x] Em páginas densas (Mapas, Apostila, Labs) o H1 dá lugar a uma **toolbar** — Mapas/Apostila já tinham a linha de seletor de fonte logo abaixo do header; virou a primeira linha da página, sem cabeçalho acima. Labs ainda não existe (F8)
- [x] Limpar `dictionaries.ts` (pt + en) dos pares eyebrow/title — removidos de about/settings/dashboard/maps/apostila/practice/review/aetheris; os eyebrows *internos* de seção (Aparência, Aetheris dentro de Configurações; O projeto/Links/FAQ dentro de Sobre) foram mantidos — não são repetição do nome da rota, são rótulos de conteúdo dentro da página
- [x] `/progress` deletado: rota, página, entrada de nav, crumb do Topbar, chaves de dicionário. O conteúdo dela (distribuição de maestria, calendário de sessões) não foi portado a lugar nenhum ainda — fica para o F4 absorver via "Domínio geral" (donut) e "Atividade de estudo" (gráfico), como o próprio F4 já previa

### 4.2 Card de perfil da sidebar (padrão Chronos/Kairos)

- [x] Rodapé da sidebar vira **avatar + nome + estado de sync**, abrindo um **dropdown** (Perfil · Configurações · Exportar dados · Sair) — `DropdownMenu` do shadcn, "Exportar dados" dispara o JSON completo direto do menu sem abrir o diálogo
- [x] `ProfileDialog` sobe de 87 para ~290 linhas: edição de nome/avatar (já existia), snapshot real do estudo (cards vencendo em breve, fontes por contagem de nós, sequência/domínio/total de cards), estado de conta (nuvem vs. local, já existia), exportações (JSON completo · Anki TSV · XLSX), zona de perigo (reset com confirmação via `AlertDialog`). Referência usada: `kairos/src/components/ProfileDialog.tsx` (perfil único, sem carrossel) em vez do `chronos-audit` de 528 linhas (que é multi-perfil — conceito que não existe no domínio do Chiron)
- [x] `lib/study/export.ts` novo: `downloadIndexJSON` (backup completo `{index, libs}`) e `downloadIndexXLSX` (4 abas: Fontes, Nós, Cards, Capítulos, via `exceljs` — já era dependência do projeto). **Achado no caminho**: importar `exceljs` estaticamente inchou o bundle principal de 288KB para 1,2MB; corrigido com `import("exceljs")` dinâmico dentro da função, isolando a lib num chunk próprio de 938KB carregado só quando alguém de fato clica em XLSX — verificado ao vivo (network request confirma o chunk separado, bundle principal voltou a 296KB)
- [x] `store.tsx` ganhou `libs` (todos os libs, não só um por vez) e `resetAll()` — necessários para os dois itens acima, não existiam antes
- [x] Verificado ao vivo no browser: dropdown abre com os 4 itens corretos, ProfileDialog renderiza snapshot real com dados semeados (22 cards, 21 fontes), os três botões de export e o reset aparecem na seção "Dados" expandida, export XLSX carrega o chunk sob demanda sem erro de console

---

## 5. F4 — Dashboard (direção do Figma anexado)

**Fechada (2026-08-09).** Ver notas de estado ao fim da seção.

Leitura do Figma: sidebar + topbar com busca; grade de **2 colunas** — coluna principal com um gráfico grande em destaque e uma fileira de gráficos menores abaixo; trilho direito com listas verticais compactas e barras de progresso. Densidade alta, tudo visual, nada de "número solto num quadrado".

### 5.1 Faixa "hoje" (topo, largura cheia)

Substitui os 4 stat cards genéricos. Nada aqui é um número solto:

- [x] **Sessão do dia** — bloco largo: seletor de orçamento 25/60/90 min, os blocos gerados (revisão · leitura · exercício) como uma timeline horizontal com estimativas, botão Iniciar/Retomar. `planSessionBlocks()` deriva os minutos reais de cada bloco a partir do orçamento + fila de revisão de verdade (não valores fixos); "Iniciar" persiste uma `StudySession` real via `createSession()` e navega para `/review`/`/practice`
- [x] **Sequência** — anel de progresso com os últimos 7 dias como segmentos. **Dias de graça não têm conceito no modelo de domínio ainda** — não marcados, deixado honesto em vez de fingir
- [x] **Fila de revisão** — sparkline dos vencimentos dos próximos 14 dias + contagem de hoje
- [x] **Domínio geral** — donut de distribuição de maestria (não-visto → aprendendo → revisão → dominado)

### 5.2 Coluna principal

- [x] **Atividade de estudo** — gráfico de área dupla (teoria × prática, 30 dias) real a partir de `sessions[].blocks[].estMin`, crosshair + tooltip no hover, seletor Semana/Mês. **Banda de destaque num dia selecionado não implementada** — só o crosshair de hover: um "dia selecionado" persistente exigiria um estado de seleção sem interação clara ainda definida (clicar fixa? um segundo clique libera?), deixado para quando isso for decidido
- [x] **Retenção** — barras por semana: acertos de primeira (grade ≥ 3, o próprio limiar do SM-2) × lapsos, a partir do novo `reviewLog` real. **A linha sobreposta é a taxa de recall real por semana calculada dos dados — não uma "curva de esquecimento"** no sentido técnico (uma curva teórica de decaimento previsto); renomear se uma curva de esquecimento de verdade for implementada depois
- [x] **Nós mais fracos** — lista rankeada com barra por nó, cada linha clicável direto para a prática daquele nó

### 5.3 Trilho direito

- [x] **Próximo na fila** — mistura revisões vencidas + próxima seção não lida por fonte, intercalados, até 4 itens. **Exercício não entra**: `Exercise` não tem flag de "já tentado" (só existe um log de `Attempt` separado), então "próximo exercício" exigiria cruzar os dois — deixado para quando o runner de exercícios do F7 precisar disso de qualquer forma
- [x] **Domínio por fonte** — barras de progresso por fonte, cor verdigris fixa (não "cor da categoria" — as categorias ainda não têm cor própria definida; usar uma única cor de "domínio" em vez de inventar uma paleta categoria→cor nova)

### 5.4 As três categorias, visualmente distintas (diferenciação por **forma**, não só por cor)

- [x] **REPOSITÓRIOS** — linhas horizontais largas: chip com inicial+cor real da linguagem (via `lib/content/logos.ts`), anel de maestria real, meta (nós/seções/data de ingestão), miniatura em grade abstrata (não fabrica conteúdo de arquivo real — é decoração geométrica, não um preview falso)
- [x] **STACKS** — cards verticais: escada de nível segmentada (básico/intermediário/avançado preenchendo, real via `chapters[].level`), contagem de capítulos, próximo capítulo real (`computeNextChapter()` — o de menor `order` com algum nó não dominado, cruzando seções → nós → maestria)
- [~] **LABORATÓRIOS** — só um card-placeholder honesto ("chegam no F8"), sem canvas ao vivo — não existe nenhum lab construído ainda (`SourceKind` nem tem `"lab"` como valor), fabricar uma prévia animada de algo que não existe seria pior que admitir que ainda não existe
- [x] Removida a fileira de 4 stat cards genéricos e a lista empilhada indiferenciada

**Notas de estado:**

- [x] **Paleta de gráficos revalidada com a skill `dataviz`** — o `CHART_HEX`/`--chart-1..6` herdado do F0 (slate/plum) falhava o piso de chroma do validador (lia como cinza, ΔE de CVD adjacente abaixo do piso) em ambos os modos claro/escuro; substituído por violet/rose, ambos os modos re-validados do zero (`node scripts/validate_palette.js` — todos os 6 checks passam, com WARN de contraste conhecido em ochre, mitigado com rótulo direto sempre presente). Documentado inline em `lib/color.ts`/`index.css` para não regredir sem rodar o validador de novo
- [x] **Bug real pego e corrigido antes de shippar**: os componentes de gráfico inicialmente usavam `CHART_HEX`/`MASTERY_HEX` (hex cru, congelado no valor do modo claro) em vez de `hsl(var(--chart-N))` — funcionava visualmente no claro mas nunca trocava de cor no escuro. Corrigido com `CHART_VARS`/`MASTERY_VARS` (novos, em `lib/color.ts`) referenciando as custom properties diretamente; verificado ao vivo alternando tema e lendo `getComputedStyle` — as cores realmente mudam e batem exatamente com o hex calculado para cada modo
- [x] Nenhuma lib de gráficos adicionada — SVG desenhado à mão em `components/dashboard/charts.tsx`, seguindo `marks-and-anatomy.md` (linhas 2px, cantos 4px arredondados em barras, área a 10% de opacidade, gridlines hairline, legenda sempre presente para 2+ séries, tooltip com crosshair em área/linha e tooltip por barra em barras) — decisão deliberada após o susto de bundle do `exceljs` no F3
- [x] Novo domínio real, não só UI: `ChironIndex.reviewLog` (log de cada grading SM-2, schemaVersion 1→2 com migração honesta), `lib/study/dashboard.ts` (8 funções puras, todas testadas — `computeActivitySeries`, `computeWeeklyRetention`, `computeWeakestNodes`, `computeNextInQueue`, `computeMasteryBySource`, `computeMasteryDistribution`, `computeNextChapter`, `planSessionBlocks`, `computeUpcomingDue`), `lib/study/seeds/activity.ts` (30 dias de sessões/reviewLog sintéticos mas determinísticos, só para o seed local ter dado real pros gráficos mostrarem)
- [~] **Gaps de acessibilidade conhecidos e não fechados nesta rodada** (a skill pede, mas o passe visual formal é §12/F10): sem tabela-alternativa por gráfico, sem paridade de tooltip por teclado/foco, sem modo textura para CVD severo/impressão. Documentado aqui para não se perder — não são esquecimento, são adiamento deliberado de escopo
- [x] Verificado ao vivo no browser: dado real semeado renderizando em todos os widgets, hover/crosshair funcionando (via evento sintético — screenshot não composita neste ambiente, limitação já conhecida), botão Iniciar persistindo sessão real e navegando, alternância clara/escuro recalculando cores corretamente, `tsc`/106 testes/`vite build` limpos

---

## 6. F5 — Mapas (mapa de verdade)

**Fechada (2026-08-09).** Ver notas de estado ao fim da seção.

Hoje: lista vertical de nós, botão "Apostila" morto, sem progressão, card de todas as apostilas no topo sem função.

- [x] **Layout DAG puro e testado** (`lib/maps/layout.ts`): camadas por caminho mais longo a partir das raízes (profundidade de pré-requisito = nível real, testado explicitamente com dependência-diamante para provar que usa o caminho MAIS longo, não a contagem de pais diretos), ordenação por baricentro dentro da camada para minimizar cruzamento de arestas (testado com um caso de cruzamento real). Determinístico (testado: mesma entrada, mesma saída byte-a-byte) e defensivo contra ciclo/`requires` apontando pra fora do conjunto — 11 testes
- [x] **Canvas SVG** com pan/zoom (arraste com ponteiro + roda do mouse), minimapa (miniatura colorida por maestria + retângulo do viewport atual) e botão "Ajustar à tela". Nós tintados por maestria via `MASTERY_VARS` (mesma lição do F4 — nunca hex cru, senão não troca de tema), arestas de pré-requisito com marcador direcional (seta)
- [x] **Progressão real**: nó trancado quando algum pré-requisito tem mastery < 3 ("Mastered") — esmaecido + ícone de cadeado, `onClick` não dispara. Verificado ao vivo: com dados semeados (todo nó novo nasce mastery 0), só a raiz de cada cadeia fica destrancada, exatamente como esperado
- [x] **Clicar no nó abre painel lateral**: resumo real (primeiro bloco `prose` da primeira seção), contagem real de seções/exercícios/cards, e três ações — Ler (`/apostila?source=..&node=..`, com scroll-to-section real via novo efeito em Apostila.tsx), Praticar (`/practice?node=..`, já existia), Revisar (`/review?node=..`, **novo** — Review.tsx ganhou filtro por nó + chip "filtrado por nó" removível). Cada botão desabilita sozinho quando aquele recurso não existe pro nó (praticar sem exercício, por exemplo) — verificado ao vivo
- [x] **Legenda** fixa abaixo do canvas (não com ícones por item — usa o mesmo dot colorido do resto do app — mas cobre todos os 5 estados de maestria + trancado)
- [x] Removido o card de "todas as apostilas" — o seletor de fonte é a primeira linha da página
- [x] `<select>` nativo trocado por segmented control agrupado por categoria (Repositórios/Stacks/Ferramentas) em `components/maps/SourceSelector.tsx`

**Notas de estado:**

- [x] **Achado real antes de começar a UI**: `requires` nunca foi populado em lugar nenhum do código — toda chamada de `addNode` em `seeds/index.ts` e nos dois materializadores de conteúdo passava `requires: []` sempre. Um layout de DAG "de verdade" sobre esse dado seria uma única camada plana sem nenhuma aresta, o que não prova nada sobre o algoritmo nem sobre a experiência de trancamento. Corrigido em dois lugares: `lib/study/seeds/content/materialize.ts` agora encadeia sequencialmente os nós de capítulo (capítulo N requer capítulo N-1 — justificado, já que uma apostila de stack é lida em ordem), e `seeds/index.ts` (dados de demo legados) recebeu o mesmo encadeamento só pra dar ao `/maps` um DAG real de verdade pra desenhar — documentado inline como enriquecimento de dado de seed, não uma alegação de dependência real entre esses nós específicos
- [x] **Bug real pego e corrigido antes de shippar**: `onWheel` do React é um listener passivo por padrão — chamar `e.preventDefault()` nele lança "Unable to preventDefault inside passive event listener invocation" ao vivo (confirmado no console) e a página rola por baixo do gesto de zoom. Corrigido anexando o listener nativo via `useEffect`+`addEventListener("wheel", fn, {passive:false})` em vez do prop `onWheel` — essa é a correção documentada do problema, não um contorno
- [x] Verificado ao vivo: DAG de 5 camadas renderizando com posições Y crescentes reais, trancamento correto (só a raiz destrancada), zoom via evento de roda real mudando o viewBox, arraste via ponteiro real panando a view, "Ajustar à tela" resetando pra 100% exato, troca de fonte resetando o mapa e o painel, os três botões de ação com o estado disabled correto, filtro de revisão por nó funcionando e removível — tudo sem erro de console (numa aba nova, pra evitar ruído de buffer de console entre navegações). `tsc`/120 testes/`vite build` limpos

---

## 7. F6 — Página de apostila (reader)

**Fechada (2026-08-09).** Ver notas de estado ao fim da seção.

- [x] **Três painéis**: sumário em árvore (`components/reader/ChapterTree.tsx` — capítulo → seção, com progresso real X/Y por capítulo) · leitor (coluna central em scroll contínuo, não mais paginado seção-a-seção) · **trilho de margem** (`components/reader/MarginRail.tsx`)
- [x] **Trilho de margem**: citações (`cite`) com arquivo/símbolo/linhas e link pro GitHub quando `url` existe; três ações reais — "me questione sobre isso"/"gerar cards"/"explicar mais fundo" navegam pra `/aetheris?prompt=..` com a pergunta certa pré-preenchida (novo suporte em Aetheris.tsx, nunca auto-envia, só preenche o campo); ponte pro lab quando há `labref` — honesta: avisa que o F8 ainda não existe, em vez de fingir um link funcional
- [x] **Renderização por bloco**: `code` agora com realce de sintaxe real via `prismjs` (import dinâmico — mesma disciplina do F3/F4 de manter dependência pesada fora do bundle principal; ficou em chunk próprio de ~7,5KB gzip) + linhas destacadas via `block.highlight`; `porque`/`quebraria` já tinham tratamento visual próprio desde o F1.5, mantido; `compare` agora usa os mesmos blocos de código com realce nos dois lados; `algo` mantido (o `code` de um step não tem `lang` no modelo de dados, então não dá pra realçar sem inventar um idioma — deixado sem highlight, honestamente); `diagram` em SVG já existia
- [x] **Progresso de leitura por seção**: `readAt` real, gravado via `updateSection`. **Não é scroll-spy via `IntersectionObserver`** como o texto original do plano sugeria — trocado por uma leitura de posição de scroll (`getBoundingClientRect` + `requestAnimationFrame` throttle) depois de confirmar ao vivo, com um teste isolado de IO nesta mesma aba, que `IntersectionObserver` nunca dispara callback nenhum neste ambiente de preview (o mesmo bug de não-compositing já documentado pro 3D da Armilar). Refletido no dashboard: `computeNextInQueue` (F4) já lia `readAt` pra decidir a próxima seção não lida — nenhuma mudança nova precisou ser feita ali, já estava certo
- [x] **Passe tipográfico**: medida de linha ~68ch (`style={{maxWidth: "68ch"}}` na coluna central), numeração de seção real ("Seção X de Y" + "capítulo.seção" tipo "1.1"/"1.2" na árvore), âncoras por heading (novo em `Markdown.tsx` — todo heading `#`/`##`/`###` ganha `id` via slugify) e por seção (`id="section-{id}"`). **Escala modular e notas de rodapé não implementadas** — não existe bloco de rodapé no modelo de conteúdo (nenhum `Block` representa isso), e "escala modular" (tipografia com proporção matemática entre tamanhos) exigiria uma decisão de design tipográfico maior que este passe não tentou resolver sozinho
- [x] Navegação com teclado (`j`/`k`, setas) — sequencial pela lista de seções já achatada em ordem de capítulo, então "respeita capítulos" por construção (nunca pula pra um capítulo fora de ordem)

**Notas de estado:**

- [x] **Mudança estrutural real, não só cosmética**: o reader deixou de ser "uma seção por vez com Anterior/Próximo" e virou scroll contínuo de todas as seções do capítulo/fonte, porque scroll-spy (pedido explicitamente no plano) só faz sentido nesse modelo — não dá pra "espiar o scroll" de uma página que mostra uma seção fixa por vez. Isso também tornou a navegação por teclado mais simples (rolar pra elemento em vez de trocar índice)
- [x] **Achado real de ambiente, verificado com teste isolado**: `new IntersectionObserver(cb).observe(el)` nunca invocou `cb` nesta sessão de preview, mesmo com o elemento genuinamente dentro do viewport — e `requestAnimationFrame` também nunca disparou (testado isoladamente, esperando 500ms). Ambos dependem do ciclo de compositing/pintura do browser, que esse painel de preview não roda (mesma causa-raiz documentada no `Armillary.tsx`/`ResizeFix`). A implementação usa `requestAnimationFrame` pra throttle de scroll de qualquer forma, porque é a prática correta num browser real — só não dá pra confirmar a marcação de `readAt` disparada por scroll de fato ao vivo *nesta* ferramenta; a marcação na carga inicial (que roda fora do rAF) foi confirmada ao vivo, e a lógica de posição (`getBoundingClientRect` contra a "linha de leitura") foi verificada isoladamente contra o DOM real
- [x] **Navegação por teclado verificada com um interceptador temporário de `scrollIntoView`**: dado que `behavior:"smooth"` também depende do mesmo ciclo quebrado, confirmei que `j`/`k` chamam `scrollIntoView` no elemento CERTO (seção seguinte/anterior) com as opções certas, mesmo sem poder ver a rolagem suave completar
- [x] Verificado ao vivo (numa aba nova, sem ruído de buffer de console): scroll contínuo com múltiplas seções renderizando juntas, árvore de capítulo com progresso real atualizando, ação "Me questione sobre isso" navegando pro Aetheris com o prompt certo pré-preenchido e o parâmetro da URL limpo depois, deep-link do painel de nó do Mapa (`/apostila?source=&node=`) ainda funcionando com o novo reader, realce de sintaxe carregando sob demanda sem inchar o bundle principal. `tsc`/120 testes/`vite build` limpos

---

## 8. F6 — Prática e Revisão

### 8.1 Prática

- [x] **Runner de um por vez** (hoje é scroll de todos), com barra de progresso da sessão
- [x] Entrada da sessão: fonte/nó/nível → N exercícios
- [x] **UI real por tipo** (hoje um único componente serve os 6) — com escopo honesto por tipo, ver nota abaixo
- [x] **Pontuação de verdade** — hoje `recordAttempt` grava sempre `scoreAwarded: 0`. Escolha-múltipla corrige localmente; texto livre vai por rubrica ao Aetheris
- [x] **Tela de resultado**: pontos, acerto por tipo, conceito mais fraco, "gerar cards dos erros", "revisar a seção"
- [x] Histórico de tentativas por exercício

**Status (2026-08-13):** Fechado, com escopo por tipo ajustado ao dado real (39 exercícios reais do Python, único conteúdo real hoje). Antes de desenhar qualquer UI, contei os tipos reais: 13× tipo 1, 11× tipo 2, 11× tipo 3, **1× tipo 4**, 3× tipo 5, 0× tipo 6 solto (tipo 6 vive na Revisão). Conferi o campo `choices` de cada tipo — só o tipo 1 tem `choices` estruturado; tipos 3/4/5 são só `promptMd`+`answerKeyMd` em prosa, sem alvo de linha nem passos ordenados. Isso mudou o plano original em dois pontos deliberados:

- **Tipo 4** ("dois painéis lado a lado"): a única ocorrência real embute as duas versões dentro de UM fence de código só (comentários `# versão A`/`# versão B`), não dois fences separados — não dá pra separar em dois painéis sem um parser frágil pra uma única instância. Tipo 4 usa o mesmo padrão dos tipos 3/5 (ver abaixo), com o código de ambas as versões renderizado com highlight real via `Markdown`.
- **Tipo 5** ("arrastar para ordenar"): nenhuma das 3 ocorrências reais tem `choices` populado, então não existe dado nenhum pra ordenar. Decidi **não** construir uma capacidade de drag "forward-compatible" que nunca ativa e não pode ser testada com dado real hoje — isso seria código morto, não uma feature. Documentado aqui como adiado até existir conteúdo real com `choices` ordenado; se/quando isso acontecer, é um componente novo, não uma migração.

UI real por tipo, então:
- **Tipo 1** (`MultipleChoiceRunner`): alternativas reais, correção local via `scoreMultipleChoice`, revela a certa em verde/a errada escolhida em vermelho. Sem explicação por-alternativa-errada separada (dado não tem esse campo) — a razão, quando existe, já vem embutida no próprio texto da alternativa nos dados reais.
- **Tipo 2** (`RubricRunner`): texto livre → `streamChat` com prompt novo (`lib/study/rubric.ts`, `buildRubricGradingMessages`/`parseRubricVerdict`, formato `NOTA:`/`FEEDBACK:` parseado por regex, nota mal-formada vira 0 em vez de passar em silêncio) → nota real + feedback da IA. Se a chamada de IA falhar (sem proxy configurado, rate limit, etc.) cai num fallback honesto: mostra o erro real, mostra a resposta esperada, oferece autoavaliação (Errei/Quase/Acertei) — a sessão nunca trava por causa de IA indisponível.
- **Tipos 3/4/5** (`SelfGradeRunner`, compartilhado): prompt+código com highlight real (`Markdown` agora usa Prism, ver abaixo) → resposta livre → revelar `answerKeyMd` real → autoavaliação (Errei/Quase/Acertei via `scoreSelfGrade`).

Extra não planejado mas necessário: `promptMd` de exercício é markdown com fences de código, e o `Markdown.tsx` só desenhava `<pre>` cru — sem highlight, ilegível pra código real. Extraí o loader do Prism de `CodeBlock.tsx` pra `lib/prism.ts` (compartilhado) e dei ao `Markdown.tsx` seu próprio highlight preguiçoso — mesma disciplina de `import()` dinâmico do F3/F6, sem duplicar o Prism no bundle. Isso também melhora de graça qualquer bloco de código que o Aetheris mande no chat.

Nova camada pura `lib/study/practice.ts` (seleção de sessão, `scoreMultipleChoice`/`scoreSelfGrade`/`scoreRubricFraction`, `computeSessionStats`, `missedExercises` — 15 testes) + `lib/study/rubric.ts` (5 testes). **Achado e corrigido no caminho**: o `Practice.tsx` antigo sempre lia `lib(index.sources[0].id)` — só o primeiro source tinha exercícios visíveis, então praticar um nó de qualquer outro source mostrava zero exercícios em silêncio. A tela de configuração nova lista todas as 21 fontes com contagem real por fonte e deixa escolher.

Verificado ao vivo (modo visitante, dado real semeado): sessão em "Chronos" rodou um exercício tipo 2 (falha real de IA → fallback de autoavaliação → nota registrada) e um tipo 5 (revelar → autoavaliação parcial), tela de resultado bateu a conta certa (25/35 = 71%, acerto por tipo 100%/50%, conceito mais fraco certo). Sessão separada em "Pluto" com exercício tipo 1: resposta errada corretamente pontuada 0, tela de resultado ofereceu "gerar cards dos erros", clicado e confirmado via `localStorage` que o card real foi criado com `frontMd`/`backMd` do exercício. "Revisar a seção" navegou com os parâmetros certos — mas o nó "mais fraco" nesse teste específico não tinha uma `ApostilaSection` correspondente no dado de demo legado (mais nós do que seções nesse source específico), então caiu no fallback já existente do F6 (mostra a primeira seção) — não é regressão, é lacuna de cobertura do dado de demo, documentada, não do código novo. `tsc`/151 testes/`vite build` limpos.

### 8.2 Revisão

- [x] **4 botões (Again/Hard/Good/Easy)** em vez dos 6 graus crus de 0–5 — o 0–5 é detalhe interno do SM-2 vazando para a UI. Mapear para o motor existente sem tocar em `srs.ts`
- [x] **Previsão de intervalo em cada botão** ("Bom → 6d") — é o que faz o usuário confiar no agendamento
- [x] Teclado: `espaço` vira, `1`–`4` classificam
- [x] Animação de virar o card (respeitando `prefers-reduced-motion`)
- [x] Contexto no card: de qual fonte/capítulo veio, link para a seção
- [x] Barra de progresso da fila + **resumo de sessão** (retenção, tempo, próximos vencimentos)
- [x] Manter export Anki TSV, mover para a toolbar

**Status (2026-08-13):** Fechado. Nova camada pura `lib/study/review.ts` (mapeamento botão→`SM2Grade`, `predictIntervalDays` via `computeSM2` real — não inventado —, `formatInterval`, `computeRetention`), 11 testes Vitest. `Review.tsx` reescrito: runner de fila com barra de progresso, flip 3D real (duas faces com `backface-visibility:hidden` + `rotateY`, `transition-transform` — a `@media (prefers-reduced-motion: reduce)` global do `index.css` já zera a duração de qualquer `transition`, então não precisou de tratamento especial), 4 botões com previsão de intervalo real por botão, atalhos de teclado (`espaço`/`1`-`4`), contexto do card (fonte + capítulo, via `lib(sourceId).sections`/`.chapters` casados por `nodeId`) com link "Ver na apostila" reusando o deep-link `/apostila?source=&node=` do F6, tela de resumo de sessão (retenção via `computeRetention`, tempo decorrido, vencimentos amanhã/7 dias). Export Anki TSV mantido, já estava na toolbar.

Verificado ao vivo (modo visitante, dados semeados reais: Chronos/Kairos/Pluto): flip alterna frente↔verso, os 4 botões mostram previsão real (todos "1d" num card zerado — matematicamente correto, `computeSM2` dá `intervalDays=1` pra qualquer grau aprovado quando `reps===0`, confirmado também no teste unitário de ordenação monotônica com um card maduro), clique num grau grava a nota, avança a fila (0/21→1/21) e troca de card, atalho de teclado `3` classifica corretamente. "Ver na apostila" navegou pro `/apostila?source=&node=` certo, seção certa (`Ponte Chronos-Kairos`) renderizada.

**Gap de verificação honesto:** clique por coordenada (`computer{action:"left_click", ref}`) neste pane não registrou de forma confiável nos elementos com `transform: rotateY(...)` nem no botão "Ver na apostila" — mesma limitação de compositing já documentada no F6 (pane não pinta frames reais), então hit-testing por coordenada fica não confiável sobre conteúdo 3D-transformado ou logo após uma navegação. Contornado disparando `KeyboardEvent`/`.click()` reais via JS diretamente no elemento — confirma que a lógica de evento em si funciona; não é uma alegação de que clique por mouse real funcionaria pixel-a-pixel neste pane especificamente.

---

## 9. F7 — Laboratórios (a terceira categoria)

**Status 2026-08-19 — em andamento, fundação funcional entregue.** `lib/labs/` agora contém catálogo curado dos quatro labs, motor puro de camadas/mutações/invariantes e grade compartilhada com BFS; `Labs.tsx` entrega a experiência de previsão → contrato → simulação → mutação → painel vermelho/verde → explicação persistida em `ChironIndex.labProgress` (migração v3). Ophis e Ágora têm transições de estado reais testadas; Dédalo usa BFS real; Micenas agora tem solver BFS, geração reversa e métrica real de solução/ramificação/bloqueadores. `authoring.ts` aceita apenas rascunhos e rejeita mecanicamente mutações sem invariante afetada. Falta para encerrar: ligação de cada lab a uma apostila publicada e persistência/fluxo de aprovação de labs gerados.

### 9.1 O motor de camadas guiadas — a resposta ao "que jeito fará isso?"

Entregar o app pronto não ensina. O motor faz assim:

Um lab é uma **lista ordenada de camadas**. Cada camada tem:

1. **Uma pergunta antes do código** — o aprendiz prevê/justifica antes de ver qualquer coisa (contrato socrático do tutor)
2. **Um contrato** — a especificação daquela camada em linguagem natural + as invariantes que ela promete manter
3. **O módulo real** — o código daquela camada, comentado, com o restante do app rodando ao vivo ao lado
4. **Mutações** — defeitos deliberados que podem ser ligados/desligados. O aprendiz prevê o que quebra, liga a mutação e **vê o painel de invariantes ficar vermelho**. Essa é a diferença entre ler e entender
5. **Painel de invariantes ao vivo** — verde/vermelho por invariante, em tempo real, enquanto o app roda
6. **A seção de apostila** correspondente, no painel ao lado

Progressão da camada = previsão correta + explicação aceita pela rubrica. Reusa o motor de correção da Prática — não é um sistema paralelo.

```ts
interface Lab { id; name; theme; layers: LabLayer[]; apostilaSourceId }
interface LabLayer {
  id; title; conceptId;
  questionMd: string;                       // antes do código
  contractMd: string;
  invariants: { id; label; check(state): boolean }[];
  mutations: { id; label; hypothesisMd; apply(mod): mod }[];
  sectionId: string;                        // ponte para a apostila
}
```

### 9.2 Os quatro labs

- [ ] **Ophis — a Serpe do Oráculo** (snake) · *gerenciamento de estado*
  Camadas: estado como dado único → tick e fonte da verdade → entrada e fila de direções (o bug clássico do duplo-giro) → colisão → crescimento → renderização como função do estado.
  Invariantes: corpo nunca duplica célula · comprimento = comida+1 · direção nunca inverte 180° em um tick.
  Mutações: mutar o estado no lugar · ler entrada direto sem fila · render mantendo estado próprio.

- [ ] **Ágora — o mercado** (simulação) · *modelagem de informações*
  Prateleira → carrinho → caixa. Camadas: modelar produto vs. item de carrinho (por que não são a mesma entidade) → reserva de estoque → concorrência: dois compradores, uma última unidade → cálculo do total (centavos inteiros, nada de float) → conciliação carrinho × produto → recibo.
  Invariantes: estoque nunca negativo · total do carrinho == soma dos itens · dois checkouts não vendem a mesma última unidade · preço do item bate com o do produto no instante da reserva.
  Mutações: guardar preço só por referência (muda o histórico retroativamente) · checar estoque sem reservar (a corrida clássica) · somar em float.

- [ ] **Labirinto de Dédalo** (reusa o motor de grade da Serpe) · *pathfinding*
  Camadas: grade e vizinhança → BFS (por que acha o menor caminho) → visitados (por que sem eles repete) → Dijkstra com custos → A* com heurística → detecção de inalcançável.
  Invariantes: caminho não repete célula · não atravessa parede · comprimento == distância BFS.
  Mutações: remover o conjunto de visitados · heurística inadmissível no A* (deixa de ser ótimo, e dá pra ver).
  Visualização: frente de expansão animada, comparando algoritmos lado a lado.

- [ ] **Portões de Micenas — Hora do Rush** (reusa a grade) · *geração e dificuldade*
  Camadas: modelar peças e movimentos → solver (BFS/IDA*) → **geração por movimentos reversos a partir do estado resolvido** (garante solubilidade por construção, em vez de gerar-e-testar) → medir dificuldade (movimentos mínimos + fator de ramificação + número de peças bloqueadoras) → escalonar em níveis.
  Invariantes: todo tabuleiro gerado é solúvel · a dificuldade declarada bate com a medida pelo solver.
  Mutações: gerar aleatório e torcer · medir dificuldade só por contagem de peças.

- [ ] **Motor de grade compartilhado** (`lib/labs/grid/`) — canvas, células, animação, entrada — usado pelos três labs de grade

### 9.3 Integração com as apostilas (o que você pediu)

- [x] Bloco `labref` na apostila: projeto integrador React → Lab Ophis → camada `invariants`
- [ ] Volta: cada camada de lab mostra a seção de apostila no painel ao lado, e "ler a teoria" abre a seção completa
- [ ] O capítulo integrador de cada stack (§3.4-A) aponta para um lab
- [ ] Labs contam para maestria e geram cards, como qualquer outra fonte
- [ ] `Source.kind` passa a ser `"repo" | "stack" | "lab"`

### 9.4 Geração automática de labs (confirmado 2026-07-29 — "sim, labs devem gerar automaticamente e novas coisas")

Os 4 labs acima não são o teto — são a semente curada que prova o motor. Igual à ingestão de repositório (§3.4-B), a criação de lab vira um **pipeline de rascunho + aprovação**, não conteúdo fixo:

- [ ] `lib/labs/authoring.ts`: dado um tema/conceito-alvo (texto livre ou escolhido de uma lista de lacunas de maestria), a IA propõe um `Lab` inteiro — camadas, pergunta-antes-do-código, contrato, invariantes (como *checagens executáveis* sobre o estado, não só texto), mutações com hipótese
- [ ] Mesma UX de proposta-e-aprovação do resto da suíte: o lab gerado chega como rascunho editável, nunca published direto
- [ ] Ação do Aetheris `generate_lab({ theme, conceptId? })` — vocabulário novo em §10, chip de proposta como qualquer outra ação
- [ ] Validação mecânica antes de aceitar: toda mutação declarada precisa de pelo menos uma invariante que ela quebre (senão a mutação não ensina nada) — checagem de dados, não de estilo de prosa
- [ ] Os 4 labs curados (§9.2) continuam sendo os únicos com motor de grade compartilhado reaproveitado por padrão; labs gerados por IA que precisem de um motor novo (fora grade/estado) ficam fora do escopo desta rodada — sinalizar no painel do lab que aquele tipo ainda não tem visualização dedicada, nunca falhar silenciosamente

---

## 10. F8 — Aetheris (paridade com o padrão ouro da suíte)

**Status 2026-08-19 — em andamento, paridade principal entregue.** Sessões nomeadas persistentes, anexos textuais, parser de `actions`, chips aplicados pelos mesmos serviços de estudo, histórico local com snapshot+desfazer, digest IA→heurístico com origem/timestamp, locale e contrato socrático literal no prompt foram implementados e testados. O painel é responsivo, mas o fallback abaixo de `lg` ainda é ocultação do trilho, não drawer inferior dedicado. Ações que pedem fluxos externos (ingestão, fonte, anotação e draft de Lab) seguem como proposta explícita, não execução silenciosa.

Auditado contra `SUITE-ARCHITECTURE.md` §3a. Falta:

- [ ] **Múltiplas sessões nomeadas** — dropdown no título, criar/trocar/apagar, título derivado da primeira mensagem (`lib/ai/chatSessions.ts`, copiar de Pluto)
- [ ] **Vocabulário de ações + chips** — `lib/ai/actions.ts` com bloco cercado ```` ```actions ````, `ActionPill.tsx` com cor resolvida da entidade real. Ações do Chiron: `create_cards` · `add_exercise` · `adjust_mastery` · `plan_session` · `add_source` · `ingest_source` · `annotate_section`
- [ ] **Proibir explicitamente no prompt** que o modelo cite os identificadores das ações em prosa (bug real já corrigido em Pluto e Kairos)
- [ ] **Desfazer + aba de Histórico** — `actionHistory.ts` com `logHistory`/`markUndone`, toast com desfazer **e** a aba (não repetir o buraco do Pluto, que só tem o toast)
- [ ] **Digest** — `lib/ai/insight.ts`: tenta IA primeiro, cai para heurística, badge `IA`/`Estrutural` + timestamp. Cards do digest do Chiron: nós fracos, cards se acumulando, capítulo travado, sequência em risco
- [ ] **Anexos de texto** (`attachments.ts`, padrão Kairos: csv/json/md/txt dobrados no prompt)
- [ ] **Linha de locale no prompt** — hoje `context.ts` não tem. Adicionar `The user's UI language is ${LOCALE_LABELS[locale].long}...` (é o bug que a suíte já mapeou)
- [ ] **Contrato do tutor no prompt, literal** (a alma do produto, direto do `CHIRON.md`): nunca escrever código para colar · sempre exigir o porquê · socrático antes de expositivo · toda afirmação sobre o código do usuário cita arquivo/função · dificuldade honesta ("isso está acima do seu nó atual") — incluindo as duas perguntas-modelo verbatim do plano original
- [ ] **Dropdown de autonomia** no compositor (e provider/modelo só nas Configurações — hoje o rodapé linka certo, manter)
- [ ] **Fallback mobile do painel lateral** — buraco documentado da suíte inteira. Fazer certo aqui (drawer inferior abaixo de `lg`) em vez de herdar
- [ ] Abas do dia 1: Visão geral · Digest · Histórico (nada de seis)

---

## 11. F9 — Configurações

**Status 2026-08-19 — em andamento.** IA ganhou autonomia e teste de conexão; GitHub ganhou PAT local que é repassado a `runIngestion`; leitura e ritmo de estudo agora têm preferências locais. Perfil/dados/sair já vivem no diálogo de perfil da sidebar desde F3. Ainda faltam importação JSON, limites SM-2 efetivamente configuráveis e uma seção Sobre própria nesta página.

De 2 seções para 7. Hoje a página inteira só serve para IA, porque aparência duplica a topbar.

- [ ] **Perfil** — nome, avatar, conta (nuvem × local), sair
- [ ] **Aparência** — tema (mantém, mas deixa de ser o conteúdo principal), densidade, **tipografia da apostila** (tamanho, medida, serifada/sem serifa) — configuração que só existe aqui e vale a página
- [ ] **IA** — provider, modelo, chave, URL do Ollama, autonomia, **botão testar conexão** (padrão Chronos)
- [ ] **GitHub** — PAT para repos privados / limite de taxa. **Confirmado como necessidade real, não hipotética, em 2026-07-29**: testando `/maps` → "Adicionar repositório" ao vivo contra `api.github.com`, bati no limite de 60 requisições/hora não-autenticadas depois de poucas chamadas (confirmado via header `X-RateLimit-Remaining: 0`). O pipeline (`lib/study/ingestion/fetcher.ts`) já aceita `token?: string` em toda função — só falta o campo em Configurações e passá-lo adiante em `run.ts`
- [ ] **Estudo** — orçamento diário padrão, teto de cards novos/dia, dias de graça da sequência, limites de facilidade do SM-2
- [ ] **Dados** — exportar/importar JSON, exportar Anki, resetar
- [ ] **Sobre** — versão, links da suíte

---

## 12. Passe visual (todas as páginas)

Não é um item de fim de lista — é critério de aceite de cada fase.

- [ ] Nenhuma página entrega "número dentro de um quadrado" — todo indicador tem forma (anel, sparkline, barra, donut)
- [ ] Estados vazios ilustrados e acionáveis (o `EmptyPage` genérico de hoje é placeholder)
- [ ] Skeletons durante ingestão e carga
- [ ] Responsivo dos dois lados: mobile fluido de verdade **e** desktop usando as colunas (sidebar + multi-coluna), sem coluna única esticada
- [ ] Movimento consistente com `--ease-editorial`, tudo respeitando `prefers-reduced-motion`
- [ ] Passe de acessibilidade: foco visível, contraste AA na rubrica sobre pergaminho e sobre tinta, navegação por teclado nas páginas densas

---

## 13. Fases (ordem de execução)

**F1.5 — o que foi entregue (2026-07-29):** `lib/study/ingestion/run.ts` (orquestra fetch do GitHub → 4 passes de IA → `DraftDocument`) e `materialize.ts` (drafts aprovados → `ChironIndex`/`ChironLib` reais, com resolução de título→id e 6 testes puros). `AddSourceDialog.tsx` ligado ao botão morto de "Adicionar repositório" em `/maps`. Corrigido no caminho: `generateExercises`/`generateSections`/`generateCards` nunca recebiam a lista de nós gerada pelo `generateMap`, então todo `nodeTitle` que esses passes emitiam era um chute — `materialize.ts` descartaria silenciosamente qualquer um que não batesse. Agora os três recebem os títulos válidos no prompt. **Verificado ao vivo, não só por typecheck**: cliquei no fluxo real no browser contra `https://github.com/Vininic/chronos-the-art-of-time` — o fetch do GitHub funcionou (confirmado batendo no rate limit real de 60/h não-autenticado, ver nota em §11), e a falha do passe de IA (sem proxy configurado neste ambiente) apareceu como mensagem de erro limpa, não como crash. O que eu **não pude** verificar é uma geração de IA de ponta a ponta com sucesso — não tenho credencial de proxy configurada aqui.

- [x] **F0 · Identidade** — tokens Iron Gall, marca, favicon, armilar 3D, login. *Desbloqueia todo o resto* — não verificado visualmente, ver nota em §2
- [x] **F1 · Modelo de conteúdo** — blocos tipados, Chapter, migração v2, contrato de completude + testes, `lib/content/logos.ts`. Ver notas abaixo, incluindo um bug real de produção corrigido no caminho.
- [x] **F1.5 · Ingestão do GitHub** — ver notas abaixo. Wired e verificado ao vivo contra a API real.
- [x] **R.1 · Persistência** — bug do localStorage corrigido em 2026-10-23 (ver §R.1)
- [x] **R.4 · Autoria in-app + badges** — entregue e exercitado com a apostila de exemplo em 2026-10-23 (ver §R.4)
- [~] **F2 · Conteúdo** — **reformulada em §R.2/§R.3; o texto a seguir é histórico.** Trinta e três fontes estão curadas e publicadas, de Python a Olympus, na ordem de `CONTENT_BATCHES`. Spring Boot, C, C++, Ruby, Ruby on Rails, PHP, Flask, Vue.js, Git / GitHub e Docker foram integralmente redigidas/materializadas como drafts 12/48/96/36/48; contratos/métricas passaram, mas faltam executores/gates semânticos específicos, então `editorial`/seed permanecem ausentes. Git / GitHub teve os 96 exemplos locais executados no Git/Bash/SSH/gh reais, mas rulesets, Actions, API, packages e audit continuam Pending sem sandbox autorizado. Docker não tem engine no host e seus 96 exemplos ainda não foram executados. Swagger está integralmente redigida/materializada como draft 14/56/112/42/56: contrato/editorial/typecheck passam e 75 exemplos JSON/TypeScript/Bash foram analisados por ferramentas reais; os 37 YAML e a semântica OpenAPI/gateway/registry/runtime seguem Pending, portanto nenhum conteúdo parcial entrou no seed. Todos os lotes/repositórios restantes seguem sem interrupção na ordem do rollout.
- [x] **F3 · Chrome** — títulos, sidebar, perfil, deletar `/progress`. Fechada 2026-08-07 — ver §4 para detalhes e verificação ao vivo
- [x] **F4 · Dashboard** — direção do Figma, três categorias, estatísticas integradas. Fechada 2026-08-09 — ver §5 para detalhes, deferrals documentados e verificação ao vivo
- [x] **F5 · Mapas** — layout DAG, destravamento, painel de nó. Fechada 2026-08-09 — ver §6 para detalhes e verificação ao vivo
- [x] **F6 · Reader** — três painéis, margem, blocos, progresso. Fechada 2026-08-09 — ver §7 para detalhes, deferrals e verificação ao vivo
- [x] **F7 · Prática e Revisão** — runner, 6 UIs, pontuação real, 4 botões SRS. Fechada 2026-08-13; nota em memória.
- [~] **F8 · Labs** — fundação funcional entregue; ver §9 para pendências honestas.
- [~] **F9 · Aetheris** — paridade principal entregue; ver §10 para pendências honestas.
- [~] **F10 · Configurações + passe visual final** — configurações expandidas; passe visual/a11y integral pendente.
- [~] **F11 · Ship** — dezoito seeds curados de Python a C# e PWA atualizados; deploy/documentação de suíte pendentes.

---

## 14. Perguntas em aberto (não bloqueiam o início)

1. ~~Quais stacks merecem apostila completa?~~ **Resolvido 2026-07-29**: as 41 skills reais de `glowportfolio/portfolio-data.json`, rollout por tier — ver §3.4-A.
2. Os labs geram cards SRS automaticamente ou só sob pedido? (inclino a: só sob pedido, para não inundar a fila)
3. ~~Ingestão do GitHub entra nesta rodada?~~ **Resolvido 2026-07-29**: sim — F1.5.
4. Labs gerados por IA (§9.4) fora do tema estado/modelagem/pathfinding/dificuldade vão precisar de motor de visualização próprio, não só o de grade. Adiar a decisão de "quantos motores construir de antemão" até ver o primeiro pedido real de geração.
