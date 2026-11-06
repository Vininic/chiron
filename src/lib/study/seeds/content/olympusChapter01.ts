import type { ContentChapter } from "./types";
export const OLYMPUS_CHAPTER_1: ContentChapter = {
  "title": "Família, evidência e identidade",
  "level": "basico",
  "nodeTitle": "Família, evidência e identidade",
  "nodeKind": "concept",
  "sections": [
    {
      "title": "O guarda-chuva e a fronteira dos repositórios",
      "order": 0,
      "blocks": [
        {
          "kind": "prose",
          "md": "Olympus é o nome da família e também do aplicativo que integra seus domínios. Essa dupla utilização exige uma distinção inicial. A família reúne Chronos, Kairos, Pluto, Hermes e Chiron, enquanto o hub oferece uma entrada comum, painéis e conversa sobre os dados desses irmãos. O repositório olympus-plan reúne decisões que atravessam os aplicativos. Esta apostila documenta esse contrato compartilhado e confronta suas afirmações com implementações locais. Ela não transforma uma lista de links numa integração pronta nem substitui a documentação interna de cada algoritmo dos irmãos.\n\nO README apresenta uma receita: núcleo de domínio puro, armazenamento local, conta compartilhada opcional, identidade visual própria e um assistente com especialidade. A receita não é um pacote instalado em todos os projetos. Os arquivos foram copiados e evoluíram separadamente. Assim, uma função corrigida no hub não muda automaticamente a versão que existe no Kairos. O custo dessa independência é a necessidade de comparar cópias, registrar diferenças e testar consumidores. Procurar uma biblioteca central que não existe atrasaria o diagnóstico de um comportamento divergente.\n\nO registro SUITE_APPS, em olympus/src/lib/suite/registry.ts, fornece uma fronteira concreta para o hub. Cada entrada liga identidade, endereço, chave de dados, espelho local, painel e capacidades. São cinco irmãos nesse registro; o próprio Olympus não aparece como sexto irmão porque é o consumidor do catálogo. Os exemplos executam esse módulo real e exigem a sequência de identificadores observada. A ausência de olympus no array não significa que o produto não existe: significa que o modelo representa provedores externos ao hub, com um papel específico.\n\nEssa diferença de papel organiza a investigação. Quando um painel não aparece, primeiro confira se o aplicativo está registrado e oferece a capacidade necessária. Quando aparece vazio, prossiga para a chave remota, o espelho e o parser. Quando exibe dados antigos, investigue sincronização e atualização da página. Corrigir o nome de uma entrada não recupera uma linha ausente no backend. A cadeia liga contratos distintos, e cada passo precisa de uma observação correspondente antes de alterar outro repositório ou anunciar que o problema foi resolvido.\n\nA fronteira desta fonte também importa. Os treze documentos Markdown do olympus-plan são o material planejador principal, incluindo arquitetura, shell, roadmap, backlog e especificações de produto. Código dos irmãos serve como fonte primária de confronto e como objeto dos exemplos locais. Cobrir o contrato guarda-chuva não permite afirmar que cada função dos seis aplicativos foi auditada novamente. A organização reserva os primeiros oito capítulos ao comum e os quatro seguintes às diferenças de domínio. Essa distribuição evita repetir autenticação cinco vezes e esconder o que cada sistema faz de particular.\n\nAo acrescentar um irmão, descreva primeiro sua autoridade: quais dados possui, qual documento exporta e o que o hub pode interpretar. Depois alinhe catálogo, espelho, parser, painel, documentos e contexto do assistente. O teste do catálogo verifica endereçamento e cardinalidade, mas não visita URLs nem autentica usuários. Um status live na constante é uma declaração do código, não uma medição de disponibilidade. O leitor deve conservar essa distinção ao usar os programas publicados como evidência e ao decidir quais verificações ainda precisam de um ambiente real.\n\nA revisão conceitual termina quando é possível apontar quem escreve o documento, quem o projeta e quem apenas navega para seu proprietário. Esse mapa permite modificar uma superfície sem atribuir ao hub operações que continuam pertencendo ao irmão. Duplicar o domínio inteiro no Olympus criaria dois escritores e duas interpretações de invariantes. Integrar uma projeção limitada mantém a decisão importante disponível sem prometer equivalência completa. A escolha deve permanecer explícita no código, nas legendas e nas mensagens apresentadas ao usuário. Uma mudança de proprietário exige revisar também migração, autorização e referências existentes, não apenas o componente que apresenta o dado."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.SUITE_APPS.map(a=>a.id));\nconst expected = [\"chronos\",\"kairos\",\"pluto\",\"hermes\",\"chiron\"];\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst registry = await import(pathToFileURL(resolve(\"../olympus/src/lib/suite/registry.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (registry.SUITE_APPS.some(a=>a.id===\"olympus\"));\nconst expected = false;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "O registro representa os cinco provedores de domínio consumidos pelo hub; não é uma lista indistinta de todos os produtos."
        },
        {
          "kind": "quebraria",
          "md": "Inserir Olympus como irmão sem definir seus dados e painel cria uma autorreferência sem contrato de projeção."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/README.md",
          "symbol": "The suite at a glance",
          "lines": [
            18,
            18
          ]
        },
        {
          "kind": "prose",
          "md": "### Mapa de leitura e fronteira da família — ../olympus-plan/README.md\n\nResponsabilidade: Apresenta os seis aplicativos, portas, documentos e regras de trabalho. É índice de orientação, não um registro de saúde de produção.\n\nLimite e precedência: O status resumido pode estar atrás das especificações e do código; não usá-lo sozinho para declarar entrega.\n\nComo estender: Ao mudar um contrato comum, alinhe o índice com o documento que possui a decisão e preserve links de retomada."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/README.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Receita compartilhada e registro de chaves — ../olympus-plan/SUITE-ARCHITECTURE.md\n\nResponsabilidade: Reúne stack, KV, sync, proxy, Aetheris, bridges, design e checklist de irmão novo. Possui regras normativas e marcos datados.\n\nLimite e precedência: Trechos como strict por aplicativo, chave Chiron e suporte de imagem precisam de confronto com implementação; não são garantias uniformes do checkout.\n\nComo estender: Registre novas keys e versões; descreva exceções e teste leitores e escritores antes de propagar uma afirmação aos irmãos."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-ARCHITECTURE.md",
          "symbol": "module",
          "lines": [
            130,
            130
          ]
        },
        {
          "kind": "prose",
          "md": "### Contrato de propriedade da moldura — ../olympus-plan/SUITE-SHELL.md\n\nResponsabilidade: Define sidebar, topbar, configurações, Sobre, preferências e shell desktop com base numa revisão histórica entre aplicativos.\n\nLimite e precedência: A lista normativa não comprova que JSX atual segue toda regra: Topbar inclui paleta opcional e componentes continuam cópias independentes.\n\nComo estender: Atualize decisão e cópias pertinentes juntas, conferindo mobile, teclado e janelas separadas com observação adequada."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/SUITE-SHELL.md",
          "symbol": "module",
          "lines": [
            149,
            149
          ]
        },
        {
          "kind": "prose",
          "md": "### Plano original preservado — ../olympus-plan/OLYMPUS.md\n\nResponsabilidade: Conserva naming, identidade, restrição de origens e notas de PWA do hub original. Seu posicionamento pequeno foi explicitamente substituído.\n\nLimite e precedência: Páginas e milestones antigos não governam o hub v2; a promessa de demo guest não prova implementação atual.\n\nComo estender: Acrescente remissivas à decisão substituta sem apagar a história que explica por que o produto mudou."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/OLYMPUS.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Aplicação-mãe e peças destacáveis — ../olympus-plan/OLYMPUS-V2.md\n\nResponsabilidade: Especifica Home/Chat, documentos, painéis nativos, extensões e integração desktop como reposicionamento do produto.\n\nLimite e precedência: Capacidade desejada ou caixa marcada não prova serviço remoto, compilação Tauri ou compatibilidade com documentos reais dos irmãos.\n\nComo estender: Ao ampliar um painel, explicite autoridade, envelope, rota, recorte e método de verificação sem reimplementar todo o domínio."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/OLYMPUS-V2.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Marcos e correções de andamento — ../olympus-plan/ROADMAP.md\n\nResponsabilidade: Registra fases da família e atualizações que corrigem conclusões antigas sobre completude, layout e entrega.\n\nLimite e precedência: Uma data antiga ou declaração shipped pode referir-se a deploy e ainda coexistir com lacunas funcionais; ler correções por assunto.\n\nComo estender: Marque trabalho concluído com evidência e mantenha pendências específicas, sem usar histórico como a próxima tarefa atual."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/ROADMAP.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Diferença entre implementar e entregar — ../olympus-plan/BACKLOG.md\n\nResponsabilidade: Confronta v2 local com deploy, dados reais, adoção de suite-prefs, timezone, ícones, UI e toolchain desktop. Também delimita decisões fora do escopo.\n\nLimite e precedência: Pendências de 2026-08-22 são históricas; não presumir que persistem nem que sumiram no serviço sem outra observação.\n\nComo estender: Ao resolver um item, registre método e alcance; mudança de pacote compartilhado ou infraestrutura exige seu próprio escopo."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/BACKLOG.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Auditoria de backend e apresentação — ../olympus-plan/CHECKLIST-BACKEND-LAYOUT.md\n\nResponsabilidade: Relaciona defeitos de namespaces, cores, configurações, entrega e limites de verificação visual encontrados no marco da revisão.\n\nLimite e precedência: Uma verificação histórica de RLS ou segredo não certifica a conta atual; cálculo de frustum não equivale a render observado.\n\nComo estender: Use o checklist para localizar consumidores reais e repetir o método pertinente, preservando a distinção entre fonte, artefato e serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/CHECKLIST-BACKEND-LAYOUT.md",
          "symbol": "module",
          "lines": [
            101,
            101
          ]
        },
        {
          "kind": "prose",
          "md": "### Tradução de referências em decisões próprias — ../olympus-plan/DESIGN-REFERENCES.md\n\nResponsabilidade: Mapeia anatomias de composer, gráficos e navegação para o hub, conservando sua identidade e evitando dependências extras naquele escopo.\n\nLimite e precedência: Nome de referência não comprova qualidade, licença de cada arquivo futuro ou acessibilidade da implementação; não copiar bibliotecas por inferência.\n\nComo estender: Ao adotar um padrão, descreva seu papel e confira o componente concreto, sem instalar infraestrutura apenas para se parecer com a referência."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/DESIGN-REFERENCES.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Especificação do domínio financeiro — ../olympus-plan/PLUTO.md\n\nResponsabilidade: Define ledger, centavos, carteiras, categorias, transações, orçamento e metas, além de marcos e identidade do Pluto.\n\nLimite e precedência: Resumo de saldo não valida centavos inteiros em todo parser nem substitui conciliação; datas e estado live são afirmações daquele documento.\n\nComo estender: Mudanças financeiras devem passar pelo serviço proprietário e revisar projeções, importação e relatórios conforme o contrato afetado."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/PLUTO.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Separação entre design de flows e entrega — ../olympus-plan/HERMES.md\n\nResponsabilidade: Explica a decisão de usar n8n no desenho/demo e cron/Edge Function para operação, com outbox compartilhada e canais externos.\n\nLimite e precedência: Flow JSON ou cron configurado não comprova envio; status sent precisa de semântica de recibo e não garante leitura pelo destinatário.\n\nComo estender: Ao adicionar canal ou retry, revise produtor, consumer, segredo e idempotência; use destinatário e ambiente autorizados para efeito real."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/HERMES.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        },
        {
          "kind": "prose",
          "md": "### Tutor de compreensão e estudo — ../olympus-plan/CHIRON.md\n\nResponsabilidade: Registra a identidade do produto de aprendizagem, índice, bibliotecas, SRS, propostas e exigência de explicar o porquê do código.\n\nLimite e precedência: Nomes de keys e decisões iniciais podem divergir do store atual; marcar leitura ou produzir conteúdo não comprova aprendizado.\n\nComo estender: Estenda conteúdo com autoria, exemplos reais, contratos e evidência; distinga indicador, fixture e efeito de aprendizagem observado."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/CHIRON.md",
          "symbol": "module",
          "lines": [
            44,
            44
          ]
        },
        {
          "kind": "prose",
          "md": "### Retomada histórica da construção da família — ../olympus-plan/HANDOFF.md\n\nResponsabilidade: Preserva objetivo e estado de uma fase voltada a lacunas e Hermes, com resultados e próximas ações daquele momento.\n\nLimite e precedência: Não é a instrução atual da automação Chiron; copiar seus próximos passos sem precedência reiniciaria trabalho fora do escopo.\n\nComo estender: Ao retomar um assunto histórico, confronte roadmap, backlog e fonte atual antes de decidir qual trabalho realmente permanece."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/HANDOFF.md",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "Planos versionados e decisões que envelhecem",
      "order": 1,
      "blocks": [
        {
          "kind": "prose",
          "md": "Um repositório de planejamento registra decisões em tempos diferentes. Ler todos os arquivos como se descrevessem o mesmo instante produz contradições artificiais. OLYMPUS.md preserva a proposta original de um hub pequeno, centrado em links e widgets. OLYMPUS-V2.md declara que substitui esse posicionamento e exige uma aplicação onde o trabalho acontece, com painéis nativos destacáveis e índice de documentos. O arquivo antigo continua útil para a história da identidade e algumas restrições de plataforma, mas suas páginas e milestones não governam o escopo atual.\n\nO primeiro gesto de uma auditoria documental é reconhecer essa precedência. Procure notas de substituição, datas, decisões ratificadas e limites de cada arquivo. O README funciona como índice de leitura; a arquitetura descreve a receita compartilhada; o shell estabelece onde vivem os controles; o backlog confronta completude e entrega. O roadmap registra marcos históricos que podem ter sido corrigidos depois. Nenhum deles se torna verdadeiro em produção apenas porque contém uma caixa marcada. A evidência precisa indicar o objeto, o método e o momento da observação.\n\nO backlog oferece um exemplo importante. Ele distingue implementação local do plano v2, deploy, uso com dados reais e adoção das preferências pelos irmãos. Ao registrar que a aplicação ainda não havia sido entregue naquele marco, impede que uma lista de funcionalidades prontas seja lida como prova de disponibilidade pública. Esta apostila conserva esse relato como histórico datado. Não consulta contas nem executa um deploy para atualizar uma afirmação remota. O código local permite discutir os caminhos existentes; não revela sozinho o estado atual de um serviço hospedado.\n\nOs dois programas desta seção inspecionam arquivos reais e verificam marcadores específicos de substituição e limitação de entrega. Eles executam leitura de arquivos no Node, com expectativas literais. Esse método comprova que a fonte local contém aquelas advertências. Não verifica que uma versão publicada corresponde ao checkout nem demonstra que os obstáculos ainda persistem na conta real. A legenda de inspeção de fonte evita transformar uma busca textual numa execução do produto. Para mudar a conclusão operacional seria necessário observar o ambiente pertinente e registrar outra evidência.\n\nUm conflito documental deve ser resolvido pelo significado, não apenas pela data mais recente. Uma atualização de cores no shell não altera automaticamente o contrato de autenticação. Uma nota de migração da aparência pode superar o formato antigo de suite-prefs sem invalidar a separação entre origens. Organize a revisão por assunto e indique qual documento possui a decisão. Quando duas fontes falam de superfícies diferentes, mantenha ambas. Quando descrevem o mesmo comportamento incompatível, confronte o código e registre a divergência, sem apagar silenciosamente a história que explica a mudança.\n\nO HANDOFF do repositório planejador é um bom exercício dessa disciplina. Seu escopo fala de lacunas e da construção do Hermes em uma etapa anterior. Serve para entender intenções e correções daquela etapa, mas não deve ser apresentado como o próximo trabalho atual desta apostila. O ROADMAP contém episódios em que o build ultrapassou as caixas de planejamento e a conclusão precisou ser corrigida. Esses relatos ensinam por que uma revisão não pode selecionar apenas frases favoráveis. Uma limitação explícita tem o mesmo peso documental que um marco concluído.\n\nAo estender o plano, escreva o problema concreto, a decisão, os consumidores afetados e a forma de verificar o resultado. Atualize a especificação e o registro de andamento juntos quando o trabalho realmente terminar. Preserve pendências que dependem de outro ambiente e evite reclassificá-las como sucesso por inferência. Uma pessoa que retoma o projeto precisa conseguir distinguir intenção, código presente, teste local e efeito remoto. Esse encadeamento torna o planejamento uma ferramenta de engenharia, em vez de uma coleção de promessas que parecem coerentes apenas quando lidas isoladamente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/OLYMPUS.md\").includes(\"Superseded 2026-08-20\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/BACKLOG.md\").includes(\"not yet shipped\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Precedência documental é por assunto e escopo; o v2 substitui páginas e posicionamento do plano original."
        },
        {
          "kind": "quebraria",
          "md": "Usar a promessa antiga de diretório pequeno como regra atual remove justamente os painéis e documentos que motivaram a revisão."
        },
        {
          "kind": "cite",
          "file": "../olympus-plan/OLYMPUS-V2.md",
          "symbol": "O novo posicionamento",
          "lines": [
            23,
            23
          ]
        }
      ]
    },
    {
      "title": "Conta comum e sessões por origem",
      "order": 2,
      "blocks": [
        {
          "kind": "prose",
          "md": "Uma conta comum significa que os aplicativos reconhecem credenciais no mesmo projeto de autenticação. Isso não cria um cookie universal entre domínios nem permite que um aplicativo leia livremente o armazenamento do outro. A arquitetura registra essa diferença expressamente. Cada origem mantém sua sessão local, e cada cliente utiliza um namespace próprio. No Olympus, AuthProvider trabalha com a chave olympus.session.v1. O nome identifica a cópia local de apresentação da sessão, enquanto a identidade autenticada para operações remotas depende do cliente Supabase e de sua sessão efetiva.\n\nO provider inicializa a interface lendo um JSON local e formando nome, data e email. Esse passo recupera apresentação após recarregar a página, mas um cast não valida todos os campos do JSON. Em seguida, quando há cliente configurado, uma assinatura de mudança de autenticação reconcilia o estado com o usuário informado pelo serviço. Uma sessão remota presente atualiza os metadados locais. Uma notificação de ausência remove uma sessão local com email, preservando a possibilidade de uma sessão guest. A interface e o serviço são fronteiras relacionadas, sem serem o mesmo objeto.\n\nNo login por email e senha, o caminho remoto trata erro, exige retorno de usuário e atualiza o estado. Sem essa combinação, o fluxo oferece entrada local por nome. Essa escolha explica por que presença do cliente Supabase não basta para classificar alguém como usuário cloud: o projeto pode estar configurado e a pessoa ainda estar em modo guest. O comentário do código registra uma correção dessa confusão. Uma alteração que volte a usar apenas a existência do cliente acionaria operações e mensagens de conta para pessoas que não possuem uma identidade remota naquela sessão.\n\nO cadastro requer outra cautela. Retorno de um usuário não equivale necessariamente a confirmação de email e acesso remoto completo. O provider apresenta os dados recebidos; o contrato do serviço e suas políticas continuam governando o que pode ser lido ou escrito. Da mesma maneira, esconder uma rota atrás de um componente de proteção não implementa autorização do backend. A política de acesso à linha deve ser avaliada no ambiente do banco, com identidades separadas. Uma tela que parece corretamente autenticada pode estar apoiada em uma configuração remota inadequada.\n\nOs exemplos desta seção fazem inspeção nativa da fonte e da arquitetura. O primeiro recupera a constante de namespace observada; o segundo exige que a documentação distinga conta e cookies. São verificações úteis para impedir que a narrativa ensine um armazenamento compartilhado inexistente. Não chamam signIn, não enviam senha e não certificam RLS. Essa limitação não diminui a utilidade do teste: ela define exatamente qual erro documental ele detecta e impede atribuir um efeito de segurança a uma expressão que apenas leu caracteres do arquivo.\n\nAo modificar identidade, investigue quem possui cada informação. O nome exibido pode vir do cache local, de metadados remotos ou de preferências compartilhadas. Renomear um campo no provider não altera automaticamente o documento suite-prefs nem seus consumidores. Logout também exige observar a limpeza do cliente, dos estados e dos dados sensíveis pertinentes. Não conclua que o documento de domínio foi removido apenas porque o cabeçalho perdeu o nome. Sessão, preferências e acervo têm persistências e políticas próprias, que devem ser revisadas em conjunto quando o fluxo cruza contas.\n\nUma extensão segura define cenários antes da mudança: visitante sem cliente, visitante com cliente configurado, conta autenticada, sessão expirada e cadastro pendente. Para cada cenário, registre a identidade usada no acesso remoto e o conteúdo permitido na interface. A validação real demanda o serviço autorizado e observação de resultado, incluindo uma identidade sem acesso à linha de outra. A apostila fornece o mapa do código para planejar esse teste, sem executar operações externas ou apresentar sua ausência como aprovação. Essa é a diferença entre entender a fronteira e simplesmente reproduzir uma tela de login."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus/src/lib/auth.tsx\").match(/const KEY = \"([^\"]+)\"/)[1]);\nconst expected = \"olympus.session.v1\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\n\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (source(\"../olympus-plan/SUITE-ARCHITECTURE.md\").includes(\"not shared cookies\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[native-source-inspection] Inspeção do arquivo local; não executa o serviço descrito. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Conta compartilhada reúne credenciais; sessão e armazenamento continuam delimitados pela origem e pelo namespace do aplicativo."
        },
        {
          "kind": "quebraria",
          "md": "Inferir isCloud só da existência do cliente trata visitantes como contas e tenta sincronizar sem proprietário autenticado."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/auth.tsx",
          "symbol": "AuthProvider",
          "lines": [
            17,
            17
          ]
        },
        {
          "kind": "diagram",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 190\" role=\"img\" aria-label=\"Identidade e sessão\"><title>Identidade e sessão</title><desc>Conta comum não cria armazenamento comum; guest e cloud possuem caminhos distintos.</desc><rect x=\"10\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"127\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Sessão local</text><rect x=\"270\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"387\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Cliente auth</text><rect x=\"530\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"647\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Conta remota</text><rect x=\"790\" y=\"25\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"907\" y=\"65\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">UI por origem</text><path d=\"M245 60H270m-10-6 10 6-10 6M505 60H530m-10-6 10 6-10 6M765 60H790m-10-6 10 6-10 6\" fill=\"none\" stroke=\"currentColor\"/></svg>",
          "caption": "Identidade e sessão: Conta comum não cria armazenamento comum; guest e cloud possuem caminhos distintos. Fonte: ../olympus/src/lib/auth.tsx"
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/auth.tsx",
          "symbol": "module",
          "lines": [
            1,
            1
          ]
        }
      ]
    },
    {
      "title": "Guest, identidade e restauração segura",
      "order": 3,
      "blocks": [
        {
          "kind": "prose",
          "md": "O modo guest precisa produzir um aplicativo utilizável sem configuração remota. Isso exige defaults explícitos e uma política para dados locais antigos ou inválidos. Em Olympus, emptyPrefs cria um documento de preferências na versão dois, com aparência, painéis, notificações, fala, extensões e avatar. O usuário pode escolher tema e outras opções mesmo sem uma conta. O provider de preferências lê um espelho local e chama migrate; quando a leitura ou o parse falha, retorna um documento inicial. Essa recuperação mantém o aplicativo acessível, mas não deve ser confundida com recuperação integral de todo o acervo.\n\nA função migrate recebe unknown porque a fronteira real é um JSON armazenado, não uma instância que o compilador acabou de construir. Primeiro cria a base e rejeita a ausência ou um valor que não seja objeto. Para objetos, combina defaults e campos conhecidos. O resultado recebe a versão de preferências vigente, preserva informações reconhecidas e escolhe uma página inicial válida entre home e chat. A estratégia é tolerante e favorece continuidade de uso. Ela não implementa validação profunda de cada enum, string ou objeto aninhado que a entrada pode conter.\n\nA compatibilidade de tema mostra por que uma migração é mais que preencher campos. Documentos antigos conheciam theme como light ou dark; o formato novo inclui appearance.mode com a opção system. Quando appearance está ausente e o tema antigo é válido, esse valor inicializa o modo novo. O campo plano continua existindo para irmãos que ainda dependem dele. Uma migração que simplesmente aplicasse system por cima de tudo faria a pessoa perder uma preferência explícita. Já remover o campo antigo imediatamente quebraria leitores que ainda não adotaram o formato estruturado.\n\nOs programas chamam as funções reais do módulo, sem copiar sua implementação. Uma entrada nula produz modo system; defaultAvatar produz kind monogram. São oráculos literais sobre objetos novos, executados no Node com remoção nativa de tipos. Não há um localStorage falso nem um servidor simulado. Esses casos estabelecem dois pontos iniciais concretos, sem comprovar renderização de avatar, gravação em disco ou restauração após queda. Para demonstrar esses efeitos seria necessário exercitar o consumidor e observar o ambiente correspondente, com um documento preservado para comparação.\n\nA presença de defaults deve orientar a interface. Notificações começam desativadas, evitando anunciar que um recurso dependente de permissão está disponível antes de a pessoa escolhê-lo. O avatar monograma requer apenas um nome, ao contrário de uma imagem que demanda preparação e tamanho apropriado. Painéis possuem arrays vazios de ordem e ocultação, de modo que o catálogo possa fornecer uma sequência padrão. A página inicial home conduz ao resumo. Essas decisões revelam a intenção de um primeiro uso coerente; não são garantias automáticas de que cada consumidor usa corretamente cada valor.\n\nA restauração requer distinguir dados ausentes de dados reconhecidos e dados corrompidos. Voltar à base pode ser uma resposta razoável para preferências ilegíveis, mas aplicar a mesma política indiscriminadamente a transações ou cronogramas descartaria informação importante. Antes de estender o migrador, observe o formato persistido e mantenha uma cópia de entrada. Acrescente casos de documento antigo, documento atual e valor hostil ou incompleto. O teste deve demonstrar quais campos sobrevivem, quais recebem default e quais são deliberadamente descartados; um único exemplo feliz não descreve essa política.\n\nO fato de a função devolver SuitePrefs não transforma cada campo recebido em verdade validada. O tipo do retorno serve aos consumidores compilados, enquanto o caminho de migração contém spreads e coerções. Uma revisão deve procurar valores inesperados que possam atravessar essa fronteira e perguntar como o renderer reage. Melhorar essa validação seria uma mudança de produto, com política de compatibilidade própria; não é feita silenciosamente durante a autoria. Compreender esse limite permite usar o modo guest com honestidade e planejar recuperação sem atribuir ao migrador garantias que seu código não fornece."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.migrate(null).appearance.mode);\nconst expected = \"system\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 1. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "code",
          "lang": "javascript",
          "code": "import {readFileSync} from \"node:fs\";\nimport {resolve} from \"node:path\";\nimport {pathToFileURL} from \"node:url\";\nimport {deepStrictEqual} from \"node:assert\";\nawait import(pathToFileURL(resolve(\"scripts/olympus-native-loader.mjs\")).href);\nconst prefs = await import(pathToFileURL(resolve(\"../olympus/src/lib/prefs/types.ts\")).href);\nconst source = file => readFileSync(resolve(file), \"utf8\");\nconst actual = (prefs.defaultAvatar().kind);\nconst expected = \"monogram\";\ndeepStrictEqual(actual, expected);\nconsole.log(JSON.stringify({actual}));",
          "caption": "[repository-native] Módulo real no Node 24; fixture sintética, sem efeito remoto. Caso 2. Execute a partir da raiz do workspace com o loader local existente."
        },
        {
          "kind": "porque",
          "md": "Defaults tornam guest independente da nuvem; migrate conserva compatibilidade sem prometer validação profunda de todo JSON."
        },
        {
          "kind": "quebraria",
          "md": "Aplicar a mesma recuperação destrutiva de preferências a dados financeiros ou cronogramas pode apagar informação legítima."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "migrate",
          "lines": [
            113,
            113
          ]
        },
        {
          "kind": "prose",
          "md": "### migrate — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function migrate(raw: unknown): SuitePrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Defaults tornam guest independente da nuvem; migrate conserva compatibilidade sem prometer validação profunda de todo JSON. Contraprova ou limite a preservar: Aplicar a mesma recuperação destrutiva de preferências a dados financeiros ou cronogramas pode apagar informação legítima.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "migrate",
          "lines": [
            113,
            113
          ]
        },
        {
          "kind": "prose",
          "md": "### defaultAvatar — ../olympus/src/lib/prefs/types.ts\n\nAssinatura observada: `export function defaultAvatar(): AvatarPrefs`. O programa desta seção chama esta implementação, com o escopo delimitado acima. Responsabilidade e consumidor nesta leitura: Defaults tornam guest independente da nuvem; migrate conserva compatibilidade sem prometer validação profunda de todo JSON. Contraprova ou limite a preservar: Aplicar a mesma recuperação destrutiva de preferências a dados financeiros ou cronogramas pode apagar informação legítima.\n\nComo estender este ponto: altere o contrato no proprietário, confira os chamadores citados nesta seção e reexecute a fixture literal antes de ampliar a afirmação para UI ou serviço."
        },
        {
          "kind": "cite",
          "file": "../olympus/src/lib/prefs/types.ts",
          "symbol": "defaultAvatar",
          "lines": [
            77,
            77
          ]
        }
      ]
    }
  ]
};
