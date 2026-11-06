import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { GIT_GITHUB_EXAMPLES } from "./gitGithubExamples";

const gitBash = [
  process.env.CHIRON_GIT_BASH,
  "C:\\Program Files\\Git\\bin\\bash.exe",
  "C:\\Program Files\\Git\\usr\\bin\\bash.exe",
].find((candidate): candidate is string => Boolean(candidate && existsSync(candidate)));
const execFileAsync = promisify(execFile);

describe.skipIf(!gitBash)("Git / GitHub — exemplos locais", () => {
  for (const [section, examples] of Object.entries(GIT_GITHUB_EXAMPLES)) {
    examples.forEach((example, index) => {
      it(`${section} — exemplo ${index + 1}`, async () => {
        const result = await execFileAsync(gitBash!, ["-c", example.code], {
          env: {
            ...process.env,
            GIT_CONFIG_NOSYSTEM: "1",
            GIT_TERMINAL_PROMPT: "0",
            LC_ALL: "C",
          },
          timeout: 30_000,
        });
        expect(result.stderr, `${example.purpose}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`).toBeTypeOf("string");
      }, 35_000);
    });
  }
});
