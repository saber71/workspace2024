/* 收集类的元信息，包括字段类型、构造函数入参类型 */
export class Metadata {
  /* 类名映射Metadata对象，如果存在子类，会用子类的Metadata对象合并父类的Metadata对象 */
  private static readonly _classNameMapMetadata = new Map<string, Metadata>();

  /* 判断给定的类是否是js的内置类型 */
  static isBasicType(type: Class) {
    return !!{
      Object: true,
      String: true,
      Boolean: true,
      Number: true,
      Symbol: true,
      Array: true,
      Function: true,
      Date: true,
      Set: true,
      Map: true,
      WeakSet: true,
      WeakMap: true,
    }[type.name];
  }

  /* 获取所有的Metadata对象 */
  static getAllMetadata() {
    return this._classNameMapMetadata.values();
  }

  /**
   * 获取类对应的Metadata对象，如果对象不存在就新建一个。在新建Metadata对象的时候，子类的Metadata对象会合并父类的Metadata对象
   * @param clazzOrPrototype 可以是类或是类的原型
   */
  static getOrCreateMetadata(clazzOrPrototype: Class | object) {
    let clazz: Class;
    if (typeof clazzOrPrototype === "object")
      clazz = clazzOrPrototype.constructor as Class;
    else clazz = clazzOrPrototype;
    let metadata = this._classNameMapMetadata.get(clazz.name);
    if (!metadata) {
      this._classNameMapMetadata.set(
        clazz.name,
        (metadata = new Metadata(clazz)),
      );
      let p = Object.getPrototypeOf(clazz);
      let merged = false;
      while (p?.name) {
        metadata.parentClassNames.push(p.name);
        if (!merged) {
          let parentMetadata = this._classNameMapMetadata.get(p.name);
          if (parentMetadata && parentMetadata !== metadata) {
            merged = true;
            metadata._merge(parentMetadata);
          }
        }
        p = Object.getPrototypeOf(p);
      }
    }
    return metadata;
  }

  constructor(readonly clazz: Class) {}

  /* 标识类是否已被装饰器Injectable装饰 */
  injectable = false;

  /* 类所属的模块 */
  moduleName?: string;

  /* 类是否是单例的 */
  singleton?: boolean;

  /* 类是否立即实例化 */
  createImmediately?: boolean;

  /* 标记该类的构造函数入参类型是否是从父类复制的 */
  copiedConstructorParams = false;

  /* 当Injectable装饰的类生成实例时调用 */
  onCreate?: (instance: object) => void;

  /* 保存方法的入参类型。key为方法名 */
  readonly methodNameMapParameterTypes: Record<string, MethodParameterTypes> =
    {};

  /* 字段名映射其类型名 */
  private _fieldTypes: Record<string, FieldType> = {};
  get fieldTypes(): Record<string, FieldType> {
    return this._fieldTypes;
  }

  /* 父类的名字 */
  readonly parentClassNames: string[] = [];

  /* 保存用户自定义数据 */
  private _userData: Record<string, any> = {};
  get userData() {
    return this._userData;
  }

  /* 根据方法名获取保存了入参类型的数据结构 */
  getMethodParameterTypes(
    methodName: string = "_constructor",
  ): MethodParameterTypes {
    if (methodName === "constructor") methodName = "_" + methodName;
    if (!this.methodNameMapParameterTypes[methodName])
      this.methodNameMapParameterTypes[methodName] = {
        types: [],
        getters: {},
      };
    return this.methodNameMapParameterTypes[methodName];
  }

  /* 合并父类的Metadata内容 */
  private _merge(parent: Metadata) {
    /* 复制父类的段类型 */
    this._fieldTypes = Object.assign({}, parent._fieldTypes, this._fieldTypes);

    /* 复制父类的用户数据 */
    this._userData = Object.assign({}, parent._userData, this._userData);

    /* 复制父类的构造函数入参类型。因为如果子类没有声明构造函数，通过元数据就拿不到正确的入参类型 */
    const parentConstructorParamTypes =
      parent.methodNameMapParameterTypes._constructor;
    if (parentConstructorParamTypes) {
      this.copiedConstructorParams = true;
      this.methodNameMapParameterTypes._constructor = {
        types: parentConstructorParamTypes.types.slice(),
        getters: Object.assign({}, parentConstructorParamTypes.getters),
      };
      console.log("merge", this.clazz.name, parentConstructorParamTypes);
    }
    return this;
  }
}
