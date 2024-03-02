import { Injectable } from "dependency-injection";
import { getOrCreateMetadataUserData } from "../common";
import { MODULE_NAME } from "../constant";

/* 标识类用来处理需要返回的内容 */
export function ResponseBodySender() {
  const injectable = Injectable({
    singleton: true,
    moduleName: MODULE_NAME,
  });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__classType = "response-body-sender";
  };
}
