import { Metadata } from "./metadata";

/* 用来管理需要进行依赖注入的实例的容器。这个类专门进行内容的管理 */
export class Container {
  /* 缓存容器中的内容，名字映射Member对象 */
  protected readonly _memberMap = new Map<string, ContainerMember>();

  /* 父容器。在当前容器中找不到值时，会尝试在父容器中寻找 */
  private _extend?: Container;

  /* 设置要继承的父容器。当从容器中找不到值时，会尝试在父容器中寻找 */
  extend(parent?: Container) {
    this._extend = parent;
    return this;
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
  bindFactory(label: string, value: (...args: any[]) => any) {
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

  /* 解绑所有标识符 */
  unbindAll() {
    this._memberMap.clear();
  }

  /* 释放资源 */
  dispose() {
    this.unbindAll();
    this.extend(undefined);
  }

  /**
   * 获取指定标识符的值
   * @param label 要获取值的标识符
   * @param args 生成值所需的参数
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
   */
  getValue<T>(label: string | Class<T>, ...args: any[]): T {
    if (typeof label !== "string") label = label.name;
    const member = this._memberMap.get(label);
    if (!member) {
      if (this._extend) return this._extend.getValue(label, ...args);
      throw new NotExistLabelError(`容器内不存在名为${label}的标识符`);
    }
    let value = member.value;
    if (value === undefined) {
      if (member.factory) value = member.factory(...args);
      else {
        value = member.getterValue;
        if (value === undefined && member.getter) {
          value = member.getterValue = member.getter();
          member.getter = undefined;
        }
      }
    }
    if (value === undefined)
      throw new InvalidValueError("从容器获取的值不能是undefined");
    return value;
  }

  /* 生成并缓存一个新Member对象 */
  protected _newMember(name: string, metadata?: Metadata): ContainerMember {
    const member: ContainerMember = {
      name,
      metadata,
    };
    this._memberMap.set(name, member);
    return member;
  }
}

/**
 * 负责实现依赖注入的核心功能，包括得到依赖关系、生成实例、向实例注入依赖
 * @throws DependencyCycleError 当依赖循环时抛出
 */
export class LoadableContainer extends Container {
  /* 标识是否调用过load方法 */
  private _loaded = false;

  /**
   * 加载所有已被装饰器Injectable装饰的类且所属于指定的模块
   * @throws ContainerRepeatLoadError 当重复调用Container.load方法时抛出
   */
  load(option: LoadOption = {}) {
    if (this._loaded)
      throw new ContainerRepeatLoadError(
        "Container.load方法已被调用过，不能重复调用",
      );
    this._loaded = true;
    const metadataArray = Array.from(Metadata.getAllMetadata());
    this.loadFromMetadata(metadataArray, option);
  }

  /* 从元数据中加载内容进容器中 */
  loadFromMetadata(metadataArray: Metadata[], option: LoadOption = {}) {
    const { overrideParent = true, moduleName } = option;
    metadataArray = metadataArray.filter(
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
            ...metadata.methodNameMapParameterTypes.constructor,
          );
          for (let propName in fieldTypes) {
            instance[propName] = this._getFieldValue(fieldTypes[propName]);
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

  /* 将提供的类绑定进容器内 */
  loadFromClass(clazz: Class[], option: LoadOption = {}) {
    this.loadFromMetadata(
      clazz.map((c) => Metadata.getOrCreateMetadata(c)),
      option,
    );
  }

  /* 获取方法的入参 */
  private _getMethodParameters(parameters?: MethodParameterTypes) {
    if (!parameters) return [];
    return parameters.types.map(
      (type, index) => parameters.getters[index]?.(this) ?? this.getValue(type),
    );
  }

  /* 获取字段的值 */
  private _getFieldValue(fieldType: FieldType) {
    if (!fieldType.getter && !fieldType.type)
      throw new Error("无法通过元数据获取字段类型，必须指定类型");
    return fieldType.getter?.(this) ?? this.getValue(fieldType.type!);
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
