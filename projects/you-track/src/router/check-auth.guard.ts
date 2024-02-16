import { InjectService } from "@/services";
import type { UserService } from "@/services/user.service.ts";
import { useGlobalStore } from "@/store.ts";
import LoginView from "@/views/logo-form/login.view.tsx";
import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

@RouterGuard()
export class CheckAuthGuard extends VueRouterGuard {
  @InjectService("UserService")
  readonly userService: UserService;

  async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (to.name === LoginView.name) {
      next();
      return;
    }
    const store = useGlobalStore();
    if (store.auth) next();
    else {
      if (!store.lastLoginUserId) {
        next({ name: LoginView.name });
        return;
      }
      try {
        const user = await this.userService.fetchById(store.lastLoginUserId);
        await this.userService.auth(user);
        next();
      } catch (e) {
        next({ name: LoginView.name });
      }
    }
  }
}
