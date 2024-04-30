import { ServerRequest } from "../request";
import type { ParserAndValidator } from "../types";
import { MethodParameter } from "./method-parameter.decorator";

/* 属性/参数装饰器。为被装饰者注入请求体 */
export function ReqBody(option?: ParserAndValidator) {
  return MethodParameter({
    ...option,
    typeValueGetter: (container) => container.getValue(ServerRequest).body,
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isBody: true,
      }),
  });
}
