import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, expect, it } from "vitest";
import { UBUNTU_LINUX_EXAMPLES } from "./ubuntuLinuxExamples";

const examples = Object.entries(UBUNTU_LINUX_EXAMPLES).flatMap(([section, pair]) => pair.map((example, index) => ({ ...example, section, id: `${section} / ${index+1}`, digest: createHash("sha256").update(example.code).digest("hex") })));
interface Execution { id: string; digest: string; scope: string; exitCode: number; syntaxExitCode: number; elapsedMs: number; stdout: string; stderr: string }
interface Evidence { environment: Record<string,string>; executions: Execution[]; operationalGates: Record<string,string> }
let evidence: Evidence;

/** Um único processo WSL evita 96 inicializações; cada snippet recebe processo e cwd próprios. */
const RUNNER = String.raw`
import hashlib,json,os,pathlib,platform,subprocess,sys,tempfile,time
assert __debug__, 'assertions disabled'
examples=json.load(sys.stdin)
def version(command):
    return subprocess.run(command,text=True,capture_output=True,timeout=10).stdout.splitlines()[0]
environment={
    'distribution':pathlib.Path('/etc/os-release').read_text(),
    'kernel':platform.release(), 'python':sys.version.split()[0],
    'bash':version(['bash','--version']),
    'systemd':version(['systemd-analyze','--version']),
    'cloudInit':version(['cloud-init','--version']),
    'pid1':pathlib.Path('/proc/1/comm').read_text().strip(),
    'context':'existing Ubuntu-24.04 WSL2; read-only host queries and disposable local fixtures'
}
executions=[]
for example in examples:
    started=time.monotonic()
    with tempfile.TemporaryDirectory(prefix='chiron-ubuntu-') as directory:
        extension='py' if example['lang']=='python' else 'sh'
        script=pathlib.Path(directory)/('example.'+extension)
        script.write_text(example['code'],encoding='utf8')
        if extension=='py':
            syntax=subprocess.run([sys.executable,'-I','-c','import ast,pathlib,sys; ast.parse(pathlib.Path(sys.argv[1]).read_text())',str(script)],capture_output=True,text=True,timeout=10)
            command=[sys.executable,'-I',str(script)]
        else:
            syntax=subprocess.run(['bash','-n',str(script)],capture_output=True,text=True,timeout=10)
            command=['bash',str(script)]
        if syntax.returncode:
            result=syntax
        else:
            try: result=subprocess.run(command,cwd=directory,capture_output=True,text=True,timeout=15,env={**os.environ,'PYTHONOPTIMIZE':'0','LC_ALL':'C'})
            except subprocess.TimeoutExpired:
                result=subprocess.CompletedProcess(command,124,'','snippet timeout')
        executions.append({'id':example['id'],'digest':hashlib.sha256(example['code'].encode()).hexdigest(),'scope':example['scope'],'syntaxExitCode':syntax.returncode,'exitCode':result.returncode,'elapsedMs':round((time.monotonic()-started)*1000,2),'stdout':result.stdout[-4000:],'stderr':result.stderr[-4000:]})
report={'environment':environment,'executions':executions,'operationalGates':{
    'firmwareGrubBootAndConsole':'Pending: WSL is not a conventional machine boot',
    'systemdRuntimeReadinessAndTimerEffects':'Pending: native configuration checks do not start units',
    'networkDnsFirewallProxyTls':'Pending: loopback and models do not attest external topology or enforcement',
    'storageLvmExt4XfsCrashRecovery':'Pending: no block-device mutation or crash test',
    'accountsSudoPamMfaCapabilitiesLsm':'Pending: models/read-only queries do not attest enforcement',
    'containerRuntimeAndResourceEnforcement':'Pending: no engine, namespace creation or cgroup mutation',
    'clusterBrokerDatabaseAndDurableOutbox':'Pending: local fixtures/threads are not distributed durable services',
    'cloudAnsibleCiAndDeployment':'Pending: no external platforms or target mutation',
    'serviceRpoRtoRestorePagingAndGameDay':'Pending: archive/ledger fixtures do not restore the full service'
}}
print(json.dumps(report))
`;

beforeAll(async () => {
  const output = await new Promise<string>((fulfill,reject) => {
    const child = spawn("wsl.exe",["-d","Ubuntu-24.04","--exec","python3","-I","-c",RUNNER],{ windowsHide:true, stdio:["pipe","pipe","pipe"] });
    let stdout="", stderr="";
    const timer=setTimeout(() => { child.kill(); reject(new Error("Ubuntu corpus runner timed out")); },100000);
    child.on("error",error => { clearTimeout(timer); reject(error); });
    child.stdout.on("data",chunk => { stdout+=chunk; });
    child.stderr.on("data",chunk => { stderr+=chunk; });
    child.on("close",status => { clearTimeout(timer); if(status!==0) reject(new Error(`Ubuntu runner ${status}: ${stderr}`)); else fulfill(stdout); });
    child.stdin.end(JSON.stringify(examples));
  });
  evidence=JSON.parse(output);
  expect(evidence.executions).toHaveLength(96);
  if (process.env.CHIRON_WRITE_UBUNTU_EVIDENCE === "1") writeFileSync(resolve("scripts/ubuntu-linux-evidence.json"),JSON.stringify({ generatedAt:new Date().toISOString(),...evidence },null,2)+"\n");
  console.info("Ubuntu corpus", JSON.stringify({ total: evidence.executions.length, failures:evidence.executions.filter(row=>row.exitCode!==0).length, scopes:Object.fromEntries(["local-real","model","native-config"].map(scope=>[scope,examples.filter(example=>example.scope===scope).length])), environment:evidence.environment }));
},110000);

it.each(examples)("Ubuntu Linux executa $id [$scope]", example => {
  const row=evidence.executions.find(execution=>execution.id===example.id);
  expect(row).toBeDefined();
  expect(row?.digest).toBe(example.digest);
  expect(row?.syntaxExitCode,row?.stderr).toBe(0);
  expect(row?.exitCode,`${row?.stdout}\n${row?.stderr}`).toBe(0);
});
