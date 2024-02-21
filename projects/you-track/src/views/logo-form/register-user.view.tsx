import RegisterFormComponent, {
  type RegisterFormComponentInst,
} from "@/components/register-form.component.tsx";
import {RouterKey} from "@/constant.ts";
import {InjectService} from "@/services";
import {type CreateUserData, UserService} from "@/services/user.service.ts";
import {getErrorMessage} from "@/utils";
import type {LogoFormLayoutInst} from "@/views/logo-form.layout.tsx";
import LoginView from "@/views/logo-form/login.view.tsx";
import {Button, Checkbox} from "ant-design-vue";
import type {VNodeChild} from "vue";
import {
  Component,
  type ComponentProps,
  type VueComponentBaseProps,
  toNative,
  VueComponent,
  VueInject,
  Mut,
  BindThis,
  Link,
} from "vue-class";
import {type Router, RouterLink} from "vue-router";

@Component()
export class RegisterUserViewInst extends VueComponent {
  static readonly defineProps: ComponentProps<VueComponentBaseProps> = ["inst"];

  @VueInject("LogoFormLayoutInst")
  readonly logoFormLayoutInst: LogoFormLayoutInst;

  @VueInject(RouterKey)
  readonly router: Router;

  @InjectService("UserService")
  readonly userService: UserService;

  @Mut()
  readonly form: CreateUserData = {
    name: "",
    password: "",
    email: "",
    loginName: "",
  };

  @Mut()
  remember = true;

  @Link()
  readonly registerFormInst: RegisterFormComponentInst;

  @BindThis()
  async registerAndLogin() {
    this.logoFormLayoutInst.errorMsg = "";
    try {
      await this.registerFormInst.antdForm.validate();
      await this.userService.create(this.form, true);
      await this.userService.login({
        password: this.form.password,
        loginNameOrEmail: this.form.loginName,
        remember: this.remember,
      });
      this.router.push({path: "/"});
    } catch (e) {
      this.logoFormLayoutInst.errorMsg = getErrorMessage(e);
    }
  }

  render(): VNodeChild {
    return (
      <div>
        <RegisterFormComponent inst={"registerFormInst"} form={this.form}/>
        <Checkbox
          checked={this.remember}
          onUpdate:checked={(val) => (this.remember = val)}
        >
          记住我
        </Checkbox>
        <Button
          block
          type={"primary"}
          class={"mt-2"}
          onClick={this.registerAndLogin}
        >
          注册并登录
        </Button>
        <Button type={"link"} block>
          <RouterLink to={{name: LoginView.name}}>已有账号</RouterLink>
        </Button>
      </div>
    );
  }
}

export default toNative<VueComponentBaseProps>(RegisterUserViewInst);

export const Meta = {
  title: "注册用户",
};
