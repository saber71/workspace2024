import { Injectable } from "dependency-injection";
import { getOrCreateMetadataUserData } from "../common";
import { MODULE_NAME } from "../constant";

/* 类装饰器。标识此类的实例为管道。 */
export function Pipeline() {
  const injectable = Injectable({ moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__classType = "pipeline";
  };
}
