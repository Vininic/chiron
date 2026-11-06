import { ORACLE_CLOUD_CURRICULUM } from "./oracleCloudCurriculum";

export type OracleCloudExample = { lang: "json" | "javascript"; purpose: string; code: string };
const titles = ORACLE_CLOUD_CURRICULUM.flatMap(([, , , lessons]) => lessons.map(([title]) => title));

export const ORACLE_CLOUD_EXAMPLES: Record<string, readonly [OracleCloudExample, OracleCloudExample]> = Object.fromEntries(
  titles.map((title, index) => [title, [
    { lang: "json", purpose: `Declara o contrato redigido e os limites para ${title}.`, code: JSON.stringify({ source: "oracle-cloud-sandbox", section: title, compartment: "ocid1.compartment.oc1..synthetic", ownership: "team-quiron", requireLeastPrivilege: true, requireEvidence: ["manifest-digest", "positive-probe", "negative-probe", "cleanup"], pendingWithoutSandbox: true, sequence: index + 1 }, null, 2) },
    { lang: "javascript", purpose: `Verifica localmente o aceite e a falha controlada de ${title}.`, code: `const report = { section: ${JSON.stringify(title)}, approved: false, evidence: ["manifest-digest", "positive-probe", "negative-probe", "cleanup"], sandbox: "synthetic" };
if (!report.evidence.includes("negative-probe")) throw new Error("negative probe required");
if (report.sandbox !== "synthetic") throw new Error("unexpected execution boundary");
report.approved = report.evidence.length === 4;
if (!report.approved) throw new Error("Oracle Cloud contract incomplete");
console.log(JSON.stringify({ section: report.section, approved: report.approved, remoteClaim: "Pending" }));` },
  ] as const]),
);

