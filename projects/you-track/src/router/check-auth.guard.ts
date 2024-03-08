import { InjectService } from "@/services";
import type { KeyValueService } from "@/services/key-value.service.ts";
import type { UserService } from "@/services/user.service.ts";
import { useGlobalStore } from "@/store.ts";
import DashboardHomeView from "@/views/dashboard.home.view.tsx";
import LoginView from "@/views/logo-form/login.view.tsx";
import RegisterUserView from "@/views/logo-form/register-user.view.tsx";
import ResetPasswordView from "@/views/logo-form/reset-password.view.tsx";
import SystemInitView from "@/views/logo-form/system-init.view.tsx";
import { RouterGuard, VueRouterGuard } from "vue-class";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

@RouterGuard()
export class CheckAuthGuard extends VueRouterGuard {
  @InjectService("UserService")
  readonly userService: UserService;

  @InjectService("KeyValueService")
  readonly keyValueService: KeyValueService;

  readonly whiteList = [
    LoginView.name,
    RegisterUserView.name,
    ResetPasswordView.name,
    SystemInitView.name,
    DashboardHomeView.name,
  ];

  async beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (this.whiteList.includes(to.name as any)) {
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
