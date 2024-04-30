import { ServerRequest } from "../request";
import type { ParserAndValidator } from "../types";
import { MethodParameter } from "./method-parameter.decorator";

/* 属性/参数装饰器。为被装饰者注入请求参数 */
export function ReqQuery(option?: ParserAndValidator) {
  return MethodParameter({
    ...option,
    typeValueGetter: (container) => container.getValue(ServerRequest).query,
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isQuery: true,
      }),
  });
}
