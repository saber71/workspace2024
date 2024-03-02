import { describe, expect, test } from "vitest";
import { validate, Validation } from "../src";

describe("Validator", () => {
  test("validate type", () => {
    class Target {
      @Validation("isString")
      isString = "a";

      @Validation("isNumber")
      isNumber = undefined;

      @Validation("isNumberStrict")
      isNumberStrict = 12;

      @Validation("isNull")
      failedValidate = undefined;

      @Validation("arrayContains", [1, 2, 3])
      @Validation("arrayUnique")
      array = [1, 2, 3];
    }
    const target = new Target();
    expect(validate(target)).toEqual(["failedValidate"]);
  });
});
