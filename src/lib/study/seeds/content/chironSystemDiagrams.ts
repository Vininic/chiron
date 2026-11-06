export const CHIRON_SYSTEM_DIAGRAMS = [
  {
    "anchor": "mdToBlocks",
    "system": "Renderização da leitura",
    "files": [
      "src/components/BlockRenderer.tsx",
      "src/components/Markdown.tsx",
      "src/components/reader/CodeBlock.tsx"
    ],
    "nodes": [
      "Blocos tipados da seção",
      "Dispatch por kind",
      "Markdown ou Prism lazy",
      "DOM de leitura"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Realce de código é apresentação, sem executor. SVG de diagram usa inserção direta de HTML e exige fronteira de confiança apropriada. Citações e labref podem ser deslocados para a margem pela página.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Renderização da leitura\"><title>Renderização da leitura</title><desc>Realce de código é apresentação, sem executor. SVG de diagram usa inserção direta de HTML e exige fronteira de confiança apropriada. Citações e labref podem ser deslocados para a margem pela página.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Blocos tipados da seção</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Dispatch por kind</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Markdown ou Prism lazy</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">DOM de leitura</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addNode",
    "system": "Interação do mapa",
    "files": [
      "src/components/maps/MapCanvas.tsx",
      "src/components/maps/NodePanel.tsx"
    ],
    "nodes": [
      "Layout + viewBox local",
      "Wheel / pointer / fit",
      "Selecionar nó não bloqueado",
      "Painel e links por node id"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        0
      ],
      [
        0,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "O bloqueio visual usa requisitos existentes com mastery<3; não aplica autorização de backend. O painel deriva materiais por identidade e navega a destinos que precisam interpretar os parâmetros.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Interação do mapa\"><title>Interação do mapa</title><desc>O bloqueio visual usa requisitos existentes com mastery&lt;3; não aplica autorização de backend. O painel deriva materiais por identidade e navega a destinos que precisam interpretar os parâmetros.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Layout + viewBox local</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Wheel / pointer / fit</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Selecionar nó não bloqueado</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Painel e links por node id</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H137V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M137 110V183H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V207H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "mdToBlocks",
    "system": "Proposta de currículo por capítulo",
    "files": [
      "src/lib/content/batch.ts",
      "src/lib/content/authoring.ts"
    ],
    "nodes": [
      "Resolver blueprint",
      "Gerar capítulos em sequência",
      "Parser do envelope",
      "Montar e validar fonte inteira"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "draftBlueprintSource retorna capítulos e erros sem publicar. A fase validated é só parse de envelope; assembleSourceDraft/validateCurriculumDraft fazem a verificação estrutural posterior, sem atestar execução ou cobertura de repo.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Proposta de currículo por capítulo\"><title>Proposta de currículo por capítulo</title><desc>draftBlueprintSource retorna capítulos e erros sem publicar. A fase validated é só parse de envelope; assembleSourceDraft/validateCurriculumDraft fazem a verificação estrutural posterior, sem atestar execução ou cobertura de repo.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resolver blueprint</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Gerar capítulos em sequência</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Parser do envelope</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Montar e validar fonte inteira</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "proseWordCount",
    "system": "Contrato estrutural da fonte",
    "files": [
      "src/lib/content/contract.ts"
    ],
    "nodes": [
      "Blocos da seção",
      "Capítulo e atribuição por nó",
      "Regras stack / tool / repo",
      "Lista de violações"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ]
    ],
    "caption": "checkSource combina capítulos e despacho por kind. O contrato de repo observa presença de cite/diagram/extensão, sem comparar a árvore de arquivos. Um retorno vazio não substitui inventário externo ou revisão editorial.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Contrato estrutural da fonte\"><title>Contrato estrutural da fonte</title><desc>checkSource combina capítulos e despacho por kind. O contrato de repo observa presença de cite/diagram/extensão, sem comparar a árvore de arquivos. Um retorno vazio não substitui inventário externo ou revisão editorial.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Blocos da seção</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Capítulo e atribuição por nó</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Regras stack / tool / repo</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Lista de violações</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "proseWordCount",
    "system": "Auditoria editorial",
    "files": [
      "src/lib/content/editorial.ts"
    ],
    "nodes": [
      "Prosa, código, cards",
      "N-grams, detalhe e duplicatas",
      "Limites e atestação presente",
      "Violações ou assert"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "As métricas detectam padrões repetitivos, não verdade ou execução. Atestação é declaração que precisa de evidência correspondente; o draft Chiron mantém sua ausência enquanto a cobertura está pendente.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Auditoria editorial\"><title>Auditoria editorial</title><desc>As métricas detectam padrões repetitivos, não verdade ou execução. Atestação é declaração que precisa de evidência correspondente; o draft Chiron mantém sua ausência enquanto a cobertura está pendente.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Prosa, código, cards</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">N-grams, detalhe e duplicatas</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Limites e atestação presente</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Violações ou assert</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "bfs",
    "system": "Busca em Rush",
    "files": [
      "src/lib/labs/rush.ts"
    ],
    "nodes": [
      "Tabuleiro inicial válido",
      "Fila + pais por posição",
      "Vizinhos de um passo",
      "Alvo na borda: reconstruir"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        1
      ],
      [
        1,
        3
      ]
    ],
    "caption": "solveRush usa BFS no grafo de passos unitários. queue.length limita a descoberta; solved=false não distingue corte de ausência de solução. rushDifficulty deve ser interpretado com essa limitação.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Busca em Rush\"><title>Busca em Rush</title><desc>solveRush usa BFS no grafo de passos unitários. queue.length limita a descoberta; solved=false não distingue corte de ausência de solução. rushDifficulty deve ser interpretado com essa limitação.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Tabuleiro inicial válido</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Fila + pais por posição</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Vizinhos de um passo</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Alvo na borda: reconstruir</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V207H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "pathIsValid",
    "system": "Transição de Snake",
    "files": [
      "src/lib/labs/simulations.ts"
    ],
    "nodes": [
      "Direção atual + entrada",
      "queueDirection rejeita oposta",
      "tick: wrap e alimento",
      "Checar invariantes do corpo"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "O tick aplica entrada e cresce ou remove cauda, sem impedir autocolisão nem renovar alimento. snakeInvariants observa propriedades; não é chamado automaticamente pelo motor para bloquear estado inválido.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Transição de Snake\"><title>Transição de Snake</title><desc>O tick aplica entrada e cresce ou remove cauda, sem impedir autocolisão nem renovar alimento. snakeInvariants observa propriedades; não é chamado automaticamente pelo motor para bloquear estado inválido.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Direção atual + entrada</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">queueDirection rejeita oposta</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">tick: wrap e alimento</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Checar invariantes do corpo</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "recordLabLayer",
    "system": "Reserva local de mercado",
    "files": [
      "src/lib/labs/simulations.ts"
    ],
    "nodes": [
      "Produto e disponibilidade",
      "reserve sobre snapshot",
      "reserved + item no carrinho",
      "Conciliar e somar centavos"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Sem disponibilidade reserve devolve estado original. marketInvariants relaciona produtos e carrinhos e cartTotal usa preço congelado; essas funções não oferecem transação concorrente de backend.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Reserva local de mercado\"><title>Reserva local de mercado</title><desc>Sem disponibilidade reserve devolve estado original. marketInvariants relaciona produtos e carrinhos e cartTotal usa preço congelado; essas funções não oferecem transação concorrente de backend.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Produto e disponibilidade</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">reserve sobre snapshot</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">reserved + item no carrinho</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Conciliar e somar centavos</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addNode",
    "system": "Layout determinístico do mapa",
    "files": [
      "src/lib/maps/layout.ts"
    ],
    "nodes": [
      "Nós e requires internos",
      "Profundidade por maior caminho",
      "Ordenar por baricentro",
      "Posicionar camadas centradas"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A guarda de recursão corta ciclos para terminar, sem certificar DAG. Empates usam posição de entrada; o resultado não é otimização global de cruzamentos.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Layout determinístico do mapa\"><title>Layout determinístico do mapa</title><desc>A guarda de recursão corta ciclos para terminar, sem certificar DAG. Empates usam posição de entrada; o resultado não é otimização global de cruzamentos.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Nós e requires internos</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Profundidade por maior caminho</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Ordenar por baricentro</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Posicionar camadas centradas</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addSource",
    "system": "Ingestão de propostas",
    "files": [
      "src/lib/study/ingestion/run.ts",
      "src/lib/study/ingestion/passes.ts"
    ],
    "nodes": [
      "URL + branch + amostra",
      "Mapa de conceitos",
      "Seções / exercícios / cards",
      "DraftDocument pending"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Os passes são sequenciais e guardam propostas bem-sucedidas. Um resultado parcialmente útil retorna ok=true sem expor firstError; exceções fora dos retornos de erro podem rejeitar a execução. Não altera índice ou biblioteca.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Ingestão de propostas\"><title>Ingestão de propostas</title><desc>Os passes são sequenciais e guardam propostas bem-sucedidas. Um resultado parcialmente útil retorna ok=true sem expor firstError; exceções fora dos retornos de erro podem rejeitar a execução. Não altera índice ou biblioteca.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">URL + branch + amostra</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Mapa de conceitos</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Seções / exercícios / cards</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">DraftDocument pending</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V207H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addNode",
    "system": "Materialização de propostas",
    "files": [
      "src/lib/study/ingestion/materialize.ts"
    ],
    "nodes": [
      "Filtrar approved",
      "Criar ids por título",
      "Resolver parent / requires",
      "Associar conteúdo aos ids"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Títulos desconhecidos fazem seções, exercícios e cards serem descartados. Seções válidas entram em capítulo sintético; reaplicar não é idempotente para essas entidades.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Materialização de propostas\"><title>Materialização de propostas</title><desc>Títulos desconhecidos fazem seções, exercícios e cards serem descartados. Seções válidas entram em capítulo sintético; reaplicar não é idempotente para essas entidades.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtrar approved</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Criar ids por título</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resolver parent / requires</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Associar conteúdo aos ids</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addSource",
    "system": "Decisão sobre drafts",
    "files": [
      "src/lib/study/ingestion/drafts.ts"
    ],
    "nodes": [
      "Pending",
      "Approved individual/lote",
      "Rejected com feedback",
      "Materializar só approved"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        3
      ]
    ],
    "caption": "approveAllDrafts preserva rejected. Aprovação individual pode reaprovar item recusado; rejeitar depois de materializado não reverte o índice. Status é decisão sobre proposta, sem prova editorial ou de execução.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Decisão sobre drafts\"><title>Decisão sobre drafts</title><desc>approveAllDrafts preserva rejected. Aprovação individual pode reaprovar item recusado; rejeitar depois de materializado não reverte o índice. Status é decisão sobre proposta, sem prova editorial ou de execução.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Pending</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Approved individual/lote</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Rejected com feedback</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Materializar só approved</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M137 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "scoreRubricFraction",
    "system": "Correção por rubrica textual",
    "files": [
      "src/lib/study/rubric.ts",
      "src/pages/Practice.tsx"
    ],
    "nodes": [
      "Pergunta + critérios",
      "Resposta NOTA / FEEDBACK",
      "Regex + clamp 0..1",
      "Converter fração em pontos"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Formato ausente vira fração zero com texto bruto como feedback. O protocolo não é JSON e a fração não prova execução do código nem separa erro de formato de resposta incorreta.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Correção por rubrica textual\"><title>Correção por rubrica textual</title><desc>Formato ausente vira fração zero com texto bruto como feedback. O protocolo não é JSON e a fração não prova execução do código nem separa erro de formato de resposta incorreta.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Pergunta + critérios</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resposta NOTA / FEEDBACK</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Regex + clamp 0..1</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Converter fração em pontos</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "migrateIndex",
    "system": "Migração do índice",
    "files": [
      "src/lib/study/migrate.ts"
    ],
    "nodes": [
      "Entrada desconhecida",
      "Objeto com sources[]?",
      "Não: freshIndex",
      "Sim: schema 3 + defaults"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ]
    ],
    "caption": "migrateIndex recupera um índice vazio quando a forma externa falha; no ramo aceito conserva campos recebidos e completa reviewLog/labProgress. Não valida cada entidade.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Migração do índice\"><title>Migração do índice</title><desc>migrateIndex recupera um índice vazio quando a forma externa falha; no ramo aceito conserva campos recebidos e completa reviewLog/labProgress. Não valida cada entidade.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Entrada desconhecida</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Objeto com sources[]?</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Não: freshIndex</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Sim: schema 3 + defaults</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addSource",
    "system": "Transformações de estudo",
    "files": [
      "src/lib/study/service.ts"
    ],
    "nodes": [
      "Índice anterior",
      "Serviço: cópias externas",
      "Nova versão",
      "Provider recebe resultado"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "O serviço constrói o próximo índice. A persistência pertence ao provider; a transformação isolada não grava storage nem confirma sincronização.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Transformações de estudo\"><title>Transformações de estudo</title><desc>O serviço constrói o próximo índice. A persistência pertence ao provider; a transformação isolada não grava storage nem confirma sincronização.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Índice anterior</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Serviço: cópias externas</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Nova versão</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Provider recebe resultado</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "mdToBlocks",
    "system": "Leitura de blocos",
    "files": [
      "src/lib/content/blocks.ts"
    ],
    "nodes": [
      "Markdown de entrada",
      "Separar cercas de código",
      "Blocos prose / code",
      "Contar só prose"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A separação usa cercas reconhecidas pela implementação. proseWordCount considera blocos de prosa, deixando código fora do piso editorial.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Leitura de blocos\"><title>Leitura de blocos</title><desc>A separação usa cercas reconhecidas pela implementação. proseWordCount considera blocos de prosa, deixando código fora do piso editorial.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Markdown de entrada</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Separar cercas de código</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Blocos prose / code</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Contar só prose</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "computeSM2",
    "system": "Agendamento SM-2",
    "files": [
      "src/lib/study/srs.ts"
    ],
    "nodes": [
      "Card + qualidade",
      "Qualidade < 3?",
      "Sim: lapso, intervalo 1",
      "Não: estágio / intervalo"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ]
    ],
    "caption": "O resultado recalcula ease e due. No ramo aceito o intervalo passa pelos estágios 1 dia, 6 dias e multiplicação do intervalo anterior; o ramo de lapso reinicia repetições.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Agendamento SM-2\"><title>Agendamento SM-2</title><desc>O resultado recalcula ease e due. No ramo aceito o intervalo passa pelos estágios 1 dia, 6 dias e multiplicação do intervalo anterior; o ramo de lapso reinicia repetições.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Card + qualidade</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Qualidade &lt; 3?</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Sim: lapso, intervalo 1</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Não: estágio / intervalo</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "predictIntervalDays",
    "system": "Apresentação da revisão",
    "files": [
      "src/lib/study/review.ts",
      "src/lib/study/srs.ts"
    ],
    "nodes": [
      "Botão escolhido",
      "gradeForButton",
      "computeSM2",
      "Intervalo apresentado"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "predictIntervalDays consulta o mesmo motor de agendamento sem persistir o card. Exibir a previsão não registra uma revisão nem garante a sequência de cards da página.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Apresentação da revisão\"><title>Apresentação da revisão</title><desc>predictIntervalDays consulta o mesmo motor de agendamento sem persistir o card. Exibir a previsão não registra uma revisão nem garante a sequência de cards da página.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Botão escolhido</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">gradeForButton</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">computeSM2</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Intervalo apresentado</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "selectExercises",
    "system": "Seleção e correção",
    "files": [
      "src/lib/study/practice.ts"
    ],
    "nodes": [
      "Pool + filtros",
      "Filtrar e embaralhar",
      "Selecionar quantidade",
      "Corretor conforme tipo"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A seleção trabalha com cópia. A correção de múltipla escolha, autoavaliação e fração de rubrica tem contratos separados; selecionar não corrige nem registra tentativa.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Seleção e correção\"><title>Seleção e correção</title><desc>A seleção trabalha com cópia. A correção de múltipla escolha, autoavaliação e fração de rubrica tem contratos separados; selecionar não corrige nem registra tentativa.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Pool + filtros</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtrar e embaralhar</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Selecionar quantidade</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Corretor conforme tipo</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "addPoints",
    "system": "Pontuação e sequência",
    "files": [
      "src/lib/study/scoring.ts"
    ],
    "nodes": [
      "Tentativa aceita",
      "Somar pontos",
      "Comparar dia da sequência",
      "Novo total e streak"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "addPoints soma o valor recebido e delega a sequência diária. Chamadas repetidas somam de novo; não há idempotência por id de evento nesta função.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Pontuação e sequência\"><title>Pontuação e sequência</title><desc>addPoints soma o valor recebido e delega a sequência diária. Chamadas repetidas somam de novo; não há idempotência por id de evento nesta função.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Tentativa aceita</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Somar pontos</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Comparar dia da sequência</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Novo total e streak</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "planSessionBlocks",
    "system": "Planejamento do dashboard",
    "files": [
      "src/lib/study/dashboard.ts"
    ],
    "nodes": [
      "Minutos + cards devidos",
      "Reservar revisão até 40%",
      "Leitura de 35%",
      "Restante para exercícios"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "O plano deriva blocos e durações a partir do orçamento. createSession é uma operação posterior; calcular blocos não marca atividades como concluídas.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Planejamento do dashboard\"><title>Planejamento do dashboard</title><desc>O plano deriva blocos e durações a partir do orçamento. createSession é uma operação posterior; calcular blocos não marca atividades como concluídas.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Minutos + cards devidos</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Reservar revisão até 40%</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Leitura de 35%</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Restante para exercícios</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "bfs",
    "system": "Busca na grade",
    "files": [
      "src/lib/labs/grid.ts"
    ],
    "nodes": [
      "Fila com origem",
      "Extrair por cursor",
      "Descobrir vizinhos livres",
      "Reconstruir pelos pais"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        1
      ],
      [
        1,
        3
      ]
    ],
    "caption": "BFS registra o pai ao descobrir uma célula e não revisita descobertas. A reconstrução ocorre ao alcançar o destino; esgotar a fila produz falha. A origem não recebe validação completa neste motor.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Busca na grade\"><title>Busca na grade</title><desc>BFS registra o pai ao descobrir uma célula e não revisita descobertas. A reconstrução ocorre ao alcançar o destino; esgotar a fila produz falha. A origem não recebe validação completa neste motor.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Fila com origem</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Extrair por cursor</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Descobrir vizinhos livres</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Reconstruir pelos pais</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V207H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "activeMutations",
    "system": "Metadados do Lab",
    "files": [
      "src/lib/labs/engine.ts"
    ],
    "nodes": [
      "Ids selecionados",
      "Filtrar catálogo de mutações",
      "Ids de invariantes afetados",
      "Painel de invariantes"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "activeMutations conserva a ordem do catálogo e invariantIsBroken consulta metadados. Esses indicadores não demonstram que a simulação violou o invariante em uma execução.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Metadados do Lab\"><title>Metadados do Lab</title><desc>activeMutations conserva a ordem do catálogo e invariantIsBroken consulta metadados. Esses indicadores não demonstram que a simulação violou o invariante em uma execução.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Ids selecionados</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtrar catálogo de mutações</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Ids de invariantes afetados</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Painel de invariantes</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "parseActions",
    "system": "Propostas do tutor",
    "files": [
      "src/lib/ai/actions.ts",
      "src/pages/Aetheris.tsx"
    ],
    "nodes": [
      "Texto de resposta",
      "Primeira cerca JSON",
      "Filtrar tipos conhecidos",
      "Aceitar: applyAction"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "parseActions reconhece tipos, sem validar integralmente os campos de cada payload. A página apresenta propostas antes do evento de aceitação; nem toda variante produz alteração de domínio.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Propostas do tutor\"><title>Propostas do tutor</title><desc>parseActions reconhece tipos, sem validar integralmente os campos de cada payload. A página apresenta propostas antes do evento de aceitação; nem toda variante produz alteração de domínio.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Texto de resposta</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Primeira cerca JSON</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Filtrar tipos conhecidos</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Aceitar: applyAction</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "recordAttempt",
    "system": "Registro e persistência",
    "files": [
      "src/lib/study/service.ts",
      "src/lib/study/store.tsx"
    ],
    "nodes": [
      "Resultado corrigido",
      "recordAttempt + addPoints",
      "replaceIndex no provider",
      "Efeito: JSON local"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A tentativa ganha id/data e entra no índice com pontuação. O efeito local pode falhar silenciosamente; essa cadeia não comprova uma gravação remota.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Registro e persistência\"><title>Registro e persistência</title><desc>A tentativa ganha id/data e entra no índice com pontuação. O efeito local pode falhar silenciosamente; essa cadeia não comprova uma gravação remota.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resultado corrigido</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">recordAttempt + addPoints</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">replaceIndex no provider</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Efeito: JSON local</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "freshIndex",
    "system": "Composição de rotas e providers",
    "files": [
      "src/App.tsx"
    ],
    "nodes": [
      "Theme + I18n",
      "Auth + ChironProvider",
      "RequireAuth nas rotas",
      "Página dentro do layout"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Landing, Login e NotFound têm caminhos públicos. As rotas de estudo passam pela presença de sessão; a proteção visual não é política de autorização do backend.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Composição de rotas e providers\"><title>Composição de rotas e providers</title><desc>Landing, Login e NotFound têm caminhos públicos. As rotas de estudo passam pela presença de sessão; a proteção visual não é política de autorização do backend.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Theme + I18n</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Auth + ChironProvider</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">RequireAuth nas rotas</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Página dentro do layout</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "serializeIndex",
    "system": "Snapshots e histórico do tutor",
    "files": [
      "src/lib/ai/actionHistory.ts",
      "src/pages/Aetheris.tsx"
    ],
    "nodes": [
      "Snapshots anteriores",
      "Aplicar proposta",
      "logHistory: até 30 gravados",
      "Undo: restaurar snapshot"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A restauração repõe o estado anterior inteiro. O histórico marca undone separadamente e não resolve conflitos com edições feitas depois da proposta.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Snapshots e histórico do tutor\"><title>Snapshots e histórico do tutor</title><desc>A restauração repõe o estado anterior inteiro. O histórico marca undone separadamente e não resolve conflitos com edições feitas depois da proposta.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Snapshots anteriores</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Aplicar proposta</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">logHistory: até 30 gravados</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Undo: restaurar snapshot</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "mdToBlocks",
    "system": "Navegação da apostila",
    "files": [
      "src/pages/Apostila.tsx"
    ],
    "nodes": [
      "Capítulos por order",
      "sectionIds de cada capítulo",
      "Orfãs por order",
      "Scrollspy e readAt"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "flattenReadingOrder respeita a sequência de sectionIds nos capítulos e evita duplicação. O scrollspy usa geometria de viewport; a marca readAt não comprova compreensão do texto.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Navegação da apostila\"><title>Navegação da apostila</title><desc>flattenReadingOrder respeita a sequência de sectionIds nos capítulos e evita duplicação. O scrollspy usa geometria de viewport; a marca readAt não comprova compreensão do texto.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Capítulos por order</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">sectionIds de cada capítulo</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Orfãs por order</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Scrollspy e readAt</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "formatInterval",
    "system": "Locale e apresentação",
    "files": [
      "src/lib/i18n/I18nProvider.tsx"
    ],
    "nodes": [
      "Locale armazenado",
      "Dictionary + BCP 47",
      "Hooks do provider",
      "Texto e data na UI"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A seleção de locale troca dicionário e formatadores. Datas apresentadas não substituem as strings canônicas usadas pelo motor de revisão.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Locale e apresentação\"><title>Locale e apresentação</title><desc>A seleção de locale troca dicionário e formatadores. Datas apresentadas não substituem as strings canônicas usadas pelo motor de revisão.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Locale armazenado</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Dictionary + BCP 47</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Hooks do provider</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Texto e data na UI</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "freshIndex",
    "system": "Composição de primitives de interface",
    "files": [
      "src/components/ui/button.tsx",
      "src/components/ui/input.tsx",
      "src/components/ui/dialog.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/tooltip.tsx"
    ],
    "nodes": [
      "Estado da página",
      "Props e handlers",
      "Primitive + classes",
      "DOM e interação"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A página define efeito e validação. Wrappers encaminham props/ref e aparência, delegando interação às primitives. Portal é montado por DialogContent e PopoverContent, mas não por TooltipContent. Aparência não confirma persistência nem autorização.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Composição de primitives de interface\"><title>Composição de primitives de interface</title><desc>A página define efeito e validação. Wrappers encaminham props/ref e aparência, delegando interação às primitives. Portal é montado por DialogContent e PopoverContent, mas não por TooltipContent. Aparência não confirma persistência nem autorização.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Estado da página</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Props e handlers</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Primitive + classes</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">DOM e interação</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "mdToBlocks",
    "system": "Montagem e publicação do corpus curado",
    "files": [
      "src/lib/study/seeds/content/types.ts",
      "src/lib/study/seeds/content/materialize.ts",
      "src/lib/study/seeds/index.ts"
    ],
    "nodes": [
      "Curriculum + prosa + exemplos",
      "Factories de Block/Chapter",
      "Gate editorial no runSeed",
      "applyContentSource: índice/lib"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Factories preservam ou compõem texto/código e verificam presença em alguns formatos; não executam exemplos. runSeed verifica a fonte antes de materializar. applyContentSource cria IDs, resolve referências por título e encadeia nós distintos; não faz auditoria editorial internamente nem torna reaplicação idempotente.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Montagem e publicação do corpus curado\"><title>Montagem e publicação do corpus curado</title><desc>Factories preservam ou compõem texto/código e verificam presença em alguns formatos; não executam exemplos. runSeed verifica a fonte antes de materializar. applyContentSource cria IDs, resolve referências por título e encadeia nós distintos; não faz auditoria editorial internamente nem torna reaplicação idempotente.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Curriculum + prosa + exemplos</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Factories de Block/Chapter</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Gate editorial no runSeed</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">applyContentSource: índice/lib</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "freshIndex",
    "system": "Identidade e acesso às páginas",
    "files": [
      "src/lib/auth.tsx",
      "src/App.tsx"
    ],
    "nodes": [
      "Login ou sessão local",
      "AuthProvider e sessão",
      "RequireAuth nas rotas",
      "Página de estudo"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Presença de sessão governa acesso visual às páginas. Não substitui autorização do backend; resposta de cadastro pode ainda exigir confirmação de email. O provider define persistência e atualização da identidade.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Identidade e acesso às páginas\"><title>Identidade e acesso às páginas</title><desc>Presença de sessão governa acesso visual às páginas. Não substitui autorização do backend; resposta de cadastro pode ainda exigir confirmação de email. O provider define persistência e atualização da identidade.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Login ou sessão local</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">AuthProvider e sessão</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">RequireAuth nas rotas</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Página de estudo</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "serializeIndex",
    "system": "Sincronização do acervo",
    "files": [
      "src/lib/study/store.tsx",
      "src/lib/auth.tsx"
    ],
    "nodes": [
      "Índice/libs em memória",
      "Snapshot local",
      "Sessão e cliente cloud",
      "Pull/push do documento"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        2,
        3
      ],
      [
        3,
        0
      ]
    ],
    "caption": "O provider coordena armazenamento e sincronização. Gravação local pode falhar silenciosamente; presença de cliente não prova serviço disponível. Pull remoto usa o contrato recebido e não equivale à migração/validação completa de entrada externa.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Sincronização do acervo\"><title>Sincronização do acervo</title><desc>O provider coordena armazenamento e sincronização. Gravação local pode falhar silenciosamente; presença de cliente não prova serviço disponível. Pull remoto usa o contrato recebido e não equivale à migração/validação completa de entrada externa.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Índice/libs em memória</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Snapshot local</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Sessão e cliente cloud</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Pull/push do documento</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V159H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M917 110V183H137V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "actionPrompt",
    "system": "Transporte para provedores de IA",
    "files": [
      "src/lib/ai/settings.ts",
      "src/lib/ai/providers.ts"
    ],
    "nodes": [
      "Configuração do provider",
      "Mensagens e contexto",
      "Adapter de transporte",
      "Deltas e resposta final"
    ],
    "edges": [
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "streamChat escolhe adapter real conforme configuração. Hosted pode entregar um delta final, enquanto SSE exige buffering e parsing; término de stream e erro são estados distintos. Configuração salva não comprova autorização, disponibilidade ou validade da resposta.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Transporte para provedores de IA\"><title>Transporte para provedores de IA</title><desc>streamChat escolhe adapter real conforme configuração. Hosted pode entregar um delta final, enquanto SSE exige buffering e parsing; término de stream e erro são estados distintos. Configuração salva não comprova autorização, disponibilidade ou validade da resposta.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Configuração do provider</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Mensagens e contexto</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Adapter de transporte</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Deltas e resposta final</text></g><path d=\"M137 110V135H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "actionPrompt",
    "system": "Conversas e anexos do tutor",
    "files": [
      "src/lib/ai/chatSessions.ts",
      "src/lib/ai/attachments.ts",
      "src/pages/Aetheris.tsx"
    ],
    "nodes": [
      "Sessão de conversa",
      "Texto/anexos preparados",
      "Contexto para geração",
      "Resposta e histórico local"
    ],
    "edges": [
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "A tela combina mensagens e conteúdo preparado. Persistência de conversa é distinta de aplicar proposta ao acervo. Preparar anexo não confere autoridade às instruções nele contidas nem prova que todo formato seja interpretado pelo provider.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Conversas e anexos do tutor\"><title>Conversas e anexos do tutor</title><desc>A tela combina mensagens e conteúdo preparado. Persistência de conversa é distinta de aplicar proposta ao acervo. Preparar anexo não confere autoridade às instruções nele contidas nem prova que todo formato seja interpretado pelo provider.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Sessão de conversa</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Texto/anexos preparados</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Contexto para geração</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Resposta e histórico local</text></g><path d=\"M137 110V135H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "actionPrompt",
    "system": "Digest estrutural e gerado",
    "files": [
      "src/lib/ai/insight.ts"
    ],
    "nodes": [
      "Índice e sinais de estudo",
      "Tentativa de digest IA",
      "Parse e marca de origem",
      "Fallback estrutural"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ]
    ],
    "caption": "O digest gerado é filtrado em formato e mantém origem IA; falha retorna null para permitir heurística. Uma recomendação não comprova domínio. O cálculo estrutural usa limiares explícitos e também tem limites de data e referências.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Digest estrutural e gerado\"><title>Digest estrutural e gerado</title><desc>O digest gerado é filtrado em formato e mantém origem IA; falha retorna null para permitir heurística. Uma recomendação não comprova domínio. O cálculo estrutural usa limiares explícitos e também tem limites de data e referências.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Índice e sinais de estudo</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Tentativa de digest IA</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Parse e marca de origem</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Fallback estrutural</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "freshIndex",
    "system": "Tema e preferência de movimento",
    "files": [
      "src/lib/theme/ThemeProvider.tsx",
      "src/lib/ui/motion.ts",
      "src/components/settings/SettingsDialog.tsx",
      "src/main.tsx"
    ],
    "nodes": [
      "Preferência armazenada",
      "Modo ou media query",
      "Provider e atributo CSS",
      "Controles e apresentação"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "ThemeProvider resolve light/dark/system e observa a preferência do sistema; movimento manual usa chave/atributo próprios, inicializados antes do mount. A escolha CSS não garante que todas as animações de outras bibliotecas a consultem.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Tema e preferência de movimento\"><title>Tema e preferência de movimento</title><desc>ThemeProvider resolve light/dark/system e observa a preferência do sistema; movimento manual usa chave/atributo próprios, inicializados antes do mount. A escolha CSS não garante que todas as animações de outras bibliotecas a consultem.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Preferência armazenada</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Modo ou media query</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Provider e atributo CSS</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Controles e apresentação</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "freshIndex",
    "system": "Identidade gráfica tridimensional",
    "files": [
      "src/components/three/Anchor.tsx",
      "src/components/three/Armillary.tsx"
    ],
    "nodes": [
      "Suporte WebGL",
      "Reduced motion do sistema",
      "Marca ou lazy Armillary",
      "Canvas e animação"
    ],
    "edges": [
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Anchor consulta WebGL e media query para escolher a apresentação. Não lê a preferência manual de movimento; Suspense trata pending, sem capturar erro de carga/canvas. A descrição do renderer não é prova de GPU real.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Identidade gráfica tridimensional\"><title>Identidade gráfica tridimensional</title><desc>Anchor consulta WebGL e media query para escolher a apresentação. Não lê a preferência manual de movimento; Suspense trata pending, sem capturar erro de carga/canvas. A descrição do renderer não é prova de GPU real.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Suporte WebGL</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Reduced motion do sistema</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Marca ou lazy Armillary</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Canvas e animação</text></g><path d=\"M137 110V135H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "serializeIndex",
    "system": "Portabilidade e restauração do estudo",
    "files": [
      "src/lib/study/export.ts",
      "src/lib/anki/export.ts",
      "src/components/ProfileDialog.tsx"
    ],
    "nodes": [
      "Índice e bibliotecas",
      "JSON/XLSX ou cards TSV",
      "Arquivo escolhido",
      "Parse e replaceAll"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        2,
        3
      ]
    ],
    "caption": "Backup JSON inclui índice/libs; exportação Anki leva cards e tem contrato distinto. Importação passa por parseChironBackup antes de substituir o acervo. O export de preferências em SettingsDialog tem outro escopo e não deve ser confundido com backup integral.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Portabilidade e restauração do estudo\"><title>Portabilidade e restauração do estudo</title><desc>Backup JSON inclui índice/libs; exportação Anki leva cards e tem contrato distinto. Importação passa por parseChironBackup antes de substituir o acervo. O export de preferências em SettingsDialog tem outro escopo e não deve ser confundido com backup integral.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Índice e bibliotecas</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">JSON/XLSX ou cards TSV</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Arquivo escolhido</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Parse e replaceAll</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V159H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  },
  {
    "anchor": "freshIndex",
    "system": "Entrada, build e conteúdo offline",
    "files": [
      "index.html",
      "vite.config.ts",
      "tailwind.config.ts",
      "postcss.config.js",
      "public/favicon.svg"
    ],
    "nodes": [
      "HTML e entrada React",
      "Vite/SWC e PostCSS",
      "Chunks + manifest",
      "Precache do service worker"
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "caption": "O HTML fornece root e entry; a toolchain transforma código/estilos e separa livros. PWA gera manifest e precache com teto explícito de 6 MiB por arquivo. Build local não prova deploy, atualização de cliente real ou comportamento de host; o corpus didático é excluído do scanner Tailwind para não emitir classes de exemplos.",
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 250\" role=\"img\" aria-label=\"Entrada, build e conteúdo offline\"><title>Entrada, build e conteúdo offline</title><desc>O HTML fornece root e entry; a toolchain transforma código/estilos e separa livros. PWA gera manifest e precache com teto explícito de 6 MiB por arquivo. Build local não prova deploy, atualização de cliente real ou comportamento de host; o corpus didático é excluído do scanner Tailwind para não emitir classes de exemplos.</desc><defs><marker id=\"chiron-arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0 0L8 4L0 8Z\" fill=\"currentColor\"/></marker></defs><g><rect x=\"20\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"137\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">HTML e entrada React</text></g><g><rect x=\"280\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"397\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Vite/SWC e PostCSS</text></g><g><rect x=\"540\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"657\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Chunks + manifest</text></g><g><rect x=\"800\" y=\"40\" width=\"235\" height=\"70\" rx=\"8\" fill=\"none\" stroke=\"currentColor\"/><text x=\"917\" y=\"80\" text-anchor=\"middle\" fill=\"currentColor\" font-size=\"14\">Precache do service worker</text></g><path d=\"M137 110V135H397V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M397 110V159H657V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/><path d=\"M657 110V183H917V112\" fill=\"none\" stroke=\"currentColor\" marker-end=\"url(#chiron-arrow)\"/></svg>"
  }
] as const;
