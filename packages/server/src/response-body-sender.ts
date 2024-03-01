import { Injectable } from "dependency-injection";
import { ServerResponse } from "./response";

/* 使用该类处理请求后发送内容 */
@Injectable()
export class ResponseBodySender implements ResponseBodySenderInterface {
  send(value: any, res: ServerResponse) {
    let success = true,
      code = 200,
      msg = "ok";
    if (value instanceof Error) {
      success = false;
      code = (value as any).code ?? 500;
      msg = value.message;
      console.error(value);
    }
    res.statusCode = code;
    res.body({
      code,
      success,
      msg,
      object: value,
    } satisfies RegularResponseBody);
  }
}
