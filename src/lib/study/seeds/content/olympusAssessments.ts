import type { ContentSource } from "./types";
export const OLYMPUS_EXERCISES: ContentSource["exercises"] = [
  {
    "nodeTitle": "Família, evidência e identidade",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “O guarda-chuva e a fronteira dos repositórios”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que cinco entradas em SUITE_APPS são compatíveis com seis aplicativos na família? Avalie a alteração proposta: Inserir Olympus como irmão sem definir seus dados e painel cria uma autorreferência sem contrato de projeção. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.SUITE_APPS.map(a=>a.id));\n```",
    "answerKeyMd": "Resultado literal: [\"chronos\",\"kairos\",\"pluto\",\"hermes\",\"chiron\"]. O hub é o consumidor; o array modela os cinco irmãos que oferecem dados, documentos, contexto e painéis. Motivo: O registro representa os cinco provedores de domínio consumidos pelo hub; não é uma lista indistinta de todos os produtos. A contraprova deve distinguir a regra vigente desta quebra: Inserir Olympus como irmão sem definir seus dados e painel cria uma autorreferência sem contrato de projeção. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Família, evidência e identidade",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “Planos versionados e decisões que envelhecem”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O que uma inspeção textual do marcador Superseded demonstra? Avalie a alteração proposta: Usar a promessa antiga de diretório pequeno como regra atual remove justamente os painéis e documentos que motivaram a revisão. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/OLYMPUS.md\").includes(\"Superseded 2026-08-20\"));\n```",
    "answerKeyMd": "Resultado literal: true. Demonstra a advertência no arquivo local; não comprova deploy, funcionamento remoto ou atualização de todos os consumidores. Motivo: Precedência documental é por assunto e escopo; o v2 substitui páginas e posicionamento do plano original. A contraprova deve distinguir a regra vigente desta quebra: Usar a promessa antiga de diretório pequeno como regra atual remove justamente os painéis e documentos que motivaram a revisão. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Família, evidência e identidade",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “Conta comum e sessões por origem”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Qual evidência falta para uma rota protegida demonstrar autorização de dados? Avalie a alteração proposta: Inferir isCloud só da existência do cliente trata visitantes como contas e tenta sincronizar sem proprietário autenticado. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus/src/lib/auth.tsx\").match(/const KEY = \"([^\"]+)\"/)[1]);\n```",
    "answerKeyMd": "Resultado literal: \"olympus.session.v1\". Falta observar políticas e acesso remoto com identidades distintas; presença de sessão na UI não prova RLS. Motivo: Conta compartilhada reúne credenciais; sessão e armazenamento continuam delimitados pela origem e pelo namespace do aplicativo. A contraprova deve distinguir a regra vigente desta quebra: Inferir isCloud só da existência do cliente trata visitantes como contas e tenta sincronizar sem proprietário autenticado. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “O par user_id e key como endereço de domínio”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O que precisa coincidir para o hub ler o documento que um irmão escreveu? Avalie a alteração proposta: Registrar chiron-index sem confrontar o escritor chiron-data pode deixar o painel vazio apesar de o usuário ter acervo salvo. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.SUITE_APPS.map(a=>a.dataKey));\n```",
    "answerKeyMd": "Resultado literal: [\"schedule\",\"kairos-board\",\"pluto-ledger\",\"hermes-outbox\",\"chiron-index\"]. Identidade remota, chave de domínio e formato do valor, além de autorização e transporte funcionais; o catálogo sozinho não garante essa coincidência. Motivo: A chave composta separa proprietário e domínio; catálogo local e política SQL são partes distintas do contrato. A contraprova deve distinguir a regra vigente desta quebra: Registrar chiron-index sem confrontar o escritor chiron-data pode deixar o painel vazio apesar de o usuário ter acervo salvo. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “JSONB, tamanho e separação de bibliotecas”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. A recomendação de aproximadamente um megabyte é prova de um limite rígido do serviço? Avalie a alteração proposta: Dividir chaves sem migração coordenada pode deixar índice e bibliotecas apontando para documentos ausentes. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.emptyPrefs().meta.version);\n```",
    "answerKeyMd": "Resultado literal: 2. Não. É orientação arquitetural da fonte; medir payload e validar o serviço são verificações separadas. Motivo: O recipiente JSONB favorece evolução independente, mas tamanho, vínculos e migração permanecem contratos do aplicativo. A contraprova deve distinguir a regra vigente desta quebra: Dividir chaves sem migração coordenada pode deixar índice e bibliotecas apontando para documentos ausentes. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “Versão de escrita e versão de schema”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que meta.version e o version de uma escrita remota não devem ser comparados como a mesma grandeza? Avalie a alteração proposta: Usar o contador de gravações como schema deixa documentos antigos muito editados escaparem da transformação necessária. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate({theme:\"dark\"}).appearance.mode);\n```",
    "answerKeyMd": "Resultado literal: \"dark\". Um governa a interpretação do formato de preferências; o outro marca uma escrita da linha e não certifica compatibilidade estrutural. Motivo: Schema descreve forma persistida; timestamp de escrita identifica um evento do protocolo e não substitui migração. A contraprova deve distinguir a regra vigente desta quebra: Usar o contador de gravações como schema deixa documentos antigos muito editados escaparem da transformação necessária. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Pull, espelho e reidratação sem reload”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que um pull que retorna true não demonstra sozinho que o painel está atualizado? Avalie a alteração proposta: Gravar a cópia local sem notificar o store deixa a UI antiga mesmo quando a consulta remota retornou dados novos. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").includes(\"snapshot = localStorage.getItem(BOARD_STORAGE_KEY)\"));\n```",
    "answerKeyMd": "Resultado literal: true. Porque ainda depende do evento, do receptor, da leitura do espelho e da interpretação do payload pela projeção. Motivo: Pull, armazenamento do espelho e evento de reidratação são operações separadas; o booleano de leitura não atualiza a tela sozinho. A contraprova deve distinguir a regra vigente desta quebra: Gravar a cópia local sem notificar o store deixa a UI antiga mesmo quando a consulta remota retornou dados novos. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Push com debounce e escrita pendente”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Que diferença existe entre snapshot de comparação e confirmação remota? Avalie a alteração proposta: Uma falha após avançar snapshot pode deixar o mesmo JSON sem nova tentativa; listener de unload que agenda timer não garante entrega. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").match(/pushBoard[^\\n]+, ([0-9]+)[)]/)[1]);\n```",
    "answerKeyMd": "Resultado literal: \"1000\". O snapshot indica o JSON já observado localmente; confirmação exige resultado do serviço associado à revisão que foi enviada. Motivo: Debounce agrega edições, mas snapshot observado antes do ack não é comprovante de gravação remota. A contraprova deve distinguir a regra vigente desta quebra: Uma falha após avançar snapshot pode deixar o mesmo JSON sem nova tentativa; listener de unload que agenda timer não garante entrega. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Realtime e guarda contra o próprio eco”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que deskSync não precisa da mesma guarda de eco para linhas dos irmãos? Avalie a alteração proposta: Tratar ownVersions como algoritmo de merge permite sobrescrever edições estrangeiras mesmo sem nenhuma notificação repetida. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../kairos/src/lib/sync/boardSync.ts\").includes(\"ownVersions.has(row.version)\"));\n```",
    "answerKeyMd": "Resultado literal: true. Porque esse caminho só lê essas linhas; não produz as escritas de domínio cujo eco precisaria reconhecer. Motivo: A guarda reconhece marcadores produzidos no processo; filtrar eco é diferente de resolver concorrência entre documentos. A contraprova deve distinguir a regra vigente desta quebra: Tratar ownVersions como algoritmo de merge permite sobrescrever edições estrangeiras mesmo sem nenhuma notificação repetida. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Proxy comum e contrato HTTP”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O suporte de imagens pode estar pendente no plano e presente no código ao mesmo tempo? Avalie a alteração proposta: Tratar qualquer JSON retornado como text pode ocultar erros HTTP e apresentar falha remota como uma resposta vazia do assistente. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../chronos-audit/supabase/functions/ai-proxy/index.ts\").includes(\"Deno.env.get(\\\"GEMINI_API_KEY\\\")\"));\n```",
    "answerKeyMd": "Resultado literal: true. Sim. A documentação contém um marco histórico; é preciso registrar a diferença e ainda verificar clientes e serviço antes de afirmar funcionamento integral. Motivo: O proxy conserva segredo no servidor e oferece envelope comum; sua presença no checkout não comprova execução do serviço. A contraprova deve distinguir a regra vigente desta quebra: Tratar qualquer JSON retornado como text pode ocultar erros HTTP e apresentar falha remota como uma resposta vazia do assistente. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “CORS, rate limit e credenciais do servidor”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que a presença de corsFor não demonstra autorização por usuário? Avalie a alteração proposta: Anunciar cota rígida ignorando fail-open cria uma garantia operacional que desaparece justamente quando RPC ou configuração estão ausentes. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../chronos-audit/supabase/functions/ai-proxy/index.ts\").includes(\"Deno.env.get(\\\"ALLOWED_ORIGIN\\\") ?? \\\"*\\\"\"));\n```",
    "answerKeyMd": "Resultado literal: true. Porque headers de CORS tratam a relação com o navegador; identidade e permissão exigem mecanismos e configuração próprios. Motivo: Origem, segredo, rate limit e identidade são fronteiras distintas; o limitador observado permite requisições quando seu backend falha. A contraprova deve distinguir a regra vigente desta quebra: Anunciar cota rígida ignorando fail-open cria uma garantia operacional que desaparece justamente quando RPC ou configuração estão ausentes. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Adaptadores, streaming e orçamento de contexto”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. A chamada onDelta(text) no caminho hosted prova recebimento token a token? Avalie a alteração proposta: Tratar toda variante como streaming incremental esconde latência e pode perder distinções de cancelamento ou fragmento residual em EOF. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus/src/lib/ai/providers.ts\").includes(\"onDelta(text)\"));\n```",
    "answerKeyMd": "Resultado literal: true. Não. Ela acontece depois de receber o JSON completo e entrega uma string final ao mesmo callback usado pelos outros adaptadores. Motivo: O callback comum unifica consumo, mas hosted entrega o texto final uma vez; SSE exige um parser de fragmentos e término próprio. A contraprova deve distinguir a regra vigente desta quebra: Tratar toda variante como streaming incremental esconde latência e pode perder distinções de cancelamento ou fragmento residual em EOF. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Sessões de conversa e contexto de domínio”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Os limites de vinte sessões e quarenta mensagens comprovam o orçamento real enviado ao provedor? Avalie a alteração proposta: Aplicar uma resposta à sessão selecionada depois do envio, em vez da sessão capturada, pode misturar conversas quando a pessoa troca de aba. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chat = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/chatSessions.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chat.deriveTitle(\"  Uma\\n  pergunta  \"));\n```",
    "answerKeyMd": "Resultado literal: \"Uma pergunta\". Não. São limites da serialização local; o payload e o orçamento do adaptador precisam ser observados separadamente. Motivo: Conversa, autenticação e contexto de domínio têm identidades e persistências distintas; deriveTitle só prepara um rótulo local. A contraprova deve distinguir a regra vigente desta quebra: Aplicar uma resposta à sessão selecionada depois do envio, em vez da sessão capturada, pode misturar conversas quando a pessoa troca de aba. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Vocabulário de ações e confirmação”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O que acontece hoje se a resposta do Oráculo contiver uma cerca actions com delete? Avalie a alteração proposta: Trocar never por tipos de ação sem validação e serviços proprietários cria um escritor de domínio incompleto no hub. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst oracle = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/actions.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (oracle.parseActions(\"```actions\\n[{\\\"type\\\":\\\"delete\\\"}]\\n```\").actions);\n```",
    "answerKeyMd": "Resultado literal: []. parseActions preserva o texto e devolve actions vazio; esse módulo não executa a exclusão nem produz uma ação aplicável. Motivo: O Oráculo atual não interpreta cercas como ações; a autoridade dos assistentes varia por domínio e não pela aparência comum. A contraprova deve distinguir a regra vigente desta quebra: Trocar never por tipos de ação sem validação e serviços proprietários cria um escritor de domínio incompleto no hub. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Histórico, snapshots e desfazer”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que marcar undone não comprova sozinho que o estado de domínio foi restaurado? Avalie a alteração proposta: Restaurar snapshot anterior pode apagar edições posteriores sem relação com a proposta que motivou o desfazer. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst history = await import(pathToFileURL(resolve(\"../olympus/src/lib/ai/actionHistory.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (history.loadHistory());\n```",
    "answerKeyMd": "Resultado literal: []. Porque marcar o histórico e substituir índice/bibliotecas são etapas separadas, com efeitos e possíveis falhas distintos. Motivo: Snapshots restauram documentos inteiros; a aba de conversas e o stub de ações do Oráculo não constituem um ledger de mutações. A contraprova deve distinguir a regra vigente desta quebra: Restaurar snapshot anterior pode apagar edições posteriores sem relação com a proposta que motivou o desfazer. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "type": 2,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “Tokens, tinta e acento por aplicativo”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Os resultados de alpha demonstram contraste acessível? Avalie a alteração proposta: Usar o acento do host para todos os irmãos torna difícil identificar a origem de um painel e viola a propriedade semântica da cor. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.alpha(\"#3B6FA0\"));\n```",
    "answerKeyMd": "Resultado literal: \"#3B6FA016\". Não. Comprovam a transformação da string; contraste e estados de interação precisam de observação visual e método próprios. Motivo: color, ink e accent possuem papéis diferentes; alpha implementa uma convenção de concatenação, não uma avaliação visual. A contraprova deve distinguir a regra vigente desta quebra: Usar o acento do host para todos os irmãos torna difícil identificar a origem de um painel e viola a propriedade semântica da cor. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "type": 3,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “Sidebar, topbar e propriedade dos controles”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Um comentário que diz que só três itens pertencem à topbar comprova que o componente atual segue essa regra? Avalie a alteração proposta: Duplicar configurações em topbar e sidebar cria dois pontos equivalentes que podem divergir em estado ou comportamento. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.alpha(\"#112233\",\"solid\"));\n```",
    "answerKeyMd": "Resultado literal: \"#112233\". Não. O JSX atual inclui uma paleta opcional; comentário, regra e implementação precisam ser confrontados. Motivo: A moldura distribui a propriedade das ações; o botão opcional de paleta no código é uma diferença a registrar frente ao contrato histórico. A contraprova deve distinguir a regra vigente desta quebra: Duplicar configurações em topbar e sidebar cria dois pontos equivalentes que podem divergir em estado ou comportamento. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "type": 5,
    "level": "beginner",
    "points": 3,
    "promptMd": "Na seção “Perfil, preferências e compatibilidade de tema”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que a chave suite.theme igual em dois domínios não sincroniza os temas? Avalie a alteração proposta: Manter theme e appearance.mode sem precedência definida produz duas fontes de verdade e comportamento diferente entre leitores antigos e novos. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setAppearance({meta:{version:2},theme:\"dark\"},{mode:\"system\"}).theme);\n```",
    "answerKeyMd": "Resultado literal: \"dark\". Porque localStorage é delimitado pela origem; propagação depende de transporte remoto e de adoção do documento pelos consumidores. Motivo: System não tem equivalente no campo plano legado; conservar a última escolha explícita mantém uma política de compatibilidade. A contraprova deve distinguir a regra vigente desta quebra: Manter theme e appearance.mode sem precedência definida produz duas fontes de verdade e comportamento diferente entre leitores antigos e novos. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "type": 2,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Dicionários e formatação sem alterar o domínio”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que setLocale aceitar xx-unregistered não significa que existe esse dicionário? Avalie a alteração proposta: Traduzir headings canônicos de um protocolo sem atualizar o parser pode quebrar round-trip mesmo com a UI visualmente correta. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setLocale(prefs.emptyPrefs(),\"xx-unregistered\").locale);\n```",
    "answerKeyMd": "Resultado literal: \"xx-unregistered\". Porque o serviço não valida a lista do provider; guardar a preferência e resolver um vocabulário suportado são contratos separados. Motivo: O serviço guarda uma string, enquanto o provider resolve apenas locales suportados; apresentação não deve reescrever dados canônicos. A contraprova deve distinguir a regra vigente desta quebra: Traduzir headings canônicos de um protocolo sem atualizar o parser pode quebrar round-trip mesmo com a UI visualmente correta. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "type": 3,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “Registro de capacidades e habilitação”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Desabilitar um manifest demonstra bloqueio de autorização remota? Avalie a alteração proposta: Filtrar por truthiness em vez de distinguir undefined pode reativar uma extensão explicitamente desabilitada. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst service = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/service.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (service.setExtensionEnabled(prefs.emptyPrefs(),\"oracle\",false).extensions.enabled);\n```",
    "answerKeyMd": "Resultado literal: {\"oracle\":false}. Não. É configuração de consumo ou UI; rotas e backend possuem fronteiras próprias de acesso. Motivo: Ausência usa o default habilitado e false é uma escolha explícita; salvar preferência não comprova adoção de todos os consumidores. A contraprova deve distinguir a regra vigente desta quebra: Filtrar por truthiness em vez de distinguir undefined pode reativar uma extensão explicitamente desabilitada. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "type": 5,
    "level": "intermediate",
    "points": 3,
    "promptMd": "Na seção “O índice documental e os deep links”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. filterDocs realiza busca dentro de toda apostila ou ledger remoto? Avalie a alteração proposta: Um href bem formado para uma rota antiga pode impedir abrir a fonte correta mesmo quando título e contagem estão certos. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.kairosProjects({projects:[{id:\"p\",name:\"Projeto\"}],tasks:[{projectId:\"p\",status:\"todo\"}]}).map(p=>[p.id,p.count,p.open]));\n```",
    "answerKeyMd": "Resultado literal: [[\"p\",1,1]]. Não. Filtra a projeção por aplicativo e procura no título e no detalhe meta; não indexa o conteúdo completo dos domínios. Motivo: O índice reúne projeções documentais qualificadas por aplicativo; extrair metadados e navegar ao destino são contratos distintos. A contraprova deve distinguir a regra vigente desta quebra: Um href bem formado para uma rota antiga pode impedir abrir a fonte correta mesmo quando título e contagem estão certos. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “PWA, chunks e estado de atualização”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Ter um chunk separado comprova carregamento tardio? Avalie a alteração proposta: Um hub instalado pode abrir offline e continuar sem dados dos irmãos, porque seus espelhos não foram carregados nessa origem. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus/vite.config.ts\").includes(\"autoUpdate\"));\n```",
    "answerKeyMd": "Resultado literal: true. Não. Dependências e imports determinam quando ele é necessário; separação em arquivo não implica lazy loading. Motivo: Código precacheado, dados espelhados e versão do cliente são estados distintos; autoUpdate não elimina migração ou teste de atualização. A contraprova deve distinguir a regra vigente desta quebra: Um hub instalado pode abrir offline e continuar sem dados dos irmãos, porque seus espelhos não foram carregados nessa origem. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “SPA, origem e configuração de deploy”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O rewrite para index.html comprova que /panel/:id funciona em produção? Avalie a alteração proposta: Mudar domínio sem política de migração deixa dados guest na origem antiga mesmo quando a nova página abre corretamente. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (JSON.parse(source(\"../olympus/vercel.json\")).rewrites.map(r=>[r.source,r.destination]));\n```",
    "answerKeyMd": "Resultado literal: [[\"/(.*)\",\"/index.html\"]]. Não. Ainda é preciso verificar rota cliente, identificador, providers, artefato publicado e estado da janela no ambiente real. Motivo: Rewrite entrega a entrada da SPA; o roteador e a identidade da origem ainda determinam o destino e os dados disponíveis. A contraprova deve distinguir a regra vigente desta quebra: Mudar domínio sem política de migração deixa dados guest na origem antiga mesmo quando a nova página abre corretamente. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Checklist de irmão novo e revisão de drift”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Uma divergência entre o Oráculo e outro Aetheris é necessariamente defeito? Avalie a alteração proposta: Copiar um painel de configuração sem alinhar o namespace do leitor permite salvar uma opção que não muda o comportamento real. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/README.md\").includes(\"Pure domain core\"));\n```",
    "answerKeyMd": "Resultado literal: true. Não. Leitura sem ações é uma decisão concreta do hub; a revisão precisa distinguir exceção deliberada de drift acidental. Motivo: Checklist verifica relações entre consumidores, não só presença de arquivos; exceções de domínio podem ser intencionais. A contraprova deve distinguir a regra vigente desta quebra: Copiar um painel de configuração sem alinhar o namespace do leitor permite salvar uma opção que não muda o comportamento real. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Dayplanner e projeção de blocos do dia”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. parseDayplanner comprova que a grade semanal do Chronos está sem colisões? Avalie a alteração proposta: Usar um id sintético baseado na posição como referência de escrita pode apontar para outro bloco quando a lista muda. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst chronos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chronos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chronos.parseDayplanner({commitments:[{id:\"a\",date:panel.today(),start:\"09:00\",end:\"10:00\",title:\"Ler\"}]}).blocks.map(b=>[b.id,b.title,b.start,b.end]));\n```",
    "answerKeyMd": "Resultado literal: [[\"a\",\"Ler\",\"09:00\",\"10:00\"]]. Não. Ele filtra e apresenta dados; não executa o motor proprietário de agendamento nem valida todas as invariantes temporais. Motivo: O painel projeta itens do dia e não reimplementa o motor de composição e colisão do Chronos. A contraprova deve distinguir a regra vigente desta quebra: Usar um id sintético baseado na posição como referência de escrita pode apontar para outro bloco quando a lista muda. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Instante UTC, calendário local e horários”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Os dois casos de toMinutes e minutesNow validam timezone da suíte? Avalie a alteração proposta: Perto da meia-noite, selecionar data UTC e rotina local pode misturar referências de dias diferentes. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (panel.toMinutes(\"24:00\"));\n```",
    "answerKeyMd": "Resultado literal: null. Não. Verificam uma rejeição de horário e aritmética local fixa; zona, virada de dia e seleção de rotina exigem casos próprios. Motivo: today usa UTC e os helpers de hora e weekday usam calendário local; nomes semelhantes não garantem uma política temporal única. A contraprova deve distinguir a regra vigente desta quebra: Perto da meia-noite, selecionar data UTC e rotina local pode misturar referências de dias diferentes. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Rotina, compromissos e foco restante”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. doneCount um demonstra que a pessoa efetivamente concluiu a atividade? Avalie a alteração proposta: Oferecer uma nova tarefa com base apenas em remainingFocusHours pode ignorar compromissos que ocupam o mesmo intervalo. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst chronos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chronos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chronos.parseDayplanner({commitments:[{date:panel.today(),start:\"25:00\",end:\"26:00\"}]}).blocks.length);\n```",
    "answerKeyMd": "Resultado literal: 0. Não. Demonstra que a projeção encontrou uma entrada com done true; a evidência de execução da atividade está fora desse parser. Motivo: Foco restante no painel deriva da faixa de jornada; não é um cálculo completo de tempo livre após todas as restrições. A contraprova deve distinguir a regra vigente desta quebra: Oferecer uma nova tarefa com base apenas em remainingFocusHours pode ignorar compromissos que ocupam o mesmo intervalo. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Tarefa ativa, vencimento e prioridade”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Uma tarefa urgent em doing sempre aparece antes de uma tarefa atrasada low? Avalie a alteração proposta: Somar apenas os itens cortados por limit e comparar com todos os atrasos pode produzir um diagnóstico incorreto de divergência. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.parseNow({tasks:[{id:\"future\",dueDate:\"9999-01-01\",status:\"todo\"},{id:\"old\",dueDate:\"2000-01-01\",status:\"todo\"}]}).tasks.map(t=>t.id));\n```",
    "answerKeyMd": "Resultado literal: [\"old\"]. Não. A regra de classe coloca atraso antes de doing; prioridade só decide depois da classe temporal. Motivo: A classe temporal precede a prioridade; a lista visível e os totais podem usar limites diferentes. A contraprova deve distinguir a regra vigente desta quebra: Somar apenas os itens cortados por limit e comparar com todos os atrasos pode produzir um diagnóstico incorreto de divergência. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “O projeto como documento do quadro”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que count um e open zero são coerentes na fixture? Avalie a alteração proposta: Associar tarefas por título em vez de projectId pode misturar trabalho de projetos diferentes que usam nomes parecidos. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.kairosProjects({projects:[{id:\"p\",name:\"P\"}],tasks:[{projectId:\"p\",status:\"done\"},{projectId:\"p\",status:\"todo\",archivedAt:\"yes\"}]}).map(p=>[p.count,p.open]));\n```",
    "answerKeyMd": "Resultado literal: [[1,0]]. A tarefa concluída não arquivada entra no total; a arquivada fica fora e nenhuma tarefa ativa permanece aberta. Motivo: Projeto é uma unidade documental; count inclui concluídas não arquivadas e open exclui done, conservando significados distintos. A contraprova deve distinguir a regra vigente desta quebra: Associar tarefas por título em vez de projectId pode misturar trabalho de projetos diferentes que usam nomes parecidos. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Conclusão, arquivo e a visão Agora”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Uma tarefa doing sem prazo pode aparecer em Agora? Avalie a alteração proposta: Atualizar status para done sem tratar completedAt pode deixar a tarefa fora de doneToday mesmo quando aparece concluída. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst kairos = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/kairos.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (kairos.parseNow({tasks:[{id:\"doing\",status:\"doing\"}]}).tasks.map(t=>t.id));\n```",
    "answerKeyMd": "Resultado literal: [\"doing\"]. Sim. Doing é uma classe relevante depois de atrasadas e tarefas de hoje, mesmo quando dueDate está ausente. Motivo: Status e archivedAt representam dimensões distintas; o painel usa filtros e ordenação próprios, diferentes da ordem manual do board. A contraprova deve distinguir a regra vigente desta quebra: Atualizar status para done sem tratar completedAt pode deixar a tarefa fora de doneToday mesmo quando aparece concluída. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Pluto: centavos, saldo e pressão de orçamento”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O helper num garante centavos inteiros? Avalie a alteração proposta: Somar apenas os lançamentos recentes e exigir igualdade com o total mensal ignora que as duas coleções usam filtros diferentes. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst panel = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/types.ts\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = ((()=>{const date=panel.today();const b=pluto.parseBalance({transactions:[{type:\"income\",amountCents:1200,date},{type:\"expense\",amountCents:400,date}]});return [b.incomeCents,b.expenseCents,b.netCents]})());\n```",
    "answerKeyMd": "Resultado literal: [1200,400,800]. Não. Aceita números finitos; a integridade de centavos inteiros depende do domínio e de validação adicional. Motivo: Fluxo mensal, carteira, orçamento e meta possuem conjuntos diferentes; o parser projeta dados fornecidos e não realiza conciliação. A contraprova deve distinguir a regra vigente desta quebra: Somar apenas os lançamentos recentes e exigir igualdade com o total mensal ignora que as duas coleções usam filtros diferentes. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Pluto: carteira, meta e índice documental”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O resultado 25% da meta comprova que dinheiro foi movimentado? Avalie a alteração proposta: Usar apenas timestamps da meta pode deixá-la antiga na lista de recentes quando uma contribuição nova não atualiza o objeto proprietário. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst pluto = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/pluto.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (pluto.plutoDocs({wallets:[{id:\"w\",name:\"Carteira\"}],transactions:[{walletId:\"w\"}]}).map(d=>[d.kind,d.meta]));\n```",
    "answerKeyMd": "Resultado literal: [[\"wallet\",\"1 lançamentos\"]]. Não. É uma proporção calculada sobre fixtures de contribuição; não executa transação ou persistência. Motivo: O detalhe documental identifica trabalho; contagem de lançamentos não é saldo e percentual de meta não comprova disponibilidade de fundos. A contraprova deve distinguir a regra vigente desta quebra: Usar apenas timestamps da meta pode deixá-la antiga na lista de recentes quando uma contribuição nova não atualiza o objeto proprietário. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Hermes: estado da outbox e ordenação por falha”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Por que uma fila com um item visível pode mostrar duas falhas? Avalie a alteração proposta: Adicionar um estado novo no Hermes sem revisar o parser pode fazê-lo aparecer como pending no hub por causa do fallback. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst hermes = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/hermes.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (hermes.parseOutbox({messages:[{id:\"p\",status:\"pending\"},{id:\"f\",status:\"failed\"},{id:\"s\",status:\"sent\"}]}).messages.map(m=>m.id));\n```",
    "answerKeyMd": "Resultado literal: [\"f\",\"p\",\"s\"]. Porque limit corta a lista apresentada, enquanto failed conta todos os itens da coleção recebida. Motivo: A projeção ordena atenção e normaliza status; não executa o transporte nem verifica o recibo do canal. A contraprova deve distinguir a regra vigente desta quebra: Adicionar um estado novo no Hermes sem revisar o parser pode fazê-lo aparecer como pending no hub por causa do fallback. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "type": 2,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Chiron: índice, biblioteca e revisão por fonte”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Os dois casos de parseReview demonstram que Olympus lê o acervo remoto atual do Chiron? Avalie a alteração proposta: Com mais de seis fontes, apresentar dueTotal como total global pode ocultar cards de grupos que ficaram fora do recorte. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.parseReview({sources:[{id:\"s\",name:\"Livro\"}],cards:[{sourceId:\"s\",dueDate:\"2000-01-01\"},{sourceId:\"s\",dueDate:\"9999-01-01\"}]}).groups.map(g=>[g.title,g.due,g.total]));\n```",
    "answerKeyMd": "Resultado literal: [[\"Livro\",1,2]]. Não. As fixtures são compatíveis com o parser; chave e envelope reais apresentam drift que requer integração e migração próprias. Motivo: O hub projeta revisão por fonte; dueTotal usa grupos já limitados e não certifica todo o índice ou a integração remota. A contraprova deve distinguir a regra vigente desta quebra: Com mais de seis fontes, apresentar dueTotal como total global pode ocultar cards de grupos que ficaram fora do recorte. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "type": 3,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Chiron: curadoria, exemplos e aprendizado real”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. Uma seção marcada readAt comprova compreensão do mecanismo? Avalie a alteração proposta: Usar Sem fonte para esconder uma referência órfã pode fazer a UI parecer saudável enquanto o contrato de identidade continua quebrado. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst chiron = await import(pathToFileURL(resolve(\"../olympus/src/lib/panels/chiron.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (chiron.chironDocs({sources:[{id:\"s\",title:\"Apostila\"}],cards:[]}).map(d=>[d.title,d.cards]));\n```",
    "answerKeyMd": "Resultado literal: [[\"Apostila\",0]]. Não. É um registro de interação; compreensão exige justificativa, aplicação e evidência de desempenho apropriada. Motivo: Formato, cobertura, execução e aprendizado são dimensões distintas; um fallback visual não aprova uma fonte editorialmente incompleta. A contraprova deve distinguir a regra vigente desta quebra: Usar Sem fonte para esconder uma referência órfã pode fazer a UI parecer saudável enquanto o contrato de identidade continua quebrado. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "type": 5,
    "level": "advanced",
    "points": 3,
    "promptMd": "Na seção “Olympus: painéis de leitura e contrato de integração”, preveja o resultado literal do programa abaixo e justifique a regra antes de executá-lo. O retorno de appByPanel para chiron-review certifica a integração remota? Avalie a alteração proposta: Defaults que escondem uma key incompatível podem apresentar painel vazio como se o usuário realmente não tivesse dados. Escreva uma contraprova e indique qual efeito de UI ou serviço não é observado por este programa.\n\n```javascript\nimport {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.appByPanel(\"chiron-review\").id);\n```",
    "answerKeyMd": "Resultado literal: \"chiron\". Não. Certifica apenas o vínculo no registro local; key, envelope, sincronização e consumidor ainda precisam coincidir. Motivo: O hub compõe projeções e contratos; um panelId registrado não comprova leitura remota, rota ou escrita de domínio. A contraprova deve distinguir a regra vigente desta quebra: Defaults que escondem uma key incompatível podem apresentar painel vazio como se o usuário realmente não tivesse dados. A evidência é limitada ao corpo publicado e ao escopo da legenda, sem certificar efeitos de browser ou serviços remotos."
  }
];
export const OLYMPUS_CARDS: ContentSource["cards"] = [
  {
    "nodeTitle": "Família, evidência e identidade",
    "frontMd": "Por que cinco entradas em SUITE_APPS são compatíveis com seis aplicativos na família?",
    "backMd": "O hub é o consumidor; o array modela os cinco irmãos que oferecem dados, documentos, contexto e painéis."
  },
  {
    "nodeTitle": "Família, evidência e identidade",
    "frontMd": "O que uma inspeção textual do marcador Superseded demonstra?",
    "backMd": "Demonstra a advertência no arquivo local; não comprova deploy, funcionamento remoto ou atualização de todos os consumidores."
  },
  {
    "nodeTitle": "Família, evidência e identidade",
    "frontMd": "Qual evidência falta para uma rota protegida demonstrar autorização de dados?",
    "backMd": "Falta observar políticas e acesso remoto com identidades distintas; presença de sessão na UI não prova RLS."
  },
  {
    "nodeTitle": "Família, evidência e identidade",
    "frontMd": "Por que o tipo SuitePrefs no retorno não comprova validação runtime completa?",
    "backMd": "Porque campos desconhecidos podem atravessar spreads e casts; a garantia depende das verificações efetivamente executadas."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "frontMd": "O que precisa coincidir para o hub ler o documento que um irmão escreveu?",
    "backMd": "Identidade remota, chave de domínio e formato do valor, além de autorização e transporte funcionais; o catálogo sozinho não garante essa coincidência."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "frontMd": "A recomendação de aproximadamente um megabyte é prova de um limite rígido do serviço?",
    "backMd": "Não. É orientação arquitetural da fonte; medir payload e validar o serviço são verificações separadas."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "frontMd": "Por que meta.version e o version de uma escrita remota não devem ser comparados como a mesma grandeza?",
    "backMd": "Um governa a interpretação do formato de preferências; o outro marca uma escrita da linha e não certifica compatibilidade estrutural."
  },
  {
    "nodeTitle": "Documentos no backend compartilhado",
    "frontMd": "O que a ausência de apiKey em emptyPrefs comprova e o que não comprova?",
    "backMd": "Comprova a forma inicial das preferências; não comprova que backups, logs e outros escritores nunca incluam credenciais."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "frontMd": "Por que um pull que retorna true não demonstra sozinho que o painel está atualizado?",
    "backMd": "Porque ainda depende do evento, do receptor, da leitura do espelho e da interpretação do payload pela projeção."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "frontMd": "Que diferença existe entre snapshot de comparação e confirmação remota?",
    "backMd": "O snapshot indica o JSON já observado localmente; confirmação exige resultado do serviço associado à revisão que foi enviada."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "frontMd": "Por que deskSync não precisa da mesma guarda de eco para linhas dos irmãos?",
    "backMd": "Porque esse caminho só lê essas linhas; não produz as escritas de domínio cujo eco precisaria reconhecer."
  },
  {
    "nodeTitle": "Sincronização como protocolo observável",
    "frontMd": "O que os dois casos de migrate demonstram sobre validação?",
    "backMd": "Há normalização de startPage, mas campos de appearance podem conservar valores inesperados; a garantia é específica de cada ramo."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "frontMd": "O suporte de imagens pode estar pendente no plano e presente no código ao mesmo tempo?",
    "backMd": "Sim. A documentação contém um marco histórico; é preciso registrar a diferença e ainda verificar clientes e serviço antes de afirmar funcionamento integral."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "frontMd": "Por que a presença de corsFor não demonstra autorização por usuário?",
    "backMd": "Porque headers de CORS tratam a relação com o navegador; identidade e permissão exigem mecanismos e configuração próprios."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "frontMd": "A chamada onDelta(text) no caminho hosted prova recebimento token a token?",
    "backMd": "Não. Ela acontece depois de receber o JSON completo e entrega uma string final ao mesmo callback usado pelos outros adaptadores."
  },
  {
    "nodeTitle": "Transporte de IA e autoridade",
    "frontMd": "O exemplo que preserva a frase maliciosa demonstra proteção contra prompt injection?",
    "backMd": "Não. Demonstra a transformação textual real; a autoridade das instruções e o comportamento do modelo precisam de controles e evidência próprios."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "frontMd": "Os limites de vinte sessões e quarenta mensagens comprovam o orçamento real enviado ao provedor?",
    "backMd": "Não. São limites da serialização local; o payload e o orçamento do adaptador precisam ser observados separadamente."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "frontMd": "O que acontece hoje se a resposta do Oráculo contiver uma cerca actions com delete?",
    "backMd": "parseActions preserva o texto e devolve actions vazio; esse módulo não executa a exclusão nem produz uma ação aplicável."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "frontMd": "Por que marcar undone não comprova sozinho que o estado de domínio foi restaurado?",
    "backMd": "Porque marcar o histórico e substituir índice/bibliotecas são etapas separadas, com efeitos e possíveis falhas distintos."
  },
  {
    "nodeTitle": "Aetheris, proposta e efeito",
    "frontMd": "Por que um digest coerente não comprova que o hub leu o acervo atual de todos os irmãos?",
    "backMd": "Porque depende de chaves, espelhos, parsers e atualização; uma projeção ausente ou antiga pode produzir um resumo plausível e incompleto."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "frontMd": "Os resultados de alpha demonstram contraste acessível?",
    "backMd": "Não. Comprovam a transformação da string; contraste e estados de interação precisam de observação visual e método próprios."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "frontMd": "Um comentário que diz que só três itens pertencem à topbar comprova que o componente atual segue essa regra?",
    "backMd": "Não. O JSX atual inclui uma paleta opcional; comentário, regra e implementação precisam ser confrontados."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "frontMd": "Por que a chave suite.theme igual em dois domínios não sincroniza os temas?",
    "backMd": "Porque localStorage é delimitado pela origem; propagação depende de transporte remoto e de adoção do documento pelos consumidores."
  },
  {
    "nodeTitle": "A gramática visual da família",
    "frontMd": "O que setAppearance com reduceMotion true demonstra?",
    "backMd": "Demonstra a transformação da preferência no documento; não demonstra que CSS, canvas e componentes efetivamente reduziram movimento."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "frontMd": "Por que setLocale aceitar xx-unregistered não significa que existe esse dicionário?",
    "backMd": "Porque o serviço não valida a lista do provider; guardar a preferência e resolver um vocabulário suportado são contratos separados."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "frontMd": "Desabilitar um manifest demonstra bloqueio de autorização remota?",
    "backMd": "Não. É configuração de consumo ou UI; rotas e backend possuem fronteiras próprias de acesso."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "frontMd": "filterDocs realiza busca dentro de toda apostila ou ledger remoto?",
    "backMd": "Não. Filtra a projeção por aplicativo e procura no título e no detalhe meta; não indexa o conteúdo completo dos domínios."
  },
  {
    "nodeTitle": "Idioma, extensões e documentos",
    "frontMd": "O retorno default de readDesktopPrefs no Node comprova pinning real?",
    "backMd": "Não. Observa a recuperação sem storage de navegador; não abre janela nem testa API do sistema operacional."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "frontMd": "Ter um chunk separado comprova carregamento tardio?",
    "backMd": "Não. Dependências e imports determinam quando ele é necessário; separação em arquivo não implica lazy loading."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "frontMd": "O rewrite para index.html comprova que /panel/:id funciona em produção?",
    "backMd": "Não. Ainda é preciso verificar rota cliente, identificador, providers, artefato publicado e estado da janela no ambiente real."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "frontMd": "Uma divergência entre o Oráculo e outro Aetheris é necessariamente defeito?",
    "backMd": "Não. Leitura sem ações é uma decisão concreta do hub; a revisão precisa distinguir exceção deliberada de drift acidental."
  },
  {
    "nodeTitle": "Entrega, offline e operação",
    "frontMd": "O que falta depois de setSpeech produzir rate dois para afirmar que TTS funciona?",
    "backMd": "Falta o consumidor aplicar a preferência e a plataforma efetivamente sintetizar fala; o teste puro não observa esse efeito."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "frontMd": "parseDayplanner comprova que a grade semanal do Chronos está sem colisões?",
    "backMd": "Não. Ele filtra e apresenta dados; não executa o motor proprietário de agendamento nem valida todas as invariantes temporais."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "frontMd": "Os dois casos de toMinutes e minutesNow validam timezone da suíte?",
    "backMd": "Não. Verificam uma rejeição de horário e aritmética local fixa; zona, virada de dia e seleção de rotina exigem casos próprios."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "frontMd": "doneCount um demonstra que a pessoa efetivamente concluiu a atividade?",
    "backMd": "Não. Demonstra que a projeção encontrou uma entrada com done true; a evidência de execução da atividade está fora desse parser."
  },
  {
    "nodeTitle": "Chronos: o tempo possui geometria",
    "frontMd": "O retorno de sendToChronos sem erro significa que a tarefa já ocupa um horário?",
    "backMd": "Não. Significa que o pedido foi gravado no caminho observado; aceitação, compromisso e recibo pertencem ao consumidor Chronos."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "frontMd": "Uma tarefa urgent em doing sempre aparece antes de uma tarefa atrasada low?",
    "backMd": "Não. A regra de classe coloca atraso antes de doing; prioridade só decide depois da classe temporal."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "frontMd": "Por que count um e open zero são coerentes na fixture?",
    "backMd": "A tarefa concluída não arquivada entra no total; a arquivada fica fora e nenhuma tarefa ativa permanece aberta."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "frontMd": "Uma tarefa doing sem prazo pode aparecer em Agora?",
    "backMd": "Sim. Doing é uma classe relevante depois de atrasadas e tarefas de hoje, mesmo quando dueDate está ausente."
  },
  {
    "nodeTitle": "Kairos: oportunidade, ordem e projeto",
    "frontMd": "Mudar dueDate no Markdown reprograma automaticamente o compromisso do Chronos?",
    "backMd": "Não. O round-trip altera o board pelo seu contrato; ponte e compromisso possuem estados, referências e autoridade próprios."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "frontMd": "O helper num garante centavos inteiros?",
    "backMd": "Não. Aceita números finitos; a integridade de centavos inteiros depende do domínio e de validação adicional."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "frontMd": "O resultado 25% da meta comprova que dinheiro foi movimentado?",
    "backMd": "Não. É uma proporção calculada sobre fixtures de contribuição; não executa transação ou persistência."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "frontMd": "Por que uma fila com um item visível pode mostrar duas falhas?",
    "backMd": "Porque limit corta a lista apresentada, enquanto failed conta todos os itens da coleção recebida."
  },
  {
    "nodeTitle": "Pluto e Hermes: dinheiro e entrega",
    "frontMd": "A presença de pg_cron no plano comprova que houve envio real nesta revisão?",
    "backMd": "Não. É uma decisão documentada; executar o cron, observar o consumer e confirmar o efeito são etapas operacionais separadas."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "frontMd": "Os dois casos de parseReview demonstram que Olympus lê o acervo remoto atual do Chiron?",
    "backMd": "Não. As fixtures são compatíveis com o parser; chave e envelope reais apresentam drift que requer integração e migração próprias."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "frontMd": "Uma seção marcada readAt comprova compreensão do mecanismo?",
    "backMd": "Não. É um registro de interação; compreensão exige justificativa, aplicação e evidência de desempenho apropriada."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "frontMd": "O retorno de appByPanel para chiron-review certifica a integração remota?",
    "backMd": "Não. Certifica apenas o vínculo no registro local; key, envelope, sincronização e consumidor ainda precisam coincidir."
  },
  {
    "nodeTitle": "Chiron e Olympus: aprender e integrar",
    "frontMd": "Toggle duas vezes e movePanel aprovados demonstram reordenação visual por drag?",
    "backMd": "Não. Demonstram transformações do documento de preferência; a UI e seus efeitos precisam de verificação própria."
  }
];
