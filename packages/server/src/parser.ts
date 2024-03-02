import { Container } from "dependency-injection";
import { Parser } from "./decorators";

/* 递归的将值转为number或boolean或Date对象 */
@Parser()
export class RegularParser implements ParserInterface {
  parse(value: any): any {
    if (typeof value === "string") return parseString(value);
    if (typeof value === "object" && value) {
      for (let prop in value) {
        const val = value[prop];
        value[prop] = this.parse(val);
      }
    }
    return value;

    function parseString(value: string): any {
      if (value === "true") return true;
      else if (value === "false") return false;
      const number = Number(value);
      if (!Number.isNaN(number)) return number;
      const date = new Date(value);
      if (date.toString() !== "Invalid Date") return date;
      return value;
    }
  }
}

/* 将输入的值进行转化 */
export function parse(
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
