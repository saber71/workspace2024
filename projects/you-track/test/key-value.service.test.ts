import { describe, expect, test } from "vitest";
import { VueClass } from "vue-class";
import {
  KeyValueReadonlyError,
  KeyValueService,
} from "../src/services/key-value.service";

const keyValueService = VueClass.getInstance(KeyValueService);

describe("KeyValueService", () => {
  test("Is data access normal", async () => {
    expect(await keyValueService.getValue("SystemInit")).toBeUndefined();
    await keyValueService.setValue("SystemInit", true, true);
    expect(await keyValueService.getValue("SystemInit")).toEqual(true);
    try {
      await keyValueService.setValue("SystemInit", false);
      expect.unreachable("重新设置只读字段的值应该会抛出错误");
    } catch (e) {
      expect(e).toBeInstanceOf(KeyValueReadonlyError);
    }
  });
});
