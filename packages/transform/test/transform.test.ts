import { Transform, vec2 } from "../src";
import { describe, expect, test } from "vitest";

describe("Transform", () => {
  test("world and local position", () => {
    const transform = new Transform();
    transform.translate(100, 100);
    const parentTransform = new Transform();
    transform.setParent(parentTransform);
    parentTransform.translate(100, 100);
    const worldPos = transform.toWorld([0, 0]);
    expect(worldPos).toEqual(vec2.fromValues(200, 200));
    expect(transform.toLocal(worldPos)).toEqual(vec2.fromValues(0, 0));
  });
});
