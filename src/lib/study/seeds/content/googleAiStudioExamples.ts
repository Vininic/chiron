export interface GoogleAiStudioExample {lang:string;scope:"local-rule"|"local-transform"|"model";purpose:string;code:string}
export const GOOGLE_AI_STUDIO_EXAMPLES: Record<string,[GoogleAiStudioExample,GoogleAiStudioExample]> = {
  "Playground, Build e produto da experiência": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / fixture: persistedReceipt é a lacuna. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"source\",\n    \"preview\",\n    \"persistedReceipt\"\n  ],\n  \"available\": [\n    \"source\",\n    \"preview\"\n  ]\n};\nconst expected = [\n  \"persistedReceipt\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.available.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / contraprova: aprovar a aplicação quando existe preview; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"source\",\n    \"preview\",\n    \"persistedReceipt\"\n  ],\n  \"available\": [\n    \"source\",\n    \"preview\"\n  ]\n};\nconst expected = [\n  \"persistedReceipt\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.available.includes(k));\nconst mutant = x=>x.available.includes(\"preview\")?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Projeto, chave e identidade da execução": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.2 / fixture: projectId é a diferença conhecida. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"projectId\": \"p-test\",\n    \"modelId\": \"m-eval\"\n  },\n  \"b\": {\n    \"projectId\": \"p-live\",\n    \"modelId\": \"m-eval\"\n  }\n};\nconst expected = [\n  \"projectId\"\n];\nconst evaluate = x=>[\"projectId\",\"modelId\"].filter(k=>x.a[k]!==x.b[k]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.2 / contraprova: comparar só modelId; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"projectId\": \"p-test\",\n    \"modelId\": \"m-eval\"\n  },\n  \"b\": {\n    \"projectId\": \"p-live\",\n    \"modelId\": \"m-eval\"\n  }\n};\nconst expected = [\n  \"projectId\"\n];\nconst evaluate = x=>[\"projectId\",\"modelId\"].filter(k=>x.a[k]!==x.b[k]);\nconst mutant = x=>x.a.modelId===x.b.modelId?[]:[\"modelId\"];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Critério de resposta e conjunto de casos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.3 / fixture: unknownItem é a lacuna. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"knownItem\",\n    \"missingQty\",\n    \"unknownItem\"\n  ],\n  \"covered\": [\n    \"knownItem\",\n    \"missingQty\"\n  ]\n};\nconst expected = [\n  \"unknownItem\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.covered.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.3 / contraprova: aceitar qualquer dataset com pelo menos dois casos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"knownItem\",\n    \"missingQty\",\n    \"unknownItem\"\n  ],\n  \"covered\": [\n    \"knownItem\",\n    \"missingQty\"\n  ]\n};\nconst expected = [\n  \"unknownItem\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.covered.includes(k));\nconst mutant = x=>x.covered.length>=2?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Exportação Get code e configuração preservada": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / fixture: responseSchema está ausente. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requiredConfig\": [\n    \"model\",\n    \"instruction\",\n    \"responseSchema\"\n  ],\n  \"exportedConfig\": [\n    \"model\",\n    \"instruction\"\n  ]\n};\nconst expected = [\n  \"responseSchema\"\n];\nconst evaluate = x=>x.requiredConfig.filter(k=>!x.exportedConfig.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / contraprova: aceitar equivalência se model estiver presente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requiredConfig\": [\n    \"model\",\n    \"instruction\",\n    \"responseSchema\"\n  ],\n  \"exportedConfig\": [\n    \"model\",\n    \"instruction\"\n  ]\n};\nconst expected = [\n  \"responseSchema\"\n];\nconst evaluate = x=>x.requiredConfig.filter(k=>!x.exportedConfig.includes(k));\nconst mutant = x=>x.exportedConfig.includes(\"model\")?[]:x.requiredConfig;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "System instruction e dado do usuário": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.1 / fixture: os papéis são system e user. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"instruction\": \"propor sem executar\",\n  \"input\": \"reservar A\"\n};\nconst expected = [\n  {\n    \"role\": \"system\",\n    \"text\": \"propor sem executar\"\n  },\n  {\n    \"role\": \"user\",\n    \"text\": \"reservar A\"\n  }\n];\nconst evaluate = x=>[{role:\"system\",text:x.instruction},{role:\"user\",text:x.input}];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.1 / contraprova: colocar pedido também como system; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"instruction\": \"propor sem executar\",\n  \"input\": \"reservar A\"\n};\nconst expected = [\n  {\n    \"role\": \"system\",\n    \"text\": \"propor sem executar\"\n  },\n  {\n    \"role\": \"user\",\n    \"text\": \"reservar A\"\n  }\n];\nconst evaluate = x=>[{role:\"system\",text:x.instruction},{role:\"user\",text:x.input}];\nconst mutant = x=>[{role:\"system\",text:x.instruction},{role:\"system\",text:x.input}];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Few-shot e rótulo fora do exemplo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.2 / fixture: e2 é o vazamento. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"fewShotIds\": [\n    \"e1\",\n    \"e2\"\n  ],\n  \"evaluationIds\": [\n    \"e2\",\n    \"e3\"\n  ]\n};\nconst expected = [\n  \"e2\"\n];\nconst evaluate = x=>x.evaluationIds.filter(id=>x.fewShotIds.includes(id));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.2 / contraprova: declarar ausência de vazamento quando há few-shot; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"fewShotIds\": [\n    \"e1\",\n    \"e2\"\n  ],\n  \"evaluationIds\": [\n    \"e2\",\n    \"e3\"\n  ]\n};\nconst expected = [\n  \"e2\"\n];\nconst evaluate = x=>x.evaluationIds.filter(id=>x.fewShotIds.includes(id));\nconst mutant = x=>x.fewShotIds.length?[]:x.evaluationIds;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Histórico com ordem e papéis conservados": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.3 / fixture: pedido, proposta e correção aparecem nessa ordem. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"sequence\": 3,\n    \"role\": \"user\",\n    \"text\": \"agora uma unidade\"\n  },\n  {\n    \"sequence\": 1,\n    \"role\": \"user\",\n    \"text\": \"duas unidades\"\n  },\n  {\n    \"sequence\": 2,\n    \"role\": \"model\",\n    \"text\": \"proposta de duas\"\n  }\n];\nconst expected = [\n  {\n    \"role\": \"user\",\n    \"text\": \"duas unidades\"\n  },\n  {\n    \"role\": \"model\",\n    \"text\": \"proposta de duas\"\n  },\n  {\n    \"role\": \"user\",\n    \"text\": \"agora uma unidade\"\n  }\n];\nconst evaluate = x=>[...x].sort((a,b)=>a.sequence-b.sequence).map(({role,text})=>({role,text}));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.3 / contraprova: ordenar alfabeticamente pelo papel; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"sequence\": 3,\n    \"role\": \"user\",\n    \"text\": \"agora uma unidade\"\n  },\n  {\n    \"sequence\": 1,\n    \"role\": \"user\",\n    \"text\": \"duas unidades\"\n  },\n  {\n    \"sequence\": 2,\n    \"role\": \"model\",\n    \"text\": \"proposta de duas\"\n  }\n];\nconst expected = [\n  {\n    \"role\": \"user\",\n    \"text\": \"duas unidades\"\n  },\n  {\n    \"role\": \"model\",\n    \"text\": \"proposta de duas\"\n  },\n  {\n    \"role\": \"user\",\n    \"text\": \"agora uma unidade\"\n  }\n];\nconst evaluate = x=>[...x].sort((a,b)=>a.sequence-b.sequence).map(({role,text})=>({role,text}));\nconst mutant = x=>[...x].sort((a,b)=>a.role.localeCompare(b.role)).map(({role,text})=>({role,text}));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Parâmetros do ensaio e comparação justa": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C2.4 / fixture: temperature é a diferença. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"model\": \"m-eval\",\n    \"temperature\": 0.2,\n    \"tools\": []\n  },\n  \"b\": {\n    \"model\": \"m-eval\",\n    \"temperature\": 0.8,\n    \"tools\": []\n  }\n};\nconst expected = [\n  \"temperature\"\n];\nconst evaluate = x=>[\"model\",\"temperature\",\"tools\"].filter(k=>JSON.stringify(x.a[k])!==JSON.stringify(x.b[k]));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C2.4 / contraprova: comparar somente o modelo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"model\": \"m-eval\",\n    \"temperature\": 0.2,\n    \"tools\": []\n  },\n  \"b\": {\n    \"model\": \"m-eval\",\n    \"temperature\": 0.8,\n    \"tools\": []\n  }\n};\nconst expected = [\n  \"temperature\"\n];\nconst evaluate = x=>[\"model\",\"temperature\",\"tools\"].filter(k=>JSON.stringify(x.a[k])!==JSON.stringify(x.b[k]));\nconst mutant = x=>x.a.model===x.b.model?[]:[\"model\"];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Capacidade do modelo e tarefa elegível": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.1 / fixture: imageInput é a lacuna. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"imageInput\",\n    \"structuredOutput\"\n  ],\n  \"available\": [\n    \"structuredOutput\"\n  ]\n};\nconst expected = [\n  \"imageInput\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.available.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.1 / contraprova: aceitar qualquer conjunto não vazio de capacidades; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"imageInput\",\n    \"structuredOutput\"\n  ],\n  \"available\": [\n    \"structuredOutput\"\n  ]\n};\nconst expected = [\n  \"imageInput\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.available.includes(k));\nconst mutant = x=>x.available.length?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Reserva de saída e janela de contexto": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.2 / fixture: restam 150 unidades do orçamento. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"window\": 1000,\n  \"input\": 600,\n  \"outputReserve\": 200,\n  \"margin\": 50\n};\nconst expected = 150;\nconst evaluate = x=>x.window-x.input-x.outputReserve-x.margin;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.2 / contraprova: omitir outputReserve do cálculo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"window\": 1000,\n  \"input\": 600,\n  \"outputReserve\": 200,\n  \"margin\": 50\n};\nconst expected = 150;\nconst evaluate = x=>x.window-x.input-x.outputReserve-x.margin;\nconst mutant = x=>x.window-x.input-x.margin;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Contagem de tokens e estimativa de texto": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.3 / fixture: o total fornecido é 65 tokens. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"observedTokens\": {\n    \"instruction\": 10,\n    \"history\": 40,\n    \"input\": 15\n  },\n  \"chars\": 200\n};\nconst expected = 65;\nconst evaluate = x=>Object.values(x.observedTokens).reduce((a,b)=>a+b,0);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.3 / contraprova: usar chars dividido por quatro como contagem; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"observedTokens\": {\n    \"instruction\": 10,\n    \"history\": 40,\n    \"input\": 15\n  },\n  \"chars\": 200\n};\nconst expected = 65;\nconst evaluate = x=>Object.values(x.observedTokens).reduce((a,b)=>a+b,0);\nconst mutant = x=>x.chars/4;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Cache de contexto e validade da base": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.4 / fixture: o cache não é elegível ao contrato atual. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"expiresAt\": 200,\n  \"now\": 100,\n  \"revision\": \"r5\",\n  \"requiredRevision\": \"r6\"\n};\nconst expected = false;\nconst evaluate = x=>x.expiresAt>x.now&&x.revision===x.requiredRevision;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.4 / contraprova: conferir apenas expiresAt maior que now; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"expiresAt\": 200,\n  \"now\": 100,\n  \"revision\": \"r5\",\n  \"requiredRevision\": \"r6\"\n};\nconst expected = false;\nconst evaluate = x=>x.expiresAt>x.now&&x.revision===x.requiredRevision;\nconst mutant = x=>x.expiresAt>x.now;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "JSON válido e semântica ainda inválida": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / fixture: parsed true e valid false. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"{\\\"itemId\\\":\\\"A\\\",\\\"qty\\\":-1}\";\nconst expected = {\n  \"parsed\": true,\n  \"valid\": false\n};\nconst evaluate = x=>{const r=JSON.parse(x);return {parsed:true,valid:Number.isInteger(r.qty)&&r.qty>0}};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / contraprova: marcar todo JSON parseável como valid; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"{\\\"itemId\\\":\\\"A\\\",\\\"qty\\\":-1}\";\nconst expected = {\n  \"parsed\": true,\n  \"valid\": false\n};\nconst evaluate = x=>{const r=JSON.parse(x);return {parsed:true,valid:Number.isInteger(r.qty)&&r.qty>0}};\nconst mutant = x=>{JSON.parse(x);return {parsed:true,valid:true}};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Enum, campo ausente e valor desconhecido": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.2 / fixture: o estado é unknown. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": null\n};\nconst expected = \"unknown\";\nconst evaluate = x=>!Object.hasOwn(x,\"qty\")?\"missing\":x.qty===null?\"unknown\":\"supplied\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.2 / contraprova: usar truthiness para decidir missing; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": null\n};\nconst expected = \"unknown\";\nconst evaluate = x=>!Object.hasOwn(x,\"qty\")?\"missing\":x.qty===null?\"unknown\":\"supplied\";\nconst mutant = x=>x.qty?\"supplied\":\"missing\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Relação entre item, quantidade e fonte": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C4.3 / fixture: a proposta não é autorizada pela fonte recebida. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"proposal\": {\n    \"itemId\": \"A\",\n    \"qty\": 2\n  },\n  \"source\": {\n    \"itemId\": \"B\",\n    \"stock\": 10\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.proposal.itemId===x.source.itemId&&x.proposal.qty<=x.source.stock;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C4.3 / contraprova: comparar somente qty com stock; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"proposal\": {\n    \"itemId\": \"A\",\n    \"qty\": 2\n  },\n  \"source\": {\n    \"itemId\": \"B\",\n    \"stock\": 10\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.proposal.itemId===x.source.itemId&&x.proposal.qty<=x.source.stock;\nconst mutant = x=>x.proposal.qty<=x.source.stock;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Fragmento de saída e documento completo": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.4 / fixture: o resultado é pending. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"parts\": [\n    \"{\\\"itemId\\\":\\\"A\\\",\",\n    \"\\\"qty\\\":2\"\n  ],\n  \"complete\": false\n};\nconst expected = \"pending\";\nconst evaluate = x=>x.complete?JSON.parse(x.parts.join(\"\")):\"pending\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.4 / contraprova: completar chave por conta própria e parsear; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"parts\": [\n    \"{\\\"itemId\\\":\\\"A\\\",\",\n    \"\\\"qty\\\":2\"\n  ],\n  \"complete\": false\n};\nconst expected = \"pending\";\nconst evaluate = x=>x.complete?JSON.parse(x.parts.join(\"\")):\"pending\";\nconst mutant = x=>JSON.parse(x.parts.join(\"\")+\"}\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "MIME, bytes e representação base64": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.1 / fixture: os bytes são 1 2 3. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"AQID\";\nconst expected = [\n  1,\n  2,\n  3\n];\nconst evaluate = x=>Array.from(Buffer.from(x,\"base64\"));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.1 / contraprova: decodificar a string como utf8; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"AQID\";\nconst expected = [\n  1,\n  2,\n  3\n];\nconst evaluate = x=>Array.from(Buffer.from(x,\"base64\"));\nconst mutant = x=>Array.from(Buffer.from(x,\"utf8\"));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Arquivo pronto e referência ainda processando": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / fixture: o arquivo ainda não é elegível. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"uri\": \"synthetic-file\",\n  \"state\": \"PROCESSING\"\n};\nconst expected = false;\nconst evaluate = x=>x.state===\"ACTIVE\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / contraprova: aceitar qualquer uri não vazia; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"uri\": \"synthetic-file\",\n  \"state\": \"PROCESSING\"\n};\nconst expected = false;\nconst evaluate = x=>x.state===\"ACTIVE\";\nconst mutant = x=>Boolean(x.uri);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Trecho de áudio e unidade temporal": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.3 / fixture: o intervalo é 1.5 a 3 segundos. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"startMs\": 1500,\n  \"endMs\": 3000\n};\nconst expected = {\n  \"startSeconds\": 1.5,\n  \"endSeconds\": 3\n};\nconst evaluate = x=>({startSeconds:x.startMs/1000,endSeconds:x.endMs/1000});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.3 / contraprova: devolver milissegundos como segundos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"startMs\": 1500,\n  \"endMs\": 3000\n};\nconst expected = {\n  \"startSeconds\": 1.5,\n  \"endSeconds\": 3\n};\nconst evaluate = x=>({startSeconds:x.startMs/1000,endSeconds:x.endMs/1000});\nconst mutant = x=>({startSeconds:x.startMs,endSeconds:x.endMs});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Quadros de vídeo e cobertura do intervalo": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.4 / fixture: os quadros selecionados são 2 e 4. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"frames\": [\n    0,\n    2,\n    4,\n    6\n  ],\n  \"start\": 2,\n  \"end\": 6\n};\nconst expected = [\n  2,\n  4\n];\nconst evaluate = x=>x.frames.filter(t=>t>=x.start&&t<x.end);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.4 / contraprova: incluir também o limite final; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"frames\": [\n    0,\n    2,\n    4,\n    6\n  ],\n  \"start\": 2,\n  \"end\": 6\n};\nconst expected = [\n  2,\n  4\n];\nconst evaluate = x=>x.frames.filter(t=>t>=x.start&&t<x.end);\nconst mutant = x=>x.frames.filter(t=>t>=x.start&&t<=x.end);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Declaração de função e argumento validado": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.1 / fixture: a chamada não é aceita pelo dispatcher declarado. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"executeReservation\",\n  \"args\": {\n    \"qty\": 2\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.name===\"proposeReservation\"&&Number.isInteger(x.args.qty)&&x.args.qty>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.1 / contraprova: verificar qty sem conferir o nome; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"executeReservation\",\n  \"args\": {\n    \"qty\": 2\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.name===\"proposeReservation\"&&Number.isInteger(x.args.qty)&&x.args.qty>0;\nconst mutant = x=>Number.isInteger(x.args.qty)&&x.args.qty>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Identidade de chamada e retorno correspondente": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.2 / fixture: A recebe um e B recebe nove. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"calls\": [\n    {\n      \"id\": \"cA\",\n      \"item\": \"A\"\n    },\n    {\n      \"id\": \"cB\",\n      \"item\": \"B\"\n    }\n  ],\n  \"results\": [\n    {\n      \"id\": \"cB\",\n      \"stock\": 9\n    },\n    {\n      \"id\": \"cA\",\n      \"stock\": 1\n    }\n  ]\n};\nconst expected = [\n  {\n    \"item\": \"A\",\n    \"stock\": 1\n  },\n  {\n    \"item\": \"B\",\n    \"stock\": 9\n  }\n];\nconst evaluate = x=>x.calls.map(c=>({item:c.item,stock:x.results.find(r=>r.id===c.id).stock}));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.2 / contraprova: associar retorno pelo índice da lista; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"calls\": [\n    {\n      \"id\": \"cA\",\n      \"item\": \"A\"\n    },\n    {\n      \"id\": \"cB\",\n      \"item\": \"B\"\n    }\n  ],\n  \"results\": [\n    {\n      \"id\": \"cB\",\n      \"stock\": 9\n    },\n    {\n      \"id\": \"cA\",\n      \"stock\": 1\n    }\n  ]\n};\nconst expected = [\n  {\n    \"item\": \"A\",\n    \"stock\": 1\n  },\n  {\n    \"item\": \"B\",\n    \"stock\": 9\n  }\n];\nconst evaluate = x=>x.calls.map(c=>({item:c.item,stock:x.results.find(r=>r.id===c.id).stock}));\nconst mutant = x=>x.calls.map((c,i)=>({item:c.item,stock:x.results[i].stock}));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Chamadas paralelas e efeitos dependentes": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C6.3 / fixture: somente price está pronta. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"done\": [],\n  \"tasks\": [\n    {\n      \"id\": \"price\",\n      \"dependsOn\": []\n    },\n    {\n      \"id\": \"reserve\",\n      \"dependsOn\": [\n        \"auth\"\n      ]\n    }\n  ]\n};\nconst expected = [\n  \"price\"\n];\nconst evaluate = x=>x.tasks.filter(t=>t.dependsOn.every(id=>x.done.includes(id))).map(t=>t.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C6.3 / contraprova: considerar todas as tarefas prontas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"done\": [],\n  \"tasks\": [\n    {\n      \"id\": \"price\",\n      \"dependsOn\": []\n    },\n    {\n      \"id\": \"reserve\",\n      \"dependsOn\": [\n        \"auth\"\n      ]\n    }\n  ]\n};\nconst expected = [\n  \"price\"\n];\nconst evaluate = x=>x.tasks.filter(t=>t.dependsOn.every(id=>x.done.includes(id))).map(t=>t.id);\nconst mutant = x=>x.tasks.map(t=>t.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Assinaturas opacas e continuidade do turno": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.4 / fixture: os dois campos permanecem idênticos. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"proposta\",\n  \"opaqueSignature\": \"sig-demo\"\n};\nconst expected = {\n  \"text\": \"proposta\",\n  \"opaqueSignature\": \"sig-demo\"\n};\nconst evaluate = x=>({...x});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.4 / contraprova: copiar somente text; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"proposta\",\n  \"opaqueSignature\": \"sig-demo\"\n};\nconst expected = {\n  \"text\": \"proposta\",\n  \"opaqueSignature\": \"sig-demo\"\n};\nconst evaluate = x=>({...x});\nconst mutant = x=>({text:x.text});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Fonte citada e suporte da afirmação": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.1 / fixture: c-stock continua sem suporte. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"claimIds\": [\n    \"c-stock\"\n  ],\n  \"evidence\": [\n    {\n      \"claimId\": \"c-stock\",\n      \"source\": \"catalogo\",\n      \"supports\": false\n    }\n  ]\n};\nconst expected = [\n  \"c-stock\"\n];\nconst evaluate = x=>x.claimIds.filter(id=>!x.evidence.some(e=>e.claimId===id&&e.supports));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.1 / contraprova: aceitar qualquer referência do claim; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"claimIds\": [\n    \"c-stock\"\n  ],\n  \"evidence\": [\n    {\n      \"claimId\": \"c-stock\",\n      \"source\": \"catalogo\",\n      \"supports\": false\n    }\n  ]\n};\nconst expected = [\n  \"c-stock\"\n];\nconst evaluate = x=>x.claimIds.filter(id=>!x.evidence.some(e=>e.claimId===id&&e.supports));\nconst mutant = x=>x.claimIds.filter(id=>!x.evidence.some(e=>e.claimId===id));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "URL Context e endereço permitido": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.2 / fixture: a referência é rejeitada pela política local. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"https://catalog.example.attacker.example/items\";\nconst expected = false;\nconst evaluate = x=>{const u=new URL(x);return u.protocol===\"https:\"&&u.hostname===\"catalog.example\"};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.2 / contraprova: aceitar startsWith https://catalog.example; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"https://catalog.example.attacker.example/items\";\nconst expected = false;\nconst evaluate = x=>{const u=new URL(x);return u.protocol===\"https:\"&&u.hostname===\"catalog.example\"};\nconst mutant = x=>x.startsWith(\"https://catalog.example\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "File Search e identidade do documento": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.3 / fixture: somente d6 é pertinente. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"tenant\": \"t1\",\n  \"revision\": \"r6\",\n  \"documents\": [\n    {\n      \"id\": \"d5\",\n      \"tenant\": \"t1\",\n      \"revision\": \"r5\"\n    },\n    {\n      \"id\": \"d6\",\n      \"tenant\": \"t1\",\n      \"revision\": \"r6\"\n    }\n  ]\n};\nconst expected = [\n  \"d6\"\n];\nconst evaluate = x=>x.documents.filter(d=>d.tenant===x.tenant&&d.revision===x.revision).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.3 / contraprova: filtrar apenas tenant; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"tenant\": \"t1\",\n  \"revision\": \"r6\",\n  \"documents\": [\n    {\n      \"id\": \"d5\",\n      \"tenant\": \"t1\",\n      \"revision\": \"r5\"\n    },\n    {\n      \"id\": \"d6\",\n      \"tenant\": \"t1\",\n      \"revision\": \"r6\"\n    }\n  ]\n};\nconst expected = [\n  \"d6\"\n];\nconst evaluate = x=>x.documents.filter(d=>d.tenant===x.tenant&&d.revision===x.revision).map(d=>d.id);\nconst mutant = x=>x.documents.filter(d=>d.tenant===x.tenant).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Code execution e efeito fora do cálculo": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C7.4 / fixture: o total é 700 centavos. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"unitCents\": 200,\n    \"qty\": 2\n  },\n  {\n    \"unitCents\": 300,\n    \"qty\": 1\n  }\n];\nconst expected = 700;\nconst evaluate = x=>x.reduce((sum,r)=>sum+r.unitCents*r.qty,0);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C7.4 / contraprova: somar somente unitCents; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"unitCents\": 200,\n    \"qty\": 2\n  },\n  {\n    \"unitCents\": 300,\n    \"qty\": 1\n  }\n];\nconst expected = 700;\nconst evaluate = x=>x.reduce((sum,r)=>sum+r.unitCents*r.qty,0);\nconst mutant = x=>x.reduce((sum,r)=>sum+r.unitCents,0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Bloqueio de prompt e ausência de candidato": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.1 / fixture: o estado é blocked. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"blocked\": true,\n  \"candidates\": []\n};\nconst expected = \"blocked\";\nconst evaluate = x=>x.blocked?\"blocked\":x.candidates.length?\"available\":\"empty\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.1 / contraprova: classificar toda lista vazia como empty; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"blocked\": true,\n  \"candidates\": []\n};\nconst expected = \"blocked\";\nconst evaluate = x=>x.blocked?\"blocked\":x.candidates.length?\"available\":\"empty\";\nconst mutant = x=>x.candidates.length?\"available\":\"empty\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Finish reason e resposta não concluída": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.2 / fixture: o estado é incomplete. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"finishReason\": \"LIMIT\",\n  \"text\": \"proposta parcial\"\n};\nconst expected = \"incomplete\";\nconst evaluate = x=>x.finishReason===\"STOP\"?\"complete\":\"incomplete\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.2 / contraprova: usar presença de texto como complete; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"finishReason\": \"LIMIT\",\n  \"text\": \"proposta parcial\"\n};\nconst expected = \"incomplete\";\nconst evaluate = x=>x.finishReason===\"STOP\"?\"complete\":\"incomplete\";\nconst mutant = x=>x.text?\"complete\":\"incomplete\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Dados mínimos e projeção do log": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.3 / fixture: apiKey e privatePrompt ficam ausentes. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requestId\": \"r4\",\n  \"modelId\": \"m-eval\",\n  \"errorCode\": \"limit\",\n  \"apiKey\": \"synthetic-secret\",\n  \"privatePrompt\": \"synthetic-private\"\n};\nconst expected = {\n  \"requestId\": \"r4\",\n  \"modelId\": \"m-eval\",\n  \"errorCode\": \"limit\"\n};\nconst evaluate = x=>({requestId:x.requestId,modelId:x.modelId,errorCode:x.errorCode});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.3 / contraprova: devolver todo o registro; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requestId\": \"r4\",\n  \"modelId\": \"m-eval\",\n  \"errorCode\": \"limit\",\n  \"apiKey\": \"synthetic-secret\",\n  \"privatePrompt\": \"synthetic-private\"\n};\nconst expected = {\n  \"requestId\": \"r4\",\n  \"modelId\": \"m-eval\",\n  \"errorCode\": \"limit\"\n};\nconst evaluate = x=>({requestId:x.requestId,modelId:x.modelId,errorCode:x.errorCode});\nconst mutant = x=>({...x});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Prompt injection e autorização do ator": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.4 / fixture: o efeito é rejeitado. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"t1\",\n  \"resourceTenant\": \"t2\",\n  \"allowedActions\": [\n    \"reserve\"\n  ],\n  \"action\": \"reserve\"\n};\nconst expected = false;\nconst evaluate = x=>x.actorTenant===x.resourceTenant&&x.allowedActions.includes(x.action);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.4 / contraprova: conferir somente allowedActions; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"t1\",\n  \"resourceTenant\": \"t2\",\n  \"allowedActions\": [\n    \"reserve\"\n  ],\n  \"action\": \"reserve\"\n};\nconst expected = false;\nconst evaluate = x=>x.actorTenant===x.resourceTenant&&x.allowedActions.includes(x.action);\nconst mutant = x=>x.allowedActions.includes(x.action);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "API e versão do envelope observado": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / fixture: o decoder está unavailable. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"apiFamily\": \"interactions\",\n  \"schemaRevision\": \"r1\",\n  \"decoders\": [\n    {\n      \"id\": \"decoder-gc\",\n      \"apiFamily\": \"generateContent\",\n      \"schemaRevision\": \"r1\"\n    }\n  ]\n};\nconst expected = \"unavailable\";\nconst evaluate = x=>x.decoders.find(d=>d.apiFamily===x.apiFamily&&d.schemaRevision===x.schemaRevision)?.id??\"unavailable\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / contraprova: selecionar apenas por schemaRevision; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"apiFamily\": \"interactions\",\n  \"schemaRevision\": \"r1\",\n  \"decoders\": [\n    {\n      \"id\": \"decoder-gc\",\n      \"apiFamily\": \"generateContent\",\n      \"schemaRevision\": \"r1\"\n    }\n  ]\n};\nconst expected = \"unavailable\";\nconst evaluate = x=>x.decoders.find(d=>d.apiFamily===x.apiFamily&&d.schemaRevision===x.schemaRevision)?.id??\"unavailable\";\nconst mutant = x=>x.decoders.find(d=>d.schemaRevision===x.schemaRevision)?.id??\"unavailable\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Stream por partes e UTF-8 dividido": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.2 / fixture: o texto íntegro é São. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  [\n    83,\n    195\n  ],\n  [\n    163,\n    111\n  ]\n];\nconst expected = \"São\";\nconst evaluate = x=>Buffer.concat(x.map(a=>Buffer.from(a))).toString(\"utf8\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.2 / contraprova: decodificar cada buffer e só depois juntar textos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  [\n    83,\n    195\n  ],\n  [\n    163,\n    111\n  ]\n];\nconst expected = \"São\";\nconst evaluate = x=>Buffer.concat(x.map(a=>Buffer.from(a))).toString(\"utf8\");\nconst mutant = x=>x.map(a=>Buffer.from(a).toString(\"utf8\")).join(\"\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Rate limit e janela de retry": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.3 / fixture: a espera planejada é 5000 ms. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"backoffMs\": 2000,\n  \"retryAfterMs\": 5000,\n  \"maxWaitMs\": 10000\n};\nconst expected = 5000;\nconst evaluate = x=>{const wait=Math.max(x.backoffMs,x.retryAfterMs);return wait>x.maxWaitMs?\"defer\":wait};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.3 / contraprova: usar somente backoffMs; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"backoffMs\": 2000,\n  \"retryAfterMs\": 5000,\n  \"maxWaitMs\": 10000\n};\nconst expected = 5000;\nconst evaluate = x=>{const wait=Math.max(x.backoffMs,x.retryAfterMs);return wait>x.maxWaitMs?\"defer\":wait};\nconst mutant = x=>x.backoffMs;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Live API e sessão com geração distinta": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.4 / fixture: nenhum evento é aplicado. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"session\": \"s2\",\n  \"generation\": 1,\n  \"events\": [\n    {\n      \"session\": \"s1\",\n      \"generation\": 2,\n      \"text\": \"intenção antiga\"\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = x=>x.events.filter(e=>e.session===x.session&&e.generation===x.generation).map(e=>e.text);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.4 / contraprova: aceitar todo evento com texto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"session\": \"s2\",\n  \"generation\": 1,\n  \"events\": [\n    {\n      \"session\": \"s1\",\n      \"generation\": 2,\n      \"text\": \"intenção antiga\"\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = x=>x.events.filter(e=>e.session===x.session&&e.generation===x.generation).map(e=>e.text);\nconst mutant = x=>x.events.filter(e=>e.text).map(e=>e.text);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Runtime server e segredo fora do client": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / fixture: o estado é exposed. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"GEMINI_API_KEY\",\n  \"secret\": true,\n  \"target\": \"client\"\n};\nconst expected = \"exposed\";\nconst evaluate = x=>x.secret&&x.target===\"client\"?\"exposed\":\"review\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / contraprova: aceitar como secure só pelo nome GEMINI_API_KEY; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"GEMINI_API_KEY\",\n  \"secret\": true,\n  \"target\": \"client\"\n};\nconst expected = \"exposed\";\nconst evaluate = x=>x.secret&&x.target===\"client\"?\"exposed\":\"review\";\nconst mutant = x=>x.name===\"GEMINI_API_KEY\"?\"review\":\"exposed\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Firebase e recurso ligado à identidade": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.2 / fixture: a leitura é rejeitada. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"authenticated\": true,\n  \"actorId\": \"u1\",\n  \"ownerId\": \"u2\"\n};\nconst expected = false;\nconst evaluate = x=>x.authenticated&&x.actorId===x.ownerId;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.2 / contraprova: autorizar apenas pela autenticação; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"authenticated\": true,\n  \"actorId\": \"u1\",\n  \"ownerId\": \"u2\"\n};\nconst expected = false;\nconst evaluate = x=>x.authenticated&&x.actorId===x.ownerId;\nconst mutant = x=>x.authenticated;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "GitHub, ZIP e base realmente sincronizada": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.3 / fixture: a igualdade é false. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"exportedRevision\": \"r8\",\n  \"runningRevision\": \"r7\"\n};\nconst expected = false;\nconst evaluate = x=>x.exportedRevision===x.runningRevision;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.3 / contraprova: aceitar qualquer exportação existente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"exportedRevision\": \"r8\",\n  \"runningRevision\": \"r7\"\n};\nconst expected = false;\nconst evaluate = x=>x.exportedRevision===x.runningRevision;\nconst mutant = x=>Boolean(x.exportedRevision);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Publicação Cloud Run e estado do destino": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.4 / fixture: o estado é pending. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"deployedRevision\": \"r9\",\n  \"expectedRevision\": \"r9\",\n  \"health\": \"starting\"\n};\nconst expected = \"pending\";\nconst evaluate = x=>x.deployedRevision===x.expectedRevision&&x.health===\"passing\"?\"ready\":\"pending\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.4 / contraprova: aprovar somente pela revisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"deployedRevision\": \"r9\",\n  \"expectedRevision\": \"r9\",\n  \"health\": \"starting\"\n};\nconst expected = \"pending\";\nconst evaluate = x=>x.deployedRevision===x.expectedRevision&&x.health===\"passing\"?\"ready\":\"pending\";\nconst mutant = x=>x.deployedRevision===x.expectedRevision?\"ready\":\"pending\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Dataset e divisão sem vazamento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.1 / fixture: g-reserve é o grupo vazado. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"train\": [\n    {\n      \"id\": \"a1\",\n      \"groupId\": \"g-reserve\"\n    }\n  ],\n  \"test\": [\n    {\n      \"id\": \"a2\",\n      \"groupId\": \"g-reserve\"\n    }\n  ]\n};\nconst expected = [\n  \"g-reserve\"\n];\nconst evaluate = x=>[...new Set(x.test.map(r=>r.groupId).filter(g=>x.train.some(r=>r.groupId===g)))];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.1 / contraprova: comparar somente IDs de caso; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"train\": [\n    {\n      \"id\": \"a1\",\n      \"groupId\": \"g-reserve\"\n    }\n  ],\n  \"test\": [\n    {\n      \"id\": \"a2\",\n      \"groupId\": \"g-reserve\"\n    }\n  ]\n};\nconst expected = [\n  \"g-reserve\"\n];\nconst evaluate = x=>[...new Set(x.test.map(r=>r.groupId).filter(g=>x.train.some(r=>r.groupId===g)))];\nconst mutant = x=>x.test.filter(r=>x.train.some(t=>t.id===r.id)).map(r=>r.groupId);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Métrica por grupo e erro escondido na média": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.2 / fixture: easy 0.9 e ambiguous zero. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"easy\",\n    \"passed\": 9,\n    \"total\": 10\n  },\n  {\n    \"id\": \"ambiguous\",\n    \"passed\": 0,\n    \"total\": 2\n  }\n];\nconst expected = {\n  \"easy\": 0.9,\n  \"ambiguous\": 0\n};\nconst evaluate = x=>Object.fromEntries(x.map(g=>[g.id,g.passed/g.total]));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.2 / contraprova: atribuir média total a todos os grupos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"easy\",\n    \"passed\": 9,\n    \"total\": 10\n  },\n  {\n    \"id\": \"ambiguous\",\n    \"passed\": 0,\n    \"total\": 2\n  }\n];\nconst expected = {\n  \"easy\": 0.9,\n  \"ambiguous\": 0\n};\nconst evaluate = x=>Object.fromEntries(x.map(g=>[g.id,g.passed/g.total]));\nconst mutant = x=>{const rate=x.reduce((s,g)=>s+g.passed,0)/x.reduce((s,g)=>s+g.total,0);return Object.fromEntries(x.map(g=>[g.id,rate]))};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Resultado unknown e reconciliação de efeito": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.3 / fixture: a próxima ação é reconcile. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"state\": \"unknown\"\n};\nconst expected = \"reconcile\";\nconst evaluate = x=>({unknown:\"reconcile\",rejected:\"retry\",confirmed:\"done\"})[x.state];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.3 / contraprova: retornar retry para tudo que não for confirmed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"state\": \"unknown\"\n};\nconst expected = \"reconcile\";\nconst evaluate = x=>({unknown:\"reconcile\",rejected:\"retry\",confirmed:\"done\"})[x.state];\nconst mutant = x=>x.state===\"confirmed\"?\"done\":\"retry\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Mudança de modelo e regressão do contrato": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.4 / fixture: extraction é a lacuna. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"targetModel\": \"m-new\",\n  \"gates\": [\n    {\n      \"id\": \"extraction\",\n      \"status\": \"passed\",\n      \"testedModel\": \"m-old\"\n    }\n  ]\n};\nconst expected = [\n  \"extraction\"\n];\nconst evaluate = x=>x.gates.filter(g=>g.status!==\"passed\"||g.testedModel!==x.targetModel).map(g=>g.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.4 / contraprova: considerar passed suficiente sem modelo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"targetModel\": \"m-new\",\n  \"gates\": [\n    {\n      \"id\": \"extraction\",\n      \"status\": \"passed\",\n      \"testedModel\": \"m-old\"\n    }\n  ]\n};\nconst expected = [\n  \"extraction\"\n];\nconst evaluate = x=>x.gates.filter(g=>g.status!==\"passed\"||g.testedModel!==x.targetModel).map(g=>g.id);\nconst mutant = x=>x.gates.filter(g=>g.status!==\"passed\").map(g=>g.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Proposta de reserva e decisão autorizada": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.1 / fixture: a decisão é reject. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"proposalStatus\": \"ready\",\n  \"actorTenant\": \"t1\",\n  \"itemTenant\": \"t2\"\n};\nconst expected = \"reject\";\nconst evaluate = x=>x.proposalStatus===\"ready\"&&x.actorTenant===x.itemTenant?\"accept\":\"reject\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.1 / contraprova: aceitar qualquer proposta ready; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"proposalStatus\": \"ready\",\n  \"actorTenant\": \"t1\",\n  \"itemTenant\": \"t2\"\n};\nconst expected = \"reject\";\nconst evaluate = x=>x.proposalStatus===\"ready\"&&x.actorTenant===x.itemTenant?\"accept\":\"reject\";\nconst mutant = x=>x.proposalStatus===\"ready\"?\"accept\":\"reject\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Intenção repetida com conteúdo divergente": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.2 / fixture: o conteúdo não é equivalente. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"intentId\": \"i9\",\n    \"tenant\": \"t1\",\n    \"itemId\": \"A\",\n    \"qty\": 2\n  },\n  \"b\": {\n    \"intentId\": \"i9\",\n    \"tenant\": \"t1\",\n    \"itemId\": \"A\",\n    \"qty\": 1\n  }\n};\nconst expected = false;\nconst evaluate = x=>{const hash=r=>require(\"node:crypto\").createHash(\"sha256\").update(JSON.stringify([r.tenant,r.itemId,r.qty])).digest(\"hex\");return hash(x.a)===hash(x.b)};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.2 / contraprova: comparar só intentId; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"intentId\": \"i9\",\n    \"tenant\": \"t1\",\n    \"itemId\": \"A\",\n    \"qty\": 2\n  },\n  \"b\": {\n    \"intentId\": \"i9\",\n    \"tenant\": \"t1\",\n    \"itemId\": \"A\",\n    \"qty\": 1\n  }\n};\nconst expected = false;\nconst evaluate = x=>{const hash=r=>require(\"node:crypto\").createHash(\"sha256\").update(JSON.stringify([r.tenant,r.itemId,r.qty])).digest(\"hex\");return hash(x.a)===hash(x.b)};\nconst mutant = x=>x.a.intentId===x.b.intentId;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Quantidade confirmada e estoque preservado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / fixture: result rejected e stock um. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 1,\n  \"qty\": 2\n};\nconst expected = {\n  \"result\": \"rejected\",\n  \"stock\": 1\n};\nconst evaluate = x=>x.qty>x.stock?{result:\"rejected\",stock:x.stock}:{result:\"confirmed\",stock:x.stock-x.qty};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / contraprova: subtrair sempre e confirmar; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 1,\n  \"qty\": 2\n};\nconst expected = {\n  \"result\": \"rejected\",\n  \"stock\": 1\n};\nconst evaluate = x=>x.qty>x.stock?{result:\"rejected\",stock:x.stock}:{result:\"confirmed\",stock:x.stock-x.qty};\nconst mutant = x=>({result:\"confirmed\",stock:x.stock-x.qty});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Handoff de evidência e Lab Ágora": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / fixture: somente e1 está aprovado nesse recorte. Prova local declarada, sem agente ou efeito GoogleAiStudio.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r10\",\n  \"gates\": [\n    {\n      \"id\": \"e1\",\n      \"status\": \"passed\",\n      \"revision\": \"r10\",\n      \"environment\": \"local\"\n    },\n    {\n      \"id\": \"browser\",\n      \"status\": \"pending\",\n      \"revision\": \"r10\",\n      \"environment\": \"native\"\n    },\n    {\n      \"id\": \"e-old\",\n      \"status\": \"passed\",\n      \"revision\": \"r9\",\n      \"environment\": \"local\"\n    }\n  ]\n};\nconst expected = [\n  \"e1\"\n];\nconst evaluate = x=>x.gates.filter(g=>g.status===\"passed\"&&g.revision===x.revision&&g.environment===\"local\").map(g=>g.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / contraprova: selecionar todo status passed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r10\",\n  \"gates\": [\n    {\n      \"id\": \"e1\",\n      \"status\": \"passed\",\n      \"revision\": \"r10\",\n      \"environment\": \"local\"\n    },\n    {\n      \"id\": \"browser\",\n      \"status\": \"pending\",\n      \"revision\": \"r10\",\n      \"environment\": \"native\"\n    },\n    {\n      \"id\": \"e-old\",\n      \"status\": \"passed\",\n      \"revision\": \"r9\",\n      \"environment\": \"local\"\n    }\n  ]\n};\nconst expected = [\n  \"e1\"\n];\nconst evaluate = x=>x.gates.filter(g=>g.status===\"passed\"&&g.revision===x.revision&&g.environment===\"local\").map(g=>g.id);\nconst mutant = x=>x.gates.filter(g=>g.status===\"passed\").map(g=>g.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ]
};
