import { Metadata } from "dependency-injection";
import { ServerError } from "./errors";

/* 得到或新建专给server库使用的userData */
export function getOrCreateMetadataUserData(obj: any): MetadataServerUserData {
  const metadata = Metadata.getOrCreateMetadata(obj);
  const userData = metadata.userData as MetadataServerUserData;
  if (!userData.__server__) {
    userData.__server__ = true;
    userData.__server__classType = "no-special";
    userData.__server__controllerRoutePrefix = "";
    userData.__server__controllerMethods = {};
    userData.__server__handle_error_type = ServerError;
  }
  return userData;
}

/* 得到或新建控制器方法信息对象 */
export function getOrCreateControllerMethod(
  target: any,
  methodName: string,
): ControllerMethod {
  const userData = getOrCreateMetadataUserData(target);
  let res = userData.__server__controllerMethods[methodName];
  if (!res) {
    res = {
      methodName,
      type: "GET",
      route: "",
      routePrefix: "",
    };
    /* parse findById to find-by-id */
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
