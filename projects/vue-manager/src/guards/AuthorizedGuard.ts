import { userApi } from "@/api.ts";
import { useUser } from "@/stores";
import LoginView from "@/views/login.view.tsx";
import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const whiteList = [LoginView.name];

@RouterGuard({ matchTo: (path) => !whiteList.includes(path.name as string) })
export class AuthorizedGuard extends VueRouterGuard {
  async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    const userStore = useUser();
    if (!userStore.isAuth) {
      if (userStore.info._id) {
        await userApi("auth");
        userStore.isAuth = true;
      } else {
        return next({ name: LoginView.name });
      }
    }
    super.beforeEach(to, from, next);
  }
}
