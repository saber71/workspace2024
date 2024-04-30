import { isTypedArray } from "./isTypedArray";
import type { TypedArray } from "./types";

export function deepAssign<T extends object>(dst: any, src: T): T {
  if (typeof dst !== "object" || !dst) return src;
  if (dst.constructor !== src.constructor) return src;
  if (dst instanceof Date) dst.setTime((src as Date).getTime());
  else if (src instanceof Map) {
    const dstMap = dst as Map<any, any>;
    src.forEach((value, key) => {
      dstMap.set(key, deepAssign(dstMap.get(key), value));
    });
  } else if (src instanceof Set) {
    const dstSet = dst as Set<any>;
    src.forEach((value) => dstSet.add(value));
  } else if (isTypedArray(src)) {
    const dstTypedArray = dst as TypedArray;
    const len = Math.min(src.length, dstTypedArray.length);
    for (let i = 0; i < len; i++) {
      dstTypedArray[i] = src[i];
    }
  } else {
    for (let key in src) {
      const value = src[key];
      dst[key] = deepAssign((dst as any)[key], value as any);
    }
  }
  return dst;
}
