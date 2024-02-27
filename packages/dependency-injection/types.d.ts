declare type Class<T = any> = { new (...args: any[]): T };

/* 容器内成员 */
declare interface ContainerMember {
  name: string;
  /* 只有通过装饰器Injectable装饰的类才会有此字段 */
  metadata?: import("src").Metadata;
  /* 访问时优先返回该值，若无值将依次尝试factory、getter */
  value?: any;
  /* 每次访问时都会执行生成一个新值 */
  factory?: (...args: any[]) => any;
  /* 懒加载，只在第一次访问的时候执行 */
  getter?: () => any;
  /* getter生成的值会缓存在这里 */
  getterValue?: any;
}

/* 加载被装饰器Injectable装饰过的内容时可用的选项 */
declare interface LoadOption {
  /* 指定要被加载的模块，与装饰器Injectable入参中的moduleName相同 */
  moduleName?: string;

  /* 默认true。是否让子类覆盖父类的实例。如果为true，则通过父类名字拿到的，并非是其自身的实例，而是子类的实例 */
  overrideParent?: boolean;
}

/* 自定义获取值的getter函数 */
declare type TypeValueGetter = (container: import("src").Container) => any;

/* 保存方法入参类型信息 */
declare interface MethodParameterTypes {
  /* 入参类型 */
  types: string[];

  /* 对应序号入参的自定义getter函数 */
  getters: Record<number, TypeValueGetter>;
}

/* 定义一个可以指定入参类型和自定义入参获取方式的getter函数 */
declare interface MethodParameterOption {
  /* 指定对应序号的入参类型 */
  paramtypes?: Record<number, string> | Array<string>;

  /* 指定对应序号的入参获取getter函数 */
  paramGetters?: Record<number, TypeValueGetter> | Array<TypeValueGetter>;
}

/* 保存字段的类型信息 */
declare interface FieldType {
  /* 字段类型 */
  type?: string;

  /* 字段值的获取getter函数 */
  getter?: TypeValueGetter;
}
