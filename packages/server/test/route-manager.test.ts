import { LoadableContainer, Metadata } from "dependency-injection";
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
    const handler = RouteManager.getRouteHandler("GET", "/user/api/find-by-id");
    expect(handler).toEqual({
      controllerClass: UserController,
      methodName: "findById",
    });

    const metadata = Metadata.getOrCreateMetadata(handler.controllerClass);
    expect(
      metadata.userData[
        handler.controllerClass.name + "." + handler.methodName + ".0"
      ],
    ).toEqual({ isQuery: true });

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
