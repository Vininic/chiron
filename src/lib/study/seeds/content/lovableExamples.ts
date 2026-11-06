export interface LovableExample {lang:string;scope:"local-rule"|"local-transform"|"model";purpose:string;code:string}
export const LOVABLE_EXAMPLES: Record<string,[LovableExample,LovableExample]> = {
  "Brief com usuário, tarefa e resultado": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / fixture: a lacuna é saldo. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"recibo\",\n    \"saldo\"\n  ],\n  \"observed\": [\n    \"recibo\"\n  ]\n};\nconst expected = [\n  \"saldo\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.observed.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / contraprova: aceitar recibo como cobertura de todo o brief; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"recibo\",\n    \"saldo\"\n  ],\n  \"observed\": [\n    \"recibo\"\n  ]\n};\nconst expected = [\n  \"saldo\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.observed.includes(k));\nconst mutant = x=>x.observed.includes(\"recibo\")?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Projeto, workspace e versão observada": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.2 / fixture: revision aparece como diferença. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"project\": \"q\",\n    \"revision\": \"v7\"\n  },\n  \"b\": {\n    \"project\": \"q\",\n    \"revision\": \"v8\"\n  }\n};\nconst expected = [\n  \"revision\"\n];\nconst evaluate = x=>[\"project\",\"revision\"].filter(k=>x.a[k]!==x.b[k]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.2 / contraprova: comparar somente o projeto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"project\": \"q\",\n    \"revision\": \"v7\"\n  },\n  \"b\": {\n    \"project\": \"q\",\n    \"revision\": \"v8\"\n  }\n};\nconst expected = [\n  \"revision\"\n];\nconst evaluate = x=>[\"project\",\"revision\"].filter(k=>x.a[k]!==x.b[k]);\nconst mutant = x=>x.a.project===x.b.project?[]:[\"project\"];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Chat, Plan e Build como decisões distintas": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C1.3 / fixture: o modo escolhido é Plan. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stage\": \"investigar\"\n};\nconst expected = \"Plan\";\nconst evaluate = x=>({discutir:\"Chat\",investigar:\"Plan\",implementar:\"Build\"})[x.stage];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C1.3 / contraprova: retornar Build para todas as etapas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stage\": \"investigar\"\n};\nconst expected = \"Plan\";\nconst evaluate = x=>({discutir:\"Chat\",investigar:\"Plan\",implementar:\"Build\"})[x.stage];\nconst mutant = x=>\"Build\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Preview e publicação com revisões separadas": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / fixture: a igualdade é false. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"draftRevision\": \"d9\",\n  \"publicRevision\": \"d8\"\n};\nconst expected = false;\nconst evaluate = x=>x.draftRevision===x.publicRevision;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / contraprova: declarar igualdade quando há qualquer revisão pública; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"draftRevision\": \"d9\",\n  \"publicRevision\": \"d8\"\n};\nconst expected = false;\nconst evaluate = x=>x.draftRevision===x.publicRevision;\nconst mutant = x=>Boolean(x.publicRevision);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Knowledge de workspace e contexto do projeto": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.1 / fixture: currency cents e quantity integer coexistem. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"workspace\": {\n    \"currency\": \"cents\"\n  },\n  \"project\": {\n    \"quantity\": \"integer\"\n  }\n};\nconst expected = {\n  \"currency\": \"cents\",\n  \"quantity\": \"integer\"\n};\nconst evaluate = x=>({...x.workspace,...x.project});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.1 / contraprova: usar apenas o mapa do projeto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"workspace\": {\n    \"currency\": \"cents\"\n  },\n  \"project\": {\n    \"quantity\": \"integer\"\n  }\n};\nconst expected = {\n  \"currency\": \"cents\",\n  \"quantity\": \"integer\"\n};\nconst evaluate = x=>({...x.workspace,...x.project});\nconst mutant = x=>x.project;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Skill pertinente e instrução sob demanda": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.2 / fixture: somente recibo-audit é selecionada. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"recibo-audit\",\n    \"task\": \"pagamento\",\n    \"effect\": \"read\"\n  },\n  {\n    \"id\": \"campanha\",\n    \"task\": \"pagamento\",\n    \"effect\": \"publish\"\n  }\n];\nconst expected = [\n  \"recibo-audit\"\n];\nconst evaluate = x=>x.filter(s=>s.task===\"pagamento\"&&s.effect===\"read\").map(s=>s.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.2 / contraprova: selecionar pelo assunto sem filtrar efeito; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"recibo-audit\",\n    \"task\": \"pagamento\",\n    \"effect\": \"read\"\n  },\n  {\n    \"id\": \"campanha\",\n    \"task\": \"pagamento\",\n    \"effect\": \"publish\"\n  }\n];\nconst expected = [\n  \"recibo-audit\"\n];\nconst evaluate = x=>x.filter(s=>s.task===\"pagamento\"&&s.effect===\"read\").map(s=>s.id);\nconst mutant = x=>x.filter(s=>s.task===\"pagamento\").map(s=>s.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Prompt incremental e critérios de aceitação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / fixture: a entrada equipe recebe cinco. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"plan\": \"equipe\"\n};\nconst expected = 5;\nconst evaluate = x=>x.plan===\"individual\"?3:5;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / contraprova: aplicar três a qualquer plano; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"plan\": \"equipe\"\n};\nconst expected = 5;\nconst evaluate = x=>x.plan===\"individual\"?3:5;\nconst mutant = x=>3;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Contexto externo e autoridade da informação": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C2.4 / fixture: a referência não é autorizadora. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"source\": \"external\",\n  \"purpose\": \"policy\"\n};\nconst expected = false;\nconst evaluate = x=>x.source===\"owner\"&&x.purpose===\"policy\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C2.4 / contraprova: confiar em purpose policy sem conferir a origem; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"source\": \"external\",\n  \"purpose\": \"policy\"\n};\nconst expected = false;\nconst evaluate = x=>x.source===\"owner\"&&x.purpose===\"policy\";\nconst mutant = x=>x.purpose===\"policy\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Token de design e contraste verificável": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.1 / fixture: a razão é vinte e um. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": 1,\n  \"b\": 0\n};\nconst expected = 21;\nconst evaluate = x=>(Math.max(x.a,x.b)+0.05)/(Math.min(x.a,x.b)+0.05);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.1 / contraprova: omitir 0.05 no numerador; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": 1,\n  \"b\": 0\n};\nconst expected = 21;\nconst evaluate = x=>(Math.max(x.a,x.b)+0.05)/(Math.min(x.a,x.b)+0.05);\nconst mutant = x=>Math.max(x.a,x.b)/(Math.min(x.a,x.b)+0.05);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Seleção visual e componente compartilhado": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.2 / fixture: as variantes são primary e danger. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"reserve\",\n  \"remove\"\n];\nconst expected = [\n  \"primary\",\n  \"danger\"\n];\nconst evaluate = x=>x.map(a=>a===\"reserve\"?\"primary\":\"danger\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.2 / contraprova: atribuir primary às duas ações; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"reserve\",\n  \"remove\"\n];\nconst expected = [\n  \"primary\",\n  \"danger\"\n];\nconst evaluate = x=>x.map(a=>a===\"reserve\"?\"primary\":\"danger\");\nconst mutant = x=>x.map(()=>\"primary\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Layout responsivo e ordem de leitura": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.3 / fixture: o resultado é uma coluna. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"width\": 599\n};\nconst expected = 1;\nconst evaluate = x=>x.width<600?1:3;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.3 / contraprova: trocar o limiar para 500; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"width\": 599\n};\nconst expected = 1;\nconst evaluate = x=>x.width<600?1:3;\nconst mutant = x=>x.width<500?1:3;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Formulário acessível e erros por campo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.4 / fixture: a referência é qty-error. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"field\": \"qty\",\n  \"errors\": [\n    \"name\",\n    \"qty\"\n  ]\n};\nconst expected = \"qty-error\";\nconst evaluate = x=>x.errors.includes(x.field)?`${x.field}-error`:null;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.4 / contraprova: escolher sempre o primeiro erro; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"field\": \"qty\",\n  \"errors\": [\n    \"name\",\n    \"qty\"\n  ]\n};\nconst expected = \"qty-error\";\nconst evaluate = x=>x.errors.includes(x.field)?`${x.field}-error`:null;\nconst mutant = x=>`${x.errors[0]}-error`;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Stack atual e código dependente do browser": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / fixture: o resultado é compact. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"browser\": false\n};\nconst expected = \"compact\";\nconst evaluate = x=>x.browser?(x.preference??\"compact\"):\"compact\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / contraprova: ler a preferência sem distinguir o ambiente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"browser\": false\n};\nconst expected = \"compact\";\nconst evaluate = x=>x.browser?(x.preference??\"compact\"):\"compact\";\nconst mutant = x=>x.preference;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Rota protegida e retorno após login": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.2 / fixture: o destino é /reservas. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"https://outside.example\";\nconst expected = \"/reservas\";\nconst evaluate = x=>x.startsWith(\"/\")&&!x.startsWith(\"//\")?x:\"/reservas\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.2 / contraprova: devolver qualquer destino informado; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"https://outside.example\";\nconst expected = \"/reservas\";\nconst evaluate = x=>x.startsWith(\"/\")&&!x.startsWith(\"//\")?x:\"/reservas\";\nconst mutant = x=>x;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Estado de recurso e resposta atrasada": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.3 / fixture: a lista permanece arquivados. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"currentRequest\": \"r2\",\n  \"currentItems\": [\n    \"arquivados\"\n  ],\n  \"response\": {\n    \"request\": \"r1\",\n    \"items\": [\n      \"ativos\"\n    ]\n  }\n};\nconst expected = [\n  \"arquivados\"\n];\nconst evaluate = x=>x.response.request===x.currentRequest?x.response.items:x.currentItems;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.3 / contraprova: substituir itens por toda resposta recebida; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"currentRequest\": \"r2\",\n  \"currentItems\": [\n    \"arquivados\"\n  ],\n  \"response\": {\n    \"request\": \"r1\",\n    \"items\": [\n      \"ativos\"\n    ]\n  }\n};\nconst expected = [\n  \"arquivados\"\n];\nconst evaluate = x=>x.response.request===x.currentRequest?x.response.items:x.currentItems;\nconst mutant = x=>x.response.items;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Filtro, paginação e identidade da consulta": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.4 / fixture: as chaves não são iguais. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"tenant\": \"t1\",\n    \"status\": \"active\",\n    \"page\": 1\n  },\n  \"b\": {\n    \"tenant\": \"t1\",\n    \"status\": \"active\",\n    \"page\": 2\n  }\n};\nconst expected = false;\nconst evaluate = x=>JSON.stringify([x.a.tenant,x.a.status,x.a.page])===JSON.stringify([x.b.tenant,x.b.status,x.b.page]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.4 / contraprova: montar chave só com tenant e status; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"tenant\": \"t1\",\n    \"status\": \"active\",\n    \"page\": 1\n  },\n  \"b\": {\n    \"tenant\": \"t1\",\n    \"status\": \"active\",\n    \"page\": 2\n  }\n};\nconst expected = false;\nconst evaluate = x=>JSON.stringify([x.a.tenant,x.a.status,x.a.page])===JSON.stringify([x.b.tenant,x.b.status,x.b.page]);\nconst mutant = x=>JSON.stringify([x.a.tenant,x.a.status])===JSON.stringify([x.b.tenant,x.b.status]);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Entidade de domínio e migração aditiva": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.1 / fixture: os estados ficam pending e confirmed. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"a\"\n  },\n  {\n    \"id\": \"b\",\n    \"status\": \"confirmed\"\n  }\n];\nconst expected = [\n  {\n    \"id\": \"a\",\n    \"status\": \"pending\"\n  },\n  {\n    \"id\": \"b\",\n    \"status\": \"confirmed\"\n  }\n];\nconst evaluate = x=>x.map(r=>({...r,status:r.status??\"pending\"}));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.1 / contraprova: sobrescrever todos os estados com pending; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"a\"\n  },\n  {\n    \"id\": \"b\",\n    \"status\": \"confirmed\"\n  }\n];\nconst expected = [\n  {\n    \"id\": \"a\",\n    \"status\": \"pending\"\n  },\n  {\n    \"id\": \"b\",\n    \"status\": \"confirmed\"\n  }\n];\nconst evaluate = x=>x.map(r=>({...r,status:r.status??\"pending\"}));\nconst mutant = x=>x.map(r=>({...r,status:\"pending\"}));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Identidade autenticada e isolamento de tenant": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.2 / fixture: a operação não é autorizada. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"t1\",\n  \"resourceTenant\": \"t2\",\n  \"payloadTenant\": \"t2\"\n};\nconst expected = false;\nconst evaluate = x=>x.actorTenant===x.resourceTenant;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.2 / contraprova: comparar payloadTenant com resourceTenant; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"t1\",\n  \"resourceTenant\": \"t2\",\n  \"payloadTenant\": \"t2\"\n};\nconst expected = false;\nconst evaluate = x=>x.actorTenant===x.resourceTenant;\nconst mutant = x=>x.payloadTenant===x.resourceTenant;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "RLS e operação autorizada por linha": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.3 / fixture: a transição é rejeitada. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"t1\",\n  \"beforeTenant\": \"t1\",\n  \"afterTenant\": \"t2\"\n};\nconst expected = false;\nconst evaluate = x=>x.beforeTenant===x.actorTenant&&x.afterTenant===x.actorTenant;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.3 / contraprova: verificar somente beforeTenant; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"t1\",\n  \"beforeTenant\": \"t1\",\n  \"afterTenant\": \"t2\"\n};\nconst expected = false;\nconst evaluate = x=>x.beforeTenant===x.actorTenant&&x.afterTenant===x.actorTenant;\nconst mutant = x=>x.beforeTenant===x.actorTenant;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Paginação estável e minimização de resposta": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.4 / fixture: a precede b e internalNote não aparece. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"b\",\n    \"name\": \"B\",\n    \"created\": 1,\n    \"internalNote\": \"private-b\"\n  },\n  {\n    \"id\": \"a\",\n    \"name\": \"A\",\n    \"created\": 1,\n    \"internalNote\": \"private-a\"\n  }\n];\nconst expected = [\n  {\n    \"id\": \"a\",\n    \"name\": \"A\"\n  },\n  {\n    \"id\": \"b\",\n    \"name\": \"B\"\n  }\n];\nconst evaluate = x=>[...x].sort((a,b)=>a.created-b.created||a.id.localeCompare(b.id)).map(({id,name})=>({id,name}));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.4 / contraprova: preservar ordem de entrada e todos os campos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"b\",\n    \"name\": \"B\",\n    \"created\": 1,\n    \"internalNote\": \"private-b\"\n  },\n  {\n    \"id\": \"a\",\n    \"name\": \"A\",\n    \"created\": 1,\n    \"internalNote\": \"private-a\"\n  }\n];\nconst expected = [\n  {\n    \"id\": \"a\",\n    \"name\": \"A\"\n  },\n  {\n    \"id\": \"b\",\n    \"name\": \"B\"\n  }\n];\nconst evaluate = x=>[...x].sort((a,b)=>a.created-b.created||a.id.localeCompare(b.id)).map(({id,name})=>({id,name}));\nconst mutant = x=>x.map(r=>({...r}));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Sessão expirada e ação de recuperação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.1 / fixture: o estado é expired. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"expiresAt\": 100,\n  \"now\": 100\n};\nconst expected = \"expired\";\nconst evaluate = x=>x.expiresAt<=x.now?\"expired\":\"valid\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.1 / contraprova: expirar somente quando expiresAt é menor que now; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"expiresAt\": 100,\n  \"now\": 100\n};\nconst expected = \"expired\";\nconst evaluate = x=>x.expiresAt<=x.now?\"expired\":\"valid\";\nconst mutant = x=>x.expiresAt<x.now?\"expired\":\"valid\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Bucket privado e referência de objeto": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C6.2 / fixture: a leitura não é permitida. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"bucket\": \"private\",\n  \"objectTenant\": \"t2\",\n  \"actorTenant\": \"t1\"\n};\nconst expected = false;\nconst evaluate = x=>x.bucket===\"private\"&&x.objectTenant===x.actorTenant;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C6.2 / contraprova: aceitar todo objeto em bucket private; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"bucket\": \"private\",\n  \"objectTenant\": \"t2\",\n  \"actorTenant\": \"t1\"\n};\nconst expected = false;\nconst evaluate = x=>x.bucket===\"private\"&&x.objectTenant===x.actorTenant;\nconst mutant = x=>x.bucket===\"private\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Validação de upload e limite conhecido": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.3 / fixture: o arquivo é rejeitado. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"allowed\": [\n    \"application/pdf\"\n  ],\n  \"mime\": \"application/pdf\",\n  \"bytes\": 1001,\n  \"limit\": 1000\n};\nconst expected = false;\nconst evaluate = x=>x.allowed.includes(x.mime)&&x.bytes<=x.limit;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.3 / contraprova: verificar somente o tipo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"allowed\": [\n    \"application/pdf\"\n  ],\n  \"mime\": \"application/pdf\",\n  \"bytes\": 1001,\n  \"limit\": 1000\n};\nconst expected = false;\nconst evaluate = x=>x.allowed.includes(x.mime)&&x.bytes<=x.limit;\nconst mutant = x=>x.allowed.includes(x.mime);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Secret de backend e variável pública": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.4 / fixture: a classificação é forbidden. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"VITE_PAYMENT_KEY\",\n  \"sensitive\": true,\n  \"destination\": \"browser\"\n};\nconst expected = \"forbidden\";\nconst evaluate = x=>x.sensitive&&x.destination===\"browser\"?\"forbidden\":\"review\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.4 / contraprova: aceitar tudo que começa com VITE_; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"VITE_PAYMENT_KEY\",\n  \"sensitive\": true,\n  \"destination\": \"browser\"\n};\nconst expected = \"forbidden\";\nconst evaluate = x=>x.sensitive&&x.destination===\"browser\"?\"forbidden\":\"review\";\nconst mutant = x=>x.name.startsWith(\"VITE_\")?\"review\":\"forbidden\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Entrada validada antes do efeito externo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.1 / fixture: a entrada é inválida. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": \"3\"\n};\nconst expected = false;\nconst evaluate = x=>Number.isInteger(x.qty)&&x.qty>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.1 / contraprova: converter qty com Number antes de validar; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": \"3\"\n};\nconst expected = false;\nconst evaluate = x=>Number.isInteger(x.qty)&&x.qty>0;\nconst mutant = x=>Number.isInteger(Number(x.qty))&&Number(x.qty)>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Connector de workspace e conta do usuário": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.2 / fixture: o proprietário necessário é user. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"purpose\": \"personalCalendar\"\n};\nconst expected = \"user\";\nconst evaluate = x=>x.purpose===\"personalCalendar\"?\"user\":\"workspace\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.2 / contraprova: selecionar workspace para todos os propósitos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"purpose\": \"personalCalendar\"\n};\nconst expected = \"user\";\nconst evaluate = x=>x.purpose===\"personalCalendar\"?\"user\":\"workspace\";\nconst mutant = x=>\"workspace\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Assinatura de webhook e corpo original": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C7.3 / fixture: o digest coincide com o oracle do corpo literal. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"body\": \"{ \\\"status\\\": \\\"paid\\\" }\",\n  \"key\": \"demo-key\"\n};\nconst expected = \"417dfed640fe2f1dfdecec61831dc24f3ca7f1338783d66dc0571c2bdc22433c\";\nconst evaluate = x=>require(\"node:crypto\").createHmac(\"sha256\",x.key).update(x.body).digest(\"hex\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C7.3 / contraprova: reconstruir JSON compacto antes de assinar; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"body\": \"{ \\\"status\\\": \\\"paid\\\" }\",\n  \"key\": \"demo-key\"\n};\nconst expected = \"417dfed640fe2f1dfdecec61831dc24f3ca7f1338783d66dc0571c2bdc22433c\";\nconst evaluate = x=>require(\"node:crypto\").createHmac(\"sha256\",x.key).update(x.body).digest(\"hex\");\nconst mutant = x=>require(\"node:crypto\").createHmac(\"sha256\",x.key).update(JSON.stringify(JSON.parse(x.body))).digest(\"hex\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Idempotência e evento já processado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.4 / fixture: o efeito adicional é zero. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"processed\": [\n    \"e7\"\n  ],\n  \"incoming\": \"e7\",\n  \"delta\": 10\n};\nconst expected = 0;\nconst evaluate = x=>x.processed.includes(x.incoming)?0:x.delta;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.4 / contraprova: aplicar delta a cada entrega; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"processed\": [\n    \"e7\"\n  ],\n  \"incoming\": \"e7\",\n  \"delta\": 10\n};\nconst expected = 0;\nconst evaluate = x=>x.processed.includes(x.incoming)?0:x.delta;\nconst mutant = x=>x.delta;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Frontend test e expectativa independente": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.1 / fixture: o resultado é c1 e c3. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"c1\",\n    \"status\": \"confirmed\"\n  },\n  {\n    \"id\": \"p2\",\n    \"status\": \"pending\"\n  },\n  {\n    \"id\": \"c3\",\n    \"status\": \"confirmed\"\n  }\n];\nconst expected = [\n  \"c1\",\n  \"c3\"\n];\nconst evaluate = x=>x.filter(r=>r.status===\"confirmed\").map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.1 / contraprova: incluir pending como confirmado; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"c1\",\n    \"status\": \"confirmed\"\n  },\n  {\n    \"id\": \"p2\",\n    \"status\": \"pending\"\n  },\n  {\n    \"id\": \"c3\",\n    \"status\": \"confirmed\"\n  }\n];\nconst expected = [\n  \"c1\",\n  \"c3\"\n];\nconst evaluate = x=>x.filter(r=>r.status===\"confirmed\").map(r=>r.id);\nconst mutant = x=>x.filter(r=>[\"confirmed\",\"pending\"].includes(r.status)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Browser testing e observação do fluxo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.2 / fixture: receipt permanece como lacuna. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"submit\",\n    \"response\",\n    \"receipt\"\n  ],\n  \"observed\": [\n    \"submit\",\n    \"response\"\n  ]\n};\nconst expected = [\n  \"receipt\"\n];\nconst evaluate = x=>x.required.filter(s=>!x.observed.includes(s));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.2 / contraprova: considerar submit suficiente para aprovar a jornada; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"submit\",\n    \"response\",\n    \"receipt\"\n  ],\n  \"observed\": [\n    \"submit\",\n    \"response\"\n  ]\n};\nconst expected = [\n  \"receipt\"\n];\nconst evaluate = x=>x.required.filter(s=>!x.observed.includes(s));\nconst mutant = x=>x.observed.includes(\"submit\")?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Scan de segurança e cobertura declarada": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.3 / fixture: crossTenant continua sem prova por esse scan. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"dependency\",\n    \"secret\",\n    \"crossTenant\"\n  ],\n  \"covered\": [\n    \"dependency\",\n    \"secret\"\n  ],\n  \"findings\": 0\n};\nconst expected = [\n  \"crossTenant\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.covered.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.3 / contraprova: declarar cobertura integral quando findings é zero; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"dependency\",\n    \"secret\",\n    \"crossTenant\"\n  ],\n  \"covered\": [\n    \"dependency\",\n    \"secret\"\n  ],\n  \"findings\": 0\n};\nconst expected = [\n  \"crossTenant\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.covered.includes(k));\nconst mutant = x=>x.findings===0?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Logs úteis sem credencial nem conteúdo privado": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.4 / fixture: o log não inclui token nem document. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requestId\": \"r8\",\n  \"stage\": \"reserve\",\n  \"code\": \"out_of_stock\",\n  \"token\": \"synthetic-private\",\n  \"document\": \"synthetic-document\"\n};\nconst expected = {\n  \"requestId\": \"r8\",\n  \"stage\": \"reserve\",\n  \"code\": \"out_of_stock\"\n};\nconst evaluate = x=>({requestId:x.requestId,stage:x.stage,code:x.code});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.4 / contraprova: devolver todo o registro de entrada; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requestId\": \"r8\",\n  \"stage\": \"reserve\",\n  \"code\": \"out_of_stock\",\n  \"token\": \"synthetic-private\",\n  \"document\": \"synthetic-document\"\n};\nconst expected = {\n  \"requestId\": \"r8\",\n  \"stage\": \"reserve\",\n  \"code\": \"out_of_stock\"\n};\nconst evaluate = x=>({requestId:x.requestId,stage:x.stage,code:x.code});\nconst mutant = x=>({...x});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Sincronização e identidade da branch ativa": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.1 / fixture: somente m1 pertence ao recorte. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"activeBranch\": \"main\",\n  \"commits\": [\n    {\n      \"id\": \"m1\",\n      \"branch\": \"main\"\n    },\n    {\n      \"id\": \"f2\",\n      \"branch\": \"feature-reserve\"\n    }\n  ]\n};\nconst expected = [\n  \"m1\"\n];\nconst evaluate = x=>x.commits.filter(c=>c.branch===x.activeBranch).map(c=>c.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.1 / contraprova: incluir commits de todas as branches; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"activeBranch\": \"main\",\n  \"commits\": [\n    {\n      \"id\": \"m1\",\n      \"branch\": \"main\"\n    },\n    {\n      \"id\": \"f2\",\n      \"branch\": \"feature-reserve\"\n    }\n  ]\n};\nconst expected = [\n  \"m1\"\n];\nconst evaluate = x=>x.commits.filter(c=>c.branch===x.activeBranch).map(c=>c.id);\nconst mutant = x=>x.commits.map(c=>c.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Histórico de código e estado dos dados": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.2 / fixture: codeRevision v8 e stock sete. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"codeRevision\": \"v9\",\n  \"target\": \"v8\",\n  \"stock\": 7\n};\nconst expected = {\n  \"codeRevision\": \"v8\",\n  \"stock\": 7\n};\nconst evaluate = x=>({codeRevision:x.target,stock:x.stock});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.2 / contraprova: restaurar também stock para dez sem prova de backup; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"codeRevision\": \"v9\",\n  \"target\": \"v8\",\n  \"stock\": 7\n};\nconst expected = {\n  \"codeRevision\": \"v8\",\n  \"stock\": 7\n};\nconst evaluate = x=>({codeRevision:x.target,stock:x.stock});\nconst mutant = x=>({codeRevision:x.target,stock:10});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Draft, remix e dependências não copiadas": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.3 / fixture: catálogo ready e pagamento pending. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"available\": [\n    \"code\"\n  ],\n  \"features\": [\n    {\n      \"id\": \"catalogo\",\n      \"needs\": [\n        \"code\"\n      ]\n    },\n    {\n      \"id\": \"pagamento\",\n      \"needs\": [\n        \"code\",\n        \"paymentSecret\"\n      ]\n    }\n  ]\n};\nconst expected = [\n  {\n    \"id\": \"catalogo\",\n    \"state\": \"ready\"\n  },\n  {\n    \"id\": \"pagamento\",\n    \"state\": \"pending\"\n  }\n];\nconst evaluate = x=>x.features.map(f=>({id:f.id,state:f.needs.every(k=>x.available.includes(k))?\"ready\":\"pending\"}));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.3 / contraprova: considerar code suficiente para toda capacidade; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"available\": [\n    \"code\"\n  ],\n  \"features\": [\n    {\n      \"id\": \"catalogo\",\n      \"needs\": [\n        \"code\"\n      ]\n    },\n    {\n      \"id\": \"pagamento\",\n      \"needs\": [\n        \"code\",\n        \"paymentSecret\"\n      ]\n    }\n  ]\n};\nconst expected = [\n  {\n    \"id\": \"catalogo\",\n    \"state\": \"ready\"\n  },\n  {\n    \"id\": \"pagamento\",\n    \"state\": \"pending\"\n  }\n];\nconst evaluate = x=>x.features.map(f=>({id:f.id,state:f.needs.every(k=>x.available.includes(k))?\"ready\":\"pending\"}));\nconst mutant = x=>x.features.map(f=>({id:f.id,state:x.available.includes(\"code\")?\"ready\":\"pending\"}));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Revisão com conflito e base preservada": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.4 / fixture: a base não coincide. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"current\": \"quantidade deve ser positiva\",\n  \"base\": \"quantidade inválida\",\n  \"baseDigest\": \"dd3e69b9c01c2a9735887098918156c30648c1f33a5ed4925b19aa5f37e4d717\",\n  \"path\": \"form.tsx\",\n  \"basePath\": \"form.tsx\"\n};\nconst expected = false;\nconst evaluate = x=>require(\"node:crypto\").createHash(\"sha256\").update(x.current).digest(\"hex\")===x.baseDigest;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.4 / contraprova: comparar somente o nome do arquivo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"current\": \"quantidade deve ser positiva\",\n  \"base\": \"quantidade inválida\",\n  \"baseDigest\": \"dd3e69b9c01c2a9735887098918156c30648c1f33a5ed4925b19aa5f37e4d717\",\n  \"path\": \"form.tsx\",\n  \"basePath\": \"form.tsx\"\n};\nconst expected = false;\nconst evaluate = x=>require(\"node:crypto\").createHash(\"sha256\").update(x.current).digest(\"hex\")===x.baseDigest;\nconst mutant = x=>x.path===x.basePath;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Release com revisão e gates pertinentes": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / fixture: tenant é a lacuna. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r4\",\n  \"required\": [\n    \"build\",\n    \"flow\",\n    \"tenant\"\n  ],\n  \"gates\": [\n    {\n      \"id\": \"build\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"id\": \"flow\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"id\": \"tenant\",\n      \"status\": \"passed\",\n      \"revision\": \"r3\"\n    }\n  ]\n};\nconst expected = [\n  \"tenant\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.gates.some(g=>g.id===k&&g.status===\"passed\"&&g.revision===x.revision));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / contraprova: verificar status sem revisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r4\",\n  \"required\": [\n    \"build\",\n    \"flow\",\n    \"tenant\"\n  ],\n  \"gates\": [\n    {\n      \"id\": \"build\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"id\": \"flow\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"id\": \"tenant\",\n      \"status\": \"passed\",\n      \"revision\": \"r3\"\n    }\n  ]\n};\nconst expected = [\n  \"tenant\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.gates.some(g=>g.id===k&&g.status===\"passed\"&&g.revision===x.revision));\nconst mutant = x=>x.required.filter(k=>!x.gates.some(g=>g.id===k&&g.status===\"passed\"));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Domínio customizado e estado DNS observado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.2 / fixture: o estado é pending. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"expectedTarget\": \"target.example\",\n  \"observedTarget\": \"target.example\",\n  \"tlsReady\": false\n};\nconst expected = \"pending\";\nconst evaluate = x=>x.expectedTarget===x.observedTarget&&x.tlsReady?\"ready\":\"pending\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.2 / contraprova: aprovar apenas pela igualdade de target; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"expectedTarget\": \"target.example\",\n  \"observedTarget\": \"target.example\",\n  \"tlsReady\": false\n};\nconst expected = \"pending\";\nconst evaluate = x=>x.expectedTarget===x.observedTarget&&x.tlsReady?\"ready\":\"pending\";\nconst mutant = x=>x.expectedTarget===x.observedTarget?\"ready\":\"pending\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "SEO, metadados e conteúdo entregue": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.3 / fixture: description usa publicDescription e canonical público. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"title\": \"Catálogo Quíron\",\n  \"publicDescription\": \"Itens disponíveis\",\n  \"canonical\": \"https://catalog.example/items\",\n  \"privateNote\": \"synthetic-internal\"\n};\nconst expected = {\n  \"title\": \"Catálogo Quíron\",\n  \"description\": \"Itens disponíveis\",\n  \"canonical\": \"https://catalog.example/items\"\n};\nconst evaluate = x=>({title:x.title,description:x.publicDescription,canonical:x.canonical});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.3 / contraprova: usar privateNote como description; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"title\": \"Catálogo Quíron\",\n  \"publicDescription\": \"Itens disponíveis\",\n  \"canonical\": \"https://catalog.example/items\",\n  \"privateNote\": \"synthetic-internal\"\n};\nconst expected = {\n  \"title\": \"Catálogo Quíron\",\n  \"description\": \"Itens disponíveis\",\n  \"canonical\": \"https://catalog.example/items\"\n};\nconst evaluate = x=>({title:x.title,description:x.publicDescription,canonical:x.canonical});\nconst mutant = x=>({title:x.title,description:x.privateNote,canonical:x.canonical});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Uso, custo e limite por operação": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.4 / fixture: o custo estimado é doze unidades. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requests\": 3,\n  \"unitCost\": 4\n};\nconst expected = 12;\nconst evaluate = x=>x.requests*x.unitCost;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.4 / contraprova: retornar apenas o custo unitário; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requests\": 3,\n  \"unitCost\": 4\n};\nconst expected = 12;\nconst evaluate = x=>x.requests*x.unitCost;\nconst mutant = x=>x.unitCost;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Protótipo visual e função realmente disponível": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.1 / fixture: a capacidade permanece demonstration. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"mode\": \"live\",\n  \"backendVerified\": false\n};\nconst expected = \"demonstration\";\nconst evaluate = x=>x.mode===\"live\"&&x.backendVerified?\"operational\":\"demonstration\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.1 / contraprova: considerar mode live suficiente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"mode\": \"live\",\n  \"backendVerified\": false\n};\nconst expected = \"demonstration\";\nconst evaluate = x=>x.mode===\"live\"&&x.backendVerified?\"operational\":\"demonstration\";\nconst mutant = x=>x.mode===\"live\"?\"operational\":\"demonstration\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Resultado desconhecido e retry controlado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.2 / fixture: a próxima ação é reconcile. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"state\": \"unknown\"\n};\nconst expected = \"reconcile\";\nconst evaluate = x=>({unknown:\"reconcile\",failed:\"retry\",succeeded:\"done\"})[x.state];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.2 / contraprova: retornar retry para qualquer estado não succeeded; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"state\": \"unknown\"\n};\nconst expected = \"reconcile\";\nconst evaluate = x=>({unknown:\"reconcile\",failed:\"retry\",succeeded:\"done\"})[x.state];\nconst mutant = x=>x.state===\"succeeded\"?\"done\":\"retry\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Migração de stack e biblioteca incompatível": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / fixture: chart-old é a condição conhecida incompatível. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"target\": \"server\",\n  \"packages\": [\n    {\n      \"id\": \"chart-old\",\n      \"importTimeBrowser\": true,\n      \"installable\": true\n    },\n    {\n      \"id\": \"util-safe\",\n      \"importTimeBrowser\": false,\n      \"installable\": true\n    }\n  ]\n};\nconst expected = [\n  \"chart-old\"\n];\nconst evaluate = x=>x.packages.filter(p=>x.target===\"server\"&&p.importTimeBrowser).map(p=>p.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / contraprova: considerar installable suficiente para compatibilidade; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"target\": \"server\",\n  \"packages\": [\n    {\n      \"id\": \"chart-old\",\n      \"importTimeBrowser\": true,\n      \"installable\": true\n    },\n    {\n      \"id\": \"util-safe\",\n      \"importTimeBrowser\": false,\n      \"installable\": true\n    }\n  ]\n};\nconst expected = [\n  \"chart-old\"\n];\nconst evaluate = x=>x.packages.filter(p=>x.target===\"server\"&&p.importTimeBrowser).map(p=>p.id);\nconst mutant = x=>x.packages.filter(p=>!p.installable).map(p=>p.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Rollback de versão e compatibilidade de schema": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.4 / fixture: legacyCode é a lacuna. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requiredFields\": [\n    \"qty\",\n    \"status\",\n    \"legacyCode\"\n  ],\n  \"schemaFields\": [\n    \"qty\",\n    \"status\"\n  ]\n};\nconst expected = [\n  \"legacyCode\"\n];\nconst evaluate = x=>x.requiredFields.filter(k=>!x.schemaFields.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.4 / contraprova: aceitar compatibilidade pela presença de qty; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requiredFields\": [\n    \"qty\",\n    \"status\",\n    \"legacyCode\"\n  ],\n  \"schemaFields\": [\n    \"qty\",\n    \"status\"\n  ]\n};\nconst expected = [\n  \"legacyCode\"\n];\nconst evaluate = x=>x.requiredFields.filter(k=>!x.schemaFields.includes(k));\nconst mutant = x=>x.schemaFields.includes(\"qty\")?[]:x.requiredFields;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Reserva com intenção e identidade do ator": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.1 / fixture: as identidades são diferentes. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"actorTenant\": \"t1\",\n    \"intentId\": \"i7\"\n  },\n  \"b\": {\n    \"actorTenant\": \"t2\",\n    \"intentId\": \"i7\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>JSON.stringify([x.a.actorTenant,x.a.intentId])===JSON.stringify([x.b.actorTenant,x.b.intentId]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.1 / contraprova: comparar somente intentId; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"actorTenant\": \"t1\",\n    \"intentId\": \"i7\"\n  },\n  \"b\": {\n    \"actorTenant\": \"t2\",\n    \"intentId\": \"i7\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>JSON.stringify([x.a.actorTenant,x.a.intentId])===JSON.stringify([x.b.actorTenant,x.b.intentId]);\nconst mutant = x=>x.a.intentId===x.b.intentId;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Total monetário e quantidade inteira": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.2 / fixture: o total é 597 centavos. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"unitCents\": 199,\n  \"qty\": 3\n};\nconst expected = 597;\nconst evaluate = x=>x.unitCents*x.qty;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.2 / contraprova: arredondar preço em unidades e voltar a centavos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"unitCents\": 199,\n  \"qty\": 3\n};\nconst expected = 597;\nconst evaluate = x=>x.unitCents*x.qty;\nconst mutant = x=>Math.round(x.unitCents/100)*100*x.qty;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Conservação de estoque em atualização condicional": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / fixture: resultado conflict e stock um. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 1,\n  \"qty\": 1,\n  \"currentVersion\": 2,\n  \"expectedVersion\": 1\n};\nconst expected = {\n  \"result\": \"conflict\",\n  \"stock\": 1\n};\nconst evaluate = x=>x.currentVersion!==x.expectedVersion?{result:\"conflict\",stock:x.stock}:x.qty>x.stock?{result:\"insufficient\",stock:x.stock}:{result:\"confirmed\",stock:x.stock-x.qty};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / contraprova: conferir apenas quantidade e debitar; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 1,\n  \"qty\": 1,\n  \"currentVersion\": 2,\n  \"expectedVersion\": 1\n};\nconst expected = {\n  \"result\": \"conflict\",\n  \"stock\": 1\n};\nconst evaluate = x=>x.currentVersion!==x.expectedVersion?{result:\"conflict\",stock:x.stock}:x.qty>x.stock?{result:\"insufficient\",stock:x.stock}:{result:\"confirmed\",stock:x.stock-x.qty};\nconst mutant = x=>x.qty>x.stock?{result:\"insufficient\",stock:x.stock}:{result:\"confirmed\",stock:x.stock-x.qty};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Entrega completa e fronteira da evidência": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / fixture: localPassed contém e1 e e2; nativePassed está vazio. Prova local declarada, sem agente ou efeito Lovable.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"e1\",\n    \"status\": \"passed\",\n    \"environment\": \"local\"\n  },\n  {\n    \"id\": \"e2\",\n    \"status\": \"passed\",\n    \"environment\": \"local\"\n  },\n  {\n    \"id\": \"browser\",\n    \"status\": \"pending\",\n    \"environment\": \"native\"\n  }\n];\nconst expected = {\n  \"localPassed\": [\n    \"e1\",\n    \"e2\"\n  ],\n  \"nativePassed\": []\n};\nconst evaluate = x=>({localPassed:x.filter(g=>g.status===\"passed\"&&g.environment===\"local\").map(g=>g.id),nativePassed:x.filter(g=>g.status===\"passed\"&&g.environment===\"native\").map(g=>g.id)});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / contraprova: promover todo passed para nativePassed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"e1\",\n    \"status\": \"passed\",\n    \"environment\": \"local\"\n  },\n  {\n    \"id\": \"e2\",\n    \"status\": \"passed\",\n    \"environment\": \"local\"\n  },\n  {\n    \"id\": \"browser\",\n    \"status\": \"pending\",\n    \"environment\": \"native\"\n  }\n];\nconst expected = {\n  \"localPassed\": [\n    \"e1\",\n    \"e2\"\n  ],\n  \"nativePassed\": []\n};\nconst evaluate = x=>({localPassed:x.filter(g=>g.status===\"passed\"&&g.environment===\"local\").map(g=>g.id),nativePassed:x.filter(g=>g.status===\"passed\"&&g.environment===\"native\").map(g=>g.id)});\nconst mutant = x=>({localPassed:x.filter(g=>g.status===\"passed\").map(g=>g.id),nativePassed:x.filter(g=>g.status===\"passed\").map(g=>g.id)});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ]
};
