import { describe, expect, it } from "vitest";
import { checkEditorialSource } from "@/lib/content/editorial";
import { PUBLISHED_SOURCES } from "./index";

// The publication gate runSeed() used to run on every page load: a book only
// ships if it passes the structural contract and the editorial audit.
describe("published built-in sources", () => {
  for (const source of PUBLISHED_SOURCES) {
    it(`${source.name} passes the editorial gate`, () => {
      expect(checkEditorialSource(source)).toEqual([]);
    }, 60_000);
  }
});
