import { describe, expect, test } from "vitest";
import { remove } from "../src";

describe("remove", () => {
  test("array", () => {
    expect(remove([1, 2, 4], 2)).toEqual([1, 4]);
    expect(remove([1, 2, 4], (item) => item === 1 || item === 4)).toEqual([2]);
  });
});
