import { describe, expect, test } from "vitest";
import { VueClass } from "vue-class";
import { CommonService } from "../src/services/common.service";

const commonService = VueClass.getInstance(CommonService);

describe("CommonService", () => {
  test("isEmail", () => {
    expect(commonService.isEmail("asdsa")).toEqual(false);
    expect(commonService.isEmail("2asdsa12")).toEqual(false);
    expect(commonService.isEmail("asdsa@com.cn")).toEqual(true);
  });
});
