import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

@RouterGuard()
export class TitleGuard extends VueRouterGuard {
  beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    document.title = to.meta.title as string;
    super.beforeEach(to, from, next);
  }
}
