/* 类的定义 */
declare type Class<T = any, P extends Array = Array<any>> = {
  new (...args: P): T;
};

/* 抽取出Promise泛型类型*/
declare type ExtractPromiseGenericType<T> = T extends Promise<infer U> ? U : T;
