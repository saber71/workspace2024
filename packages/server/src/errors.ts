/* server自定义错误的根类型 */
export class ServerError extends Error {
  code = 500;
}

/* 当出现路由重复时抛出 */
export class DuplicateRouteHandlerError extends ServerError {}

/* 当找不到路由对应的控制器方法时抛出 */
export class NotFoundRouteHandlerError extends ServerError {
  code = 404;
}

/* 当在ServerRequest对象中找不到指定字段的文件时抛出 */
export class NotFoundFileError extends ServerError {}

/* 当不恰当的使用装饰器时抛出 */
export class ImproperDecoratorError extends ServerError {}

/* 当在session上找不到key时抛出 */
export class SessionKeyNotExistError extends ServerError {}

/* 当根据类型名找不到对应的验证器时抛出 */
export class NotFoundValidatorError extends ServerError {}

/* 当数据验证失败时抛出 */
export class ValidateFailedError extends ServerError {}
