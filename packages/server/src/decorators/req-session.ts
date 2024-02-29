import { Inject } from "dependency-injection";
import { ServerRequest } from "../request";

/* 属性/参数装饰器。为被装饰者注入session对象 */
export function ReqSession() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerRequest).session,
  });
}
