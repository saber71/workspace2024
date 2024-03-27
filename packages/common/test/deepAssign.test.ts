import { describe, expect, test } from "vitest";
import { deepAssign } from "../src";

describe("deepAssign", () => {
  test("object", () => {
    expect(
      deepAssign(
        {
          a: 12,
          b: null,
          c: {
            1: 20,
            2: { a: 1, b: [1] },
          },
        },
        {
          b: 2,
          c: {
            1: 120,
            2: { a: 1, b: [1, 2] },
            3: { b: [2, 3], c: 20 },
          },
        },
      ),
    ).toEqual({
      a: 12,
      b: 2,
      c: {
        1: 120,
        2: { a: 1, b: [1, 2] },
        3: { b: [2, 3], c: 20 },
      },
    });
  });
});
