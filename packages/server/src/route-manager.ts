import {
  DuplicateRouteHandlerError,
  NotFoundRouteHandlerError,
} from "./errors";

/* 保存和查找路由和对应的控制器方法 */
export namespace RouteManager {
  const urlMapRouteHandlerSet = new Map<string, RouteHandlerSet>();

  /* 获取所有路由url */
  export function getUrls() {
    return urlMapRouteHandlerSet.keys();
  }

  /**
   * 获取url对应的请求类型
   * @throws NotFoundRouteHandlerError 当找不到url对应的RouteHandler时抛出
   */
  export function getMethodTypes(url: string): Set<MethodType> {
    const set = new Set<MethodType>();
    const routeHandlerSet = urlMapRouteHandlerSet.get(url);
    if (!routeHandlerSet)
      throw new NotFoundRouteHandlerError(`${url} Not Found route handler`);
    Object.keys(routeHandlerSet).forEach((methodType) =>
      set.add(methodType as MethodType),
    );
    return set;
  }

  /**
   * 保存路由url及其控制器方法
   * @throws DuplicateRouteHandlerError 当路由出现重复时抛出
   */
  export function register(
    type: MethodType,
    url: string,
    controllerClass: Class,
    methodName: string,
  ) {
    let handler = urlMapRouteHandlerSet.get(url);
    if (!handler) urlMapRouteHandlerSet.set(url, (handler = {}));
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
   * 查找路由url对应的控制器方法
   * @throws NotFoundRouteHandlerError 当找不到路由对应的控制器方法时抛出
   */
  export function getRouteHandler(
    methodType: MethodType,
    url: string,
  ): RouteHandler {
    const handler = urlMapRouteHandlerSet.get(url)?.[methodType];
    if (!handler)
      throw new NotFoundRouteHandlerError(
        `${methodType}:${url} Not Found route handler`,
      );
    return handler;
  }
}
