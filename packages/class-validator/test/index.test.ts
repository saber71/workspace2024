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

      @Validation({ validatorType: "isNumber" })
      isNumber = undefined;

      @Validation({ validatorType: "isNumberStrict" })
      isNumberStrict = 12;

      @Validation({ validatorType: "isNull" })
      failedValidate = undefined;

      @Validation({ validatorType: "arrayContains", arg: [1, 2, 3] })
      @Validation({ validatorType: "arrayUnique" })
      array = [1, 2, 3];

      @Validation({ validatorType: "isObjectStrict" })
      sub: SubTarget = {
        isNumber: 12,
      };

      @Validation({ validatorType: "isObjectStrict" })
      failedSub: SubTarget = {
        isNumber: "12" as any,
      };

      @Validation({ validatorType: "isObjectStrict", recursive: false })
      noRecursiveSub: SubTarget = {} as any;
    }
    const target = new Target();
    expect(validate(target)).toEqual(["failedValidate", "failedSub"]);
  });
});
