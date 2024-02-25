/* 收集类的元信息，包括字段类型、构造函数入参类型 */
export class Metadata {
  /* 类名映射Metadata对象，如果存在子类，会用子类的Metadata对象合并父类的Metadata对象 */
  private static readonly _classNameMapMetadata = new Map<string, Metadata>();

  /*
   * 获取类对应的Metadata对象，如果对象不存在就新建一个。在新建Metadata对象的时候，子类的Metadata对象会合并父类的Metadata对象
   * 入参可以是类或是类的原型
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
      while (p?.name) {
        metadata.parentClassNames.push(p.name);
        let parentMetadata = this._classNameMapMetadata.get(p.name);
        if (parentMetadata && parentMetadata !== metadata)
          metadata.merge(parentMetadata);
        p = Object.getPrototypeOf(p);
      }
    }
    return metadata;
  }

  constructor(readonly clazz: Class) {}

  /* 标识类是否已被装饰器Injectable装饰 */
  injectable = false;

  /* 构造函数所有参数的类型 */
  readonly constructorParameterTypes: string[] = [];

  /* 字段名映射其类型名 */
  fieldTypes: Record<string, string> = {};

  /* 父类的名字 */
  readonly parentClassNames: string[] = [];

  /* 合并父类的Metadata内容 */
  merge(parent: Metadata) {
    this.fieldTypes = Object.assign({}, parent.fieldTypes, this.fieldTypes);
    return this;
  }
}
