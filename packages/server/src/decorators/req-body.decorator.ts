import { ServerRequest } from "../request";
import { ParserAndValidate } from "./parser-and-validate.decorator";

/* 属性/参数装饰器。为被装饰者注入请求体 */
export function ReqBody(option?: ParserAndValidator) {
  return ParserAndValidate({
    ...option,
    typeValueGetter: (container) => container.getValue(ServerRequest).body,
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isBody: true,
      }),
  });
}
