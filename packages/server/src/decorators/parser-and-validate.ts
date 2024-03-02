import { Container, getDecoratedName, Inject } from "dependency-injection";
import { validate } from "../common";
import { parse } from "../parser";

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
      const value = parse(
        container,
        option.parsers,
        option.typeValueGetter(container),
      );
      if (option.validator === false) return value;
      // validate(container, targetObject, targetMethodName, targetIndex, value);
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
