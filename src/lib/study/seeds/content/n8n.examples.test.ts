import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { afterAll, expect, it } from "vitest";
import { N8N_EXAMPLES } from "./n8nExamples";

const nodeRequire=createRequire(import.meta.url);
const allowed=new Set(["node:assert/strict","node:crypto"]);
const fixtureRequire=(name: string)=>{if(!allowed.has(name))throw new Error(`Module absent from local corpus: ${name}`);return nodeRequire(name);};
const examples=Object.entries(N8N_EXAMPLES).flatMap(([section,pair])=>pair.map((example,index)=>({...example,section,id:`${section} / ${index+1}`,digest:createHash("sha256").update(example.code).digest("hex")})));
const executions: {id:string;digest:string;scope:string;status:string;elapsedMs:number}[]=[];

// VM is an execution context for trusted authored fixtures, not a security sandbox.
// No injected n8n helpers: these scripts test only their declared local mechanisms.
it.each(examples)("N8N executa $id [$scope]",example=>{
  const started=performance.now();
  let status="failed";
  try {
    const script=new Script(example.code,{filename:`n8n-example-${examples.indexOf(example)+1}.js`});
    script.runInNewContext({require:fixtureRequire,Buffer,URL,URLSearchParams,Intl},{timeout:2000});
    status="passed";
  } finally {
    executions.push({id:example.id,digest:example.digest,scope:example.scope,status,elapsedMs:Number((performance.now()-started).toFixed(3))});
  }
  expect(status).toBe("passed");
});

afterAll(()=>{
  expect(executions).toHaveLength(96);
  const evidence={generatedAt:new Date().toISOString(),environment:{node:process.version,platform:process.platform,arch:process.arch,context:"Trusted JavaScript snippets; fresh VM context per snippet; no n8n runtime or providers"},scopes:Object.fromEntries(["local-rule","local-transform","model"].map(scope=>[scope,examples.filter(example=>example.scope===scope).length])),executions,operationalGates:{n8nEngineEditorAndImport:"Pending: n8n runtime absent; no import or native node/helper execution",publishTriggersWaitAndApproval:"Pending: no published workflow, schedule, webhook or approval channel",providersHttpAiAndCredentials:"Pending: no HTTP sandbox, real credentials or model calls",databaseOutboxBrokerAndConcurrency:"Pending: sequential memory models; no database transaction, durable outbox or broker",rbacSsrFAndRunnerEnforcement:"Pending: local policy is not platform/network enforcement",queueLoadObservabilityAndPaging:"Pending: no queue mode, workers, load test, telemetry or alert delivery",backupRestoreUpgradeRpoAndRto:"Pending: fixture restore does not recover n8n services or measure operational objectives"}};
  if(process.env.CHIRON_WRITE_N8N_EVIDENCE==="1")writeFileSync(resolve("scripts/n8n-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  console.info("N8N corpus",JSON.stringify({total:executions.length,failures:executions.filter(row=>row.status!=="passed").length,scopes:evidence.scopes,environment:evidence.environment}));
});
