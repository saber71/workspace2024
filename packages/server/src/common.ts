import { Metadata } from "dependency-injection";

export class ServerError extends Error {}

export function getOrCreateMetadataUserData(obj: any): MetadataServerUserData {
  const metadata = Metadata.getOrCreateMetadata(obj);
  const userData = metadata.userData as MetadataServerUserData;
  if (!userData.__server__) {
    userData.__server__ = true;
    userData.__server__isErrorHandler = false;
    userData.__server__isController = false;
    userData.__server__isPipeline = false;
    userData.__server__metadata = metadata;
    userData.__server__controllerRoutePrefix = "";
    userData.__server__controllerMethods = {};
    userData.__server__handle_error_type = ServerError;
  }
  return userData;
}

export function getOrCreateControllerMethod(
  target: any,
  methodName: string,
): ControllerMethod {
  const userData = getOrCreateMetadataUserData(target);
  let res = userData.__server__controllerMethods[methodName];
  if (!res) {
    res = {
      methodName,
      methodType: "GET",
      paramtypes: [],
      paramGetters: {},
      route: "",
      routePrefix: "",
    };
    /* parse findBuId to find-by-id */
    for (let i = 0; i < methodName.length; i++) {
      let char = methodName[i];
      if (/[A-Z]/.test(char)) {
        char = char.toLowerCase();
        if (i > 0) char = "-" + char;
      }
      res.route += char;
    }
    userData.__server__controllerMethods[methodName] = res;
  }
  return res;
}
