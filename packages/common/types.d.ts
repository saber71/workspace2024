/* 类的定义 */
declare type Class<T = any, P extends Array<any> = Array<any>> = {
  new (...args: P): T;
};

/* 抽取出Promise泛型类型*/
declare type ExtractPromiseGenericType<T> = T extends Promise<infer U> ? U : T;

declare type DeepCloneOption = Partial<{
  cloneMapKey: boolean;
}>;

declare type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array
  | Float64Array;
