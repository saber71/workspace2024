import { userApi } from "@/api.ts";
import { useUser } from "@/stores";
import LoginView from "@/views/login.view.tsx";
import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const whiteList = [LoginView.name];

@RouterGuard({ matchTo: (path) => !whiteList.includes(path.name as string) })
export class AuthorizedGuard extends VueRouterGuard {
  private _isAuthenticated: boolean = false;

  async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (!this._isAuthenticated) {
      const userStore = useUser();
      if (userStore.info._id) {
        await userApi("auth");
        this._isAuthenticated = true;
      } else {
        return next({ name: LoginView.name });
      }
    }
    super.beforeEach(to, from, next);
  }
}
