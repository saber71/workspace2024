import { describe, expect, test } from "vitest";
import { RegularParser } from "../src";

describe("regular-parser", () => {
  test("parse", () => {
    const parser = new RegularParser();

    const fn = () => 0;
    expect(
      parser.parse({
        a: 1,
        b: "2",
        z: "z",
        f: {
          array: ["true", "false"],
        },
        e: fn,
      }),
    ).toEqual({
      a: 1,
      b: 2,
      z: "z",
      f: {
        array: [true, false],
      },
      e: fn,
    });
  });
});
