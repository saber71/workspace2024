import { describe, test } from "vitest";
import { VueClass } from "vue-class";
import { UserService } from "../src/services/user.service";

const userService = VueClass.getInstance(UserService);

describe("UserService", () => {
  test("", () => {});
});
