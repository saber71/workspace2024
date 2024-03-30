import { userApi } from "@/api.ts";
import { useUser } from "@/stores";
import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

@RouterGuard()
export class AuthorizedGuard extends VueRouterGuard {
  readonly whiteList: string[] = [""];
  private _isAuthenticated: boolean = false;

  async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (!this.whiteList.includes(to.name as any)) {
      if (!this._isAuthenticated) {
        const userStore = useUser();
        if (userStore.token) {
          await userApi("auth");
          this._isAuthenticated = true;
        } else {
          return next({ name: "LoginView.name" });
        }
      }
    }
    super.beforeEach(to, from, next);
  }
}
