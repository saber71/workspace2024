import { describe, expect, test } from "vitest";
import { deepClone } from "../src";

describe("deepClone", () => {
  test("object", () => {
    const obj1 = { a: 12, 1: 20 };
    const obj2 = { a: 12, 1: 20, b: { a: 20, c: { 1: 20 } }, cc: new Date(2) };
    expect(deepClone(obj1)).toEqual(obj1);
    expect(deepClone(obj2)).toEqual(obj2);
  });
  test("array", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [{ 1: 20, c: [2, 2] }, 20, { aa: 1, bb: { lo: [20] } }];
    const arr3 = new Uint8Array([1, 2, 3, 4, 5]);
    expect(deepClone(arr1)).toEqual(arr1);
    expect(deepClone(arr2)).toEqual(arr2);
    expect(deepClone(arr3)).toEqual(arr3);
  });
  test("set", () => {
    const set1 = new Set([
      1,
      true,
      { aa: 1, bb: { lo: [20, { pp: 20 }] } },
      new Date(3),
    ]);
    expect(deepClone(set1)).toEqual(set1);
  });
  test("map", () => {
    const map = new Map([
      [1, { p: 20, ss: new Set([1, { a: 1 }, [new Date(2)]]) }],
      [{ aa: 1 }, { pp: 20 }],
    ] as any);
    expect(deepClone(map)).toEqual(map);
    expect(deepClone(map, { cloneMapKey: true })).toEqual(map);
  });
});
