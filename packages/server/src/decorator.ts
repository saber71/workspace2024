import "reflect-metadata";
import {
  type Container,
  getDecoratedName,
  Inject,
  Injectable,
} from "dependency-injection";
import {
  composeUrl,
  getOrCreateControllerMethod,
  getOrCreateMetadataUserData,
} from "./common";
import { MODULE_NAME } from "./constant";
import { ControllerManager } from "./controller-manager";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";

export function ErrorHandler<T extends Error>(errorClass: Class<T>) {
  const injectable = Injectable({ singleton: true, moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__isErrorHandler = true;
    userData.__server__handle_error_type = errorClass;
  };
}

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
    userData.__server__isController = true;
    userData.__server__controllerRoutePrefix = option?.routePrefix ?? "";
    for (let methodName in userData.__server__controllerMethods) {
      const method = userData.__server__controllerMethods[methodName];
      ControllerManager.register(
        method.methodType,
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

export function Method(
  option?: {
    type: MethodType;
    routePrefix?: string;
    route?: string;
  } & MethodParameterOption,
) {
  const inject = Inject({
    paramtypes: option?.paramtypes,
    paramGetters: option?.paramGetters,
  });
  return (target: any, methodName?: any) => {
    methodName = getDecoratedName(methodName);
    inject(target, methodName);
    const ctrMethod = getOrCreateControllerMethod(target, methodName);
    if (option?.type) ctrMethod.methodType = option.type;
    if (option?.route) ctrMethod.route = option.route;
    if (option?.routePrefix) ctrMethod.routePrefix = option.routePrefix;
  };
}

export function Req() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerRequest),
  });
}

export function Res() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerResponse),
  });
}

export function ReqBody() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerRequest).body,
  });
}

export function ReqQuery() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerRequest).query,
  });
}

export function ReqSession() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerRequest).session,
  });
}

export function ReqFile(fieldName: string) {
  return Inject({
    typeValueGetter: (container: Container) => {
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
  return Inject({
    typeValueGetter: (container: Container) => {
      const request = container.getValue(ServerRequest);
      if (!request.files) throw new NotFoundFileError();
      const files = request.files[fieldName];
      if (!files) throw new NotFoundFileError();
      if (files instanceof Array) return files;
      throw new ImproperDecoratorError();
    },
  });
}

export function Pipeline() {
  const injectable = Injectable({ moduleName: MODULE_NAME });
  return (clazz: Class, _?: any) => {
    injectable(clazz, _);
    const userData = getOrCreateMetadataUserData(clazz);
    userData.__server__isPipeline = true;
  };
}

export class NotFoundFileError extends Error {}

export class ImproperDecoratorError extends Error {}
