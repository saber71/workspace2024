import { describe, test, expect } from "vitest";
import { composeUrl } from "../src";

describe("common.test", () => {
  test("composeUrl", () => {
    expect(composeUrl("a///", "", "/", "////b/", "")).toEqual("/a/b");
    expect(composeUrl("", "", "")).toEqual("/");
  });
});
