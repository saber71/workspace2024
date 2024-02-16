import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

@RouterGuard()
export class SetTitleGuard extends VueRouterGuard {
  beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (to.meta.title) document.title = to.meta.title + " - YouTrack";
    else document.title = "YouTrack";
    super.beforeEach(to, from, next);
  }
}
