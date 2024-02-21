import { CommonService } from "@/services/common.service.ts";
import type { RuleObject } from "ant-design-vue/es/form";
import { VueClass } from "vue-class";

export const Required: RuleObject = {
  required: true,
  validator: (_, value) => {
    if (!value) return Promise.reject("此为必填项");
    return Promise.resolve();
  },
};

export const ValidEmail: RuleObject = {
  validator(_, value) {
    const commonService = VueClass.getInstance(CommonService);
    if (!commonService.isEmail(value)) return Promise.reject("不是合法的邮箱");
    else return Promise.resolve();
  },
};

export const Equal = <T>(
  targetValue: T | (() => T),
  errMessage: string = "不一致",
): RuleObject => {
  return {
    validator(_, value: T) {
      return value ===
        (typeof targetValue !== "function"
          ? targetValue
          : (targetValue as Function)())
        ? Promise.resolve()
        : Promise.reject(errMessage);
    },
  };
};
