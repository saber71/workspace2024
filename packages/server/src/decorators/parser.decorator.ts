import { getDecoratedName, Injectable } from "dependency-injection";
import { getOrCreateMetadataUserData } from "../common";
import { MODULE_NAME } from "../constant";

/* 标识该类用来处理值的转换 */
export function Parser() {
  const injectable = Injectable({
    singleton: true,
    moduleName: MODULE_NAME,
  });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__classType = "parser";
  };
}

export function MarkParseType(...clazz: Array<Class | null | undefined>) {
  return (target: any, propName?: any) => {
    propName = getDecoratedName(propName);
    if (clazz.length === 0) {
      const type = (Reflect as any).getMetadata(
        "design:type",
        target,
        propName,
      );
      if (type) clazz = [type];
    }
    if (clazz.length === 0) throw new Error("Not found type");
    const userData = getOrCreateMetadataUserData(target);
    userData.__server__propParseToType[propName] = clazz;
  };
}

export function ToString() {
  return MarkParseType(String);
}

export function ToNumber() {
  return MarkParseType(Number);
}

export function ToArray(...valueClass: Class[]) {
  return MarkParseType(Array, ...valueClass);
}

export function ToSet(...valueClass: Class[]) {
  return MarkParseType(Set, ...valueClass);
}

export function ToMap(valueClass?: Class) {
  return MarkParseType(Map, valueClass);
}

export function ToBoolean() {
  return MarkParseType(Boolean);
}

export function ToObject() {
  return MarkParseType(Object);
}

export function ToDate() {
  return MarkParseType(Date);
}

export function ToRegExp() {
  return MarkParseType(RegExp);
}
