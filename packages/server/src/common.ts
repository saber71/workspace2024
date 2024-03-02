import { validate as classValidate } from "class-validator";
import {
  type Container,
  Metadata,
  NotExistLabelError,
} from "dependency-injection";
import {
  NotFoundValidatorError,
  ServerError,
  ValidateFailedError,
} from "./errors";

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

/**
 * 验证指定的数据
 * @throws NotFoundValidatorError 当找不到类型对应的验证器时抛出
 * @throws ValidateFailedError 当数据验证失败时抛出
 */
export async function validate(
  container: Container,
  target: any,
  methodName: string,
  argIndex: number,
  value: any,
) {
  const metadata = Metadata.getOrCreateMetadata(target);
  const parameterTypes = metadata.getMethodParameterTypes(methodName);
  const type = parameterTypes.types[argIndex];
  try {
    const instance = container.getValue(type) as any;
    const errors = await classValidate(Object.assign(instance, value));
    if (errors.length)
      throw new ValidateFailedError(
        errors.map((err) => err.toString()).join("\n"),
      );
  } catch (e) {
    if (e instanceof NotExistLabelError)
      throw new NotFoundValidatorError(`找不到类型${type}对应的验证器`);
    throw e;
  }
}
