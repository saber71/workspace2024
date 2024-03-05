import { ServerRequest } from "../request";
import { ParserAndValidate } from "./parser-and-validate.decorator";

/* 属性/参数装饰器。为被装饰者注入请求参数 */
export function ReqQuery(option?: ParserAndValidator) {
  return ParserAndValidate({
    ...option,
    typeValueGetter: (container) => container.getValue(ServerRequest).query,
  });
}
