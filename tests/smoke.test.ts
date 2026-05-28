import { describe, expect, it } from "vitest";

// Smoke test that validates the test pipeline runs without network, DB or browser.
describe("test infrastructure", () => {
  it("runs a trivial assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
