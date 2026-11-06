// OpenCode, reescrita autoral (PLANO.md §R.2) — capítulo 7.
import { code, porque, prose, quebraria, type ContentCard, type ContentChapter, type ContentExercise } from "./types";

const NODE = "Habilidades: conhecimento que o agente carrega sob demanda";

export const OPENCODE_BOOK_07: ContentChapter = {
  title: NODE,
  level: "intermediario",
  nodeTitle: NODE,
  nodeKind: "concept",
  sections: [
    {
      title: "O que é uma habilidade e como o OpenCode a encontra",
      order: 0,
      blocks: [
        prose([
          "As instruções do capítulo 3 têm um defeito de arquitetura que só aparece quando crescem: entram inteiras em todos os pedidos. Um guia de como montar o relatório semanal, um roteiro de migração de banco, um manual de como o projeto faz deploy: cada um é útil duas vezes por mês e custa tokens em todas as mensagens. As **habilidades** (*skills*) resolvem isso com o desenho de um índice e um volume. O índice, um nome e uma descrição de uma linha por habilidade, vai em todos os pedidos. O volume, o texto completo, só é lido quando o modelo decide que a tarefa em mãos pede aquela habilidade. O custo fixo de ter vinte habilidades é o de vinte linhas, não o de vinte manuais.",
          "",
          "Uma habilidade é uma pasta com um arquivo `SKILL.md`. O OpenCode procura em `.opencode/skill/<nome-da-pasta>/SKILL.md` dentro do projeto e em `skill/` na pasta de configuração do usuário. O arquivo tem um frontmatter com dois campos que importam, `name` e `description`, e um corpo livre em markdown, que é o conteúdo da habilidade. Convém que o nome da pasta e o `name` sejam iguais, mas o OpenCode não exige: quem manda é o `name` do frontmatter, e o nome da pasta só aparece no caminho do arquivo. A pasta `.opencode/skills/`, no plural, e subpastas aninhadas dentro de `skill/` também são lidas. A pasta pode conter outros arquivos além do `SKILL.md`, como modelos, scripts e exemplos, e o conteúdo da habilidade pode apontar para eles.",
          "",
          "O comando `opencode debug skill` imprime as habilidades que o OpenCode carregou, e é o instrumento de conferência desta parte do livro. Para cada habilidade, a saída traz `name`, `description`, `location` (o caminho do arquivo ou `<built-in>` para as que vêm no programa) e `content`, que é o corpo sem o frontmatter. O OpenCode traz uma habilidade embutida, `customize-opencode`, que ensina o agente a editar a configuração do próprio OpenCode, e que explica por que a lista nunca vem vazia. Na sua máquina, a lista pode trazer mais itens do que a do exemplo: as habilidades que você já tem de outras ferramentas, tema da última seção. O exemplo cria a habilidade `relatorio-semanal` e a lista mostra os campos da habilidade nova.",
        ]),
        code("markdown", [
          "---",
          "name: relatorio-semanal",
          "description: Use para montar o relatório semanal de entregas da equipe",
          "---",
          "# Relatório semanal",
          "SKILL-PASSO-1 liste os commits da semana.",
          "SKILL-PASSO-2 agrupe por área.",
        ], ".opencode/skill/relatorio-semanal/SKILL.md: uma habilidade com dois passos"),
        code("bash", [
          "$ opencode debug skill",
        ], "Terminal: as habilidades que o OpenCode carregou"),
        code("text", [
          "\"name\": \"customize-opencode\",",
          "\"location\": \"<built-in>\",",
          "\"name\": \"relatorio-semanal\",",
          "\"description\": \"Use para montar o relatório semanal de entregas da equipe\",",
          "\"location\": \"<projeto>\\\\.opencode\\\\skill\\\\relatorio-semanal\\\\SKILL.md\",",
          "\"content\": \"# Relatório semanal\\nSKILL-PASSO-1 liste os commits da semana.\\nSKILL-PASSO-2 agrupe por área.\\n\"",
        ], "Saída (ordem livre): a habilidade embutida e a nova, com o conteúdo sem o frontmatter"),
        prose([
          "Duas leituras da saída valem anotadas. A primeira: o campo `content` não inclui o frontmatter, só o corpo, com as quebras de linha como `\\n` por ser JSON. Isso é o que o modelo receberá quando carregar a habilidade, e é a coisa a revisar ao escrevê-la. A segunda: o `location` é o caminho completo do arquivo, e esse caminho tem papel prático, porque o modelo o recebe junto com a habilidade e pode ler arquivos vizinhos a partir dele. Uma habilidade de migração de banco pode trazer na pasta os scripts SQL de cada passo, e o corpo do `SKILL.md` só diz qual ler em cada situação.",
          "",
          "O desenho tem uma consequência para quem escreve: a descrição é a parte mais importante do arquivo. Ela é o único texto que o modelo lê antes de decidir se carrega o resto. Uma descrição como \"relatórios\" não diz nada; \"Use para montar o relatório semanal de entregas da equipe\" diz quando usar e para quê. A seção seguinte mostra o que o modelo realmente recebe, e a terceira volta à escrita das descrições. Vale ainda separar, desde o início, o que é conhecimento do que é regra: uma habilidade explica **como fazer** algo que só às vezes se faz, e deve ser lida como um manual curto; uma regra de conduta, que vale em toda tarefa, continua sendo assunto do `AGENTS.md`. A fronteira entre as duas é a pergunta de quantas conversas precisam do texto: se são quase todas, é instrução; se são poucas, é habilidade.",
        ]),
        porque([
          "Uma habilidade é uma pasta com `SKILL.md`: frontmatter com `name` e `description` e um corpo livre. Só o índice (nome e descrição) vai em todos os pedidos; o corpo é carregado sob demanda. `opencode debug skill` lista o que foi carregado, com o caminho e o conteúdo.",
        ]),
        quebraria([
          "Uma equipe põe o manual de deploy inteiro no `AGENTS.md`. Cada pergunta, até a de renomear uma variável, paga as milhares de palavras do manual. Transformado em habilidade, o manual só seria lido nas conversas sobre deploy.",
        ]),
      ],
    },
    {
      title: "Duas etapas: o índice no pedido e o corpo sob demanda",
      order: 1,
      blocks: [
        prose([
          "O que a seção anterior descreveu em palavras fica à vista com o modelo falso. O pedido que o OpenCode envia traz uma lista de habilidades disponíveis, com nome, descrição e localização, e uma ferramenta nova, `skill`, cujo único propósito é carregar uma habilidade pelo nome. Quando o modelo chama a ferramenta, o OpenCode devolve o corpo da habilidade como resultado da ferramenta, e é só então que o texto completo passa a fazer parte da conversa. No pedido seguinte, a habilidade já está no histórico.",
          "",
          "O exemplo mostra as duas etapas com um roteiro de uma chamada. O primeiro pedido, o do agente que ainda não sabe de nada, tem a habilidade no índice e não tem os passos dela. O modelo falso chama a ferramenta `skill` com o nome `relatorio-semanal`. O segundo pedido, que traz o resultado da ferramenta, tem o corpo da habilidade dentro de um bloco `<skill_content>`, com os dois passos e o caminho da pasta. A verificação usa o mesmo padrão nos dois pedidos: no primeiro, ele só encontra o índice; no segundo, encontra o corpo.",
        ]),
        code("markdown", [
          "---",
          "name: relatorio-semanal",
          "description: Use para montar o relatório semanal de entregas da equipe",
          "---",
          "# Relatório semanal",
          "SKILL-PASSO-1 liste os commits da semana.",
          "SKILL-PASSO-2 agrupe por área.",
          "SKILL-PASSO-3 escreva o resumo em três linhas.",
        ], ".opencode/skill/relatorio-semanal/SKILL.md: a habilidade, agora com três passos"),
        code("json", [
          "[",
          "  { \"ferramenta\": \"skill\", \"argumentos\": { \"name\": \"relatorio-semanal\" } },",
          "  \"Pronto, segui os passos.\"",
          "]",
        ], "roteiro.json: o modelo carrega a habilidade e conclui"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"relatorio-semanal|SKILL-PASSO\" 0",
          "$ node ver-pedido.mjs \"relatorio-semanal|SKILL-PASSO\" 1",
        ], "Terminal (modelo falso): o mesmo padrão, aplicado ao primeiro e ao segundo pedido"),
        code("text", [
          "→ Skill \"relatorio-semanal\"",
          "<name>relatorio-semanal</name>",
          "[tool] … caracteres",
          "<skill_content name=\"relatorio-semanal\">",
          "SKILL-PASSO-1 liste os commits da semana.",
          "SKILL-PASSO-2 agrupe por área.",
          "SKILL-PASSO-3 escreva o resumo em três linhas.",
        ], "Saída: o índice no primeiro pedido, o corpo no segundo"),
        prose([
          "A linha `→ Skill \"relatorio-semanal\"` que o `run` imprimiu é o aviso de que a ferramenta foi usada. A leitura que importa vem em seguida. No primeiro pedido, o único rastro da habilidade é o seu nome dentro de um bloco de índice, e as linhas de passos não aparecem em lugar nenhum. No segundo, a mensagem de ferramenta traz o conteúdo inteiro, pronto para o modelo seguir.",
          "",
          "Esse mecanismo explica o que se pode e o que não se pode esperar de uma habilidade. Pode-se esperar que, diante de uma tarefa que a descrição cobre, um modelo atento a carregue, e que o custo de tê-la seja baixo nas conversas em que ela não serve. Não se pode esperar que ela seja carregada sempre: a decisão é do modelo, tomada a partir de uma linha de descrição, e modelos erram nos dois sentidos, carregando habilidades sem necessidade ou deixando de carregar a que serviria. Uma habilidade crítica, que **precisa** ser seguida, não pertence ao índice, e sim ao `AGENTS.md` ou a um comando, onde a presença não depende de uma escolha. Para o que é relevante às vezes, o índice é perfeito.",
          "",
          "A descrição serve, portanto, de gatilho, e é nela que se concentra o trabalho de ajuste. Quando uma habilidade não é carregada nas situações em que deveria, a primeira coisa a revisar é a frase que o modelo leu: ela diz **quando** usar? Menciona as palavras que o usuário diria? Quando é carregada demais, a descrição provavelmente é ampla além da conta. O modelo falso ajuda aqui também: ao ler o pedido, vê-se exatamente o que o modelo real vai ler.",
          "",
          "O desenho em duas etapas também orienta o tamanho do corpo. Como ele entra na conversa de uma vez só, quando carregado, e permanece no histórico dali em diante, um corpo de milhares de palavras tem custo em todas as mensagens seguintes da sessão, e não apenas na que o carregou. A solução é a mesma da organização de qualquer manual: um corpo curto que diz o que fazer e em que ordem, e arquivos de apoio na mesma pasta para o detalhe. O caminho da pasta vem junto com o conteúdo, na linha `Base directory for this skill`, e o modelo pode ler os arquivos de apoio com a ferramenta `read` só quando o passo pedir. Medir o efeito é simples: o tamanho da mensagem de sistema, no `ver-pedido`, mostra o custo do índice, e o tamanho da mensagem de ferramenta mostra o custo de cada habilidade carregada.",
        ]),
        porque([
          "O pedido traz o índice de habilidades e a ferramenta `skill`; o corpo só chega como resultado da ferramenta, quando o modelo a chama. A decisão de carregar é do modelo, tomada pela descrição.",
        ]),
        quebraria([
          "Uma regra de segurança que nunca pode ser esquecida é escrita como habilidade. Em dias em que o modelo não a carrega, a regra não existe naquela sessão, e ninguém percebe até o incidente. O que não pode faltar vai no arquivo de instruções ou numa permissão.",
        ]),
      ],
    },
    {
      title: "Escrever bem: descrição, nomes e o que o OpenCode ignora em silêncio",
      order: 2,
      blocks: [
        prose([
          "Escrever uma habilidade é escrever duas coisas diferentes para dois leitores. A descrição é para o modelo que decide, e deve ser uma frase de gatilho: começa por \"Use quando...\" ou \"Use para...\", diz o tipo de tarefa e, quando há risco de confusão, o que fica de fora. O corpo é para o modelo que executa, e deve ser um procedimento: passos numerados, critérios de término, o formato da resposta. Os melhores corpos são curtos o bastante para caberem numa tela e apontam para arquivos vizinhos quando precisam de mais, em vez de despejar tudo: o modelo pode ler `scripts/migrar.sql` na hora certa, e o resto não pesa.",
          "",
          "O OpenCode é permissivo na leitura dos arquivos e, por isso, silencioso com os erros. Quatro comportamentos merecem atenção, e os quatro aparecem no exemplo. Um `SKILL.md` **sem frontmatter** não vira habilidade: o arquivo é lido, não tem nome, e é descartado sem aviso. O mesmo vale para um arquivo com frontmatter **sem o campo `name`**: a `description` sozinha não basta. Uma habilidade **sem `description`** é aceita, mas entra na lista sem texto, e o índice que o modelo recebe não tem nada para decidir. E duas habilidades com o **mesmo `name`** viram uma só, sem erro, e qual das duas cópias prevalece não é garantido: depende da ordem em que o OpenCode lê as pastas, que pode mudar de uma execução para outra.",
        ]),
        code("markdown", [
          "Só um corpo de texto, sem nenhum cabeçalho.",
        ], ".opencode/skill/sem-cabecalho/SKILL.md: um arquivo sem frontmatter"),
        code("markdown", [
          "---",
          "description: Uma descrição, mas nenhum nome",
          "---",
          "Corpo N.",
        ], ".opencode/skill/sem-nome/SKILL.md: frontmatter sem o campo name"),
        code("markdown", [
          "---",
          "name: sem-descricao",
          "---",
          "Corpo S.",
        ], ".opencode/skill/sem-descricao/SKILL.md: uma habilidade sem descrição"),
        code("markdown", [
          "---",
          "name: duplicada",
          "description: Versão da pasta a",
          "---",
          "Corpo A.",
        ], ".opencode/skill/a/SKILL.md: uma habilidade chamada duplicada"),
        code("markdown", [
          "---",
          "name: duplicada",
          "description: Versão da pasta b",
          "---",
          "Corpo B.",
        ], ".opencode/skill/b/SKILL.md: outra habilidade com o mesmo nome"),
        code("bash", [
          "$ opencode debug skill --log-level ERROR",
        ], "Terminal: a listagem das habilidades defeituosas"),
        code("text", [
          "\"name\": \"duplicada\",",
          "\"name\": \"sem-descricao\",",
          "\"location\": \"<projeto>\\\\.opencode\\\\skill\\\\sem-descricao\\\\SKILL.md\",",
        ], "Saída (ordem livre): a duplicada aparece uma vez, a sem descrição aparece sem texto, e as duas sem nome sumiram"),
        prose([
          "O resultado ensina a desconfiar da ausência: as habilidades `sem-cabecalho` e `sem-nome` não estão na lista, e nenhuma mensagem avisou. O hábito saudável de quem escreve habilidades é, depois de criar uma, rodar `opencode debug skill` e procurar o nome. Se o nome não está lá, o arquivo foi ignorado, e a causa mais provável é o frontmatter. Quanto ao conteúdo do campo `name`, o OpenCode não valida o formato, mas o modelo vai digitá-lo como argumento da ferramenta `skill`, e ele precisa casar exatamente. Por isso a escolha segura é a de sempre: letras minúsculas, números e hífens, como `relatorio-semanal`.",
          "",
          "Há ainda a questão da quantidade. Cada habilidade soma uma entrada ao índice de todo pedido, e um índice com cinquenta linhas já é um custo constante apreciável; mais grave, descrições parecidas entre si confundem o modelo, que não sabe qual carregar. Um catálogo pequeno de habilidades com descrições bem distintas funciona melhor que um catálogo grande. Quando duas habilidades se sobrepõem, é melhor fundi-las, com um corpo que decida entre os casos, do que manter duas descrições que competem pela mesma tarefa, e muito melhor do que repetir o nome, cujo resultado não se pode prever.",
          "",
          "Um corpo que funciona costuma ter quatro partes, nesta ordem. Primeiro, **quando usar**, em uma ou duas frases, repetindo e refinando o que a descrição prometeu, porque o modelo já decidiu carregar e agora precisa confirmar que escolheu a habilidade certa. Depois, os **passos**, numerados, cada um com uma ação que se possa executar sem interpretação. Em seguida, a **verificação**: o que o modelo deve conferir antes de declarar a tarefa concluída, como rodar um comando de teste ou comparar uma contagem. Por último, o **formato da resposta**, para que a saída seja previsível quando a habilidade é usada por pessoas diferentes. Uma habilidade escrita assim se parece mais com um procedimento operacional do que com um texto explicativo, e é isso que a torna reproduzível: duas sessões que a carregam tendem a fazer a mesma coisa. Quando o procedimento tem uma decisão no meio, escreva as duas saídas como passos separados, com a condição à vista, em vez de deixar o modelo deduzir qual vale em cada caso.",
        ]),
        porque([
          "A descrição é o gatilho e o corpo é o procedimento. Sem frontmatter ou sem `name`, o arquivo é descartado; sem `description`, a habilidade entra sem gatilho; com nome repetido, resta uma só, e não se sabe qual. Depois de escrever uma, confira com `opencode debug skill`.",
        ]),
        quebraria([
          "Alguém escreve uma habilidade com um cabeçalho que só traz `description`, sem `name`. O arquivo nunca aparece na lista, e a pessoa passa a tarde ajustando o conteúdo, que nem chegou ao modelo. A conferência de dez segundos com `opencode debug skill` teria mostrado a ausência.",
        ]),
      ],
    },
    {
      title: "De onde vêm as habilidades: projeto, usuário, outras ferramentas e permissão",
      order: 3,
      blocks: [
        prose([
          "As habilidades podem morar em mais de um lugar, e cada lugar tem um alcance. As do **projeto** ficam em `.opencode/skill/` e viajam com o repositório: quem o clona tem as mesmas habilidades. As do **usuário** ficam em `skill/` na pasta de configuração, e valem em todos os projetos, o lugar de procedimentos pessoais. As duas somam-se na lista, com o projeto vencendo em caso de nome repetido, como em tudo o que é camada. O exemplo cria uma habilidade de cada lado e confirma pelo `location` de onde cada uma veio.",
        ]),
        code("markdown", [
          "---",
          "name: pessoal",
          "description: Use para lembrar das minhas preferências de commit",
          "---",
          "Mensagens de commit no imperativo, em português.",
        ], "Global skill/pessoal/SKILL.md: uma habilidade do usuário, que vale em todos os projetos"),
        code("markdown", [
          "---",
          "name: do-projeto",
          "description: Use para publicar o pacote deste projeto",
          "---",
          "Rode o script de publicação e confira a versão.",
        ], ".opencode/skill/do-projeto/SKILL.md: uma habilidade do projeto, que viaja com o repositório"),
        code("bash", [
          "$ opencode debug skill --pure",
        ], "Terminal: as habilidades das duas origens"),
        code("text", [
          "\"name\": \"pessoal\",",
          "\"location\": \"<tmp>\\\\config\\\\opencode\\\\skill\\\\pessoal\\\\SKILL.md\",",
          "\"name\": \"do-projeto\",",
          "\"location\": \"<projeto>\\\\.opencode\\\\skill\\\\do-projeto\\\\SKILL.md\",",
        ], "Saída (ordem livre): cada habilidade com o caminho da sua origem"),
        prose([
          "Uma terceira origem, menos óbvia, é a de **outras ferramentas de agente**. O OpenCode lê, além das suas pastas, as habilidades que outras ferramentas guardam em `.claude/skills/`, tanto no projeto quanto na pasta pessoal do usuário. A intenção é boa: quem já escreveu habilidades para uma ferramenta aproveita as mesmas em outra, sem copiar. O efeito colateral é que a lista de habilidades do OpenCode passa a conter itens que o autor do projeto nunca pensou em oferecer a ele, e que a lista **muda de uma máquina para outra**, conforme o que cada pessoa tem na própria pasta. É a razão de a lista da sua máquina ter mais itens do que a dos exemplos deste livro, que são executados com essa leitura desligada. O desligamento é a variável de ambiente `OPENCODE_DISABLE_EXTERNAL_SKILLS=1`, e a leitura ligada, a mesma variável com valor `0`. O exemplo cria uma habilidade em `.claude/skills/` e liga a leitura para ela aparecer.",
        ]),
        code("markdown", [
          "---",
          "name: de-fora",
          "description: Use para testar a leitura de habilidades de outras ferramentas",
          "---",
          "Corpo F.",
        ], ".claude/skills/de-fora/SKILL.md: uma habilidade no formato de outra ferramenta"),
        code("bash", [
          "$ OPENCODE_DISABLE_EXTERNAL_SKILLS=0 opencode debug skill",
        ], "Terminal: com a leitura de outras ferramentas ligada"),
        code("text", [
          "\"name\": \"de-fora\",",
          "\"location\": \"<projeto>\\\\.claude\\\\skills\\\\de-fora\\\\SKILL.md\",",
        ], "Saída (ordem livre): a habilidade de .claude/skills entrou na lista do OpenCode"),
        prose([
          "A última parte é a permissão. A ferramenta `skill` tem a sua entrada na política do capítulo 5, e as regras aceitam o nome da habilidade como padrão. Uma política `\"skill\": { \"*\": \"deny\" }` nega todas, e o efeito, como acontece com qualquer ferramenta negada por inteiro, é a retirada da ferramenta do pedido: o modelo deixa de receber a ferramenta `skill`, e o índice também some do texto de sistema. É a maneira de **desligar** as habilidades num projeto, ou num agente específico, e a maneira de abrir só as que se quer: um `deny` para `*` seguido de `allow` para o nome de cada habilidade aprovada, na ordem do capítulo 5.",
        ]),
        code("json", [
          "{",
          "  \"permission\": { \"skill\": { \"*\": \"deny\" } }",
          "}",
        ], "opencode.json: nenhuma habilidade pode ser carregada"),
        code("bash", [
          "$ node modelo-falso.mjs --port 4701 &",
          "$ opencode run Ola",
          "$ node ver-pedido.mjs \"available_skills\"",
        ], "Terminal (modelo falso): o pedido de um projeto que negou as habilidades"),
        code("text", [
          "> build · falso",
          "pedidos: 1 | modelo: falso | ferramentas: bash,edit,glob,grep,read,task,todowrite,webfetch,write",
        ], "Saída: a ferramenta skill saiu da lista"),
        prose([
          "Vale um último aviso sobre confiança. Uma habilidade é texto que o modelo trata como instrução, escrito por quem fez a pasta. Habilidades baixadas da internet, copiadas de um repositório desconhecido ou colocadas por outra ferramenta têm o mesmo risco de um script de origem duvidosa: o conteúdo pode orientar o modelo a fazer o que o usuário não pediu. A defesa é a de sempre: ler o `SKILL.md` antes de aceitar, e manter a política de permissões restrita, porque ela vale para o que a habilidade mandar fazer.",
          "",
          "Numa equipe, isso pede combinados simples. As habilidades do projeto ficam em `.opencode/skill/` e passam por revisão de código como qualquer arquivo, com um responsável por cada uma, de modo que alguém responda quando a descrição deixar de refletir o procedimento. As pessoais ficam na pasta do usuário e não vão para o repositório, para que preferências de uma pessoa não virem regra da equipe. E há um critério de aposentadoria: uma habilidade que ninguém aciona há meses é custo no índice de todos os pedidos, e a conferência é fácil, porque a pasta de sessões guarda o histórico de quais ferramentas foram chamadas. Quando uma habilidade passa a ser usada sempre da mesma maneira, vale convertê-la em comando, onde o texto vai ao modelo sem depender de uma escolha; e quando passa a ser indispensável, em instrução. Esse caminho de promoção, da habilidade ao comando e do comando à instrução, é um bom critério para decidir onde um conhecimento novo deve morar no início.",
        ]),
        porque([
          "Habilidades vêm de `.opencode/skill/`, da pasta de configuração do usuário e, por padrão, de `.claude/skills/`; a lista muda de máquina para máquina, a menos que `OPENCODE_DISABLE_EXTERNAL_SKILLS=1` desligue as de outras ferramentas. `permission.skill` com `deny` retira a ferramenta e o índice do pedido.",
        ]),
        quebraria([
          "Um repositório vem com uma pasta `.claude/skills/` de um colaborador. O OpenCode a lê sem avisar, e uma habilidade que o mantenedor nunca revisou passa a fazer parte do índice de toda sessão. Quem não lê a lista de habilidades de um projeto novo não sabe que ela existe.",
        ]),
      ],
    },
  ],
};

export const OPENCODE_BOOK_07_EXERCISES: ContentExercise[] = [
  {
    nodeTitle: NODE,
    type: 1,
    level: "intermediate",
    promptMd: "Você cria `.opencode/skill/migrar-banco/SKILL.md` com um frontmatter que traz apenas `description: Use para migrar o banco`, seguido de um corpo com cinco passos, e depois roda `opencode debug skill`. A habilidade não aparece. Qual é a explicação mais provável?",
    choices: [
      "Falta o campo name no frontmatter, e o OpenCode descarta em silêncio o arquivo sem nome",
      "A pasta precisa se chamar skills, no plural, para ser lida",
      "Habilidades só são lidas depois do primeiro pedido ao modelo",
      "A descrição é curta demais para entrar no índice",
    ],
    answerKeyMd: "Falta o campo name no frontmatter, e o OpenCode descarta em silêncio o arquivo sem nome",
    points: 10,
  },
  {
    nodeTitle: NODE,
    type: 2,
    level: "intermediate",
    promptMd: "Explique por que uma habilidade de 3.000 palavras custa pouco em uma sessão que não a usa, e por que não é seguro confiar numa habilidade para uma regra que nunca pode ser esquecida.",
    answerKeyMd: "O pedido só carrega o índice: nome, descrição e localização de cada habilidade, uma linha por habilidade. O corpo de 3.000 palavras só entra na conversa como resultado da ferramenta `skill`, quando o modelo a chama; numa sessão que não a usa, ele nunca é enviado. Mas é exatamente por isso que a habilidade não é segura para uma regra obrigatória: a decisão de carregar é do modelo, tomada com base numa linha de descrição, e modelos erram, deixando de carregar a habilidade em situações em que ela se aplicava. Uma regra que nunca pode faltar deve estar no arquivo de instruções (presente em todo pedido), em um comando ou em uma permissão.",
    rubricMd: "Explica o índice versus o corpo sob demanda; reconhece que a decisão de carregar é do modelo e pode falhar; indica AGENTS.md, comando ou permissão para o que é obrigatório.",
    points: 20,
  },
  {
    nodeTitle: NODE,
    type: 3,
    level: "advanced",
    promptMd: "Duas pessoas da mesma equipe rodam o OpenCode no mesmo repositório e percebem que o agente de uma delas carrega habilidades que a outra não tem. Descreva as causas possíveis, como investigar com os comandos do OpenCode e que medidas tornam a lista igual para todos.",
    answerKeyMd: "As causas: habilidades na pasta pessoal do usuário (`skill/` da configuração), habilidades de outras ferramentas em `.claude/skills/` (do projeto ou da pasta pessoal), que o OpenCode lê por padrão, e nomes repetidos em que uma cópia prevalece sobre a outra. Para investigar, cada pessoa roda `opencode debug skill` e compara os campos `location`, que dizem de onde vem cada habilidade. As medidas: manter as habilidades que a equipe quer em `.opencode/skill/` no repositório, revisar a pasta `.claude/skills/` do projeto, e exigir `OPENCODE_DISABLE_EXTERNAL_SKILLS=1` (por exemplo, no ambiente de integração contínua e nas automações) para desligar as de outras ferramentas, o que reproduz a mesma lista em qualquer máquina. Quando se quer abrir só um conjunto aprovado, a permissão `skill` com `deny` para `*` e `allow` por nome faz o resto.",
    points: 20,
  },
];

export const OPENCODE_BOOK_07_CARDS: ContentCard[] = [
  { nodeTitle: NODE, frontMd: "O que é uma habilidade do OpenCode?", backMd: "Uma pasta com `SKILL.md` (frontmatter com `name` e `description`, corpo livre) em `.opencode/skill/` ou na pasta de configuração. Só o índice vai em todo pedido; o corpo é carregado pela ferramenta `skill`." },
  { nodeTitle: NODE, frontMd: "Como conferir as habilidades carregadas?", backMd: "`opencode debug skill`: lista nome, descrição, caminho e conteúdo (sem frontmatter). Há uma embutida, `customize-opencode`." },
  { nodeTitle: NODE, frontMd: "Que erros o OpenCode ignora em silêncio nas habilidades?", backMd: "Arquivo sem frontmatter ou sem `name` (some), nome repetido (resta uma só, sem garantia de qual) e falta de `description` (entra no índice sem gatilho)." },
  { nodeTitle: NODE, frontMd: "Por que a lista de habilidades muda de máquina para máquina?", backMd: "Porque o OpenCode lê também `.claude/skills/` (projeto e pasta pessoal). `OPENCODE_DISABLE_EXTERNAL_SKILLS=1` desliga essa leitura." },
  { nodeTitle: NODE, frontMd: "Como desligar as habilidades num projeto?", backMd: "`permission.skill` com `\"*\": \"deny\"`: a ferramenta `skill` e o índice saem do pedido. Para abrir só algumas, `allow` por nome depois do `deny`." },
];
