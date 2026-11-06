// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 2.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Configuração em camadas: de onde vêm os valores e quem vence";

export const OPENCODE_BOOK_02: ContentChapter = {
  title: NODE,
  level: "basico",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "As camadas da configuração e a ordem em que se sobrepõem",
      order: 0,
      blocks: [
        prose([
          "O OpenCode não lê a configuração de um lugar só. Ele junta várias fontes, uma por camada, e a camada que vem depois sobrepõe as anteriores. A razão é prática: o que vale para você em qualquer projeto (o modelo preferido, a política padrão de permissões) não deve ter de ser repetido em cada repositório, e o que vale para um projeto (um agente de revisão, um servidor MCP da equipe) não deve vazar para os outros. Cada camada resolve um desses papéis, e saber a ordem é a diferença entre editar o arquivo certo e ficar perguntando por que a mudança não surtiu efeito.",
          "",
          "A ordem, da mais fraca para a mais forte, é esta. Primeiro vem o **arquivo global** do usuário, `opencode.json` na pasta de configuração que `opencode debug paths` mostrou no capítulo anterior. Depois, o arquivo apontado pela variável **`OPENCODE_CONFIG`**, quando ela existe, que serve a quem quer manter uma configuração em outro lugar ou trocá-la por execução. Em seguida, os arquivos **`opencode.json`** ou **`opencode.jsonc`** do projeto, procurados a partir da pasta atual e subindo pelas pastas. Depois vem o conteúdo de uma pasta **`.opencode/`** do projeto, que aceita o mesmo arquivo e é o lugar de agentes, comandos e habilidades próprios do projeto, assunto dos capítulos 4, 6 e 7. Por último, a variável **`OPENCODE_CONFIG_CONTENT`**, que recebe a configuração inteira como texto JSON e vence todas as outras, o que a torna a ferramenta certa para ajustes de uma única execução.",
          "",
          "O exemplo monta as cinco camadas com valores diferentes para o campo `model`, que é o modelo padrão. Cada comando `opencode debug config` mostra a configuração resolvida, e o valor de `model` na saída diz qual camada venceu. Para tornar visível a mistura, as camadas também definem o campo `small_model`, o modelo menor que o OpenCode usa para tarefas auxiliares, como dar título às sessões: o global e o arquivo extra o definem, e os outros não, de modo que o valor final desse campo acompanha a última camada que o mencionou. Os nomes de modelo são escolhidos só para serem fáceis de reconhecer na saída; o OpenCode não os confere até o momento de usá-los.",
        ]),
        code("json", [
          "{",
          "  \"model\": \"openai/gpt-5-mini\",",
          "  \"small_model\": \"openai/gpt-5-nano\",",
          "  \"share\": \"disabled\"",
          "}",
        ], "Global opencode.json: a camada mais fraca, do usuário"),
        code("bash", [
          "$ opencode debug config --pure",
        ], "Terminal: só a camada global"),
        code("text", [
          "\"model\": \"openai/gpt-5-mini\",",
          "\"small_model\": \"openai/gpt-5-nano\",",
          "\"share\": \"disabled\",",
        ], "Saída: o modelo do usuário"),
        code("json", [
          "{",
          "  \"model\": \"openai/gpt-5\",",
          "  \"small_model\": \"openai/gpt-5-mini\"",
          "}",
        ], "extra.json: uma configuração apontada por variável de ambiente"),
        code("bash", [
          "$ OPENCODE_CONFIG=extra.json opencode debug config",
        ], "Terminal: OPENCODE_CONFIG vence a camada global"),
        code("text", [
          "\"model\": \"openai/gpt-5\",",
          "\"small_model\": \"openai/gpt-5-mini\",",
          "\"share\": \"disabled\",",
        ], "Saída: o arquivo extra sobrepõe os campos que menciona e preserva os outros"),
        prose([
          "A saída da segunda execução ensina o ponto mais importante da seção: a sobreposição acontece **campo a campo**, não arquivo a arquivo. O arquivo extra define `model` e `small_model`, e por isso esses dois valores mudam. Ele não menciona `share`, e por isso o valor `disabled` da camada global continua valendo. Nenhuma camada apaga o que a de baixo definiu; ela apenas reescreve os campos que cita. Quem espera que um arquivo de projeto \"substitua a configuração global\" se engana, e o engano custa caro quando o campo esquecido é uma permissão: o projeto herda tudo o que não mencionou.",
          "",
          "Quando o arquivo do projeto aparece, ele vence o arquivo extra. A terceira execução mostra isso e, ao mesmo tempo, mostra a mistura: o `model` vem do projeto, mas o `small_model` ainda é o do arquivo extra, porque o projeto não o define. O caminho em `OPENCODE_CONFIG` também aceita a forma com `./`, relativa à pasta onde o comando roda, e a execução usa essa forma de propósito para mostrar que as duas valem.",
        ]),
        code("json", [
          "{",
          "  \"model\": \"anthropic/claude-sonnet-5-5\"",
          "}",
        ], "opencode.json: o arquivo do projeto, na raiz"),
        code("bash", [
          "$ OPENCODE_CONFIG=./extra.json opencode debug config",
        ], "Terminal: o projeto vence OPENCODE_CONFIG, e a mistura continua"),
        code("text", [
          "\"model\": \"anthropic/claude-sonnet-5-5\",",
          "\"small_model\": \"openai/gpt-5-mini\",",
          "\"share\": \"disabled\",",
        ], "Saída: o modelo é do projeto, o modelo pequeno é do arquivo extra"),
        code("json", [
          "{",
          "  \"model\": \"anthropic/claude-haiku-5-5\"",
          "}",
        ], ".opencode/opencode.json: a configuração da pasta .opencode"),
        code("bash", [
          "$ opencode debug config",
        ], "Terminal: a pasta .opencode vence o arquivo da raiz"),
        code("text", [
          "\"model\": \"anthropic/claude-haiku-5-5\",",
          "\"small_model\": \"openai/gpt-5-nano\",",
          "\"share\": \"disabled\",",
        ], "Saída: sem OPENCODE_CONFIG, o modelo pequeno volta a ser o do usuário"),
        code("bash", [
          "$ OPENCODE_CONFIG_CONTENT={\"model\":\"openai/gpt-5-nano\"} opencode debug config",
        ], "Terminal: a configuração inline vence todas as outras"),
        code("text", [
          "\"model\": \"openai/gpt-5-nano\",",
          "\"small_model\": \"openai/gpt-5-nano\",",
          "\"share\": \"disabled\",",
        ], "Saída: o valor de uma única execução"),
        prose([
          "As duas últimas execuções fecham a escada. Com o arquivo em `.opencode/opencode.json`, o modelo passa a ser o dele, acima do arquivo da raiz do projeto, e como a variável `OPENCODE_CONFIG` já não foi usada, o modelo pequeno volta ao valor do usuário. Por fim, a configuração inline, dada a um único comando, ganha de tudo. O uso típico dela está em automações: um script de integração contínua que precisa trocar o modelo para uma execução não deveria editar nenhum arquivo, e escrever a configuração na própria linha de comando mantém o repositório limpo. A desvantagem é que o valor não fica registrado em lugar algum: se alguém perguntar depois por que aquele resultado saiu diferente, só o histórico do script responde.",
        ]),
        porque([
          "A configuração é a soma de camadas: arquivo global, `OPENCODE_CONFIG`, arquivo do projeto, pasta `.opencode` e `OPENCODE_CONFIG_CONTENT`, da mais fraca para a mais forte. A sobreposição é campo a campo, e `opencode debug config` mostra o resultado final.",
        ]),
        quebraria([
          "Uma pessoa edita o `opencode.json` da raiz para trocar o modelo do projeto e não vê mudança alguma. Há um `opencode.json` dentro de `.opencode/` com outro modelo, que é uma camada acima, e a edição fica sem efeito até alguém rodar `opencode debug config` e perceber de onde o valor vem.",
        ]),
      ],
    },
    {
      title: "Objetos se fundem, listas se somam ou se substituem",
      order: 1,
      blocks: [
        prose([
          "A sobreposição campo a campo da seção anterior vale para valores simples. Quando o campo é um objeto ou uma lista, a regra tem nuances, e são essas nuances que decidem se uma permissão do projeto soma-se à do usuário ou a apaga. Há três comportamentos a conhecer, e o exemplo desta seção, com um arquivo global e um arquivo de projeto que têm os mesmos campos, mostra os três de uma só vez.",
          "",
          "O primeiro é a **fusão de objetos**. Quando os dois lados têm um objeto no mesmo campo, o resultado contém as chaves dos dois, e as chaves repetidas ficam com o valor da camada mais forte. É o caso de `permission`: o global define `edit` como `deny` e um objeto `bash` com duas regras, o projeto define `edit` como `allow` e acrescenta uma regra ao objeto `bash`. O resultado tem `edit` igual a `allow` (a camada do projeto venceu o valor simples) e um objeto `bash` com as três regras, as do global primeiro e a do projeto depois. A ordem importa mais do que parece, porque nas regras de permissão a última regra que casa com o comando é a que vale, e o capítulo 5 mostra que o projeto, por vir depois, tem a última palavra.",
          "",
          "O segundo comportamento é a **soma de listas** em campos pensados para acumular. `instructions`, a lista de arquivos de instruções que o agente deve carregar, é o caso: as listas das camadas são concatenadas, e uma entrada que aparece nas duas, como `COMUM.md` no exemplo, entra uma vez só. O resultado é a lista do global seguida do que o projeto acrescentou. É por isso que um arquivo de regras da empresa, definido no global, continua valendo em todos os projetos, e cada projeto ainda pode incluir os seus.",
          "",
          "O terceiro comportamento é o que mais surpreende: em outros campos de lista, a camada mais forte **substitui** a lista inteira. `disabled_providers`, que desliga provedores, mostra isso. O global desliga `anthropic` e o projeto desliga `openai`, e o resultado contém apenas `openai`: o `anthropic` que o global desligou voltou a ficar disponível, sem que ninguém tenha dito isso. Não há uma regra geral que dispense conferir: para cada campo de lista que importa, o caminho seguro é rodar `opencode debug config` e ler o resultado, em vez de presumir que \"listas se somam\".",
        ]),
        code("json", [
          "{",
          "  \"model\": \"openai/gpt-5\",",
          "  \"permission\": {",
          "    \"edit\": \"deny\",",
          "    \"bash\": { \"git push*\": \"deny\", \"*\": \"ask\" }",
          "  },",
          "  \"instructions\": [\"COMUM.md\", \"GLOBAL.md\"],",
          "  \"disabled_providers\": [\"anthropic\"]",
          "}",
        ], "Global opencode.json: a política pessoal"),
        code("json", [
          "{",
          "  \"permission\": {",
          "    \"edit\": \"allow\",",
          "    \"bash\": { \"npm test\": \"allow\" }",
          "  },",
          "  \"instructions\": [\"COMUM.md\", \"PROJETO.md\"],",
          "  \"disabled_providers\": [\"openai\"]",
          "}",
        ], "opencode.json: o projeto repete campos da camada global"),
        code("bash", [
          "$ cd packages/api",
          "$ opencode debug config",
        ], "Terminal: a configuração resolvida, de dentro de uma subpasta"),
        code("text", [
          "\"model\": \"openai/gpt-5\",",
          "\"edit\": \"allow\",",
          "\"git push*\": \"deny\",",
          "\"*\": \"ask\",",
          "\"npm test\": \"allow\"",
          "\"COMUM.md\",",
          "\"GLOBAL.md\",",
          "\"PROJETO.md\"",
          "\"openai\"",
        ], "Saída: objetos fundidos, instruções somadas, provedores substituídos"),
        prose([
          "Lendo a saída com a regra dos três comportamentos, tudo se encaixa. `model` veio do global, que o projeto não mencionou. `edit` mudou de `deny` para `allow`, por ser um valor simples que o projeto redefiniu. As três regras de `bash` aparecem juntas, e `npm test` ficou por último. As instruções foram somadas, sem repetir `COMUM.md`. Os provedores desligados foram substituídos, e o único que sobrou é o do projeto.",
          "",
          "Há uma consequência de segurança em tudo isso. Uma política de permissões escrita no arquivo global é um piso apenas para quem não a reescreve: nada impede que um projeto, ao repetir `edit`, a afrouxe, como o exemplo fez ao trocar `deny` por `allow`. Isso é intencional, porque o projeto sabe de seus riscos, mas significa que clonar um repositório alheio e abrir o OpenCode nele aplica a configuração do repositório sobre a sua. A conferência antes da primeira sessão em um projeto desconhecido é pedir `opencode debug config` e ler a seção `permission`, o que leva segundos e revela se o projeto liberou o que você tinha proibido. O capítulo 11 volta a esse cuidado, com o roteiro do que olhar antes de confiar em um repositório que não é seu, e o capítulo 5 detalha as regras de permissão.",
        ]),
        porque([
          "Objetos se fundem chave a chave, `instructions` soma as listas sem repetir entradas, e outros campos de lista, como `disabled_providers`, são substituídos pela camada mais forte. Para cada lista que importa, confira o resultado com `opencode debug config`.",
        ]),
        quebraria([
          "Um usuário desliga um provedor no arquivo global por política da empresa. Um projeto, ao desligar outro provedor na própria lista, substitui a lista inteira, e o provedor proibido volta a funcionar sem aviso. A diferença só aparece para quem lê a configuração resolvida.",
        ]),
      ],
    },
    {
      title: "Escrever o arquivo: JSON com comentários, jsonc e o erro de configuração inválida",
      order: 2,
      blocks: [
        prose([
          "O arquivo de configuração é JSON, com duas tolerâncias que a especificação do formato não tem: aceita **comentários** de linha, iniciados por `//`, e aceita **vírgula depois do último item** de um objeto ou lista. Isso vale mesmo para arquivos de nome `opencode.json`, e a extensão `.jsonc` serve apenas para avisar a ferramentas de edição que o arquivo não é JSON puro, de modo que o editor não sublinhe os comentários como erro. Na prática, o comentário é a melhor documentação que uma configuração de equipe pode ter: explica por que uma regra de permissão existe, quem pediu e quando pode ser removida, e ao lado da regra, onde ninguém precisa procurar.",
          "",
          "Se os dois arquivos existirem na mesma pasta, o `opencode.jsonc` vence o `opencode.json`. O comportamento é consistente com a ideia de camadas, mas é fácil de esquecer: uma pessoa que migrou para `.jsonc` e deixou o arquivo antigo por perto pode editar o errado durante meses. O exemplo escreve os dois com modelos diferentes e mostra qual prevalece. Para quem prefere um único formato, a escolha mais simples é manter somente um dos dois em cada pasta.",
        ]),
        code("json", [
          "{",
          "  // modelo para o time inteiro, definido em dezembro",
          "  \"model\": \"openai/gpt-5\",",
          "}",
        ], "opencode.json: comentário e vírgula final em um arquivo .json"),
        code("jsonc", [
          "{",
          "  // este arquivo vence o .json que está na mesma pasta",
          "  \"model\": \"anthropic/claude-sonnet-5-5\"",
          "}",
        ], "opencode.jsonc: o arquivo de mesmo papel e extensão diferente"),
        code("bash", [
          "$ cd src",
          "$ opencode debug config",
        ], "Terminal: dois arquivos na pasta de cima"),
        code("text", [
          "\"model\": \"anthropic/claude-sonnet-5-5\",",
        ], "Saída: o .jsonc prevaleceu"),
        prose([
          "A tolerância de formato não se estende ao conteúdo. O OpenCode valida a configuração contra um esquema e se recusa a carregá-la quando algo não bate. O comportamento é rigoroso de propósito: um campo com o nome errado, que seria ignorado em silêncio por muitas ferramentas, fica sem efeito de forma invisível, e a pessoa acredita estar protegida por uma regra que nunca existiu. Com a validação, o erro aparece na primeira execução. A mensagem diz o arquivo e o problema: o primeiro exemplo troca `model` por `modelo`, e a mensagem aponta a chave que não existe.",
          "",
          "O mesmo vale para valores. Uma permissão aceita um conjunto fechado de ações (`allow`, `ask` e `deny`), e qualquer outra palavra é recusada com uma mensagem que cita o caminho do campo, `permission.bash`. Os dois exemplos terminam com falha de propósito, e a falha é parte do que se quer mostrar. Eles usam comandos diferentes, `debug agent` e `models`, para deixar claro que a recusa não é exclusiva de `debug config`: qualquer comando que carregue a configuração a rejeita, e só os que não a consultam, como `debug paths` e `db path`, continuam funcionando. Nos dois casos o comando devolve um código de saída diferente de zero, o que permite a um script de integração contínua usar `opencode debug config` como verificação do arquivo antes de qualquer execução cara. Uma ressalva importa: a mensagem mostra o primeiro problema encontrado, de modo que um arquivo com vários erros leva vários ciclos de correção.",
        ]),
        code("json", [
          "{",
          "  \"modelo\": \"openai/gpt-5\"",
          "}",
        ], "opencode.json: uma chave com o nome errado"),
        code("bash", [
          "$ opencode debug agent build",
        ], "Terminal (falha de propósito): chave desconhecida"),
        code("text", [
          "Error: Configuration is invalid at <projeto>\\opencode.json",
          "Unrecognized key: modelo",
        ], "Saída: a mensagem aponta o arquivo e a chave"),
        code("json", [
          "{",
          "  \"permission\": { \"bash\": \"talvez\" }",
          "}",
        ], "opencode.json: uma ação de permissão que não existe"),
        code("bash", [
          "$ opencode models",
        ], "Terminal (falha de propósito): valor fora do conjunto aceito"),
        code("text", [
          "Error: Configuration is invalid at <projeto>\\opencode.json",
          "Expected PermissionActionConfig, got \"talvez\" permission.bash",
        ], "Saída: a mensagem cita o caminho do campo"),
        prose([
          "Duas dicas encerram a seção. A primeira é incluir `\"$schema\": \"https://opencode.ai/config.json\"` no topo do arquivo: editores que entendem JSON Schema passam a oferecer autocompletar e a sublinhar a chave errada enquanto você digita, antes de o OpenCode ser chamado. O próprio programa acrescenta essa linha à configuração resolvida, como se vê em toda saída de `debug config`, mas o que fica no arquivo é o que alimenta o editor. A segunda é tratar a validação como parte do fluxo de trabalho: depois de qualquer edição na configuração, `opencode debug config` é o teste mais barato que existe, porque não precisa de chave de provedor, não gasta tokens e responde em segundos.",
          "",
          "Numa equipe, o par natural da validação é a revisão. Como o arquivo de configuração decide o que o agente pode fazer no repositório, uma mudança nele merece o mesmo olhar que uma mudança em um script de implantação: quem revisa lê o comentário que explica a regra nova, confere que a ação é uma das três aceitas e rejeita a alteração que afrouxa uma permissão sem justificativa. Um passo de integração contínua que rode `opencode debug config` e falhe com o código de saída do comando impede que um arquivo quebrado chegue à branch principal, e custa uma linha no fluxo de trabalho.",
        ]),
        porque([
          "O arquivo aceita comentários e vírgula final mesmo com extensão `.json`; o `.jsonc` vence o `.json` da mesma pasta; e o OpenCode recusa configuração inválida com uma mensagem que cita arquivo e campo, o que torna `opencode debug config` um teste barato após cada edição.",
        ]),
        quebraria([
          "Um colega escreve `\"permision\"` em vez de `\"permission\"` e acredita ter proibido os comandos de rede. Sem validação, a regra seria ignorada em silêncio. Com ela, o primeiro `opencode debug config` aponta a chave desconhecida, e a proteção só falta se ninguém rodar o comando.",
        ]),
      ],
    },
    {
      title: "Valores de fora do arquivo: variáveis de ambiente, arquivos e segredos",
      order: 3,
      blocks: [
        prose([
          "Nem tudo cabe num arquivo que vai para o repositório. Chaves de API, tokens e endereços de servidores internos mudam de pessoa para pessoa e não podem ser commitados. Para isso, o texto da configuração aceita duas substituições, feitas antes de o JSON ser interpretado: **`{env:NOME}`** é trocado pelo valor da variável de ambiente `NOME`, e **`{file:caminho}`** é trocado pelo conteúdo do arquivo indicado. As duas servem em qualquer valor de texto do arquivo, e a combinação típica é manter o arquivo de configuração limpo, versionado, e deixar o segredo em uma variável ou em um arquivo fora do controle de versão.",
          "",
          "O exemplo usa as duas. O modelo vem da variável `MODELO`, que o comando define só para a sua execução, e a chave do provedor OpenAI vem de um arquivo `segredo.txt`. O caminho relativo de `{file:...}` é resolvido a partir da pasta do arquivo de configuração, não da pasta onde o comando roda: um projeto com a configuração na raiz e arquivos de segredo em uma pasta própria funciona a partir de qualquer subpasta. O conteúdo do arquivo entra sem a quebra de linha final, que os editores costumam acrescentar e que, num cabeçalho de autenticação, seria um erro difícil de achar.",
        ]),
        code("text", [
          "chave-de-teste",
        ], "segredo/openai.txt: o segredo, fora do controle de versão"),
        code("json", [
          "{",
          "  \"model\": \"{env:MODELO}\",",
          "  \"provider\": {",
          "    \"openai\": { \"options\": { \"apiKey\": \"{file:segredo/openai.txt}\" } }",
          "  }",
          "}",
        ], "opencode.json: modelo vindo do ambiente e chave vinda de um arquivo"),
        code("bash", [
          "$ cd src",
          "$ MODELO=openai/gpt-5 opencode debug config",
        ], "Terminal: o comando roda de uma subpasta"),
        code("text", [
          "\"model\": \"openai/gpt-5\",",
          "\"apiKey\": \"chave-de-teste\"",
        ], "Saída: as duas substituições aconteceram"),
        prose([
          "A saída revela um cuidado necessário. Para mostrar a configuração resolvida, o `debug config` imprime o valor **já substituído**, e o valor da chave, que no arquivo era uma referência inofensiva, aparece em texto puro. Quem cola a saída de `debug config` num relato de problema, num fórum ou num chat com uma pessoa de suporte entrega a chave junto. O hábito saudável é, antes de compartilhar qualquer saída de diagnóstico, procurar nela as palavras `key`, `token` e `secret`, e trocar os valores por marcadores. Se a chave vazar, a providência é revogá-la no provedor e emitir outra, não apagar a mensagem.",
          "",
          "As duas substituições têm comportamentos diferentes diante de um valor ausente, e a diferença é uma armadilha. Uma variável **inexistente** vira texto vazio, sem erro nem aviso: `{env:NAO_EXISTE}` dentro de um campo resulta na cadeia vazia, e o campo `model` acaba em branco. Um arquivo **inexistente**, ao contrário, interrompe o carregamento com uma mensagem que cita a referência e o caminho completo que procurou. O erro do arquivo é o comportamento seguro. O silêncio da variável é um convite a erros: o nome da variável digitado errado, ou esquecido no ambiente de uma máquina de integração contínua, produz uma configuração aparentemente válida e funcionalmente quebrada.",
          "",
          "Escolher entre as duas formas é uma questão de onde o segredo vive. A **variável de ambiente** combina com valores que mudam por execução e com cofres de segredos de sistemas de integração contínua, que injetam variáveis no processo e nunca gravam nada em disco. O **arquivo** combina com máquinas de desenvolvimento, onde um arquivo pessoal em uma pasta ignorada pelo Git é mais confortável do que exportar variáveis em cada terminal novo. Nas duas formas, o arquivo `opencode.json` que vai para o repositório contém apenas referências, e uma revisão de código tem como regra simples nunca aceitar uma chave literal nesse arquivo. Vale conferir o `.gitignore` com `git check-ignore -v segredo/openai.txt` antes do primeiro commit: se o comando não imprimir nada, a pasta não está ignorada.",
          "",
          "Resta a tentação de salvar a saída de `debug config` como se fosse um arquivo de configuração pronto, porque ela traz todos os valores resolvidos e parece uma maneira rápida de \"congelar\" um ambiente. É um atalho perigoso: o resultado tem as chaves em texto puro, e um arquivo assim, commitado por descuido, torna a chave pública para sempre no histórico. A cópia que importa é a do arquivo original, com as referências; a saída resolvida serve para ler, não para guardar.",
        ]),
        code("json", [
          "{",
          "  \"model\": \"{env:MODELO_DA_EQUIPE}\"",
          "}",
        ], "opencode.json: uma variável que não foi definida"),
        code("bash", [
          "$ opencode debug config --log-level ERROR",
        ], "Terminal: a variável ausente não causa erro"),
        code("text", [
          "\"model\": \"\",",
        ], "Saída: o campo ficou vazio"),
        code("json", [
          "{",
          "  \"model\": \"{file:modelo-da-equipe.txt}\"",
          "}",
        ], "opencode.json: um arquivo que não existe"),
        code("bash", [
          "$ opencode debug agent plan",
        ], "Terminal (falha de propósito): o arquivo ausente interrompe o carregamento"),
        code("text", [
          "Error: Configuration is invalid at <projeto>\\opencode.json: bad file reference: \"{file:modelo-da-equipe.txt}\" <projeto>\\modelo-da-equipe.txt does not exist",
        ], "Saída: a mensagem cita a referência e o caminho"),
        porque([
          "`{env:NOME}` e `{file:caminho}` mantêm segredos fora do arquivo versionado. O arquivo é resolvido a partir da pasta da configuração; variável ausente vira texto vazio em silêncio, arquivo ausente é erro, e `debug config` imprime o segredo já substituído.",
        ]),
        quebraria([
          "Numa máquina de integração contínua, a variável com o nome do modelo não foi exportada. A configuração carrega sem erro, o campo `model` fica vazio, e a falha só aparece quando o agente tenta rodar e não encontra modelo, longe da linha que causou o problema.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_02_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "beginner",
    promptMd: "Um projeto tem `opencode.json` na raiz com `\"model\": \"openai/gpt-5\"` e também `.opencode/opencode.json` com `\"model\": \"anthropic/claude-sonnet-5-5\"`. Sem nenhuma variável de ambiente definida, qual modelo o OpenCode usa nesse projeto?",
    choices: [
      "anthropic/claude-sonnet-5-5, porque a pasta .opencode é uma camada acima do arquivo da raiz",
      "openai/gpt-5, porque o arquivo da raiz do projeto sempre vence",
      "Nenhum dos dois, porque dois arquivos no mesmo projeto causam erro",
      "O que estiver no arquivo global do usuário, porque ele vence os do projeto",
    ],
    answerKeyMd: "anthropic/claude-sonnet-5-5, porque a pasta .opencode é uma camada acima do arquivo da raiz",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "beginner",
    promptMd: "O arquivo global desliga o provedor `anthropic` com `\"disabled_providers\": [\"anthropic\"]`. O `opencode.json` de um projeto traz `\"disabled_providers\": [\"openai\"]`. Explique o que `opencode debug config` mostra para esse campo e por que isso pode ser um problema de política.",
    answerKeyMd: "Mostra apenas `[\"openai\"]`: em `disabled_providers` a camada mais forte substitui a lista inteira, em vez de somar com a do global. O `anthropic`, que o usuário desligou, volta a ficar disponível sem aviso, o que quebra uma política pessoal ou da empresa que dependia do arquivo global. Para um campo de lista que importa, a verificação é ler a configuração resolvida, e o projeto que quer somar deve repetir os itens do global.",
    rubricMd: "Afirma que a lista foi substituída e não somada; identifica que o provedor desligado no global volta a funcionar; propõe conferir com debug config ou repetir os itens.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "intermediate",
    promptMd: "Uma equipe quer versionar o `opencode.json` do repositório, usar uma chave de API diferente por pessoa e descobrir cedo quando uma máquina de integração contínua estiver sem a chave ou sem o nome do modelo. Descreva como montar o arquivo, onde ficam os segredos e que verificação rodar em cada máquina, citando a diferença entre variável ausente e arquivo ausente.",
    answerKeyMd: "O arquivo versionado guarda só referências: `\"model\": \"{env:MODELO}\"` e `\"apiKey\": \"{file:segredo/openai.txt}\"`, com a pasta `segredo/` no .gitignore e cada pessoa criando o próprio arquivo. A diferença importa: um arquivo ausente interrompe o carregamento com `bad file reference` e o caminho procurado, enquanto uma variável ausente vira texto vazio sem erro. Por isso, o nome do modelo, que vem de variável, precisa de uma checagem própria: rodar `opencode debug config` na máquina de integração e falhar o passo se o campo `model` estiver vazio (por exemplo, procurando `\"model\": \"\"` na saída). Também se deve evitar guardar a saída desse comando em logs, porque ela imprime o segredo substituído.",
    points: 20,
  },
];

export const OPENCODE_BOOK_02_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "Qual é a ordem das camadas de configuração, da mais fraca à mais forte?", backMd: "Arquivo global, `OPENCODE_CONFIG`, arquivo do projeto, pasta `.opencode` e `OPENCODE_CONFIG_CONTENT`. A sobreposição é campo a campo." },
  { nodeTitle: NODE, frontMd: "Como o OpenCode trata listas de camadas diferentes?", backMd: "`instructions` soma sem repetir entradas; `disabled_providers`, por exemplo, é substituída pela camada mais forte. Objetos como `permission` se fundem chave a chave." },
  { nodeTitle: NODE, frontMd: "Qual comando mostra a configuração final e valida o arquivo?", backMd: "`opencode debug config`. Em arquivo inválido, termina com erro que cita o arquivo e o campo; não gasta tokens nem exige chave de provedor." },
  { nodeTitle: NODE, frontMd: "O que acontece com `{env:X}` e `{file:x}` quando o valor não existe?", backMd: "Variável ausente vira texto vazio, sem erro. Arquivo ausente interrompe com `bad file reference` e o caminho procurado." },
  { nodeTitle: NODE, frontMd: "Por que não colar a saída de `debug config` num relato de problema?", backMd: "Ela imprime os valores já substituídos, inclusive chaves vindas de `{env:}` e `{file:}`. Revise e troque por marcadores, ou revogue a chave se vazar." },
];
