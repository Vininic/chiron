import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { afterAll, expect, it } from "vitest";
import { GOOGLE_AI_STUDIO_EXAMPLES } from "./googleAiStudioExamples";

const nodeRequire=createRequire(import.meta.url);
const allowed=new Set(["node:assert/strict","node:crypto"]);
const fixtureRequire=(name: string)=>{if(!allowed.has(name))throw new Error(`Module absent from local corpus: ${name}`);return nodeRequire(name);};
const examples=Object.entries(GOOGLE_AI_STUDIO_EXAMPLES).flatMap(([section,pair])=>pair.map((example,index)=>({...example,section,id:`${section} / ${index+1}`,digest:createHash("sha256").update(example.code).digest("hex")})));
const executions: {id:string;digest:string;scope:string;status:string;elapsedMs:number}[]=[];

// VM is an execution context for trusted authored fixtures, not a security sandbox.
// No injected googleAiStudio helpers: these scripts test only their declared local mechanisms.
it.each(examples)("GOOGLE_AI_STUDIO executa $id [$scope]",example=>{
  const started=performance.now();
  let status="failed";
  try {
    const script=new Script(example.code,{filename:`googleAiStudio-example-${examples.indexOf(example)+1}.js`});
    script.runInNewContext({require:fixtureRequire,Buffer,URL,URLSearchParams,Intl},{timeout:2000});
    status="passed";
  } finally {
    executions.push({id:example.id,digest:example.digest,scope:example.scope,status,elapsedMs:Number((performance.now()-started).toFixed(3))});
  }
  expect(status).toBe("passed");
});

afterAll(()=>{
  expect(executions).toHaveLength(96);
  const evidence={generatedAt:new Date().toISOString(),environment:{node:process.version,platform:process.platform,arch:process.arch,context:"Trusted JavaScript snippets; fresh VM context per snippet; no googleAiStudio runtime or providers"},scopes:Object.fromEntries(["local-rule","local-transform","model"].map(scope=>[scope,examples.filter(example=>example.scope===scope).length])),executions,operationalGates:{providersAndModels:"Pending: no GoogleAiStudio model requests or generated answers exercised",retrievalAndEmbeddings:"Pending: no GoogleAiStudio native exploration or context loading exercised",applicationAndUi:"Pending: no GoogleAiStudio Playground, Build, Gemini APIs, multimodal input, grounding or Cloud Run exercised",transportAndRemoteEffects:"Pending: no native function calling, Live API, grounding, OAuth, deployment or recovery UI exercised",durableConcurrentBackend:"Pending: serial fixtures do not attest concurrency, storage, reservation or restore",qualityAndOperationalRelease:"Pending: no real response dataset, human study, production monitoring, rollout or rollback performed"}};
  if(process.env.CHIRON_WRITE_GOOGLE_AI_STUDIO_EVIDENCE==="1")writeFileSync(resolve("scripts/ai-studio-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  console.info("GOOGLE_AI_STUDIO corpus",JSON.stringify({total:executions.length,failures:executions.filter(row=>row.status!=="passed").length,scopes:evidence.scopes,environment:evidence.environment}));
});
