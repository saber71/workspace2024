import { LoadableContainer } from "dependency-injection";
import type { App } from "vue";
import type { Router } from "vue-router";
import { ModuleName, ROUTER } from "./constants";
import type { Class } from "dependency-injection";
import { VueDirective } from "./vue-directive";
import { VueRouterGuard } from "./vue-router-guard";

export class VueClass {
  static readonly dependencyInjection = new LoadableContainer();

  static getInstance<T>(clazz: Class<T>): T {
    return this.dependencyInjection.getValue(clazz);
  }

  static async install(app: App, router: Router) {
    this.dependencyInjection.load({ moduleName: ModuleName });
    this.dependencyInjection.bindValue(ROUTER, router);
    VueDirective.install(app);
    VueRouterGuard.install(router);
  }
}
