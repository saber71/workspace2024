import "reflect-metadata";
import {
  type Container,
  getDecoratedName,
  Injectable,
} from "dependency-injection";
import {
  getOrCreateControllerMethod,
  getOrCreateMetadataUserData,
} from "./common";
import {
  MODULE_NAME,
  PARAMTYPES_FILE,
  PARAMTYPES_FILES,
  PARAMTYPES_REQUEST,
  PARAMTYPES_REQUEST_BODY,
  PARAMTYPES_REQUEST_QUERY,
  PARAMTYPES_RESPONSE,
  PARAMTYPES_SESSION,
} from "./constant";
import { ServerRequest } from "./request";

export function ErrorHandler<T extends Error>(errorClass: Class<T>) {
  const injectable = Injectable({ singleton: true, moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__isErrorHandler = true;
    userData.__server__handle_error_type = errorClass;
  };
}

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
    userData.__server__controllerRoutePrefix = option?.routePrefix ?? "";
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

export function ParamType(option: {
  label: string;
  getter?: (container: Container) => any;
}) {
  return (target: any, methodName: any, index: number) => {
    methodName = getDecoratedName(methodName);
    const ctrMethod = getOrCreateControllerMethod(target, methodName);
    ctrMethod.paramtypes[index] = option.label;
    if (option.getter) ctrMethod.paramGetters[index] = option.getter;
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

export function ReqSession() {
  return ParamType({ label: PARAMTYPES_SESSION });
}

export function ReqFile(fieldName: string) {
  return ParamType({
    label: PARAMTYPES_FILE,
    getter: (container: Container) => {
      const request = container.getValue(ServerRequest);
      if (!request.files) throw new NotFoundFileError();
      const files = request.files[fieldName];
      if (!files) throw new NotFoundFileError();
      if (files instanceof Array) throw new ImproperDecoratorError();
      return files;
    },
  });
}

export function ReqFiles(fieldName: string) {
  return ParamType({
    label: PARAMTYPES_FILES,
    getter: (container: Container) => {
      const request = container.getValue(ServerRequest);
      if (!request.files) throw new NotFoundFileError();
      const files = request.files[fieldName];
      if (!files) throw new NotFoundFileError();
      if (files instanceof Array) return files;
      throw new ImproperDecoratorError();
    },
  });
}

export class NotFoundFileError extends Error {}

export class ImproperDecoratorError extends Error {}

export function Pipeline() {
  const injectable = Injectable({ moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__isPipeline = true;
  };
}
