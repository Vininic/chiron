export const CHIRON_EXAMPLES: Record<string, {lang:string;scope:string;purpose:string;code:string;expression:string;expected:unknown;digest:string;dependencies:string[]}[]> = {
  "Índice global, documentos e fronteira da sessão": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "freshIndex, caso 1: resultado 3; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.freshIndex().schemaVersion);\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.freshIndex().schemaVersion",
      "expected": 3,
      "digest": "3f18fa1978bd06e40b5669c13fdc44fca617e52e92551a272f2c865e399b5203",
      "dependencies": [
        "migrate"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "freshIndex, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.freshIndex().nodes.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.freshIndex().nodes.length",
      "expected": 0,
      "digest": "bf49765437dc482aeac19c84ee612c4385c6c7da9d708628e40bcfff1b47f9b8",
      "dependencies": [
        "migrate"
      ]
    }
  ],
  "Biblioteca de uma fonte e identidade do conteúdo": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "freshLib, caso 1: resultado \"s\"; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.freshLib(\"s\").sourceId);\nconst expected = \"s\";\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.freshLib(\"s\").sourceId",
      "expected": "s",
      "digest": "20553b862fe2fc99538a044ca9f067270c4a69b1088b0b0c691dadb68b4bc7fc",
      "dependencies": [
        "migrate"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "freshLib, caso 2: resultado 2; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.freshLib(\"s\").schemaVersion);\nconst expected = 2;\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.freshLib(\"s\").schemaVersion",
      "expected": 2,
      "digest": "c5ba9844f5793e4e7faa946009bfec552fdb82bfcc356b68b70e3ff36a4d0ee9",
      "dependencies": [
        "migrate"
      ]
    }
  ],
  "Migração do índice sem descartar estudo existente": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "migrateIndex, caso 1: resultado 3; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.migrateIndex({sources:[],version:99}).schemaVersion);\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.migrateIndex({sources:[],version:99}).schemaVersion",
      "expected": 3,
      "digest": "b30cc2dcc3249bb3d524215dc29c3081f66cb3e22e6776b10ca2ad35e50eed62",
      "dependencies": [
        "migrate"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "migrateIndex, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.migrateIndex(null).reviewLog.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.migrateIndex(null).reviewLog.length",
      "expected": 0,
      "digest": "a34d45d260a052b8e4dfd60c2a935f528440b0602fa1d13e23f8a1f4a8a9fb10",
      "dependencies": [
        "migrate"
      ]
    }
  ],
  "Conteúdo legado, capítulos sintetizados e limites da migração": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "migrateLib, caso 1: resultado \"s\"; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.migrateLib(null,\"s\").sourceId);\nconst expected = \"s\";\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.migrateLib(null,\"s\").sourceId",
      "expected": "s",
      "digest": "5867f69d52d5b66d9a3c6f34193d283fb6e9753469f8d55348f9e3ac298a8427",
      "dependencies": [
        "migrate"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "migrateLib, caso 2: resultado 2; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (migrate.migrateLib({version:19,sections:[]},\"s\").schemaVersion);\nconst expected = 2;\ndeepStrictEqual(actual, expected);",
      "expression": "migrate.migrateLib({version:19,sections:[]},\"s\").schemaVersion",
      "expected": 2,
      "digest": "f8324e9a196d7311ce47b769c18c3f9e789629fe46e33e64ed32d612c63fcbf5",
      "dependencies": [
        "migrate"
      ]
    }
  ],
  "Criar fonte, identidade e publicação editorial": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "addSource, caso 1: resultado 1; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.addSource(migrate.freshIndex(),{name:\"S\",kind:\"repo\"}).index.sources.length);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "service.addSource(migrate.freshIndex(),{name:\"S\",kind:\"repo\"}).index.sources.length",
      "expected": 1,
      "digest": "e11423312c1abd944c21576736195901b6a1daaf6ef601256e7df8369b583914",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "addSource, caso 2: resultado 2; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.addSource(migrate.freshIndex(),{name:\"S\",kind:\"repo\"}).index.version);\nconst expected = 2;\ndeepStrictEqual(actual, expected);",
      "expression": "service.addSource(migrate.freshIndex(),{name:\"S\",kind:\"repo\"}).index.version",
      "expected": 2,
      "digest": "6f8e48b0544282f226466aec582813d16e50111f123641cb1891f403e6de07b0",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Remover fonte e reconhecer o alcance da cascata": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "removeSource, caso 1: resultado [\"t\"]; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.removeSource({...migrate.freshIndex(),sources:[{id:\"s\"},{id:\"t\"}],nodes:[{sourceId:\"s\"},{sourceId:\"t\"}],cards:[{sourceId:\"s\"}]},\"s\").nodes.map(n=>n.sourceId));\nconst expected = [\"t\"];\ndeepStrictEqual(actual, expected);",
      "expression": "service.removeSource({...migrate.freshIndex(),sources:[{id:\"s\"},{id:\"t\"}],nodes:[{sourceId:\"s\"},{sourceId:\"t\"}],cards:[{sourceId:\"s\"}]},\"s\").nodes.map(n=>n.sourceId)",
      "expected": [
        "t"
      ],
      "digest": "6e0da18d38014ab21524bbaeef3053bea7fc1756142af7b5c6dd467e5857f70f",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "removeSource, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.removeSource({...migrate.freshIndex(),cards:[{sourceId:\"s\"}]},\"s\").cards.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "service.removeSource({...migrate.freshIndex(),cards:[{sourceId:\"s\"}]},\"s\").cards.length",
      "expected": 0,
      "digest": "f5138020a942eaa63b4a3dc809746f298d9fa3fbfd8460d816326f69bc984d0e",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Criar conceito no mapa sem fabricar domínio": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "addNode, caso 1: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.addNode(migrate.freshIndex(),{sourceId:\"s\",title:\"N\",kind:\"concept\",requires:[]}).index.nodes[0].mastery);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "service.addNode(migrate.freshIndex(),{sourceId:\"s\",title:\"N\",kind:\"concept\",requires:[]}).index.nodes[0].mastery",
      "expected": 0,
      "digest": "530ef675aa2ba53bcbfd80aa3cf3f55f299a53cdd72b8aa835dacef4c937c42c",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "addNode, caso 2: resultado 1; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.addNode(migrate.freshIndex(),{sourceId:\"s\",title:\"N\",kind:\"concept\",requires:[]}).index.nodes.length);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "service.addNode(migrate.freshIndex(),{sourceId:\"s\",title:\"N\",kind:\"concept\",requires:[]}).index.nodes.length",
      "expected": 1,
      "digest": "19d1228234a2199818bd12c7c23f5ef77ba2fcb31453d86f1d278db588bd92dc",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Atualização seletiva, ausência e limites de patch": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "updateNode, caso 1: resultado [\"new\",\"kept\"]; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.updateNode({...migrate.freshIndex(),nodes:[{id:\"n\",title:\"old\"},{id:\"other\",title:\"kept\"}]},\"n\",{title:\"new\"}).nodes.map(n=>n.title));\nconst expected = [\"new\",\"kept\"];\ndeepStrictEqual(actual, expected);",
      "expression": "service.updateNode({...migrate.freshIndex(),nodes:[{id:\"n\",title:\"old\"},{id:\"other\",title:\"kept\"}]},\"n\",{title:\"new\"}).nodes.map(n=>n.title)",
      "expected": [
        "new",
        "kept"
      ],
      "digest": "6fa9ae25c98bdd5219ef59ffd2751725a80102d3d27ea7e7a4a4cc58ed5bb3e2",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "updateNode, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.updateNode(migrate.freshIndex(),\"missing\",{title:\"new\"}).nodes.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "service.updateNode(migrate.freshIndex(),\"missing\",{title:\"new\"}).nodes.length",
      "expected": 0,
      "digest": "24eb75b7d6d3a18f4c3774924bc2a34e1ec07a3d9c30c288f5058ec3c3aadab1",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Markdown legado e blocos semânticos": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "mdToBlocks, caso 1: resultado [\"prose\",\"code\",\"prose\"]; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.mdToBlocks(\"antes\\n```js\\nx=1\\n```\\ndepois\").map(b=>b.kind));\nconst expected = [\"prose\",\"code\",\"prose\"];\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.mdToBlocks(\"antes\\n```js\\nx=1\\n```\\ndepois\").map(b=>b.kind)",
      "expected": [
        "prose",
        "code",
        "prose"
      ],
      "digest": "687bc12ea9290e3e004b410ba6c9369161b97d43d810fdaa0f5dfdf9e59a8aa6",
      "dependencies": [
        "blocks"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "mdToBlocks, caso 2: resultado [\"prose\",\"cite\"]; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.mdToBlocks(\"texto\",[{file:\"a.ts\",symbol:\"f\"}]).map(b=>b.kind));\nconst expected = [\"prose\",\"cite\"];\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.mdToBlocks(\"texto\",[{file:\"a.ts\",symbol:\"f\"}]).map(b=>b.kind)",
      "expected": [
        "prose",
        "cite"
      ],
      "digest": "f0ba5d44f6bacfd7da5cf22a1d0fa18e70a191d286935331602aacfe9fcece95",
      "dependencies": [
        "blocks"
      ]
    }
  ],
  "Densidade de explicação e contagem auditável": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "proseWordCount, caso 1: resultado 2; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.proseWordCount([{kind:\"prose\",md:\"um dois\"},{kind:\"code\",lang:\"js\",code:\"muitas palavras extras\"}]));\nconst expected = 2;\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.proseWordCount([{kind:\"prose\",md:\"um dois\"},{kind:\"code\",lang:\"js\",code:\"muitas palavras extras\"}])",
      "expected": 2,
      "digest": "e53781d29eccbc82871a2e10d8a128996a0229fc87f28ee6c3b3cc153634be5c",
      "dependencies": [
        "blocks"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "proseWordCount, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.proseWordCount([{kind:\"code\",lang:\"js\",code:\"um dois tres\"}]));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.proseWordCount([{kind:\"code\",lang:\"js\",code:\"um dois tres\"}])",
      "expected": 0,
      "digest": "8510fd0c511796f4afecce773e2646ae8ed051f819c7c62abc82cf42331d0c84",
      "dependencies": [
        "blocks"
      ]
    }
  ],
  "Cardinalidade de blocos e contrato de exemplos": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "countBlocksOfKind, caso 1: resultado 2; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.countBlocksOfKind([{kind:\"prose\"},{kind:\"code\"},{kind:\"code\"}],\"code\"));\nconst expected = 2;\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.countBlocksOfKind([{kind:\"prose\"},{kind:\"code\"},{kind:\"code\"}],\"code\")",
      "expected": 2,
      "digest": "481e74c75422fbf5b215fb42078a5033216816d2160e0bb5982d48fa8135f863",
      "dependencies": [
        "blocks"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "countBlocksOfKind, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.countBlocksOfKind([],\"prose\"));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.countBlocksOfKind([],\"prose\")",
      "expected": 0,
      "digest": "59e92a8937b85674afb82fe9ceba4577123cdcab49aa229fd30bdec6994399c8",
      "dependencies": [
        "blocks"
      ]
    }
  ],
  "Presença semântica, referências e publicação integral": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "hasBlockOfKind, caso 1: resultado true; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.hasBlockOfKind([{kind:\"cite\"}],\"cite\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.hasBlockOfKind([{kind:\"cite\"}],\"cite\")",
      "expected": true,
      "digest": "362e67790b53890c7d27c048a17c12b8d7298262e9de403c53804d2932d92206",
      "dependencies": [
        "blocks"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "hasBlockOfKind, caso 2: resultado false; funções reais, fixture sintética.",
      "code": "import * as blocks from \"@/lib/content/blocks\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (blocks.hasBlockOfKind([{kind:\"prose\"}],\"diagram\"));\nconst expected = false;\ndeepStrictEqual(actual, expected);",
      "expression": "blocks.hasBlockOfKind([{kind:\"prose\"}],\"diagram\")",
      "expected": false,
      "digest": "f67e0ad76f0bd07f7de8fc0da0523a90ba858b91a1d0f8cb48d9180209db3d19",
      "dependencies": [
        "blocks"
      ]
    }
  ],
  "Grau de lembrança e contrato do motor SM-2": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "gradeMinQuality, caso 1: resultado 3; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.gradeMinQuality(3));\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.gradeMinQuality(3)",
      "expected": 3,
      "digest": "33e00e54ee198ffe8c95f3736bb55d7514c39c00f1ee93f7a877976b97ed6568",
      "dependencies": [
        "srs"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "gradeMinQuality, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.gradeMinQuality(0));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.gradeMinQuality(0)",
      "expected": 0,
      "digest": "d8a18b6f3e697a14ba5518e5d29c0627fc9866db591f7400d63ca77277973cda",
      "dependencies": [
        "srs"
      ]
    }
  ],
  "Intervalo, facilidade e transição de revisão": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeSM2, caso 1: resultado 15; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.computeSM2(2.5,6,2,0,4,\"2026-10-08\").intervalDays);\nconst expected = 15;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.computeSM2(2.5,6,2,0,4,\"2026-10-08\").intervalDays",
      "expected": 15,
      "digest": "b0af912601ac6134dc3b50efc5288bebf86db379dc44dbf467434221362ad8ef",
      "dependencies": [
        "srs"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeSM2, caso 2: resultado 1; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.computeSM2(2.5,6,2,0,0,\"2026-10-08\").lapses);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.computeSM2(2.5,6,2,0,0,\"2026-10-08\").lapses",
      "expected": 1,
      "digest": "373a61c13645252118c1ffcf2a68fe0e4a15e319a1e1b08d4d787f51bc093860",
      "dependencies": [
        "srs"
      ]
    }
  ],
  "Vencimento inclusivo e representação da data": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "isCardDue, caso 1: resultado true; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.isCardDue({dueDate:\"2026-10-08\"},\"2026-10-08\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.isCardDue({dueDate:\"2026-10-08\"},\"2026-10-08\")",
      "expected": true,
      "digest": "fb01b5d3bec25d35d98c22ca7afdb7bedab7c227108c352106c947fd19d6a522",
      "dependencies": [
        "srs"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "isCardDue, caso 2: resultado false; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.isCardDue({dueDate:\"2026-10-09\"},\"2026-10-08\"));\nconst expected = false;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.isCardDue({dueDate:\"2026-10-09\"},\"2026-10-08\")",
      "expected": false,
      "digest": "d3132d027414308bbd1f47aff3d9b3f97b1d9a1776175ef5e669a0d81310bc58",
      "dependencies": [
        "srs"
      ]
    }
  ],
  "Contagem de revisão e conjunto de cards": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "cardsDue, caso 1: resultado 1; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.cardsDue([{dueDate:\"2026-10-07\"},{dueDate:\"2026-10-09\"}],\"2026-10-08\"));\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.cardsDue([{dueDate:\"2026-10-07\"},{dueDate:\"2026-10-09\"}],\"2026-10-08\")",
      "expected": 1,
      "digest": "28ecf50145497b6c7a096caf1324e760491b62b05cf764fb0e55812064400a6c",
      "dependencies": [
        "srs"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "cardsDue, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as srs from \"@/lib/study/srs\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (srs.cardsDue([],\"2026-10-08\"));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "srs.cardsDue([],\"2026-10-08\")",
      "expected": 0,
      "digest": "ed2043740147d128e0f8ec7a8bdcd5d66e22e8233cce45284597c7fe62c90bc2",
      "dependencies": [
        "srs"
      ]
    }
  ],
  "Botões de revisão e significado da lembrança": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "gradeForButton, caso 1: resultado 3; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.gradeForButton(\"hard\"));\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "review.gradeForButton(\"hard\")",
      "expected": 3,
      "digest": "53bf40f93f9f8782515526013c85435c124a88cb72c3e2bd1fda2fe6cb32254f",
      "dependencies": [
        "review"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "gradeForButton, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.gradeForButton(\"again\"));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "review.gradeForButton(\"again\")",
      "expected": 0,
      "digest": "05587f6e0c20d47e074df2ae749d343b199a7ec3b07fa9c2d0e32bc3a49781ed",
      "dependencies": [
        "review"
      ]
    }
  ],
  "Prever um intervalo usando o mesmo motor": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "predictIntervalDays, caso 1: resultado 15; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.predictIntervalDays({ease:2.5,intervalDays:6,reps:2,lapses:0},\"good\",\"2026-10-08\"));\nconst expected = 15;\ndeepStrictEqual(actual, expected);",
      "expression": "review.predictIntervalDays({ease:2.5,intervalDays:6,reps:2,lapses:0},\"good\",\"2026-10-08\")",
      "expected": 15,
      "digest": "d9af14ec9bee354a78f8ee582b54fb0c40841b58909d0edefdfbbdb6bfb0088a",
      "dependencies": [
        "review"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "predictIntervalDays, caso 2: resultado 1; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.predictIntervalDays({ease:2.5,intervalDays:0,reps:0,lapses:0},\"easy\",\"2026-10-08\"));\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "review.predictIntervalDays({ease:2.5,intervalDays:0,reps:0,lapses:0},\"easy\",\"2026-10-08\")",
      "expected": 1,
      "digest": "9f9172b60f54e937de5694c14de72d064054a8639c8a97d81675fd850c0661a8",
      "dependencies": [
        "review"
      ]
    }
  ],
  "Apresentação compacta de dias, meses e anos": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "formatInterval, caso 1: resultado \"2m\"; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.formatInterval(60));\nconst expected = \"2m\";\ndeepStrictEqual(actual, expected);",
      "expression": "review.formatInterval(60)",
      "expected": "2m",
      "digest": "778b2af404b360fafeb65f27d75d23450b2424828a0c4f0aed0b703ea1c792f6",
      "dependencies": [
        "review"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "formatInterval, caso 2: resultado \"<1d\"; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.formatInterval(0));\nconst expected = \"<1d\";\ndeepStrictEqual(actual, expected);",
      "expression": "review.formatInterval(0)",
      "expected": "<1d",
      "digest": "329573aba880fb0d227dca0dd52c3e6eebf76e49c52d07f84fb7499f1c122289",
      "dependencies": [
        "review"
      ]
    }
  ],
  "Retenção observada e alcance da medida": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeRetention, caso 1: resultado 0.75; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.computeRetention([0,3,4,5]));\nconst expected = 0.75;\ndeepStrictEqual(actual, expected);",
      "expression": "review.computeRetention([0,3,4,5])",
      "expected": 0.75,
      "digest": "a63ba1d8c34970dc0c6705031609577259a005d00601e1db5fbfdc9a01e532bf",
      "dependencies": [
        "review"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeRetention, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as review from \"@/lib/study/review\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (review.computeRetention([]));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "review.computeRetention([])",
      "expected": 0,
      "digest": "68da09db5b592e596e606d1272567c5165c07354fd6e91c5b3284ba053000eb2",
      "dependencies": [
        "review"
      ]
    }
  ],
  "Seleção de exercícios, filtros e acaso": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "selectExercises, caso 1: resultado [\"a\"]; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.selectExercises([{id:\"a\",sourceId:\"s\"},{id:\"b\",sourceId:\"t\"}],{sourceId:\"s\",count:3}).map(e=>e.id));\nconst expected = [\"a\"];\ndeepStrictEqual(actual, expected);",
      "expression": "practice.selectExercises([{id:\"a\",sourceId:\"s\"},{id:\"b\",sourceId:\"t\"}],{sourceId:\"s\",count:3}).map(e=>e.id)",
      "expected": [
        "a"
      ],
      "digest": "d74be3e43ef0b43ba24cc76f38b198ecf76938e5ac3c9f3c9789aa349fe302a8",
      "dependencies": [
        "practice"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "selectExercises, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.selectExercises([],{count:4}).length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.selectExercises([],{count:4}).length",
      "expected": 0,
      "digest": "d122b8d8cc14963152b6bf2a64b7d558c801d71aaa0f9f6ae2b3bc54520a872d",
      "dependencies": [
        "practice"
      ]
    }
  ],
  "Correção exata e resposta estruturada": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "scoreMultipleChoice, caso 1: resultado 4; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreMultipleChoice({answerKeyMd:\"B\",points:4},\"B\"));\nconst expected = 4;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.scoreMultipleChoice({answerKeyMd:\"B\",points:4},\"B\")",
      "expected": 4,
      "digest": "41bbfd1bf93069c10a97c050ed25b11c63bb5612a4fa237b18592981a636bff1",
      "dependencies": [
        "practice"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "scoreMultipleChoice, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreMultipleChoice({answerKeyMd:\"B\",points:4},\"A\"));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.scoreMultipleChoice({answerKeyMd:\"B\",points:4},\"A\")",
      "expected": 0,
      "digest": "637087be7c81f8f82995b8104460640044c677429a804efd9ab77391cf15f740",
      "dependencies": [
        "practice"
      ]
    }
  ],
  "Autoavaliação explícita e arredondamento": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "scoreSelfGrade, caso 1: resultado 2; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreSelfGrade({points:3},\"partial\"));\nconst expected = 2;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.scoreSelfGrade({points:3},\"partial\")",
      "expected": 2,
      "digest": "874d5c9b62ca69db41b3ccbde2cf105ba091c300ece32c5a7f32c6ce64f79d9f",
      "dependencies": [
        "practice"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "scoreSelfGrade, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreSelfGrade({points:3},\"incorrect\"));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.scoreSelfGrade({points:3},\"incorrect\")",
      "expected": 0,
      "digest": "71e64a0f700d1535e69c8f80b5eb156a084f60b42b709df4b4534f2e888f3190",
      "dependencies": [
        "practice"
      ]
    }
  ],
  "Fração de rubrica e validação da resposta do tutor": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "scoreRubricFraction, caso 1: resultado 5; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreRubricFraction({points:5},2));\nconst expected = 5;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.scoreRubricFraction({points:5},2)",
      "expected": 5,
      "digest": "84bc94e4f401d0f4858cf999924d7cab05da4b05453c017742f782a4d7bc940f",
      "dependencies": [
        "practice"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "scoreRubricFraction, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as practice from \"@/lib/study/practice\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (practice.scoreRubricFraction({points:5},-1));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "practice.scoreRubricFraction({points:5},-1)",
      "expected": 0,
      "digest": "aa28742aa8facd2f76b01d9615e8b81a378e999f083ba342cdee2201787de815",
      "dependencies": [
        "practice"
      ]
    }
  ],
  "Pontos do exercício e multiplicador de nível": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computePointsForExercise, caso 1: resultado 9; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.computePointsForExercise(\"advanced\",3));\nconst expected = 9;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.computePointsForExercise(\"advanced\",3)",
      "expected": 9,
      "digest": "64448585681b4858afeef865d8ef610219721ba370a801209f5039b3e4b0c02f",
      "dependencies": [
        "scoring"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computePointsForExercise, caso 2: resultado 3; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.computePointsForExercise(\"beginner\",3));\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.computePointsForExercise(\"beginner\",3)",
      "expected": 3,
      "digest": "46a20be12a09f08e0301b37114e6ad11ef603b0d57ce3f06dc5efffa60e9ecc6",
      "dependencies": [
        "scoring"
      ]
    }
  ],
  "Domínio agregado e denominador dos conceitos": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeMasteryWeight, caso 1: resultado 0.5; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.computeMasteryWeight([{mastery:4},{mastery:0}]));\nconst expected = 0.5;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.computeMasteryWeight([{mastery:4},{mastery:0}])",
      "expected": 0.5,
      "digest": "555bb9e62bca47184e8db51904dbf578e3f3a06ea63dcbc0898209812ad9d3f9",
      "dependencies": [
        "scoring"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeMasteryWeight, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.computeMasteryWeight([]));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.computeMasteryWeight([])",
      "expected": 0,
      "digest": "5330ba476f22d6541f7cf2500d1fdc9f1239a5a7138029acb9fa778a709c2715",
      "dependencies": [
        "scoring"
      ]
    }
  ],
  "Sequência diária, data explícita e repetição de chamadas": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "updateStreak, caso 1: resultado 4; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.updateStreak({total:0,streak:3,lastStudyDate:\"2026-10-07\"},\"2026-10-08\").streak);\nconst expected = 4;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.updateStreak({total:0,streak:3,lastStudyDate:\"2026-10-07\"},\"2026-10-08\").streak",
      "expected": 4,
      "digest": "44046981cdfab8b56e5923c7f11a2298b972ccd2db4b0ad2108f83222a1f7b50",
      "dependencies": [
        "scoring"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "updateStreak, caso 2: resultado 3; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.updateStreak({total:0,streak:3,lastStudyDate:\"2026-10-08\"},\"2026-10-08\").streak);\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.updateStreak({total:0,streak:3,lastStudyDate:\"2026-10-08\"},\"2026-10-08\").streak",
      "expected": 3,
      "digest": "af1a4512aa06d539a6bc62bc2adfbc924bf8b770d8670f5968540eef7cd4aff0",
      "dependencies": [
        "scoring"
      ]
    }
  ],
  "Acumular pontos sem perder a sequência diária": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "addPoints, caso 1: resultado 10; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.addPoints({total:7,streak:0,lastStudyDate:null},3,\"2026-10-08\").total);\nconst expected = 10;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.addPoints({total:7,streak:0,lastStudyDate:null},3,\"2026-10-08\").total",
      "expected": 10,
      "digest": "ec124194b1a64a1919987f78cbd33ce540e3bc7aa23923df400e0137b38e4068",
      "dependencies": [
        "scoring"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "addPoints, caso 2: resultado 1; funções reais, fixture sintética.",
      "code": "import * as scoring from \"@/lib/study/scoring\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (scoring.addPoints({total:7,streak:0,lastStudyDate:null},3,\"2026-10-08\").streak);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "scoring.addPoints({total:7,streak:0,lastStudyDate:null},3,\"2026-10-08\").streak",
      "expected": 1,
      "digest": "c792b1a93b2429e3b619bdd55677f14bc7a7fce7c79e1dbbd8c64a39904c3d48",
      "dependencies": [
        "scoring"
      ]
    }
  ],
  "Conceitos a retomar e vínculo com a fonte": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeWeakestNodes, caso 1: resultado [\"b\"]; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeWeakestNodes({...migrate.freshIndex(),nodes:[{id:\"a\",sourceId:\"s\",mastery:4},{id:\"b\",sourceId:\"s\",mastery:1}]}).map(x=>x.node.id));\nconst expected = [\"b\"];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.computeWeakestNodes({...migrate.freshIndex(),nodes:[{id:\"a\",sourceId:\"s\",mastery:4},{id:\"b\",sourceId:\"s\",mastery:1}]}).map(x=>x.node.id)",
      "expected": [
        "b"
      ],
      "digest": "d2b6c5032ddd45ab14cea6476c0faefb85be298cbb59faaf2f8135051175b3db",
      "dependencies": [
        "migrate",
        "dashboard"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeWeakestNodes, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeWeakestNodes(migrate.freshIndex()).length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.computeWeakestNodes(migrate.freshIndex()).length",
      "expected": 0,
      "digest": "7e39573ac8659e0b0cfd2fcc3ad4cfcb89e9f9f19d902e29b9e73b01a3dc5b64",
      "dependencies": [
        "migrate",
        "dashboard"
      ]
    }
  ],
  "Distribuição de domínio e integridade da escala": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeMasteryDistribution, caso 1: resultado [1,0,0,0,2]; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeMasteryDistribution({...migrate.freshIndex(),nodes:[{mastery:0},{mastery:4},{mastery:4}]}));\nconst expected = [1,0,0,0,2];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.computeMasteryDistribution({...migrate.freshIndex(),nodes:[{mastery:0},{mastery:4},{mastery:4}]})",
      "expected": [
        1,
        0,
        0,
        0,
        2
      ],
      "digest": "34eba9e423d2860621f269786e363da6a7824b5ac58b95af467ced04b3b7f3f9",
      "dependencies": [
        "migrate",
        "dashboard"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeMasteryDistribution, caso 2: resultado [0,0,0,0,0]; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeMasteryDistribution(migrate.freshIndex()));\nconst expected = [0,0,0,0,0];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.computeMasteryDistribution(migrate.freshIndex())",
      "expected": [
        0,
        0,
        0,
        0,
        0
      ],
      "digest": "a7717d9377e0f4bbf6102b07d9de6baab0732d8384aa99af0d8f6d33615aebdc",
      "dependencies": [
        "migrate",
        "dashboard"
      ]
    }
  ],
  "Orçamento de sessão e heurística de divisão": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "planSessionBlocks, caso 1: resultado [8,7,5]; funções reais, fixture sintética.",
      "code": "import * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.planSessionBlocks(20,20).map(b=>b.estMin));\nconst expected = [8,7,5];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.planSessionBlocks(20,20).map(b=>b.estMin)",
      "expected": [
        8,
        7,
        5
      ],
      "digest": "0857a6bbc7344c0cce6eb63be757a738eda1788b5e9b4c2153d1b12c5843faa7",
      "dependencies": [
        "dashboard"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "planSessionBlocks, caso 2: resultado [\"read\",\"exercise\"]; funções reais, fixture sintética.",
      "code": "import * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.planSessionBlocks(20,0).map(b=>b.kind));\nconst expected = [\"read\",\"exercise\"];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.planSessionBlocks(20,0).map(b=>b.kind)",
      "expected": [
        "read",
        "exercise"
      ],
      "digest": "c71b13457aa004f5f41d00d15d49c6a81e02ac41b90b6f749d7fcde0d55e773f",
      "dependencies": [
        "dashboard"
      ]
    }
  ],
  "Vencimentos futuros e recorte do calendário": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeUpcomingDue, caso 1: resultado [0,0,0]; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeUpcomingDue(migrate.freshIndex(),3));\nconst expected = [0,0,0];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.computeUpcomingDue(migrate.freshIndex(),3)",
      "expected": [
        0,
        0,
        0
      ],
      "digest": "25e087f9a3b9d15d719ec59a329de568c17dc6ac346847b61baa5a70c9febd70",
      "dependencies": [
        "migrate",
        "dashboard"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "computeUpcomingDue, caso 2: resultado []; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as dashboard from \"@/lib/study/dashboard\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (dashboard.computeUpcomingDue(migrate.freshIndex(),0));\nconst expected = [];\ndeepStrictEqual(actual, expected);",
      "expression": "dashboard.computeUpcomingDue(migrate.freshIndex(),0)",
      "expected": [],
      "digest": "831782e1761a0df243c9b61973e4424a290303df598368c3af1122133475cbc2",
      "dependencies": [
        "migrate",
        "dashboard"
      ]
    }
  ],
  "Identidade de uma célula e estruturas de busca": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "cellKey, caso 1: resultado \"1,2\"; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.cellKey({x:1,y:2}));\nconst expected = \"1,2\";\ndeepStrictEqual(actual, expected);",
      "expression": "grid.cellKey({x:1,y:2})",
      "expected": "1,2",
      "digest": "85fb07a64cd0ae40d0e62e9b05785ee3fd18a42a64bd0e3f7df4ec305ca9175e",
      "dependencies": [
        "grid"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "cellKey, caso 2: resultado \"2,1\"; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.cellKey({x:2,y:1}));\nconst expected = \"2,1\";\ndeepStrictEqual(actual, expected);",
      "expression": "grid.cellKey({x:2,y:1})",
      "expected": "2,1",
      "digest": "b984f6ed6ef69451bf0ec1455f737818b2c990e56ed3c53866e2fc6483d9182f",
      "dependencies": [
        "grid"
      ]
    }
  ],
  "Vizinhança ortogonal e fronteiras do tabuleiro": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "neighbors, caso 1: resultado [{\"x\":1,\"y\":0},{\"x\":0,\"y\":1}]; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.neighbors({x:0,y:0},2,2));\nconst expected = [{\"x\":1,\"y\":0},{\"x\":0,\"y\":1}];\ndeepStrictEqual(actual, expected);",
      "expression": "grid.neighbors({x:0,y:0},2,2)",
      "expected": [
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        }
      ],
      "digest": "7fba4d6b1d37f6661261c58544aa866060d218bf3bfd68b136eb31ad9f6fab10",
      "dependencies": [
        "grid"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "neighbors, caso 2: resultado []; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.neighbors({x:0,y:0},1,1));\nconst expected = [];\ndeepStrictEqual(actual, expected);",
      "expression": "grid.neighbors({x:0,y:0},1,1)",
      "expected": [],
      "digest": "dcd083ba29e376d11116b6d9d418e07a7c93139553fa3fa46493c12330975543",
      "dependencies": [
        "grid"
      ]
    }
  ],
  "Busca em largura, pais e caminho mínimo": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "bfs, caso 1: resultado [{\"x\":0,\"y\":0},{\"x\":1,\"y\":0}]; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.bfs({x:0,y:0},{x:1,y:0},2,1).path);\nconst expected = [{\"x\":0,\"y\":0},{\"x\":1,\"y\":0}];\ndeepStrictEqual(actual, expected);",
      "expression": "grid.bfs({x:0,y:0},{x:1,y:0},2,1).path",
      "expected": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        }
      ],
      "digest": "f7dd1a31f53174a39f978fc2bc7fe2632fde64531a1518d2db72a921d03bcf7e",
      "dependencies": [
        "grid"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "bfs, caso 2: resultado false; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.bfs({x:0,y:0},{x:1,y:0},2,1,[{x:1,y:0}]).reachable);\nconst expected = false;\ndeepStrictEqual(actual, expected);",
      "expression": "grid.bfs({x:0,y:0},{x:1,y:0},2,1,[{x:1,y:0}]).reachable",
      "expected": false,
      "digest": "d6132a7af306f1d0a7d52b822b026100cf975f1b16743b0bcebf70fbe370e069",
      "dependencies": [
        "grid"
      ]
    }
  ],
  "Verificar um caminho e reconhecer o que falta": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "pathIsValid, caso 1: resultado false; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.pathIsValid([{x:0,y:0},{x:1,y:1}],2,2));\nconst expected = false;\ndeepStrictEqual(actual, expected);",
      "expression": "grid.pathIsValid([{x:0,y:0},{x:1,y:1}],2,2)",
      "expected": false,
      "digest": "cdf6595890041b2d04d6d05df61b437eac7db99831546314c5c66c4e4b904c75",
      "dependencies": [
        "grid"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "pathIsValid, caso 2: resultado true; funções reais, fixture sintética.",
      "code": "import * as grid from \"@/lib/labs/grid\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (grid.pathIsValid([{x:0,y:0},{x:1,y:0}],2,2));\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "grid.pathIsValid([{x:0,y:0},{x:1,y:0}],2,2)",
      "expected": true,
      "digest": "32184d7664aa8e30dd2af0cef6b5de2d8062663026554518c3d51843b3030d92",
      "dependencies": [
        "grid"
      ]
    }
  ],
  "Contrato de autoria de uma camada de Lab": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "validateLab, caso 1: resultado [\"layers\"]; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.validateLab({layers:[]}).map(x=>x.path));\nconst expected = [\"layers\"];\ndeepStrictEqual(actual, expected);",
      "expression": "engine.validateLab({layers:[]}).map(x=>x.path)",
      "expected": [
        "layers"
      ],
      "digest": "8c66ae848d5299946c9124bf068fc9771173fb238f2b88f323466b9109fda7c2",
      "dependencies": [
        "engine"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "validateLab, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.validateLab({layers:[{id:\"l\",question:\"Q\",contract:\"C\",invariants:[{id:\"i\"}],mutations:[]}]}).length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "engine.validateLab({layers:[{id:\"l\",question:\"Q\",contract:\"C\",invariants:[{id:\"i\"}],mutations:[]}]}).length",
      "expected": 0,
      "digest": "9476aa897b245195613697f02f05627fa7ad15d0a8df53fa679286fe6a978a13",
      "dependencies": [
        "engine"
      ]
    }
  ],
  "Seleção de mutações e ordem de autoria": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "activeMutations, caso 1: resultado [\"b\"]; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.activeMutations({mutations:[{id:\"a\"},{id:\"b\"}]},[\"b\",\"b\"]).map(x=>x.id));\nconst expected = [\"b\"];\ndeepStrictEqual(actual, expected);",
      "expression": "engine.activeMutations({mutations:[{id:\"a\"},{id:\"b\"}]},[\"b\",\"b\"]).map(x=>x.id)",
      "expected": [
        "b"
      ],
      "digest": "05b565278dd6ef12805214c04c6bf027e6c10a85e677ccc4180b62fedc740843",
      "dependencies": [
        "engine"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "activeMutations, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.activeMutations({mutations:[{id:\"a\"}]},[\"missing\"]).length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "engine.activeMutations({mutations:[{id:\"a\"}]},[\"missing\"]).length",
      "expected": 0,
      "digest": "b68761e649858cb6583b9ccfe883dda3d717ce1456aa733062008f0d822f376e",
      "dependencies": [
        "engine"
      ]
    }
  ],
  "Invariante declarada e evidência de uma quebra": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "invariantIsBroken, caso 1: resultado true; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.invariantIsBroken(\"stock\",[{breaks:[\"stock\"]}]));\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "engine.invariantIsBroken(\"stock\",[{breaks:[\"stock\"]}])",
      "expected": true,
      "digest": "5f2e7294bd32941fc37c4ed61ac4583649e74c2961097027183bdbfbdcff4f89",
      "dependencies": [
        "engine"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "invariantIsBroken, caso 2: resultado false; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.invariantIsBroken(\"stock\",[{breaks:[\"other\"]}]));\nconst expected = false;\ndeepStrictEqual(actual, expected);",
      "expression": "engine.invariantIsBroken(\"stock\",[{breaks:[\"other\"]}])",
      "expected": false,
      "digest": "6eb6eed0565ea65a427a997805e7249c32435c76d45242d8f4f2e69478b23f41",
      "dependencies": [
        "engine"
      ]
    }
  ],
  "Progresso de camadas e significado de conclusão": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "labCompletion, caso 1: resultado 50; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.labCompletion({layers:[{id:\"a\"},{id:\"b\"}]},[\"a\",\"a\"]));\nconst expected = 50;\ndeepStrictEqual(actual, expected);",
      "expression": "engine.labCompletion({layers:[{id:\"a\"},{id:\"b\"}]},[\"a\",\"a\"])",
      "expected": 50,
      "digest": "d1588d517247a927272d3cbfe6de646645fa30e7fff2399243c27a65e04210bf",
      "dependencies": [
        "engine"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "labCompletion, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as engine from \"@/lib/labs/engine\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (engine.labCompletion({layers:[]},[]));\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "engine.labCompletion({layers:[]},[])",
      "expected": 0,
      "digest": "7ca6cfa9a88901fd92033c141c365a0e89c22cbc244823ec3d92fadd3e1a2354",
      "dependencies": [
        "engine"
      ]
    }
  ],
  "Propostas do tutor e limite do parser de ações": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "parseActions, caso 1: resultado 0; funções reais, fixture sintética.",
      "code": "import * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.parseActions(\"Prosa\\n```actions\\n[{\\\"type\\\":\\\"unknown\\\"}]\\n```\").actions.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "actions.parseActions(\"Prosa\\n```actions\\n[{\\\"type\\\":\\\"unknown\\\"}]\\n```\").actions.length",
      "expected": 0,
      "digest": "c3bf16eb244adb2bd9738d32e74506c44ef247108d416ef1eb3e0a6efacfe5ac",
      "dependencies": [
        "actions"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "parseActions, caso 2: resultado \"Somente prosa\"; funções reais, fixture sintética.",
      "code": "import * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.parseActions(\"Somente prosa\").prose);\nconst expected = \"Somente prosa\";\ndeepStrictEqual(actual, expected);",
      "expression": "actions.parseActions(\"Somente prosa\").prose",
      "expected": "Somente prosa",
      "digest": "d0ff13faec63910634791423fa1370d6c2bc6a84290325f609ddae30ab10e9ac",
      "dependencies": [
        "actions"
      ]
    }
  ],
  "Descrever uma proposta antes de aplicá-la": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "describeAction, caso 1: resultado \"Propor uma sessão de estudo\"; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.describeAction(migrate.freshIndex(),{type:\"plan_session\",budgetMin:20,blocks:[]}));\nconst expected = \"Propor uma sessão de estudo\";\ndeepStrictEqual(actual, expected);",
      "expression": "actions.describeAction(migrate.freshIndex(),{type:\"plan_session\",budgetMin:20,blocks:[]})",
      "expected": "Propor uma sessão de estudo",
      "digest": "1e152f4c5fc8fe19936f62664347e65df3dc5bc6a40f852effe9d973cb501e96",
      "dependencies": [
        "migrate",
        "actions"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "describeAction, caso 2: resultado \"Ajustar domínio de Filas para 2/4\"; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.describeAction({...migrate.freshIndex(),nodes:[{id:\"n\",title:\"Filas\"}]},{type:\"adjust_mastery\",nodeId:\"n\",mastery:2}));\nconst expected = \"Ajustar domínio de Filas para 2/4\";\ndeepStrictEqual(actual, expected);",
      "expression": "actions.describeAction({...migrate.freshIndex(),nodes:[{id:\"n\",title:\"Filas\"}]},{type:\"adjust_mastery\",nodeId:\"n\",mastery:2})",
      "expected": "Ajustar domínio de Filas para 2/4",
      "digest": "9286983373ef2f3c2fdb29df50e4b4c959b82b897da31f1f0ca5b98f9f679b9b",
      "dependencies": [
        "migrate",
        "actions"
      ]
    }
  ],
  "Protocolo textual de propostas do Aetheris": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "actionPrompt, caso 1: resultado true; funções reais, fixture sintética.",
      "code": "import * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.actionPrompt().includes(\"generate_lab\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "actions.actionPrompt().includes(\"generate_lab\")",
      "expected": true,
      "digest": "d3ba97330790ae505c87d25db00bfc963478c406b0c9b2a47b72099db56c3749",
      "dependencies": [
        "actions"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "actionPrompt, caso 2: resultado true; funções reais, fixture sintética.",
      "code": "import * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.actionPrompt().includes(\"```actions```\"));\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "actions.actionPrompt().includes(\"```actions```\")",
      "expected": true,
      "digest": "da859551884c18230402725989486001a4dec19cb27591de57dd202d566e8404",
      "dependencies": [
        "actions"
      ]
    }
  ],
  "Aplicar uma proposta e distinguir efeitos de notas": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "applyAction, caso 1: resultado \"A fonte não possui uma apostila editável.\"; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.applyAction(migrate.freshIndex(),{},{type:\"add_exercise\",sourceId:\"missing\",nodeId:\"n\"}).note);\nconst expected = \"A fonte não possui uma apostila editável.\";\ndeepStrictEqual(actual, expected);",
      "expression": "actions.applyAction(migrate.freshIndex(),{},{type:\"add_exercise\",sourceId:\"missing\",nodeId:\"n\"}).note",
      "expected": "A fonte não possui uma apostila editável.",
      "digest": "a15b56138418e19dd0782e5feb66d6b8bf5a2fd818b569f28186f12a9587ced2",
      "dependencies": [
        "migrate",
        "actions"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "applyAction, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as actions from \"@/lib/ai/actions\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (actions.applyAction(migrate.freshIndex(),{},{type:\"ingest_source\",sourceId:\"s\"}).index.sources.length);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "actions.applyAction(migrate.freshIndex(),{},{type:\"ingest_source\",sourceId:\"s\"}).index.sources.length",
      "expected": 0,
      "digest": "c5433c04aae18a7ff5267e0f5ce98f676921df185bbf34c54be259dcb288408d",
      "dependencies": [
        "migrate",
        "actions"
      ]
    }
  ],
  "Tentativa, crédito e responsabilidade da gravação": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "recordAttempt, caso 1: resultado 3; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.recordAttempt(migrate.freshIndex(),{exerciseId:\"e\",nodeId:\"n\",answerMd:\"A\",scoreAwarded:3}).index.score.total);\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "service.recordAttempt(migrate.freshIndex(),{exerciseId:\"e\",nodeId:\"n\",answerMd:\"A\",scoreAwarded:3}).index.score.total",
      "expected": 3,
      "digest": "e1ac71a2faa5c9998f29c94b58d09347e5b165ab281809801c95f02e6ad87435",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "recordAttempt, caso 2: resultado 1; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.recordAttempt(migrate.freshIndex(),{exerciseId:\"e\",nodeId:\"n\",answerMd:\"A\",scoreAwarded:3}).index.attempts.length);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "service.recordAttempt(migrate.freshIndex(),{exerciseId:\"e\",nodeId:\"n\",answerMd:\"A\",scoreAwarded:3}).index.attempts.length",
      "expected": 1,
      "digest": "864f5ecf8f77b7491d5bebe30fba5783198a3762c73d0ca488b8c1a6eb5f064b",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Refazer uma camada e preservar o histórico pertinente": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "recordLabLayer, caso 1: resultado 1; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.recordLabLayer({...migrate.freshIndex(),labProgress:[{labId:\"a\",layerId:\"l\",predictedCorrect:false}]},{labId:\"a\",layerId:\"l\",predictedCorrect:true}).labProgress.length);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "service.recordLabLayer({...migrate.freshIndex(),labProgress:[{labId:\"a\",layerId:\"l\",predictedCorrect:false}]},{labId:\"a\",layerId:\"l\",predictedCorrect:true}).labProgress.length",
      "expected": 1,
      "digest": "d35ac14146e426e98423900c3277c1fd874a8fbd226d8bd77973f4f0c7fdb0f2",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "recordLabLayer, caso 2: resultado true; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.recordLabLayer({...migrate.freshIndex(),labProgress:[{labId:\"a\",layerId:\"l\",predictedCorrect:false}]},{labId:\"a\",layerId:\"l\",predictedCorrect:true}).labProgress[0].predictedCorrect);\nconst expected = true;\ndeepStrictEqual(actual, expected);",
      "expression": "service.recordLabLayer({...migrate.freshIndex(),labProgress:[{labId:\"a\",layerId:\"l\",predictedCorrect:false}]},{labId:\"a\",layerId:\"l\",predictedCorrect:true}).labProgress[0].predictedCorrect",
      "expected": true,
      "digest": "a30bf61dafc7550420385b76276d9f43aeec0b507a050bc4c42a9541780a66d6",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Criar uma sessão a partir de blocos explícitos": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "createSession, caso 1: resultado 25; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.createSession(migrate.freshIndex(),25,[]).session.budgetMin);\nconst expected = 25;\ndeepStrictEqual(actual, expected);",
      "expression": "service.createSession(migrate.freshIndex(),25,[]).session.budgetMin",
      "expected": 25,
      "digest": "5a426a4943cfcb66eec6a12af478278785fae43cbef4f73e70e818dbb3ce7d94",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "createSession, caso 2: resultado 1; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (service.createSession(migrate.freshIndex(),25,[]).index.sessions.length);\nconst expected = 1;\ndeepStrictEqual(actual, expected);",
      "expression": "service.createSession(migrate.freshIndex(),25,[]).index.sessions.length",
      "expected": 1,
      "digest": "e9020ae6cb824d3b285fef0d7c2c86dde9119836f40a05a9bd640a61c6d2b5c2",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ],
  "Como estender o Chiron com contratos e persistência": [
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "serializeIndex, caso 1: resultado 3; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (JSON.parse(service.serializeIndex(migrate.freshIndex())).schemaVersion);\nconst expected = 3;\ndeepStrictEqual(actual, expected);",
      "expression": "JSON.parse(service.serializeIndex(migrate.freshIndex())).schemaVersion",
      "expected": 3,
      "digest": "952117ab9942312507ca370e90074c3d0748fccc9a5824d76ad4cfb2f41a5990",
      "dependencies": [
        "migrate",
        "service"
      ]
    },
    {
      "lang": "javascript",
      "scope": "repository-native",
      "purpose": "serializeIndex, caso 2: resultado 0; funções reais, fixture sintética.",
      "code": "import * as migrate from \"@/lib/study/migrate\";\nimport * as service from \"@/lib/study/service\";\nimport { deepStrictEqual } from \"node:assert\";\nconst actual = (JSON.parse(service.serializeIndex(migrate.freshIndex())).score.total);\nconst expected = 0;\ndeepStrictEqual(actual, expected);",
      "expression": "JSON.parse(service.serializeIndex(migrate.freshIndex())).score.total",
      "expected": 0,
      "digest": "dc182bde501409dba45f604077514cabbd3333f09dd23c57c56689ed0b33a4ef",
      "dependencies": [
        "migrate",
        "service"
      ]
    }
  ]
};
