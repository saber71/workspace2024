import { Container } from "dependency-injection";
import { getOrCreateControllerMethod } from "./common";

/* 保存一个路由对应的Controller和方法。能够执行方法并返回结果 */
export class RouteHandler<Controller extends object = object> {
  constructor(
    readonly controller: Controller,
    readonly methodName: string,
  ) {}

  /**
   * 执行方法
   * @param container 依赖注入容器
   */
  call(container: Container) {
    const controllerMethod = getOrCreateControllerMethod(
      this.controller.constructor,
      this.methodName,
    );
    return (container as any)[this.methodName](
      ...controllerMethod.paramtypes.map(
        (type, index) =>
          controllerMethod.paramGetters[index]?.(container) ??
          container.getValue(type),
      ),
    );
  }
}
