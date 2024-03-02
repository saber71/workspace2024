import { ResponseBodySender } from "./decorators";
import { ServerResponse } from "./response";

/* 将要返回的响应体内容 */
export class ResponseBody {
  /* 从Error对象生成响应体内容 */
  static fromError(error: Error): ResponseBody {
    return new ResponseBody({}, false, (error as any).code, error.message);
  }

  /* 从值生成响应体内容 */
  static from(value: any): ResponseBody {
    if (value instanceof Error) return this.fromError(value);
    else if (value instanceof ResponseBody) return value;
    return new ResponseBody(value);
  }

  static fromFilePath(filePath: string): ResponseBody {
    return this.from({ filePath, __isFilePath__: true });
  }

  constructor(
    readonly object: any,
    readonly success: boolean = true,
    readonly code: number = 200,
    readonly msg: string = "ok",
  ) {}
}

/* 使用该类处理需要发送的内容 */
@ResponseBodySender()
export class RegularResponseBodySender implements ResponseBodySenderInterface {
  send(value: any, res: ServerResponse) {
    const responseBody = ResponseBody.from(value);
    res.statusCode = responseBody.code;
    if (responseBody.object?.__isFilePath__)
      return res.sendFile(responseBody.object.filePath);
    else res.body(responseBody);
  }
}
