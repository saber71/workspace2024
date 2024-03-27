import { Inject } from "dependency-injection";
import { Session } from "../session";

/* 属性/参数装饰器。为被装饰者注入session对象 */
export function ReqSession() {
  return Inject({
    typeValueGetter: (container) => container.getValue(Session),
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isSession: true,
      }),
  });
}
