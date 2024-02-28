import { Metadata } from "./metadata";

/* 透过装饰器第二个参数获取被装饰者名字 */
export function getDecoratedName(ctx?: string | ClassMemberDecoratorContext) {
  if (typeof ctx === "string") return ctx;
  return ctx?.name ?? "";
}

/* 填充方法指定的入参类型和自定义getter函数 */
export function fillInMethodParameterTypes(
  parameterTypes: MethodParameterTypes,
  option?: MethodParameterOption,
  types?: Function[],
) {
  if (!option?.paramtypes && !option?.paramGetters && !types)
    throw new InjectNotFoundTypeError(
      "无法通过元数据获取方法入参类型，必须指定类型",
    );
  if (option) {
    if (option.paramtypes) {
      for (let index in option.paramtypes) {
        const i = Number(index);
        if (parameterTypes.types[i]) continue;
        parameterTypes.types[i] = option.paramtypes[index];
      }
    }
    if (option.paramGetters) {
      for (let index in option.paramGetters) {
        if (option.paramGetters[index]) continue;
        parameterTypes.getters[index] = option.paramGetters[index];
      }
    }
  }
  if (types) {
    for (let i = 0; i < types.length; i++) {
      if (parameterTypes.types[i]) continue;
      parameterTypes.types[i] = types[i].name;
    }
  }
}

/**
 * 类装饰器
 * @param option.moduleName 可选。指定类所属的模块名
 * @param option.singleton 可选。指定类是否是单例的
 * @param option.createImmediately 可选。类是否立即实例化
 */
export function Injectable(
  option?: {
    moduleName?: string;
    singleton?: boolean;
    createImmediately?: boolean;
  } & MethodParameterOption,
) {
  return (clazz: Class, ctx?: any) => {
    const metadata = Metadata.getOrCreateMetadata(clazz);
    metadata.injectable = true;
    metadata.moduleName = option?.moduleName;
    metadata.singleton = option?.singleton;
    metadata.createImmediately = option?.createImmediately;
    const parameterTypes = metadata.getMethodParameterTypes();
    fillInMethodParameterTypes(
      parameterTypes,
      option,
      Reflect.getMetadata("design:paramtypes", clazz) ?? [],
    );
  };
}

/**
 * 参数装饰器、属性装饰器，方法装饰器
 * @param option.typeLabel 指定被装饰的字段或入参的类型。当被装饰的是类的字段或入参时才生效
 * @param option.typeValueGetter 指定被装饰的字段或入参的自定义getter。当被装饰的是类的字段或入参时才生效
 * @throws InjectNotFoundTypeError 在无法确定被装饰者的类型时抛出
 */
export function Inject(
  option?: {
    typeLabel?: string;
    typeValueGetter?: TypeValueGetter;
  } & MethodParameterOption,
) {
  return (
    clazz: any,
    propName: ClassFieldDecoratorContext | any,
    index?: any,
  ) => {
    propName = getDecoratedName(propName) || "constructor";
    const typeLabel = option?.typeLabel;
    const typeValueGetter = option?.typeValueGetter;
    if (typeof index === "number") {
      /* 构造函数或方法的参数装饰器 */
      const metadata = Metadata.getOrCreateMetadata(clazz);
      const methodParameterTypes = metadata.getMethodParameterTypes(propName);
      if (typeLabel) methodParameterTypes.types[index] = typeLabel;
      if (typeValueGetter)
        methodParameterTypes.getters[index] = typeValueGetter;
    } else {
      /* 属性或方法装饰器 */
      const metadata = Metadata.getOrCreateMetadata(clazz);
      const types = Reflect.getMetadata("design:paramtypes", clazz, propName);
      if (types) {
        /* 方法装饰器 */
        const methodParameterTypes = metadata.getMethodParameterTypes(propName);
        fillInMethodParameterTypes(methodParameterTypes, option, types);
      } else {
        /* 属性装饰器 */
        const type =
          typeLabel ||
          Reflect.getMetadata("design:type", clazz, propName)?.name;
        if (!type && !typeValueGetter)
          throw new InjectNotFoundTypeError(
            "无法通过元数据获取字段类型，必须指定类型",
          );
        metadata.fieldTypes[propName] = { type, getter: typeValueGetter };
      }
    }
  };
}

/* 在装饰器Inject无法确定被装饰者类型时抛出 */
export class InjectNotFoundTypeError extends Error {}
