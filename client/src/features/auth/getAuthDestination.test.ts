import { describe, expect, it } from "vitest";
import { getAuthDestination } from "./getAuthDestination";
describe("return to meeting after authentication", () => {
  it("keeps the original meeting path", () => {
    expect(getAuthDestination({ from: { pathname: "/meet/123", search: "?a=1" } })).toBe("/meet/123?a=1");
  });
  it("rejects external redirects", () => {
    for (const pathname of ["https://example.test", "//example.test", "/\\example.test"]) {
      expect(getAuthDestination({ from: { pathname } })).toBe("/");
    }
    expect(getAuthDestination(null)).toBe("/");
  });
});
