declare type Class<T = any> = { new (...args: any[]): T };

/* 容器内成员 */
declare interface ContainerMember {
  name: string;
  /* 只有通过装饰器Injectable装饰的类才会有此字段 */
  metadata?: import("src").Metadata;
  /* 访问时优先返回该值，若无值将依次尝试factory、getter */
  value?: any;
  /* 每次访问时都会执行生成一个新值 */
  factory?: () => any;
  /* 懒加载，只在第一次访问的时候执行 */
  getter?: () => any;
  /* getter生成的值会缓存在这里 */
  getterValue?: any;
}
