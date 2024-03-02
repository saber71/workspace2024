import { getOrCreateMetadataUserData } from "./common";
import { ServerError } from "./errors";

/* 错误处理器派发器，匹配Error对应的错误处理器 */
export class ErrorHandlerDispatcher {
  private readonly _errorHandlerClasses = new Array<ErrorHandlerClass>();

  constructor(customErrorHandlers: ErrorHandlerClass[]) {
    this._errorHandlerClasses.push(...customErrorHandlers);
    this._checkErrorHandlers();
  }

  /* 匹配Error对应的错误处理器 */
  dispatch(error: Error) {
    for (let errorHandlerClass of this._errorHandlerClasses) {
      const userData = getOrCreateMetadataUserData(errorHandlerClass);
      if (error instanceof userData.__server__handle_error_type)
        return errorHandlerClass;
    }
  }

  /* 检查现有的类是否都装饰ErrorHandler */
  private _checkErrorHandlers() {
    for (let errorHandlerClass of this._errorHandlerClasses) {
      const userData = getOrCreateMetadataUserData(errorHandlerClass);
      if (userData.__server__classType !== "error-handler")
        throw new ServerError(errorHandlerClass.name + "未装饰ErrorHandler");
    }
  }
}
