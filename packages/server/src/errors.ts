/* server自定义错误的根类型 */
export class ServerError extends Error {
  code = 500;
  name = "ServerError";
  logLevel: LogLevel = "error";
}

/* 当请求不具备权限时抛出 */
export class UnauthorizedError extends ServerError {
  code = 401;
  name = "UnauthorizedError";
  logLevel = "warn";
}

/* 当找不到路由时抛出 */
export class NotFoundError extends ServerError {
  code = 404;
  name = "NotFoundError";
}

/* 当找不到数据时抛出 */
export class NotFoundObjectError extends ServerError {
  code = 200;
  name = "NotFoundObjectError";
}

/* 当出现路由重复时抛出 */
export class DuplicateRouteHandlerError extends ServerError {
  name = "DuplicateRouteHandlerError";
}

/* 当找不到路由对应的控制器方法时抛出 */
export class NotFoundRouteHandlerError extends ServerError {
  code = 404;
  name = "NotFoundRouteHandlerError";
}

/* 当在ServerRequest对象中找不到指定字段的文件时抛出 */
export class NotFoundFileError extends ServerError {
  name = "NotFoundFileError";
}

/* 当不恰当的使用装饰器时抛出 */
export class ImproperDecoratorError extends ServerError {
  name = "ImproperDecoratorError";
}

/* 当在session上找不到key时抛出 */
export class SessionKeyNotExistError extends ServerError {
  name = "SessionKeyNotExistError";
}

/* 当根据类型名找不到对应的验证器时抛出 */
export class NotFoundValidatorError extends ServerError {
  name = "NotFoundValidatorError";
}

/* 当数据验证失败时抛出 */
export class ValidateFailedError extends ServerError {
  name = "ValidateFailedError";
}

/* 当数据转换失败时抛出 */
export class ParseFailedError extends ServerError {
  name = "ParseFailedError";
}
