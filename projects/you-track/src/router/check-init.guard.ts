import { InjectService } from "@/services";
import type { KeyValueService } from "@/services/key-value.service.ts";
import SystemInitView from "@/views/logo-form/system-init.view.tsx";
import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

@RouterGuard()
export class CheckInitGuard extends VueRouterGuard {
  @InjectService("KeyValueService")
  readonly keyValueService: KeyValueService;

  async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (to.name === SystemInitView.name) {
      next();
      return;
    }
    const isInitialed = await this.keyValueService.getValue("SystemInit");
    if (!isInitialed) next({ name: SystemInitView.name });
    else if (to.name === SystemInitView.name) next({ path: "/" });
    else next();
  }
}
