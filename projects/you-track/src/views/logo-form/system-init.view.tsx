import RegisterFormComponent, {
  type RegisterFormInst,
} from "@/components/register-form.component.tsx";
import { RouterKey } from "@/constant.ts";
import { InjectService } from "@/services";
import type { KeyValueService } from "@/services/key-value.service.ts";
import type { CreateUserData, UserService } from "@/services/user.service.ts";
import { LogoFormLayoutInst } from "@/views/logo-form.layout.tsx";
import LoginView from "@/views/logo-form/login.view.tsx";
import { Button, Checkbox } from "ant-design-vue";
import { IoC } from "ioc";
import { v4 } from "uuid";
import { type HTMLAttributes, inject, type VNodeChild } from "vue";
import {
  BindThis,
  Component,
  type ComponentProps,
  Mut,
  toNative,
  VueComponent,
  VueInject,
} from "vue-class";
import type { Router } from "vue-router";

export interface SystemInitViewProps extends Partial<HTMLAttributes> {}

@Component()
class SystemInit extends VueComponent<SystemInitViewProps> {
  static readonly defineProps: ComponentProps<SystemInitViewProps> = [];

  @VueInject(RouterKey)
  readonly router: Router;

  @InjectService("KeyValueService")
  readonly keyValueService: KeyValueService;

  @InjectService("UserService")
  readonly userService: UserService;

  @Mut()
  errMsg: string = "";

  @Mut()
  createAdminForm: CreateUserData = {
    name: "管理员",
    loginName: "admin",
    password: "",
    email: "admin@youtrack.com",
  };

  @Mut()
  enableGuest: boolean = false;

  registerFormInst: RegisterFormInst;

  logoFormLayoutInst: LogoFormLayoutInst;

  [IoC.Initializer]() {
    this.logoFormLayoutInst = inject(LogoFormLayoutInst.key)!;
  }

  @BindThis()
  initAndGotoHome() {
    this.registerFormInst.antdForm.validate().then(async () => {
      const adminID = v4(),
        guestID = v4();
      await Promise.all([
        this.userService.create({
          loginName: "guest",
          name: "游客",
          email: "guest@youtrack.com",
          password: v4(),
          id: guestID,
        }),
        this.userService.create({
          loginName: this.createAdminForm.loginName,
          name: this.createAdminForm.name,
          email: this.createAdminForm.email,
          password: this.createAdminForm.password,
          id: adminID,
        }),
      ]);
      await this.userService.indexedRepository.user.save();
      await Promise.all([
        this.keyValueService.setValue("EnableGuest", this.enableGuest),
        this.keyValueService.setValue("AdminID", adminID),
        this.keyValueService.setValue("GuestID", guestID),
      ]);
      await this.keyValueService.setValue("SystemInit", true, true);
      this.router.push({ name: LoginView.name });
    });
  }

  render(): VNodeChild {
    return (
      <div>
        <RegisterFormComponent
          form={this.createAdminForm}
          inst={(val) => (this.registerFormInst = val)}
          prefix={"管理员"}
        />
        <Checkbox
          class={"mb-2"}
          checked={this.enableGuest}
          onUpdate:checked={(val) => (this.enableGuest = val)}
        >
          是否允许游客登陆
        </Checkbox>
        <Button type={"primary"} block onClick={this.initAndGotoHome}>
          初始化
        </Button>
      </div>
    );
  }
}

export default toNative<SystemInitViewProps>(SystemInit);

export const Meta = {
  title: "系统初始化",
};
