import { describe, expect, test } from "vitest";
import { VueClass } from "vue-class";
import { KeyValueService } from "../src/services/key-value.service";
import {
  NotFoundUserError,
  RepeatLoginNameError,
  UserService,
  WrongPasswordError,
} from "../src/services/user.service";
import { useGlobalStore } from "../src/store";

const userService = VueClass.getInstance(UserService);

describe("UserService", async () => {
  test.concurrent("createUser", async () => {
    await userService.create({
      id: "1",
      name: "admin",
      loginName: "admin",
      password: "123456",
      email: "153sad@aa.com",
    });
    await VueClass.getInstance(KeyValueService).setValue("GuestID", "1");

    const id = await userService.create({
      name: "admin",
      loginName: "admin123",
      password: "123456",
      email: "153sad@aa.com",
    });
    expect(id).toBeTruthy();

    try {
      await userService.create({
        name: "admin",
        loginName: "admin",
        password: "123456",
        email: "153sad@aa.com",
      });
      expect.unreachable("登录名重复应该抛出错误");
    } catch (e) {
      expect(e instanceof RepeatLoginNameError).toEqual(true);
    }
  });

  test("findUser", async () => {
    try {
      await userService.fetchById("2");
      expect.unreachable("通过错误的id查找用户应该抛出错误");
    } catch (e) {
      expect(e instanceof NotFoundUserError).toEqual(true);
    }
    try {
      const user = await userService.fetchByLoginNameOrEmail("153sad@aa.com");
      expect(user).toBeTruthy();
    } catch (e) {
      expect.unreachable(e.message);
    }
  });

  test.concurrent("resetPassword", async () => {
    await userService.resetPassword({
      loginNameOrEmail: "admin",
      password: "123",
    });

    try {
      await userService.fetchByLoginData({
        loginNameOrEmail: "admin",
        password: "123456",
      });
      expect.unreachable("使用过时的密码查找用户应该抛出错误");
    } catch (e) {
      expect(e instanceof WrongPasswordError).toEqual(true);
    }

    const user = await userService.fetchByLoginData({
      loginNameOrEmail: "admin",
      password: "123",
    });
    expect(user.id === "1").toBeTruthy();
  });

  test.concurrent("login", async () => {
    cancelAuth();
    await userService.login({
      loginNameOrEmail: "admin",
      password: "123",
      remember: true,
    });
    testAuth();
    expect(useGlobalStore().rememberLoginStatus).toEqual(true);

    cancelAuth();
    await userService.guestLogin();
    testAuth();
  });
});

function cancelAuth() {
  const store = useGlobalStore();
  store.auth = false;
  store.lastLoginUserId = "";
}

function testAuth() {
  const store = useGlobalStore();
  expect(store.auth).toEqual(true);
  expect(store.lastLoginUserId).toEqual("1");
  expect(store.userInfo.id).toBeTruthy();
}
