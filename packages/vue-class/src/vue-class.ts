import { IoC } from "ioc";
import type { App } from "vue";
import { ModuleName } from "./constants";
import type { Class } from "./types";
import { VueDirective } from "./vue-directive";

export class VueClass {
  static getInstance<T>(clazz: Class<T>): T {
    return IoC.getInstance(clazz, ModuleName);
  }

  static async install(app: App, imports: Record<string, () => Promise<any>>) {
    await IoC.importAll(() => imports);
    VueDirective.install(app);
    IoC.load(ModuleName);
  }
}
