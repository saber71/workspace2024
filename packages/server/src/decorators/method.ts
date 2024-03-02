import { getDecoratedName, Inject } from "dependency-injection";
import { getOrCreateControllerMethod } from "../common";

/* 方法装饰器。标识此方法用来处理路由。只有在类上装饰了Controller装饰器时才会生效 */
export function Method(
  option?: Partial<Pick<ControllerMethod, "route" | "routePrefix" | "type">> &
    MethodParameterOption,
) {
  const inject = Inject({
    paramtypes: option?.paramtypes,
    paramGetters: option?.paramGetters,
  });
  return (target: any, methodName?: any) => {
    methodName = getDecoratedName(methodName);
    inject(target, methodName);
    const ctrMethod = getOrCreateControllerMethod(target, methodName);
    if (option?.type) ctrMethod.type = option.type;
    if (option?.route) ctrMethod.route = option.route;
    if (option?.routePrefix) ctrMethod.routePrefix = option.routePrefix;
  };
}
