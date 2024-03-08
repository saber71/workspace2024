import { Injectable } from "dependency-injection";
import { getOrCreateMetadataUserData } from "../common";
import { MODULE_NAME } from "../constant";

/* 标识该类为路由守卫 */
export function Guard() {
  const injectable = Injectable({ singleton: true, moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__classType = "guard";
  };
}
