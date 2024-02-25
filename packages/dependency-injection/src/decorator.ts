import { Metadata } from "./metadata";

/* 透过装饰器第二个参数获取被装饰者名字 */
export function getDecoratedName(ctx?: string | ClassMemberDecoratorContext) {
  if (typeof ctx === "string") return ctx;
  return ctx?.name ?? "";
}

/**
 * 类装饰器
 * @param option.paramtypes 可选。指定部分或全部构造函数入参的类型，就好像是使用装饰器Inject去装饰参数。装饰器Inject优先级更高。key为入参的序号，value为入参类型
 * @param option.moduleName 可选。指定类所属的模块名
 * @param option.singleton 可选。指定类是否是单例的
 * @param option.createImmediately 可选。类是否立即实例化
 */
export function Injectable(option?: {
  paramtypes?: Record<number, string>;
  moduleName?: string;
  singleton?: boolean;
  createImmediately?: boolean;
}) {
  return (clazz: Class, ctx?: any) => {
    const paramtypes = option?.paramtypes;
    const metadata = Metadata.getOrCreateMetadata(clazz);
    metadata.injectable = true;
    metadata.moduleName = option?.moduleName;
    metadata.singleton = option?.singleton;
    metadata.createImmediately = option?.createImmediately;
    if (paramtypes) {
      for (let index in paramtypes) {
        const i = Number(index);
        if (metadata.constructorParameterTypes[i]) continue;
        metadata.constructorParameterTypes[i] = paramtypes[index];
      }
    }
    const types = Reflect.getMetadata("design:paramtypes", clazz) ?? [];
    for (let i = 0; i < types.length; i++) {
      if (metadata.constructorParameterTypes[i]) continue;
      metadata.constructorParameterTypes[i] = types[i].name;
    }
  };
}

/**
 * 构造函数参数装饰器、字段装饰器
 * @param typeLabel 指定这个字段/参数的类型
 * @throws InjectNotFoundTypeError 在无法确定被装饰者的类型时抛出
 */
export function Inject(typeLabel?: string) {
  return (
    clazz: any,
    propName: ClassFieldDecoratorContext | any,
    index?: number,
  ) => {
    propName = getDecoratedName(propName);
    if (typeof index === "number") {
      /* 构造函数的参数装饰器 */
      const metadata = Metadata.getOrCreateMetadata(clazz);
      if (typeLabel) metadata.constructorParameterTypes[index] = typeLabel;
    } else {
      /* 字段装饰器 */
      const type =
        typeLabel || Reflect.getMetadata("design:type", clazz, propName)?.name;
      if (!type)
        throw new InjectNotFoundTypeError(
          "无法通过元数据获取字段类型，必须指定类型",
        );
      const metadata = Metadata.getOrCreateMetadata(clazz);
      metadata.fieldTypes[propName] = type;
    }
  };
}

/* 在装饰器Inject无法确定类型时抛出 */
export class InjectNotFoundTypeError extends Error {}
