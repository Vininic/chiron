export interface CursorExample {lang:string;scope:"local-rule"|"local-transform"|"model";purpose:string;code:string}
export const CURSOR_EXAMPLES: Record<string,[CursorExample,CursorExample]> = {
  "Workspace e inventário inicial": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / fixture: somente src/app.ts entra na lista de edição. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"paths\": [\n    \"src/app.ts\",\n    \"src-old/app.ts\",\n    \"docs/guia.md\"\n  ],\n  \"root\": \"src\"\n};\nconst expected = [\n  \"src/app.ts\"\n];\nconst evaluate = (x) => x.paths.filter(p => p === x.root || p.startsWith(x.root + \"/\"));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / contraprova: trocar o limite de diretório por startsWith sem a barra; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"paths\": [\n    \"src/app.ts\",\n    \"src-old/app.ts\",\n    \"docs/guia.md\"\n  ],\n  \"root\": \"src\"\n};\nconst expected = [\n  \"src/app.ts\"\n];\nconst evaluate = (x) => x.paths.filter(p => p === x.root || p.startsWith(x.root + \"/\"));\nconst mutant = (x) => x.paths.filter(p => p.startsWith(x.root));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Pedido observável e limites de mudança": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.2 / fixture: billing.ts aparece como mudança fora do escopo. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"changed\": [\n    \"app.ts\",\n    \"app.test.ts\",\n    \"billing.ts\"\n  ],\n  \"allowed\": [\n    \"app.ts\",\n    \"app.test.ts\"\n  ]\n};\nconst expected = [\n  \"billing.ts\"\n];\nconst evaluate = (x) => x.changed.filter(p => !x.allowed.includes(p));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.2 / contraprova: filtrar os caminhos permitidos em vez dos caminhos proibidos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"changed\": [\n    \"app.ts\",\n    \"app.test.ts\",\n    \"billing.ts\"\n  ],\n  \"allowed\": [\n    \"app.ts\",\n    \"app.test.ts\"\n  ]\n};\nconst expected = [\n  \"billing.ts\"\n];\nconst evaluate = (x) => x.changed.filter(p => !x.allowed.includes(p));\nconst mutant = (x) => x.changed.filter(p => x.allowed.includes(p));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Assistência inline e edição delimitada": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.3 / fixture: o texto final é abcXghi com o g inicial do sufixo preservado. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"abcDEFghi\",\n  \"start\": 3,\n  \"end\": 6,\n  \"replacement\": \"X\"\n};\nconst expected = \"abcXghi\";\nconst evaluate = (x) => x.text.slice(0,x.start)+x.replacement+x.text.slice(x.end);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.3 / contraprova: iniciar o sufixo em end+1; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"abcDEFghi\",\n  \"start\": 3,\n  \"end\": 6,\n  \"replacement\": \"X\"\n};\nconst expected = \"abcXghi\";\nconst evaluate = (x) => x.text.slice(0,x.start)+x.replacement+x.text.slice(x.end);\nconst mutant = (x) => x.text.slice(0,x.start)+x.replacement+x.text.slice(x.end+1);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Plano, agente e evidência de execução": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / fixture: somente o typecheck aprovado de r2 pode integrar a evidência de sucesso atual. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"current\": \"r2\",\n  \"runs\": [\n    {\n      \"name\": \"unit\",\n      \"status\": \"passed\",\n      \"revision\": \"r1\"\n    },\n    {\n      \"name\": \"typecheck\",\n      \"status\": \"passed\",\n      \"revision\": \"r2\"\n    },\n    {\n      \"name\": \"build\",\n      \"status\": \"failed\",\n      \"revision\": \"r2\"\n    }\n  ]\n};\nconst expected = [\n  \"typecheck\"\n];\nconst evaluate = (x) => x.runs.filter(r => r.status === \"passed\" && r.revision === x.current).map(r=>r.name);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.4 / contraprova: ignorar a revisão ao selecionar resultados passed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"current\": \"r2\",\n  \"runs\": [\n    {\n      \"name\": \"unit\",\n      \"status\": \"passed\",\n      \"revision\": \"r1\"\n    },\n    {\n      \"name\": \"typecheck\",\n      \"status\": \"passed\",\n      \"revision\": \"r2\"\n    },\n    {\n      \"name\": \"build\",\n      \"status\": \"failed\",\n      \"revision\": \"r2\"\n    }\n  ]\n};\nconst expected = [\n  \"typecheck\"\n];\nconst evaluate = (x) => x.runs.filter(r => r.status === \"passed\" && r.revision === x.current).map(r=>r.name);\nconst mutant = (x) => x.runs.filter(r => r.status === \"passed\").map(r=>r.name);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Referências explícitas e contexto mínimo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.1 / fixture: service.ts e service.test.ts formam o contexto elegível. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"path\": \"service.ts\",\n    \"relevant\": true,\n    \"sensitive\": false\n  },\n  {\n    \"path\": \"service.test.ts\",\n    \"relevant\": true,\n    \"sensitive\": false\n  },\n  {\n    \"path\": \"prod-dump.json\",\n    \"relevant\": true,\n    \"sensitive\": true\n  }\n];\nconst expected = [\n  \"service.ts\",\n  \"service.test.ts\"\n];\nconst evaluate = (x) => x.filter(r=>r.relevant && !r.sensitive).map(r=>r.path);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.1 / contraprova: considerar apenas relevância e omitir a classificação; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"path\": \"service.ts\",\n    \"relevant\": true,\n    \"sensitive\": false\n  },\n  {\n    \"path\": \"service.test.ts\",\n    \"relevant\": true,\n    \"sensitive\": false\n  },\n  {\n    \"path\": \"prod-dump.json\",\n    \"relevant\": true,\n    \"sensitive\": true\n  }\n];\nconst expected = [\n  \"service.ts\",\n  \"service.test.ts\"\n];\nconst evaluate = (x) => x.filter(r=>r.relevant && !r.sensitive).map(r=>r.path);\nconst mutant = (x) => x.filter(r=>r.relevant).map(r=>r.path);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Busca lexical e recuperação semântica": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.2 / fixture: a ordem é doc-a, doc-b, doc-c. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"terms\": [\n    \"estoque\",\n    \"autorizar\"\n  ],\n  \"docs\": [\n    {\n      \"id\": \"doc-c\",\n      \"text\": \"tema visual\"\n    },\n    {\n      \"id\": \"doc-b\",\n      \"text\": \"estoque\"\n    },\n    {\n      \"id\": \"doc-a\",\n      \"text\": \"estoque e autorizar\"\n    }\n  ]\n};\nconst expected = [\n  \"doc-a\",\n  \"doc-b\",\n  \"doc-c\"\n];\nconst evaluate = (x) => x.docs.map(d=>({id:d.id,score:x.terms.filter(t=>d.text.includes(t)).length})).sort((a,b)=>b.score-a.score || a.id.localeCompare(b.id)).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.2 / contraprova: ordenar a pontuação em ordem crescente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"terms\": [\n    \"estoque\",\n    \"autorizar\"\n  ],\n  \"docs\": [\n    {\n      \"id\": \"doc-c\",\n      \"text\": \"tema visual\"\n    },\n    {\n      \"id\": \"doc-b\",\n      \"text\": \"estoque\"\n    },\n    {\n      \"id\": \"doc-a\",\n      \"text\": \"estoque e autorizar\"\n    }\n  ]\n};\nconst expected = [\n  \"doc-a\",\n  \"doc-b\",\n  \"doc-c\"\n];\nconst evaluate = (x) => x.docs.map(d=>({id:d.id,score:x.terms.filter(t=>d.text.includes(t)).length})).sort((a,b)=>b.score-a.score || a.id.localeCompare(b.id)).map(d=>d.id);\nconst mutant = (x) => x.docs.map(d=>({id:d.id,score:x.terms.filter(t=>d.text.includes(t)).length})).sort((a,b)=>a.score-b.score || a.id.localeCompare(b.id)).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Indexação, validade e arquivos omitidos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / fixture: somente service.ts é registro atual elegível. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"files\": [\n    {\n      \"path\": \"service.ts\",\n      \"digest\": \"s1\",\n      \"ignored\": false\n    },\n    {\n      \"path\": \"old.ts\",\n      \"digest\": \"new\",\n      \"ignored\": false\n    },\n    {\n      \"path\": \"hidden.ts\",\n      \"digest\": \"h1\",\n      \"ignored\": true\n    }\n  ],\n  \"index\": {\n    \"service.ts\": \"s1\",\n    \"old.ts\": \"old\",\n    \"hidden.ts\": \"h1\"\n  }\n};\nconst expected = [\n  \"service.ts\"\n];\nconst evaluate = (x) => x.files.filter(f=>!f.ignored && x.index[f.path]===f.digest).map(f=>f.path);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / contraprova: ignorar a divergência de digest e selecionar arquivos apenas por não estarem omitidos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"files\": [\n    {\n      \"path\": \"service.ts\",\n      \"digest\": \"s1\",\n      \"ignored\": false\n    },\n    {\n      \"path\": \"old.ts\",\n      \"digest\": \"new\",\n      \"ignored\": false\n    },\n    {\n      \"path\": \"hidden.ts\",\n      \"digest\": \"h1\",\n      \"ignored\": true\n    }\n  ],\n  \"index\": {\n    \"service.ts\": \"s1\",\n    \"old.ts\": \"old\",\n    \"hidden.ts\": \"h1\"\n  }\n};\nconst expected = [\n  \"service.ts\"\n];\nconst evaluate = (x) => x.files.filter(f=>!f.ignored && x.index[f.path]===f.digest).map(f=>f.path);\nconst mutant = (x) => x.files.filter(f=>!f.ignored).map(f=>f.path);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Orçamento de contexto e continuidade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.4 / fixture: instrução e contrato são preservados e log fica fora. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"limit\": 5,\n  \"items\": [\n    {\n      \"id\": \"instrucao\",\n      \"cost\": 3\n    },\n    {\n      \"id\": \"contrato\",\n      \"cost\": 2\n    },\n    {\n      \"id\": \"log\",\n      \"cost\": 4\n    }\n  ]\n};\nconst expected = [\n  \"instrucao\",\n  \"contrato\"\n];\nconst evaluate = (x) => {let used=0;const keep=[];for(const item of x.items){if(used+item.cost>x.limit)break;used+=item.cost;keep.push(item.id);}return keep;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.4 / contraprova: admitir um item quando apenas o custo acumulado anterior está dentro do limite; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"limit\": 5,\n  \"items\": [\n    {\n      \"id\": \"instrucao\",\n      \"cost\": 3\n    },\n    {\n      \"id\": \"contrato\",\n      \"cost\": 2\n    },\n    {\n      \"id\": \"log\",\n      \"cost\": 4\n    }\n  ]\n};\nconst expected = [\n  \"instrucao\",\n  \"contrato\"\n];\nconst evaluate = (x) => {let used=0;const keep=[];for(const item of x.items){if(used+item.cost>x.limit)break;used+=item.cost;keep.push(item.id);}return keep;};\nconst mutant = (x) => {let used=0;const keep=[];for(const item of x.items){if(used>x.limit)break;used+=item.cost;keep.push(item.id);}return keep;};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Regras de projeto e frontmatter MDC": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.1 / fixture: a regra não é classificada como sempre aplicável. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"alwaysApply\": false,\n  \"description\": \"Serviços de pagamento\"\n};\nconst expected = false;\nconst evaluate = (x) => x.alwaysApply === true;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.1 / contraprova: testar somente a presença de alwaysApply; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"alwaysApply\": false,\n  \"description\": \"Serviços de pagamento\"\n};\nconst expected = false;\nconst evaluate = (x) => x.alwaysApply === true;\nconst mutant = (x) => Object.hasOwn(x,\"alwaysApply\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Escopo de regras e conflitos de orientação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.2 / fixture: nenhuma dessas duas regras locais corresponde ao alvo. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"src/ui-old/button.tsx\",\n  \"rules\": [\n    {\n      \"id\": \"ui\",\n      \"prefix\": \"src/ui/\"\n    },\n    {\n      \"id\": \"legacy\",\n      \"prefix\": \"src/legacy/\"\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.rules.filter(r=>x.path.startsWith(r.prefix)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.2 / contraprova: remover a barra final antes de comparar prefixos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"src/ui-old/button.tsx\",\n  \"rules\": [\n    {\n      \"id\": \"ui\",\n      \"prefix\": \"src/ui/\"\n    },\n    {\n      \"id\": \"legacy\",\n      \"prefix\": \"src/legacy/\"\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.rules.filter(r=>x.path.startsWith(r.prefix)).map(r=>r.id);\nconst mutant = (x) => x.rules.filter(r=>x.path.startsWith(r.prefix.slice(0,-1))).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "AGENTS.md e instruções próximas do código": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.3 / fixture: a ordem de leitura contém raiz e services, sem services-old. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"services/payments/pay.ts\",\n  \"docs\": [\n    {\n      \"id\": \"other\",\n      \"prefix\": \"services-old/\"\n    },\n    {\n      \"id\": \"root\",\n      \"prefix\": \"\"\n    },\n    {\n      \"id\": \"services\",\n      \"prefix\": \"services/\"\n    }\n  ]\n};\nconst expected = [\n  \"root\",\n  \"services\"\n];\nconst evaluate = (x) => x.docs.filter(d=>x.path.startsWith(d.prefix)).sort((a,b)=>a.prefix.length-b.prefix.length).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.3 / contraprova: aceitar qualquer instrução cujo diretório começa com services; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"services/payments/pay.ts\",\n  \"docs\": [\n    {\n      \"id\": \"other\",\n      \"prefix\": \"services-old/\"\n    },\n    {\n      \"id\": \"root\",\n      \"prefix\": \"\"\n    },\n    {\n      \"id\": \"services\",\n      \"prefix\": \"services/\"\n    }\n  ]\n};\nconst expected = [\n  \"root\",\n  \"services\"\n];\nconst evaluate = (x) => x.docs.filter(d=>x.path.startsWith(d.prefix)).sort((a,b)=>a.prefix.length-b.prefix.length).map(d=>d.id);\nconst mutant = (x) => x.docs.filter(d=>d.prefix===\"\" || d.prefix.startsWith(\"services\")).sort((a,b)=>a.prefix.length-b.prefix.length).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Documentação externa e procedência": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.4 / fixture: somente manual-v2 integra a evidência primária compatível. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"version\": \"v2\",\n  \"docs\": [\n    {\n      \"id\": \"manual-v2\",\n      \"official\": true,\n      \"version\": \"v2\"\n    },\n    {\n      \"id\": \"manual-v1\",\n      \"official\": true,\n      \"version\": \"v1\"\n    },\n    {\n      \"id\": \"tutorial\",\n      \"official\": false,\n      \"version\": \"v2\"\n    }\n  ]\n};\nconst expected = [\n  \"manual-v2\"\n];\nconst evaluate = (x) => x.docs.filter(d=>d.official && d.version===x.version).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.4 / contraprova: selecionar todas as fontes oficiais sem conferir versão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"version\": \"v2\",\n  \"docs\": [\n    {\n      \"id\": \"manual-v2\",\n      \"official\": true,\n      \"version\": \"v2\"\n    },\n    {\n      \"id\": \"manual-v1\",\n      \"official\": true,\n      \"version\": \"v1\"\n    },\n    {\n      \"id\": \"tutorial\",\n      \"official\": false,\n      \"version\": \"v2\"\n    }\n  ]\n};\nconst expected = [\n  \"manual-v2\"\n];\nconst evaluate = (x) => x.docs.filter(d=>d.official && d.version===x.version).map(d=>d.id);\nconst mutant = (x) => x.docs.filter(d=>d.official).map(d=>d.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Critérios de aceitação antes do patch": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / fixture: o gate de aceitação retorna false porque quantidade não passou. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"unidade\",\n    \"passed\": true\n  },\n  {\n    \"id\": \"quantidade\",\n    \"passed\": false\n  },\n  {\n    \"id\": \"estoque\",\n    \"passed\": true\n  }\n];\nconst expected = false;\nconst evaluate = (x) => x.length>0 && x.every(r=>r.passed===true);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / contraprova: aceitar quando algum resultado é true; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"unidade\",\n    \"passed\": true\n  },\n  {\n    \"id\": \"quantidade\",\n    \"passed\": false\n  },\n  {\n    \"id\": \"estoque\",\n    \"passed\": true\n  }\n];\nconst expected = false;\nconst evaluate = (x) => x.length>0 && x.every(r=>r.passed===true);\nconst mutant = (x) => x.some(r=>r.passed===true);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Diferença textual e revisão de intenção": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.2 / fixture: o resultado é null porque a proposta é ambígua. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"a:total=0;b:total=0\",\n  \"before\": \"total=0\",\n  \"after\": \"total=1\"\n};\nconst expected = null;\nconst evaluate = (x) => x.text.split(x.before).length===2 ? x.text.replace(x.before,x.after) : null;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.2 / contraprova: usar replace e aceitar a primeira ocorrência; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"a:total=0;b:total=0\",\n  \"before\": \"total=0\",\n  \"after\": \"total=1\"\n};\nconst expected = null;\nconst evaluate = (x) => x.text.split(x.before).length===2 ? x.text.replace(x.before,x.after) : null;\nconst mutant = (x) => x.text.replace(x.before,x.after);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Edição em vários arquivos e consumidores": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.3 / fixture: pricing, route e users formam o conjunto afetado ordenado. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"changed\": \"pricing\",\n  \"graph\": {\n    \"users\": [\n      \"pricing\"\n    ],\n    \"route\": [\n      \"users\"\n    ],\n    \"unrelated\": []\n  }\n};\nconst expected = [\n  \"pricing\",\n  \"route\",\n  \"users\"\n];\nconst evaluate = (x) => {const seen=new Set([x.changed]);let size;do{size=seen.size;for(const [name,deps] of Object.entries(x.graph))if(deps.some(d=>seen.has(d)))seen.add(name);}while(size!==seen.size);return [...seen].sort();};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.3 / contraprova: incluir apenas consumidores diretos de pricing; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"changed\": \"pricing\",\n  \"graph\": {\n    \"users\": [\n      \"pricing\"\n    ],\n    \"route\": [\n      \"users\"\n    ],\n    \"unrelated\": []\n  }\n};\nconst expected = [\n  \"pricing\",\n  \"route\",\n  \"users\"\n];\nconst evaluate = (x) => {const seen=new Set([x.changed]);let size;do{size=seen.size;for(const [name,deps] of Object.entries(x.graph))if(deps.some(d=>seen.has(d)))seen.add(name);}while(size!==seen.size);return [...seen].sort();};\nconst mutant = (x) => [x.changed,...Object.entries(x.graph).filter(([,deps])=>deps.includes(x.changed)).map(([name])=>name)].sort();\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Refatoração com invariantes observáveis": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.4 / fixture: caneta totaliza 5 e livro totaliza 1. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"caneta\",\n    \"qty\": 2\n  },\n  {\n    \"id\": \"livro\",\n    \"qty\": 1\n  },\n  {\n    \"id\": \"caneta\",\n    \"qty\": 3\n  }\n];\nconst expected = {\n  \"caneta\": 5,\n  \"livro\": 1\n};\nconst evaluate = (x) => {const out={};for(const row of x)out[row.id]=(out[row.id]??0)+row.qty;return out;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.4 / contraprova: atribuir a última quantidade em vez de somar ao acumulado; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"caneta\",\n    \"qty\": 2\n  },\n  {\n    \"id\": \"livro\",\n    \"qty\": 1\n  },\n  {\n    \"id\": \"caneta\",\n    \"qty\": 3\n  }\n];\nconst expected = {\n  \"caneta\": 5,\n  \"livro\": 1\n};\nconst evaluate = (x) => {const out={};for(const row of x)out[row.id]=(out[row.id]??0)+row.qty;return out;};\nconst mutant = (x) => {const out={};for(const row of x)out[row.id]=row.qty;return out;};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Comandos, diretório e argumentos": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.1 / fixture: os argumentos são exec, vitest, run e tests/cart total.test.ts. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"cwd\": \"workspace/app\",\n  \"path\": \"tests/cart total.test.ts\"\n};\nconst expected = {\n  \"executable\": \"pnpm\",\n  \"cwd\": \"workspace/app\",\n  \"args\": [\n    \"exec\",\n    \"vitest\",\n    \"run\",\n    \"tests/cart total.test.ts\"\n  ]\n};\nconst evaluate = (x) => ({executable:\"pnpm\",cwd:x.cwd,args:[\"exec\",\"vitest\",\"run\",x.path]});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.1 / contraprova: dividir o caminho por espaços ao montar argv; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"cwd\": \"workspace/app\",\n  \"path\": \"tests/cart total.test.ts\"\n};\nconst expected = {\n  \"executable\": \"pnpm\",\n  \"cwd\": \"workspace/app\",\n  \"args\": [\n    \"exec\",\n    \"vitest\",\n    \"run\",\n    \"tests/cart total.test.ts\"\n  ]\n};\nconst evaluate = (x) => ({executable:\"pnpm\",cwd:x.cwd,args:[\"exec\",\"vitest\",\"run\",x.path]});\nconst mutant = (x) => ({executable:\"pnpm\",cwd:x.cwd,args:[\"exec\",\"vitest\",\"run\",...x.path.split(\" \")]});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Aprovação de efeitos e escopo autorizado": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / fixture: o pedido de produção retorna false. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"grant\": {\n    \"operation\": \"write\",\n    \"environment\": \"staging\",\n    \"resource\": \"migrations/001.sql\"\n  },\n  \"request\": {\n    \"operation\": \"write\",\n    \"environment\": \"production\",\n    \"resource\": \"migrations/001.sql\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => [\"operation\",\"environment\",\"resource\"].every(k=>x.request[k]===x.grant[k]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / contraprova: validar apenas o verbo write; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"grant\": {\n    \"operation\": \"write\",\n    \"environment\": \"staging\",\n    \"resource\": \"migrations/001.sql\"\n  },\n  \"request\": {\n    \"operation\": \"write\",\n    \"environment\": \"production\",\n    \"resource\": \"migrations/001.sql\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => [\"operation\",\"environment\",\"resource\"].every(k=>x.request[k]===x.grant[k]);\nconst mutant = (x) => x.request.operation===x.grant.operation;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Sandbox, rede e caminhos protegidos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.3 / fixture: o caminho semelhante é recusado. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"root\": \"workspace\",\n  \"path\": \"workspace-old/secrets.txt\"\n};\nconst expected = false;\nconst evaluate = (x) => !x.path.split(\"/\").some(p=>p===\"..\" || p===\".\") && x.path.startsWith(x.root+\"/\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.3 / contraprova: usar startsWith de workspace sem barra delimitadora; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"root\": \"workspace\",\n  \"path\": \"workspace-old/secrets.txt\"\n};\nconst expected = false;\nconst evaluate = (x) => !x.path.split(\"/\").some(p=>p===\"..\" || p===\".\") && x.path.startsWith(x.root+\"/\");\nconst mutant = (x) => !x.path.split(\"/\").some(p=>p===\"..\" || p===\".\") && x.path.startsWith(x.root);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Ignore, segredos e conteúdo não confiável": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.4 / fixture: o resumo contém E_STOCK e cart sem token ou email. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"allowed\": [\n    \"errorCode\",\n    \"component\"\n  ],\n  \"record\": {\n    \"errorCode\": \"E_STOCK\",\n    \"component\": \"cart\",\n    \"token\": \"FICTICIO\",\n    \"email\": \"pessoa@example.invalid\"\n  }\n};\nconst expected = {\n  \"errorCode\": \"E_STOCK\",\n  \"component\": \"cart\"\n};\nconst evaluate = (x) => Object.fromEntries(x.allowed.filter(k=>Object.hasOwn(x.record,k)).map(k=>[k,x.record[k]]));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.4 / contraprova: copiar todos os campos do registro; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"allowed\": [\n    \"errorCode\",\n    \"component\"\n  ],\n  \"record\": {\n    \"errorCode\": \"E_STOCK\",\n    \"component\": \"cart\",\n    \"token\": \"FICTICIO\",\n    \"email\": \"pessoa@example.invalid\"\n  }\n};\nconst expected = {\n  \"errorCode\": \"E_STOCK\",\n  \"component\": \"cart\"\n};\nconst evaluate = (x) => Object.fromEntries(x.allowed.filter(k=>Object.hasOwn(x.record,k)).map(k=>[k,x.record[k]]));\nconst mutant = (x) => ({...x.record});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Regressão mínima que reproduz o defeito": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.1 / fixture: a reserva retorna saldo 0 em vez de ser recusada. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 3,\n  \"qty\": 3\n};\nconst expected = 0;\nconst evaluate = (x) => x.qty<=x.stock ? x.stock-x.qty : null;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.1 / contraprova: usar quantidade menor que estoque em vez de menor ou igual; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 3,\n  \"qty\": 3\n};\nconst expected = 0;\nconst evaluate = (x) => x.qty<=x.stock ? x.stock-x.qty : null;\nconst mutant = (x) => x.qty<x.stock ? x.stock-x.qty : null;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Oracles, mutantes e testes que contradizem": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.2 / fixture: o saldo é 91 centavos. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"price\": 101,\n  \"discount\": 10\n};\nconst expected = 91;\nconst evaluate = (x) => x.price-Math.floor(x.price*x.discount/100);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.2 / contraprova: arredondar para baixo o saldo proporcional em vez do desconto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"price\": 101,\n  \"discount\": 10\n};\nconst expected = 91;\nconst evaluate = (x) => x.price-Math.floor(x.price*x.discount/100);\nconst mutant = (x) => Math.floor(x.price*(100-x.discount)/100);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Typecheck, build e execução separadas": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.3 / fixture: build permanece como gate pendente. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"typecheck\",\n    \"unit\",\n    \"build\"\n  ],\n  \"results\": {\n    \"typecheck\": \"passed\",\n    \"unit\": \"passed\"\n  }\n};\nconst expected = [\n  \"build\"\n];\nconst evaluate = (x) => x.required.filter(g=>x.results[g]!==\"passed\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.3 / contraprova: listar somente gates explicitamente failed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"typecheck\",\n    \"unit\",\n    \"build\"\n  ],\n  \"results\": {\n    \"typecheck\": \"passed\",\n    \"unit\": \"passed\"\n  }\n};\nconst expected = [\n  \"build\"\n];\nconst evaluate = (x) => x.required.filter(g=>x.results[g]!==\"passed\");\nconst mutant = (x) => x.required.filter(g=>x.results[g]===\"failed\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Falhas, logs e redução do problema": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.4 / fixture: o resumo contém passed=2, failed=1 e skipped=3. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"passed\",\n  \"passed\",\n  \"failed\",\n  \"skipped\",\n  \"skipped\",\n  \"skipped\"\n];\nconst expected = {\n  \"passed\": 2,\n  \"failed\": 1,\n  \"skipped\": 3\n};\nconst evaluate = (x) => ({passed:x.filter(s=>s===\"passed\").length,failed:x.filter(s=>s===\"failed\").length,skipped:x.filter(s=>s===\"skipped\").length});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.4 / contraprova: somar skipped ao número de aprovações; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"passed\",\n  \"passed\",\n  \"failed\",\n  \"skipped\",\n  \"skipped\",\n  \"skipped\"\n];\nconst expected = {\n  \"passed\": 2,\n  \"failed\": 1,\n  \"skipped\": 3\n};\nconst evaluate = (x) => ({passed:x.filter(s=>s===\"passed\").length,failed:x.filter(s=>s===\"failed\").length,skipped:x.filter(s=>s===\"skipped\").length});\nconst mutant = (x) => ({passed:x.filter(s=>s!==\"failed\").length,failed:x.filter(s=>s===\"failed\").length,skipped:x.filter(s=>s===\"skipped\").length});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Alterações preexistentes e autoria": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.1 / fixture: o resultado é conflict e mantém contribuição-alheia. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"baseline\": \"antigo\",\n  \"current\": \"contribuicao-alheia\",\n  \"proposed\": \"correcao-agente\"\n};\nconst expected = {\n  \"status\": \"conflict\",\n  \"text\": \"contribuicao-alheia\"\n};\nconst evaluate = (x) => x.current===x.baseline ? {status:\"applied\",text:x.proposed} : {status:\"conflict\",text:x.current};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.1 / contraprova: aceitar proposed sem comparar a base atual; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"baseline\": \"antigo\",\n  \"current\": \"contribuicao-alheia\",\n  \"proposed\": \"correcao-agente\"\n};\nconst expected = {\n  \"status\": \"conflict\",\n  \"text\": \"contribuicao-alheia\"\n};\nconst evaluate = (x) => x.current===x.baseline ? {status:\"applied\",text:x.proposed} : {status:\"conflict\",text:x.current};\nconst mutant = (x) => ({status:\"applied\",text:x.proposed});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Checkpoint e histórico versionado": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.2 / fixture: agent.ts retorna a A e user.ts permanece contribuição-humana. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"before\": {\n    \"agent.ts\": \"A\",\n    \"user.ts\": \"U\"\n  },\n  \"now\": {\n    \"agent.ts\": \"B\",\n    \"user.ts\": \"contribuicao-humana\"\n  },\n  \"owned\": [\n    \"agent.ts\"\n  ]\n};\nconst expected = {\n  \"agent.ts\": \"A\",\n  \"user.ts\": \"contribuicao-humana\"\n};\nconst evaluate = (x) => {const out={...x.now};for(const key of x.owned)out[key]=x.before[key];return out;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.2 / contraprova: substituir now pelo snapshot before completo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"before\": {\n    \"agent.ts\": \"A\",\n    \"user.ts\": \"U\"\n  },\n  \"now\": {\n    \"agent.ts\": \"B\",\n    \"user.ts\": \"contribuicao-humana\"\n  },\n  \"owned\": [\n    \"agent.ts\"\n  ]\n};\nconst expected = {\n  \"agent.ts\": \"A\",\n  \"user.ts\": \"contribuicao-humana\"\n};\nconst evaluate = (x) => {const out={...x.now};for(const key of x.owned)out[key]=x.before[key];return out;};\nconst mutant = (x) => ({...x.before});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Branches, worktrees e base de revisão": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.3 / fixture: o ancestral comum é a. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"head\": \"feature2\",\n  \"base\": \"main2\",\n  \"parents\": {\n    \"feature2\": \"feature\",\n    \"feature\": \"a\",\n    \"main2\": \"main\",\n    \"main\": \"a\",\n    \"a\": null\n  }\n};\nconst expected = \"a\";\nconst evaluate = (x) => {const ancestors=new Set();for(let p=x.head;p;p=x.parents[p])ancestors.add(p);for(let p=x.base;p;p=x.parents[p])if(ancestors.has(p))return p;return null;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C7.3 / contraprova: retornar o pai de head sem percorrer a outra linha; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"head\": \"feature2\",\n  \"base\": \"main2\",\n  \"parents\": {\n    \"feature2\": \"feature\",\n    \"feature\": \"a\",\n    \"main2\": \"main\",\n    \"main\": \"a\",\n    \"a\": null\n  }\n};\nconst expected = \"a\";\nconst evaluate = (x) => {const ancestors=new Set();for(let p=x.head;p;p=x.parents[p])ancestors.add(p);for(let p=x.base;p;p=x.parents[p])if(ancestors.has(p))return p;return null;};\nconst mutant = (x) => x.parents[x.head]??null;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Pull request, revisão humana e entrega": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.4 / fixture: o gate de entrega retorna false. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"checks\": true,\n  \"review\": true,\n  \"pending\": [\n    \"migracao\"\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.checks===true && x.review===true && x.pending.length===0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.4 / contraprova: ignorar a lista pending ao decidir entrega; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"checks\": true,\n  \"review\": true,\n  \"pending\": [\n    \"migracao\"\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.checks===true && x.review===true && x.pending.length===0;\nconst mutant = (x) => x.checks===true && x.review===true;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "MCP, ferramentas e capacidade concedida": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.1 / fixture: readIssue é a única ferramenta elegível. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"need\": \"issues:read\",\n  \"tools\": [\n    {\n      \"name\": \"readIssue\",\n      \"capability\": \"issues:read\"\n    },\n    {\n      \"name\": \"writeIssue\",\n      \"capability\": \"issues:write\"\n    },\n    {\n      \"name\": \"publish\",\n      \"capability\": \"release:write\"\n    }\n  ]\n};\nconst expected = [\n  \"readIssue\"\n];\nconst evaluate = (x) => x.tools.filter(t=>t.capability===x.need).map(t=>t.name);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.1 / contraprova: comparar só o prefixo do recurso antes de dois pontos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"need\": \"issues:read\",\n  \"tools\": [\n    {\n      \"name\": \"readIssue\",\n      \"capability\": \"issues:read\"\n    },\n    {\n      \"name\": \"writeIssue\",\n      \"capability\": \"issues:write\"\n    },\n    {\n      \"name\": \"publish\",\n      \"capability\": \"release:write\"\n    }\n  ]\n};\nconst expected = [\n  \"readIssue\"\n];\nconst evaluate = (x) => x.tools.filter(t=>t.capability===x.need).map(t=>t.name);\nconst mutant = (x) => x.tools.filter(t=>t.capability.split(\":\")[0]===x.need.split(\":\")[0]).map(t=>t.name);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Schemas, argumentos e validação de retorno": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.2 / fixture: a entrada fracionária retorna false. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"item\": \"vaga-1\",\n  \"qty\": 2.5\n};\nconst expected = false;\nconst evaluate = (x) => Number.isInteger(x.qty) && x.qty>0 && typeof x.item===\"string\" && x.item.length>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.2 / contraprova: validar tipo number e positividade sem exigir inteiro; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"item\": \"vaga-1\",\n  \"qty\": 2.5\n};\nconst expected = false;\nconst evaluate = (x) => Number.isInteger(x.qty) && x.qty>0 && typeof x.item===\"string\" && x.item.length>0;\nconst mutant = (x) => typeof x.qty===\"number\" && x.qty>0 && typeof x.item===\"string\" && x.item.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Hooks e observação de eventos": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.3 / fixture: o número de ações observadas é 2. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"actionId\": \"a\",\n    \"status\": \"completed\"\n  },\n  {\n    \"actionId\": \"a\",\n    \"status\": \"completed\"\n  },\n  {\n    \"actionId\": \"b\",\n    \"status\": \"completed\"\n  }\n];\nconst expected = 2;\nconst evaluate = (x) => new Set(x.filter(e=>e.status===\"completed\").map(e=>e.actionId)).size;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.3 / contraprova: contar linhas sem deduplicar actionId; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"actionId\": \"a\",\n    \"status\": \"completed\"\n  },\n  {\n    \"actionId\": \"a\",\n    \"status\": \"completed\"\n  },\n  {\n    \"actionId\": \"b\",\n    \"status\": \"completed\"\n  }\n];\nconst expected = 2;\nconst evaluate = (x) => new Set(x.filter(e=>e.status===\"completed\").map(e=>e.actionId)).size;\nconst mutant = (x) => x.filter(e=>e.status===\"completed\").length;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "CLI, execução automatizada e contratos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.4 / fixture: o gate de resultado retorna false. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"status\": \"failed\",\n  \"exitCode\": 0,\n  \"summary\": \"sucesso anterior não confirma esta tarefa\"\n};\nconst expected = false;\nconst evaluate = (x) => x.status===\"completed\" && x.exitCode===0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.4 / contraprova: aceitar qualquer summary que contenha sucesso; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"status\": \"failed\",\n  \"exitCode\": 0,\n  \"summary\": \"sucesso anterior não confirma esta tarefa\"\n};\nconst expected = false;\nconst evaluate = (x) => x.status===\"completed\" && x.exitCode===0;\nconst mutant = (x) => x.summary.includes(\"sucesso\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Ambiente remoto e reprodução local": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / fixture: lockfile aparece como divergência conhecida. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"source\": {\n    \"revision\": \"r7\",\n    \"runtime\": \"Node24\",\n    \"lockfile\": \"L1\"\n  },\n  \"target\": {\n    \"revision\": \"r7\",\n    \"runtime\": \"Node24\",\n    \"lockfile\": \"L2\"\n  }\n};\nconst expected = [\n  \"lockfile\"\n];\nconst evaluate = (x) => [\"revision\",\"runtime\",\"lockfile\"].filter(k=>x.source[k]!==x.target[k]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / contraprova: verificar apenas revisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"source\": {\n    \"revision\": \"r7\",\n    \"runtime\": \"Node24\",\n    \"lockfile\": \"L1\"\n  },\n  \"target\": {\n    \"revision\": \"r7\",\n    \"runtime\": \"Node24\",\n    \"lockfile\": \"L2\"\n  }\n};\nconst expected = [\n  \"lockfile\"\n];\nconst evaluate = (x) => [\"revision\",\"runtime\",\"lockfile\"].filter(k=>x.source[k]!==x.target[k]);\nconst mutant = (x) => [\"revision\"].filter(k=>x.source[k]!==x.target[k]);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Concorrência, divisão e conflitos de integração": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.2 / fixture: schema.ts é a sobreposição que exige coordenação. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": [\n    \"service.ts\",\n    \"schema.ts\"\n  ],\n  \"b\": [\n    \"schema.ts\",\n    \"ui.ts\"\n  ]\n};\nconst expected = [\n  \"schema.ts\"\n];\nconst evaluate = (x) => [...new Set(x.a.filter(p=>x.b.includes(p)))].sort();\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.2 / contraprova: comparar apenas os primeiros caminhos das listas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": [\n    \"service.ts\",\n    \"schema.ts\"\n  ],\n  \"b\": [\n    \"schema.ts\",\n    \"ui.ts\"\n  ]\n};\nconst expected = [\n  \"schema.ts\"\n];\nconst evaluate = (x) => [...new Set(x.a.filter(p=>x.b.includes(p)))].sort();\nconst mutant = (x) => x.a[0]===x.b[0] ? [x.a[0]] : [];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Cancelamento, retomada e efeitos repetidos": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.3 / fixture: o replay mantém saldo 7 e applied com a. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"balance\": 7,\n  \"applied\": [\n    \"a\"\n  ],\n  \"id\": \"a\",\n  \"amount\": 3\n};\nconst expected = {\n  \"balance\": 7,\n  \"applied\": [\n    \"a\"\n  ]\n};\nconst evaluate = (x) => x.applied.includes(x.id) ? {balance:x.balance,applied:x.applied} : {balance:x.balance-x.amount,applied:[...x.applied,x.id]};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C9.3 / contraprova: subtrair o valor sem consultar a identidade; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"balance\": 7,\n  \"applied\": [\n    \"a\"\n  ],\n  \"id\": \"a\",\n  \"amount\": 3\n};\nconst expected = {\n  \"balance\": 7,\n  \"applied\": [\n    \"a\"\n  ]\n};\nconst evaluate = (x) => x.applied.includes(x.id) ? {balance:x.balance,applied:x.applied} : {balance:x.balance-x.amount,applied:[...x.applied,x.id]};\nconst mutant = (x) => ({balance:x.balance-x.amount,applied:[...new Set([...x.applied,x.id])]});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Artefatos, evidência e gate de publicação": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.4 / fixture: a identidade de artefato retorna false. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"reference\": \"enabled=true\",\n  \"proposed\": \"enabled=fail\",\n  \"expectedDigest\": \"b29bef3b6ff4467b6a447fab76f6fa4594e92172567d7133824ecd907537979e\"\n};\nconst expected = false;\nconst evaluate = (x) => require(\"node:crypto\").createHash(\"sha256\").update(x.proposed).digest(\"hex\")===x.expectedDigest;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C9.4 / contraprova: comparar somente comprimento com a referência; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"reference\": \"enabled=true\",\n  \"proposed\": \"enabled=fail\",\n  \"expectedDigest\": \"b29bef3b6ff4467b6a447fab76f6fa4594e92172567d7133824ecd907537979e\"\n};\nconst expected = false;\nconst evaluate = (x) => require(\"node:crypto\").createHash(\"sha256\").update(x.proposed).digest(\"hex\")===x.expectedDigest;\nconst mutant = (x) => x.proposed.length===x.reference.length;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Fluxo de dados e classificação do contexto": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / fixture: doc-a e doc-b entram na lista de contexto. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"allowed\": [\n    \"publico\",\n    \"interno-autorizado\"\n  ],\n  \"records\": [\n    {\n      \"id\": \"doc-a\",\n      \"classification\": \"publico\"\n    },\n    {\n      \"id\": \"doc-b\",\n      \"classification\": \"interno-autorizado\"\n    },\n    {\n      \"id\": \"doc-c\",\n      \"classification\": \"restrito\"\n    },\n    {\n      \"id\": \"doc-d\",\n      \"classification\": \"desconhecido\"\n    }\n  ]\n};\nconst expected = [\n  \"doc-a\",\n  \"doc-b\"\n];\nconst evaluate = (x) => x.records.filter(r=>x.allowed.includes(r.classification)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / contraprova: aceitar desconhecido junto das categorias permitidas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"allowed\": [\n    \"publico\",\n    \"interno-autorizado\"\n  ],\n  \"records\": [\n    {\n      \"id\": \"doc-a\",\n      \"classification\": \"publico\"\n    },\n    {\n      \"id\": \"doc-b\",\n      \"classification\": \"interno-autorizado\"\n    },\n    {\n      \"id\": \"doc-c\",\n      \"classification\": \"restrito\"\n    },\n    {\n      \"id\": \"doc-d\",\n      \"classification\": \"desconhecido\"\n    }\n  ]\n};\nconst expected = [\n  \"doc-a\",\n  \"doc-b\"\n];\nconst evaluate = (x) => x.records.filter(r=>x.allowed.includes(r.classification)).map(r=>r.id);\nconst mutant = (x) => x.records.filter(r=>r.classification===\"desconhecido\" || x.allowed.includes(r.classification)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Configuração, políticas e governança": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.2 / fixture: o limite efetivo é 3. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"organization\": 3,\n  \"project\": 5\n};\nconst expected = 3;\nconst evaluate = (x) => Math.min(x.organization,x.project);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.2 / contraprova: usar o maior teto; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"organization\": 3,\n  \"project\": 5\n};\nconst expected = 3;\nconst evaluate = (x) => Math.min(x.organization,x.project);\nconst mutant = (x) => Math.max(x.organization,x.project);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Modelos, avaliação e incerteza": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.3 / fixture: a avaliação retorna ratio=2/3, evaluated=3 e pending=1. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"passed\",\n  \"passed\",\n  \"failed\",\n  \"pending\"\n];\nconst expected = {\n  \"ratio\": 0.6666666666666666,\n  \"evaluated\": 3,\n  \"pending\": 1\n};\nconst evaluate = (x) => {const evaluated=x.filter(s=>s!==\"pending\").length;return {ratio:evaluated?x.filter(s=>s===\"passed\").length/evaluated:null,evaluated,pending:x.filter(s=>s===\"pending\").length};};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.3 / contraprova: dividir aprovações pelo total incluindo pending; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  \"passed\",\n  \"passed\",\n  \"failed\",\n  \"pending\"\n];\nconst expected = {\n  \"ratio\": 0.6666666666666666,\n  \"evaluated\": 3,\n  \"pending\": 1\n};\nconst evaluate = (x) => {const evaluated=x.filter(s=>s!==\"pending\").length;return {ratio:evaluated?x.filter(s=>s===\"passed\").length/evaluated:null,evaluated,pending:x.filter(s=>s===\"pending\").length};};\nconst mutant = (x) => ({ratio:x.filter(s=>s===\"passed\").length/x.length,evaluated:x.filter(s=>s!==\"pending\").length,pending:x.filter(s=>s===\"pending\").length});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Orçamento, latência e limite de tentativas": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.4 / fixture: a nova tentativa é recusada pelo orçamento. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"used\": 2,\n  \"max\": 3,\n  \"cost\": 8,\n  \"next\": 3,\n  \"budget\": 10\n};\nconst expected = false;\nconst evaluate = (x) => x.used<x.max && x.cost+x.next<=x.budget;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.4 / contraprova: considerar apenas o limite de tentativas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"used\": 2,\n  \"max\": 3,\n  \"cost\": 8,\n  \"next\": 3,\n  \"budget\": 10\n};\nconst expected = false;\nconst evaluate = (x) => x.used<x.max && x.cost+x.next<=x.budget;\nconst mutant = (x) => x.used<x.max;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Observabilidade de ações e resultados": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.1 / fixture: somente a aparece como concluída. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"a\",\n    \"type\": \"start\"\n  },\n  {\n    \"id\": \"a\",\n    \"type\": \"finish\"\n  },\n  {\n    \"id\": \"b\",\n    \"type\": \"start\"\n  }\n];\nconst expected = [\n  \"a\"\n];\nconst evaluate = (x) => [...new Set(x.filter(e=>e.type===\"start\" && x.some(f=>f.type===\"finish\" && f.id===e.id)).map(e=>e.id))];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.1 / contraprova: listar todas as ações iniciadas como concluídas; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"a\",\n    \"type\": \"start\"\n  },\n  {\n    \"id\": \"a\",\n    \"type\": \"finish\"\n  },\n  {\n    \"id\": \"b\",\n    \"type\": \"start\"\n  }\n];\nconst expected = [\n  \"a\"\n];\nconst evaluate = (x) => [...new Set(x.filter(e=>e.type===\"start\" && x.some(f=>f.type===\"finish\" && f.id===e.id)).map(e=>e.id))];\nconst mutant = (x) => [...new Set(x.filter(e=>e.type===\"start\").map(e=>e.id))];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Dependências, ambiente e supply chain": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.2 / fixture: parser-demo aparece na lista de divergências. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"lock\": {\n    \"parser-demo\": \"1.0\"\n  },\n  \"installed\": {\n    \"parser-demo\": \"1.1\"\n  }\n};\nconst expected = [\n  \"parser-demo\"\n];\nconst evaluate = (x) => Object.keys(x.lock).filter(k=>x.installed[k]!==x.lock[k]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.2 / contraprova: aceitar qualquer versão quando o nome existe; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"lock\": {\n    \"parser-demo\": \"1.0\"\n  },\n  \"installed\": {\n    \"parser-demo\": \"1.1\"\n  }\n};\nconst expected = [\n  \"parser-demo\"\n];\nconst evaluate = (x) => Object.keys(x.lock).filter(k=>x.installed[k]!==x.lock[k]);\nconst mutant = (x) => Object.keys(x.lock).filter(k=>!Object.hasOwn(x.installed,k));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Acessibilidade e revisão da interface": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / fixture: delete aparece como violação estrutural. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"save\",\n    \"role\": \"button\",\n    \"name\": \"Salvar\"\n  },\n  {\n    \"id\": \"delete\",\n    \"role\": \"button\",\n    \"name\": \"\"\n  }\n];\nconst expected = [\n  \"delete\"\n];\nconst evaluate = (x) => x.filter(c=>c.role===\"button\" && c.name.trim()===\"\").map(c=>c.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / contraprova: usar ID como fallback para aceitar um nome ausente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"save\",\n    \"role\": \"button\",\n    \"name\": \"Salvar\"\n  },\n  {\n    \"id\": \"delete\",\n    \"role\": \"button\",\n    \"name\": \"\"\n  }\n];\nconst expected = [\n  \"delete\"\n];\nconst evaluate = (x) => x.filter(c=>c.role===\"button\" && c.name.trim()===\"\").map(c=>c.id);\nconst mutant = (x) => x.filter(c=>c.role===\"button\" && (c.name||c.id).trim()===\"\").map(c=>c.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Incidente, reversão e passagem de contexto": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.4 / fixture: o resultado mantém r3 e informa stale-base. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"current\": \"r3\",\n  \"badRevision\": \"r2\",\n  \"rollback\": \"r1\"\n};\nconst expected = {\n  \"revision\": \"r3\",\n  \"status\": \"stale-base\"\n};\nconst evaluate = (x) => x.current===x.badRevision ? {revision:x.rollback,status:\"reverted\"} : {revision:x.current,status:\"stale-base\"};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C11.4 / contraprova: aplicar r1 sem comparar revisão atual; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"current\": \"r3\",\n  \"badRevision\": \"r2\",\n  \"rollback\": \"r1\"\n};\nconst expected = {\n  \"revision\": \"r3\",\n  \"status\": \"stale-base\"\n};\nconst evaluate = (x) => x.current===x.badRevision ? {revision:x.rollback,status:\"reverted\"} : {revision:x.current,status:\"stale-base\"};\nconst mutant = (x) => ({revision:x.rollback,status:\"reverted\"});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Contrato da última vaga e plano de edição": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.1 / fixture: p1 é accepted, p2 é rejected e o saldo final é 0. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 1,\n  \"requests\": [\n    {\n      \"id\": \"p1\",\n      \"qty\": 1\n    },\n    {\n      \"id\": \"p2\",\n      \"qty\": 1\n    }\n  ]\n};\nconst expected = {\n  \"stock\": 0,\n  \"results\": [\n    {\n      \"id\": \"p1\",\n      \"status\": \"accepted\"\n    },\n    {\n      \"id\": \"p2\",\n      \"status\": \"rejected\"\n    }\n  ]\n};\nconst evaluate = (x) => {let stock=x.stock;const results=x.requests.map(r=>{const ok=r.qty<=stock;if(ok)stock-=r.qty;return {id:r.id,status:ok?\"accepted\":\"rejected\"};});return {stock,results};};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.1 / contraprova: avaliar cada pedido contra o estoque inicial sem descontar a aceitação anterior; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stock\": 1,\n  \"requests\": [\n    {\n      \"id\": \"p1\",\n      \"qty\": 1\n    },\n    {\n      \"id\": \"p2\",\n      \"qty\": 1\n    }\n  ]\n};\nconst expected = {\n  \"stock\": 0,\n  \"results\": [\n    {\n      \"id\": \"p1\",\n      \"status\": \"accepted\"\n    },\n    {\n      \"id\": \"p2\",\n      \"status\": \"rejected\"\n    }\n  ]\n};\nconst evaluate = (x) => {let stock=x.stock;const results=x.requests.map(r=>{const ok=r.qty<=stock;if(ok)stock-=r.qty;return {id:r.id,status:ok?\"accepted\":\"rejected\"};});return {stock,results};};\nconst mutant = (x) => ({stock:x.stock-x.requests.filter(r=>r.qty<=x.stock).reduce((s,r)=>s+r.qty,0),results:x.requests.map(r=>({id:r.id,status:r.qty<=x.stock?\"accepted\":\"rejected\"}))});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Reserva, idempotência e autorização": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.2 / fixture: o payload devolvido é reserva-t2. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"tenant\": \"t2\",\n  \"id\": \"k\",\n  \"records\": [\n    {\n      \"tenant\": \"t1\",\n      \"id\": \"k\",\n      \"payload\": \"reserva-t1\"\n    },\n    {\n      \"tenant\": \"t2\",\n      \"id\": \"k\",\n      \"payload\": \"reserva-t2\"\n    }\n  ]\n};\nconst expected = \"reserva-t2\";\nconst evaluate = (x) => x.records.find(r=>r.tenant===x.tenant && r.id===x.id)?.payload??null;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.2 / contraprova: consultar somente ID e ignorar tenant; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"tenant\": \"t2\",\n  \"id\": \"k\",\n  \"records\": [\n    {\n      \"tenant\": \"t1\",\n      \"id\": \"k\",\n      \"payload\": \"reserva-t1\"\n    },\n    {\n      \"tenant\": \"t2\",\n      \"id\": \"k\",\n      \"payload\": \"reserva-t2\"\n    }\n  ]\n};\nconst expected = \"reserva-t2\";\nconst evaluate = (x) => x.records.find(r=>r.tenant===x.tenant && r.id===x.id)?.payload??null;\nconst mutant = (x) => x.records.find(r=>r.id===x.id)?.payload??null;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Integração, revisão e evidências do laboratório": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.3 / fixture: concurrency permanece na lista de provas faltantes de r4. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r4\",\n  \"required\": [\n    \"unit\",\n    \"typecheck\",\n    \"build\",\n    \"concurrency\"\n  ],\n  \"runs\": [\n    {\n      \"gate\": \"unit\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"gate\": \"typecheck\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"gate\": \"build\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"gate\": \"concurrency\",\n      \"status\": \"passed\",\n      \"revision\": \"r3\"\n    }\n  ]\n};\nconst expected = [\n  \"concurrency\"\n];\nconst evaluate = (x) => x.required.filter(g=>!x.runs.some(r=>r.gate===g && r.status===\"passed\" && r.revision===x.revision));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.3 / contraprova: aceitar aprovação do gate em qualquer revisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"revision\": \"r4\",\n  \"required\": [\n    \"unit\",\n    \"typecheck\",\n    \"build\",\n    \"concurrency\"\n  ],\n  \"runs\": [\n    {\n      \"gate\": \"unit\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"gate\": \"typecheck\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"gate\": \"build\",\n      \"status\": \"passed\",\n      \"revision\": \"r4\"\n    },\n    {\n      \"gate\": \"concurrency\",\n      \"status\": \"passed\",\n      \"revision\": \"r3\"\n    }\n  ]\n};\nconst expected = [\n  \"concurrency\"\n];\nconst evaluate = (x) => x.required.filter(g=>!x.runs.some(r=>r.gate===g && r.status===\"passed\" && r.revision===x.revision));\nconst mutant = (x) => x.required.filter(g=>!x.runs.some(r=>r.gate===g && r.status===\"passed\"));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Handoff, limites nativos e fechamento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / fixture: somente projeção-local recebe atestado de execução. Prova local declarada, sem agente ou efeito Cursor.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"projecao-local\",\n    \"status\": \"passed\",\n    \"description\": \"assertion local executada\"\n  },\n  {\n    \"id\": \"cursor-nativo\",\n    \"status\": \"pending\",\n    \"description\": \"procedimento de ensaio definido\"\n  }\n];\nconst expected = [\n  \"projecao-local\"\n];\nconst evaluate = (x) => x.filter(r=>r.status===\"passed\").map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / contraprova: aceitar qualquer registro que possua descrição; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"projecao-local\",\n    \"status\": \"passed\",\n    \"description\": \"assertion local executada\"\n  },\n  {\n    \"id\": \"cursor-nativo\",\n    \"status\": \"pending\",\n    \"description\": \"procedimento de ensaio definido\"\n  }\n];\nconst expected = [\n  \"projecao-local\"\n];\nconst evaluate = (x) => x.filter(r=>r.status===\"passed\").map(r=>r.id);\nconst mutant = (x) => x.filter(r=>r.description.length>0).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ]
};
