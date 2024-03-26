import { Inject } from "dependency-injection";
import { ServerRequest } from "../request";
import { ServerResponse } from "../response";
import { Session } from "../session";

/* 属性/参数装饰器。为被装饰者注入session对象 */
export function ReqSession() {
  return Inject({
    typeValueGetter: (container) =>
      new Session(
        container.getValue<ServerRequest>(ServerRequest),
        container.getValue<ServerResponse>(ServerResponse),
      ),
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isSession: true,
      }),
  });
}
