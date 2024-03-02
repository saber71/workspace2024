import { Injectable } from "dependency-injection";
import { getOrCreateMetadataUserData } from "../common";
import { MODULE_NAME } from "../constant";

/* 类装饰器。标识类的实例是错误处理器。单例。 */
export function ErrorHandler<T extends Error>(errorClass: Class<T>) {
  const injectable = Injectable({ singleton: true, moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__classType = "error-handler";
    userData.__server__handle_error_type = errorClass;
  };
}
