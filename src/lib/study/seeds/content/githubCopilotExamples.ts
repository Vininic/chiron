export interface GitHubCopilotExample {lang:string;scope:"local-rule"|"local-transform"|"model";purpose:string;code:string}
export const GITHUB_COPILOT_EXAMPLES: Record<string,[GitHubCopilotExample,GitHubCopilotExample]> = {
  "Sugestão, Chat e agente como operações diferentes": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / fixture: apenas o identificador test-run é selecionado. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"proposal\",\n    \"kind\": \"suggestion\",\n    \"text\": \"pnpm test\"\n  },\n  {\n    \"id\": \"read-file\",\n    \"kind\": \"read\",\n    \"text\": \"test specification\"\n  },\n  {\n    \"id\": \"test-run\",\n    \"kind\": \"execute\",\n    \"text\": \"pnpm test\",\n    \"exitCode\": 0\n  }\n];\nconst expected = [\n  \"test-run\"\n];\nconst evaluate = x=>x.filter(r=>r.kind===\"execute\"&&r.exitCode===0).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / contraprova: selecionar todo registro cujo texto contém test; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"proposal\",\n    \"kind\": \"suggestion\",\n    \"text\": \"pnpm test\"\n  },\n  {\n    \"id\": \"read-file\",\n    \"kind\": \"read\",\n    \"text\": \"test specification\"\n  },\n  {\n    \"id\": \"test-run\",\n    \"kind\": \"execute\",\n    \"text\": \"pnpm test\",\n    \"exitCode\": 0\n  }\n];\nconst expected = [\n  \"test-run\"\n];\nconst evaluate = x=>x.filter(r=>r.kind===\"execute\"&&r.exitCode===0).map(r=>r.id);\nconst mutant = x=>x.filter(r=>r.text.includes(\"test\")).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Conta, extensão e matriz de suporte": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C1.2 / fixture: a consulta de agent retorna false. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"ide\": \"q\",\n  \"feature\": \"chat\",\n  \"mode\": \"agent\",\n  \"rows\": [\n    {\n      \"ide\": \"q\",\n      \"feature\": \"chat\",\n      \"mode\": \"ask\",\n      \"enabled\": true\n    },\n    {\n      \"ide\": \"q\",\n      \"feature\": \"chat\",\n      \"mode\": \"agent\",\n      \"enabled\": false\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = x=>x.rows.some(r=>r.ide===x.ide&&r.feature===x.feature&&r.mode===x.mode&&r.enabled);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C1.2 / contraprova: aceitar qualquer linha habilitada do mesmo IDE; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"ide\": \"q\",\n  \"feature\": \"chat\",\n  \"mode\": \"agent\",\n  \"rows\": [\n    {\n      \"ide\": \"q\",\n      \"feature\": \"chat\",\n      \"mode\": \"ask\",\n      \"enabled\": true\n    },\n    {\n      \"ide\": \"q\",\n      \"feature\": \"chat\",\n      \"mode\": \"agent\",\n      \"enabled\": false\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = x=>x.rows.some(r=>r.ide===x.ide&&r.feature===x.feature&&r.mode===x.mode&&r.enabled);\nconst mutant = x=>x.rows.some(r=>r.ide===x.ide&&r.enabled);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Workspace e revisão da evidência": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.3 / fixture: a evidência não corresponde ao arquivo final. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"run\": {\n    \"revision\": \"r4\",\n    \"digest\": \"A\"\n  },\n  \"final\": {\n    \"revision\": \"r4\",\n    \"digest\": \"B\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.run.revision===x.final.revision&&x.run.digest===x.final.digest;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.3 / contraprova: comparar somente revision; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"run\": {\n    \"revision\": \"r4\",\n    \"digest\": \"A\"\n  },\n  \"final\": {\n    \"revision\": \"r4\",\n    \"digest\": \"B\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.run.revision===x.final.revision&&x.run.digest===x.final.digest;\nconst mutant = x=>x.run.revision===x.final.revision;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Pedido com comportamento e restrições": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / fixture: a lista contém no-write-on-reject. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"valid\",\n    \"tenant\",\n    \"no-write-on-reject\"\n  ],\n  \"covered\": [\n    \"valid\",\n    \"tenant\"\n  ]\n};\nconst expected = [\n  \"no-write-on-reject\"\n];\nconst evaluate = x=>x.required.filter(r=>!x.covered.includes(r));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / contraprova: considerar somente os dois primeiros requisitos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"valid\",\n    \"tenant\",\n    \"no-write-on-reject\"\n  ],\n  \"covered\": [\n    \"valid\",\n    \"tenant\"\n  ]\n};\nconst expected = [\n  \"no-write-on-reject\"\n];\nconst evaluate = x=>x.required.filter(r=>!x.covered.includes(r));\nconst mutant = x=>x.required.slice(0,2).filter(r=>!x.covered.includes(r));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Cursor, prefixo e sufixo da sugestão": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.1 / fixture: o texto contém return tenantOk && stockOk;. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"prefix\": \"return \",\n  \"insert\": \"tenantOk\",\n  \"suffix\": \" && stockOk;\"\n};\nconst expected = \"return tenantOk && stockOk;\";\nconst evaluate = x=>x.prefix+x.insert+x.suffix;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.1 / contraprova: montar somente prefixo e inserção; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"prefix\": \"return \",\n  \"insert\": \"tenantOk\",\n  \"suffix\": \" && stockOk;\"\n};\nconst expected = \"return tenantOk && stockOk;\";\nconst evaluate = x=>x.prefix+x.insert+x.suffix;\nconst mutant = x=>x.prefix+x.insert;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Aceitação parcial e contexto de edição": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.2 / fixture: validate e helper são os fragmentos aceitos. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"validate\",\n    \"group\": \"quantity\",\n    \"remote\": false\n  },\n  {\n    \"id\": \"helper\",\n    \"group\": \"quantity\",\n    \"remote\": false\n  },\n  {\n    \"id\": \"enrich\",\n    \"group\": \"quantity\",\n    \"remote\": true\n  }\n];\nconst expected = [\n  \"validate\",\n  \"helper\"\n];\nconst evaluate = x=>x.filter(r=>r.group===\"quantity\"&&!r.remote).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.2 / contraprova: aceitar todos os fragmentos do grupo quantity; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"validate\",\n    \"group\": \"quantity\",\n    \"remote\": false\n  },\n  {\n    \"id\": \"helper\",\n    \"group\": \"quantity\",\n    \"remote\": false\n  },\n  {\n    \"id\": \"enrich\",\n    \"group\": \"quantity\",\n    \"remote\": true\n  }\n];\nconst expected = [\n  \"validate\",\n  \"helper\"\n];\nconst evaluate = x=>x.filter(r=>r.group===\"quantity\"&&!r.remote).map(r=>r.id);\nconst mutant = x=>x.filter(r=>r.group===\"quantity\").map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Next edit suggestions e consumidores": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / fixture: os consumidores são api e worker. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"api\",\n    \"kind\": \"call\",\n    \"symbol\": \"reserve\",\n    \"text\": \"reserve(q)\"\n  },\n  {\n    \"id\": \"worker\",\n    \"kind\": \"call\",\n    \"symbol\": \"reserve\",\n    \"text\": \"reserve(job)\"\n  },\n  {\n    \"id\": \"history\",\n    \"kind\": \"doc\",\n    \"symbol\": null,\n    \"text\": \"reserve v1\"\n  },\n  {\n    \"id\": \"report\",\n    \"kind\": \"call\",\n    \"symbol\": \"reserveReport\",\n    \"text\": \"reserveReport()\"\n  }\n];\nconst expected = [\n  \"api\",\n  \"worker\"\n];\nconst evaluate = x=>x.filter(r=>r.kind===\"call\"&&r.symbol===\"reserve\").map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / contraprova: selecionar qualquer texto contendo reserve; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"api\",\n    \"kind\": \"call\",\n    \"symbol\": \"reserve\",\n    \"text\": \"reserve(q)\"\n  },\n  {\n    \"id\": \"worker\",\n    \"kind\": \"call\",\n    \"symbol\": \"reserve\",\n    \"text\": \"reserve(job)\"\n  },\n  {\n    \"id\": \"history\",\n    \"kind\": \"doc\",\n    \"symbol\": null,\n    \"text\": \"reserve v1\"\n  },\n  {\n    \"id\": \"report\",\n    \"kind\": \"call\",\n    \"symbol\": \"reserveReport\",\n    \"text\": \"reserveReport()\"\n  }\n];\nconst expected = [\n  \"api\",\n  \"worker\"\n];\nconst evaluate = x=>x.filter(r=>r.kind===\"call\"&&r.symbol===\"reserve\").map(r=>r.id);\nconst mutant = x=>x.filter(r=>r.text.includes(\"reserve\")).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Referências de código público e procedência": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.4 / fixture: permanecem u/MIT e u/Apache-2.0. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"url\": \"u\",\n    \"license\": \"MIT\"\n  },\n  {\n    \"url\": \"u\",\n    \"license\": \"Apache-2.0\"\n  },\n  {\n    \"url\": \"u\",\n    \"license\": \"MIT\"\n  }\n];\nconst expected = [\n  {\n    \"url\": \"u\",\n    \"license\": \"MIT\"\n  },\n  {\n    \"url\": \"u\",\n    \"license\": \"Apache-2.0\"\n  }\n];\nconst evaluate = x=>[...new Map(x.map(r=>[JSON.stringify([r.url,r.license]),r])).values()];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.4 / contraprova: deduplicar somente por URL; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"url\": \"u\",\n    \"license\": \"MIT\"\n  },\n  {\n    \"url\": \"u\",\n    \"license\": \"Apache-2.0\"\n  },\n  {\n    \"url\": \"u\",\n    \"license\": \"MIT\"\n  }\n];\nconst expected = [\n  {\n    \"url\": \"u\",\n    \"license\": \"MIT\"\n  },\n  {\n    \"url\": \"u\",\n    \"license\": \"Apache-2.0\"\n  }\n];\nconst evaluate = x=>[...new Map(x.map(r=>[JSON.stringify([r.url,r.license]),r])).values()];\nconst mutant = x=>[...new Map(x.map(r=>[r.url,r])).values()];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Perguntas com casos e unidades explícitas": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.1 / fixture: o resultado é 2500. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"seconds\": 2.5\n};\nconst expected = 2500;\nconst evaluate = x=>x.seconds*1000;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.1 / contraprova: devolver segundos sem conversão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"seconds\": 2.5\n};\nconst expected = 2500;\nconst evaluate = x=>x.seconds*1000;\nconst mutant = x=>x.seconds;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Seleção de arquivos e orçamento de contexto": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.2 / fixture: route e auth ocupam nove unidades. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"budget\": 10,\n  \"files\": [\n    {\n      \"id\": \"route\",\n      \"bytes\": 4,\n      \"relevant\": true,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"auth\",\n      \"bytes\": 5,\n      \"relevant\": true,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"secret\",\n      \"bytes\": 1,\n      \"relevant\": true,\n      \"sensitive\": true\n    },\n    {\n      \"id\": \"image\",\n      \"bytes\": 1,\n      \"relevant\": false,\n      \"sensitive\": false\n    }\n  ]\n};\nconst expected = [\n  \"route\",\n  \"auth\"\n];\nconst evaluate = x=>{let used=0;const ids=[];for(const r of x.files){if(!r.relevant||r.sensitive)continue;if(used+r.bytes>x.budget)break;used+=r.bytes;ids.push(r.id);}return ids;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.2 / contraprova: selecionar todos os arquivos que cabem sem conferir relevância ou sensibilidade; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"budget\": 10,\n  \"files\": [\n    {\n      \"id\": \"route\",\n      \"bytes\": 4,\n      \"relevant\": true,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"auth\",\n      \"bytes\": 5,\n      \"relevant\": true,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"secret\",\n      \"bytes\": 1,\n      \"relevant\": true,\n      \"sensitive\": true\n    },\n    {\n      \"id\": \"image\",\n      \"bytes\": 1,\n      \"relevant\": false,\n      \"sensitive\": false\n    }\n  ]\n};\nconst expected = [\n  \"route\",\n  \"auth\"\n];\nconst evaluate = x=>{let used=0;const ids=[];for(const r of x.files){if(!r.relevant||r.sensitive)continue;if(used+r.bytes>x.budget)break;used+=r.bytes;ids.push(r.id);}return ids;};\nconst mutant = x=>{let n=0;return x.files.filter(r=>{if(n+r.bytes>x.budget)return false;n+=r.bytes;return true;}).map(r=>r.id);};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Explicação confrontada com fluxo de chamadas": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.3 / fixture: a ordem requerida retorna false. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"parse\",\n  \"writeStock\",\n  \"validateTenant\",\n  \"respond\"\n];\nconst expected = false;\nconst evaluate = x=>{const a=x.indexOf(\"validateTenant\"),b=x.indexOf(\"writeStock\");return a>=0&&b>=0&&a<b;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.3 / contraprova: aprovar se validateTenant aparece em qualquer posição; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"parse\",\n  \"writeStock\",\n  \"validateTenant\",\n  \"respond\"\n];\nconst expected = false;\nconst evaluate = x=>{const a=x.indexOf(\"validateTenant\"),b=x.indexOf(\"writeStock\");return a>=0&&b>=0&&a<b;};\nconst mutant = x=>x.includes(\"validateTenant\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Histórico relevante e hipótese revogada": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.4 / fixture: permanece consumer-tenant. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"kind\": \"propose\",\n    \"id\": \"cache\"\n  },\n  {\n    \"kind\": \"revoke\",\n    \"id\": \"cache\"\n  },\n  {\n    \"kind\": \"propose\",\n    \"id\": \"consumer-tenant\"\n  }\n];\nconst expected = [\n  \"consumer-tenant\"\n];\nconst evaluate = x=>{const a=new Set();for(const e of x){if(e.kind===\"propose\")a.add(e.id);else if(e.kind===\"revoke\")a.delete(e.id);}return [...a];};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.4 / contraprova: acumular propostas ignorando revoke; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"kind\": \"propose\",\n    \"id\": \"cache\"\n  },\n  {\n    \"kind\": \"revoke\",\n    \"id\": \"cache\"\n  },\n  {\n    \"kind\": \"propose\",\n    \"id\": \"consumer-tenant\"\n  }\n];\nconst expected = [\n  \"consumer-tenant\"\n];\nconst evaluate = x=>{const a=new Set();for(const e of x){if(e.kind===\"propose\")a.add(e.id);else if(e.kind===\"revoke\")a.delete(e.id);}return [...a];};\nconst mutant = x=>x.filter(e=>e.kind===\"propose\").map(e=>e.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "copilot-instructions.md e contrato do repositório": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / fixture: test:integration é a referência quebrada. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"test\",\n    \"typecheck\",\n    \"test:integration\"\n  ],\n  \"scripts\": {\n    \"test\": \"vitest run\",\n    \"typecheck\": \"tsc --noEmit\"\n  }\n};\nconst expected = [\n  \"test:integration\"\n];\nconst evaluate = x=>x.required.filter(k=>!Object.hasOwn(x.scripts,k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / contraprova: aprovar todas as exigências quando existe test; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"test\",\n    \"typecheck\",\n    \"test:integration\"\n  ],\n  \"scripts\": {\n    \"test\": \"vitest run\",\n    \"typecheck\": \"tsc --noEmit\"\n  }\n};\nconst expected = [\n  \"test:integration\"\n];\nconst evaluate = x=>x.required.filter(k=>!Object.hasOwn(x.scripts,k));\nconst mutant = x=>Object.hasOwn(x.scripts,\"test\")?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "applyTo e suporte por superfície": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.2 / fixture: somente src/ui/cart.ts corresponde. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"prefix\": \"src/ui/\",\n  \"paths\": [\n    \"src/ui/cart.ts\",\n    \"src/uikit/token.ts\",\n    \"src/api/order.ts\"\n  ]\n};\nconst expected = [\n  \"src/ui/cart.ts\"\n];\nconst evaluate = x=>x.paths.filter(p=>p.startsWith(x.prefix));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.2 / contraprova: remover a barra final antes da seleção; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"prefix\": \"src/ui/\",\n  \"paths\": [\n    \"src/ui/cart.ts\",\n    \"src/uikit/token.ts\",\n    \"src/api/order.ts\"\n  ]\n};\nconst expected = [\n  \"src/ui/cart.ts\"\n];\nconst evaluate = x=>x.paths.filter(p=>p.startsWith(x.prefix));\nconst mutant = x=>x.paths.filter(p=>p.startsWith(x.prefix.slice(0,-1)));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Prompt reutilizável e parâmetros da tarefa": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.3 / fixture: invariant permanece ausente semanticamente. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"module\",\n    \"invariant\"\n  ],\n  \"values\": {\n    \"module\": \"inventory\",\n    \"invariant\": \"   \"\n  }\n};\nconst expected = [\n  \"invariant\"\n];\nconst evaluate = x=>x.required.filter(k=>typeof x.values[k]!==\"string\"||!x.values[k].trim());\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.3 / contraprova: conferir apenas Object.hasOwn; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"module\",\n    \"invariant\"\n  ],\n  \"values\": {\n    \"module\": \"inventory\",\n    \"invariant\": \"   \"\n  }\n};\nconst expected = [\n  \"invariant\"\n];\nconst evaluate = x=>x.required.filter(k=>typeof x.values[k]!==\"string\"||!x.values[k].trim());\nconst mutant = x=>x.required.filter(k=>!Object.hasOwn(x.values,k));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Skill, recursos e avaliação de procedimento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.4 / fixture: lost-update é a lacuna. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"tenant\",\n    \"replay\",\n    \"lost-update\"\n  ],\n  \"cases\": [\n    {\n      \"class\": \"tenant\"\n    },\n    {\n      \"class\": \"replay\"\n    },\n    {\n      \"class\": \"style\"\n    },\n    {\n      \"class\": \"style\"\n    }\n  ]\n};\nconst expected = [\n  \"lost-update\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.cases.some(c=>c.class===k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.4 / contraprova: aceitar cobertura se o número de casos supera o número de classes; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"tenant\",\n    \"replay\",\n    \"lost-update\"\n  ],\n  \"cases\": [\n    {\n      \"class\": \"tenant\"\n    },\n    {\n      \"class\": \"replay\"\n    },\n    {\n      \"class\": \"style\"\n    },\n    {\n      \"class\": \"style\"\n    }\n  ]\n};\nconst expected = [\n  \"lost-update\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.cases.some(c=>c.class===k));\nconst mutant = x=>x.cases.length>=x.required.length?[]:x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Plano com dependências e critérios de término": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.1 / fixture: a ordem é inválida. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"order\": [\n    \"consumer\",\n    \"schema\",\n    \"regression\"\n  ],\n  \"deps\": {\n    \"schema\": [],\n    \"consumer\": [\n      \"schema\"\n    ],\n    \"regression\": [\n      \"schema\",\n      \"consumer\"\n    ]\n  }\n};\nconst expected = false;\nconst evaluate = x=>{const done=new Set();for(const s of x.order){if((x.deps[s]??[]).some(d=>!done.has(d)))return false;done.add(s);}return true;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C5.1 / contraprova: validar somente a presença dos nomes; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"order\": [\n    \"consumer\",\n    \"schema\",\n    \"regression\"\n  ],\n  \"deps\": {\n    \"schema\": [],\n    \"consumer\": [\n      \"schema\"\n    ],\n    \"regression\": [\n      \"schema\",\n      \"consumer\"\n    ]\n  }\n};\nconst expected = false;\nconst evaluate = x=>{const done=new Set();for(const s of x.order){if((x.deps[s]??[]).some(d=>!done.has(d)))return false;done.add(s);}return true;};\nconst mutant = x=>Object.keys(x.deps).every(k=>x.order.includes(k));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Mudança entre arquivos e base do patch": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / fixture: o resultado é stale. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"version=1\",\n  \"current\": \"version=2\",\n  \"expectedDigest\": \"e4f056fd4639e583746e12de25a0c9af93cbb5a0394d9819baac4036a2f34c8f\",\n  \"replacement\": \"version=3\"\n};\nconst expected = \"stale\";\nconst evaluate = x=>require(\"node:crypto\").createHash(\"sha256\").update(x.current).digest(\"hex\")===x.expectedDigest?x.replacement:\"stale\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / contraprova: aplicar a troca sem verificar digest; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"version=1\",\n  \"current\": \"version=2\",\n  \"expectedDigest\": \"e4f056fd4639e583746e12de25a0c9af93cbb5a0394d9819baac4036a2f34c8f\",\n  \"replacement\": \"version=3\"\n};\nconst expected = \"stale\";\nconst evaluate = x=>require(\"node:crypto\").createHash(\"sha256\").update(x.current).digest(\"hex\")===x.expectedDigest?x.replacement:\"stale\";\nconst mutant = x=>x.replacement;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Ferramenta, shell e efeito autorizado": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.3 / fixture: argv tem exec, vitest, run e o caminho inteiro. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"tests/tenant reserve.test.ts\"\n};\nconst expected = [\n  \"exec\",\n  \"vitest\",\n  \"run\",\n  \"tests/tenant reserve.test.ts\"\n];\nconst evaluate = x=>[\"exec\",\"vitest\",\"run\",x.path];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.3 / contraprova: dividir o caminho em espaços; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"tests/tenant reserve.test.ts\"\n};\nconst expected = [\n  \"exec\",\n  \"vitest\",\n  \"run\",\n  \"tests/tenant reserve.test.ts\"\n];\nconst evaluate = x=>[\"exec\",\"vitest\",\"run\",x.path];\nconst mutant = x=>[\"exec\",\"vitest\",\"run\",...x.path.split(\" \")];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Recuperação de edição e trabalho alheio": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.4 / fixture: somente validateQuantity entra na recuperação. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"task\": \"t\",\n  \"changes\": [\n    {\n      \"id\": \"validateQuantity\",\n      \"owner\": \"t\"\n    },\n    {\n      \"id\": \"renderSummary\",\n      \"owner\": \"u\"\n    }\n  ]\n};\nconst expected = [\n  \"validateQuantity\"\n];\nconst evaluate = x=>x.changes.filter(c=>c.owner===x.task).map(c=>c.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.4 / contraprova: reverter todas as mudanças do mesmo arquivo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"task\": \"t\",\n  \"changes\": [\n    {\n      \"id\": \"validateQuantity\",\n      \"owner\": \"t\"\n    },\n    {\n      \"id\": \"renderSummary\",\n      \"owner\": \"u\"\n    }\n  ]\n};\nconst expected = [\n  \"validateQuantity\"\n];\nconst evaluate = x=>x.changes.filter(c=>c.owner===x.task).map(c=>c.id);\nconst mutant = x=>x.changes.map(c=>c.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Teste independente da resposta gerada": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.1 / fixture: o total é cinco. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"qty\": 2\n  },\n  {\n    \"qty\": 3\n  }\n];\nconst expected = 5;\nconst evaluate = x=>x.reduce((n,r)=>n+r.qty,0);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.1 / contraprova: retornar o número de linhas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"qty\": 2\n  },\n  {\n    \"qty\": 3\n  }\n];\nconst expected = 5;\nconst evaluate = x=>x.reduce((n,r)=>n+r.qty,0);\nconst mutant = x=>x.length;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Casos de fronteira e propriedade de domínio": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.2 / fixture: a quantidade é inválida. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": 9007199254740992\n};\nconst expected = false;\nconst evaluate = x=>Number.isSafeInteger(x.qty)&&x.qty>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.2 / contraprova: usar Number.isInteger sem faixa segura; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": 9007199254740992\n};\nconst expected = false;\nconst evaluate = x=>Number.isSafeInteger(x.qty)&&x.qty>0;\nconst mutant = x=>Number.isInteger(x.qty)&&x.qty>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Refatoração que preserva consumidores": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.3 / fixture: sorted é a,b e input permanece b,a. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"b\",\n  \"a\"\n];\nconst expected = {\n  \"sorted\": [\n    \"a\",\n    \"b\"\n  ],\n  \"input\": [\n    \"b\",\n    \"a\"\n  ]\n};\nconst evaluate = x=>{const input=[...x];return {sorted:[...input].sort(),input};};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.3 / contraprova: ordenar o array original; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"b\",\n  \"a\"\n];\nconst expected = {\n  \"sorted\": [\n    \"a\",\n    \"b\"\n  ],\n  \"input\": [\n    \"b\",\n    \"a\"\n  ]\n};\nconst evaluate = x=>{const input=[...x];return {sorted:[...input].sort(),input};};\nconst mutant = x=>{const input=[...x];return {sorted:input.sort(),input};};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Seleção de gates e revisão final": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.4 / fixture: faltam typecheck e build. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r2\",\n  \"required\": [\n    \"typecheck\",\n    \"domain\",\n    \"build\"\n  ],\n  \"runs\": [\n    {\n      \"gate\": \"typecheck\",\n      \"revision\": \"r1\",\n      \"status\": \"passed\"\n    },\n    {\n      \"gate\": \"domain\",\n      \"revision\": \"r2\",\n      \"status\": \"passed\"\n    },\n    {\n      \"gate\": \"build\",\n      \"revision\": \"r2\",\n      \"status\": \"pending\"\n    }\n  ]\n};\nconst expected = [\n  \"typecheck\",\n  \"build\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.runs.some(r=>r.gate===k&&r.revision===x.revision&&r.status===\"passed\"));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.4 / contraprova: aceitar qualquer registro com o nome exigido; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r2\",\n  \"required\": [\n    \"typecheck\",\n    \"domain\",\n    \"build\"\n  ],\n  \"runs\": [\n    {\n      \"gate\": \"typecheck\",\n      \"revision\": \"r1\",\n      \"status\": \"passed\"\n    },\n    {\n      \"gate\": \"domain\",\n      \"revision\": \"r2\",\n      \"status\": \"passed\"\n    },\n    {\n      \"gate\": \"build\",\n      \"revision\": \"r2\",\n      \"status\": \"pending\"\n    }\n  ]\n};\nconst expected = [\n  \"typecheck\",\n  \"build\"\n];\nconst evaluate = x=>x.required.filter(k=>!x.runs.some(r=>r.gate===k&&r.revision===x.revision&&r.status===\"passed\"));\nconst mutant = x=>x.required.filter(k=>!x.runs.some(r=>r.gate===k));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Servidor MCP e identidade da ferramenta": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.1 / fixture: a origem selecionada é docs. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"server\": \"docs\",\n  \"tool\": \"search\",\n  \"tools\": [\n    {\n      \"server\": \"orders\",\n      \"tool\": \"search\"\n    },\n    {\n      \"server\": \"docs\",\n      \"tool\": \"search\"\n    }\n  ]\n};\nconst expected = \"docs\";\nconst evaluate = x=>x.tools.find(t=>t.server===x.server&&t.tool===x.tool)?.server;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.1 / contraprova: selecionar somente pelo nome tool; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"server\": \"docs\",\n  \"tool\": \"search\",\n  \"tools\": [\n    {\n      \"server\": \"orders\",\n      \"tool\": \"search\"\n    },\n    {\n      \"server\": \"docs\",\n      \"tool\": \"search\"\n    }\n  ]\n};\nconst expected = \"docs\";\nconst evaluate = x=>x.tools.find(t=>t.server===x.server&&t.tool===x.tool)?.server;\nconst mutant = x=>x.tools.find(t=>t.tool===x.tool)?.server;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Capacidade mínima e autorização de operação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.2 / fixture: delete não é autorizado. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"capabilities\": [\n    {\n      \"tenant\": \"a\",\n      \"operation\": \"read\"\n    }\n  ],\n  \"request\": {\n    \"tenant\": \"a\",\n    \"operation\": \"delete\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.capabilities.some(c=>c.tenant===x.request.tenant&&c.operation===x.request.operation);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.2 / contraprova: conferir somente tenant; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"capabilities\": [\n    {\n      \"tenant\": \"a\",\n      \"operation\": \"read\"\n    }\n  ],\n  \"request\": {\n    \"tenant\": \"a\",\n    \"operation\": \"delete\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.capabilities.some(c=>c.tenant===x.request.tenant&&c.operation===x.request.operation);\nconst mutant = x=>x.capabilities.some(c=>c.tenant===x.request.tenant);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Retorno remoto como dado não confiável": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.3 / fixture: o retorno é inadequado à consulta. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"request\": {\n    \"orderId\": \"o7\",\n    \"tenantId\": \"a\"\n  },\n  \"response\": {\n    \"status\": \"ok\",\n    \"orderId\": \"o7\",\n    \"tenantId\": \"b\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.response.status===\"ok\"&&x.response.orderId===x.request.orderId&&x.response.tenantId===x.request.tenantId;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.3 / contraprova: ignorar tenant na resposta; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"request\": {\n    \"orderId\": \"o7\",\n    \"tenantId\": \"a\"\n  },\n  \"response\": {\n    \"status\": \"ok\",\n    \"orderId\": \"o7\",\n    \"tenantId\": \"b\"\n  }\n};\nconst expected = false;\nconst evaluate = x=>x.response.status===\"ok\"&&x.response.orderId===x.request.orderId&&x.response.tenantId===x.request.tenantId;\nconst mutant = x=>x.response.status===\"ok\"&&x.response.orderId===x.request.orderId;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Idempotência e resultado remoto incerto": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.4 / fixture: a classificação é conflict. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"old\": {\n    \"key\": \"k9\",\n    \"payload\": {\n      \"qty\": 2\n    }\n  },\n  \"next\": {\n    \"key\": \"k9\",\n    \"payload\": {\n      \"qty\": 3\n    }\n  }\n};\nconst expected = \"conflict\";\nconst evaluate = x=>x.old.key!==x.next.key?\"new\":JSON.stringify(x.old.payload)===JSON.stringify(x.next.payload)?\"replay\":\"conflict\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.4 / contraprova: classificar replay só pela chave; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"old\": {\n    \"key\": \"k9\",\n    \"payload\": {\n      \"qty\": 2\n    }\n  },\n  \"next\": {\n    \"key\": \"k9\",\n    \"payload\": {\n      \"qty\": 3\n    }\n  }\n};\nconst expected = \"conflict\";\nconst evaluate = x=>x.old.key!==x.next.key?\"new\":JSON.stringify(x.old.payload)===JSON.stringify(x.next.payload)?\"replay\":\"conflict\";\nconst mutant = x=>x.old.key===x.next.key?\"replay\":\"new\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Tarefa delegada e repositório escolhido": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.1 / fixture: route e schema compõem o alcance. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"repo\": \"api\",\n  \"files\": [\n    {\n      \"id\": \"route\",\n      \"repo\": \"api\",\n      \"topic\": \"reserve\"\n    },\n    {\n      \"id\": \"schema\",\n      \"repo\": \"api\",\n      \"topic\": \"reserve\"\n    },\n    {\n      \"id\": \"form\",\n      \"repo\": \"web\",\n      \"topic\": \"reserve\"\n    }\n  ]\n};\nconst expected = [\n  \"route\",\n  \"schema\"\n];\nconst evaluate = x=>x.files.filter(f=>f.repo===x.repo).map(f=>f.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.1 / contraprova: incluir todo arquivo relacionado a reserve; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"repo\": \"api\",\n  \"files\": [\n    {\n      \"id\": \"route\",\n      \"repo\": \"api\",\n      \"topic\": \"reserve\"\n    },\n    {\n      \"id\": \"schema\",\n      \"repo\": \"api\",\n      \"topic\": \"reserve\"\n    },\n    {\n      \"id\": \"form\",\n      \"repo\": \"web\",\n      \"topic\": \"reserve\"\n    }\n  ]\n};\nconst expected = [\n  \"route\",\n  \"schema\"\n];\nconst evaluate = x=>x.files.filter(f=>f.repo===x.repo).map(f=>f.id);\nconst mutant = x=>x.files.filter(f=>f.topic===\"reserve\").map(f=>f.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Ambiente efêmero e setup reprodutível": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.2 / fixture: a chave é win32-node24-L8. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"os\": \"win32\",\n  \"node\": \"24\",\n  \"lockDigest\": \"L8\"\n};\nconst expected = \"win32-node24-L8\";\nconst evaluate = x=>`${x.os}-node${x.node}-${x.lockDigest}`;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.2 / contraprova: omitir digest do lockfile; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"os\": \"win32\",\n  \"node\": \"24\",\n  \"lockDigest\": \"L8\"\n};\nconst expected = \"win32-node24-L8\";\nconst evaluate = x=>`${x.os}-node${x.node}-${x.lockDigest}`;\nconst mutant = x=>`${x.os}-node${x.node}`;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Branch, logs e pull request revisável": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.3 / fixture: a lacuna é test-head. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"main\",\n  \"expectedBase\": \"main\",\n  \"head\": \"h2\",\n  \"testHead\": \"h1\"\n};\nconst expected = [\n  \"test-head\"\n];\nconst evaluate = x=>[...(x.base!==x.expectedBase?[\"base\"]:[]),...(x.testHead!==x.head?[\"test-head\"]:[])];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.3 / contraprova: aceitar qualquer testHead não vazio; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"main\",\n  \"expectedBase\": \"main\",\n  \"head\": \"h2\",\n  \"testHead\": \"h1\"\n};\nconst expected = [\n  \"test-head\"\n];\nconst evaluate = x=>[...(x.base!==x.expectedBase?[\"base\"]:[]),...(x.testHead!==x.head?[\"test-head\"]:[])];\nconst mutant = x=>[...(x.base!==x.expectedBase?[\"base\"]:[]),...(!x.testHead?[\"test-head\"]:[])];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Firewall e dependências do ambiente": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.4 / fixture: a decisão local é false. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"url\": \"https://registry.example.evil.test/pkg\",\n  \"allowed\": \"registry.example\"\n};\nconst expected = false;\nconst evaluate = x=>new URL(x.url).protocol===\"https:\"&&new URL(x.url).hostname===x.allowed;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.4 / contraprova: aprovar quando a URL contém registry.example; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"url\": \"https://registry.example.evil.test/pkg\",\n  \"allowed\": \"registry.example\"\n};\nconst expected = false;\nconst evaluate = x=>new URL(x.url).protocol===\"https:\"&&new URL(x.url).hostname===x.allowed;\nconst mutant = x=>x.url.includes(x.allowed);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Comentário localizado e defeito reproduzível": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / fixture: somente tenant-key permanece. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"tenant-key\",\n    \"line\": 18,\n    \"trigger\": \"same key different tenant\",\n    \"impact\": \"collision\"\n  },\n  {\n    \"id\": \"style-note\",\n    \"line\": 21,\n    \"trigger\": \"\",\n    \"impact\": \"\"\n  }\n];\nconst expected = [\n  \"tenant-key\"\n];\nconst evaluate = x=>x.filter(r=>r.line>0&&r.trigger.trim()&&r.impact.trim()).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / contraprova: selecionar qualquer achado com linha positiva; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"tenant-key\",\n    \"line\": 18,\n    \"trigger\": \"same key different tenant\",\n    \"impact\": \"collision\"\n  },\n  {\n    \"id\": \"style-note\",\n    \"line\": 21,\n    \"trigger\": \"\",\n    \"impact\": \"\"\n  }\n];\nconst expected = [\n  \"tenant-key\"\n];\nconst evaluate = x=>x.filter(r=>r.line>0&&r.trigger.trim()&&r.impact.trim()).map(r=>r.id);\nconst mutant = x=>x.filter(r=>r.line>0).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Revisão da base e instruções pertinentes": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.2 / fixture: somente tenant é aplicável ao manifesto. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"src/api/reserve.ts\",\n  \"revision\": \"b1\",\n  \"rules\": [\n    {\n      \"id\": \"tenant\",\n      \"prefix\": \"src/api/\",\n      \"revision\": \"b1\"\n    },\n    {\n      \"id\": \"tenant-new\",\n      \"prefix\": \"src/api/\",\n      \"revision\": \"b2\"\n    },\n    {\n      \"id\": \"contrast\",\n      \"prefix\": \"src/ui/\",\n      \"revision\": \"b1\"\n    }\n  ]\n};\nconst expected = [\n  \"tenant\"\n];\nconst evaluate = x=>x.rules.filter(r=>x.path.startsWith(r.prefix)&&r.revision===x.revision).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.2 / contraprova: ignorar a identidade da revisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"src/api/reserve.ts\",\n  \"revision\": \"b1\",\n  \"rules\": [\n    {\n      \"id\": \"tenant\",\n      \"prefix\": \"src/api/\",\n      \"revision\": \"b1\"\n    },\n    {\n      \"id\": \"tenant-new\",\n      \"prefix\": \"src/api/\",\n      \"revision\": \"b2\"\n    },\n    {\n      \"id\": \"contrast\",\n      \"prefix\": \"src/ui/\",\n      \"revision\": \"b1\"\n    }\n  ]\n};\nconst expected = [\n  \"tenant\"\n];\nconst evaluate = x=>x.rules.filter(r=>x.path.startsWith(r.prefix)&&r.revision===x.revision).map(r=>r.id);\nconst mutant = x=>x.rules.filter(r=>x.path.startsWith(r.prefix)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Cobertura de diff e arquivos excluídos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.3 / fixture: policy é a lacuna de cobertura. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"relevant\": [\n    \"route\",\n    \"policy\",\n    \"test\"\n  ],\n  \"analyzed\": [\n    \"route\",\n    \"test\"\n  ],\n  \"excluded\": [\n    \"policy\"\n  ]\n};\nconst expected = [\n  \"policy\"\n];\nconst evaluate = x=>x.relevant.filter(p=>!x.analyzed.includes(p));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.3 / contraprova: tratar arquivos excluídos como analisados; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"relevant\": [\n    \"route\",\n    \"policy\",\n    \"test\"\n  ],\n  \"analyzed\": [\n    \"route\",\n    \"test\"\n  ],\n  \"excluded\": [\n    \"policy\"\n  ]\n};\nconst expected = [\n  \"policy\"\n];\nconst evaluate = x=>x.relevant.filter(p=>!x.analyzed.includes(p));\nconst mutant = x=>x.relevant.filter(p=>!x.analyzed.includes(p)&&!x.excluded.includes(p));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Checks, aprovação e autoridade de merge": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.4 / fixture: o merge não é elegível. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"checksPassed\": true,\n  \"approvals\": [\n    {\n      \"actor\": \"copilot\",\n      \"approved\": true,\n      \"countsForPolicy\": false\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = x=>x.checksPassed&&x.approvals.some(a=>a.approved&&a.countsForPolicy);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.4 / contraprova: aceitar qualquer approved sem conferir autoridade; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"checksPassed\": true,\n  \"approvals\": [\n    {\n      \"actor\": \"copilot\",\n      \"approved\": true,\n      \"countsForPolicy\": false\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = x=>x.checksPassed&&x.approvals.some(a=>a.approved&&a.countsForPolicy);\nconst mutant = x=>x.checksPassed&&x.approvals.some(a=>a.approved);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "CLI e limites da invocação no terminal": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / fixture: o alvo não pertence à raiz repo/app. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"root\": \"repo/app\",\n  \"path\": \"repo/app/../docs\"\n};\nconst expected = false;\nconst evaluate = x=>{const p=[];for(const s of x.path.split(\"/\")){if(s===\"..\")p.pop();else if(s!==\".\")p.push(s);}const t=p.join(\"/\");return t===x.root||t.startsWith(x.root+\"/\");};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / contraprova: conferir apenas startsWith no texto bruto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"root\": \"repo/app\",\n  \"path\": \"repo/app/../docs\"\n};\nconst expected = false;\nconst evaluate = x=>{const p=[];for(const s of x.path.split(\"/\")){if(s===\"..\")p.pop();else if(s!==\".\")p.push(s);}const t=p.join(\"/\");return t===x.root||t.startsWith(x.root+\"/\");};\nconst mutant = x=>x.path.startsWith(x.root);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Agente personalizado e conjunto de ferramentas": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.2 / fixture: o conjunto é read e search. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requested\": [\n    \"read\",\n    \"search\"\n  ],\n  \"available\": [\n    \"read\",\n    \"search\",\n    \"deploy\"\n  ]\n};\nconst expected = [\n  \"read\",\n  \"search\"\n];\nconst evaluate = x=>x.requested.filter(t=>x.available.includes(t));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.2 / contraprova: usar todo o conjunto disponível; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requested\": [\n    \"read\",\n    \"search\"\n  ],\n  \"available\": [\n    \"read\",\n    \"search\",\n    \"deploy\"\n  ]\n};\nconst expected = [\n  \"read\",\n  \"search\"\n];\nconst evaluate = x=>x.requested.filter(t=>x.available.includes(t));\nconst mutant = x=>x.available;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Hooks e contrato de evento observado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.3 / fixture: a projeção retorna null. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"{\\\"event\\\":\\\"postToolUse\\\",\\\"toolName\\\":\\\"write\\\",\\\"permissionDecision\\\":\\\"deny\\\"}\";\nconst expected = null;\nconst evaluate = x=>{const e=JSON.parse(x);return e.event===\"preToolUse\"&&e.permissionDecision===\"deny\"?{tool:e.toolName,decision:\"deny\"}:null;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.3 / contraprova: usar permissionDecision sem conferir evento; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = \"{\\\"event\\\":\\\"postToolUse\\\",\\\"toolName\\\":\\\"write\\\",\\\"permissionDecision\\\":\\\"deny\\\"}\";\nconst expected = null;\nconst evaluate = x=>{const e=JSON.parse(x);return e.event===\"preToolUse\"&&e.permissionDecision===\"deny\"?{tool:e.toolName,decision:\"deny\"}:null;};\nconst mutant = x=>{const e=JSON.parse(x);return e.permissionDecision===\"deny\"?{tool:e.toolName,decision:\"deny\"}:null;};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Automação, timeout e replay controlado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.4 / fixture: as ações são resolve:notify e retry:test. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"inspect\",\n    \"status\": \"passed\"\n  },\n  {\n    \"id\": \"patch\",\n    \"status\": \"passed\"\n  },\n  {\n    \"id\": \"notify\",\n    \"status\": \"unknown\"\n  },\n  {\n    \"id\": \"test\",\n    \"status\": \"failed\"\n  }\n];\nconst expected = [\n  \"resolve:notify\",\n  \"retry:test\"\n];\nconst evaluate = x=>x.flatMap(r=>r.status===\"unknown\"?[`resolve:${r.id}`]:r.status===\"failed\"?[`retry:${r.id}`]:[]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.4 / contraprova: repetir todo estado diferente de passed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"inspect\",\n    \"status\": \"passed\"\n  },\n  {\n    \"id\": \"patch\",\n    \"status\": \"passed\"\n  },\n  {\n    \"id\": \"notify\",\n    \"status\": \"unknown\"\n  },\n  {\n    \"id\": \"test\",\n    \"status\": \"failed\"\n  }\n];\nconst expected = [\n  \"resolve:notify\",\n  \"retry:test\"\n];\nconst evaluate = x=>x.flatMap(r=>r.status===\"unknown\"?[`resolve:${r.id}`]:r.status===\"failed\"?[`retry:${r.id}`]:[]);\nconst mutant = x=>x.filter(r=>r.status!==\"passed\").map(r=>`retry:${r.id}`);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Exclusão de conteúdo e limites por modo": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.1 / fixture: o estado é unsupported. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"excluded\": true,\n  \"mode\": \"agent\",\n  \"supported\": [\n    \"inline\",\n    \"ask\"\n  ]\n};\nconst expected = \"unsupported\";\nconst evaluate = x=>!x.excluded?\"included\":x.supported.includes(x.mode)?\"excluded\":\"unsupported\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.1 / contraprova: retornar excluded somente pela marca do arquivo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"excluded\": true,\n  \"mode\": \"agent\",\n  \"supported\": [\n    \"inline\",\n    \"ask\"\n  ]\n};\nconst expected = \"unsupported\";\nconst evaluate = x=>!x.excluded?\"included\":x.supported.includes(x.mode)?\"excluded\":\"unsupported\";\nconst mutant = x=>x.excluded?\"excluded\":\"included\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Segredos e contexto mínimo necessário": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.2 / fixture: saída contém code, requestId e tenantAlias. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"code\": \"TENANT_MISMATCH\",\n  \"requestId\": \"r7\",\n  \"tenantAlias\": \"fixture-a\",\n  \"token\": \"SYNTHETIC\",\n  \"customerEmail\": \"fixture@example.test\"\n};\nconst expected = {\n  \"code\": \"TENANT_MISMATCH\",\n  \"requestId\": \"r7\",\n  \"tenantAlias\": \"fixture-a\"\n};\nconst evaluate = x=>Object.fromEntries([\"code\",\"requestId\",\"tenantAlias\"].map(k=>[k,x[k]]));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.2 / contraprova: remover apenas token e conservar o resto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"code\": \"TENANT_MISMATCH\",\n  \"requestId\": \"r7\",\n  \"tenantAlias\": \"fixture-a\",\n  \"token\": \"SYNTHETIC\",\n  \"customerEmail\": \"fixture@example.test\"\n};\nconst expected = {\n  \"code\": \"TENANT_MISMATCH\",\n  \"requestId\": \"r7\",\n  \"tenantAlias\": \"fixture-a\"\n};\nconst evaluate = x=>Object.fromEntries([\"code\",\"requestId\",\"tenantAlias\"].map(k=>[k,x[k]]));\nconst mutant = x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!==\"token\"));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Prompt injection e origem da autoridade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / fixture: somente fix-tenant possui autoridade no modelo. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"fix-tenant\",\n    \"source\": \"trusted-user\",\n    \"scope\": \"task\",\n    \"imperative\": true\n  },\n  {\n    \"id\": \"readme-publish\",\n    \"source\": \"tool-data\",\n    \"scope\": \"external\",\n    \"imperative\": true\n  }\n];\nconst expected = [\n  \"fix-tenant\"\n];\nconst evaluate = x=>x.filter(m=>m.source===\"trusted-user\"&&m.scope===\"task\").map(m=>m.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / contraprova: selecionar todo texto marcado imperative; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"fix-tenant\",\n    \"source\": \"trusted-user\",\n    \"scope\": \"task\",\n    \"imperative\": true\n  },\n  {\n    \"id\": \"readme-publish\",\n    \"source\": \"tool-data\",\n    \"scope\": \"external\",\n    \"imperative\": true\n  }\n];\nconst expected = [\n  \"fix-tenant\"\n];\nconst evaluate = x=>x.filter(m=>m.source===\"trusted-user\"&&m.scope===\"task\").map(m=>m.id);\nconst mutant = x=>x.filter(m=>m.imperative).map(m=>m.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Métricas de qualidade e custo observado": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.4 / fixture: a média é 25 minutos por mudança aprovada. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"work\": 10,\n    \"rework\": 20\n  },\n  {\n    \"work\": 20,\n    \"rework\": 0\n  }\n];\nconst expected = 25;\nconst evaluate = x=>x.reduce((n,r)=>n+r.work+r.rework,0)/x.length;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.4 / contraprova: calcular média apenas de trabalho inicial; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"work\": 10,\n    \"rework\": 20\n  },\n  {\n    \"work\": 20,\n    \"rework\": 0\n  }\n];\nconst expected = 25;\nconst evaluate = x=>x.reduce((n,r)=>n+r.work+r.rework,0)/x.length;\nconst mutant = x=>x.reduce((n,r)=>n+r.work,0)/x.length;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Reserva por tenant e contrato do endpoint": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.1 / fixture: a reserva é inelegível. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"a\",\n  \"stockTenant\": \"b\",\n  \"qty\": 1\n};\nconst expected = false;\nconst evaluate = x=>x.actorTenant===x.stockTenant&&Number.isSafeInteger(x.qty)&&x.qty>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.1 / contraprova: validar somente qty; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"actorTenant\": \"a\",\n  \"stockTenant\": \"b\",\n  \"qty\": 1\n};\nconst expected = false;\nconst evaluate = x=>x.actorTenant===x.stockTenant&&Number.isSafeInteger(x.qty)&&x.qty>0;\nconst mutant = x=>Number.isSafeInteger(x.qty)&&x.qty>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Replay com payload canônico declarado": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.2 / fixture: a representação JSON é [\"a\",\"s7\",2]. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": 2,\n  \"trace\": \"t9\",\n  \"sku\": \"s7\",\n  \"tenant\": \"a\"\n};\nconst expected = \"[\\\"a\\\",\\\"s7\\\",2]\";\nconst evaluate = x=>JSON.stringify([x.tenant,x.sku,x.qty]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.2 / contraprova: serializar o objeto inteiro; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": 2,\n  \"trace\": \"t9\",\n  \"sku\": \"s7\",\n  \"tenant\": \"a\"\n};\nconst expected = \"[\\\"a\\\",\\\"s7\\\",2]\";\nconst evaluate = x=>JSON.stringify([x.tenant,x.sku,x.qty]);\nconst mutant = x=>JSON.stringify(x);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Interleaving e prova de estoque": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / fixture: a conservação retorna false. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"initial\": 1,\n  \"finalStock\": 0,\n  \"confirmed\": [\n    {\n      \"qty\": 1\n    },\n    {\n      \"qty\": 1\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = x=>x.confirmed.reduce((n,r)=>n+r.qty,0)===x.initial-x.finalStock;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / contraprova: verificar somente finalStock não negativo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"initial\": 1,\n  \"finalStock\": 0,\n  \"confirmed\": [\n    {\n      \"qty\": 1\n    },\n    {\n      \"qty\": 1\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = x=>x.confirmed.reduce((n,r)=>n+r.qty,0)===x.initial-x.finalStock;\nconst mutant = x=>x.finalStock>=0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Handoff, limites e ensaio do Lab Ágora": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.4 / fixture: passed contém corpus e pending contém native-cli e durable-lab. Prova local declarada, sem agente ou efeito GitHubCopilot.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"corpus\",\n    \"scope\": \"local\",\n    \"status\": \"passed\"\n  },\n  {\n    \"id\": \"native-cli\",\n    \"scope\": \"native\",\n    \"status\": \"pending\"\n  },\n  {\n    \"id\": \"durable-lab\",\n    \"scope\": \"native\",\n    \"status\": \"pending\"\n  }\n];\nconst expected = {\n  \"passed\": [\n    \"corpus\"\n  ],\n  \"pending\": [\n    \"native-cli\",\n    \"durable-lab\"\n  ]\n};\nconst evaluate = x=>({passed:x.filter(g=>g.status===\"passed\").map(g=>g.id),pending:x.filter(g=>g.status===\"pending\").map(g=>g.id)});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C12.4 / contraprova: marcar todos passed quando corpus passa; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"corpus\",\n    \"scope\": \"local\",\n    \"status\": \"passed\"\n  },\n  {\n    \"id\": \"native-cli\",\n    \"scope\": \"native\",\n    \"status\": \"pending\"\n  },\n  {\n    \"id\": \"durable-lab\",\n    \"scope\": \"native\",\n    \"status\": \"pending\"\n  }\n];\nconst expected = {\n  \"passed\": [\n    \"corpus\"\n  ],\n  \"pending\": [\n    \"native-cli\",\n    \"durable-lab\"\n  ]\n};\nconst evaluate = x=>({passed:x.filter(g=>g.status===\"passed\").map(g=>g.id),pending:x.filter(g=>g.status===\"pending\").map(g=>g.id)});\nconst mutant = x=>({passed:x.some(g=>g.id===\"corpus\"&&g.status===\"passed\")?x.map(g=>g.id):[],pending:[]});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ]
};
