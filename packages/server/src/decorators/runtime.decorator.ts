import { RUNTIME } from "../constant";
import { MethodParameter } from "./method-parameter.decorator";

/* 属性/参数装饰器。*/
export function Runtime() {
  return MethodParameter({
    typeValueGetter: (container) => container.getValue(RUNTIME),
    afterExecute: (metadata, ...args) =>
      (metadata.userData[args.join(".")] = {
        isRuntime: true,
      }),
  });
}
