import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { afterAll, expect, it } from "vitest";
import { CURSOR_EXAMPLES } from "./cursorExamples";

const nodeRequire=createRequire(import.meta.url);
const allowed=new Set(["node:assert/strict","node:crypto"]);
const fixtureRequire=(name: string)=>{if(!allowed.has(name))throw new Error(`Module absent from local corpus: ${name}`);return nodeRequire(name);};
const examples=Object.entries(CURSOR_EXAMPLES).flatMap(([section,pair])=>pair.map((example,index)=>({...example,section,id:`${section} / ${index+1}`,digest:createHash("sha256").update(example.code).digest("hex")})));
const executions: {id:string;digest:string;scope:string;status:string;elapsedMs:number}[]=[];

// VM is an execution context for trusted authored fixtures, not a security sandbox.
// No injected cursor helpers: these scripts test only their declared local mechanisms.
it.each(examples)("CURSOR executa $id [$scope]",example=>{
  const started=performance.now();
  let status="failed";
  try {
    const script=new Script(example.code,{filename:`cursor-example-${examples.indexOf(example)+1}.js`});
    script.runInNewContext({require:fixtureRequire,Buffer,URL,URLSearchParams,Intl},{timeout:2000});
    status="passed";
  } finally {
    executions.push({id:example.id,digest:example.digest,scope:example.scope,status,elapsedMs:Number((performance.now()-started).toFixed(3))});
  }
  expect(status).toBe("passed");
});

afterAll(()=>{
  expect(executions).toHaveLength(96);
  const evidence={generatedAt:new Date().toISOString(),environment:{node:process.version,platform:process.platform,arch:process.arch,context:"Trusted JavaScript snippets; fresh VM context per snippet; no cursor runtime or providers"},scopes:Object.fromEntries(["local-rule","local-transform","model"].map(scope=>[scope,examples.filter(example=>example.scope===scope).length])),executions,operationalGates:{providersAndModels:"Pending: no Cursor model requests or generated answers exercised",retrievalAndEmbeddings:"Pending: no Cursor native search or index exercised",applicationAndUi:"Pending: no Cursor editor, inline edit, MDC inclusion, checkpoint, CLI, hook or assistive technology tested",transportAndRemoteEffects:"Pending: no MCP protocol, sandbox enforcement, remote agent, cancellation or approval UI exercised",durableConcurrentBackend:"Pending: serial fixtures do not attest concurrency, storage, reservation or restore",qualityAndOperationalRelease:"Pending: no real response dataset, human study, production monitoring, rollout or rollback performed"}};
  if(process.env.CHIRON_WRITE_CURSOR_EVIDENCE==="1")writeFileSync(resolve("scripts/cursor-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  console.info("CURSOR corpus",JSON.stringify({total:executions.length,failures:executions.filter(row=>row.status!=="passed").length,scopes:evidence.scopes,environment:evidence.environment}));
});
