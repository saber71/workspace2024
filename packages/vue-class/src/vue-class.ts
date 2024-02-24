import { IoC } from "ioc";
import type { App } from "vue";
import type { Router } from "vue-router";
import { ModuleName } from "./constants";
import type { Class } from "./types";
import { VueDirective } from "./vue-directive";
import { VueRouterGuard } from "./vue-router-guard";

export class VueClass {
  static getInstance<T>(clazz: Class<T>): T {
    return IoC.getInstance(clazz, ModuleName);
  }

  static async install(
    app: App,
    router: Router,
    imports: Record<string, () => Promise<any>> | any,
  ) {
    await IoC.importAll(() => imports);
    IoC.load(ModuleName);
    VueDirective.install(app);
    VueRouterGuard.install(router);
  }

  static bindConstantValue(label: string, value: any) {
    IoC.getContainer(ModuleName).bind(label).toConstantValue(value);
    return this;
  }
}
