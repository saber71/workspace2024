import { describe, expect, test } from "vitest";
import {
  MarkParseType,
  RegularParser,
  ToArray,
  ToBoolean,
  ToDate,
  ToMap,
  ToNumber,
  ToObject,
  ToSet,
} from "../src";

class Sub {
  @ToNumber()
  number: number;
  string: string;
  @ToBoolean()
  boolean: boolean;
}

class Test {
  @ToNumber()
  number: number;
  string: string;
  @ToBoolean()
  boolean: boolean;
  @ToObject(Number)
  object: Object;
  @ToArray(Number, Boolean)
  array: Array<number | boolean>;
  @ToSet(Boolean)
  set: Set<any>;
  @ToMap(Number)
  map: Map<any, any>;
  @ToDate()
  date: Date;
  @MarkParseType()
  sub: Sub;
  callback: () => void;
}

describe("regular-parser", () => {
  test("parse", () => {
    const parser = new RegularParser();

    const callback = () => 0;
    expect(
      parser.parse(
        {
          number: "1",
          string: "string",
          boolean: "true",
          object: JSON.stringify({ 1: "0" }),
          array: ["20", "true"],
          set: ["true"],
          map: { 1: "20" },
          date: "2020/05/20 18:00:00",
          sub: {
            number: "1",
            string: "string",
            boolean: "true",
          },
          callback,
        },
        Test,
      ),
    ).toEqual({
      number: 1,
      string: "string",
      boolean: true,
      object: { 1: 0 },
      array: [20, true],
      set: new Set([true]),
      map: new Map([["1", 20]]),
      date: new Date("2020/05/20 18:00:00"),
      sub: {
        number: 1,
        string: "string",
        boolean: true,
      },
      callback,
    });
  });
});
