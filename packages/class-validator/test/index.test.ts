import { describe, expect, test } from "vitest";
import { validate, Validation } from "../src";

describe("Validator", () => {
  test("validate type", () => {
    class SubTarget {
      @Validation({ validatorType: "isNumber" })
      isNumber = 0;
    }

    class Target {
      @Validation({ validatorType: "isString" })
      isString = "a";

      @Validation({ validatorType: "isNumber", allowUndefined: true })
      isNumber = undefined;

      @Validation({ validatorType: "isNumber" })
      isNumberStrict = 12;

      @Validation({ validatorType: "isNull" })
      failedValidate = undefined;

      @Validation({ validatorType: "arrayContains", arg: [1, 2, 3] })
      @Validation({ validatorType: "arrayUnique" })
      array = [1, 2, 3];

      @Validation({ validatorType: "isObject" })
      sub: SubTarget = {
        isNumber: 12,
      };

      @Validation({ validatorType: "isObject" })
      failedSub: SubTarget = {
        isNumber: "12" as any,
      };

      @Validation({ validatorType: "isObject", recursive: false })
      noRecursiveSub: SubTarget = {} as any;

      @Validation({ validatorType: "isURL", arg: { require_host: false } })
      isURL = "/server/api";
    }
    const target = new Target();
    expect(validate(target)).toEqual([
      "failedValidate",
      "failedSub.isNumber",
      "failedSub",
    ]);
  });
});
