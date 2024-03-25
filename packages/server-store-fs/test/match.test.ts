import { describe, expect, test } from "vitest";
import { matchFilterCondition } from "../src";

describe("match", () => {
  test("query condition must match data", () => {
    expect(
      matchFilterCondition(
        { _id: "1", a: 12, b: "  " },
        { _id: "1", a: { $less: 20, $greaterEqual: 12 }, b: { $match: /\s+/ } },
      ),
    ).toEqual(true);
    expect(
      matchFilterCondition(
        { _id: "1", a: 12, b: "a" },
        { _id: "1", a: { $less: 20, $greaterEqual: 12 }, b: { $match: /\s+/ } },
      ),
    ).toEqual(false);
    expect(
      matchFilterCondition(
        { _id: "1", a: 12, b: 0 },
        { _id: "1", a: { $less: 20 }, b: { $not: 1 } },
      ),
    ).toEqual(true);
    expect(
      matchFilterCondition(
        { _id: "1", a: 12, b: 0, c: 20 },
        {
          _id: "1",
          a: { $less: 20 },
          b: { $nor: [{ $lessEqual: -1 }, { $greaterEqual: 1 }] },
          c: { $or: [{ $lessEqual: 10 }, { $greaterEqual: 0 }] },
        },
      ),
    ).toEqual(true);
  });
  test("or", () => {
    expect(
      matchFilterCondition(
        { _id: "1", a: 12, b: 0 },
        {
          $or: [{ _id: "12" }, { a: { $less: 20 } }],
        },
      ),
    ).toEqual(true);
  });
  test("nor", () => {
    expect(
      matchFilterCondition(
        { _id: "1", a: 12, b: 0 },
        {
          $nor: [{ _id: "11" }, { a: { $less: 0 } }],
        },
      ),
    ).toEqual(true);
  });
});
