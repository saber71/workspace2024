import { Metadata } from "dependency-injection";
import { ServerError } from "./errors";

/* 组装url */
export function composeUrl(...items: string[]) {
  return (
    "/" +
    items
      .map(removeHeadTailSlash)
      .filter((str) => str.length > 0)
      .join("/")
  );
}

/* 删除头尾的斜线 */
export function removeHeadTailSlash(str: string) {
  while (str[0] === "/") str = str.slice(1);
  while (str[str.length - 1] === "/") str = str.slice(0, str.length - 1);
  return str;
}

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
