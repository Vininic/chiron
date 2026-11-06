import { describe, it, expect } from "vitest";
import { parseRepoUrl } from "./fetcher";

describe("parseRepoUrl", () => {
  it("parses a plain https URL", () => {
    expect(parseRepoUrl("https://github.com/Vininic/chronos-the-art-of-time")).toEqual({
      owner: "Vininic", repo: "chronos-the-art-of-time", defaultBranch: "main",
    });
  });

  it("parses a URL with a trailing slash", () => {
    expect(parseRepoUrl("https://github.com/Vininic/kairos/")).toEqual({
      owner: "Vininic", repo: "kairos", defaultBranch: "main",
    });
  });

  it("strips a .git suffix", () => {
    expect(parseRepoUrl("https://github.com/Vininic/hermes.git")).toEqual({
      owner: "Vininic", repo: "hermes", defaultBranch: "main",
    });
  });

  it("parses a URL with a deeper path (e.g. /tree/main)", () => {
    expect(parseRepoUrl("https://github.com/Vininic/pluto/tree/main")).toEqual({
      owner: "Vininic", repo: "pluto", defaultBranch: "main",
    });
  });

  it("returns null for a non-GitHub URL", () => {
    expect(parseRepoUrl("https://gitlab.com/Vininic/chronos")).toBeNull();
  });

  it("returns null for garbage input", () => {
    expect(parseRepoUrl("not a url")).toBeNull();
    expect(parseRepoUrl("")).toBeNull();
  });
});
