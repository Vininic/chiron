import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { afterAll, expect, it } from "vitest";
import { LLM_EXAMPLES } from "./llmExamples";

const nodeRequire=createRequire(import.meta.url);
const allowed=new Set(["node:assert/strict","node:crypto"]);
const fixtureRequire=(name: string)=>{if(!allowed.has(name))throw new Error(`Module absent from local corpus: ${name}`);return nodeRequire(name);};
const examples=Object.entries(LLM_EXAMPLES).flatMap(([section,pair])=>pair.map((example,index)=>({...example,section,id:`${section} / ${index+1}`,digest:createHash("sha256").update(example.code).digest("hex")})));
const executions: {id:string;digest:string;scope:string;status:string;elapsedMs:number}[]=[];

// VM is an execution context for trusted authored fixtures, not a security sandbox.
// No injected llm helpers: these scripts test only their declared local mechanisms.
it.each(examples)("LLM executa $id [$scope]",example=>{
  const started=performance.now();
  let status="failed";
  try {
    const script=new Script(example.code,{filename:`llm-example-${examples.indexOf(example)+1}.js`});
    script.runInNewContext({require:fixtureRequire,Buffer,URL,URLSearchParams,Intl},{timeout:2000});
    status="passed";
  } finally {
    executions.push({id:example.id,digest:example.digest,scope:example.scope,status,elapsedMs:Number((performance.now()-started).toFixed(3))});
  }
  expect(status).toBe("passed");
});

afterAll(()=>{
  expect(executions).toHaveLength(96);
  const evidence={generatedAt:new Date().toISOString(),environment:{node:process.version,platform:process.platform,arch:process.arch,context:"Trusted JavaScript snippets; fresh VM context per snippet; no llm runtime or providers"},scopes:Object.fromEntries(["local-rule","local-transform","model"].map(scope=>[scope,examples.filter(example=>example.scope===scope).length])),executions,operationalGates:{providersAndModels:"Pending: no provider requests, generated answers, SDK or tokenizer exercised",retrievalAndEmbeddings:"Pending: no embedding generation, native index or real semantic retrieval evaluated",applicationAndUi:"Pending: no tutor session, approval UI, browser events or assistive technology tested",transportAndRemoteEffects:"Pending: no real stream, cancellation, rate limit, remote tools or effect authorization exercised",durableConcurrentBackend:"Pending: serial fixtures do not attest concurrency, storage, reservation or restore",qualityAndOperationalRelease:"Pending: no real response dataset, human study, production monitoring, rollout or rollback performed"}};
  if(process.env.CHIRON_WRITE_LLM_EVIDENCE==="1")writeFileSync(resolve("scripts/llm-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  console.info("LLM corpus",JSON.stringify({total:executions.length,failures:executions.filter(row=>row.status!=="passed").length,scopes:evidence.scopes,environment:evidence.environment}));
});
