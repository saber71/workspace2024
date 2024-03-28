import { NoValidationError, validate as classValidate } from "class-validator";
import { Container, Inject, NotExistLabelError } from "dependency-injection";
import { NotFoundValidatorError, ValidateFailedError } from "../errors";
import { RegularParser } from "../parser";

const parsedKey = Symbol("parsed");
const validatedKey = Symbol("validated");

/* 对输入进行转化和校验 */
export function MethodParameter(option: MethodParameterOptions) {
  let classType: any;
  const inject = Inject({
    typeValueGetter: (container) => {
      const prevValue = option.typeValueGetter(container);
      let value: any;
      if (typeof prevValue === "object") {
        if (!prevValue[parsedKey]) {
          value = parse(container, option.parsers, prevValue, classType);
          prevValue[parsedKey] = true;
        }
      } else {
        value = parse(container, option.parsers, prevValue, classType);
      }
      if (option.validator === false || typeof value !== "object") return value;
      if (!value[validatedKey]) {
        value[validatedKey] = true;
        validate(container, classType, value);
      }
      return value;
    },
    afterExecute: option.afterExecute,
  });
  return (clazz: any, methodName: any, index: number) => {
    inject(clazz, methodName, index);
    const types =
      (Reflect as any).getMetadata("design:paramtypes", clazz, methodName) ??
      [];
    classType = types[index];
  };
}

/**
 * 验证指定的数据
 * @throws NotFoundValidatorError 当找不到类型对应的验证器时抛出
 * @throws ValidateFailedError 当数据验证失败时抛出
 */
function validate(container: Container, classType: any, value: any) {
  const type = classType.name;
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
    else if (!(e instanceof NoValidationError)) throw e;
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
  clazz: any,
) {
  if (parsers === null) return value;
  if (parsers === undefined) parsers = [RegularParser];
  else if (!(parsers instanceof Array)) parsers = [parsers];
  if (typeof clazz === "object") clazz = clazz.constructor;
  return parsers.reduce(
    (value, parserClass) =>
      container.getValue<ParserInterface>(parserClass).parse(value, clazz),
    value,
  );
}
