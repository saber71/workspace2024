import { LoadableContainer } from "dependency-injection";
import { describe, expect, test } from "vitest";
import { NotFoundRouteHandlerError, RouteManager } from "../src";
import { UserController } from "./util/user.controller";

const container = new LoadableContainer();
container.bindValue("String", "arg").load();

describe("route-manager", () => {
  test("getUrl", () => {
    expect(Array.from(RouteManager.getUrls())).toEqual([
      "/user/api/find-by-id",
      "/user/post/postData",
    ]);
  });

  test("getRouteHandler", () => {
    expect(RouteManager.getRouteHandler("GET", "/user/api/find-by-id")).toEqual(
      {
        controllerClass: UserController,
        methodName: "findById",
      },
    );
    expect(RouteManager.getRouteHandler("POST", "/user/post/postData")).toEqual(
      {
        controllerClass: UserController,
        methodName: "postData",
      },
    );
    try {
      RouteManager.getRouteHandler("DELETE", "/delete");
      expect.unreachable("找不到RouteHandler对象应该要抛出错误");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundRouteHandlerError);
    }
  });

  test("call", () => {
    const instance = container.getValue(UserController) as any;
    expect(container.call(instance, "postData")).toEqual(1);
  });
});
