import {
  Injectable,
  type MethodParameterOption,
  type Class,
} from "dependency-injection";
import { getOrCreateMetadataUserData } from "../common";
import { composeUrl } from "common";
import { MODULE_NAME } from "../constant";
import { RouteManager } from "../route-manager";

/* 类装饰器。标识类的实例为控制器，单例，系统初始化时创建 */
export function Controller(
  option?: { routePrefix?: string } & MethodParameterOption,
) {
  const injectable = Injectable({
    createImmediately: true,
    singleton: true,
    moduleName: MODULE_NAME,
    paramtypes: option?.paramtypes,
    paramGetters: option?.paramGetters,
  });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__classType = "controller";
    userData.__server__controllerRoutePrefix = option?.routePrefix ?? "";
    for (let methodName in userData.__server__controllerMethods) {
      const method = userData.__server__controllerMethods[methodName];
      RouteManager.register(
        method.type,
        composeUrl(
          userData.__server__controllerRoutePrefix,
          method.routePrefix,
          method.route,
        ),
        clazz,
        methodName,
      );
    }
  };
}
