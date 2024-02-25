import { Metadata } from "./metadata";

/**
 * 用来管理需要进行依赖注入的实例的容器
 * @throws DependencyCycleError 当依赖循环时抛出
 */
export class Container {
  /* 标识是否调用过load方法 */
  private _loaded = false;

  /* 缓存容器中的内容，名字映射Member对象 */
  private readonly _memberMap = new Map<string, ContainerMember>();

  /* 父容器。在当前容器中找不到值时，会尝试在父容器中寻找 */
  private _extend?: Container;

  /* 设置要继承的父容器。当从容器中找不到值时，会尝试在父容器中寻找 */
  extend(parent?: Container) {
    this._extend = parent;
    return this;
  }

  /**
   * 加载所有已被装饰器Injectable装饰的类且所属于指定的模块
   * @param option.moduleName 可选。指定要被加载的模块，与装饰器Injectable入参中的moduleName相同
   * @param option.overrideParent 默认true。是否让子类覆盖父类的实例。如果为true，则通过父类名字拿到的，并非是其自身的实例，而是子类的实例
   * @throws ContainerRepeatLoadError 当重复调用Container.load方法时抛出
   */
  load(option: { moduleName?: string; overrideParent?: boolean } = {}) {
    if (this._loaded)
      throw new ContainerRepeatLoadError(
        "Container.load方法已被调用过，不能重复调用",
      );
    this._loaded = true;
    const { overrideParent = true, moduleName } = option;
    const metadataArray = Array.from(Metadata.getAllMetadata()).filter(
      (metadata) =>
        !moduleName ||
        !metadata.moduleName ||
        metadata.moduleName === moduleName,
    );
    for (let item of metadataArray) {
      this._newMember(item.clazz.name, item);
    }
    if (overrideParent) {
      for (let item of metadataArray) {
        const member = this._memberMap.get(item.clazz.name)!;
        /* 如果Member已被覆盖就跳过。可能是因为metadata顺序的原因，子类顺序先于父类 */
        if (member.name !== item.clazz.name) continue;
        for (let parentClassName of item.parentClassNames) {
          this._memberMap.set(parentClassName, member);
        }
      }
    }
    const createImmediately: ContainerMember[] = [];
    const creating = new Set<string>();
    for (let member of this._memberMap.values()) {
      const { metadata } = member;
      if (metadata) {
        const { clazz, fieldTypes } = metadata;
        const generator = () => {
          if (creating.has(member.name))
            throw new DependencyCycleError(
              "依赖循环：" + Array.from(creating).join("->") + member.name,
            );
          creating.add(member.name);
          const instance = new clazz(
            ...metadata.constructorParameterTypes.map((label: string) =>
              this.getValue(label),
            ),
          );
          for (let propName in fieldTypes) {
            instance[propName] = this.getValue(fieldTypes[propName]);
          }
          creating.delete(member.name);
          return instance;
        };
        if (metadata.createImmediately) createImmediately.push(member);
        if (metadata.singleton) member.getter = generator;
        else member.factory = generator;
      }
    }
    for (let member of createImmediately) {
      this.getValue(member.name);
    }
  }

  /**
   * 给指定的标识符绑定值
   * @param label 标识符
   * @param value 指定的值
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   */
  bindValue(label: string, value: any) {
    if (value === undefined)
      throw new InvalidValueError("绑定的值不能是undefined");
    let member = this._memberMap.get(label);
    if (!member) member = this._newMember(label);
    member.value = value;
    return this;
  }

  /* 给指定的标识符绑定一个工厂函数，在每次访问时生成一个新值 */
  bindFactory(label: string, value: () => any) {
    let member = this._memberMap.get(label);
    if (!member) member = this._newMember(label);
    member.factory = value;
    return this;
  }

  /* 给指定的标识符绑定一个getter，只在第一次访问时执行 */
  bindGetter(label: string, value: () => any) {
    let member = this._memberMap.get(label);
    if (!member) member = this._newMember(label);
    member.getter = value;
    member.getterValue = undefined;
    return this;
  }

  /* 解绑指定的标识符 */
  unbind(label: string) {
    this._memberMap.delete(label);
    return this;
  }

  /**
   * 获取指定标识符的值
   * @param label 要获取值的标识符
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
   */
  getValue<T>(label: string | Class<T>): T {
    if (typeof label !== "string") label = label.name;
    const member = this._memberMap.get(label);
    if (!member) {
      if (this._extend) return this._extend.getValue(label);
      throw new NotExistLabelError(`容器内不存在名为${label}的标识符`);
    }
    let value = member.value ?? member.getterValue;
    if (value === undefined) {
      if (member.factory) value = member.factory();
      else if (member.getter) {
        value = member.getterValue = member.getter();
        member.getter = undefined;
      }
    }
    if (value === undefined)
      throw new InvalidValueError("从容器获取的值不能是undefined");
    return value;
  }

  /* 生成并缓存一个新Member对象 */
  private _newMember(name: string, metadata?: Metadata): ContainerMember {
    const member: ContainerMember = {
      name,
      metadata,
    };
    this._memberMap.set(name, member);
    return member;
  }
}

/* 当重复调用Container.load方法时抛出 */
export class ContainerRepeatLoadError extends Error {}

/* 当依赖循环时抛出 */
export class DependencyCycleError extends Error {}

/* 当从容器获取值，如果值不合法时抛出 */
export class InvalidValueError extends Error {}

/* 当从容器访问一个不存在的标识符时抛出 */
export class NotExistLabelError extends Error {}
