import { describe, test, expect } from "vitest";
import { composeUrl } from "../src";

describe("composeUrl", () => {
  test("test", () => {
    expect(composeUrl("a///", "", "/", "////b/", "")).toEqual("/a/b");
    expect(composeUrl("", "", "")).toEqual("/");
  });
});
