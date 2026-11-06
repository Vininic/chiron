import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { afterAll, expect, it } from "vitest";
import { FIGMA_EXAMPLES } from "./figmaExamples";

const nodeRequire=createRequire(import.meta.url);
const allowed=new Set(["node:assert/strict","node:crypto"]);
const fixtureRequire=(name: string)=>{if(!allowed.has(name))throw new Error(`Module absent from local corpus: ${name}`);return nodeRequire(name);};
const examples=Object.entries(FIGMA_EXAMPLES).flatMap(([section,pair])=>pair.map((example,index)=>({...example,section,id:`${section} / ${index+1}`,digest:createHash("sha256").update(example.code).digest("hex")})));
const executions: {id:string;digest:string;scope:string;status:string;elapsedMs:number}[]=[];

// VM is an execution context for trusted authored fixtures, not a security sandbox.
// No injected figma helpers: these scripts test only their declared local mechanisms.
it.each(examples)("FIGMA executa $id [$scope]",example=>{
  const started=performance.now();
  let status="failed";
  try {
    const script=new Script(example.code,{filename:`figma-example-${examples.indexOf(example)+1}.js`});
    script.runInNewContext({require:fixtureRequire,Buffer,URL,URLSearchParams,Intl},{timeout:2000});
    status="passed";
  } finally {
    executions.push({id:example.id,digest:example.digest,scope:example.scope,status,elapsedMs:Number((performance.now()-started).toFixed(3))});
  }
  expect(status).toBe("passed");
});

afterAll(()=>{
  expect(executions).toHaveLength(96);
  const evidence={generatedAt:new Date().toISOString(),environment:{node:process.version,platform:process.platform,arch:process.arch,context:"Trusted JavaScript snippets; fresh VM context per snippet; no figma runtime or providers"},scopes:Object.fromEntries(["local-rule","local-transform","local-geometry","model"].map(scope=>[scope,examples.filter(example=>example.scope===scope).length])),executions,operationalGates:{figmaEditorAndNativeLayout:"Pending: no Figma file, layout engine, native components or variables exercised",librariesVersionsAndCodeConnect:"Pending: no Figma library publication, update, merge, Dev Mode or Code Connect",pluginRestAndAi:"Pending: no Plugin API, real REST requests or AI provider calls",reservationBackend:"Pending: serial fixture does not attest database concurrency or durable reservation",sharingAndPermissions:"Pending: role fixtures do not attest Figma sharing or access",renderingKeyboardAndAssistiveTechnology:"Pending: no native export, renderer, browser events or assistive technology tested",humanResearchAndOperationalAcceptance:"Pending: no usability study or operational release performed"}};
  if(process.env.CHIRON_WRITE_FIGMA_EVIDENCE==="1")writeFileSync(resolve("scripts/figma-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  console.info("FIGMA corpus",JSON.stringify({total:executions.length,failures:executions.filter(row=>row.status!=="passed").length,scopes:evidence.scopes,environment:evidence.environment}));
});
