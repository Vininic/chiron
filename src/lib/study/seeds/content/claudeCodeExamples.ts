export interface ClaudeCodeExample {lang:string;scope:"local-rule"|"local-transform"|"model";purpose:string;code:string}
export const CLAUDE_CODE_EXAMPLES: Record<string,[ClaudeCodeExample,ClaudeCodeExample]> = {
  "CLI, IDE e identidade do ambiente": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / fixture: runtime aparece como diferença entre as sessões. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"project\": \"quiron\",\n    \"revision\": \"r8\",\n    \"runtime\": \"Node24\"\n  },\n  \"b\": {\n    \"project\": \"quiron\",\n    \"revision\": \"r8\",\n    \"runtime\": \"Node22\"\n  }\n};\nconst expected = [\n  \"runtime\"\n];\nconst evaluate = (x) => [\"project\",\"revision\",\"runtime\"].filter(k=>x.a[k]!==x.b[k]);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.1 / contraprova: comparar somente projeto e revisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"project\": \"quiron\",\n    \"revision\": \"r8\",\n    \"runtime\": \"Node24\"\n  },\n  \"b\": {\n    \"project\": \"quiron\",\n    \"revision\": \"r8\",\n    \"runtime\": \"Node22\"\n  }\n};\nconst expected = [\n  \"runtime\"\n];\nconst evaluate = (x) => [\"project\",\"revision\",\"runtime\"].filter(k=>x.a[k]!==x.b[k]);\nconst mutant = (x) => [\"project\",\"revision\"].filter(k=>x.a[k]!==x.b[k]);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Raiz, shell e configuração inicial": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.2 / fixture: o alvo textual é repo/docs. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"repo/packages/app\",\n  \"relative\": \"../../docs\"\n};\nconst expected = \"repo/docs\";\nconst evaluate = (x) => {const parts=x.base.split(\"/\");for(const p of x.relative.split(\"/\")){if(p===\"..\")parts.pop();else if(p!==\".\")parts.push(p);}return parts.join(\"/\");};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C1.2 / contraprova: concatenar base e relativo sem normalização; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"repo/packages/app\",\n  \"relative\": \"../../docs\"\n};\nconst expected = \"repo/docs\";\nconst evaluate = (x) => {const parts=x.base.split(\"/\");for(const p of x.relative.split(\"/\")){if(p===\"..\")parts.pop();else if(p!==\".\")parts.push(p);}return parts.join(\"/\");};\nconst mutant = (x) => x.base+\"/\"+x.relative;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Pedido, critérios e ações observáveis": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.3 / fixture: o contrato incompleto retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"trigger\": \"pedido de outro tenant\",\n  \"expected\": \"rejeitar acesso\",\n  \"invariant\": \"\"\n};\nconst expected = false;\nconst evaluate = (x) => [\"trigger\",\"expected\",\"invariant\"].every(k=>typeof x[k]===\"string\" && x[k].trim().length>0);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C1.3 / contraprova: validar apenas expected; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"trigger\": \"pedido de outro tenant\",\n  \"expected\": \"rejeitar acesso\",\n  \"invariant\": \"\"\n};\nconst expected = false;\nconst evaluate = (x) => [\"trigger\",\"expected\",\"invariant\"].every(k=>typeof x[k]===\"string\" && x[k].trim().length>0);\nconst mutant = (x) => typeof x.expected===\"string\" && x.expected.trim().length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Loop de ferramentas e responsabilidade humana": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C1.4 / fixture: a transição retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"from\": \"planned\",\n  \"to\": \"passed\"\n};\nconst expected = false;\nconst evaluate = (x) => ({planned:[\"running\"],running:[\"passed\",\"failed\"],passed:[],failed:[]}[x.from]??[]).includes(x.to);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C1.4 / contraprova: aceitar qualquer transição cujo destino seja passed; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"from\": \"planned\",\n  \"to\": \"passed\"\n};\nconst expected = false;\nconst evaluate = (x) => ({planned:[\"running\"],running:[\"passed\",\"failed\"],passed:[],failed:[]}[x.from]??[]).includes(x.to);\nconst mutant = (x) => x.to===\"passed\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Leitura orientada por símbolos e consumidores": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.1 / fixture: route.ts e worker.ts são os consumidores selecionados. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"symbol\": \"reserve\",\n  \"refs\": [\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"declaration\",\n      \"path\": \"service.ts\"\n    },\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"comment\",\n      \"path\": \"docs.md\"\n    },\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"call\",\n      \"path\": \"route.ts\"\n    },\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"call\",\n      \"path\": \"worker.ts\"\n    }\n  ]\n};\nconst expected = [\n  \"route.ts\",\n  \"worker.ts\"\n];\nconst evaluate = (x) => x.refs.filter(r=>r.symbol===x.symbol && r.kind===\"call\").map(r=>r.path);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.1 / contraprova: selecionar qualquer menção ao símbolo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"symbol\": \"reserve\",\n  \"refs\": [\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"declaration\",\n      \"path\": \"service.ts\"\n    },\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"comment\",\n      \"path\": \"docs.md\"\n    },\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"call\",\n      \"path\": \"route.ts\"\n    },\n    {\n      \"symbol\": \"reserve\",\n      \"kind\": \"call\",\n      \"path\": \"worker.ts\"\n    }\n  ]\n};\nconst expected = [\n  \"route.ts\",\n  \"worker.ts\"\n];\nconst evaluate = (x) => x.refs.filter(r=>r.symbol===x.symbol && r.kind===\"call\").map(r=>r.path);\nconst mutant = (x) => x.refs.filter(r=>r.symbol===x.symbol).map(r=>r.path);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Busca, redução e referências de código": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.2 / fixture: a lista é api/reserve.ts e api/guard.ts. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"package\": \"api\",\n  \"matches\": [\n    {\n      \"package\": \"web\",\n      \"path\": \"web/reserve.ts\"\n    },\n    {\n      \"package\": \"api\",\n      \"path\": \"api/reserve.ts\"\n    },\n    {\n      \"package\": \"api\",\n      \"path\": \"api/reserve.ts\"\n    },\n    {\n      \"package\": \"api\",\n      \"path\": \"api/guard.ts\"\n    }\n  ]\n};\nconst expected = [\n  \"api/reserve.ts\",\n  \"api/guard.ts\"\n];\nconst evaluate = (x) => [...new Set(x.matches.filter(m=>m.package===x.package).map(m=>m.path))];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C2.2 / contraprova: deduplicar globalmente por basename antes de aplicar o filtro de pacote; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"package\": \"api\",\n  \"matches\": [\n    {\n      \"package\": \"web\",\n      \"path\": \"web/reserve.ts\"\n    },\n    {\n      \"package\": \"api\",\n      \"path\": \"api/reserve.ts\"\n    },\n    {\n      \"package\": \"api\",\n      \"path\": \"api/reserve.ts\"\n    },\n    {\n      \"package\": \"api\",\n      \"path\": \"api/guard.ts\"\n    }\n  ]\n};\nconst expected = [\n  \"api/reserve.ts\",\n  \"api/guard.ts\"\n];\nconst evaluate = (x) => [...new Set(x.matches.filter(m=>m.package===x.package).map(m=>m.path))];\nconst mutant = (x) => {const seen=new Set();return x.matches.filter(m=>{const name=m.path.split(\"/\").at(-1);if(seen.has(name))return false;seen.add(name);return true;}).filter(m=>m.package===x.package).map(m=>m.path);};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Logs como dados e procedência da hipótese": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / fixture: somente E_AUTH pertence à evidência da execução run2. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"run\": \"run2\",\n  \"logs\": [\n    {\n      \"run\": \"run1\",\n      \"source\": \"application\",\n      \"severity\": \"error\",\n      \"code\": \"E_OLD\"\n    },\n    {\n      \"run\": \"run2\",\n      \"source\": \"user\",\n      \"severity\": \"error\",\n      \"code\": \"INSTRUCAO\"\n    },\n    {\n      \"run\": \"run2\",\n      \"source\": \"application\",\n      \"severity\": \"error\",\n      \"code\": \"E_AUTH\"\n    }\n  ]\n};\nconst expected = [\n  \"E_AUTH\"\n];\nconst evaluate = (x) => x.logs.filter(l=>l.run===x.run && l.source===\"application\").map(l=>l.code);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.3 / contraprova: selecionar qualquer registro com severity error; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"run\": \"run2\",\n  \"logs\": [\n    {\n      \"run\": \"run1\",\n      \"source\": \"application\",\n      \"severity\": \"error\",\n      \"code\": \"E_OLD\"\n    },\n    {\n      \"run\": \"run2\",\n      \"source\": \"user\",\n      \"severity\": \"error\",\n      \"code\": \"INSTRUCAO\"\n    },\n    {\n      \"run\": \"run2\",\n      \"source\": \"application\",\n      \"severity\": \"error\",\n      \"code\": \"E_AUTH\"\n    }\n  ]\n};\nconst expected = [\n  \"E_AUTH\"\n];\nconst evaluate = (x) => x.logs.filter(l=>l.run===x.run && l.source===\"application\").map(l=>l.code);\nconst mutant = (x) => x.logs.filter(l=>l.severity===\"error\").map(l=>l.code);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Contexto suficiente e evidência independente": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.4 / fixture: unidade permanece como informação faltante. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"assinatura\",\n    \"unidade\",\n    \"consumidor\"\n  ],\n  \"available\": [\n    \"assinatura\",\n    \"consumidor\"\n  ]\n};\nconst expected = [\n  \"unidade\"\n];\nconst evaluate = (x) => x.required.filter(k=>!x.available.includes(k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C2.4 / contraprova: declarar contexto completo quando assinatura está presente; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"assinatura\",\n    \"unidade\",\n    \"consumidor\"\n  ],\n  \"available\": [\n    \"assinatura\",\n    \"consumidor\"\n  ]\n};\nconst expected = [\n  \"unidade\"\n];\nconst evaluate = (x) => x.required.filter(k=>!x.available.includes(k));\nconst mutant = (x) => x.available.includes(\"assinatura\") ? [] : x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Instruções do projeto e imports de memória": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.1 / fixture: o caminho é packages/api/rules/auth.md. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"document\": \"packages/api/CLAUDE.md\",\n  \"relative\": \"rules/auth.md\",\n  \"cwd\": \"repo\"\n};\nconst expected = \"packages/api/rules/auth.md\";\nconst evaluate = (x) => x.document.slice(0,x.document.lastIndexOf(\"/\")+1)+x.relative;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C3.1 / contraprova: resolver o import a partir de cwd; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"document\": \"packages/api/CLAUDE.md\",\n  \"relative\": \"rules/auth.md\",\n  \"cwd\": \"repo\"\n};\nconst expected = \"packages/api/rules/auth.md\";\nconst evaluate = (x) => x.document.slice(0,x.document.lastIndexOf(\"/\")+1)+x.relative;\nconst mutant = (x) => x.cwd+\"/\"+x.relative;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Regras por caminho e aplicabilidade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.2 / fixture: nenhuma regra do conjunto é aplicada ao alvo. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"src/server/a.js\",\n  \"rules\": [\n    {\n      \"id\": \"typed-server\",\n      \"directory\": \"src/server/\",\n      \"extension\": \".ts\"\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.rules.filter(r=>x.path.startsWith(r.directory) && x.path.endsWith(r.extension)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.2 / contraprova: ignorar extensão e considerar apenas diretório; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"path\": \"src/server/a.js\",\n  \"rules\": [\n    {\n      \"id\": \"typed-server\",\n      \"directory\": \"src/server/\",\n      \"extension\": \".ts\"\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.rules.filter(r=>x.path.startsWith(r.directory) && x.path.endsWith(r.extension)).map(r=>r.id);\nconst mutant = (x) => x.rules.filter(r=>x.path.startsWith(r.directory)).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Memória automática e informação perecível": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.3 / fixture: somente convencao é elegível. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"now\": 10,\n  \"notes\": [\n    {\n      \"id\": \"convencao\",\n      \"expires\": 20,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"quota\",\n      \"expires\": 5,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"credencial\",\n      \"expires\": 20,\n      \"sensitive\": true\n    }\n  ]\n};\nconst expected = [\n  \"convencao\"\n];\nconst evaluate = (x) => x.notes.filter(n=>!n.sensitive && n.expires>x.now).map(n=>n.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C3.3 / contraprova: ignorar validade e filtrar apenas sensibilidade; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"now\": 10,\n  \"notes\": [\n    {\n      \"id\": \"convencao\",\n      \"expires\": 20,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"quota\",\n      \"expires\": 5,\n      \"sensitive\": false\n    },\n    {\n      \"id\": \"credencial\",\n      \"expires\": 20,\n      \"sensitive\": true\n    }\n  ]\n};\nconst expected = [\n  \"convencao\"\n];\nconst evaluate = (x) => x.notes.filter(n=>!n.sensitive && n.expires>x.now).map(n=>n.id);\nconst mutant = (x) => x.notes.filter(n=>!n.sensitive).map(n=>n.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Compactação e recuperação de decisões": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.4 / fixture: o resumo vigente contém somente edit. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"publish\",\n    \"active\": true\n  },\n  {\n    \"id\": \"edit\",\n    \"active\": true\n  },\n  {\n    \"id\": \"publish\",\n    \"active\": false\n  }\n];\nconst expected = [\n  \"edit\"\n];\nconst evaluate = (x) => {const latest=new Map();for(const d of x)latest.set(d.id,d);return [...latest.values()].filter(d=>d.active).map(d=>d.id).sort();};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C3.4 / contraprova: preservar a primeira ocorrência de cada decisão; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"id\": \"publish\",\n    \"active\": true\n  },\n  {\n    \"id\": \"edit\",\n    \"active\": true\n  },\n  {\n    \"id\": \"publish\",\n    \"active\": false\n  }\n];\nconst expected = [\n  \"edit\"\n];\nconst evaluate = (x) => {const latest=new Map();for(const d of x)latest.set(d.id,d);return [...latest.values()].filter(d=>d.active).map(d=>d.id).sort();};\nconst mutant = (x) => {const first=new Map();for(const d of x)if(!first.has(d.id))first.set(d.id,d);return [...first.values()].filter(d=>d.active).map(d=>d.id).sort();};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Plano com precondições e dependências": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / fixture: patch não está pronto para execução. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"dependencies\": [\n    \"reproduce\",\n    \"contract\"\n  ],\n  \"done\": [\n    \"reproduce\"\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.dependencies.every(d=>x.done.includes(d));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.1 / contraprova: usar some em vez de every nas dependências; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"dependencies\": [\n    \"reproduce\",\n    \"contract\"\n  ],\n  \"done\": [\n    \"reproduce\"\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.dependencies.every(d=>x.done.includes(d));\nconst mutant = (x) => x.dependencies.some(d=>x.done.includes(d));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Patch mínimo e base de aplicação": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.2 / fixture: o resultado é conflict e conserva a contribuição humana. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"const x=1;\",\n  \"baseDigest\": \"9455369ccc7ee8a0fa87b3a86153aeeeb94f3c3b8cdb2388211f10481863e1da\",\n  \"current\": \"const x=1; comentario humano;\",\n  \"proposed\": \"const x=2;\"\n};\nconst expected = {\n  \"status\": \"conflict\",\n  \"text\": \"const x=1; comentario humano;\"\n};\nconst evaluate = (x) => require(\"node:crypto\").createHash(\"sha256\").update(x.current).digest(\"hex\")===x.baseDigest ? {status:\"applied\",text:x.proposed} : {status:\"conflict\",text:x.current};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.2 / contraprova: aplicar a proposta sem conferir digest; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"base\": \"const x=1;\",\n  \"baseDigest\": \"9455369ccc7ee8a0fa87b3a86153aeeeb94f3c3b8cdb2388211f10481863e1da\",\n  \"current\": \"const x=1; comentario humano;\",\n  \"proposed\": \"const x=2;\"\n};\nconst expected = {\n  \"status\": \"conflict\",\n  \"text\": \"const x=1; comentario humano;\"\n};\nconst evaluate = (x) => require(\"node:crypto\").createHash(\"sha256\").update(x.current).digest(\"hex\")===x.baseDigest ? {status:\"applied\",text:x.proposed} : {status:\"conflict\",text:x.current};\nconst mutant = (x) => ({status:\"applied\",text:x.proposed});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Interfaces, unidades e consumidores": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.3 / fixture: a string retornada é 1.25. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"cents\": 125\n};\nconst expected = \"1.25\";\nconst evaluate = (x) => (x.cents/100).toFixed(2);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C4.3 / contraprova: dividir por dez em vez de cem; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"cents\": 125\n};\nconst expected = \"1.25\";\nconst evaluate = (x) => (x.cents/100).toFixed(2);\nconst mutant = (x) => (x.cents/10).toFixed(2);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Regressões, typecheck e build da revisão final": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.4 / fixture: o gate exigido ainda retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"gate\": \"unit\",\n  \"revision\": \"r9\",\n  \"target\": \"package\",\n  \"runs\": [\n    {\n      \"gate\": \"unit\",\n      \"revision\": \"r9\",\n      \"target\": \"service\",\n      \"status\": \"passed\"\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.runs.some(r=>r.gate===x.gate && r.revision===x.revision && r.target===x.target && r.status===\"passed\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C4.4 / contraprova: ignorar target ao procurar uma aprovação; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"gate\": \"unit\",\n  \"revision\": \"r9\",\n  \"target\": \"package\",\n  \"runs\": [\n    {\n      \"gate\": \"unit\",\n      \"revision\": \"r9\",\n      \"target\": \"service\",\n      \"status\": \"passed\"\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.runs.some(r=>r.gate===x.gate && r.revision===x.revision && r.target===x.target && r.status===\"passed\");\nconst mutant = (x) => x.runs.some(r=>r.gate===x.gate && r.revision===x.revision && r.status===\"passed\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Allow, ask e deny como decisões distintas": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.1 / fixture: a decisão é deny. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"action\": \"deploy\",\n  \"deny\": [\n    \"deploy\"\n  ],\n  \"ask\": [],\n  \"allow\": [\n    \"deploy\",\n    \"test\"\n  ]\n};\nconst expected = \"deny\";\nconst evaluate = (x) => x.deny.includes(x.action)?\"deny\":x.ask.includes(x.action)?\"ask\":x.allow.includes(x.action)?\"allow\":\"ask\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.1 / contraprova: avaliar allow antes de deny; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"action\": \"deploy\",\n  \"deny\": [\n    \"deploy\"\n  ],\n  \"ask\": [],\n  \"allow\": [\n    \"deploy\",\n    \"test\"\n  ]\n};\nconst expected = \"deny\";\nconst evaluate = (x) => x.deny.includes(x.action)?\"deny\":x.ask.includes(x.action)?\"ask\":x.allow.includes(x.action)?\"allow\":\"ask\";\nconst mutant = (x) => x.allow.includes(x.action)?\"allow\":x.deny.includes(x.action)?\"deny\":\"ask\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Modo de permissão e efeito autorizado": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / fixture: o gate retorna false para publicação externa. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"mode\": \"edit\",\n  \"grant\": {\n    \"operation\": \"edit\",\n    \"destination\": \"workspace\"\n  },\n  \"request\": {\n    \"operation\": \"publish\",\n    \"destination\": \"external\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => x.request.operation===x.grant.operation && x.request.destination===x.grant.destination;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.2 / contraprova: permitir publicação quando mode é edit; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"mode\": \"edit\",\n  \"grant\": {\n    \"operation\": \"edit\",\n    \"destination\": \"workspace\"\n  },\n  \"request\": {\n    \"operation\": \"publish\",\n    \"destination\": \"external\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => x.request.operation===x.grant.operation && x.request.destination===x.grant.destination;\nconst mutant = (x) => x.mode===\"edit\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Sandbox de filesystem e rede": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.3 / fixture: o destino retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"host\": \"api.example.invalid\",\n  \"url\": \"https://api.example.invalid.evil.invalid/data\"\n};\nconst expected = false;\nconst evaluate = (x) => {const u=new URL(x.url);return u.protocol===\"https:\" && u.hostname===x.host;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C5.3 / contraprova: usar startsWith no hostname; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"host\": \"api.example.invalid\",\n  \"url\": \"https://api.example.invalid.evil.invalid/data\"\n};\nconst expected = false;\nconst evaluate = (x) => {const u=new URL(x.url);return u.protocol===\"https:\" && u.hostname===x.host;};\nconst mutant = (x) => {const u=new URL(x.url);return u.protocol===\"https:\" && u.hostname.startsWith(x.host);};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Configuração gerenciada e limites locais": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.4 / fixture: a lista efetiva é secrets e prod. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"user\": [\n    \"secrets\"\n  ],\n  \"project\": [\n    \"prod\"\n  ]\n};\nconst expected = [\n  \"secrets\",\n  \"prod\"\n];\nconst evaluate = (x) => [...new Set([...x.user,...x.project])];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C5.4 / contraprova: usar somente a lista project; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"user\": [\n    \"secrets\"\n  ],\n  \"project\": [\n    \"prod\"\n  ]\n};\nconst expected = [\n  \"secrets\",\n  \"prod\"\n];\nconst evaluate = (x) => [...new Set([...x.user,...x.project])];\nconst mutant = (x) => [...x.project];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Bash, PowerShell e fronteiras de argumentos": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.1 / fixture: o padrão permanece um elemento único do vetor. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"pattern\": \"erro; echo vazou\",\n  \"target\": \"src\"\n};\nconst expected = [\n  \"-F\",\n  \"--\",\n  \"erro; echo vazou\",\n  \"src\"\n];\nconst evaluate = (x) => [\"-F\",\"--\",x.pattern,x.target];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C6.1 / contraprova: dividir o padrão por espaços; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"pattern\": \"erro; echo vazou\",\n  \"target\": \"src\"\n};\nconst expected = [\n  \"-F\",\n  \"--\",\n  \"erro; echo vazou\",\n  \"src\"\n];\nconst evaluate = (x) => [\"-F\",\"--\",x.pattern,x.target];\nconst mutant = (x) => [\"-F\",\"--\",...x.pattern.split(\" \"),x.target];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Entrada padrão, saída e status do processo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.2 / fixture: o gate de sucesso retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stdout\": \"{\\\"status\\\":\\\"ok\\\"}\",\n  \"stderr\": \"diagnostico\",\n  \"exitCode\": 1\n};\nconst expected = false;\nconst evaluate = (x) => x.exitCode===0 && JSON.parse(x.stdout).status===\"ok\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.2 / contraprova: ignorar exitCode e usar somente status do JSON; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stdout\": \"{\\\"status\\\":\\\"ok\\\"}\",\n  \"stderr\": \"diagnostico\",\n  \"exitCode\": 1\n};\nconst expected = false;\nconst evaluate = (x) => x.exitCode===0 && JSON.parse(x.stdout).status===\"ok\";\nconst mutant = (x) => JSON.parse(x.stdout).status===\"ok\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "MCP, identidade e menor capacidade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.3 / fixture: a requisição retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"grant\": {\n    \"capability\": \"read\",\n    \"tenant\": \"tenant-a\"\n  },\n  \"request\": {\n    \"capability\": \"read\",\n    \"tenant\": \"tenant-b\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => x.request.capability===x.grant.capability && x.request.tenant===x.grant.tenant;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.3 / contraprova: conferir só capability read; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"grant\": {\n    \"capability\": \"read\",\n    \"tenant\": \"tenant-a\"\n  },\n  \"request\": {\n    \"capability\": \"read\",\n    \"tenant\": \"tenant-b\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => x.request.capability===x.grant.capability && x.request.tenant===x.grant.tenant;\nconst mutant = (x) => x.request.capability===x.grant.capability;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Retornos de ferramentas e validação de domínio": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.4 / fixture: o retorno é recusado como inconsistente. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"rows\": [\n    {\n      \"id\": \"a\",\n      \"qty\": 1\n    },\n    {\n      \"id\": \"b\",\n      \"qty\": 3\n    }\n  ],\n  \"total\": 3\n};\nconst expected = false;\nconst evaluate = (x) => Array.isArray(x.rows) && x.total===x.rows.reduce((sum,row)=>sum+row.qty,0);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C6.4 / contraprova: validar apenas array e tipo number; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"rows\": [\n    {\n      \"id\": \"a\",\n      \"qty\": 1\n    },\n    {\n      \"id\": \"b\",\n      \"qty\": 3\n    }\n  ],\n  \"total\": 3\n};\nconst expected = false;\nconst evaluate = (x) => Array.isArray(x.rows) && x.total===x.rows.reduce((sum,row)=>sum+row.qty,0);\nconst mutant = (x) => Array.isArray(x.rows) && typeof x.total===\"number\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "SKILL.md, descrição e descoberta": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.1 / fixture: nenhuma skill é elegível nesse conjunto. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"task\": \"docs\",\n  \"skills\": [\n    {\n      \"name\": \"docs\",\n      \"domain\": \"docs\",\n      \"enabled\": false\n    },\n    {\n      \"name\": \"deploy\",\n      \"domain\": \"release\",\n      \"enabled\": true\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.skills.filter(s=>s.domain===x.task && s.enabled).map(s=>s.name);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.1 / contraprova: ignorar enabled ao selecionar domínio; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"task\": \"docs\",\n  \"skills\": [\n    {\n      \"name\": \"docs\",\n      \"domain\": \"docs\",\n      \"enabled\": false\n    },\n    {\n      \"name\": \"deploy\",\n      \"domain\": \"release\",\n      \"enabled\": true\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.skills.filter(s=>s.domain===x.task && s.enabled).map(s=>s.name);\nconst mutant = (x) => x.skills.filter(s=>s.domain===x.task).map(s=>s.name);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Invocação explícita e efeitos do procedimento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.2 / fixture: a invocação automática retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"release-demo\",\n  \"caller\": \"model\",\n  \"metadata\": {\n    \"disable-model-invocation\": true\n  }\n};\nconst expected = false;\nconst evaluate = (x) => !(x.caller===\"model\" && x.metadata[\"disable-model-invocation\"]===true);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.2 / contraprova: permitir qualquer skill que tenha nome não vazio; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"name\": \"release-demo\",\n  \"caller\": \"model\",\n  \"metadata\": {\n    \"disable-model-invocation\": true\n  }\n};\nconst expected = false;\nconst evaluate = (x) => !(x.caller===\"model\" && x.metadata[\"disable-model-invocation\"]===true);\nconst mutant = (x) => x.name.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Referências, scripts e caminhos relativos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.3 / fixture: o resultado é null. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"root\": \"skills/audit\",\n  \"relative\": \"../outside.sh\"\n};\nconst expected = null;\nconst evaluate = (x) => x.relative.split(\"/\").includes(\"..\") ? null : x.root+\"/\"+x.relative;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.3 / contraprova: concatenar raiz e relativo sem verificar segmentos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"root\": \"skills/audit\",\n  \"relative\": \"../outside.sh\"\n};\nconst expected = null;\nconst evaluate = (x) => x.relative.split(\"/\").includes(\"..\") ? null : x.root+\"/\"+x.relative;\nconst mutant = (x) => x.root+\"/\"+x.relative;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Versionamento e avaliação de uma skill": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.4 / fixture: o gate de prontidão retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"version\": \"v3\",\n  \"runs\": [\n    {\n      \"version\": \"v2\",\n      \"status\": \"passed\"\n    },\n    {\n      \"version\": \"v3\",\n      \"status\": \"failed\"\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.runs.some(r=>r.version===x.version && r.status===\"passed\");\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C7.4 / contraprova: aceitar qualquer resultado passed do histórico; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"version\": \"v3\",\n  \"runs\": [\n    {\n      \"version\": \"v2\",\n      \"status\": \"passed\"\n    },\n    {\n      \"version\": \"v3\",\n      \"status\": \"failed\"\n    }\n  ]\n};\nconst expected = false;\nconst evaluate = (x) => x.runs.some(r=>r.version===x.version && r.status===\"passed\");\nconst mutant = (x) => x.runs.some(r=>r.status===\"passed\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Evento, matcher e condição de disparo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.1 / fixture: nenhum hook é selecionado. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"event\": \"PreToolUse\",\n  \"tool\": \"Read\",\n  \"hooks\": [\n    {\n      \"id\": \"shell-pre\",\n      \"event\": \"PreToolUse\",\n      \"tools\": [\n        \"Bash\"\n      ]\n    },\n    {\n      \"id\": \"read-post\",\n      \"event\": \"PostToolUse\",\n      \"tools\": [\n        \"Read\"\n      ]\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.hooks.filter(h=>h.event===x.event && h.tools.includes(x.tool)).map(h=>h.id);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.1 / contraprova: ignorar event e selecionar apenas por ferramenta; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"event\": \"PreToolUse\",\n  \"tool\": \"Read\",\n  \"hooks\": [\n    {\n      \"id\": \"shell-pre\",\n      \"event\": \"PreToolUse\",\n      \"tools\": [\n        \"Bash\"\n      ]\n    },\n    {\n      \"id\": \"read-post\",\n      \"event\": \"PostToolUse\",\n      \"tools\": [\n        \"Read\"\n      ]\n    }\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.hooks.filter(h=>h.event===x.event && h.tools.includes(x.tool)).map(h=>h.id);\nconst mutant = (x) => x.hooks.filter(h=>h.tools.includes(x.tool)).map(h=>h.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "JSON por stdin e saída de protocolo": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.2 / fixture: debug não aparece no resultado projetado. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stdin\": \"{\\\"event\\\":\\\"PreToolUse\\\",\\\"tool\\\":\\\"Read\\\",\\\"debug\\\":\\\"DADO_FICTICIO_DESNECESSARIO\\\"}\"\n};\nconst expected = {\n  \"event\": \"PreToolUse\",\n  \"tool\": \"Read\"\n};\nconst evaluate = (x) => {const input=JSON.parse(x.stdin);return {event:input.event,tool:input.tool};};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C8.2 / contraprova: devolver o objeto inteiro depois de JSON.parse; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"stdin\": \"{\\\"event\\\":\\\"PreToolUse\\\",\\\"tool\\\":\\\"Read\\\",\\\"debug\\\":\\\"DADO_FICTICIO_DESNECESSARIO\\\"}\"\n};\nconst expected = {\n  \"event\": \"PreToolUse\",\n  \"tool\": \"Read\"\n};\nconst evaluate = (x) => {const input=JSON.parse(x.stdin);return {event:input.event,tool:input.tool};};\nconst mutant = (x) => JSON.parse(x.stdin);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "PreToolUse e controle antes do efeito": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.3 / fixture: o predicado de sinal bloqueante retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"exitCode\": 1\n};\nconst expected = false;\nconst evaluate = (x) => x.exitCode===2;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C8.3 / contraprova: tratar qualquer código não zero como bloqueante; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"exitCode\": 1\n};\nconst expected = false;\nconst evaluate = (x) => x.exitCode===2;\nconst mutant = (x) => x.exitCode!==0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "PostToolUse, Stop e verificação de consequência": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.4 / fixture: o estado de fechamento é retest. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"passed\": true,\n  \"testedDigest\": \"d1\",\n  \"finalDigest\": \"d2\"\n};\nconst expected = \"retest\";\nconst evaluate = (x) => x.passed && x.testedDigest===x.finalDigest ? \"ready\" : \"retest\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C8.4 / contraprova: concluir ready por existir um teste passed anterior; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"passed\": true,\n  \"testedDigest\": \"d1\",\n  \"finalDigest\": \"d2\"\n};\nconst expected = \"retest\";\nconst evaluate = (x) => x.passed && x.testedDigest===x.finalDigest ? \"ready\" : \"retest\";\nconst mutant = (x) => x.passed ? \"ready\" : \"retest\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Delegação com objetivo e contrato de retorno": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / fixture: o relatório não está pronto para integração. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"findings\": [\n    \"consumidor encontrado\"\n  ],\n  \"evidence\": []\n};\nconst expected = false;\nconst evaluate = (x) => x.findings.length>0 && x.evidence.length>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.1 / contraprova: aceitar qualquer findings não vazio; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"findings\": [\n    \"consumidor encontrado\"\n  ],\n  \"evidence\": []\n};\nconst expected = false;\nconst evaluate = (x) => x.findings.length>0 && x.evidence.length>0;\nconst mutant = (x) => x.findings.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Contexto isolado e capacidade do subagente": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.2 / fixture: a capacidade efetiva declarada contém somente Read. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requested\": [\n    \"Read\",\n    \"Write\"\n  ],\n  \"granted\": [\n    \"Read\",\n    \"Grep\"\n  ]\n};\nconst expected = [\n  \"Read\"\n];\nconst evaluate = (x) => x.requested.filter(t=>x.granted.includes(t));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.2 / contraprova: devolver requested inteiro; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"requested\": [\n    \"Read\",\n    \"Write\"\n  ],\n  \"granted\": [\n    \"Read\",\n    \"Grep\"\n  ]\n};\nconst expected = [\n  \"Read\"\n];\nconst evaluate = (x) => x.requested.filter(t=>x.granted.includes(t));\nconst mutant = (x) => [...x.requested];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Ownership, worktrees e conflito de patches": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.3 / fixture: há sobreposição potencial. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"file\": \"service.ts\",\n    \"start\": 10,\n    \"end\": 20\n  },\n  \"b\": {\n    \"file\": \"service.ts\",\n    \"start\": 15,\n    \"end\": 25\n  }\n};\nconst expected = true;\nconst evaluate = (x) => x.a.file===x.b.file && Math.max(x.a.start,x.b.start)<Math.min(x.a.end,x.b.end);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.3 / contraprova: considerar conflito apenas quando os inícios são iguais; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"a\": {\n    \"file\": \"service.ts\",\n    \"start\": 10,\n    \"end\": 20\n  },\n  \"b\": {\n    \"file\": \"service.ts\",\n    \"start\": 15,\n    \"end\": 25\n  }\n};\nconst expected = true;\nconst evaluate = (x) => x.a.file===x.b.file && Math.max(x.a.start,x.b.start)<Math.min(x.a.end,x.b.end);\nconst mutant = (x) => x.a.file===x.b.file && x.a.start===x.b.start;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Integração e prova entre fronteiras": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.4 / fixture: qty permanece como incompatibilidade de integração. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"produced\": {\n    \"id\": \"p1\",\n    \"quantity\": 2\n  },\n  \"required\": [\n    \"id\",\n    \"qty\"\n  ]\n};\nconst expected = [\n  \"qty\"\n];\nconst evaluate = (x) => x.required.filter(k=>!Object.hasOwn(x.produced,k));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C9.4 / contraprova: aprovar integração quando apenas id existe; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"produced\": {\n    \"id\": \"p1\",\n    \"quantity\": 2\n  },\n  \"required\": [\n    \"id\",\n    \"qty\"\n  ]\n};\nconst expected = [\n  \"qty\"\n];\nconst evaluate = (x) => x.required.filter(k=>!Object.hasOwn(x.produced,k));\nconst mutant = (x) => Object.hasOwn(x.produced,\"id\") ? [] : x.required;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Print mode e saída estruturada": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / fixture: o gate retorna false. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"{\\\"type\\\":\\\"result\\\",\\\"is_error\\\":true,\\\"result\\\":\\\"sucesso anterior não cobre a falha atual\\\"}\"\n};\nconst expected = false;\nconst evaluate = (x) => {const r=JSON.parse(x.text);return r.type===\"result\" && r.is_error===false;};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.1 / contraprova: aceitar qualquer result textual não vazio; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"text\": \"{\\\"type\\\":\\\"result\\\",\\\"is_error\\\":true,\\\"result\\\":\\\"sucesso anterior não cobre a falha atual\\\"}\"\n};\nconst expected = false;\nconst evaluate = (x) => {const r=JSON.parse(x.text);return r.type===\"result\" && r.is_error===false;};\nconst mutant = (x) => {const r=JSON.parse(x.text);return typeof r.result===\"string\" && r.result.length>0;};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "JSONL, streaming e conclusão terminal": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.2 / fixture: não há conclusão bem-sucedida selecionada. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"lines\": [\n    \"{\\\"type\\\":\\\"delta\\\",\\\"text\\\":\\\"pronto\\\"}\",\n    \"{\\\"type\\\":\\\"result\\\",\\\"is_error\\\":true}\"\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.lines.map(line=>JSON.parse(line)).filter(r=>r.type===\"result\" && r.is_error===false).map(r=>r.type);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C10.2 / contraprova: aceitar eventos de delta como sucesso; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"lines\": [\n    \"{\\\"type\\\":\\\"delta\\\",\\\"text\\\":\\\"pronto\\\"}\",\n    \"{\\\"type\\\":\\\"result\\\",\\\"is_error\\\":true}\"\n  ]\n};\nconst expected = [];\nconst evaluate = (x) => x.lines.map(line=>JSON.parse(line)).filter(r=>r.type===\"result\" && r.is_error===false).map(r=>r.type);\nconst mutant = (x) => x.lines.map(line=>JSON.parse(line)).filter(r=>r.type===\"delta\" || (r.type===\"result\" && r.is_error===false)).map(r=>r.type);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Retomada de sessão e checkpoint": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.3 / fixture: somente a.ts aparece como alteração coberta. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"path\": \"a.ts\",\n    \"tool\": \"Edit\"\n  },\n  {\n    \"path\": \"generated.txt\",\n    \"tool\": \"Bash\"\n  }\n];\nconst expected = [\n  \"a.ts\"\n];\nconst evaluate = (x) => x.filter(r=>[\"Edit\",\"Write\"].includes(r.tool)).map(r=>r.path);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C10.3 / contraprova: listar toda alteração como recuperável pelo checkpoint; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"path\": \"a.ts\",\n    \"tool\": \"Edit\"\n  },\n  {\n    \"path\": \"generated.txt\",\n    \"tool\": \"Bash\"\n  }\n];\nconst expected = [\n  \"a.ts\"\n];\nconst evaluate = (x) => x.filter(r=>[\"Edit\",\"Write\"].includes(r.tool)).map(r=>r.path);\nconst mutant = (x) => x.map(r=>r.path);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Limites de execução e replay de efeitos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.4 / fixture: a decisão é stop. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"now\": 100,\n  \"deadline\": 100,\n  \"used\": 1,\n  \"max\": 2\n};\nconst expected = \"stop\";\nconst evaluate = (x) => x.now<x.deadline && x.used<x.max ? \"run\" : \"stop\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C10.4 / contraprova: aceitar now igual a deadline; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"now\": 100,\n  \"deadline\": 100,\n  \"used\": 1,\n  \"max\": 2\n};\nconst expected = \"stop\";\nconst evaluate = (x) => x.now<x.deadline && x.used<x.max ? \"run\" : \"stop\";\nconst mutant = (x) => x.now<=x.deadline && x.used<x.max ? \"run\" : \"stop\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Prompt injection e autoridade dos dados": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.1 / fixture: o conjunto autorizado contém somente read. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"source\": \"user\",\n    \"authorized\": true,\n    \"operation\": \"read\"\n  },\n  {\n    \"source\": \"tool-data\",\n    \"authorized\": false,\n    \"operation\": \"upload\"\n  }\n];\nconst expected = [\n  \"read\"\n];\nconst evaluate = (x) => x.filter(a=>a.source===\"user\" && a.authorized===true).map(a=>a.operation);\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.1 / contraprova: aceitar toda proposta que possua operation; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"source\": \"user\",\n    \"authorized\": true,\n    \"operation\": \"read\"\n  },\n  {\n    \"source\": \"tool-data\",\n    \"authorized\": false,\n    \"operation\": \"upload\"\n  }\n];\nconst expected = [\n  \"read\"\n];\nconst evaluate = (x) => x.filter(a=>a.source===\"user\" && a.authorized===true).map(a=>a.operation);\nconst mutant = (x) => x.filter(a=>typeof a.operation===\"string\").map(a=>a.operation);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Privacidade, retenção e transmissão mínima": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.2 / fixture: o relato projetado não contém customerName nem apiKey. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"errorCode\": \"E_AUTH\",\n  \"revision\": \"r10\",\n  \"customerName\": \"Pessoa Ficticia\",\n  \"apiKey\": \"FICTICIA\"\n};\nconst expected = {\n  \"errorCode\": \"E_AUTH\",\n  \"revision\": \"r10\"\n};\nconst evaluate = (x) => ({errorCode:x.errorCode,revision:x.revision});\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.2 / contraprova: remover somente apiKey e copiar os demais campos; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"errorCode\": \"E_AUTH\",\n  \"revision\": \"r10\",\n  \"customerName\": \"Pessoa Ficticia\",\n  \"apiKey\": \"FICTICIA\"\n};\nconst expected = {\n  \"errorCode\": \"E_AUTH\",\n  \"revision\": \"r10\"\n};\nconst evaluate = (x) => ({errorCode:x.errorCode,revision:x.revision});\nconst mutant = (x) => {const out={...x};delete out.apiKey;return out;};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Avaliação de respostas e cobertura de casos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / fixture: tenant continua não avaliado. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"basic\",\n    \"tenant\"\n  ],\n  \"results\": [\n    {\n      \"id\": \"basic\",\n      \"status\": \"passed\"\n    },\n    {\n      \"id\": \"tenant\",\n      \"status\": \"pending\"\n    }\n  ]\n};\nconst expected = [\n  \"tenant\"\n];\nconst evaluate = (x) => x.required.filter(id=>!x.results.some(r=>r.id===id && [\"passed\",\"failed\"].includes(r.status)));\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C11.3 / contraprova: considerar todo registro como avaliação concluída; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"required\": [\n    \"basic\",\n    \"tenant\"\n  ],\n  \"results\": [\n    {\n      \"id\": \"basic\",\n      \"status\": \"passed\"\n    },\n    {\n      \"id\": \"tenant\",\n      \"status\": \"pending\"\n    }\n  ]\n};\nconst expected = [\n  \"tenant\"\n];\nconst evaluate = (x) => x.required.filter(id=>!x.results.some(r=>r.id===id && [\"passed\",\"failed\"].includes(r.status)));\nconst mutant = (x) => x.required.filter(id=>!x.results.some(r=>r.id===id));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Custos, latência e diagnóstico de falhas": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.4 / fixture: model=5, tool=15 e total=20. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"kind\": \"model\",\n    \"time\": 2\n  },\n  {\n    \"kind\": \"tool\",\n    \"time\": 10\n  },\n  {\n    \"kind\": \"model\",\n    \"time\": 3\n  },\n  {\n    \"kind\": \"tool\",\n    \"time\": 5\n  }\n];\nconst expected = {\n  \"model\": 5,\n  \"tool\": 15,\n  \"total\": 20\n};\nconst evaluate = (x) => {const model=x.filter(e=>e.kind===\"model\").reduce((s,e)=>s+e.time,0);const tool=x.filter(e=>e.kind===\"tool\").reduce((s,e)=>s+e.time,0);return {model,tool,total:model+tool};};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "C11.4 / contraprova: usar apenas tempo de modelo como total; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = [\n  {\n    \"kind\": \"model\",\n    \"time\": 2\n  },\n  {\n    \"kind\": \"tool\",\n    \"time\": 10\n  },\n  {\n    \"kind\": \"model\",\n    \"time\": 3\n  },\n  {\n    \"kind\": \"tool\",\n    \"time\": 5\n  }\n];\nconst expected = {\n  \"model\": 5,\n  \"tool\": 15,\n  \"total\": 20\n};\nconst evaluate = (x) => {const model=x.filter(e=>e.kind===\"model\").reduce((s,e)=>s+e.time,0);const tool=x.filter(e=>e.kind===\"tool\").reduce((s,e)=>s+e.time,0);return {model,tool,total:model+tool};};\nconst mutant = (x) => {const model=x.filter(e=>e.kind===\"model\").reduce((s,e)=>s+e.time,0);const tool=x.filter(e=>e.kind===\"tool\").reduce((s,e)=>s+e.time,0);return {model,tool,total:model};};\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Especificação da reserva e estratégia de prova": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.1 / fixture: a quantidade é recusada pelo gate local. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": 9007199254740992\n};\nconst expected = false;\nconst evaluate = (x) => Number.isSafeInteger(x.qty) && x.qty>0;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.1 / contraprova: usar Number.isInteger sem restrição de segurança; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"qty\": 9007199254740992\n};\nconst expected = false;\nconst evaluate = (x) => Number.isSafeInteger(x.qty) && x.qty>0;\nconst mutant = (x) => Number.isInteger(x.qty) && x.qty>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Chave de replay e payload conflitante": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.2 / fixture: o resultado é conflict com stock preservado em 4. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"tenant\": \"t1\",\n  \"key\": \"k\",\n  \"stock\": 4,\n  \"payload\": {\n    \"qty\": 2\n  },\n  \"records\": [\n    {\n      \"tenant\": \"t1\",\n      \"key\": \"k\",\n      \"payload\": {\n        \"qty\": 1\n      }\n    }\n  ]\n};\nconst expected = {\n  \"status\": \"conflict\",\n  \"stock\": 4\n};\nconst evaluate = (x) => {const r=x.records.find(r=>r.tenant===x.tenant && r.key===x.key);return {status:r?(JSON.stringify(r.payload)===JSON.stringify(x.payload)?\"replayed\":\"conflict\"):\"new\",stock:x.stock};};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.2 / contraprova: devolver replayed quando a chave existe sem comparar payload; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"tenant\": \"t1\",\n  \"key\": \"k\",\n  \"stock\": 4,\n  \"payload\": {\n    \"qty\": 2\n  },\n  \"records\": [\n    {\n      \"tenant\": \"t1\",\n      \"key\": \"k\",\n      \"payload\": {\n        \"qty\": 1\n      }\n    }\n  ]\n};\nconst expected = {\n  \"status\": \"conflict\",\n  \"stock\": 4\n};\nconst evaluate = (x) => {const r=x.records.find(r=>r.tenant===x.tenant && r.key===x.key);return {status:r?(JSON.stringify(r.payload)===JSON.stringify(x.payload)?\"replayed\":\"conflict\"):\"new\",stock:x.stock};};\nconst mutant = (x) => ({status:x.records.some(r=>r.tenant===x.tenant && r.key===x.key)?\"replayed\":\"new\",stock:x.stock});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Concorrência real e limites do modelo serial": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / fixture: overbooked retorna true apesar do saldo não negativo. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"initial\": 1,\n  \"finalStock\": 0,\n  \"confirmations\": [\n    {\n      \"id\": \"a\",\n      \"qty\": 1\n    },\n    {\n      \"id\": \"b\",\n      \"qty\": 1\n    }\n  ]\n};\nconst expected = true;\nconst evaluate = (x) => x.confirmations.reduce((sum,r)=>sum+r.qty,0)>x.initial;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "C12.3 / contraprova: detectar sobre-reserva somente quando saldo final é negativo; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"initial\": 1,\n  \"finalStock\": 0,\n  \"confirmations\": [\n    {\n      \"id\": \"a\",\n      \"qty\": 1\n    },\n    {\n      \"id\": \"b\",\n      \"qty\": 1\n    }\n  ]\n};\nconst expected = true;\nconst evaluate = (x) => x.confirmations.reduce((sum,r)=>sum+r.qty,0)>x.initial;\nconst mutant = (x) => x.finalStock<0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Handoff verificável e fechamento do escopo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / fixture: a afirmação nativa não recebe atestado dessa prova local. Prova local declarada, sem agente ou efeito ClaudeCode.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"claim\": {\n    \"scope\": \"native-hook\"\n  },\n  \"evidence\": {\n    \"scope\": \"local-json\",\n    \"status\": \"passed\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => x.evidence.scope===x.claim.scope && x.evidence.status===\"passed\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "C12.4 / contraprova: aceitar qualquer prova passed sem comparar scope; deve divergir do oracle.",
      "code": "const assert = require(\"node:assert/strict\");\nconst input = {\n  \"claim\": {\n    \"scope\": \"native-hook\"\n  },\n  \"evidence\": {\n    \"scope\": \"local-json\",\n    \"status\": \"passed\"\n  }\n};\nconst expected = false;\nconst evaluate = (x) => x.evidence.scope===x.claim.scope && x.evidence.status===\"passed\";\nconst mutant = (x) => x.evidence.status===\"passed\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ]
};
