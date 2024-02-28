import { ServerError } from "./common";

/* 保存和查找路由和对应的控制器方法 */
export namespace ControllerManager {
  const urlMapRouteHandler = new Map<string, RouteHandlerSet>();

  /**
   * 保存路由及其控制器方法
   * @throws DuplicateRouteHandlerError 当出现路由重复时抛出
   */
  export function register(
    type: MethodType,
    url: string,
    controllerClass: Class,
    methodName: string,
  ) {
    let handler = urlMapRouteHandler.get(url);
    if (!handler) urlMapRouteHandler.set(url, (handler = {}));
    if (handler[type])
      throw new DuplicateRouteHandlerError(
        `${type}:${url}的路由处理方法出现重复`,
      );
    handler[type] = {
      controllerClass,
      methodName,
    };
  }

  /**
   * 查找路由对应的控制器方法
   * @throws NotFoundRouteHandlerError 当找不到路由对应的控制器方法时抛出
   */
  export function getRouteHandler(methodType: MethodType, url: string) {
    const handler = urlMapRouteHandler.get(url)?.[methodType];
    if (!handler) throw new NotFoundRouteHandlerError();
    return handler;
  }

  /* 当出现路由重复时抛出 */
  export class DuplicateRouteHandlerError extends ServerError {}

  /* 当找不到路由对应的控制器方法时抛出 */
  export class NotFoundRouteHandlerError extends ServerError {}
}
