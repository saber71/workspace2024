import { Container } from "dependency-injection";
import { getOrCreateControllerMethod } from "./common";

/* 保存一个路由对应的Controller和方法。能够执行方法并返回结果 */
export class RouteHandler<Controller extends object = object> {
  constructor(
    readonly controller: Controller,
    readonly methodName: string,
  ) {}
}
