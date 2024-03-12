import { Inject } from "dependency-injection";
import { ServerResponse } from "../response";

/* 属性/参数装饰器。为被装饰者注入ServerResponse实例 */
export function Res() {
  return Inject({
    typeValueGetter: (container) => container.getValue(ServerResponse),
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isRes: true,
      }),
  });
}
