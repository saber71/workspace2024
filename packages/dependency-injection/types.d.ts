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
  /* 指定factory的this */
  factoryContext?: any;
  /* 懒加载，只在第一次访问的时候执行 */
  getter?: () => any;
  /* 指定getter的this */
  getterContext?: any;
  /* getter生成的值会缓存在这里 */
  getterValue?: any;
  /* 标识是否是从父容器继承来 */
  isExtend?: boolean;
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

  beforeCallMethods: InjectOptions["beforeCallMethod"][];
  afterCallMethods: InjectOptions["afterCallMethod"][];
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

declare interface InjectOptions extends MethodParameterOption {
  typeLabel?: string;
  typeValueGetter?: TypeValueGetter;
  afterExecute?: (
    metadata: import("src").Metadata,
    className: string,
    ...args: Array<string | number>
  ) => void;
  beforeCallMethod?: (
    container: import("src").Container,
    metadata: import("src").Metadata,
    args: any[],
  ) => void | Promise<void>;
  afterCallMethod?: (
    container: import("src").Container,
    metadata: import("src").Metadata,
    returnValue: any,
    args: any[],
    error?: Error,
  ) => any | Promise<any>;
}

declare interface InjectableOptions extends MethodParameterOption {
  /* 指定类所属的模块名 */
  moduleName?: string;
  /* 指定类是否是单例的 */
  singleton?: boolean;
  /* 类是否立即实例化 */
  createImmediately?: boolean;
  /* 默认true。是否可以用子类的元数据中的入参类型覆盖从父类继承来的类型信息。当子类没有改变父类的构造函数入参类型时，就应该将该字段设为false */
  overrideConstructor?: boolean;
  onCreate?: (instance: object) => void;
}
