import { validate as classValidate } from "class-validator";
import {
  Container,
  getDecoratedName,
  Inject,
  Metadata,
  NotExistLabelError,
} from "dependency-injection";
import { NotFoundValidatorError, ValidateFailedError } from "../errors";
import { RegularParser } from "../parser";

const parsedKey = Symbol("parsed");
const validatedKey = Symbol("validated");

/* 对输入进行转化和校验 */
export function ParserAndValidate(
  option: ParserAndValidator & {
    typeValueGetter: (container: Container) => any;
  },
) {
  let targetObject: any,
    targetMethodName = "",
    targetIndex = 0;
  const inject = Inject({
    typeValueGetter: (container) => {
      const prevValue = option.typeValueGetter(container);
      let value: any;
      if (typeof prevValue === "object") {
        if (!prevValue[parsedKey]) {
          value = parse(container, option.parsers, prevValue);
          prevValue[parsedKey] = true;
        }
      } else {
        value = parse(container, option.parsers, prevValue);
      }
      if (option.validator === false || typeof value !== "object") return value;
      if (!value[validatedKey]) {
        value[validatedKey] = true;
        validate(container, targetObject, targetMethodName, targetIndex, value);
      }
      return value;
    },
  });
  return (target: any, methodName?: any, index?: any) => {
    inject(target, methodName, index);
    targetObject = target;
    targetMethodName = getDecoratedName(methodName) as string;
    targetIndex = index;
  };
}

/**
 * 验证指定的数据
 * @throws NotFoundValidatorError 当找不到类型对应的验证器时抛出
 * @throws ValidateFailedError 当数据验证失败时抛出
 */
function validate(
  container: Container,
  target: any,
  methodName: string,
  argIndex: number,
  value: any,
) {
  const metadata = Metadata.getOrCreateMetadata(target);
  const parameterTypes = metadata.getMethodParameterTypes(methodName);
  const type = parameterTypes.types[argIndex];
  if (
    type === "String" ||
    type === "Boolean" ||
    type === "Number" ||
    type === "Object" ||
    type === "Function" ||
    type === "Symbol"
  )
    return;
  const errorProps: string[] = [];
  try {
    const instance = container.getValue(type) as any;
    if (typeof instance === "object")
      errorProps.push(...classValidate(Object.assign(instance, value)));
  } catch (e) {
    if (e instanceof NotExistLabelError)
      throw new NotFoundValidatorError(`找不到类型${type}对应的验证器`);
    throw e;
  }
  if (errorProps.length)
    throw new ValidateFailedError(
      errorProps.map((propName) => `${type}.${propName}校验失败。`).join("\n"),
    );
}

/* 将输入的值进行转化 */
function parse(
  container: Container,
  parsers: Class<ParserInterface> | Class<ParserInterface>[] | null | undefined,
  value: any,
) {
  if (!parsers && parsers === undefined) parsers = [RegularParser];
  if (parsers && !(parsers instanceof Array)) parsers = [parsers];
  if (!parsers) return value;
  return parsers.reduce(
    (value, parserClass) =>
      container.getValue<ParserInterface>(parserClass).parse(value),
    value,
  );
}
