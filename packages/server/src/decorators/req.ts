import { Inject } from "dependency-injection";
import { ServerRequest } from "../request";

/* 属性/参数装饰器。为被装饰者注入ServerRequest实例 */
export function Req() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerRequest),
  });
}
