import { IoC } from "ioc";
import { IoCModuleName } from "./constants";
import type { Class } from "./types";

export class VueService {
  static getInstance<T>(clazz: Class<T>): T {
    return IoC.getInstance(clazz, IoCModuleName);
  }
}
