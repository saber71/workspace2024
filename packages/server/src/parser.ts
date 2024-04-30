import { getOrCreateMetadataUserData } from "./common";
import { Parser } from "./decorators";
import { ParseFailedError } from "./errors";
import { type Class } from "dependency-injection";
import type { ParserInterface } from "./types";

@Parser()
export class RegularParser implements ParserInterface {
  parse(value: any, ...clazz: Array<Class | undefined | null>): any {
    if (clazz[0]) return parseType.call(this, value);
    if (typeof value === "object" && value) parsePropsType.call(this, value);
    return value;

    function parsePropsType(this: RegularParser, object: any) {
      const propParseToType = clazz[0]
        ? getOrCreateMetadataUserData(clazz[0]).__server__propParseToType
        : {};
      for (let prop in object) {
        const val = object[prop];
        const toClass = propParseToType[prop] ?? [];
        object[prop] = this.parse(val, ...toClass);
      }
    }

    function parseType(this: RegularParser, value: any): any {
      try {
        if (clazz[0] === String) return String(value);
        else if (clazz[0] === Boolean) return Boolean(value);
        else if (clazz[0] === Object) {
          const data = toObject(value);
          if (clazz[1]) {
            Object.entries(data).forEach(([key, value]) => {
              data[key] = this.parse(value, clazz[1]);
            });
          }
          return data;
        } else if (clazz[0] === Number) {
          const number = Number(value);
          if (!Number.isNaN(number)) return number;
        } else if (clazz[0] === Date) {
          if (value) {
            const date = new Date(value);
            if (date.toString() !== "Invalid Date") return date;
          }
        } else if (clazz[0] === Array || clazz[0] === Set) {
          const data = toObject(value);
          if (data instanceof Array) {
            if (clazz[1]) {
              for (let i = 0; i < data.length; i++) {
                data[i] = this.parse(data[i], clazz[i + 1] ?? clazz[1]);
              }
            }
            return clazz[0] === Set ? new Set(data) : data;
          }
        } else if (clazz[0] === Map) {
          const data = toObject(value);
          const map = new Map();
          if (data instanceof Array) {
            for (let item of data) {
              map.set(
                item[0],
                clazz[1] ? this.parse(item[1], clazz[1]) : item[1],
              );
            }
          } else {
            for (let key in data) {
              map.set(
                key,
                clazz[1] ? this.parse(data[key], clazz[1]) : data[key],
              );
            }
          }
          return map;
        } else if (clazz[0] === RegExp) return new RegExp(value);
        else {
          const data = toObject(value);
          parsePropsType.call(this, data);
          return data;
        }
      } catch (e) {
        throw new ParseFailedError(
          `${value}不能被转为${clazz[0]?.name}\n` + (e as Error).message,
        );
      }
      throw new ParseFailedError(`${value}不能被转为${clazz[0]?.name}`);
    }

    function toObject(data: any) {
      return typeof data === "string" ? JSON.parse(data) : data;
    }
  }
}
