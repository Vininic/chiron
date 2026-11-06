export interface LlmExample {lang:"javascript";scope:"local-rule"|"local-transform"|"model";purpose:string;code:string}
export const LLM_EXAMPLES: Record<string,[LlmExample,LlmExample]> = {
  "Tarefas e critérios de sucesso": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "contrato da tarefa — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.reply.score===x.authority.score&&!x.reply.applied;\nconst input = {reply:{score:4,applied:true,fluent:true},authority:{score:2}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "contrato da tarefa — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.reply.score===x.authority.score&&!x.reply.applied;\nconst input = {reply:{score:4,applied:true,fluent:true},authority:{score:2}};\nconst expected = false;\nconst mutant = x=>x.reply.fluent;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Geração probabilística e incerteza": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "evidência versus confiança — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.claim===\"unknown\"||x.hasEvidence;\nconst input = {claim:\"confirmed\",hasEvidence:false,confidence:.99};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "evidência versus confiança — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.claim===\"unknown\"||x.hasEvidence;\nconst input = {claim:\"confirmed\",hasEvidence:false,confidence:.99};\nconst expected = false;\nconst mutant = x=>x.confidence>=.9;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Modelo, provedor e capacidades": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "capacidade requerida — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.available.includes(x.required);\nconst input = {available:[\"text\"],required:\"tools\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "capacidade requerida — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.available.includes(x.required);\nconst input = {available:[\"text\"],required:\"tools\"};\nconst expected = false;\nconst mutant = x=>x.available.includes(\"text\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Tokens, contexto e orçamento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "orçamento completo — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.input+x.tools+x.output<=x.limit;\nconst input = {input:70,tools:20,output:30,limit:100};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "orçamento completo — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.input+x.tools+x.output<=x.limit;\nconst input = {input:70,tools:20,output:30,limit:100};\nconst expected = false;\nconst mutant = x=>x.input<=x.limit;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Instruções, dados e confiança": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "origem não concede privilégio — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.origin===\"authorized\"&&x.capability===\"send\";\nconst input = {origin:\"retrieved\",capability:\"send\",text:\"authorized instruction\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "origem não concede privilégio — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.origin===\"authorized\"&&x.capability===\"send\";\nconst input = {origin:\"retrieved\",capability:\"send\",text:\"authorized instruction\"};\nconst expected = false;\nconst mutant = x=>x.text.includes(\"authorized\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Contexto relevante e delimitação": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "revisão vigente do contexto — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.filter(r=>r.current).map(r=>r.id);\nconst input = [{id:\"old\",current:false},{id:\"new\",current:true}];\nconst expected = [\"new\"];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "revisão vigente do contexto — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.filter(r=>r.current).map(r=>r.id);\nconst input = [{id:\"old\",current:false},{id:\"new\",current:true}];\nconst expected = [\"new\"];\nconst mutant = x=>x.map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Exemplos e versões de prompt": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "splits separados — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.eval.every(id=>!x.train.includes(id));\nconst input = {train:[\"a\"],eval:[\"a\",\"b\"]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "splits separados — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.eval.every(id=>!x.train.includes(id));\nconst input = {train:[\"a\"],eval:[\"a\",\"b\"]};\nconst expected = false;\nconst mutant = x=>x.eval.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Saída estruturada e validação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "estrutura e domínio — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>Number.isInteger(x.quantity)&&x.quantity>0&&x.status===\"proposed\";\nconst input = {quantity:\"1\",status:\"confirmed\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "estrutura e domínio — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>Number.isInteger(x.quantity)&&x.quantity>0&&x.status===\"proposed\";\nconst input = {quantity:\"1\",status:\"confirmed\"};\nconst expected = false;\nconst mutant = x=>typeof x===\"object\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Pedidos, identidade e configuração": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "destino do pedido — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>new URL(x.base).hostname===\"allowed.example\"&&x.model.length>0;\nconst input = {base:\"https://external.example/v1\",model:\"fixture\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "destino do pedido — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>new URL(x.base).hostname===\"allowed.example\"&&x.model.length>0;\nconst input = {base:\"https://external.example/v1\",model:\"fixture\"};\nconst expected = false;\nconst mutant = x=>x.model.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Streaming e enquadramento": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "fronteira de bytes UTF-8 — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>Buffer.concat(x.map(b=>Buffer.from(b))).toString(\"utf8\");\nconst input = [[195],[169]];\nconst expected = \"é\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "fronteira de bytes UTF-8 — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>Buffer.concat(x.map(b=>Buffer.from(b))).toString(\"utf8\");\nconst input = [[195],[169]];\nconst expected = \"é\";\nconst mutant = x=>x.map(b=>Buffer.from(b).toString(\"utf8\")).join(\"\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Erros, timeout e cancelamento": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "timeout mantém unknown — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.timeout&&x.effectMayHaveOccurred?\"unknown\":x.confirmed?\"confirmed\":\"failed\";\nconst input = {timeout:true,effectMayHaveOccurred:true,confirmed:false};\nconst expected = \"unknown\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "timeout mantém unknown — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.timeout&&x.effectMayHaveOccurred?\"unknown\":x.confirmed?\"confirmed\":\"failed\";\nconst input = {timeout:true,effectMayHaveOccurred:true,confirmed:false};\nconst expected = \"unknown\";\nconst mutant = x=>x.timeout?\"failed\":\"confirmed\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Retry, rate limits e orçamento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "classificação do retry — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>[429,503].includes(x.status)&&x.attempt<x.max;\nconst input = {status:401,attempt:1,max:3};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "classificação do retry — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>[429,503].includes(x.status)&&x.attempt<x.max;\nconst input = {status:401,attempt:1,max:3};\nconst expected = false;\nconst mutant = x=>x.attempt<x.max;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Documentos, chunks e procedência": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "procedência de chunks — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.every(c=>c.document&&Number.isInteger(c.revision)&&c.start<c.end);\nconst input = [{text:\"regra\",document:\"\",revision:1,start:0,end:5}];\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "procedência de chunks — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.every(c=>c.document&&Number.isInteger(c.revision)&&c.start<c.end);\nconst input = [{text:\"regra\",document:\"\",revision:1,start:0,end:5}];\nconst expected = false;\nconst mutant = x=>x.every(c=>c.text.length>0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Embeddings e similaridade": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "cosseno de vetores compatíveis — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>{if(x.a.length!==x.b.length)throw Error(\"dimension\");const dot=x.a.reduce((s,v,i)=>s+v*x.b[i],0);const norm=v=>Math.sqrt(v.reduce((s,n)=>s+n*n,0));const d=norm(x.a)*norm(x.b);if(!d)throw Error(\"zero\");return dot/d};\nconst input = {a:[2,0],b:[1,0]};\nconst expected = 1;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "cosseno de vetores compatíveis — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>{if(x.a.length!==x.b.length)throw Error(\"dimension\");const dot=x.a.reduce((s,v,i)=>s+v*x.b[i],0);const norm=v=>Math.sqrt(v.reduce((s,n)=>s+n*n,0));const d=norm(x.a)*norm(x.b);if(!d)throw Error(\"zero\");return dot/d};\nconst input = {a:[2,0],b:[1,0]};\nconst expected = 1;\nconst mutant = x=>x.a.reduce((s,v,i)=>s+v*x.b[i],0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Ranking, filtros e isolamento": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "filtro antes de ranking — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.rows.filter(r=>r.tenant===x.tenant&&r.allowed).sort((a,b)=>b.score-a.score).map(r=>r.id);\nconst input = {tenant:\"a\",rows:[{id:\"private\",tenant:\"b\",allowed:true,score:9},{id:\"ok\",tenant:\"a\",allowed:true,score:2}]};\nconst expected = [\"ok\"];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "filtro antes de ranking — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.rows.filter(r=>r.tenant===x.tenant&&r.allowed).sort((a,b)=>b.score-a.score).map(r=>r.id);\nconst input = {tenant:\"a\",rows:[{id:\"private\",tenant:\"b\",allowed:true,score:9},{id:\"ok\",tenant:\"a\",allowed:true,score:2}]};\nconst expected = [\"ok\"];\nconst mutant = x=>x.rows.sort((a,b)=>b.score-a.score).map(r=>r.id);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "RAG, citações e abstenção": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "citação com suporte declarado — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.support.some(s=>s.claim===x.claim&&s.document===x.citation);\nconst input = {claim:\"refund\",citation:\"d1\",documents:[\"d1\"],support:[{claim:\"booking\",document:\"d1\"}]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "citação com suporte declarado — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.support.some(s=>s.claim===x.claim&&s.document===x.citation);\nconst input = {claim:\"refund\",citation:\"d1\",documents:[\"d1\"],support:[{claim:\"booking\",document:\"d1\"}]};\nconst expected = false;\nconst mutant = x=>x.documents.includes(x.citation);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Histórico e projeção de conversa": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "identidade do histórico — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>new Set(x.map(r=>r.id)).size===x.length;\nconst input = [{id:\"m1\",text:\"A\"},{id:\"m1\",text:\"B\"}];\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "identidade do histórico — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>new Set(x.map(r=>r.id)).size===x.length;\nconst input = [{id:\"m1\",text:\"A\"},{id:\"m1\",text:\"B\"}];\nconst expected = false;\nconst mutant = x=>x.every(r=>r.text.length>0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Resumo, perda e continuidade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "invariante do resumo — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.summary.state===x.original.state&&x.summary.command===x.original.command;\nconst input = {original:{state:\"unknown\",command:\"c1\"},summary:{state:\"confirmed\",command:\"c1\",text:\"Tudo certo\"}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "invariante do resumo — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.summary.state===x.original.state&&x.summary.command===x.original.command;\nconst input = {original:{state:\"unknown\",command:\"c1\"},summary:{state:\"confirmed\",command:\"c1\",text:\"Tudo certo\"}};\nconst expected = false;\nconst mutant = x=>x.summary.text.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Memória, consentimento e retenção": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "memória com escopo e validade — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.memory.owner===x.user&&x.memory.consent&&x.memory.expires>x.now;\nconst input = {user:\"a\",now:20,memory:{owner:\"b\",consent:true,expires:10,text:\"preferência\"}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "memória com escopo e validade — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.memory.owner===x.user&&x.memory.consent&&x.memory.expires>x.now;\nconst input = {user:\"a\",now:20,memory:{owner:\"b\",consent:true,expires:10,text:\"preferência\"}};\nconst expected = false;\nconst mutant = x=>x.memory.text.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Cache, validade e invalidação": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "chave de cache com escopo — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>JSON.stringify([x.tenant,x.revision,x.prompt]);\nconst input = {tenant:\"a\",revision:2,prompt:\"saldo\"};\nconst expected = \"[\\\"a\\\",2,\\\"saldo\\\"]\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "chave de cache com escopo — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>JSON.stringify([x.tenant,x.revision,x.prompt]);\nconst input = {tenant:\"a\",revision:2,prompt:\"saldo\"};\nconst expected = \"[\\\"a\\\",2,\\\"saldo\\\"]\";\nconst mutant = x=>x.prompt;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Tool calling e dispatch": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "allowlist de dispatch — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.allowed.includes(x.tool);\nconst input = {tool:\"delete_all\",allowed:[\"read\"]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "allowlist de dispatch — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.allowed.includes(x.tool);\nconst input = {tool:\"delete_all\",allowed:[\"read\"]};\nconst expected = false;\nconst mutant = x=>typeof x.tool===\"string\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Schema, domínio e autorização": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "autorização de recurso — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.actor.tenant===x.resource.tenant&&x.actor.actions.includes(x.action);\nconst input = {actor:{tenant:\"a\",actions:[\"update\"]},resource:{tenant:\"b\",exists:true},action:\"update\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "autorização de recurso — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.actor.tenant===x.resource.tenant&&x.actor.actions.includes(x.action);\nconst input = {actor:{tenant:\"a\",actions:[\"update\"]},resource:{tenant:\"b\",exists:true},action:\"update\"};\nconst expected = false;\nconst mutant = x=>x.resource.exists;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Plano, aprovação e pré-condições": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "aprovação do plano atual — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.approvedDigest===x.currentDigest&&x.expectedVersion===x.currentVersion;\nconst input = {approvedDigest:\"old\",currentDigest:\"new\",expectedVersion:1,currentVersion:1};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "aprovação do plano atual — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.approvedDigest===x.currentDigest&&x.expectedVersion===x.currentVersion;\nconst input = {approvedDigest:\"old\",currentDigest:\"new\",expectedVersion:1,currentVersion:1};\nconst expected = false;\nconst mutant = x=>x.approvedDigest.length>0;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Idempotência e resultado desconhecido": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "replay e conflito de payload — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.previous===x.current?\"replay\":\"conflict\";\nconst input = {previous:\"qty=1\",current:\"qty=2\"};\nconst expected = \"conflict\";\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "replay e conflito de payload — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.previous===x.current?\"replay\":\"conflict\";\nconst input = {previous:\"qty=1\",current:\"qty=2\"};\nconst expected = \"conflict\";\nconst mutant = x=>\"replay\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Estados, transições e término": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "transição permitida — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.allowed[x.from]?.includes(x.to)??false;\nconst input = {from:\"planned\",to:\"applied\",allowed:{planned:[\"reviewed\"],reviewed:[\"applied\"]}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "transição permitida — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.allowed[x.from]?.includes(x.to)??false;\nconst input = {from:\"planned\",to:\"applied\",allowed:{planned:[\"reviewed\"],reviewed:[\"applied\"]}};\nconst expected = false;\nconst mutant = x=>x.to===\"applied\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Delegação, escopo e isolamento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "escopo delegado — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.granted.every(c=>x.required.includes(c));\nconst input = {required:[\"read\"],granted:[\"read\",\"publish\"]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "escopo delegado — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.granted.every(c=>x.required.includes(c));\nconst input = {required:[\"read\"],granted:[\"read\",\"publish\"]};\nconst expected = false;\nconst mutant = x=>x.granted.includes(\"read\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Humano no fluxo e retomada": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "decisão enviada — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.decision===\"approved\"&&x.plan===x.approvedPlan;\nconst input = {decision:\"pending\",plan:\"p1\",approvedPlan:null,preselected:true};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "decisão enviada — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.decision===\"approved\"&&x.plan===x.approvedPlan;\nconst input = {decision:\"pending\",plan:\"p1\",approvedPlan:null,preselected:true};\nconst expected = false;\nconst mutant = x=>x.preselected;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Limites, loops e compensação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "orçamento de passos — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.steps<x.max&&x.progress;\nconst input = {steps:10,max:10,progress:true};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "orçamento de passos — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.steps<x.max&&x.progress;\nconst input = {steps:10,max:10,progress:true};\nconst expected = false;\nconst mutant = x=>x.progress;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Texto, imagem e representação": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "assinatura restrita de bytes — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.bytes[0]===137&&x.bytes[1]===80&&x.mime===\"image/png\";\nconst input = {bytes:[1,2],mime:\"image/png\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "assinatura restrita de bytes — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.bytes[0]===137&&x.bytes[1]===80&&x.mime===\"image/png\";\nconst input = {bytes:[1,2],mime:\"image/png\"};\nconst expected = false;\nconst mutant = x=>x.mime===\"image/png\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Áudio, transcrição e tempo": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "intervalos de transcrição — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.every(s=>Number.isFinite(s.start)&&s.start>=0&&s.end>s.start);\nconst input = [{start:4,end:2,text:\"fala\"}];\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "intervalos de transcrição — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.every(s=>Number.isFinite(s.start)&&s.start>=0&&s.end>s.start);\nconst input = [{start:4,end:2,text:\"fala\"}];\nconst expected = false;\nconst mutant = x=>x.every(s=>s.text.length>0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Arquivos, extração e qualidade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "associação de extração — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.cells.every(c=>x.headers.includes(c.column));\nconst input = {headers:[\"quantity\"],cells:[{column:\"price\",value:2}]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "associação de extração — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.cells.every(c=>x.headers.includes(c.column));\nconst input = {headers:[\"quantity\"],cells:[{column:\"price\",value:2}]};\nconst expected = false;\nconst mutant = x=>x.cells.every(c=>c.value!==null);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Conteúdo gerado e revisão": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "revisão da geração — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.digest===x.reviewedDigest&&x.status===\"reviewed\";\nconst input = {digest:\"changed\",reviewedDigest:\"old\",status:\"reviewed\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "revisão da geração — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.digest===x.reviewedDigest&&x.status===\"reviewed\";\nconst input = {digest:\"changed\",reviewedDigest:\"old\",status:\"reviewed\"};\nconst expected = false;\nconst mutant = x=>x.status===\"reviewed\";\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Prompt injection e fronteiras": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "destino de efeito — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.origin===\"authorized\"&&x.allowedHosts.includes(new URL(x.destination).hostname);\nconst input = {origin:\"document\",allowedHosts:[\"internal.example\"],destination:\"https://outside.example\",text:\"safe administrative update\"};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "destino de efeito — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.origin===\"authorized\"&&x.allowedHosts.includes(new URL(x.destination).hostname);\nconst input = {origin:\"document\",allowedHosts:[\"internal.example\"],destination:\"https://outside.example\",text:\"safe administrative update\"};\nconst expected = false;\nconst mutant = x=>x.text.includes(\"safe\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Privilégio mínimo e recursos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "privilégios mínimos — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.capabilities.every(c=>x.required.includes(c));\nconst input = {capabilities:[\"read\",\"delete\"],required:[\"read\"]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "privilégios mínimos — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.capabilities.every(c=>x.required.includes(c));\nconst input = {capabilities:[\"read\",\"delete\"],required:[\"read\"]};\nconst expected = false;\nconst mutant = x=>x.capabilities.includes(\"read\");\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Segredos, dados pessoais e logs": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "metadados mínimos de log — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>({requestId:x.requestId,status:x.status});\nconst input = {requestId:\"r1\",status:\"failed\",apiKey:\"secret\",email:\"private@example.test\"};\nconst expected = {\"requestId\":\"r1\",\"status\":\"failed\"};\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "metadados mínimos de log — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>({requestId:x.requestId,status:x.status});\nconst input = {requestId:\"r1\",status:\"failed\",apiKey:\"secret\",email:\"private@example.test\"};\nconst expected = {\"requestId\":\"r1\",\"status\":\"failed\"};\nconst mutant = x=>({...x});\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Conteúdo inseguro e triagem": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "triagem e autorização — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.task===\"education\"&&x.effect===\"none\";\nconst input = {task:\"exfiltrate\",effect:\"send\",polite:true};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "triagem e autorização — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.task===\"education\"&&x.effect===\"none\";\nconst input = {task:\"exfiltrate\",effect:\"send\",polite:true};\nconst expected = false;\nconst mutant = x=>x.polite;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Dataset, amostragem e splits": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "vazamento entre grupos — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.eval.every(r=>!x.train.some(t=>t.origin===r.origin));\nconst input = {train:[{id:\"a\",origin:\"doc1\"}],eval:[{id:\"b\",origin:\"doc1\"}]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "vazamento entre grupos — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.eval.every(r=>!x.train.some(t=>t.origin===r.origin));\nconst input = {train:[{id:\"a\",origin:\"doc1\"}],eval:[{id:\"b\",origin:\"doc1\"}]};\nconst expected = false;\nconst mutant = x=>x.eval.every(r=>!x.train.some(t=>t.id===r.id));\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Oracles, rubricas e mutantes": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "oracle de estado crítico — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.actual.state===x.expected.state&&x.actual.negation===x.expected.negation;\nconst input = {actual:{state:\"confirmed\",negation:false,words:10},expected:{state:\"unknown\",negation:true,words:10}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "oracle de estado crítico — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.actual.state===x.expected.state&&x.actual.negation===x.expected.negation;\nconst input = {actual:{state:\"confirmed\",negation:false,words:10},expected:{state:\"unknown\",negation:true,words:10}};\nconst expected = false;\nconst mutant = x=>x.actual.words===x.expected.words;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Métricas, fatias e incerteza": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "fatias críticas — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.overall>=.9&&x.access===1;\nconst input = {overall:.95,access:0};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "fatias críticas — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.overall>=.9&&x.access===1;\nconst input = {overall:.95,access:0};\nconst expected = false;\nconst mutant = x=>x.overall>=.9;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Mudança de modelo e regressão": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "regressão crítica na migração — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.next.quality>=x.minimum&&x.next.critical===x.baseline.critical;\nconst input = {minimum:.8,baseline:{quality:.8,critical:true},next:{quality:.9,critical:false}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "regressão crítica na migração — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.next.quality>=x.minimum&&x.next.critical===x.baseline.critical;\nconst input = {minimum:.8,baseline:{quality:.8,critical:true},next:{quality:.9,critical:false}};\nconst expected = false;\nconst mutant = x=>x.next.quality>x.baseline.quality;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Custo, latência e limites": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "custo de todas as tentativas — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.attempts.reduce((s,a)=>s+a.units*x.rate,0);\nconst input = {attempts:[{units:10},{units:20},{units:5}],rate:2};\nconst expected = 70;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "custo de todas as tentativas — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.attempts.reduce((s,a)=>s+a.units*x.rate,0);\nconst input = {attempts:[{units:10},{units:20},{units:5}],rate:2};\nconst expected = 70;\nconst mutant = x=>x.attempts[0].units*x.rate;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Traces, correlação e diagnósticos": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "vínculo de spans — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.spans.every(s=>s.parent===null||x.spans.some(p=>p.id===s.parent));\nconst input = {spans:[{id:\"tool\",parent:\"missing\"}]};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "vínculo de spans — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.spans.every(s=>s.parent===null||x.spans.some(p=>p.id===s.parent));\nconst input = {spans:[{id:\"tool\",parent:\"missing\"}]};\nconst expected = false;\nconst mutant = x=>x.spans.every(s=>s.id.length>0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Disponibilidade e fallback": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "fallback compatível — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.available&&x.capabilities.includes(x.required)&&x.dataAllowed;\nconst input = {available:true,capabilities:[\"text\"],required:\"tools\",dataAllowed:false};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "fallback compatível — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.available&&x.capabilities.includes(x.required)&&x.dataAllowed;\nconst input = {available:true,capabilities:[\"text\"],required:\"tools\",dataAllowed:false};\nconst expected = false;\nconst mutant = x=>x.available;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Release, rollback e monitoramento": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "gate de release — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.build&&x.evaluation&&x.rollbackCompatible;\nconst input = {build:true,evaluation:false,rollbackCompatible:false};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "gate de release — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.build&&x.evaluation&&x.rollbackCompatible;\nconst input = {build:true,evaluation:false,rollbackCompatible:false};\nconst expected = false;\nconst mutant = x=>x.build;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Tutor, fatos e responsabilidade": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "fatos do tutor — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.reply.mastery===x.index.mastery&&!x.reply.inventedCompletion;\nconst input = {reply:{mastery:4,inventedCompletion:true,helpful:true},index:{mastery:1}};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "fatos do tutor — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.reply.mastery===x.index.mastery&&!x.reply.inventedCompletion;\nconst input = {reply:{mastery:4,inventedCompletion:true,helpful:true},index:{mastery:1}};\nconst expected = false;\nconst mutant = x=>x.reply.helpful;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Reserva, ferramentas e autoridade": [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "consumo de confirmações únicas — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>[...new Map(x.filter(r=>r.state===\"confirmed\").map(r=>[r.command,r])).values()].reduce((n,r)=>n+r.qty,0);\nconst input = [{command:\"c1\",state:\"confirmed\",qty:1},{command:\"c1\",state:\"confirmed\",qty:1},{command:\"c2\",state:\"rejected\",qty:1}];\nconst expected = 1;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "consumo de confirmações únicas — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>[...new Map(x.filter(r=>r.state===\"confirmed\").map(r=>[r.command,r])).values()].reduce((n,r)=>n+r.qty,0);\nconst input = [{command:\"c1\",state:\"confirmed\",qty:1},{command:\"c1\",state:\"confirmed\",qty:1},{command:\"c2\",state:\"rejected\",qty:1}];\nconst expected = 1;\nconst mutant = x=>x.reduce((n,r)=>n+r.qty,0);\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Aceitação e evidência de integração": [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "claim corresponde ao método — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.claimScope===x.executedScope&&x.digest===x.executedDigest;\nconst input = {claimScope:\"provider\",executedScope:\"local\",digest:\"a\",executedDigest:\"a\",passed:true};\nconst expected = false;\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "claim corresponde ao método — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>x.claimScope===x.executedScope&&x.digest===x.executedDigest;\nconst input = {claimScope:\"provider\",executedScope:\"local\",digest:\"a\",executedDigest:\"a\",passed:true};\nconst expected = false;\nconst mutant = x=>x.passed;\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ],
  "Banca, incidentes e manutenção": [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "impacto transitivo — resultado local da fixture",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>{const seen=new Set([x.changed]);for(const id of seen)for(const [name,deps]of Object.entries(x.graph))if(deps.includes(id))seen.add(name);return [...seen].sort()};\nconst input = {changed:\"policy\",graph:{cache:[\"policy\"],eval:[\"policy\"],report:[\"eval\"],unrelated:[]}};\nconst expected = [\"cache\",\"eval\",\"policy\",\"report\"];\nassert.deepEqual(evaluate(input), expected);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "impacto transitivo — contraprova específica detectada",
      "code": "const assert = require(\"node:assert/strict\");\nconst evaluate = x=>{const seen=new Set([x.changed]);for(const id of seen)for(const [name,deps]of Object.entries(x.graph))if(deps.includes(id))seen.add(name);return [...seen].sort()};\nconst input = {changed:\"policy\",graph:{cache:[\"policy\"],eval:[\"policy\"],report:[\"eval\"],unrelated:[]}};\nconst expected = [\"cache\",\"eval\",\"policy\",\"report\"];\nconst mutant = x=>[x.changed];\nassert.deepEqual(evaluate(input), expected);\nassert.throws(() => assert.deepEqual(mutant(input), expected), assert.AssertionError);\n"
    }
  ]
};
