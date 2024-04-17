import { httpTest } from "http-test";
import { describe, test } from "vitest";
import "../index.test.js";

describe("ServerUser", async () => {
  test.concurrent("login", async () => {
    await httpTest({
      url: "/user/create",
      method: "POST",
      data: {
        name: "",
        password: "123456",
        loginName: "admin",
        roleId: "0",
      },
    })
      .expectStatus(401)
      .done();

    await httpTest({
      url: "/user/login",
      method: "POST",
      data: {
        loginNameOrEmail: "default-user",
        password: "123456",
      },
    })
      .expectHasHeader("set-cookie")
      .expectStatus(200)
      .done();

    await httpTest({
      url: "/user/create",
      method: "POST",
      data: {
        _id: "1",
        name: "111",
        password: "123456",
        loginName: "admin",
        roleId: "0",
      },
    })
      .expectStatus(200)
      .expectBodyData(["1"])
      .done();
  });
});
