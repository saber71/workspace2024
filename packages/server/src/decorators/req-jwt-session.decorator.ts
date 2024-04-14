import { Inject } from "dependency-injection";
import { JwtSession } from "../session";

/* 属性/参数装饰器。为被装饰者注入JwtSession对象 */
export function ReqJwtSession() {
  return Inject({
    typeValueGetter: (container) => container.getValue(JwtSession),
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isSession: true,
      }),
  });
}
