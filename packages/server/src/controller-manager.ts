import { ServerError } from "./common";

export namespace ControllerManager {
  const urlMapRouteHandler = new Map<string, RouteHandlerSet>();

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

  export function getRouteHandler(methodType: MethodType, url: string) {
    const handler = urlMapRouteHandler.get(url)?.[methodType];
    if (!handler) throw new NotFoundRouteHandlerError();
    return handler;
  }

  export class DuplicateRouteHandlerError extends ServerError {}

  export class NotFoundRouteHandlerError extends ServerError {}
}
