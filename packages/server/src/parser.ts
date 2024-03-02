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
      if (value.length === 0) return "";
      const number = Number(value);
      if (!Number.isNaN(number)) return number;
      const date = new Date(value);
      if (date.toString() !== "Invalid Date") return date;
      return value;
    }
  }
}
