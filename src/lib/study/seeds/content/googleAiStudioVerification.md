# Google AI Studio — autoria integral e verificação por método

Revisão editorial: 2026-10-05. Fonte inteira após Lovable: 12 capítulos, 48 seções, 31.078 palavras, mínimo 624 (piso 600), 96 exemplos, 36 exercícios, 48 flashcards, porque/quebraria e Lab Ágora / reserva-estoque-concorrencia. jQuery não iniciada.

## Autoria e alcance

Registros específicos em scripts/ai-studio-lessons-01.mjs a 12.mjs e ai-studio-case-notes.mjs. Reutilizada somente a mecânica de materialização/contratos; prosa de outra fonte não importada. Currículo: Playground/Build, identidade e exportação, instruções/avaliação, modelos/tokens/cache, saída estruturada, multimodal, chamadas de função/assinaturas, grounding, segurança, transporte/Live, aplicações/deploy, avaliação e integrador Quíron.

96/96 programas JavaScript executados em Node v24.13.0 Windows x64, fresh VM por snippet confiável; VM não é sandbox adversarial. 30 local-rule, 32 local-transform, 34 model. Cada seção possui oracle literal independente e mutant específico detectado por assertion. Nenhum SDK, provider, resposta Gemini ou runtime Google AI Studio injetados. Os 96 SHA-256 finais foram reconferidos contra scripts/ai-studio-evidence.json por scripts/ai-studio-verification-tools.mjs.

Contratos/corpus 98/98. Auditoria: similaridade de seções 35,158057% (<42%), cards 7,692308% (<78%), exercícios detalhados 100%, pares altamente similares e snippets duplicados zero. Thresholds, assertions e timeouts preservados.

## Revisão semântica

Envelopes didáticos de system/user, API, schema, eventos Live e bloqueio não são payloads nativos prontos. Modelos e capacidades usam rótulos sintéticos, sem prometer disponibilidade ou preços. Orçamento de contexto é abstrato; contagem observada da fixture não é countTokens remoto. Cache TTL/revisão não prova recurso do provedor. Base64 AQID são três bytes, não imagem; áudio/vídeo são transformações de unidades e filtros, sem inferência.

JSON sintático exige validação de domínio; subset de schema varia por API. Function calling conserva identidade/dependências sem executar ferramentas comerciais. Thought signatures são opacas: GenerateContent liga metadados a partes; Interactions usa passos de pensamento/ferramentas integradas, com continuidade server ou reenvio stateless pertinente. sig-demo não é assinatura válida. A referência antiga thought-signatures migrou para thinking e foi corrigida.

Grounding supports é rótulo fornecido, não verificação de entailment. URL valida protocolo/hostname, sem fetch, DNS, redirects ou prova SSRF. File Search filtra documentos sintéticos por tenant/revisão, sem serviço. Code execution nativo usa Python; soma JavaScript local não o exercita. LIMIT é abreviação local, não enum Gemini prometido. Stream concatena bytes UTF-8, não é parser SSE/SDK.

Retry escolhe maior janela; se exceder teto retorna defer, sem encurtar espera exigida. Correção feita antes da execução final. Não implementa jitter/quota distribuída. Live session/generation são identidades locais; produção com cliente direto recomenda tokens efêmeros segundo documentação. Nenhuma conexão autenticada foi exercitada.

Build web atual documenta runtime server e segredo; Firebase tem autenticação e Firestore provisionados conforme caminho documentado, sem generalizar para exportação antiga ou Android. Login não autoriza todas as linhas. Health/revisão são modelo de readiness, sem Cloud Run. Rejeição conclusiva no roteiro de recuperação permite tratar entrada/repetir somente pelo contrato; unknown exige reconciliação antes de escrita. Fingerprint SHA-256 usa projeção ordenada específica, não canonicalização universal. Estoque pressupõe quantidade validada e transição serial; não prova concorrência, atomicidade ou durabilidade.

## Gates da aplicação

Typecheck da aplicação (`pnpm typecheck`, tsconfig.app.json) e build/PWA aprovados. Principal **6.086,12 kB** (gzip 2.048,66), book-google-ai-studio **320,47 kB** (gzip 64,09), precache **50 entradas / 124.967,12 KiB**; chunks finais presentes offline e teto **6 MiB** preservado. Assets anteriores retidos; build local, sem deploy externo. Warnings históricos de chunks grandes e Supabase estático/dinâmico permanecem.

Regressão local aplicável aprovada: **110 arquivos / 1751 testes passed**, 5 arquivos / 19 testes skipped preexistentes, 288.74 s, maxWorkers=1. Somente ubuntuLinux.examples.test.ts excluído explicitamente; seus 96 casos WSL não foram executados, não são aprovações nem novos skips. WSL é gate independente; suíte global completa não anunciada como verde. Assertions, timeouts e thresholds preservados; 96 digests finais reconferidos.

Reprodução: node scripts/create-ai-studio-builder.mjs; node scripts/build-ai-studio-content.mjs; CHIRON_WRITE_GOOGLE_AI_STUDIO_EVIDENCE=1 com pnpm exec vitest run nos dois arquivos googleAiStudio.test.ts e googleAiStudio.examples.test.ts --maxWorkers=1; node scripts/ai-studio-verification-tools.mjs; pnpm typecheck; pnpm build; pnpm exec vitest run --maxWorkers=1 --reporter=dot --exclude src/lib/study/seeds/content/ubuntuLinux.examples.test.ts. Variável no PowerShell deve ser definida por $env. Logs scripts/ai-studio-*-run.log.

## Capacidades pendentes

Playground/Build/agente e aplicação exportada reais, conta/projeto/modelos, geração/avaliação de dataset, countTokens/cache, multimodal, function calling/assinaturas, grounding/URL/File Search/Python remoto, segurança do serviço, SDK/stream/Live, Firebase/OAuth, Git sync/Cloud Run/billing/acessibilidade e backend/Lab concorrente durável permanecem Pending operacionalmente. Corpus local não é evidência dessas capacidades. Nenhuma infraestrutura instalada, distribuição WSL reiniciada ou publicação externa feita.

Retomada nativa exige projeto e conta de teste autorizados, executor do protocolo real, dois atores e entradas sintéticas: validar schemas/argumentos, acesso cruzado, recibo e saldo, duplicata, timeout/reconciliação e disputa. Registrar revisão/ambiente/método e resultado observado; conservar Pending onde não houve execução.

## Documentação oficial

28 páginas primárias referenciadas nas seções, consultadas em 2026-10-05 via web e HTTPS oficial; snapshots HTML em scripts/ai-studio-docs. A referência específica fullstack sustenta Firebase, evitando FAQ antigo divergente em Build. system-instructions redireciona para text-generation; thinking substitui a página movida de signatures. Nenhuma fonte secundária usada.

- [ai-studio-quickstart](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart)
- [api-key](https://ai.google.dev/gemini-api/docs/api-key)
- [prompting-strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- [system-instructions](https://ai.google.dev/gemini-api/docs/system-instructions)
- [interactions-overview](https://ai.google.dev/gemini-api/docs/interactions-overview)
- [text-generation](https://ai.google.dev/gemini-api/docs/text-generation)
- [models](https://ai.google.dev/gemini-api/docs/models)
- [tokens](https://ai.google.dev/gemini-api/docs/tokens)
- [caching](https://ai.google.dev/gemini-api/docs/caching)
- [structured-output](https://ai.google.dev/gemini-api/docs/structured-output)
- [image-understanding](https://ai.google.dev/gemini-api/docs/image-understanding)
- [files](https://ai.google.dev/gemini-api/docs/files)
- [audio](https://ai.google.dev/gemini-api/docs/audio)
- [video-understanding](https://ai.google.dev/gemini-api/docs/video-understanding)
- [function-calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [thinking](https://ai.google.dev/gemini-api/docs/thinking)
- [google-search](https://ai.google.dev/gemini-api/docs/google-search)
- [url-context](https://ai.google.dev/gemini-api/docs/url-context)
- [file-search](https://ai.google.dev/gemini-api/docs/file-search)
- [code-execution](https://ai.google.dev/gemini-api/docs/code-execution)
- [safety-settings](https://ai.google.dev/gemini-api/docs/safety-settings)
- [safety-guidance](https://ai.google.dev/gemini-api/docs/safety-guidance)
- [libraries](https://ai.google.dev/gemini-api/docs/libraries)
- [rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [live-api](https://ai.google.dev/gemini-api/docs/live-api)
- [aistudio-fullstack](https://ai.google.dev/gemini-api/docs/aistudio-fullstack)
- [aistudio-build-mode](https://ai.google.dev/gemini-api/docs/aistudio-build-mode)
- [aistudio-deploying](https://ai.google.dev/gemini-api/docs/aistudio-deploying)
