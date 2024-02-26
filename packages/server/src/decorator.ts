import "reflect-metadata";
import { getDecoratedName, Injectable } from "dependency-injection";
import {
  getOrCreateControllerMethod,
  getOrCreateMetadataUserData,
} from "./common";
import {
  MODULE_NAME,
  PARAMTYPES_REQUEST,
  PARAMTYPES_REQUEST_BODY,
  PARAMTYPES_REQUEST_QUERY,
  PARAMTYPES_RESPONSE,
} from "./constant";

export function Controller(option?: { routePrefix?: string }) {
  const injectable = Injectable({
    createImmediately: true,
    singleton: true,
    moduleName: MODULE_NAME,
  });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__isController = true;
    userData.__server__routePrefix = option?.routePrefix ?? "";
  };
}

export function Method(option?: {
  type: MethodType;
  routePrefix?: string;
  route?: string;
  paramtypes?: Record<number, string>;
}) {
  return (target: any, methodName?: any) => {
    methodName = getDecoratedName(methodName);
    const ctrMethod = getOrCreateControllerMethod(target, methodName);
    if (option?.type) ctrMethod.methodType = option.type;
    if (option?.route) ctrMethod.route = option.route;
    if (option?.routePrefix) ctrMethod.routePrefix = option.routePrefix;
    if (option?.paramtypes) {
      for (let index in option.paramtypes) {
        if (ctrMethod.paramtypes[index]) continue;
        ctrMethod.paramtypes[index] = option.paramtypes[index];
      }
    }
    const paramtypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      methodName,
    );
    if (paramtypes) {
      for (let i = 0; i < paramtypes.length; i++) {
        if (ctrMethod.paramtypes[i]) continue;
        ctrMethod.paramtypes[i] = paramtypes[i].name;
      }
    }
  };
}

export function ParamType(option: { label: string }) {
  return (target: any, methodName: any, index: number) => {
    methodName = getDecoratedName(methodName);
    const ctrMethod = getOrCreateControllerMethod(target, methodName);
    ctrMethod.paramtypes[index] = option.label;
  };
}

export function Req() {
  return ParamType({ label: PARAMTYPES_REQUEST });
}

export function Res() {
  return ParamType({ label: PARAMTYPES_RESPONSE });
}

export function ReqBody() {
  return ParamType({ label: PARAMTYPES_REQUEST_BODY });
}

export function ReqQuery() {
  return ParamType({ label: PARAMTYPES_REQUEST_QUERY });
}
