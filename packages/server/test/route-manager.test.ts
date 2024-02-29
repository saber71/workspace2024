import { LoadableContainer } from "dependency-injection";
import { describe, expect, test } from "vitest";
import {
  Controller,
  Method,
  NotFoundRouteHandlerError,
  RouteManager,
} from "../src";

@Controller({ routePrefix: "/prefix" })
class Controller1 {
  @Method({ routePrefix: "/api/" })
  findById() {}

  @Method({ routePrefix: "/post/", route: "/postData", type: "POST" })
  postData(arg: string) {
    expect(arg).toEqual("arg");
    return 1;
  }
}

const container = new LoadableContainer();
container.load();

container.bindValue("String", "arg");

describe("route-manager", () => {
  test("getUrl", () => {
    expect(Array.from(RouteManager.getUrls())).toEqual([
      "/prefix/api/find-by-id",
      "/prefix/post/postData",
    ]);
  });

  test("getRouteHandler", () => {
    expect(
      RouteManager.getRouteHandler("GET", "/prefix/api/find-by-id"),
    ).toEqual({
      controllerClass: Controller1,
      methodName: "findById",
    });
    expect(
      RouteManager.getRouteHandler("POST", "/prefix/post/postData"),
    ).toEqual({
      controllerClass: Controller1,
      methodName: "postData",
    });
    try {
      RouteManager.getRouteHandler("DELETE", "/delete");
      expect.unreachable("找不到RouteHandler对象应该要抛出错误");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundRouteHandlerError);
    }
  });

  test("call", () => {
    const instance = container.getValue(Controller1) as any;
    expect(container.call(instance, "postData")).toEqual(1);
  });
});
